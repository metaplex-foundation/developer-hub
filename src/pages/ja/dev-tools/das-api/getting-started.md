---
title: はじめに
metaTitle: はじめに | DAS API
description: Metaplex DAS APIクライアントのインストールとセットアップ。
---

`@metaplex-foundation/digital-asset-standard-api`パッケージを使用してMetaplex DAS APIと相互作用できます：

DAS APIクライアントはUmiプラグインなので、DAS APIクライアントと合わせてUmiをインストールする必要があります。

以下の場所からumiとプラグインをインストールできます。

```js
npm install @metaplex-foundation/umi
npm install @metaplex-foundation/umi-bundle-defaults
npm install @metaplex-foundation/digital-asset-standard-api
```

インストール後、ライブラリをUmiインスタンスに登録できます。

```js
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const umi = createUmi("exampleDasProvider.com").use(dasApi());
```

このプラグインは、Metaplex DAS API仕様をサポートするあらゆるRPCで使用できます – 仕様をサポートするRPCは[RPCプロバイダーページ](/ja/rpc-providers)で見つけることができます。

注意：エンドポイントでDAS APIを「有効化」するためにRPCプロバイダーに連絡する必要がある場合があります。

{% callout title="Metaplex Core DAS API" type="note" %}
[Metaplex Core](/ja/smart-contracts/core)アセットでDASを使用する予定の場合、追加の`@metaplex-foundation/mpl-core-das`パッケージをインストールしてください：
{% /callout %}

## MPL Core用のDAS

[MPL Core](/ja/smart-contracts/core)用の[DAS拡張機能](/ja/dev-tools/das-api/core-extension)は、MPL SDKでさらに使用するための正しいタイプを直接返すのに役立ちます。また、コレクションから継承されたアセット内のプラグインを自動的に派生し、[DAS-to-Core型変換のための機能](/ja/dev-tools/das-api/core-extension/convert-das-asset-to-core)を提供します。

使用するには、まず追加パッケージをインストールしてください：

```js
npm install @metaplex-foundation/mpl-core-das
```

次に、そのパッケージをインポートします

```js
import { das } from '@metaplex-foundation/mpl-core-das';
```

この後、上記で述べたようなCore特有の機能を使用できます。
