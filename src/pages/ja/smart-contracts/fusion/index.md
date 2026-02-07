---
title: 概要
metaTitle: 概要 | Fusion
description: Fusionを使用したコンポーザブルNFTの高レベル概要を提供します。
---

FusionはTrifleプログラムによって支えられたNFTコンポーザビリティ機能です。 {% .lead %}

{% callout %}
Please note that certain Fusion (Trifle) instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

{% protocol-fees program="fusion" /%}

TrifleプログラムはToken Metadataのエスクロー拡張機能上に構築されています。これは、TrifleのPDAをCOEのクリエイターおよびマネージャーとして使用したCreator Owned Escrow（COE）を使用しています。その目的は、NFT所有権の周辺にオンチェーンでの追跡とコンポーザビリティを追加することです。さらに、トークン所有権に関してルールと効果を指定する能力により、クリエイターが複雑な所有権モデルを実装することができます。

🔗 **役立つリンク:**

- [Token Metadataエスクロー](https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/programs/token-metadata/program/src/processor/escrow)
- [Fusionプログラム](https://github.com/metaplex-foundation/mpl-trifle/tree/master/programs/trifle)

Trifleプログラムが提供するアカウントと命令を見て、より詳しく掘り下げてみましょう。

## アカウント

### エスクロー制約モデル

制約モデルは、Trifleアカウントへの転送時および転送元での転送を可能にするために評価できる制限と要件のセットです。転送時に、コントラクトは制約モデルに対してチェックを行い、TOEへまたはTOEからトークンが転送される際に実行する必要があるチェックを決定します。1つの制約モデルは、多くの異なるNFTとそのTrifleアカウントにサービスを提供できます。

制約モデルは、スロットとして定義された制約のセットとして見ることができます。各スロットは、スロット名、制約のタイプ（None/Collection/TokenSet）、およびスロット内で許可されるトークンの数で構成されます。制約は`HashMap`として保存され、キーがスロット名、値が制約タイプとトークン制限となります。

### Trifle

TrifleアカウントはCOEによってオンチェーンで所有されるトークンを追跡するものです。また、使用される制約モデルにリンクしています。Trifleアカウントは、制約モデルのスロットセマンティクスを反映する内部HashMapとしてトークンを管理します。

## 命令

### エスクロー制約モデルアカウント作成

Trifleアカウントに使用できる制約モデルを作成します。

### Trifleアカウント作成

NFTで使用するTrifleアカウントを作成します。Trifleアカウントがチェックする必須の制約モデルアカウントが作成時に渡される必要があります。

### 転送イン

トークンをTrifleアカウントによって管理されるCreator Owned Escrowに転送します。COEへの標準的なspl-token転送を行うことは可能ですが、この命令を使用することのみが、Trifleアカウントが所有トークンを管理し追跡する唯一の方法です。この命令は、転送されるトークンが有効であることを確認するために制約モデルに対するチェックも実行します。

### 転送アウト

トークンをTrifleアカウントによって管理されるCreator Owned Escrowから転送します。この命令は、転送されるトークンが削除を許可されていることを確認するために制約モデルに対するチェックも実行します。

### エスクロー制約モデルにNone制約を追加

制約モデルでNone制約を作成します。スロット名とスロット内で許可されるトークンの数がこの時点で定義されます。

### エスクロー制約モデルにコレクション制約を追加

制約モデルでコレクション制約を作成します。スロット名、許可されるコレクション、およびスロット内で許可されるトークンの数がこの時点で定義されます。

### エスクロー制約モデルにトークン制約を追加

制約モデルでコレクション制約を作成します。スロット名、許可されるトークン、およびスロット内で許可されるトークンの数がこの時点で定義されます。

### エスクロー制約モデルから制約を削除

名前でクリアするスロットを指定して制約モデルから制約を削除します。
