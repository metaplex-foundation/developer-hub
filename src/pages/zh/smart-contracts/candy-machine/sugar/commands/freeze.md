---
title: freeze
metaTitle: freeze | Sugar
description: freeze 命令。
---

当 Candy Machine 启用了冻结守卫时，可以使用 `freeze` 命令来管理其不同阶段。

在默认守卫或单个组上启用冻结守卫后，需要在铸造开始前初始化它。要初始化冻结守卫，请使用 `initialize` 子命令：

```
sugar freeze initialize --period <SECONDS>
```

其中 `--period` 决定铸造的资产将被冻结的时间间隔（以秒为单位）。在此期限后，持有者可以解冻他们的资产。

如果冻结守卫不在 `default` 组中，还需要添加 `--label <LABEL>`。

{% callout %}

您只能初始化一次冻结。初始化后，无法更新期限。

{% /callout %}

要解冻资产，可以使用 `thaw` 子命令：

```
sugar freeze thaw <NFT MINT>
```

您还可以使用 `--all` 选项解冻同一 Candy Machine 的所有 NFT：

```
sugar freeze thaw --all
```

一旦所有 NFT 都解冻，就可以解锁资金：

```
sugar freeze unlock-funds
```
