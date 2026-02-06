---
title: 概述
metaTitle: 概述 | Toolbox
description: 一个旨在通过为 Solana 原生程序提供一组基本函数来补充 Umi 的包。
---

**mpl-toolbox** 包旨在通过为 Solana 原生程序提供一组基本函数来补充 Umi。

{% quick-links %}

{% quick-link title="API 参考" icon="CodeBracketSquare" target="_blank" href="<https://mpl-toolbox.typedoc.metaplex.com/>" description="正在寻找特定内容？查看我们的 API 参考并找到您的答案。" /%}

{% /quick-links %}

## 安装

{% packagesUsed packages=["toolbox"] type="npm" /%}

使用 Umi 包时默认不包含此包，因此要安装并开始使用它，您需要运行以下命令

```
npm i @metaplex-foundation/mpl-toolbox
```

## 包含的程序

虽然 Umi 和其他 Metaplex 产品已经提供了包含所有入门必要函数的综合包，但它们不包含用于较低级别但关键任务的必要辅助函数和功能，特别是在处理 Solana 原生程序时。例如，仅使用 Umi，无法使用 SPL System Program 创建账户或从 SPL Address Lookup Table 程序扩展查找表。

这就是我们创建 **mpl-toolbox** 的原因，这是一个为 Solana 原生程序提供一组基本辅助函数的包，可简化这些低级任务。

**mpl-toolbox 包包含以下程序的辅助函数：**

| 程序 | 描述 |
| --- | --- |
| **SPL System** | Solana 用于创建账户的原生程序。 |
| **SPL Token 和 SPL Associated Token** | Solana 用于管理代币的原生程序。 |
| **SPL Memo** | Solana 用于向交易附加备忘录的原生程序。 |
| **SPL Address Lookup Table** | Solana 用于管理查找表的原生程序。 |
| **SPL Compute Budget** | Solana 用于管理计算单元的原生程序。 |
| **MPL System Extras** | 一个 Metaplex 程序，在 SPL System 之上提供额外的低级功能。 |
| **MPL Token Extras** | 一个 Metaplex 程序，在 SPL Token 之上提供额外的低级功能。 |
