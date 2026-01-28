---
title: Editionプラグイン
metaTitle: Editionプラグイン | Metaplex Core
description: Core NFTアセットにエディション番号を追加します。コレクタブルシリーズや限定版向けに「1/100」のようなプリント番号を追跡します。
---

**Editionプラグイン**は、個々のアセットにエディション番号を保存します。コレクタブルシリーズや限定版向けに「100枚中1枚」のような番号付きプリントを作成するために使用します。 {% .lead %}

{% callout title="学習内容" %}

- アセットにエディション番号を追加する
- 可変・不変のエディションを作成する
- エディション番号を更新する
- Editionワークフローを理解する

{% /callout %}

## 概要

**Edition**プラグインは、アセットに一意のエディション番号を保存する権限管理型プラグインです。番号付きエディションをグループ化するために、コレクションの[Master Editionプラグイン](/ja/smart-contracts/core/plugins/master-edition)と組み合わせて使用するのが最適です。

- 権限管理型（update authorityが制御）
- アセット作成時に追加が必要
- 権限が可変であれば番号を更新可能
- 自動番号付けにはCandy Machine Edition Guardを使用

## 対象外

供給量の強制（情報提供のみ）、自動番号付け（Candy Machineを使用）、コレクションレベルのエディション（コレクションにはMaster Editionプラグインを使用）。

## クイックスタート

**ジャンプ:** [可変エディション作成](#可変プラグインで作成) · [不変エディション作成](#不変プラグインで作成) · [エディション更新](#editionsプラグインの更新)

1. アセット作成時に一意の番号でEditionプラグインを追加
2. オプションで権限を`None`に設定して不変化
3. 可変の場合は後で番号を更新可能

{% callout type="note" title="想定される使い方" %}

次を推奨します。

- Master EditionプラグインでEditionをグルーピング
- Candy MachineのEdition Guardで番号付けを自動化

{% /callout %}

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 引数

| 引数   | 値     |
| ------ | ------ |
| number | number |

numberはアセットに割り当てられる特定の値です。通常この数値は一意であるべきなので、クリエイターは番号が重複しないよう注意する必要があります。

## Editionsプラグイン付きアセットの作成

Editionsプラグインはアセット作成時に追加する必要があります。可変である限り番号は変更可能です。

### 可変プラグインで作成

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
      number: 1
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

### 不変プラグインで作成

不変のEditionプラグインでアセットを作成するには、以下のコードを使用できます：

{% dialect-switcher title="MPL CoreアセットにEditionsプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

Editionsプラグインを不変にするには、権限を`nonePluginAuthority()`に設定する必要があります：

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
            plugin: Plugin::Edition(Edition {
                number: 1,
            }),
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

Editionsプラグインが可変であれば、他のプラグインと同様に更新できます：

{% dialect-switcher title="アセット上のEditionプラグインを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

  await updatePlugin(umi, {
    asset: assetAccount.publicKey,
    plugin: { type: 'Edition', number: 2 },
  }).sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
_近日公開_

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add Edition plugin after creation`

Editionプラグインはアセット作成時に追加する必要があります。既存のアセットには追加できません。

### `Authority mismatch`

update authorityのみがエディション番号を更新できます（可変の場合）。

### `Plugin is immutable`

Editionプラグインの権限が`None`に設定されています。番号を変更できません。

## 注意事項

- エディション番号の一意性は強制されません—クリエイターが追跡する必要があります
- プラグインは`create()`時に追加する必要があり、後からは追加できません
- 権限を`None`に設定するとエディション番号が永続化されます
- 適切なグルーピングのためにコレクションのMaster Editionプラグインと併用してください

## クイックリファレンス

### 権限オプション

| 権限 | 更新可能 | ユースケース |
|------|----------|--------------|
| `UpdateAuthority` | ✅ | 可変エディション番号 |
| `None` | ❌ | 永続的、不変のエディション |

### 推奨セットアップ

| コンポーネント | 配置場所 | 目的 |
|---------------|----------|------|
| Master Edition | コレクション | エディションのグループ化、最大供給量の保存 |
| Edition | アセット | 個々のエディション番号の保存 |
| Candy Machine | ミント | 自動連番 |

## FAQ

### エディション番号は一意であることが強制されますか？

いいえ。エディション番号は情報提供のみです。クリエイターが一意の番号を確保する責任があります。自動連番にはCandy MachineとEdition Guardを使用してください。

### 既存のアセットにEditionプラグインを追加できますか？

いいえ。Editionプラグインはアセット作成時に追加する必要があります。エディション番号が必要な場合は事前に計画してください。

### 「100枚中1枚」スタイルのエディションを作成するには？

アセットにEditionプラグイン（番号1-100）を追加し、コレクションに`maxSupply: 100`でMaster Editionプラグインを追加します。Master Editionがエディションをグループ化し、総供給量を示します。

### 作成後にエディション番号を変更できますか？

はい、プラグイン権限が`None`に設定されていない場合。update authorityは`updatePlugin`を使用して番号を変更できます。

### EditionとMaster Editionの違いは何ですか？

Editionはアセット上に個々の番号（例：#5）を保存します。Master Editionはコレクション上にコレクションレベルのデータ（最大供給量、エディション名/URI）を保存し、エディションをグループ化します。

## 用語集

| 用語 | 定義 |
|------|------|
| **Edition Number** | 特定のプリントの一意な識別子（例：1, 2, 3） |
| **Master Edition** | エディションをグループ化するコレクションレベルのプラグイン |
| **Edition Guard** | 自動番号付け用のCandy Machineガード |
| **Authority Managed** | update authorityが制御するプラグイン |
| **Immutable Edition** | 権限が`None`に設定されたエディション |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-core対応*
