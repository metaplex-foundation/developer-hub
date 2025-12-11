---
title: 概要
metaTitle: 概要 | Sugar
description: Candy Machineを管理するCLIツールSugarの詳細な概要。
---

SugarはCandy Machineと対話するためのコマンドラインツールです。Candy Machineのライフサイクル全体を管理することができ、以下の利点があります：

- Candy Machineの全設定を含む単一の設定ファイル
- メディア/メタデータファイルのアップロードとCandy Machineのデプロイのパフォーマンス向上 &mdash; これらの操作はマルチスレッドシステムを活用して、必要な計算時間を大幅に短縮します
- 堅牢なエラーハンドリングと情報的なエラーメッセージによる入力検証
- コマンドが停止しても状態が維持される – 例：アップロードが失敗した場合、アップロードを再実行すると失敗したもののみが再試行されます

Sugarのセットアップは、お気に入りのターミナルアプリケーションを開いてバイナリファイルをダウンロードするだけです。

{% callout %}
Sugarを使用してCandy Machineを作成する完全なガイドは[こちら](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine)をご覧ください。

{% /callout %}

SugarにはCandy Machineの作成と管理のためのコマンドコレクションが含まれています。コマンドラインで以下を実行することで、コマンドの完全なリストを表示できます：

```bash
sugar
```

これにより、コマンドとその簡単な説明のリストが表示されます：
```
sugar-cli 2.7.1
Metaplex Candy Machineを作成・管理するためのコマンドラインツール。

USAGE:
    sugar [OPTIONS] <SUBCOMMAND>

OPTIONS:
    -h, --help                     ヘルプ情報を出力
    -l, --log-level <LOG_LEVEL>    ログレベル: trace, debug, info, warn, error, off
    -V, --version                  バージョン情報を出力

SUBCOMMANDS:
    airdrop       Candy MachineからNFTをエアドロップ
    bundlr        Bundlrネットワークとのやりとり
    collection    Candy Machine上のコレクションを管理
    config        Candy Machineの設定を管理
    deploy        キャッシュアイテムをオンチェーンのCandy Machine設定にデプロイ
    freeze        フリーズガードアクションを管理
    guard         Candy Machine上のガードを管理
    hash          隠し設定用のキャッシュファイルのハッシュを生成
    help          このメッセージまたは指定されたサブコマンドのヘルプを出力
    launch        アセットからCandy Machineデプロイメントを作成
    mint          Candy MachineからNFTを1つミント
    reveal        隠し設定のCandy MachineからNFTを公開
    show          既存のCandy Machineのオンチェーン設定を表示
    sign          Candy MachineからNFTを1つまたはすべて署名
    upload        アセットをストレージにアップロードし、キャッシュ設定を作成
    validate      JSONメタデータファイルを検証
    verify        アップロードされたデータを確認
    withdraw      Candy Machineアカウントから資金を引き出してクローズ
```

特定のコマンド（例：`deploy`）に関する詳細情報を取得するには、helpコマンドを使用します：

```
sugar help deploy
```

これにより、オプションとその簡単な説明のリストが表示されます：

```
キャッシュアイテムをオンチェーンのCandy Machine設定にデプロイ

USAGE:
    sugar deploy [OPTIONS]

OPTIONS:
    -c, --config <CONFIG>
            設定ファイルへのパス、デフォルトは "config.json" [default: config.json]

        --cache <CACHE>
            キャッシュファイルへのパス、デフォルトは "cache.json" [default: cache.json]

        --collection-mint <COLLECTION_MINT>
            Candy Machineがトークンをミントする先のオプションのコレクションアドレス

    -h, --help
            ヘルプ情報を出力

    -k, --keypair <KEYPAIR>
            キーペアファイルへのパス、Sol設定を使用するか、"~/.config/solana/id.json"をデフォルト

    -l, --log-level <LOG_LEVEL>
            ログレベル: trace, debug, info, warn, error, off

    -p, --priority-fee <PRIORITY_FEE>
            優先度手数料の値 [default: 500]

    -r, --rpc-url <RPC_URL>
            RPC URL
```

Ape16Zが委託したOtterSecによるSugarの監査レポートは[こちら](https://docsend.com/view/is7963h8tbbvp2g9)でご覧いただけます。