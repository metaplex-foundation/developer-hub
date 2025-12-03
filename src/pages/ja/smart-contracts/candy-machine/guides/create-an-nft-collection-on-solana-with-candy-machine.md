---
title: Candy Machineを使用してSolanaでToken Metadata NFTコレクションを作成
metaTitle: Candy Machineを使用してSolanaでToken Metadata TM NFTコレクションを作成 | Candy Machine
description: Candy Machineを使用してSolanaブロックチェーンでNFTコレクションを作成する方法。
---

SolanaでNFTコレクションをローンチしたい場合、Sugar CLIツールキットが、より複雑なセットアップと管理手順の一部を抽象化し、Solanaブロックチェーン上でCandy Machineを作成するための自動化されたローンチシステムを提供します。

## 前提条件

- Solana CLIがインストールされ、設定されていること。[インストール](https://docs.solanalabs.com/cli/install)
  - CLIを使用して生成されたファイルシステムウォレット
  - メインネットまたはdevnet SOLで資金調達されたウォレット

## 初期セットアップ

### Sugarのインストール

#### Mac/Linux

```
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

#### Windows

以下のURLからインストール実行ファイルをダウンロードしてSugarをインストールできます：

```
https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe
```

ダブルクリックしてバイナリを実行してみてください。信頼されていないバイナリに関する警告ポップアップが表示された場合は、「詳細情報」をクリックして「とにかく実行」をクリックしてください。

## アセットの準備

NFTには2つの基本的な部分があります：`image`と`metadata`です。

imageはウォレットやマーケットで展示・表示されるものであり、`metadata`には`name`、`image`を見つけるリンク、NFTの`attributes`など、ブロックチェーン上のそのNFTに関するすべての関連情報が含まれています。

### Assetsフォルダー

Sugarからコマンドを実行する際、Sugarはコマンドを起動したディレクトリで`assets`フォルダーを見つけることを期待します。

あなたの画像とメタデータファイルの両方が`assets`フォルダーに保存されます。

### ファイル命名

画像とメタデータJSONファイルは、0から始まる増分インデックス命名規則に従うことが期待されます。

インデックスが不足している場合や、`image`と`metadata`フォルダーに同じ数のファイルが含まれていない場合、フォルダー検証は失敗します。

```
assets/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

### メタデータJSON

{% partial file="token-standard-full.md" /%}

```json
{
  "name": "My NFT #1",
  "description": "My NFT Collection",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
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
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

### 例となる画像とメタデータ

Candy Machineを作成するために例となる画像とメタデータを使用したい場合は、GitHubから緑の`code`ボタンをクリックして`zip format`を選択することでzip形式でダウンロードできます。

[https://github.com/metaplex-foundation/example-candy-machine-assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

または、gitがインストールされている場合は、アセットをシステムにクローンするか、提供されたリンクからzipコピーをダウンロードできます

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```

### 画像とメタデータジェネレーター

レイヤーからアートワーク画像とメタデータを生成する必要がある場合、画像レイヤーとプロジェクトに関するいくつかの基本情報をジェネレーターに提供すると、与えられたパラメーターに基づいてx個のアセット画像とJSONメタデータの組み合わせを生成する自動化されたスクリプトやウェブサイトがいくつかあります。

| 名前                                                        | タイプ   | 難易度     | 要件         | 無料 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

### コレクション詳細

コレクションの作成には、NFTアセットと同様の詳細が必要です：`image`ファイルと`metadata`jsonファイルです。これらは`asset/`フォルダーのルートに以下のように配置されます：

```
assets/
├─ collection.jpg/
├─ collection.json/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

コレクションメタデータファイルは、NFTアセットjsonファイルと同じフォーマットです。コレクションの場合、`attributes`フィールドの記入を省略できます。

```json
{
  "name": "My Collection",
  "description": "This is My Nft Collection",
  "image": "collection.jpg",
  "external_url": "https://example.com",
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

## Sugar

デフォルトでは、**Sugar**はSolana CLIが使用する同じ設定ファイルを使用して以下のようなデフォルト値をロードします：

- Solana CLIによって設定されたウォレット
- Solana CLIによって設定されたRPC URL

### Sugarローンチ

assetsフォルダーが整っている状態で、**Sugar**でデプロイメントプロセスを開始できます。最初に実行するコマンドは以下です：

```shell
sugar launch
```

これにより、**Sugar**のCLIプロセスが開始され、Candy Machineのデプロイメントに関する情報を収集します。

`sugar`が設定ファイルを見つけられない場合、作成するよう求められます。

以下の質問があなたに出されますので、記入してください：

```
Found xx file pairs in "assets". Is this how many NFTs you will have in your candy machine?
```

```
Found symbol "xxxx" in your metadata file. Is this value correct?
```

```
Found value xxx for seller fee basis points in your metadata file. Is this value correct?
```

```
Do you want to use a sequential mint index generation? We recommend you choose no.
```

```
How many creator wallets do you have? (max limit of 4)
```

作成者ウォレットはロイヤルティを分配するために使用されます。選択した場合、各ウォレットの`address`と`share`の量を入力するよう求められます。

```
Which extra features do you want to use? (use [SPACEBAR] to select options you want and hit [ENTER] when done)
```

このガイドでは、`hidden settings`を選択せずにそのまま`enter`を押して進めます。

```
What upload method do you want to use?
```

このガイドでは`Bundlr`を選択します。

```
Do you want your NFTs to remain mutable? We HIGHLY recommend you choose yes.
```

このオプションで「yes(y)」を選択して、将来必要に応じてNFTを編集できるようにします。

Sugarは以下のプロセスを開始するはずです：

- コレクションNFTの作成とアップロード
- Irys（旧Bundlr）を使用してアセットをArweaveにアップロード
- Candy Machineの作成

成功した場合、以下のようなメッセージが表示されますが、リンク内には独自のCandy Machineアドレスが含まれます：

```
https://www.solaneyes.com/address/Beag81WvAPUCeFpJ2qFnvd2f1CFCpQBf3abTJXA1fH9o?cluster=devnet
```

おめでとうございます！Solana上でCandy Machineを作成しました。
上記のリンクをクリックすると、チェーン上のCandy Machine詳細を表示できます。

### GuardとGroupsでCandy Machineを更新

現在、あなたのCandy MachineにはGuardが添付されていません。デフォルトでは、Candy GuardがCandy Machineに添付されていない場合、**ミント権限**（あなた）のみがCandy Machineからミントできます。

これを解決するために、Candy MachineにGuardを添付する必要があります。これにより、一連のルールに従って公開でCandy Machineからミントできるようになります。例えば、ユーザーに1 SOLを課金しながら公開でCandy Machineからミントできるようにしたい場合があります。これには**Sol Payment Guard**を使用できます。

#### Guard（SOL Payment）の追加

Candy MachineにSol Payment Guardを追加するには、ターミナルで`sugar launch`を起動したフォルダーのルートにあるSugarが生成した`config.json`ファイルを開く必要があります。

設定ファイルは以下のようになります：

```json
{
  "tokenStandard": "nft",
  "number": 16,
  "symbol": "NUMBERS",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "creators": [
    {
      "address": "B1kwbSHRiXFPYvNbuhCX92ibngzxdmfBzfaJYuy9WYp5",
      "share": 100
    }
  ],
  "uploadMethod": "bundlr",
  "ruleSet": null,
  "awsConfig": null,
  "sdriveApiKey": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "hiddenSettings": null,
  "guards": null,
  "maxEditionSupply": null
}
```

ここで、設定ファイルの最後にある`guards`フィールドを編集し、SOL Paymentの送金先アドレスを記入できます。

```json
"guards": {
    "default": {
        "solPayment": {
            "value": 1,
            "destination": "11111111111111111111111111111111"
        }
    }
},
```

`config.json`にガードを追加したら、ファイルを保存して以下のコマンドを実行してください：

```
sugar guard add
```

以前にすでにCandy Guardを作成していた場合は、代わりに以下のコマンドを実行できます：

```
sugar guard update
```

これによりCandy Guardが作成され、デフォルトガードリストに**SOL Payment Guard**が追加されます。

## Candy Machineの表示

ターミナルでCandy Machineの詳細を表示するには、以下のコマンドを実行できます：

```shell
sugar show
```

これにより、すべての挿入されたアイテムを除いたCandy MachineとGuardの詳細がすべてリストされます。

## Candy Guardの表示

ターミナルでCandy Machineの詳細を表示するには、以下のコマンドを実行できます：

```shell
sugar guard show
```

これにより、すべての挿入されたアイテムを除いたCandy MachineとGuardの詳細がすべてリストされます。

## 次のステップ

機能するCandy Machineができたので、人々がCandy Machineからミントできるように、Candy MachineをWeb UIでホストする必要があります。

独自のUIを生成して`umi`クライアントラッパーと`mpl-candy-machine` SDKを使用するか、構築済みのコミュニティUIを使用してCandy Machineの詳細を単純に提供することができます。

### UI開発リソース

- nextJS/React推奨
- Metaplex Umi - [https://developers.metaplex.com/umi](https://developers.metaplex.com/umi)
- Metaplex Candy Machine SDK - [https://developers.metaplex.com/candy-machine](https://developers.metaplex.com/candy-machine)

### さらなる読み物
- [Sugar CLIドキュメント](/ja/candy-machine/sugar)