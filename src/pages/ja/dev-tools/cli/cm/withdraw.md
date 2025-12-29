---
title: "引き出し"
metaTitle: "MPLX CLI - キャンディマシン引き出し"
description: "MPLX CLIを使用してMPL Coreキャンディマシンを引き出して削除し、レントSOLを回収します。"
---

`mplx cm withdraw`コマンドは、キャンディマシンを引き出して削除し、残っているSOL残高を回収し、オンチェーンアカウントをクリーンアップします。この操作は元に戻せず、キャンディマシンが不要になった場合に使用する必要があります。すでにミントされたNFTは影響を受けません。

{% callout title="元に戻せません" type="warning" %}
このコマンドは元に戻せません。実行すると、キャンディマシンは破壊され、再作成できません。
{% /callout %}

## 使用方法

```bash
# 現在のディレクトリからキャンディマシンを引き出し
mplx cm withdraw

# アドレスで特定のキャンディマシンを引き出し
mplx cm withdraw --address <candy_machine_address>

```

使用できるオプションフラグ:

- `--address`: キャンディマシンアドレスを直接指定
- `--force`: *危険* 確認プロンプトをスキップ (細心の注意を払って使用)

### ⚠️ 元に戻せない操作

- **永久削除**: キャンディマシンアカウントは永久に削除されます
- **回復不可**: 元に戻すことも復元することもできません
- **データ損失**: すべてのオンチェーン設定と状態が失われます
- **ミントされたNFT**: 既存のミントされたNFTは影響を受けません

### 🛡️ ベストプラクティス

**計画:**

- 引き出しのタイミングを慎重に計画
- チームメンバーと調整

**実行:**

- すべてのパラメータを再確認
- 練習のためにdevnetを使用

## 関連コマンド

- [`mplx cm fetch`](/ja/dev-tools/cli/cm/fetch) - 引き出し前にステータスを確認
- [`mplx cm create`](/ja/dev-tools/cli/cm/create) - 新しいキャンディマシンを作成
- [`mplx cm validate`](/ja/dev-tools/cli/cm/validate) - 引き出し前に検証
- [`solana balance`](https://docs.solana.com/cli) - 回収された残高を確認
