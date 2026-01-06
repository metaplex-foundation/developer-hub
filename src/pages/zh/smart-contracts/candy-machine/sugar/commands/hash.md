---
title: hash
metaTitle: hash | Sugar
description: hash 命令。
---

使用 *hiddenSettings* 时，您应该在配置文件中指定一个哈希值，以便在铸造完成并执行揭示时可以验证资产。当启用 *hiddenSettings* 时，deploy 命令会自动更新哈希值，但在某些情况下您可能需要手动修改缓存文件。

`hash` 命令计算缓存文件的哈希值并更新配置文件中的哈希值。

```
sugar hash
```

它还允许使用 `--compare` 选项将已发布的哈希值与缓存文件中的值进行比较。可以使用 `--cache` 手动指定缓存文件，或者默认使用当前目录中的 `cache.json` 文件。

针对默认的 `cache.json` 运行 `--compare`：

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi
```

针对特定缓存文件运行 `--compare`：

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi --cache my_custom_cache.json
```

{% callout %}

更新哈希值后，您需要使用 `update` 命令更新 Candy Machine 配置，以便新值在链上生效。

{% /callout %}
