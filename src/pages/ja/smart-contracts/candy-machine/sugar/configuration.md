---
title: 設定ファイル
metaTitle: 設定ファイル | Sugar
description: Sugar設定ファイルの詳細な概要。
---

Sugarは、アセットをアップロードしてCandy Machineを設定するためのJSON設定ファイルを使用します – ほとんどの場合、ファイルは`config.json`という名前になります。設定には、Candy Machineの初期化と更新に使用される設定、およびミントされるアセットのアップロードが含まれます。また、ミントへのアクセス制御を提供するガードの設定も含まれます。

基本的な設定ファイルを以下に示します：

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

設定ファイルは3つの主要な部分で構成されています：Candy Machine設定（`"tokenStandard"`から`"hiddenSettings"`）、アップロード設定（`"uploadMethod"`から`"sdriveApiKey"`）、ガード設定（`"guards"`）。

## Candy Machine設定

Candy Machine設定は、アセットのタイプ、利用可能なアセット数、およびメタデータ情報を決定します。

| 設定 | オプション | 値/型 | 説明               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandard |   |                 |                           |
|         |         | "nft"           | Non-Fungible asset（`NFT`）        |
|         |         | "pnft"           | Programmable Non-Fungible asset（`pNFT`） |
| number  |         | Integer         | 利用可能なアイテム数 |
| symbol  |         | String          | NFTのシンボルを表す文字列 |
| sellerFeeBasisPoint  |         | Integer          | クリエイターが共有するロイヤリティのベーシスポイント（550は5.5%を意味する）  |
| isMutable |       | Boolean         | NFTのMetadata Accountを更新できるかどうかを示すブール値 |
| isSequential |    | Boolean         | ミント時に順次インデックス生成を使用するかどうかを示すブール値 |
| ruleSet  |        | Public Key | *（オプション）* ミントされた`pNFT`によって使用されるルールセット |

`creators`設定では、最大4つのアドレスとその割合シェアを指定できます。

| 設定 | オプション | 値/型 | 説明               |
| ------- | ------- | --------------- | ------------------------- |
| creators |        | 最大4人のクリエイター | クリエイターのリストとロイヤリティの割合シェア |
|          | address | Public Key | クリエイターの公開鍵 |
|          | share | Integer | `0`から`100`の間の値 |

{% callout %}

オンチェーンのメタデータには最大5人のクリエイターが保存されますが、Candy Machineはクリエイターの1人として設定されます。その結果、最大4人のクリエイターまでに制限されます。

シェア値の合計は100になる必要があります。そうでなければエラーが生成されます。

{% /callout %}

Candy MachineはNFTがミントされる時に最終的なメタデータを持たないように設定できます。これは、ミントが完了した後にリビール段階を計画している場合に便利です。この場合、*隠された*NFTの「プレースホルダー」メタデータ値を指定できます：

| 設定 | オプション | 値/型 | 説明               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | name | String | ミントの名前（`sugar reveal`が機能するように、`$ID$`または`$ID+1$`ミントインデックス置換変数を使用する必要があります） |
| | uri | String | ミントのURI（`$ID$`または`$ID+1$`ミントインデックス置換変数を使用可能） |
| | hash | String | 32文字のハッシュ（ほとんどの場合、これはミント番号とメタデータ間のマッピングを持つキャッシュファイルのハッシュで、ミント完了時に順序を確認できるようにする。`sugar hash`を使用して見つけることができます）

{% totem %}
{% totem-accordion title="hiddenSettings 例" %}
設定ファイルの`hiddenSettings`セクションは次のようになります：
```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```
{% /totem-accordion %}
{% /totem %}

## アップロード設定

Sugarは様々なストレージプロバイダーをサポートしています – 使用するものは`uploadMethod`設定で定義されます。プロバイダーによっては、追加の設定が必要になります。

以下の表は利用可能な設定の概要を提供します：

| 設定 | オプション | 許可される値 | 説明               |
| ------- | ------- | --------------- | ------------------------- |
| uploadMethod |   |  | 画像とメタデータをアップロードするストレージを設定 |  
|  |   | "bundlr" |  [Bundlr](https://bundlr.network)を使用してArweaveにアップロード、支払いはSOLで行われます（mainnetとdevnetの両方で動作；devnetではファイルは7日間のみ保存）
|  |   | "aws" | Amazon Web Services（AWS）にアップロード |
|  |   | "pinata" | [Pinata](https://www.pinata.cloud)にアップロード（すべてのネットワークで動作；無料および階層サブスクリプション） |
|  |   | "sdrive" | [SDrive Cloud Storage](https://sdrive.app)を使用してShadow Driveにアップロード |
|awsConfig | | | *（"aws"が使用される場合に必須）* |
| | bucket | String | AWSバケット名
| | profile | String | 資格情報ファイル名から使用するAWSプロファイル |
| | directory | String | アイテムをアップロードするバケット内のディレクトリ。空文字列はバケットのルートディレクトリにファイルをアップロードすることを意味します。 |
| pinataConfig | | | *（"pinata"が使用される場合に必須）* |
| | JWT | String | JWT認証トークン |
| | apiGateway | String | Pinata APIに接続するURL |
| | apiContent | String | アセットリンクを作成するためのベースとして使用するURL |
| | parallelLimit | Integer | 同時アップロード数；この設定を使用してレート制限を回避 |
| sdriveApiKey | | String | SDrive APIキー *（"sdrive"が使用される場合に必須）* |

特定のアップロード方法の設定：

{% totem %}
{% totem-accordion title="Bundlr" %}

`"bundlr"`アップロード方法には追加の設定は必要ありません。アップロードに関連する費用は、設定されたキーペアを使用して`SOL`で支払われます。

{% /totem-accordion %}
{% totem-accordion title="AWS" %}

`"aws"`方法はファイルをAmazon S3ストレージにアップロードします。これには追加の設定が必要で、設定ファイルの`"awsConfig"`の下で`bucket`、`profile`、`directory`、`domain`の値を指定し、システムで資格情報を設定する必要があります。ほとんどの場合、これには以下のプロパティを含む`~/.aws/credentials`ファイルを作成することが含まれます：

```
[default]
aws_access_key_id=<ACCESS KEY ID>
aws_secret_access_key=<SECRET ACCESS KEY>
region=<REGION>
```

また、`"public-read"`を有効にするためにバケットのACL権限を正しく設定し、異なるオリジンからリクエストされるコンテンツアクセスを有効にするためにクロスオリジンリソース共有（CORS）ルールを適用することも重要です（ウォレットやブロックチェーンエクスプローラーがメタデータ/メディアファイルを読み込むために必要）。これらの設定に関する詳細情報は以下で見つけることができます：

* [バケットポリシーの例](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)
* [CORS設定](https://aws.amazon.com/premiumsupport/knowledge-center/s3-configure-cors/)

`profile`値により、資格情報ファイルから読み取るプロファイルを指定できます。`directory`値は、ファイルがアップロードされるバケット内のディレクトリの名前で、単一のバケット内に異なるディレクトリで分離された複数のCandy Machineやコレクションを持つことができます。これを空文字列のままにしておくと、ファイルはバケットのルートにアップロードされます。（オプションの）`domain`を使用すると、AWSからデータを提供するためのカスタムドメインを指定できます — 例：ドメインを`https://mydomain.com`として使用すると、`https://mydomain.com/0.json`の形式でファイルへのリンクが作成されます。ドメインを指定しない場合、デフォルトのAWS S3ドメインが使用されます（`https://<BUCKET_NAME>.s3.amazonaws.com`）。

{% /totem-accordion %}
{% totem-accordion title="Pinata" %}

`"pinata"`方法はファイルをPinataストレージにアップロードします。設定ファイルの`"pinataConfig"`の下で`jwt`、`apiGateway`、`contentGateway`、`parallelLimit`の値を指定する必要があります：

* `jwt`: JWT認証トークン
* `apiGateway`: Pinata APIに接続するURL（パブリックAPIエンドポイントには`https://api.pinata.cloud`を使用）
* `contentGateway`: アセットリンクを作成するためのベースとして使用するURL（パブリックゲートウェイには`https://gateway.pinata.cloud`を使用）
* `parallelLimit`: （オプション）同時アップロード数、レート制限を回避するためにこの値を調整

{% callout %}

パブリックゲートウェイは本番環境での使用を意図していません — テスト用には適していますが、大幅にレート制限されており、スピード向けに設計されていません。

{% /callout %}

{% /totem-accordion %}
{% totem-accordion title="SDrive" %}

SDriveはGenesysGo Shadow Drive上に構築されたストレージアプリです。APIキー（トークン）を取得するためにアカウントを登録する必要があり、これを設定ファイルの`"sdriveApiKey"`で指定する必要があります。

{% /totem-accordion %}
{% /totem %}

## ガード設定

`guards`設定では、Candy Machineで有効にするガードを指定できます。

Candy Machineは、ミントへのアクセス制御を提供する多数のガードをサポートしています。[ガード](#/candy-machine/guards)は「デフォルト」[ガードグループ](#/candy-machine/guard-groups)に設定するか、複数のガードグループに表示させることができます。