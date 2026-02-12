---
title: Metaplex 프로그램에 CPI하는 방법
metaTitle: Metaplex 프로그램에 CPI하는 방법 | 가이드
description: 각 Metaplex 프로그램에 CPI를 수행할 때 Metaplex가 어떻게 일관된 경험을 제공하는지에 대한 개요입니다.
keywords:
  - CPI
  - Cross Program Invocation
  - Solana CPI tutorial
  - Metaplex CpiBuilder
  - invoke_signed
about:
  - Cross Program Invocation
  - Metaplex CPI builders
  - Solana program interoperability
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
howToSteps:
  - Import the CpiBuilder for the desired Metaplex instruction
  - Initialize the CpiBuilder with the target program AccountInfo
  - Fill in the required accounts and data arguments
  - Choose between invoke() for regular calls or invoke_signed() for PDA signers
  - Execute the CPI call to the Metaplex program
howToTools:
  - Metaplex Rust SDK
  - mpl-core crate
---

## 소개

이전에 "프로그램에 CPI하기" 또는 "프로그램에서 CPI 호출하기"라는 용어를 들어본 적이 있고 "그들이 무슨 말을 하는 건가?"라고 생각해본 적이 있을 것입니다.

CPI(Cross Program Invocation)는 한 프로그램이 다른 프로그램의 명령어를 호출하는 상호작용입니다.

예를 들어, 내가 프로그램을 만들고 이 트랜잭션 중에 NFT나 Asset을 전송해야 한다고 가정해보겠습니다. 내 프로그램은 CPI 호출을 통해 Token Metadata나 Core 프로그램에게 올바른 세부 정보를 제공하면 전송 명령어를 실행해달라고 요청할 수 있습니다.

## Metaplex Rust Transaction CPI 빌더 사용하기

Metaplex Rust crate에서 제공되는 각 명령어에는 현재 임포트할 수 있는 해당 명령어의 `CpiBuilder` 버전도 함께 제공됩니다. 이는 엄청난 양의 코드를 추상화해주고 `CpiBuilder` 자체에서 직접 호출할 수 있습니다.

Core의 `Transfer` 명령어를 예로 들어보겠습니다 (이는 이 Crate의 다른 모든 명령어와 다른 모든 Metaplex crate에도 적용됩니다).

[MPL Core crate type docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)의 명령어들을 살펴보면 사용할 수 있는 여러 명령어를 볼 수 있습니다.

```
TransferV1
TransferV1Builder
TransferV1Cpi
TransferV1CpiAccounts
TransferV1CpiBuilder
TransferV1InstructionArgs
TransferV1InstructionData
```

여기서 우리가 관심 있는 것은 `TransferV1CpiBuilder`입니다.

빌더를 초기화하려면 `CpiBuilder`에서 `new`를 호출하고 CPI 호출이 이루어지는 프로그램 주소의 프로그램 `AccountInfo`를 전달할 수 있습니다.

```rust
TransferV1CpiBuilder::new(ctx.accounts.mpl_core_program);
```

이 시점에서 `ctrl + click` (PC) 또는 `cmd + click` (Mac)으로 `CpiBuilder::`에서 생성된 `new` 함수에 들어가면 이 특정 CPI 호출에 필요한 모든 CPI 인수(계정 및 데이터)가 표시됩니다.

```rust
//TransferV1CpiBuilder의 new() 함수

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(TransferV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            payer: None,
            authority: None,
            new_owner: None,
            system_program: None,
            log_wrapper: None,
            compression_proof: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

보시다시피 이것은 모든 계정이 필요하고 데이터는 없으며 작성하기 상당히 쉬운 CPI 호출입니다.

두 번째 CpiBuilder를 살펴보되 이번에는 CreateV1의 경우를 보면 `name`과 `uri`와 같이 모두 문자열인 추가 데이터가 필요한 것을 볼 수 있습니다.

```rust
//CreateV1CpiBuilder의 new() 함수

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            authority: None,
            payer: None,
            owner: None,
            update_authority: None,
            system_program: None,
            log_wrapper: None,
            data_state: None,
            name: None,
            uri: None,
            plugins: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

`CpiBuilder` 내에서 일부 계정은 선택사항일 수 있으므로 사용 사례에 따라 무엇이 필요하고 필요하지 않은지 확인해야 할 수 있습니다.

다음은 Transfer와 Create에 대해 작성된 두 `CpiBuilder` 버전입니다.

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
```

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        .collection(context.accounts.collection)
        .authority(context.accounts.authority)
        .payer(context.accounts.payer)
        .owner(context.accounts.owner)
        .update_authority(context.accounts.update_authority)
        .system_program(context.accounts.system_program)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(args.asset_name)
        .uri(args.asset_uri)
        .plugins(args.plugins)
```

## 호출하기

호출(Invoking)은 다른 프로그램에 CPI 호출을 실행하는 용어로, 프로그램 버전의 "트랜잭션 전송"이라고 할 수 있습니다.

CPI 호출을 호출할 때 두 가지 옵션이 있습니다. `invoke()`와 `invoke_signed()`

### invoke()

`invoke()`는 트랜잭션이 성공하기 위해 호출되는 명령어에 PDA 서명자 시드를 전달할 필요가 없을 때 사용됩니다.
원래 명령어에 서명한 계정들은 자동으로 cpi 호출에서 서명자 검증을 통과합니다.

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke()

```

### invoke_signed()

`invoke_signed()`는 PDA가 cpi 호출에서 서명자가 되어야 하는 계정 중 하나일 때 사용됩니다. 예를 들어, 우리의 Asset을 소유하게 된 프로그램이 있고 우리 프로그램의 PDA 주소 중 하나가 그것의 소유자가 되었다고 가정해보겠습니다. 그것을 전송하고 소유자를 다른 사람으로 변경하려면 그 PDA가 트랜잭션에 서명해야 합니다.

PDA가 재생성되고 프로그램을 대신하여 cpi 호출에 서명할 수 있도록 원래 PDA 시드와 범프를 전달해야 합니다.

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke_signed(signers)
```

## 전체 CpiBuilder 예시

다음은 Core 프로그램의 TransferV1 명령어를 사용하여 `CpiBuilder`를 사용하는 전체 예시입니다.

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
        .invoke()

```
