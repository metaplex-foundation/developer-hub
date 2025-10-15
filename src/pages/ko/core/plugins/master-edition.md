---
title: Master Edition Plugin
metaTitle: Master Edition Plugin | Core
description: MPL Core Master Edition Plugin에 대해 알아보세요.
---

Master Edition Plugin은 Core Collection과 함께 사용되어 [Editions](/core/plugins/edition)를 그룹화하고, 출처를 제공하며, 최대 에디션 공급량을 저장하는 `Authority Managed` 플러그인입니다. Edition Plugin과 함께 이러한 Edition들은 [Metaplex Token Metadata의 Edition 개념](/token-metadata/print)과 비교할 수 있습니다.

Master Edition Plugin은 다음과 같은 영역에서 작동합니다:

- Edition 그룹화
- 출처 제공

{% callout type="note" title="권장 사용법" %}

다음을 권장합니다:

- Master Edition Plugin을 사용하여 Edition을 그룹화
- Edition Guard와 함께 Candy Machine을 사용하여 자동으로 넘버링 처리

{% /callout %}

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## Arguments

| Arg       | Value                | 사용 사례                                                                         |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 최대 몇 개의 프린트가 존재할지 나타냅니다. Open Edition을 허용하기 위해 선택사항입니다 |
| name      | Option<String>       | Edition의 이름 (컬렉션 이름과 다른 경우)                      |
| uri       | Option<String>       | Edition의 URI (컬렉션 uri와 다른 경우)                       |

이러한 값들은 권한에 의해 언제든지 변경될 수 있습니다. 이들은 순전히 정보 제공용이며 강제되지 않습니다.

## Master Edition 플러그인과 함께 Collection 생성

{% dialect-switcher title="Master Edition Plugin과 함께 MPL Core Collection 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: 'My Master Edition',
      uri: 'https://example.com/my-master-edition.json',
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition.json",
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

## Master Edition Plugin 업데이트

Master Edition Plugin이 변경 가능한 경우 다른 Collection Plugin과 유사하게 업데이트할 수 있습니다:

{% dialect-switcher title="Master Edition Plugin 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await updatePlugin(umi, {
  asset: asset,
  plugin: {
    type: 'MasterEdition',
    maxSupply: 110,
    name: 'My Master Edition',
    uri: 'https://example.com/my-master-edition',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
_곧 출시 예정_

{% /dialect %}
{% /dialect-switcher %}