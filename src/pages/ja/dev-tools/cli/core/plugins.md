---
title: プラグイン
metaTitle: プラグイン | Metaplex CLI
description: MPLコアアセットとコレクションプラグインの管理
---

`mplx core plugins`コマンドを使用すると、MPLコアアセットとコレクション用のプラグインを管理できます。プラグインは、追加の機能と能力でアセットとコレクションの機能を拡張します。

## プラグインの追加

アセットまたはコレクションにプラグインを追加します。

### 基本的な使用法

```bash
mplx core plugins add <assetId> [options]
```

### オプション
- `--wizard`: プラグインを選択および設定するためのインタラクティブウィザードモード
- `--collection`: ターゲットがコレクションであることを示すフラグ（デフォルト：false）

### 方法

#### 1. ウィザードモードの使用
```bash
mplx core plugins add <assetId> --wizard
```
これにより以下が行われます：
1. プラグインタイプを選択するためのインタラクティブウィザードを起動
2. プラグイン設定をガイド
3. 設定されたプラグインをアセット/コレクションに追加

#### 2. JSONファイルの使用
```bash
mplx core plugins add <assetId> ./plugin.json
```
JSONファイルは、以下の形式でプラグイン設定を含む必要があります：
```json
{
  "pluginType": {
    "property1": "value1",
    "property2": "value2"
  }
}
```

### 例

#### アセットにプラグインを追加
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard
```

#### コレクションにプラグインを追加
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard --collection
```

#### JSONを使用してプラグインを追加
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa ./my-plugin.json
```

## 出力

プラグインの追加が成功した後、コマンドは以下を表示します：
```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## 注意事項

- ウィザードモードは、プラグインを選択および設定するためのインタラクティブな方法を提供します
- アセットとコレクション用に異なるプラグインが利用可能です
- プラグイン設定は、プラグインの要件に従って有効である必要があります
- アセットまたはコレクションにプラグインを追加するために適切な権限が必要です
- コマンドは以下を自動的に処理します：
  - プラグインタイプの検証
  - 設定の検証
  - トランザクションの署名と確認
  - 権限の確認