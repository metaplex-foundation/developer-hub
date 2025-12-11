---
title: "アイテムを挿入"
metaTitle: "MPLX CLI - アイテム挿入コマンド"
description: "MPLX CLIを使用してアップロードされたアセットをMPL Coreキャンディマシンに挿入します。"
---

`mplx cm insert`コマンドは、キャッシュファイルからアップロードされたアセットをオンチェーンのキャンディマシンに挿入し、ミントで使用できるようにします。スマートロード検出、効率的なバッチ処理、詳細なトランザクション追跡が特徴です。

## 使用方法

```bash
# 現在のキャンディマシンディレクトリからアイテムを挿入
mplx cm insert

# 特定のキャンディマシンディレクトリからアイテムを挿入
mplx cm insert <directory>
```

## 要件

insertコマンドを実行する前に、以下があることを確認してください:

1. **アセットキャッシュ**: アップロードされたURIを含む有効な`asset-cache.json`
2. **キャンディマシン**: キャッシュにIDが含まれる作成済みのキャンディマシン
3. **ウォレット残高**: トランザクション手数料に十分なSOL
4. **ネットワークアクセス**: Solanaネットワークへの安定した接続

### 前提条件

```bash
# 1. キャンディマシンが作成されている必要があります
mplx cm create

# 2. アセットをアップロード
mplx cm upload

# 3. 次にアイテムを挿入
mplx cm insert
```

## 関連コマンド

- [`mplx cm upload`](/ja/cli/cm/upload) - アセットをアップロード (挿入前に必要)
- [`mplx cm create`](/ja/cli/cm/create) - キャンディマシンを作成 (挿入前に必要)
- [`mplx cm validate`](/ja/cli/cm/validate) - キャッシュとアップロードを検証
- [`mplx cm fetch`](/ja/cli/cm/fetch) - 挿入ステータスを確認

## 次のステップ

1. すべてのアイテムがロードされていることを確認するために**[挿入を検証](/ja/cli/cm/fetch)**
2. キャンディマシンが機能することを確認するために**[ミントをテスト](/ja/core-candy-machine/mint)**
3. 問題をチェックするために**[キャッシュとアセットを検証](/ja/cli/cm/validate)**
4. 適切なガードで**[ローンチを計画](/ja/core-candy-machine/guides)**
