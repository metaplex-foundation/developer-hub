---
title: upload
metaTitle: upload | Sugar
description: uploadコマンド。
---

`upload`コマンドは、指定されたストレージにアセットをアップロードし、Candy Machine用のキャッシュファイルを作成します。

デフォルトのアセットフォルダの場所（例：現在のディレクトリの`assets`フォルダ）を使用してすべてのアセットをアップロードするには、以下のコマンドを使用します：

```
sugar upload
```

または、別のフォルダを指定できます：

```
sugar upload <ASSETS DIR>
```

{% callout %}

`upload`コマンドは、アップロードが正常に完了しなかった場合にいつでも再開（再実行）できます — まだアップロードされていないファイルのみが処理されます。また、メディア/メタデータファイルの内容が変更されたときに自動的に検出し、それらを再アップロードしてキャッシュファイルを適切に更新します。つまり、ファイルを変更する必要がある場合は、新しい（変更された）ファイルをアセットフォルダにコピーしてアップロードコマンドを再実行するだけです。キャッシュファイルを手動で編集する必要はありません。

{% /callout %}

## サンプル画像とメタデータ

Candy Machine用のサンプル画像とメタデータにアクセスするには、GitHubリポジトリを訪問し、緑色の`code`ボタンをクリックして`Download ZIP`を選択してzipファイルをダウンロードしてください。

[Example Candy Machine Assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

Gitがインストールされている場合は、以下のコマンドを使用してリポジトリをシステムにクローンしたり、zipコピーをダウンロードしたりできます：

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```