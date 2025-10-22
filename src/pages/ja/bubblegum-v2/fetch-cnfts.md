---
title: 圧縮NFTの取得
metaTitle: 圧縮NFTの取得 | Bubblegum V2
description: Bubblegumで圧縮NFTを取得する方法を学びます。
---

[概要](/ja/bubblegum#read-api)ページで述べたように、圧縮NFTは通常のNFTのようにオンチェーンアカウント内に保存されるのではなく、それらを作成し更新したトランザクションにログされます。 {% .lead %}

そのため、圧縮NFTの取得を容易にするために特別なインデクサーが作成されました。このインデックス化されたデータは、**Metaplex DAS API**と呼ぶSolana RPCメソッドの拡張を通じて利用できます。実際、DAS APIは任意の**デジタルアセット**を取得できます。これは圧縮NFT、通常のNFT、またはFungibleアセットでもかまいません。

すべてのRPCがDAS APIをサポートしているわけではないため、圧縮NFTを扱う予定がある場合は、RPCプロバイダーを慎重に選択する必要があります。Metaplex DAS APIをサポートするすべてのRPCのリストを[専用ページ](/ja/rpc-providers)で維持していることに注意してください。

このページでは、Metaplex DAS APIを使用して圧縮NFTを取得する方法を学習します。

## Metaplex DAS API SDKのインストール

Metaplex DAS APIをサポートするRPCプロバイダーを選択したら、特別なRPCメソッドを送信して圧縮NFTを取得できます。ただし、私たちのSDKは、ヘルパーメソッドを提供することでDAS APIを開始するより便利な方法を提供します。SDKを使用してMetaplex DAS APIを開始するには、以下の手順に従ってください。

{% totem %}

{% dialect-switcher title="Metaplex DAS APIを開始" %}
{% dialect title="JavaScript" id="js" %}

{% totem-prose %}
Umiを使用する場合、Metaplex DAS APIプラグインは`mplBubblegum`プラグイン内に自動的にインストールされます。そのため、すでに準備完了です！

`mplBubblegum`プラグイン全体をインポートせずに_のみ_DAS APIプラグインを使用したい場合は、Metaplex DAS APIプラグインを直接インストールできます：

```sh
npm install @metaplex-foundation/digital-asset-standard-api
```

その後、Umiインスタンスでライブラリを登録します：

```ts
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

umi.use(dasApi());
```
{% /totem-prose %}