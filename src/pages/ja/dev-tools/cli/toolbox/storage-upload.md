---
# Remember to also update the date in src/components/products/guides/index.js
title: ストレージへのアップロード
metaTitle: ストレージへのアップロード | Metaplex CLI
description: ファイルまたはファイルを含むディレクトリを、設定されたストレージプロバイダにアップロードします。
keywords:
  - mplx CLI
  - storage upload
  - Irys
  - Arweave
  - upload file
  - upload directory
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox storage upload`コマンドは、単一のファイルまたはディレクトリ全体を、設定されたストレージプロバイダにアップロードします。

- デフォルトでは1つのファイルをアップロードし、`--directory`を指定するとディレクトリ配下のすべてのファイルをアップロードします。
- ディレクトリのアップロードでは、各ファイルとそのURIをマッピングした`uploadCache.json`が生成されます。
- 残高が不足している場合、ストレージアカウントに自動的に入金します。
- アップロードされたコンテンツのURIとMIMEタイプを返します。

## クイックリファレンス

以下の表は、コマンドの入力、フラグ、および副作用をまとめたものです。

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox storage upload <path> [--directory]` |
| 必須引数 | `path` — ファイルパス、または`--directory`付きでディレクトリパス |
| オプションフラグ | `--directory` |
| ディレクトリ出力 | 現在のディレクトリに`uploadCache.json`を書き込みます |
| プロバイダ | アクティブなストレージプロバイダ（例: Irys） |

## 基本的な使用法

ファイルパスを渡して単一のファイルをアップロードするか、`--directory`を追加してディレクトリ内のすべてのファイルをアップロードします。

```bash
# 単一のファイルをアップロード
mplx toolbox storage upload <path>

# ディレクトリ内のすべてのファイルをアップロード
mplx toolbox storage upload <directory> --directory
```

## 引数

唯一の位置引数は、アップロードされるパスです。

- `path` *(必須)*: ファイルへのパス、または`--directory`と組み合わせる場合はディレクトリへのパス。

## フラグ

オプションフラグはディレクトリモードに切り替えます。

- `--directory`: 指定されたディレクトリ内のすべてのファイルをアップロードします。

## 例

これらの例は、単一ファイルとディレクトリのアップロードを示しています。

```bash
mplx toolbox storage upload ./metadata.json
mplx toolbox storage upload ./assets --directory
```

## 出力

単一ファイルのアップロードでは、結果のURIが出力されます。ディレクトリのアップロードでは、ファイル数とキャッシュファイルのパスが報告されます。

単一ファイル:
```
--------------------------------
    Uploaded <path>
    URI: <uri>
---------------------------------
```

ディレクトリ:
```
--------------------------------
    Successfully uploaded <N> files

    Upload cache saved to uploadCache.json
---------------------------------
```

## 注意事項

- ストレージはアクティブなストレージプロバイダを通じて入金および請求されます。ストレージ残高が不足している場合、コマンドはアップロード前に自動的に入金します。
- ストレージ残高を確認するには[`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance)を使用してください。
- ストレージアカウントに入金するには[`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund)を使用してください。
