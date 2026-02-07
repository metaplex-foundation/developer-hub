---
title: Rust와 함께 작업하기
metaTitle: Rust와 함께 작업하기 | 가이드
description: Rust와 Metaplex 프로토콜로 작업하는 것에 대한 간단한 개요입니다.
---

## 소개

Solana에서 개발하고 있다면 의심할 여지없이 Rust라는 용어를 접했을 것입니다. Rust는 Solana 생태계 내에서 프로그램을 구축하는 데 가장 인기 있는 언어입니다.

Rust는 개발에 처음 도전하는 사람에게는 상당히 어려운 작업처럼 보일 수 있지만, Rust와 Solana 생태계를 시작하는 데 도움이 되는 몇 가지 리소스가 있습니다.

**The Rust Book**

Rust를 배우려면 여기서 시작하세요. 언어의 기초부터 고급 코딩까지 다룹니다.

[The Rust Programming Language Book](https://doc.rust-lang.org/stable/book/)

**Anchor**

Anchor는 보안 보일러플레이트의 상당 부분을 제거하고 이를 대신 처리해 주어 개발 프로세스를 가속화함으로써 Solana 프로그램을 구축하는 데 도움이 되는 프레임워크입니다.

[Anchor Framework](https://www.anchor-lang.com/)

## 로컬에서 Rust 스크립트 작업하기

### Solana 클라이언트 설정

Rust 스크립트용 Solana RPC 클라이언트를 설정하는 것은 상당히 간단합니다. `solana_client` crate만 가져오면 됩니다.

```rust
use solana_client::rpc_client;

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
```

### Metaplex Rust 명령어 빌더 사용하기

Metaplex Rust crate에서 제공되는 각 명령어에는 현재 임포트할 수 있는 해당 명령어의 `Builder` 버전도 함께 제공됩니다. 이는 엄청난 양의 코드를 추상화해주고 전송할 준비가 된 명령어를 반환합니다.

Core의 `CreateV1` 명령어를 예로 들어보겠습니다 (이는 이 Crate의 다른 모든 명령어와 다른 모든 Metaplex crate에도 적용됩니다).

[Mpl Core crate type docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)의 명령어들을 살펴보면 사용할 수 있는 여러 명령어를 볼 수 있습니다.

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

여기서 우리가 관심 있는 것은 `CreateV1Builder`입니다.

빌더를 초기화하려면 `new`를 호출할 수 있습니다.

```rust
CreateV1Builder::new();
```

이 시점에서 `ctrl + click` (pc) 또는 `cmd + click` (mac)으로 `Builder::`에서 생성된 `new` 함수에 들어가면 빌더의 `pub fn new()`에 위치하게 됩니다. 조금 위로 스크롤하면 아래에 설명된 `CreateV1Builder`의 `pub struct`를 볼 수 있습니다.

```rust
pub struct CreateV1Builder {
    asset: Option<solana_program::pubkey::Pubkey>,
    collection: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    log_wrapper: Option<solana_program::pubkey::Pubkey>,
    data_state: Option<DataState>,
    name: Option<String>,
    uri: Option<String>,
    plugins: Option<Vec<PluginAuthorityPair>>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

```

이들은 빌더에 전달되어야 하는 공개키와 데이터의 인수입니다. 일부 계정은 선택사항일 수도 있고 다른 것들로 기본 설정될 수 있으며, 이는 명령어마다 다를 수 있습니다. `new()` 함수를 다시 클릭하고 이번에는 아래로 스크롤하면 추가 주석이 있는 개별 함수들을 볼 수 있습니다. 아래 경우에서 owner는 payer로 기본 설정되므로, 이 경우 payer가 Asset의 소유자가 될 경우 owner를 전달할 필요가 없습니다.

```rust
/// `[optional account]`
    /// The owner of the new asset. Defaults to the authority if not present.
    #[inline(always)]
    pub fn owner(&mut self, owner: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.owner = owner;
        self
    }
```

다음은 `.instruction()`을 사용하여 빌더를 닫고 명령어를 반환하는 `CreateV1Builder`를 사용한 예시입니다.

```rust
let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
.       .instruction();
```

이제 명령어가 준비되었으므로 RPC에 전송할 일반적인 Solana 트랜잭션을 생성해야 합니다. 여기에는 블록해시와 서명자가 포함됩니다.

### 전체 빌더 예시

다음은 Metaplex `Builder` 함수를 사용하여 명령어를 생성하고 해당 트랜잭션을 체인으로 전송하는 완전한 예시입니다.

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)

```

## 프로그램과 함께 작업하기

### CPI (Cross Program Invocation)

이전에 "프로그램에 CPI하기" 또는 "프로그램에서 CPI 호출하기"라는 용어를 들어본 적이 있고 "그들이 도대체 무슨 말을 하는 건가?"라고 생각해본 적이 있을 것입니다.

프로그램에 CPI하는 것은 기본적으로 트랜잭션 중에 한 프로그램이 다른 프로그램을 호출하는 것입니다.

예를 들어, 내가 프로그램을 만들고 이 트랜잭션 중에 Nft나 Asset을 전송해야 한다고 가정해보겠습니다. 내 프로그램은 CPI 호출을 통해 Token Metadata나 Core 프로그램에게 올바른 세부 정보를 제공하면 전송 명령어를 실행해달라고 요청할 수 있습니다.

### Metaplex Rust Transaction CPI 빌더 사용하기

Metaplex Rust crate에서 제공되는 각 명령어에는 현재 임포트할 수 있는 해당 명령어의 `CpiBuilder` 버전도 함께 제공됩니다. 이는 엄청난 양의 코드를 추상화해주고 CpiBuilder 자체에서 직접 호출할 수 있습니다.

Core의 `Transfer` 명령어를 예로 들어보겠습니다 (이는 이 Crate의 다른 모든 명령어와 다른 모든 Metaplex crate에도 적용됩니다).

[Mpl Core crate type docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)의 명령어들을 살펴보면 사용할 수 있는 여러 명령어를 볼 수 있습니다.

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

빌더를 초기화하려면 CpiBuilder에서 `new`를 호출하고 CPI 호출이 이루어지는 프로그램 주소의 프로그램 `AccountInfo`를 전달할 수 있습니다.

```rust
TransferV1CpiBuilder::new(ctx.accounts.mpl_core_program);
```

이 시점에서 `ctrl + click` (pc) 또는 `cmd + click` (mac)으로 `CpiBuilder::`에서 생성된 `new` 함수에 들어가면 이 특정 CPI 호출에 필요한 모든 CPI 인수(계정 및 데이터)가 표시됩니다.

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

CpiBuilder에서 일부 계정은 선택사항일 수 있으므로 사용 사례에 따라 무엇이 필요하고 필요하지 않은지 확인해야 할 수 있습니다.

다음은 Transfer와 Create에 대해 작성된 두 CpiBuilder입니다.

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

### 호출하기

호출(Invoking)은 다른 프로그램에 CPI 호출을 실행하는 용어입니다. 프로그램 버전의 "트랜잭션 전송"이라고 할 수 있습니다.

CPI 호출을 호출할 때 두 가지 옵션이 있습니다. `invoke()`와 `invoke_signed()`

#### invoke()

`invoke()`는 트랜잭션이 성공하기 위해 호출되는 명령어에 PDA 서명자 시드를 전달할 필요가 없을 때 사용됩니다.
원래 명령어에 서명한 계정들은 자동으로 cpi 호출에서 서명자 검증을 통과합니다.

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke()

```

#### invoke_signed()

`invoke_signed()`는 PDA가 cpi 호출에서 서명자가 되어야 하는 계정 중 하나일 때 사용됩니다. 예를 들어, 우리의 Asset을 소유하게 된 프로그램이 있고 우리 프로그램의 PDA 주소 중 하나가 그것의 소유자가 되었다고 가정해보겠습니다. 그것을 전송하고 소유자를 다른 사람으로 변경하려면 그 PDA가 트랜잭션에 서명해야 합니다.

PDA가 재생성되고 프로그램을 대신하여 cpi 호출에 서명할 수 있도록 원래 PDA 시드와 범프를 전달해야 합니다.

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke_signed(signers)

```

### 전체 CpiBuilder 예시

다음은 Core 프로그램의 TransferV1 명령어를 사용하여 CpiBuilder를 사용하는 전체 예시입니다.

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