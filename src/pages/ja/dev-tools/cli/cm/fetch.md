---
title: "情報を取得"
metaTitle: "MPLX CLI - キャンディマシン情報取得"
description: "MPLX CLIを使用してMPL Coreキャンディマシン情報を取得して表示します。設定、ガード設定、アイテムステータス、デプロイ詳細を表示。"
---

`mplx cm fetch`コマンドは、設定、ガード設定、アイテムステータス、デプロイ詳細を含むキャンディマシンに関する包括的な情報を取得して表示します。このコマンドは、キャンディマシンのセットアップを監視および検証するために不可欠です。

## 使用方法

```bash
# 現在のキャンディマシンディレクトリから情報を取得
mplx cm fetch

# アドレスで特定のキャンディマシンを取得
mplx cm fetch <candy_machine_address>

```

fetchコマンドは詳細情報用の追加フラグをサポートしています:

- `--items`: ロードされたアイテムに関する詳細情報を含める

## 関連コマンド

- [`mplx cm create`](/ja/dev-tools/cli/cm/create) - 取得するキャンディマシンを作成
- [`mplx cm insert`](/ja/dev-tools/cli/cm/insert) - アイテムをロード (アイテム数に影響)
- [`mplx cm validate`](/ja/dev-tools/cli/cm/validate) - キャッシュとオンチェーンデータを検証
- [`mplx cm withdraw`](/ja/dev-tools/cli/cm/withdraw) - ステータス確認後にクリーンアップ
