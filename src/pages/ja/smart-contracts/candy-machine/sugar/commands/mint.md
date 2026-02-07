---
title: mint
metaTitle: mint | Sugar
description: mintコマンド。
---

`mint`コマンドは、コマンドラインからCandy MachineからNFTをミントします。

デフォルトの`cache.json`を使用する場合は、以下を使用できます：

```
sugar mint
```

それ以外の場合は、`--cache`オプションでキャッシュファイルを指定してください：

```
sugar mint --cache <CACHE>
```

`-n`オプション（例：10）を使用してミントするNFTの数を指定することもできます：

```
sugar mint -n 10
```

{% callout %}

ガードが有効になっている場合、mintコマンドを使用することはできません。

{% /callout %}
