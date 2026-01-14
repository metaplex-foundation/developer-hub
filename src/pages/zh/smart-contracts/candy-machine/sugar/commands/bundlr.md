---
title: bundlr
metaTitle: bundlr | Sugar
description: bundlr 命令。
---

当您使用 Bundlr 作为上传方法时，Sugar 会自动为您在 Bundlr 网络上的账户注资以支付存储费用。上传完成后，账户中可能会有剩余资金。

您可以使用以下命令验证您在 Bundlr 网络上的余额：

```
sugar bundlr balance
```

这将检索当前密钥对的余额。您可以使用 `--keypair` 选项指定其他密钥对。剩余余额（如果有）可以提取：

```
sugar bundlr withdraw
```

提取结束时，Bundlr 网络上的可用资金将转移到您的 Solana 地址。
