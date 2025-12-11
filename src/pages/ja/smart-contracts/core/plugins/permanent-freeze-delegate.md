---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Plugin | Core
description: プラグインのデリゲートが任意の時点でアセットを凍結できる強力なプラグイン。
---

## 概要

Permanent Freeze Delegateプラグインは「Permanent」プラグインで、追加されたMPL CoreアセットまたはMPL Coreコレクション上に常に存在します。Permanentプラグインはアセットまたはコレクションの作成時にのみ追加できます。

主な用途:

- ソウルバウンドトークン

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 挙動
- **Asset**: 委任アドレスがいつでもNFTを凍結/解凍可能。
- **Collection**: コレクション権限がコレクション全体を一括で凍結/解凍可能（単一アセットのみの凍結は不可）。

## 引数

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Permanent Freezeプラグイン付きでアセット作成

以下はアセット作成時にPermanent Freezeプラグインを追加する例です。

{% dialect-switcher title="Permanent Freezeプラグイン付きアセットの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
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
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## アセット上のPermanent Freeze Delegate更新

以下はアセット上のPermanent Freeze Delegateを更新する例です。`frozen`を`true/false`で切り替えます（署名ウォレットがプラグイン権限者である前提）。

{% dialect-switcher title="アセット上のPermanent Freeze Delegateを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'PermanentFreezeDelegate',
    frozen: false,
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションをPermanent Freezeプラグイン付きで作成

{% dialect-switcher title="Permanent Freezeプラグイン付きコレクションの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: 'Frozen Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'UpdateAuthority' },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクション上のPermanent Freezeプラグイン更新

以下はコレクション上のPermanent Freeze Delegateを更新する例です。`frozen`を`true/false`で切り替えます（署名ウォレットがプラグイン権限者である前提）。

{% dialect-switcher title="Permanent Freezeプラグインを更新（コレクション）" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
    type: 'PermanentFreezeDelegate',
    frozen: false,
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

