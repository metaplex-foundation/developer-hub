---
title: withdraw
metaTitle: withdraw | Sugar
description: withdraw 命令。
---

当 Candy Machine 的铸造完成后，可以收回用于支付链上存储数据租金的资金。您可以通过运行以下命令启动提取：

```
sugar withdraw --candy-machine <CANDY MACHINE ID>
```

其中 `<CANDY MACHINE ID>` 是 Candy Machine ID（公钥）——由 `deploy` 命令提供的 ID。

也可以从与当前密钥对关联的所有 Candy Machine 中提取资金：

```
sugar withdraw
```

或者，您可以列出当前密钥对的所有 Candy Machine 及其关联资金：

```
sugar withdraw --list
```

{% callout %}

您不应该提取正在运行的 Candy Machine 的租金，因为当您清空其账户时，Candy Machine 将停止工作。

{% /callout %}
