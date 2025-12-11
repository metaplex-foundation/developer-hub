---
title: verify
metaTitle: verify | Sugar
description: verifyコマンド。
---

`verify`コマンドは、キャッシュファイル内のすべてのアイテムがオンチェーンに正常に書き込まれたかをチェックします：

```
sugar verify
```

デフォルトの`cache.json`以外の別のキャッシュファイルを指定するには、`--cache`オプションを使用します：

```
sugar verify --cache <CACHE>
```

デプロイが成功していれば、検証はエラーを返しません。