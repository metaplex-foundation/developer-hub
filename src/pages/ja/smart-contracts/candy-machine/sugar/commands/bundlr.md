---
title: bundlr
metaTitle: bundlr | Sugar
description: bundlrコマンド。
---

アップロード方法としてBundlrを使用する場合、Sugarは自動的にBundlr Networkのアカウントに資金を提供してストレージコストをカバーします。アップロードが完了すると、アカウントに残金がある可能性があります。

以下のコマンドでBundlr Networkの残高を確認できます：

```
sugar bundlr balance
```

これにより、現在のキーペアの残高が取得されます。`--keypair`オプションを使用して代替キーペアを指定できます。残高（ある場合）を引き出すことができます：

```
sugar bundlr withdraw
```

引き出し終了時に、Bundlr Networkで利用可能な資金がSolanaアドレスに転送されます。
