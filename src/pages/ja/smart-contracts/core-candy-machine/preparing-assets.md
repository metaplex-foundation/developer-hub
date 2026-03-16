---
title: Core Candy Machineのアセット準備
metaTitle: アセットの準備 | Core Candy Machine
description: Solana上のCore Candy Machineにアップロードするための画像ファイル、アニメーションメディア、JSONメタデータの準備方法。
keywords:
  - NFT metadata
  - JSON metadata
  - asset preparation
  - Arweave
  - IPFS
  - image upload
  - Core Candy Machine assets
  - NFT collection
  - metadata standard
  - Irys uploader
  - Solana NFT images
  - NFT animation files
  - Umi storage plugin
  - decentralized storage
about:
  - Asset preparation
  - NFT metadata
  - File uploads
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machineアセットに最適な画像フォーマットは何ですか？
    a: PNGとJPEGがウォレットとマーケットプレイス全体で最も広くサポートされているフォーマットです。PNGはピクセルアートや透明度を必要とする画像に最適で、JPEGは写真やハイディテールなアートワークに小さなファイルサイズで適しています。可能な限りファイルサイズを1 MB以下に保つために、画像をWeb配信用に最適化してください。
  - q: NFTメタデータと画像にどのストレージプロバイダーを使用すべきですか？
    a: Arweave（Irys経由）はSOLで支払える永続的で分散型のストレージを提供するため、最も人気のある選択肢です。IPFSも分散型の選択肢ですが、永続性を確保するためにピニングサービスが必要です。セルフホストソリューション（AWS、Google Cloud）も機能しますが、中央集権化と継続的なメンテナンスコストが発生します。
  - q: Core Candy MachineアセットにIPFSを使用できますか？
    a: はい、IPFS URIはCore Candy Machineアセットで機能します。ただし、ファイルにアクセスできる状態を維持するために、Pinata、nft.storage、または専用のIPFSノードなどのピニングサービスを使用する必要があります。ピン留めされていないIPFSコンテンツは、時間の経過とともにアクセスできなくなる可能性があります。
  - q: JSONメタデータファイルを作成する前に画像をアップロードする必要がありますか？
    a: はい。JSONメタデータファイルは「image」フィールドと「properties.files」配列で画像URIを参照します。まずすべての画像とアニメーションファイルをアップロードし、URIを収集してから、メタデータ自体をアップロードする前に各対応するJSONメタデータファイルにそれらのURIを挿入する必要があります。
  - q: 1,000アイテムのコレクションに必要なファイル数は？
    a: 1,000アイテムのコレクションには、最低1,000個の画像ファイルと1,000個のJSONメタデータファイル、さらにCoreコレクション自体用の追加の画像1枚とJSONメタデータファイル1つが必要です。アセットにアニメーションファイル（ビデオ、オーディオ、VR、HTML）が含まれる場合、1,000個のアニメーションファイルも必要になります。
---

## Summary

[Core Candy Machine](/ja/smart-contracts/core-candy-machine)のアセット準備には、画像ファイルとJSONメタデータをストレージプロバイダーにアップロードし、その後ミントされたすべてのアセットをグループ化する[Coreコレクション](/ja/smart-contracts/core/collections)を作成する必要があります。

- Arweave（Irys経由）やIPFSなどの分散型ストレージ、またはセルフホストソリューションに画像とアニメーションファイルをアップロード {% .lead %}
- Metaplexトークン標準に準拠したJSONメタデータファイルを構築し、アップロードされた画像URIを埋め込む {% .lead %}
- 完成したJSONメタデータファイルをアップロードし、config lineとして使用するために生成されたURIを記録 {% .lead %}
- Candy Machineからミントされるすべてのアセットの親として機能する[Core](/ja/smart-contracts/core)コレクションを作成 {% .lead %}

## 必要なアセットファイル

Core Candy Machineからミントされるすべての[Core](/ja/smart-contracts/core)アセットには、マシンを[作成](/ja/smart-contracts/core-candy-machine/create)して配置する前に、2つのカテゴリの準備されたファイルが必要です。
これらには以下が含まれます：

- 画像とアニメーションファイル。
- JSONメタデータファイル。

## サポートされるアセットタイプ

Coreアセットは、ウォレットとマーケットプレイスがコンテンツをレンダリングする方法を決定する5つのメディアカテゴリをサポートしています：

- image
- video
- audio
- vr
- html

## 画像の準備

画像ファイルは各アセットの主要なビジュアル表現として機能し、すべてのウォレットとマーケットプレイスで表示されます。フォーマットの制限は強制されていませんが、画像をWeb配信用に最適化することがベストプラクティスです。すべてのユーザーが高速のインターネット接続にアクセスできるわけではなく、遠隔地のユーザーは大きなファイルの読み込みに苦労する可能性があるため、画像を1 MB以下に保つことで、すべてのオーディエンスの体験が向上します。

アセットのタイプが`audio`、`video`、`html`、または`vr`であっても、これらの他のアセットタイプの読み込みをサポートしていない可能性があるウォレットやマーケットプレイスなどの領域でフォールバックとして使用されるため、画像を準備する価値があります。

## アニメーションとメディアファイルの準備

アニメーションとメディアファイルは、残りのアセットカテゴリ`audio`、`video`、`vr`、`html`をカバーします。画像に適用されるのと同じファイルサイズの考慮事項がここにも適用されます -- エンドユーザーのダウンロード時間を最小化するために、ファイルをできるだけ小さくしてください。

以下のファイルタイプは、ほぼすべての主要なウォレットとマーケットプレイスで動作することがテスト・確認されています。

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## JSONメタデータファイルの準備

JSONメタデータファイルは、各アセットのオンチェーン属性、名前、説明、メディア参照を定義します。これらのファイルは、NFT、pNFT、cNFTを含む他のMetaplexアセットタイプで使用されるのと同じトークン標準に従います。

{% partial file="token-standard-full.md" /%}

## 画像とメタデータのジェネレータ

いくつかのオープンソーススクリプトとWebアプリケーションが、レイヤードアートワークから大量のアセット画像とJSONメタデータファイルを生成できます。アートレイヤーとプロジェクトパラメータを提供すると、ジェネレータが画像-メタデータペアの完全なセットを生成します。

| 名前                                                        | タイプ   | 難易度 | 要件 | 無料 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

## アセットファイルのアップロード

すべての画像とアニメーションファイルは、JSONメタデータで参照される前にストレージプロバイダーにアップロードする必要があります。ストレージプロバイダーの選択は、永続性、コスト、分散化に影響します。

### ストレージオプション

#### Arweave/Irys

_「Arweaveネットワークは、データのためのBitcoinのようなものです：開かれた台帳の中の永続的で分散されたウェブ。」- [arweave.org](https://arweave.org)_

Arweaveはそれ自身のブロックチェーンであるため、ファイルをArweaveに保存するためにはブリッジを使用する必要があります。[Irys](https://irys.xyz/)はSolanaとArweaveの間の仲介者として機能し、ARの代わりにSOLでストレージの支払いを行えるようにし、Arweaveチェーンへのデータアップロードを代行してくれます。

独自の[SDK](https://docs.irys.xyz/)を通じて手動で実装するか、[Umiストレージプラグイン](/ja/dev-tools/umi/storage)を使用してIrys経由でArweaveにアップロードできます。

#### セルフホスティング

AWS、Google Cloud、または独自のウェブサーバーでの画像とメタデータのセルフホスティングは有効なオプションです。保存された場所からデータにアクセス可能で、CORSの制限によってブロックされていなければ問題なく機能します。セルフホストのファイルがウォレットとマーケットプレイスで正しく表示されることを確認するために、いくつかのテスト用[Core](/ja/smart-contracts/core)アセットまたは小規模なCore Candy Machineを最初に作成することをお勧めします。

### Umiでのファイルアップロード

[Umi](/ja/dev-tools/umi)はアップロードプロセスを簡素化するストレージプラグインを提供します。現時点で以下のプラグインがサポートされています：

- Irys
- AWS

#### UmiでIrys経由でArweaveにアップロード

Umiでファイルをアップロードすることについてより詳しく見るには、[Umi Storage](/ja/dev-tools/umi/storage)を参照してください。

{% dialect-switcher title="UMIでIrys経由でArweaveにファイルをアップロード" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi("https://api.devnet.solana.com").use(irysUploader())

const uriUploadArray = await umi.uploader.upload([myFile1, myFile2])

console.log(uriUploadArray)
```

{% /dialect %}
{% /dialect-switcher %}

### JSONメタデータファイルに画像URIを割り当て

すべての画像とアニメーションファイルがストレージプロバイダーにアップロードされたら、返されたURIを各対応するJSONメタデータファイルに挿入する必要があります。アセットコレクションが1,000のアセットを持っている場合、1,000の画像またはアニメーションファイルをアップロードし、各ファイルがどこに保存されたかを示すURIのセットを受け取る必要があります。アップロードプラットフォームがバッチアップロードをサポートしていない場合、リンクを手動でログ・保存する必要があるかもしれません。

この時点での目標は、アップロードされたすべてのメディアのURIの完全なリストを持つことです。

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

## Coreコレクションの作成

アセット準備の最後のステップは、Core Candy Machineがミントされたすべてのアセットをグループ化するために使用する[Coreコレクション](/ja/smart-contracts/core/collections)を作成することです。これには`mpl-core`パッケージが必要です。

{% callout %}
Coreコレクションを作成するために必要なデータを持つために、前のステップのように画像をアップロードし、JSONメタデータを準備・アップロードする必要があります。
{% /callout %}

以下の例では、プラグインのない基本的なCoreコレクションを作成します。利用可能なプラグインのリストとより高度な[Coreコレクション](/ja/smart-contracts/core/collections)作成を表示するには、[Collection Management](/ja/smart-contracts/core/collections)でドキュメントを参照してください。

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

## Notes

- すべての画像をWeb配信用に最適化してください。デバイスとネットワーク条件全体で高速な読み込みを確保するために、可能な限りファイルサイズを1 MB以下に保ちましょう。
- セルフホスティングのアセットの場合、CORSヘッダーが正しく設定されていることを確認してください。CORSによってブロックされたアセットはウォレットやマーケットプレイスでレンダリングされません。
- アップロードされたすべてのURIを安全に保存してバックアップしてください。画像のアップロード後にURIリストを失うと、メタデータを正しいファイルにリンクできなくなります。
- Arweaveストレージは永続的で不変です。Arweaveに保存されたファイルは削除または変更できないため、アップロード前にファイルの内容を再確認してください。
- JSONメタデータファイルは、画像ファイルの*後に*アップロードする必要があります。メタデータはアップロード完了後にのみ利用可能な画像URIを参照するためです。

## まとめ

この時点で、[Core Candy Machineの作成](/ja/smart-contracts/core-candy-machine/create)に必要なすべての準備を完了しているはずです。

- 画像とその他のメディアファイルをアップロード。
- JSONメタデータファイルに画像とメディアファイルのURIを割り当て。
- JSONメタデータファイルをアップロードし、URIを保存。
- [Coreコレクション](/ja/smart-contracts/core/collections)を作成。

## FAQ

### Core Candy Machineアセットに最適な画像フォーマットは何ですか？

PNGとJPEGがウォレットとマーケットプレイス全体で最も広くサポートされているフォーマットです。PNGはピクセルアートや透明度を必要とする画像に最適で、JPEGは写真やハイディテールなアートワークに小さなファイルサイズで適しています。可能な限りファイルサイズを1 MB以下に保つために、画像をWeb配信用に最適化してください。

### NFTメタデータと画像にどのストレージプロバイダーを使用すべきですか？

Arweave（Irys経由）はSOLで支払える永続的で分散型のストレージを提供するため、最も人気のある選択肢です。IPFSも分散型の選択肢ですが、永続性を確保するためにピニングサービスが必要です。セルフホストソリューション（AWS、Google Cloud）も機能しますが、中央集権化と継続的なメンテナンスコストが発生します。

### Core Candy MachineアセットにIPFSを使用できますか？

はい、IPFS URIはCore Candy Machineアセットで機能します。ただし、ファイルにアクセスできる状態を維持するために、Pinata、nft.storage、または専用のIPFSノードなどのピニングサービスを使用する必要があります。ピン留めされていないIPFSコンテンツは、時間の経過とともにアクセスできなくなる可能性があります。

### JSONメタデータファイルを作成する前に画像をアップロードする必要がありますか？

はい。JSONメタデータファイルは`image`フィールドと`properties.files`配列で画像URIを参照します。まずすべての画像とアニメーションファイルをアップロードし、URIを収集してから、メタデータ自体をアップロードする前に各対応するJSONメタデータファイルにそれらのURIを挿入する必要があります。

### 1,000アイテムのコレクションに必要なファイル数は？

1,000アイテムのコレクションには、最低1,000個の画像ファイルと1,000個のJSONメタデータファイル、さらに[Coreコレクション](/ja/smart-contracts/core/collections)自体用の追加の画像1枚とJSONメタデータファイル1つが必要です。アセットにアニメーションファイル（ビデオ、オーディオ、VR、HTML）が含まれる場合、1,000個のアニメーションファイルも必要になります。

## Glossary

| Term | Definition |
| --- | --- |
| JSON Metadata | アセットの名前、説明、画像URI、属性、関連メディアファイルを定義するMetaplexトークン標準に準拠した構造化されたJSONファイル。 |
| URI | Uniform Resource Identifier -- アップロードされたファイル（画像、アニメーション、またはメタデータ）が保存され、取得できるWebアドレス。 |
| Arweave | 不変のデータ保存用に設計された永続的で分散型のストレージブロックチェーン。Arweaveにアップロードされたファイルは永久に保持されます。 |
| Irys | Solanaユーザーが SOLでArweaveストレージの支払いを行えるブリッジサービス（旧Bundlr）で、クロスチェーンアップロードプロセスを処理します。 |
| IPFS | InterPlanetary File System -- ピアツーピアの分散型ストレージプロトコル。長期的なファイル可用性を保証するためにピニングサービスが必要です。 |
| Config Line | 単一のアセットのJSONメタデータファイルをストレージにマッピングする、Core Candy Machineに挿入される名前-URIペア。 |
| Core Collection | 関連するアセットをグループ化するMetaplex Coreのオンチェーンアカウントで、Candy Machineからミントされるすべてのアセットの親コレクションとして機能します。 |
| Token Standard | NFTメタデータに必要なフィールドとオプションフィールド（name、description、image、attributes、properties）を指定するMetaplex定義のJSONスキーマ。 |

