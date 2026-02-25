---
title: MPL Core에서의 프린트 에디션
metaTitle: 프린트 에디션 | Core 가이드
description: 이 가이드에서는 Metaplex Core 프로토콜에서 플러그인을 조합하여 에디션을 만드는 방법을 보여줍니다.
updated: '01-31-2026'
keywords:
  - print editions
  - NFT editions
  - limited edition
  - master edition
about:
  - Edition creation
  - Print series
  - Edition plugins
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 공급량 추적을 위해 Master Edition 플러그인이 있는 Collection 생성
  - 에디션 번호를 포함하는 Edition 플러그인이 있는 Asset 생성
  - 선택적으로 Candy Machine Edition Guard를 사용하여 자동 번호 매기기
  - 에디션이 Master Edition Collection에 적절히 연결되어 있는지 확인
howToTools:
  - Node.js
  - Umi 프레임워크
  - mpl-core SDK
---
## 시작하기
### 에디션이란?
에디션은 동일한 "마스터 에디션"의 복사본입니다. 개념을 이해하기 위해 물리적 그림을 생각해보면 도움이 됩니다: 마스터 에디션은 첫 번째 그림이고, 에디션(프린트라고도 함)은 그 그림의 복사본입니다.
### Core에서의 에디션
MPL Core 에디션 지원은 메인넷 출시 직후에 추가되었습니다. Token Metadata 에디션과 달리 에디션 번호와 공급량은 강제되지 않으며 정보 제공 목적으로만 사용됩니다.
Core에서 에디션 개념을 구현하기 위해 두 개의 [플러그인](/smart-contracts/core/plugins)이 사용됩니다: Collection의 [Master Edition](/smart-contracts/core/plugins/master-edition)과 Asset(프린트)의 [Edition](/smart-contracts/core/plugins/edition). 계층 구조는 다음과 같습니다:
{% diagram %}
{% node %}
{% node #master label="Master Edition" theme="indigo" /%}
{% /node %}
{% node y="50" parent="master" theme="transparent" %}
Master Edition 플러그인이 있는
Collection
{% /node %}
{% node x="200" y="-70" parent="master" %}
{% node #asset1 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset1" %}
{% node #asset2 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset2" %}
{% node #asset3 label="Edition" theme="blue" /%}
{% /node %}
{% node y="50" parent="asset3" theme="transparent" %}
Edition 플러그인이 있는
Asset
{% /node %}
{% edge from="master" to="asset1" /%}
{% edge from="master" to="asset2" /%}
{% edge from="master" to="asset3" /%}
{% /diagram %}
## Candy Machine을 사용한 에디션 생성
에디션을 생성하고 판매하는 가장 쉬운 방법은 Core Candy Machine을 활용하는 것입니다.
다음 코드는 Master Edition Collection과 에디션을 프린트할 Candy Machine을 생성합니다.
{% dialect-switcher title="Edition Guard와 Master Edition Collection이 있는 Candy Machine 생성" %}
{% dialect title="JavaScript" id="js" %}
먼저 필요한 모든 함수를 임포트하고 RPC와 Wallet으로 Umi를 설정합니다:
```ts
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
    createCollection,
    ruleSet
} from "@metaplex-foundation/mpl-core";
import crypto from "crypto";
import {
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// 선택한 RPC 엔드포인트 사용
const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());
// 본인의 키페어 또는 Wallet Adapter 사용
const keypair = generateSigner(umi);
umi.use(keypairIdentity(keypair));
```
이 설정 후 [Master Edition 플러그인](/smart-contracts/core/plugins/master-edition)이 있는 Collection을 생성할 수 있습니다. `maxSupply` 필드는 프린트할 에디션 수를 결정합니다. 플러그인의 `name`과 `uri` 필드는 Collection 이름과 uri 외에 추가로 사용할 수 있습니다.
편의를 위해 [Royalty 플러그인](/smart-contracts/core/plugins/royalties)도 추가합니다.
```ts
const collectionSigner = generateSigner(umi);
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        // 부모 컬렉션과 동일하게 하려면 name과 uri 불필요
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```
Collection 생성 후 `hiddenSettings`와 `edition` 가드를 사용하여 Candy Machine을 생성할 수 있습니다.
- `hiddenSettings`는 민팅된 모든 Asset에 동일하거나 유사한 이름과 메타데이터를 할당하는 데 사용됩니다. `$ID$` 변수를 사용하면 민팅 시 민팅된 Asset의 인덱스로 대체됩니다.
- `edition` 가드는 Asset에 [Edition 플러그인](/smart-contracts/core/plugins/edition)을 추가하는 데 사용됩니다. 에디션 번호는 민팅된 Asset마다 증가하며 `editionStartOffset` 번호부터 시작합니다.
```ts
// 에디션의 이름과 오프체인 메타데이터
const editionData = {
  name: "Edition Name",
  uri: "https://example.com/edition-asset.json",
};
// 에디션은 사용하지 않지만 Candy Machine이 필요로 하는
// 해시 생성
const string = JSON.stringify(editionData);
const hash = crypto.createHash("sha256").update(string).digest();
const candyMachine = generateSigner(umi);
const createIx = await create(umi, {
  candyMachine,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  hiddenSettings: {
    name: editionData.name,
    uri: editionData.uri,
    hash,
  },
  guards: {
    edition: { editionStartOffset: 0 },
    // ... 추가 Guard
  },
})
await createIx.sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
완료되었습니다!
사용자는 Candy Machine에서 에디션을 민팅할 수 있습니다.
## Core Candy Machine 없이 에디션 생성
{% callout type="note" %}
MPL Core 에디션에는 Core Candy Machine 사용을 강력히 권장합니다. Candy Machine은 에디션 생성과 올바른 번호 매기기를 처리합니다.
{% /callout %}
Core Candy Machine 없이 에디션을 생성하려면:
1. [Master Edition](/smart-contracts/core/plugins/master-edition) 플러그인을 사용하여 Collection 생성
{% dialect-switcher title="Master Edition 플러그인으로 MPL Core Collection 생성" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  ruleSet,
} from '@metaplex-foundation/core'
const collectionSigner = generateSigner(umi)
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        // 부모 컬렉션과 동일하게 하려면 name과 uri 불필요
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 50 },
        { address: creator2, percentage: 50 }
      ],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
        }])
        .instruction();
    let signers = vec![&collection, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
2. [Edition](/smart-contracts/core/plugins/edition) 플러그인이 있는 Asset 생성. 플러그인 내 번호를 증가시키는 것을 잊지 마세요.
{% dialect-switcher title="Edition 플러그인으로 MPL Core Asset 생성" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
    create,
} from '@metaplex-foundation/mpl-core'
const asset = generateSigner(umi)
const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  collection: collectionSigner.publicKey,
  plugins: [
    {
      type: 'Edition',
      number: 1,
    }
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
    let authority = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
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
## 관련 정보
- [Candy Machine에서 민팅](/ko/smart-contracts/core-candy-machine/mint)
- [Master Edition 플러그인](/smart-contracts/core/plugins/master-edition)
- [Edition 플러그인](/smart-contracts/core/plugins/edition)
