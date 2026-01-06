---
title: guard
metaTitle: guard | Sugar
description: guard 命令。
---

`guard` 命令用于管理 Candy Machine 的[守卫](/zh/smart-contracts/candy-machine/guards)配置。

在 Sugar 配置文件中完成守卫配置后，您可以使用以下命令添加 Candy Guard：

```
sugar guard add
```

此时，`mint` 命令将停止工作，因为 `mint authority` 现在是 Candy Guard。

要更新 Candy Guard 配置，您首先需要在 Sugar 配置文件中进行所需的修改，然后运行命令：

```
sugar guard update
```

要打印 Candy Machine 守卫的链上配置，请使用命令：

```
sugar guard show
```

要从 Candy Machine 移除守卫，请使用命令：

```
sugar guard remove
```

移除守卫后，您可以使用 `mint` 命令从 Candy Machine 铸造。

`remove` 命令不会关闭 Candy Guard 账户。要关闭账户并取回租金费用，请使用命令：

```
sugar guard withdraw
```
