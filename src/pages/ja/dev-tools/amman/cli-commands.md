---
title: CLIコマンド
metaTitle: CLIコマンド | Amman
description: Metaplex AmmanローカルバリデータツールキットのCLIコマンド。
---

```sh
amman [command]

Commands:
  amman start    solana-test-validatorと、設定された場合はammanリレーや
                 モックストレージを起動します
  amman stop     リレーとストレージを停止し、実行中のsolanaテスト
                 バリデータを終了します
  amman logs     'solana logs'を起動し、美化機能を通してパイプします
  amman airdrop  指定されたSolをペイヤーにエアドロップします
  amman label    アカウントやトランザクションのラベルをammanに追加します
  amman account  PublicKeyまたはラベルのアカウント情報を取得するか、
                 すべてのラベル付きアカウントを表示します
  amman run      すべてのアドレスラベルを展開した後で、指定された
                 コマンドを実行します

Options:
  --help     ヘルプを表示                                               [boolean]
  --version  バージョン番号を表示                                        [boolean]
```

## コマンドの実行

```sh
npx amman start <config.js>
```

`config.js`が提供されない場合、_amman_は現在のディレクトリで`.ammanrc.js`ファイルを探します。
それも見つからない場合は、デフォルト設定を使用します。

package.jsonスクリプトにAmmanを追加した場合は、お好みのパッケージインストーラーからAmmanをそれぞれ実行できます。

```sh
// npm
npm run amman:start

// yarn
yarn amman:start

// pnpm
pnpm run amman:start
```
