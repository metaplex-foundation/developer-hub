---
title: 자산 생성하기
metaTitle: 자산 생성하기 | Core
description: Metaplex Core 패키지를 사용하여 Core NFT 자산을 생성하는 방법을 알아보세요.
---

[Core 개요](/ko/core)에서 논의한 바와 같이, Core의 디지털 자산은 정확히 하나의 온체인 계정과 토큰을 설명하는 오프체인 데이터로 구성됩니다. 이 페이지에서는 이러한 자산을 민팅하는 과정을 살펴보겠습니다. {% .lead %}

## 생성 과정

1. **오프체인 데이터 업로드.** 먼저 오프체인 데이터가 준비되어 있는지 확인해야 합니다. 이는 자산을 설명하는 JSON 파일이 어딘가에 저장되어 있어야 함을 의미합니다. JSON 파일이 **URI**를 통해 액세스할 수 있다면 어떻게, 어디에 저장되는지는 중요하지 않습니다. 오프체인 메타데이터는 [기존 토큰 메타데이터 표준](/ko/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)과 유사하게 보일 수 있습니다.
2. **온체인 자산 계정 생성.** 그런 다음 자산의 데이터를 보관할 온체인 자산 계정을 생성해야 합니다.

구체적인 코드 예제를 제공하면서 이러한 단계를 더 자세히 살펴보겠습니다.

## 오프체인 데이터 업로드

모든 저장 서비스(Arweave, IPFS, AWS 등...)를 사용하여 오프체인 데이터를 업로드하거나 단순히 자체 서버에 저장할 수 있습니다. 사용자에게 이 중 일부를 더 쉽게 만들기 위해 `Umi`는 `Irys(Arweave에 업로드)` 및 `nftStorage(IPFS에 업로드)`와 같은 전용 플러그인을 가지고 있습니다. 플러그인이 선택되면 사용자에게 데이터를 업로드할 수 있는 통합 인터페이스가 제공됩니다.

{% dialect-switcher title="자산과 JSON 데이터 업로드" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="업로더 선택" %}

Umi를 사용하여 원하는 업로더를 선택하려면 업로더에서 제공하는 플러그인을 설치하기만 하면 됩니다.

예를 들어, Irys 플러그인을 설치하는 방법은 다음과 같습니다:

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

이제 **URI**가 있으므로 다음 단계로 넘어갈 수 있습니다.

## 자산 생성

자산을 생성하려면 `createV1` 명령어를 사용하세요. `createV1` 명령어는 자산의 기본 메타데이터를 설정하는 것 외에도 자산을 컬렉션에 추가하고 플러그인을 할당하는 것을 포함합니다. 이는 [나중에](#create-an-asset-with-plugins) 설명됩니다.

다음은 간단한 예시입니다:

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정 목록**

| 계정          | 설명                                                   |
| ------------- | ------------------------------------------------------ |
| asset         | MPL Core 자산의 주소                                   |
| collection    | Core 자산이 속한 컬렉션                               |
| authority     | 새 자산의 권한                                         |
| payer         | 저장 수수료를 지불하는 계정                            |
| new owner     | 자산을 받을 소유자                                     |
| systemProgram | 시스템 프로그램 계정                                   |
| logWrapper    | SPL Noop 프로그램                                      |

**명령어 인수**

| 인수      | 설명                                                        |
| --------- | ----------------------------------------------------------- |
| dataState | 데이터가 계정 상태에 저장되는지 장부 상태에 저장되는지      |
| name      | MPL Core 자산의 이름                                        |
| uri       | 오프체인 JSON 메타데이터 URI                                |
| plugins   | 자산이 가져야 할 플러그인                                   |

일부 계정/인수는 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L18)에서 확인할 수 있습니다.

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="자산 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //다른 지갑으로 민팅하기 위한 선택 사항
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};


pub async fn create_asset() {

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
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new()
        .asset(input.asset.pubkey())
        .collection(input.collection)
        .authority(input.authority)
        .payer(payer)
        .owner(input.owner)
        .update_authority(input.update_authority)
        .system_program(system_program::ID)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(input.name.unwrap_or(DEFAULT_ASSET_NAME.to_owned()))
        .uri(input.uri.unwrap_or(DEFAULT_ASSET_URI.to_owned()))
        .plugins(input.plugins)
        .invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 자산 생성

MPL Core 자산은 MPL Core 컬렉션이 이미 존재하는 경우 컬렉션에 바로 생성할 수 있습니다. 컬렉션 자산을 생성하려면 [여기](/ko/smart-contracts/core/collections)를 방문하세요.

{% dialect-switcher title="컬렉션에 자산 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  create,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

// 컬렉션 생성
// 단일 스크립트에서 이를 수행하는 경우
// sleep 함수를 사용하거나 'finalized' 커밋 레벨을
// 사용해야 할 수 있습니다. 이렇게 하면 컬렉션이
// 완전히 작성된 후 변경 사항을 가져올 수 있습니다.
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)

// 컬렉션 가져오기
const collection = await fetchCollection(umi, collectionSigner.publicKey)


// assetSigner 생성 후 자산 생성
const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //다른 지갑으로 민팅하기 위한 선택 사항
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::{CreateCollectionV1Builder, CreateV1Builder};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let signer = Keypair::new(); // 여기서 키페어 로드

    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(signer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .instruction();

    let signers = vec![&collection, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);

    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(Some(collection.pubkey()))
        .payer(signer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new(input.program)
    .asset(input.asset.pubkey())
    .collection(Some(input.collection))
    .authority(Some(input.authority))
    .payer(input.payer)
    .owner(Some(input.owner))
    .update_authority(Some(input.update_authority))
    .system_program(system_program::ID)
    .data_state(input.data_state.unwrap_or(DataState::AccountState))
    .name(input.name)
    .uri(input.uri)
    .plugins(input.plugins)
    .invoke();
```

{% /dialect %}

{% /dialect-switcher %}

## 플러그인과 함께 자산 생성

MPL Core 자산은 컬렉션과 자산 레벨 모두에서 플러그인 사용을 지원합니다. 플러그인과 함께 Core 자산을 생성하려면 생성 중에 `plugins` 배열 인수에 플러그인 타입과 매개변수를 전달합니다. 아래 예시는 `Freeze` 플러그인으로 민트를 생성합니다.

{% dialect-switcher title="플러그인과 함께 자산 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [
        {
          address: creator1,
          percentage: 20,
        },
        {
          address: creator2,
          percentage: 80,
        },
      ],
      ruleSet: ruleSet('None'), // 호환성 규칙 세트
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Royalties(Royalties {
                basis_points: 500,
                creators: vec![Creator {
                    address: creator,
                    percentage: 100,
                }],
                rule_set: RuleSet::None,
            }),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

플러그인 목록에는 다음이 포함되지만 이에 국한되지 않습니다:

- [소각 위임자](/ko/smart-contracts/core/plugins/burn-delegate)
- [동결 위임자](/ko/smart-contracts/core/plugins/freeze-delegate)
- [로열티](/ko/smart-contracts/core/plugins/royalties)
- [전송 위임자](/ko/smart-contracts/core/plugins/transfer-delegate)
- [업데이트 위임자](/ko/smart-contracts/core/plugins/update-delegate)