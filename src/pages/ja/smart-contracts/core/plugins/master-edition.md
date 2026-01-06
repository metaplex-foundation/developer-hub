---
title: Master Editionプラグイン
metaTitle: Master Editionプラグイン | Core
description: MPL Core Master Editionプラグインについて学びます。
---

Master Editionプラグインは「権限管理型（Authority Managed）」プラグインで、Coreコレクションと共に使用し、[Edition](/ja/smart-contracts/core/plugins/edition)のグルーピング、来歴（Provenance）の提供、最大エディション供給量の保存を行います。Editionプラグインと組み合わせることで、[Metaplex Token MetadataにおけるEditionの概念](/token-metadata/print)に相当する表現が可能です。

主な用途:

- Editionのグルーピング
- 来歴情報の提供

{% callout type="note" title="想定される使い方" %}
次を推奨します。

- Master EditionプラグインでEditionをグルーピング
- Candy MachineのEdition Guardで番号付けを自動化
{% /callout %}

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 引数

| Arg       | Value                | Usecase                                                            |
| --------- | -------------------- | ------------------------------------------------------------------ |
| maxSupply | Option<number> (u32) | 最大プリント数を示します。省略するとOpen Editionsにできます        |
| name      | Option<String>       | Editionの名前（コレクション名と異なる場合）                         |
| uri       | Option<String>       | EditionのURI（コレクションURIと異なる場合）                         |

これらの値は情報提供目的であり、権限者がいつでも変更できます（強制はされません）。

## Master Editionプラグイン付きでコレクション作成

{% dialect-switcher title="Master Editionプラグイン付きMPL Coreコレクションの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
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
                name: "My Master Edition",
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

## Master Editionプラグインの更新

Master Editionプラグインが可変であれば、他のコレクションプラグイン同様に更新できます。

{% dialect-switcher title="Master Editionプラグインを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

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
_coming soon_

{% /dialect %}
{% /dialect-switcher %}

