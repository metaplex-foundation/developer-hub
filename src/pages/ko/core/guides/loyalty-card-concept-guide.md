---
title: 로열티 카드 컨셉 가이드
metaTitle: 로열티 카드 컨셉 가이드 | Core 가이드
description: 이 가이드는 MPL Core NFT 자산과 MPL Core 플러그인 시스템을 사용하여 Solana에서 로열티 카드 프로그램을 구축하는 방법을 설명합니다.
---

## 컨셉 가이드: Metaplex Core와 플러그인으로 로열티 카드 설정하기

{% callout %}

⚠️ 이것은 **컨셉 가이드**이며 완전한 엔드투엔드 튜토리얼이 아닙니다. Rust와 Solana, 특히 Anchor 프레임워크를 사용하는 개발자를 위한 것입니다. 주요 아키텍처 결정과 코드 예제를 안내하지만 프로그램 구조, CPI, Solana 스마트 컨트랙트 배포에 대한 지식이 있다고 가정합니다.

{% /callout %}
>

이 가이드는 Anchor를 사용한 Solana와 Rust에 대한 기본 지식이 있다고 가정합니다. Metaplex Core로 구동되는 Solana의 Core NFT 자산을 사용하여 로열티 카드 시스템을 구현하는 한 가지 방법을 탐구합니다. 경직된 접근 방식을 규정하기보다는, 자신의 프로젝트에 적응시킬 수 있는 유연한 패턴을 보여주는 것을 목표로 합니다.

### Metaplex Core란 무엇인가?
Metaplex Core는 플러그인 기반 아키텍처를 제공하는 Solana의 현대적인 NFT 자산 표준입니다. 레거시 Token Metadata 프로그램과 달리 Core는 개발자가 사용자 정의 데이터 저장, 소유권 제어, 규칙 시행과 같은 모듈식 기능을 NFT에 연결할 수 있게 해줍니다.

이 예제에서는 Metaplex Core의 세 가지 구성 요소를 사용합니다:
- **AppData 플러그인**: 사용자 정의 구조화된 데이터(로열티 포인트 등)를 저장하기 위해.
- **Freeze Delegate 플러그인**: NFT를 잠가서 사용자가 전송하거나 소각할 수 없게 하기 위해(소울바운드 동작).
- **Update Delegate Authority (PDA를 통해)**: 특정 컬렉션 하에서 민팅된 자식 NFT를 업데이트할 수 있는 권한을 프로그램에 부여하기 위해.
또한 **CPI builders**(예: `CreateV2CpiBuilder`)를 사용하여 Metaplex Core 프로그램과 상호 작용합니다. 이러한 빌더는 인스트럭션 구성 및 호출 방법을 단순화하여 코드를 더 읽기 쉽고 유지보수하기 쉽게 만듭니다.

### 빠른 라이프사이클 개요
```
[사용자] → 로열티 카드 요청
    ↓
[프로그램] → NFT + AppData + FreezeDelegate (소울바운드) 민팅
    ↓
[사용자] → 커피 구매 또는 포인트 리딤
    ↓
[프로그램] → AppData 플러그인의 로열티 데이터 업데이트
```

더 많은 설정 세부사항은 [Metaplex Core 문서](https://developers.metaplex.com/core)를 참조하세요.

---

## 로열티 시스템 아키텍처

이 예제는 Solana 블록체인에서 Metaplex Core를 사용하여 로열티 카드 시스템을 생성하기 위한 하나의 잠재적 구조를 개략적으로 설명합니다. 로열티 카드는 NFT이며, 각각은 동작 방식과 데이터 저장을 관리하는 플러그인과 연결됩니다.

### 왜 소울바운드 NFT 자산을 사용하는가?

로열티 카드를 소울바운드로 만드는 것은 단일 사용자에게 연결되고 전송되거나 판매될 수 없도록 보장하는 데 도움이 됩니다. 이는 로열티 프로그램의 무결성을 보존하고 사용자가 보상을 거래하거나 복제하여 시스템을 조작하는 것을 방지하는 데 도움이 될 수 있습니다.

### LoyaltyCardData 구조

각 로열티 카드는 구매하거나 리딤한 커피의 수와 같은 사용자별 데이터를 추적해야 합니다. Core NFT는 가볍고 확장 가능하도록 설계되었으므로 AppData 플러그인을 사용하여 이 구조화된 로열티 데이터를 NFT에 바이너리 형식으로 직접 저장합니다.

이 플러그인은 NFT에 연결되며 민팅 중에 설정된 권한(이 경우 로열티 카드당 파생된 PDA, 아래 설명)에 의해서만 쓸 수 있습니다. Solana 프로그램은 스탬프가 획득되거나 리딤될 때마다 이 플러그인에 쓸 것입니다.

저장할 수 있는 데이터 구조의 한 예입니다:

```rust
pub struct LoyaltyCardData {
    pub current_stamps: u8,
    pub lifetime_stamps: u64,
    pub last_used: u64,
    pub issue_date: u64,
}

impl LoyaltyCardData {
    pub fn new_card() -> Self {
        let timestamp = clock::Clock::get().unwrap().unix_timestamp as u64;
        LoyaltyCardData {
            current_stamps: 0,
            lifetime_stamps: 0,
            last_used: 0,
            issue_date: timestamp,
        }
    }
}
```

이 구조는 사용자가 가진 스탬프 수, 전체적으로 얻은 스탬프 수, 카드가 발급되거나 마지막으로 사용된 시점을 추적합니다. 다른 보상 로직에 맞게 이 구조를 사용자 정의할 수 있습니다.

### PDA 컬렉션 Delegate

PDA(Program Derived Addresses)가 처음이라면, 시드 세트와 프로그램 ID를 사용하여 생성되는 결정론적이고 프로그램이 소유하는 주소로 생각하면 됩니다. 이러한 주소는 개인 키로 제어되지 않고 대신 `invoke_signed`를 사용하여 프로그램 자체에서만 서명할 수 있습니다. 이는 프로그램 로직에서 권한이나 역할을 할당하는 데 이상적입니다.

이 경우 **컬렉션 delegate**는 시드 `[b"collection_delegate"]`를 사용하여 생성되는 PDA입니다. 프로그램이 로열티 카드 컬렉션의 모든 NFT를 관리하는 데 사용하는 신뢰할 수 있는 권한 역할을 합니다. 이 권한은 예를 들어 플러그인 데이터(스탬프 등)를 업데이트하거나 NFT를 동결/해동하는 데 필요합니다.

이 접근 방식은 외부 지갑이 아닌 프로그램만이 로열티 카드 데이터를 업데이트할 수 있도록 보장하는 데 도움이 됩니다.

컬렉션 Delegate는 프로그램에 컬렉션의 모든 자산을 업데이트할 수 있는 권한을 부여하는 Program Derived Address(PDA)입니다. 시드 `[b"collection_delegate"]`를 사용하여 이 PDA를 생성할 수 있습니다. 컬렉션 레벨 권한을 관리하는 다른 방법이 있지만 이것은 일반적으로 사용되는 패턴 중 하나입니다.

```rust
// PDA를 생성하는 데 사용되는 시드
let seeds = &[b"collection_delegate"];
let (collection_delegate, bump) = Pubkey::find_program_address(seeds, &program_id);

```

### 로열티 Authority PDA (카드별 권한)
컬렉션 delegate 외에도 이 패턴은 각 로열티 카드에 대해 고유한 PDA를 플러그인 권한으로 사용합니다. 이 PDA는 카드의 공개 키를 시드로 사용하여 파생됩니다:

```rust
// 각 개별 로열티 카드 NFT를 기반으로 PDA를 파생하는 데 사용되는 시드
let seeds = &[loyalty_card.key().as_ref()];
let (loyalty_authority, bump) = Pubkey::find_program_address(seeds, &program_id);

```

이 PDA는 민팅 중에 AppData 및 FreezeDelegate 플러그인의 권한으로 설정됩니다. 올바른 시드와 함께 invoke_signed를 사용하는 프로그램만이 해당 특정 카드의 데이터를 수정하거나 동결 상태를 관리할 수 있도록 보장합니다.

카드별 권한을 사용하는 것은 단일 중앙화된 권한 하에서 모든 NFT를 관리하는 것보다 세분화된 자산별 제어를 원할 때 특히 유용합니다.

### 1단계: 로열티 카드 컬렉션 생성

이 단계는 Metaplex JS SDK나 CLI와 같은 도구를 사용하여 오프체인에서 처리할 수 있습니다. 로열티 프로그램을 나타내는 컬렉션 NFT(예: "Sol Coffee Loyalty Cards")를 생성할 수 있습니다. 이 컬렉션은 개별 로열티 카드 NFT의 부모 역할을 하여 프로그램이 효율적으로 관리할 수 있는 방법을 제공합니다.

PDA를 컬렉션의 업데이트 권한으로 할당하면 프로그램이 프로그래밍 방식으로 카드를 발급하고 수정할 수 있습니다. 이를 Solana 프로그램 인스트럭션으로 구현하는 것은 엄격히 필요하지 않지만 "매니저" 계정 온보딩 기능을 구축하거나 여러 비즈니스를 위한 화이트 라벨 로열티 프로그램을 지원하는 경우 유용할 수 있습니다.

PDA를 컬렉션의 업데이트 권한으로 할당하면 프로그램이 프로그래밍 방식으로 카드를 발급하고 수정할 수 있습니다. 이는 엄격히 필요하지 않지만 제어를 간소화하는 데 도움이 됩니다.

Core 컬렉션 민팅에 대해 더 자세히 알아보려면 [Core 컬렉션 생성](https://developers.metaplex.com/core/collections#creating-a-collection)을 방문할 수 있습니다.


### 2단계: 소울바운드 로열티 카드 민팅

사용자가 프로그램에 가입할 때 다음과 같은 특성을 가진 로열티 카드 NFT를 민팅할 수 있습니다:

- 로열티 컬렉션에 속함
- Freeze Delegate 플러그인을 사용하여 동결됨(소울바운드)
- AppData 플러그인에 상태 저장

민팅 로직을 구조화하는 한 가지 방법입니다:

```rust
CreateV2CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .name("Sol Coffee Loyalty Card".to_owned())
    .collection(Some(&ctx.accounts.loyalty_card_collection))
    .uri("https://arweave.net/...".to_owned())
    .external_plugin_adapters(vec![
        ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            data_authority: PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() },
            init_plugin_authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }),
    ])
    .plugins(vec![
        PluginAuthorityPair {
            authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
        },
    ])
    .owner(Some(&ctx.accounts.signer))
    .payer(&ctx.accounts.signer)
    .authority(Some(&ctx.accounts.collection_delegate))
    .invoke_signed(collection_delegate_seeds)?;
```

### 3단계: 구매 중 로열티 카드 데이터 업데이트

고객이 구매하거나 보상을 리딤할 때 로열티 카드의 데이터를 적절히 업데이트하려고 합니다. 이 예제에서는 프론트엔드나 클라이언트에서 인스트럭션으로 전달되는 `redeem` 플래그로 그 동작을 제어합니다. 이 플래그는 사용자가 무료 아이템을 위해 포인트를 리딤하고 있는지 아니면 일반적인 구매를 하고 있는지를 결정합니다. 해당 `redeem` 플래그에 기반한 `match` 문을 사용하는 한 가지 접근 방식입니다:

- `redeem = true`인 경우, 사용자가 충분한 포인트를 가지고 있는지 확인하고 차감합니다.
- `redeem = false`인 경우, 라이포트(SOL)를 전송하고 스탬프를 추가합니다.

두 경우 모두 `last_used` 타임스탬프를 업데이트하고 업데이트된 구조체를 AppData 플러그인에 다시 씁니다.

```rust
match redeem {
    true => {
        if loyalty_card_data.current_stamps < COST_OF_COFFEE_IN_POINTS {
            return Err(LoyaltyProgramError::NotEnoughPoints.into());
        }
        loyalty_card_data.current_stamps -= COST_OF_COFFEE_IN_POINTS;
    }
    false => {
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.signer.key(),
                &ctx.accounts.destination_account.key(),
                COST_OF_COFFEE_IN_LAMPORTS,
            ),
            &[ctx.accounts.signer.to_account_info(), ctx.accounts.destination_account.to_account_info()],
        )?;

        if loyalty_card_data.current_stamps < MAX_POINTS {
            loyalty_card_data.current_stamps += 1;
        }
        loyalty_card_data.lifetime_stamps += 1;
    }
}

loyalty_card_data.last_used = clock::Clock::get().unwrap().unix_timestamp as u64;

let binary = bincode::serialize(&loyalty_card_data).unwrap();

WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }))
    .data(binary)
    .invoke_signed(seeds)?;
```

## 요약

이 가이드는 Metaplex Core를 사용한 로열티 카드 시스템의 개념적 구현을 안내했습니다. 다음을 탐구했습니다:

- 로열티 카드를 위한 컬렉션 NFT 생성

- AppData 및 FreezeDelegate와 같은 플러그인을 사용하여 데이터를 저장하고 NFT를 소울바운드로 만들기

- 프로그램이 로열티 카드를 제어할 수 있도록 PDA 권한 할당

- 포인트 획득 및 리딤과 같은 사용자 상호작용 처리

이 구조는 프로그램 로직, 사용자 상호작용, 각 로열티 카드의 상태 간의 깔끔한 관심사 분리를 제공합니다.

## 기능 확장 아이디어

기본 사항이 준비되면 로열티 시스템을 더 강력하거나 매력적으로 만들기 위해 탐구할 수 있는 몇 가지 방향이 있습니다:

- **계층별 보상:** 평생 스탬프를 기반으로 여러 보상 레벨(예: 실버, 골드, 플래티넘) 도입.

- **만료 로직:** 스탬프나 카드에 만료 기간을 추가하여 지속적인 참여 유도.

- **상점 간 사용:** 브랜드 내 여러 상점이나 상인 간에 로열티 카드 사용 허용.

- **사용자 정의 배지나 메타데이터:** 진행 상황의 시각적 표현을 보여주기 위해 NFT 메타데이터를 동적으로 업데이트.

- **알림이나 훅:** 사용자에게 획득한 보상이나 로열티 마일스톤을 알리는 오프체인 시스템 통합.

Metaplex Core의 플러그인 시스템과 자신만의 창의성을 결합하여 진정으로 보람있고 독특한 로열티 플랫폼을 구축할 수 있습니다.

이 패턴은 온체인 로열티 시스템을 관리하는 유연하고 모듈식 접근 방식을 제공합니다. 프로그램의 특정 목표에 맞게 이 접근 방식을 사용자 정의하고 확장할 수 있습니다.