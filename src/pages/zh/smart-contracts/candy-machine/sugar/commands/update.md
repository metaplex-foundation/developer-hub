---
title: update
metaTitle: update | Sugar
description: update 命令。
---

`update` 命令用于修改 Candy Machine 的当前配置。大多数配置设置都可以通过此命令更新，但以下情况除外：

- Candy Machine 中的项目数量只能在使用 `hiddenSettings` 时更新；
- 切换到使用 `hiddenSettings` 只有在项目数量等于 0 时才可能。切换后，您将能够更新项目数量。

要更新配置，请修改您的 config.json（或等效文件）文件并执行：

```
sugar update
```

您还可以使用 `--config` 和 `--cache` 选项指定自定义配置和缓存文件：

```
sugar update -c <CONFIG> --cache <CACHE>
```

{% callout %}

更新正在运行的 Candy Machine 时需要小心，因为设置错误的值会立即影响其功能。

{% /callout %}
