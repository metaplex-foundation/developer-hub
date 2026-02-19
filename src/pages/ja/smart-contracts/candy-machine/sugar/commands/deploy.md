---
title: deploy
metaTitle: deploy | Sugar
description: deployコマンド。
---

すべてのアセットがアップロードされ、キャッシュファイルが正常に作成されたら、アイテムをSolanaにデプロイする準備が整います：

```
sugar deploy
```

deployコマンドは、キャッシュファイルの情報をオンチェーンのCandy Machineアカウントに書き込みます。これにより実際にCandy Machineが作成され、そのオンチェーンID（公開鍵）が表示されます — このIDを使用して[エクスプローラー](https://explorer.solana.com)でオンチェーン情報をクエリできます。デフォルト名を使用していない場合は、`-c`オプション（デフォルト`config.json`）で設定ファイルのパス、`--cache`オプション（デフォルト`cache.json`）でキャッシュファイル名を指定できます。
