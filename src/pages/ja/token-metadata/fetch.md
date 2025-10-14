---
title: アセットの取得
metaTitle: アセットの取得 | Token Metadata
description: Token Metadataでアセットの様々なオンチェーンアカウントを取得する方法を学びます
---

アセットの様々なオンチェーンアカウントを作成およびミントする方法がわかったので、それらを取得する方法を学びましょう。 {% .lead %}

## デジタルアセット

[前のページ](/jp/token-metadata/mint#creating-accounts)で述べたように、アセット（Fungibleかどうかに関わらず）は複数のオンチェーンアカウントを作成する必要があります。アセットのトークン標準によっては、一部のアカウントが必要でない場合があります。これらのアカウントの概要は次のとおりです：

- **Mint**アカウント（SPL Tokenプログラムから）：基盤となるSPLトークンの主要なプロパティを定義します。他のすべてのアカウントがこれから派生するため、これは任意のアセットへのエントリポイントです。
- **Metadata**アカウント：基盤となるSPLトークンに追加のデータと機能を提供します。
- **Master Edition**または**Edition**アカウント（非Fungibleのみ）：オリジナルNFTの複数のコピーを印刷することを可能にします。NFTがエディションの印刷を許可しない場合でも、**Master Edition**アカウントは、その非Fungibility性を保証するために**Mint**アカウントのMint authorityおよびFreeze authorityとして使用されるため、作成されます。

アセットの取得を簡単にするために、私たちのSDKは、アセットのすべての関連アカウントを一度に取得することを可能にする一連のヘルパーメソッドを提供しています。これらすべてのアカウントを保存するデータ型を**デジタルアセット**と呼びます。次のサブセクションでは、**デジタルアセット**を取得する様々な方法について説明します。

{% dialect-switcher title="デジタルアセットの定義" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import { Mint } from '@metaplex-foundation/mpl-toolbox'
import {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAsset = {
  publicKey: PublicKey
  mint: Mint
  metadata: Metadata
  edition?:
    | ({ isOriginal: true } & MasterEdition)
    | ({ isOriginal: false } & Edition)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Mintによる取得

このヘルパーは、**Mint**アカウントの公開キーから単一の**デジタルアセット**を取得します。

{% dialect-switcher title="Mintでアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAsset(umi, mint)
```

{% /dialect %}
{% /dialect-switcher %}

### Metadataによる取得

このヘルパーは、**Metadata**アカウントの公開キーから単一の**デジタルアセット**を取得します。**Mint**アドレスを見つけるために最初に**Metadata**アカウントの内容を取得する必要があるため、前のヘルパーよりわずかに効率が劣りますが、**Metadata**公開キーのみにアクセスできる場合、これは役立ちます。

{% dialect-switcher title="Metadataでアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAssetByMetadata } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetByMetadata(umi, metadata)
```

{% /dialect %}
{% /dialect-switcher %}

### Mintリストによるすべての取得

このヘルパーは、提供されたリスト内の**Mint**公開キーの数だけの**デジタルアセット**を取得します。

{% dialect-switcher title="Mintリストでアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'

const [assetA, assetB] = await fetchAllDigitalAsset(umi, [mintA, mintB])
```

{% /dialect %}
{% /dialect-switcher %}

### 作成者によるすべての取得

このヘルパーは、作成者によってすべての**デジタルアセット**を取得します。作成者は**Metadata**アカウント内の5つの異なる位置にある可能性があるため、関心のある作成者の位置も提供する必要があります。例えば、NFTのセットで最初の作成者が作成者A、2番目の作成者がBであることがわかっている場合、位置1で作成者A、位置2で作成者Bを検索したいと思うでしょう。

{% dialect-switcher title="作成者でアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetByCreator } from '@metaplex-foundation/mpl-token-metadata'

// 作成者が創作者配列の最初にあるアセット。
const assetsA = await fetchAllDigitalAssetByCreator(umi, creator)

// 作成者が創作者配列の2番目にあるアセット。
const assetsB = await fetchAllDigitalAssetByCreator(umi, creator, {
  position: 2,
})
```

{% /dialect %}
{% /dialect-switcher %}

### 所有者によるすべての取得

このヘルパーは、所有者によってすべての**デジタルアセット**を取得します。

{% dialect-switcher title="所有者でアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetByOwner(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### 更新権限によるすべての取得

このヘルパーは、更新権限の公開キーからすべての**デジタルアセット**を取得します。

{% dialect-switcher title="更新権限でアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetByUpdateAuthority } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetByUpdateAuthority(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

## トークン付きデジタルアセット

上記で言及した**デジタルアセット**データ構造は、アセットの所有者についての情報を提供しないことに注意してください。この最初の定義は、所有者に関係なく必要なオンチェーンアカウントのみに焦点を当てています。しかし、アセットのより完全な画像を提供するために、誰がそれを所有しているかを知る必要がある場合もあります。ここで**トークン付きデジタルアセット**データ構造が登場します。これは、以下のアカウントも含むデジタルアセットデータ構造の拡張です：

- **Token**アカウント（SPL Tokenプログラムから）：**Mint**アカウントとその所有者の関係を定義します。所有者が所有するトークンの数などの重要なデータを保存します。NFTの場合、数量は常に1です。
- **Token Record**アカウント（pNFTのみ）：現在の[トークンデリゲート](/jp/token-metadata/delegates#token-delegates)やその役割など、[プログラマブル非Fungible](/jp/token-metadata/pnfts)の追加のトークン関連情報を定義します。

Fungibleアセットの場合、同じデジタルアセットは複数のTokenアカウントを介して複数の所有者と関連付けられる可能性があることに注意してください。したがって、同じデジタルアセットに対して複数のトークン付きデジタルアセットが存在する可能性があります。

ここでも、トークン付きデジタルアセットを取得するための一連のヘルパーを提供します。

{% dialect-switcher title="トークン付きデジタルアセットの定義" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { Token } from '@metaplex-foundation/mpl-toolbox'
import {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAssetWithToken = DigitalAsset & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}
{% /dialect-switcher %}

### Mintによる取得

このヘルパーは、**Mint**アカウントの公開キーから単一の**トークン付きデジタルアセット**を取得します。これは主に非Fungibleアセットに関連しています。Fungibleアセットにいくつ存在するかに関係なく、1つのトークン付きデジタルアセットのみを返すからです。

{% dialect-switcher title="Mintでトークン付きアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetWithTokenByMint(umi, mint)
```

{% /dialect %}
{% /dialect-switcher %}

### Mintと所有者による取得

このヘルパーは前のヘルパーよりもパフォーマンスが良いですが、アセットの所有者を知っている必要があります。

{% dialect-switcher title="Mintでトークン付きアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAssetWithAssociatedToken } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetWithAssociatedToken(umi, mint, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### 所有者によるすべての取得

このヘルパーは、指定された所有者からすべての**トークン付きデジタルアセット**を取得します。

{% dialect-switcher title="所有者でトークン付きアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByOwner } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByOwner(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### Mintによるすべての取得

このヘルパーは、**Mint**アカウントの公開キーからすべての**トークン付きデジタルアセット**を取得します。これはすべての**Token**アカウントを取得するため、Fungibleアセットに特に関連しています。

{% dialect-switcher title="所有者でトークン付きアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByMint(umi, mint)
```

{% /dialect %}
{% /dialect-switcher %}

### 所有者とMintによるすべての取得

このヘルパーは、所有者と**Mint**アカウントの両方からすべての**トークン付きデジタルアセット**を取得します。これは、指定された所有者に対して複数の**Token**アカウントを持つFungibleアセットに役立ちます。

{% dialect-switcher title="MintとOwnerでトークン付きアセットを取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByOwnerAndMint } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByOwnerAndMint(
  umi,
  owner,
  mint
)
```

{% /dialect %}
{% /dialect-switcher %}