---
title: validate
metaTitle: validate | Sugar
description: validateコマンド。
---

`validate`コマンドは、assetsフォルダ内のすべてのファイルが正しい形式であるかをチェックするために使用されます：

```
sugar validate
```

アセットがデフォルトの`assets`以外のフォルダにある場合は、フォルダ名を指定できます：

```
sugar validate <ASSETS FOLDER>
```

{% callout %}

アップロードプロセスを繰り返す必要を避けるために、アップロード前にアセットを検証することが重要です。

{% /callout %}