---
title: mint
metaTitle: mint | Sugar
description: mint 命令。
---

`mint` 命令从命令行从 Candy Machine 铸造 NFT。

使用默认的 `cache.json` 时，可以使用：

```
sugar mint
```

否则，使用 `--cache` 选项指定您的缓存文件：

```
sugar mint --cache <CACHE>
```

您还可以使用 `-n` 选项指定要铸造的 NFT 数量（例如 10）：

```
sugar mint -n 10
```

{% callout %}

如果启用了守卫，则无法使用 mint 命令。

{% /callout %}
