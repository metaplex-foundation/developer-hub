---
title: "提取"
metaTitle: "MPLX CLI - 提取 Candy Machine"
description: "使用 MPLX CLI 提取和删除 MPL Core Candy Machine 以回收租金 SOL。"
---

`mplx cm withdraw` 命令提取并删除 candy machine,回收任何剩余的 SOL 余额并清理链上账户。此操作是不可逆的,应在不再需要 candy machine 时使用。已铸造的 NFT 不受影响。

{% callout title="不可逆" type="warning" %}
此命令是不可逆的。一旦执行,您的 candy machine 将被销毁且无法重新创建。
{% /callout %}

## 用法

```bash
# 从当前目录提取 candy machine
mplx cm withdraw

# 通过地址提取特定 candy machine
mplx cm withdraw --address <candy_machine_address>

```

您可以使用的可选标志:

- `--address`: 直接指定 candy machine 地址
- `--force`: *危险* 跳过确认提示(极其谨慎使用)

### 不可逆操作

- **永久删除**: candy machine 账户将被永久删除
- **无法恢复**: 无法撤销或恢复
- **数据丢失**: 所有链上配置和状态将丢失
- **已铸造的 NFT**: 现有铸造的 NFT 不受影响

### 最佳实践

**计划:**

- 仔细计划提取时机
- 与团队成员协调

**执行:**

- 仔细检查所有参数
- 使用开发网进行练习

## 相关命令

- [`mplx cm fetch`](/zh/dev-tools/cli/cm/fetch) - 提取前检查状态
- [`mplx cm create`](/zh/dev-tools/cli/cm/create) - 创建新的 candy machine
- [`mplx cm validate`](/zh/dev-tools/cli/cm/validate) - 提取前验证
- [`solana balance`](https://docs.solana.com/cli) - 检查回收的余额
