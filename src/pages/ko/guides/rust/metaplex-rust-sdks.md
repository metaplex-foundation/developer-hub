---
title: Metaplex Rust SDK
metaTitle: Metaplex Rust SDK | 가이드
description: Metaplex Rust SDK에 대한 간단한 개요입니다.
---

## 소개

Metaplex는 대부분의 프로그램에 대해 일관성 있고 예측 가능한 출력과 기능을 가진 Rust SDK를 제공하여 우리 제품과 함께 작업하는 개발자들의 통합 시간을 개선합니다.

## 모듈

Core Rust SDK는 여러 모듈로 구성되어 있습니다:

- `accounts`: 프로그램의 계정을 나타냅니다.
- `instructions`: 명령어, 명령어 인수 및 CPI 명령어 생성을 용이하게 합니다.
- `errors`: 프로그램의 오류를 열거합니다.
- `types`: 프로그램에서 사용되는 타입을 나타냅니다.

### Accounts

**accounts** 모듈은 온체인 계정 구조를 기반으로 생성됩니다. 이들은 RAW 프로그램 생성을 사용하는지 또는 Anchor와 같은 프레임워크를 사용하는지에 따라 여러 다른 방법을 사용하여 역직렬화할 수 있습니다.

이들은 `<crate_name>::accounts`에서 접근할 수 있습니다. `mpl-core`의 경우 다음과 같이 계정에 접근할 수 있습니다:

```rust
mpl_core::accounts
```

### Instructions

각 SDK는 주어진 프로그램에서 제공되는 명령어의 여러 버전을 제공하는 **instructions** 모듈과 함께 제공되며, 필요에 따라 많은 보일러플레이트를 제거합니다.

아래 예시는 `mpl-core` crate에서 오는 모든 `CreateV1` 명령어를 보여줍니다.

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

이들은 `<crate_name>::instructions`에서 접근할 수 있습니다. `mpl-core`의 경우 다음과 같이 계정에 접근할 수 있습니다:

```rust
mpl_core::instructions
```

### Types

각 Metaplex Rust SDK는 초기 accounts 모듈 구조체에 없을 수 있는 모든 필요한 추가 타입을 제공하는 **types** 모듈과 함께 제공됩니다.

이들은 `<crate_name>::types`에서 접근할 수 있습니다. `mpl-core`의 경우 다음과 같이 계정에 접근할 수 있습니다:

```rust
mpl_core::types
```

### Errors

모든 SDK에 대해 **errors** 모듈이 생성되지만 이는 특정 프로그램의 오류 목록만 보유하며 사용자는 이 모듈과 상호작용할 필요가 없습니다.

## 명령어 빌더

Metaplex Rust SDK는 현재 임포트할 수 있는 각 명령어의 두 **Builder** 버전과 함께 제공됩니다. 이는 엄청난 양의 코드를 추상화해주고 전송할 준비가 된 명령어를 반환합니다.

여기에는 다음이 포함됩니다:

- Builder
- CpiBuilder

[mpl-Core crate docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)의 `CreateV1`의 경우 이러한 명령어들이 현재 사용 가능합니다.

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

### Builder

Builder 명령어는 클라이언트 측 트랜잭션을 위한 명령어를 생성해야 할 때 사용하도록 설계되었습니다.

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

이들은 빌더에 전달되어야 하는 공개키와 데이터의 인수입니다. 일부 계정은 선택사항일 수도 있습니다. 이러한 선택적 계정은 프로그램에서 전혀 필요하지 않거나 생략되면 다른 주소로 기본 설정될 수 있습니다. 이 동작은 명령어마다 다를 수 있습니다.

`new()` 함수를 다시 클릭하고 이번에는 아래로 스크롤하면 추가 주석이 있는 개별 함수들을 볼 수 있습니다. 아래 경우에서 owner는 payer로 기본 설정되므로, 이 경우 payer가 Asset의 소유자가 될 경우 owner를 전달할 필요가 없습니다.

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
        .instruction();
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

### CpiBuilder

`CpiBuilder` 명령어는 자신의 프로그램에서 Metaplex 프로그램의 명령어를 호출하고 실행하려고 할 때 사용하도록 설계되었습니다.

`CpiBuilders`에 대해 논의하는 별도의 완전한 가이드가 있으며 여기에서 볼 수 있습니다:

[Metaplex 프로그램에 CPI하기](/ko/guides/rust/how-to-cpi-into-a-metaplex-program)