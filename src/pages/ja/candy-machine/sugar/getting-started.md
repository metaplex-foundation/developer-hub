---
title: はじめに
metaTitle: はじめに | Sugar
description: Sugarの使用開始。
---

開始するには、まずシステムにSugarがインストールされていることを確認してください：

```bash
sugar --version
```

上記のコマンドでSugarのバージョンが印刷されるはずです – 例：`sugar-cli 2.5.0`。

デフォルトでは、Sugarは`solana-cli`のキーペアとRPC設定を使用します。現在の設定を確認するには、以下を実行してください：

```bash
solana config get
```

異なる設定を行うには、以下を実行してください：

```bash
solana config set --url <rpc url> --keypair <path to keypair file>
```

{% callout %}

SugarはシステムにSolana CLIがインストールされている必要はありません。Sugarのすべてのコマンドは、使用する値を設定するための`-k`（キーペア）と`-r`（RPC）フラグを受け入れます。

{% /callout %}

## ファイルの準備

プロジェクト用のフォルダを作成し、その中に`assets`という名前のフォルダを作成して、JSONメタデータと画像ファイルのペアを`0.json`、`0.png`、`1.json`、`1.png`という命名規則で保存します。メタデータの拡張子は`.json`で、画像ファイルは`.png`、`.gif`、`.jpg`、`.jpeg`が使用できます。さらに、コレクションNFTの情報を含む`collection.json`と`collection.png`ファイルが必要です。

プロジェクトディレクトリは次のようになります：
{% diagram %}
{% node %}
{% node #my-project label="my-project/" theme="blue" /%}
{% /node %}

{% node parent="my-project" y="50" x="100" %}
{% node #assets label="assets/" theme="indigo" /%}
{% /node %}

{% node #0-json parent="assets" y="50" x="100" label="0.json" theme="mint" /%}
{% node #0-png parent="assets" y="95" x="100" label="0.png" theme="mint" /%}
{% node #1-json parent="assets" y="140" x="100" label="1.json" theme="orange" /%}
{% node #1-png parent="assets" y="185" x="100" label="1.png" theme="orange" /%}
{% node #2-json parent="assets" y="230" x="100" label="2.json" theme="mint" /%}
{% node #2-png parent="assets" y="275" x="100" label="2.png" theme="mint" /%}
{% node #more parent="assets" y="320" x="100" label=". . ." theme="orange" /%}
{% node #collection-json parent="assets" y="365" x="100" label="collection.json" theme="purple" /%}
{% node #collection-png parent="assets" y="410" x="100" label="collection.png" theme="purple" /%}

{% edge from="my-project" to="assets" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="0-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="0-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="1-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="1-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="2-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="2-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="more" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="collection-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="collection-png" fromPosition="bottom" toPosition="left" /%}
{% /diagram %}

## Sugarの実行

プロジェクトディレクトリ内で、`launch`コマンドを使用して、設定ファイルの作成とCandy MachineのSolanaへのデプロイのインタラクティブなプロセスを開始します：

```bash
sugar launch
```

launchコマンドの実行が完了すると、Candy Machineがオンチェーンにデプロイされます。`mint`コマンドを使用してNFTをミントできます：

```bash
sugar mint
```

すべてのNFTがミントされたら、Candy Machineをクローズしてアカウントレントを回収できます：

```bash
sugar withdraw
```

{% callout %}

`withdraw`コマンドは、Candy Machineが空でない場合でもクローズするため、注意して使用してください。

{% /callout %}