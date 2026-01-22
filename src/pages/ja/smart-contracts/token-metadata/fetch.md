---
title: アセットの取得
metaTitle: アセットの取得 | Token Metadata
description: Token Metadataでアセットの様々なオンチェーンアカウントを取得する方法を学びます
---

アセットの様々なオンチェーンアカウントを作成およびミントする方法がわかったので、それらを取得する方法を学びましょう。 {% .lead %}

## デジタルアセット

[前のページ](/ja/smart-contracts/token-metadata/mint#creating-accounts)で述べたように、アセット（Fungibleかどうかに関わらず）は複数のオンチェーンアカウントを作成する必要があります。アセットのトークン標準によっては、一部のアカウントが必要でない場合があります。これらのアカウントの概要は次のとおりです：

- **Mint**アカウント（SPL Tokenプログラムから）：基盤となるSPLトークンの主要なプロパティを定義します。他のすべてのアカウントがこれから派生するため、これは任意のアセットへのエントリポイントです。
- **Metadata**アカウント：基盤となるSPLトークンに追加のデータと機能を提供します。
- **Master Edition**または**Edition**アカウント（非Fungibleのみ）：オリジナルNFTの複数のコピーを印刷することを可能にします。NFTがエディションの印刷を許可しない場合でも、**Master Edition**アカウントは、その非Fungibility性を保証するために**Mint**アカウントのMint authorityおよびFreeze authorityとして使用されるため、作成されます。

アセットの取得を簡単にするために、私たちのSDKは、アセットのすべての関連アカウントを一度に取得することを可能にする一連のヘルパーメソッドを提供しています。これらすべてのアカウントを保存するデータ型を**デジタルアセット**と呼びます。次のサブセクションでは、**デジタルアセット**を取得する様々な方法について説明します。

{% dialect-switcher title="デジタルアセットの定義" %}
{% dialect title="Umi" id="umi" %}

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

{% dialect title="Kit" id="kit" %}

```ts
import type { Address } from '@solana/addresses'
import type { Mint } from '@solana-program/token'
import type {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAsset<TMint extends string = string> = {
  address: Address<TMint>
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

{% code-tabs-imported from="token-metadata/fetch-asset" frameworks="umi,kit" /%}

### Metadataによる取得

このヘルパーは、**Metadata**アカウントの公開キーから単一の**デジタルアセット**を取得します。**Mint**アドレスを見つけるために最初に**Metadata**アカウントの内容を取得する必要があるため、前のヘルパーよりわずかに効率が劣りますが、**Metadata**公開キーのみにアクセスできる場合、これは役立ちます。

{% code-tabs-imported from="token-metadata/fetch-by-metadata" frameworks="umi,kit" /%}

### Mintリストによるすべての取得

このヘルパーは、提供されたリスト内の**Mint**公開キーの数だけの**デジタルアセット**を取得します。

{% code-tabs-imported from="token-metadata/fetch-all-by-mint-list" frameworks="umi,kit" /%}

### 作成者によるすべての取得

このヘルパーは、作成者によってすべての**デジタルアセット**を取得します。作成者は**Metadata**アカウント内の5つの異なる位置にある可能性があるため、関心のある作成者の位置も提供する必要があります。例えば、NFTのセットで最初の作成者が作成者A、2番目の作成者がBであることがわかっている場合、位置1で作成者A、位置2で作成者Bを検索したいと思うでしょう。

{% callout %}
このヘルパーはアカウントをフィルタリングするためのRPC呼び出しが必要であり、Umi SDKで利用可能です。Kit SDKの場合は、効率的なクエリのためにDAS（Digital Asset Standard）APIプロバイダーの使用を検討してください。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-creator" frameworks="umi" /%}

### 所有者によるすべての取得

このヘルパーは、所有者によってすべての**デジタルアセット**を取得します。

{% callout %}
このヘルパーはアカウントをフィルタリングするためのRPC呼び出しが必要であり、Umi SDKで利用可能です。Kit SDKの場合は、効率的なクエリのためにDAS（Digital Asset Standard）APIプロバイダーの使用を検討してください。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-owner" frameworks="umi" /%}

### 更新権限によるすべての取得

このヘルパーは、更新権限の公開キーからすべての**デジタルアセット**を取得します。

{% callout %}
このヘルパーはアカウントをフィルタリングするためのRPC呼び出しが必要であり、Umi SDKで利用可能です。Kit SDKの場合は、効率的なクエリのためにDAS（Digital Asset Standard）APIプロバイダーの使用を検討してください。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-update-authority" frameworks="umi" /%}

## トークン付きデジタルアセット

上記で言及した**デジタルアセット**データ構造は、アセットの所有者についての情報を提供しないことに注意してください。この最初の定義は、所有者に関係なく必要なオンチェーンアカウントのみに焦点を当てています。しかし、アセットのより完全な画像を提供するために、誰がそれを所有しているかを知る必要がある場合もあります。ここで**トークン付きデジタルアセット**データ構造が登場します。これは、以下のアカウントも含むデジタルアセットデータ構造の拡張です：

- **Token**アカウント（SPL Tokenプログラムから）：**Mint**アカウントとその所有者の関係を定義します。所有者が所有するトークンの数などの重要なデータを保存します。NFTの場合、数量は常に1です。
- **Token Record**アカウント（pNFTのみ）：現在の[トークンデリゲート](/ja/smart-contracts/token-metadata/delegates#token-delegates)やその役割など、[プログラマブル非Fungible](/ja/smart-contracts/token-metadata/pnfts)の追加のトークン関連情報を定義します。

Fungibleアセットの場合、同じデジタルアセットは複数のTokenアカウントを介して複数の所有者と関連付けられる可能性があることに注意してください。したがって、同じデジタルアセットに対して複数のトークン付きデジタルアセットが存在する可能性があります。

ここでも、トークン付きデジタルアセットを取得するための一連のヘルパーを提供します。

{% dialect-switcher title="トークン付きデジタルアセットの定義" %}
{% dialect title="Umi" id="umi" %}

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

{% dialect title="Kit" id="kit" %}

```ts
import type { Token } from '@solana-program/token'
import type {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAssetWithToken<TMint extends string = string> = DigitalAsset<TMint> & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}
{% /dialect-switcher %}

### Mintによる取得

このヘルパーは、**Mint**アカウントの公開キーから単一の**トークン付きデジタルアセット**を取得します。これは主に非Fungibleアセットに関連しています。Fungibleアセットにいくつ存在するかに関係なく、1つのトークン付きデジタルアセットのみを返すからです。

{% callout %}
Kit SDKはトークンアドレスまたは所有者のいずれかを知っている必要があります。所有者がわかっている場合は、以下の「Mintと所有者による取得」ヘルパーを使用してください。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-with-token-by-mint" frameworks="umi" /%}

### Mintと所有者による取得

このヘルパーは前のヘルパーよりもパフォーマンスが良いですが、アセットの所有者を知っている必要があります。

{% code-tabs-imported from="token-metadata/fetch-with-token-by-owner" frameworks="umi,kit" /%}

### 所有者によるすべての取得

このヘルパーは、指定された所有者からすべての**トークン付きデジタルアセット**を取得します。

{% callout %}
このヘルパーはアカウントをフィルタリングするためのRPC呼び出しが必要であり、Umi SDKで利用可能です。Kit SDKの場合は、効率的なクエリのためにDAS（Digital Asset Standard）APIプロバイダーの使用を検討してください。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner" frameworks="umi" /%}

### Mintによるすべての取得

このヘルパーは、**Mint**アカウントの公開キーからすべての**トークン付きデジタルアセット**を取得します。これはすべての**Token**アカウントを取得するため、Fungibleアセットに特に関連しています。

{% callout %}
このヘルパーはアカウントをフィルタリングするためのRPC呼び出しが必要であり、Umi SDKで利用可能です。Kit SDKの場合は、効率的なクエリのためにDAS（Digital Asset Standard）APIプロバイダーの使用を検討してください。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-mint" frameworks="umi" /%}

### 所有者とMintによるすべての取得

このヘルパーは、所有者と**Mint**アカウントの両方からすべての**トークン付きデジタルアセット**を取得します。これは、指定された所有者に対して複数の**Token**アカウントを持つFungibleアセットに役立ちます。

{% callout %}
このヘルパーはアカウントをフィルタリングするためのRPC呼び出しが必要であり、Umi SDKで利用可能です。Kit SDKの場合は、効率的なクエリのためにDAS（Digital Asset Standard）APIプロバイダーの使用を検討してください。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner-and-mint" frameworks="umi" /%}
