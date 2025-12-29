---
title: アセットの準備
metaTitle: アセットの準備 | Core Candy Machine
description: Core Candy Machineにアップロードするためのファイルとアセットの準備方法。
---

## アセットファイル

アセットを作成するには、アセットデータで使用するために準備・アップロードする必要があるいくつかの異なるファイルが必要です。
これらには以下が含まれます：

- 画像とアニメーションファイル。
- JSONメタデータファイル。

## アセットタイプ

アセットは以下のカテゴリをサポートしています：

- image
- video
- audio
- vr
- html

## 画像の準備

画像に関する固有のルールはありませんが、可能な限り`web deliverable`になるように画像を最適化することがベストプラクティスです。すべてのユーザーが超高速のブロードバンド接続にアクセスできるわけではないことを考慮する必要があります。ユーザーはインターネットへのアクセスが希少な遠隔地にいる可能性があるため、8mbの画像を表示させようとするとプロジェクトでの体験に影響を与える可能性があります。

アセットのタイプが`audio`、`video`、`html`、または`vr`であっても、これらの他のアセットタイプの読み込みをサポートしていない可能性があるウォレットやマーケットプレイスなどの領域でフォールバックとして使用されるため、画像を準備する価値があります。

## アニメーションファイルの準備

アニメーションファイルは、残りのアセットカテゴリタイプ`audio`、`video`、`vr`、`html`で構成されます。

ここでも画像ファイルの準備と同じことが適用されます。ファイルサイズとユーザーの予想ダウンロードサイズを考慮する必要があります。

以下のファイルタイプは、ほぼすべての主要なウォレットとマーケットプレイスで動作することがテスト・確認されています。

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## JSONメタデータの準備

JSONメタデータファイルは、NFT、pNFT、cNFTの他のMetaplex標準で使用されているものと同じToken Standardに従います。

{% partial file="token-standard-full.md" /%}

## 画像とメタデータのジェネレータ

アートレイヤーとプロジェクトに関する基本情報をジェネレータに提供すると、指定されたパラメータに基づいてx個のアセット画像とJSONメタデータの組み合わせを生成してくれる自動化されたスクリプトやウェブサイトがいくつかあります。

| 名前                                                        | タイプ   | 難易度 | 要件 | 無料 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

## ファイルのアップロード

### ストレージオプション

#### Arweave/Irys

_「Arweaveネットワークは、データのためのBitcoinのようなものです：開かれた台帳の中の永続的で分散されたウェブ。」- [arweave.org](https://arweave.org)_

Arweaveはそれ自身のブロックチェーンであるため、ファイルをArweaveに保存するためにはブリッジを使用する必要があります。[Irys](https://irys.xyz/)はSolanaとArweaveの間の仲介者として機能し、ARの代わりにSOLでストレージの支払いを行えるようにし、Arweaveチェーンへのデータアップロードを代行してくれます。

独自の[SDK](https://docs.irys.xyz/)を通じて手動で実装するか、UMIプラグインを使用してIrys経由でArweaveにアップロードできます。

#### nftStorage

_「私たちの低コストで使いやすいソリューションでNFTを保存してください。スマートコントラクトによって動力を与えられ、究極の透明性のための私たちのもうすぐオンチェーンになる基金によって支援される、検証可能な長期ストレージを保証することを目的としています。」- [nftStorage](https://nft.storage/)_

nftStorageはファイルをIPFS（InterPlanetary File System）ネットワークにアップロードします。

nftStorageにアップロードするには、彼らの[API](https://app.nft.storage/v1/docs/intro)ドキュメントに従うことができます。

#### セルフホスティング

AWS、Google Cloud、さらには独自のウェブサーバーで画像やメタデータをセルフホスティングすることも全く問題ありません。保存された場所からデータにアクセス可能で、CORSのようなものがブロックしていなければ問題ないはずです。セルフホストオプションをテストして、保存されたデータが表示可能であることを確認するために、いくつかのテスト用Coreアセットまたは小規模なCore Candy Machineを作成することをお勧めします。

### UMIでのファイルアップロード

Umiには、プラグインを通じてアップロードプロセスを支援するいくつかのプラグインがあります。現時点で以下のプラグインがサポートされています：

- Irys
- AWS 

#### UMIでIrys経由でArweaveにアップロード

UMIでファイルをアップロードすることについてより詳しく見るには、[Umi Storage](/ja/dev-tools/umi/storage)を参照してください。

{% dialect-switcher title="UMIでIrys経由でArweaveにファイルをアップロード" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>").use(irysUploader())

const uriUploadArray = await umi.uploader.upload([myFile1, myFile2])

console.log(uriUploadArray)
```

{% /dialect %}
{% /dialect-switcher %}

### JSONメタデータファイルに画像URIを割り当て

選択したストレージメディアにすべてのimgファイルをアップロードしたら、すべての画像URIをJSONメタデータファイルに配置する必要があります。

アセットコレクションが1000のアセットを持っている場合、1000の画像/アニメーションメディアをストレージプラットフォームにアップロードし、各画像/アニメーションメディアがどこに保存されたかを示すデータセット/ログ/方法を受け取る必要があります。選択したアップロードプラットフォームがバッチアップロードをサポートしていない場合、単一ループでアップロードする必要があり、リンクを手動でログ・保存する必要があるかもしれません。

この時点での目標は、メディアが保存されている場所のURIの完全なリストを持つことです。

```js
[
  https://example.com/1.jpg
  https://example.com/2.jpg
  ...
]

```

アップロードされたメディアのインデックスURIリストを使用して、JSONメタデータファイルをループし、適切な場所にURIを追加する必要があります。

画像URIは`image:`フィールドに、そして`properties: files: []`配列にも挿入されます。

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg", <---- ここに入力。
  ...
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }, <---- files配列にオブジェクトエントリを作成。
    ]
  }
}
```

### JSONメタデータファイルのアップロード

この時点で、以下のような形のJSONメタデータファイルのフォルダがマシン上にローカルで構築されているはずです：

{% dialect-switcher title="1.json" %}
{% dialect title="Json" id="json" %}

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }
    ],
    "category": "image"
  }
}
```

{% /dialect %}
{% /dialect-switcher %}

すべてのJSONメタデータを選択したストレージメディアにアップロードし、将来の使用のためにすべてのURIを再度ログに記録する必要があります。

## コレクションアセットの作成

Core Candy Machine作成の準備の最後のステップは、Core Candy Machineがユーザーがコア Candy Machineから購入するすべてのアセットをグループ化するために使用できるCoreコレクションを作成することです。これには`mpl-core`パッケージが必要です。

{% callout %}
Coreコレクションを作成するために必要なデータを持つために、前のステップのように画像をアップロードし、JSONメタデータを準備・アップロードする必要があります。
{% /callout %}

以下の例では、プラグインのない基本的なCoreコレクションを作成します。利用可能なプラグインのリストとより高度なCoreコレクション作成を表示するには、Coreの[Collection Management](/ja/smart-contracts/core/collections)でドキュメントを参照してください。

{% dialect-switcher title="MPL Coreコレクションを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, umi } from '@metaplex-foundation/umi'
import { createCollectionV1 } from '@metaplex-foundation/mpl-core'

const mainnet = 'https://api.mainnet-beta.solana.com'
const devnet = 'https://api.devnet.solana.com'

const keypair = // keypairを割り当て

const umi = createUmi(mainnet)
.use(keypairIdentity(keypair)) // 選択したidentity signerを割り当て。
.use(mplCore())

const collectionSigner = generateSigner(umi)

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## まとめ

この時点で、Core Candy Machineを作成するために必要なすべての準備を完了しているはずです。

- 画像とその他のメディアファイルをアップロード。
- JSONメタデータファイルに画像とメディアファイルのURIを割り当て。
- JSONメタデータファイルをアップロードし、URIを保存。
- Coreコレクションを作成。