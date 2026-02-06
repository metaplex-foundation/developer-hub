---
title: Inscriptions CLIを使った開始方法
metaTitle: CLI | Inscription
description: Inscriptions CLIを使った開始方法
---

## ワークスペースのセットアップ

[mpl-inscriptionリポジトリ](https://github.com/metaplex-foundation/mpl-inscription/)をクローンします。

```bash
git clone https://github.com/metaplex-foundation/mpl-inscription.git
```

CLIはリポジトリの`clients/cli`サブディレクトリにあります。実行する前に、まず依存関係をインストールする必要があります。

```bash
pnpm install
```

その後、以下のコマンドを使用して大量Inscribingを呼び出すことができます。オプションのコマンドは示されます

## NFTをダウンロード

このコマンドは、inscribeされるアセットを初期化するために使用されます。ダウンロードプロセスは、実行ディレクトリにキャッシュフォルダを作成し、そこにNFTに関連するJSON（.json）およびメディア（.png、.jpg、.jpeg）ファイルを他のCLIコマンド用のデータを保存する.metadataファイルと一緒に保存します。各ファイルの名前は、inscribeされるNFTのミントアドレスになります。

inscribeされるJSONやメディアファイルを手動で上書きしたい場合は、キャッシュディレクトリ内の該当ファイルを、代わりにinscribeしたいファイルに置き換えてください。

{% dialect-switcher title="NFTアセットをダウンロードします。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli download hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## コストを見積もる（オプション）

このコマンドを使用して、NFTをinscribeする総コストを決定できます。キャッシュディレクトリ内のアカウントオーバーヘッドとファイルサイズに基づいて、NFTをinscribeするSOLレントコストを計算します。

{% dialect-switcher title="総NFT Inscriptionコストを見積もります。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli cost hashlist -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## JSONフィールドをトリム（オプション）

このコマンドは、NFTに関連する.jsonファイルからJSONフィールドをトリムするために使用できます。多くの場合、NFT JSONデータにはInscriptionプロセス中のコスト削減のために削除できる廃止されたフィールドが含まれています。例えば、'seller_fee_basis_points'、'creators'、および'collection'フィールドはすべてJSONデータで廃止されており、レントコストを節約するために削除できます。さらに、descriptionフィールドは多くの場合長く、クリエイターはコスト削減のためにこれを削除したい場合があります。`--remove`オプションが提供されない場合に削除されるデフォルトフィールドは、'symbol'、'description'、'seller_fee_basis_points'、および'collection'です。

{% dialect-switcher title="JSONフィールドをトリムします。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress json --fields symbol
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 画像を圧縮（オプション）

CLIはまた、inscribeする前に画像を圧縮して、レントコストをさらに節約する機能も提供します。3つの指標で圧縮できます：

- Quality（数値1-100、デフォルト：80）（jpegにのみ適用）画像の全体的な鮮明さと利用可能な色を減らします。
- Size（数値1-100、デフォルト：100） - より小さい数値がより小さい画像で、総画像サイズを減らします。
- Extension（pngまたはjpg、デフォルト：jpg） - 画像を指定されたファイルタイプに変更します。jpegは通常pngより小さい（ただし品質が劣る）です。

{% dialect-switcher title="画像を圧縮します。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress images -q <QUALITY> -s <SIZE> -e <EXTENSION>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Inscribe

{% dialect-switcher title="NFTアセットをダウンロードします。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli inscribe hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
