---
title: Editionプラグイン
metaTitle: Editionプラグイン | Core
description: MPL Core Editionプラグインについて学びます。
---

Editionプラグインは「権限管理型（Authority Managed）」プラグインで、アセット内部にエディション番号を格納します。今後追加予定のMaster Editionプラグインと組み合わせることで、[Metaplex Token MetadataにおけるEditionの概念](/token-metadata/print)に近い表現が可能になります。

Editionプラグインの主な用途:

- 同一アセットのプリント（複製）

{% callout type="note" title="想定される使い方" %}
次を推奨します。

- Master EditionプラグインでEditionをグルーピング
- Candy MachineのEdition Guardを使用して自動的に番号を割り当て
{% /callout %}

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 引数

| Arg    | Value  |
| ------ | ------ |
| number | number |

`number`はアセットに割り当てられる任意の値です。通常は一意であるべきため、同じ番号を重複使用しないようクリエイター側で注意してください。

## Editionsプラグイン付きアセットの作成

Editionsプラグインはアセット作成時に追加する必要があります。不変化していない限り、数値は更新可能です。

### Mutable（可変）プラグインで作成

{% dialect-switcher title="Editionプラグイン付きMPL Coreアセットの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Edition',
      number: 1,
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
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Asset".into())
        .uri("https://example.com/my-asset.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition { number: 1 })
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

### Immutable（不変）プラグインで作成

不変のEditionプラグインでアセットを作成するには、以下のようにします。

{% dialect-switcher title="MPL Coreアセットへ不変のEditionプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

不変化させるには、権限を`nonePluginAuthority()`相当（`{ type: 'None' }`）に設定します。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    {
      type: 'Edition',
      number: 1,
      authority: { type: 'None' },
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
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition { number: 1 }),
            authority: None,
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

## Editionsプラグインの更新

Editionsプラグインが可変であれば、他プラグイン同様に更新できます。

{% dialect-switcher title="アセット上のEditionプラグインを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await updatePlugin(umi, {
  asset: assetAccount.publicKey,
  plugin: { type: 'Edition', number: 2 },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
_coming soon_

{% /dialect %}
{% /dialect-switcher %}

