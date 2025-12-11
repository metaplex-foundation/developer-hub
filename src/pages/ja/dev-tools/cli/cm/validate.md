---
title: "キャッシュを検証"
metaTitle: "MPLX CLI - キャッシュ検証コマンド"
description: "MPLX CLIを使用してキャンディマシンアセットキャッシュとアップロードを検証します。包括的な検証、エラー検出、キャッシュ整合性検証。"
---

`mplx cm validate`コマンドは、すべてのアセットが適切にアップロードされアクセス可能であることを確認するためにアセットキャッシュファイルを検証します。包括的な検証、エラー検出、キャッシュ整合性検証を提供します。

## 使用方法

```bash
# 現在のキャンディマシンディレクトリでキャッシュを検証
mplx cm validate

# 特定のキャッシュファイルを検証
mplx cm validate <path_to_asset_cache>

# オンチェーン挿入を検証 (キャンディマシンが存在する必要があります)
mplx cm validate --onchain
```

検証コマンドが問題を示す場合、エラーに応じて、アセットの問題を確認するか、uploadまたはinsertコマンドを実行することをお勧めします。

## 関連コマンド

- [`mplx cm upload`](/ja/cli/cm/upload) - アセットをアップロードしてキャッシュを作成
- [`mplx cm create`](/ja/cli/cm/create) - キャンディマシンを作成
- [`mplx cm insert`](/ja/cli/cm/insert) - 検証されたアセットを挿入
- [`mplx cm fetch`](/ja/cli/cm/fetch) - キャンディマシンのステータスを確認

## 次のステップ

1. 検証中に見つかった**[問題を修正](/ja/cli/cm/upload)**
2. キャッシュが有効な場合は**[キャンディマシンを作成](/ja/cli/cm/create)**
3. アセットをロードするために**[アイテムを挿入](/ja/cli/cm/insert)**
4. 成功を確認するために**[デプロイを監視](/ja/cli/cm/fetch)**
