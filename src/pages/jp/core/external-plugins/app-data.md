---
title: AppDataプラグイン
metaTitle: AppDataプラグイン | Core
description: MPL CoreのAppDataプラグインについて学び、データ権限のみが書き込める安全なデータ領域をアセットに持たせる方法を理解します。
---

## AppDataプラグインとは？

`AppData`外部プラグインは、`dataAuthority`によって書き込み可能な任意データを保存します。これは`ExternalRegistryRecord`に保存されるプラグイン全体の権限とは異なり、AppDataプラグインの権限では更新/権限の取り消しや他メタデータの変更はできません。

`AppData`は、特定の権限者のみが変更・書き込み可能な、アセット内の分割データ領域のようなものだと考えてください。

これは、外部サイト/アプリが自社プロダクト/アプリ内の特定機能を実行するために必要なデータを保存するのに有用です。

## 対応状況

|                       |     |
| --------------------- | --- |
| MPL Core Asset        | ✅  |
| MPL Core Collection\* | ✅  |

\* MPL Core Collectionでは`LinkedAppData`プラグインも利用できます。

## LinkedAppDataプラグインとは？

`LinkedAppData`プラグインはコレクション向けです。コレクション上に単一のプラグインアダプターを追加し、そのコレクションに属する任意のアセットに対して書き込みを行えるようにします。

## 引数

| Arg           | 値                          |
| ------------- | --------------------------- |
| dataAuthority | PluginAuthority             |
| schema        | ExternalPluginAdapterSchema |

### dataAuthority

{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}

```ts
const dataAuthority = {
  type: 'Address',
  address: publicKey('11111111111111111111111111111111'),
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::PluginAuthority;

let data_authority = Some(PluginAuthority::Address {address: authority.key()}),
```

{% /dialect %}
{% /dialect-switcher %}

### schema

`AppData`プラグインに保存されるデータの型を決めます。すべてのスキーマはDASでインデックス化されます。

| Arg               | DAS対応 | 保存形式 |
| ----------------- | ------ | -------- |
| Binary (Raw Data) | ✅     | base64   |
| Json              | ✅     | json     |
| MsgPack           | ✅     | json     |

インデックス化の際、`JSON`や`MsgPack`の読み込みでエラーが発生した場合は、バイナリとして保存されます。

{% dialect-switcher title="`AppData`へデータを書き込む" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'

// Binary, Json, MsgPack から選択
const schema = ExternalPluginAdapterSchema.Json
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// Binary, Json, MsgPack から選択
let schema = ExternalPluginAdapterSchema::Json

```

{% /dialect %}

{% /dialect-switcher %}

## アセットへAppDataプラグインを追加

{% dialect-switcher title="MPL CoreアセットへAttributeプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi);
const dataAuthority = publicKey('11111111111111111111111111111111')

await create(umi, {
  asset: asset.publicKey,
  name: "My Asset",
  uri: "https://example.com/my-assets.json",
  plugins: [
    {
      type: 'AppData',
      dataAuthority,
      schema: ExternalPluginAdapterSchema.Json,
    },
  ],
}).sendAndConfirm(umi)
```

