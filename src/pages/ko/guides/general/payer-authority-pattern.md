---
title: 지불자-권한 패턴
metaTitle: 지불자-권한 패턴 | Metaplex Guides
description: 별도의 권한자와 지불자를 사용하는 Solana 명령어의 일반적인 프로그래밍 패턴입니다.
# remember to update dates also in /components/guides/index.js
created: '12-30-2024'
updated: null
---

## P-A 패턴 개요

지불자-권한(P-A) 패턴은 저장소나 임대료를 지불하는 당사자(지불자)가 계정을 소유하거나 제어하는 당사자(권한자)와 다를 수 있는 시나리오에서 Solana 프로그램 명령어를 구조화하는 일반적인 접근 방식입니다. 이는 최대 조합성을 위한 프로토콜을 설계할 때 강력한 기본 동작 역할을 하며, Metaplex Program Library의 주요 구성 요소입니다.

이러한 역할을 분리함으로써 프로그램은 더 유연한 자금 조달 메커니즘(하나 이상의 지불자)과 더 명확한 소유권 또는 제어 의미론을 수용할 수 있습니다. 예를 들어, 게임에서 사용자가 계정 초기화 비용을 지불하도록 하되, 후속 작업에 대해서는 프로그램이나 PDA가 권한 역할을 하도록 할 수 있습니다.

## 두 개의 다른 서명자가 필요한 이유

1. **다른 책임**:
   책임을 분할하면 한 서명자는 계정 생성이나 임대료를 지불하고, 다른 서명자는 실제로 그 계정을 관리하거나 소유할 수 있습니다. 이는 특히 크거나 복잡한 프로그램에서 중요한 관심사의 깔끔한 분리입니다.

2. **유연성**:
   때때로 트랜잭션에 자금을 제공하는 당사자가 궁극적으로 계정을 제어할 당사자와 같지 않습니다. 두 역할을 설정함으로써 후원자가 온체인 저장소 비용을 지불하지만 최종 사용자가 자산의 자율성과 소유권을 유지하는 패턴을 쉽게 수용할 수 있습니다.

3. **PDA 서명자**:
   프로그램 파생 주소(PDA)는 일반 키페어와 같은 방식으로 트랜잭션에 서명할 수 있는 개인 키를 보유하지 않으므로, 모든 상호작용은 프로그램을 호출하여 관리되어야 합니다. PDA는 계정의 권한이 될 수 있지만, 복잡한 자금 이동 없이는 임대료나 수수료를 직접 지불하는 데 사용할 수 없습니다. PDA를 대신하여 임대료나 소규모 저장소 조정을 담당하는 별도의 지불자 계정을 두면 사소한 변경에 대한 비용을 지불하기 위해 PDA로 자금을 보내는 복잡성을 피할 수 있습니다.

## Rust 예시

다음은 Shank와 Anchor 모두에서 P-A 패턴을 구현하는 방법의 예시입니다. 또한 이러한 서명자 조건을 검증하는 방법과 이 패턴과 함께 작동하는 클라이언트를 구축하는 방법에 대해서도 논의합니다.

{% dialect-switcher title="Rust에서의 지불자-권한 패턴" %}
{% dialect title="Shank" id="shank" %}
{% totem %}

```rust
    /// 새 계정을 생성합니다.
    #[account(0, writable, signer, name="account", desc = "새 계정의 주소")]
    #[account(1, writable, signer, name="payer", desc = "저장소 수수료를 지불하는 계정")]
    #[account(2, optional, signer, name="authority", desc = "계정 생성에 서명하는 권한")]
    #[account(3, name="system_program", desc = "시스템 프로그램")]
    CreateAccountV1(CreateAccountV1Args),
```

{% /totem %}
{% /dialect %}

{% dialect title="Anchor" id="anchor" %}
{% totem %}

```rust
    /// 새 계정을 생성합니다.
    #[derive(Accounts)]
    pub struct CreateAccount<'info> {
        /// 새 계정의 주소
        #[account(init, payer = payer, space = 8 + NewAccount::MAXIMUM_SIZE)]
        pub account: Account<'info, NewAccount>,

        /// 저장소 수수료를 지불하는 계정
        #[account(mut)]
        pub payer: Signer<'info>,

        /// 계정 생성에 서명하는 권한
        pub authority: Option<Signer<'info>>,

        // 시스템 프로그램
        pub system_program: Program<'info, System>
    }
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 제약 조건 확인

네이티브 Solana 코드에서는 각 명령어에 대해 올바른 서명자가 있는지 확인해야 합니다. 이는 일반적으로 다음을 의미합니다:

```rust
    // 지불자가 트랜잭션에 서명했고 저장소 수수료 지불에 동의했는지 확인합니다.
    assert_signer(ctx.accounts.payer)?;

    // 권한이 있으면 서명자인지 확인합니다. 그렇지 않으면
    // 지불자를 트랜잭션을 승인하는 당사자로 취급합니다.
    let authority = match ctx.accounts.authority {
        Some(authority) => {
            assert_signer(authority)?;
            authority
        }
        None => ctx.accounts.payer,
    };
```

### 핵심 포인트

* `assert_signer`는 제공된 계정 키가 트랜잭션에 서명했는지 확인합니다.

* 폴백 로직을 설정합니다: 권한이 제공되지 않으면 지불자를 권한으로 취급합니다.
이는 효과적으로 P-A 패턴의 본질을 포착합니다: 별도의 선택적 권한이 계정 생성이나 수정을 관리할 수 있지만, 권한이 제공되지 않으면 지불자가 기본적으로 그 역할을 맡습니다.

## 클라이언트의 모습

클라이언트 측에서는 지불자와 권한(선택적으로)을 모두 트랜잭션에 전달해야 합니다. 다음은 CreateAccountV1 명령어에 대해 이러한 계정이 어떻게 구조화될 수 있는지 보여주는 Umi를 사용한 예시입니다.

{% dialect-switcher title="지불자-권한 패턴 클라이언트" %}
{% dialect title="Umi" id="umi" %}
{% totem %}

```ts
    // 계정들.
    export type CreateAccountV1InstructionAccounts = {
        /** 새 계정의 주소 */
        account: Signer;
        /** 저장소 수수료를 지불하는 계정 */
        payer: Signer;
        /** 새 자산의 권한 */
        authority?: Signer | Pda;
        /** 시스템 프로그램 */
        systemProgram?: PublicKey | Pda;
    };
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 요약

지불자-권한 패턴은 계정의 자금 제공자(지불자)가 계정의 소유자나 관리자(권한)와 다른 상황을 처리하는 우아한 방법입니다. 별도의 서명자를 요구하고 온체인 로직에서 이들을 검증함으로써 프로그램에서 명확하고 견고하며 유연한 소유권 의미론을 유지할 수 있습니다. Rust(Shank 및 Anchor)의 샘플 코드와 Umi 클라이언트 예시는 이 패턴을 끝에서 끝까지 구현하는 방법을 보여줍니다.

계정 권한이 계정 생성이나 트랜잭션 수수료를 지불하는 엔티티와 다를 수 있는 특수한 상황이 예상되거나, 사용자가 프로그램에 CPI할 것으로 예상되는 상황에서 이 패턴을 사용하세요. 이렇게 하면 핵심 프로그램 로직을 복잡하게 만들지 않고도 더 정교한 시나리오를 쉽게 처리할 수 있습니다.