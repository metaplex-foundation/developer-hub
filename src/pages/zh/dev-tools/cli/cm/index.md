---
title: "Candy Machine 命令"
metaTitle: "MPLX CLI - Candy Machine 命令"
description: "使用 MPLX CLI 创建和管理 MPL Core Candy Machine。交互式向导、资产上传和完整的 candy machine 生命周期管理。"
---

MPLX CLI 为在 Solana 上创建和管理 **MPL Core Candy Machine** 提供全面支持。这些命令允许您创建具有可配置铸造规则的 NFT 集合,上传资产,并通过直观的命令行界面管理整个 candy machine 生命周期。

## 快速开始

使用交互式向导快速开始:

```bash
mplx cm create --wizard
```

这个单一命令处理创建 candy machine 的所有事项:资产验证、上传、创建 candy machine(包括守卫配置)、带进度跟踪的项目插入。

## 命令概述

| 命令 | 用途 | 主要功能 |
|---------|---------|--------------|
| [`create`](/zh/dev-tools/cli/cm/create) | 创建新的 candy machine | 交互式向导、模板生成、手动配置 |
| [`upload`](/zh/dev-tools/cli/cm/upload) | 上传资产到存储 | 智能缓存、进度跟踪、验证 |
| [`insert`](/zh/dev-tools/cli/cm/insert) | 将项目插入 candy machine | 智能加载检测、批处理 |
| [`validate`](/zh/dev-tools/cli/cm/validate) | 验证资产缓存 | 全面验证、错误报告 |
| [`fetch`](/zh/dev-tools/cli/cm/fetch) | 获取 candy machine 信息 | 显示配置、守卫设置、状态 |
| [`withdraw`](/zh/dev-tools/cli/cm/withdraw) | 提取和删除 | 清理提取、余额恢复 |

## 主要功能

### 交互式向导

- **引导设置**: 分步 candy machine 创建
- **资产验证**: 全面的文件和元数据验证
- **进度跟踪**: 所有操作的实时指示器
- **错误恢复**: 带有可操作指导的详细错误消息

### 智能资产管理

- **智能缓存**: 尽可能重用现有上传
- **批处理**: 高效的资产上传和插入
- **文件验证**: 确保正确的命名和元数据格式
- **集合支持**: 自动创建集合

### 灵活配置

- **守卫支持**: 支持所有 Core Candy Machine 守卫
- **守卫组**: 创建具有不同规则的不同铸造阶段
- **模板生成**: 快速目录结构设置
- **手动配置**: 高级用户可以创建自定义配置

## 目录结构

所有 candy machine 命令都从具有以下结构的 **candy machine 资产目录**工作:

```text
my-candy-machine/
├── assets/
│   ├── 0.png              # 图像文件 (PNG, JPG)
│   ├── 0.json             # 元数据文件
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png      # 集合图像
│   └── collection.json     # 集合元数据
├── asset-cache.json        # 资产上传缓存(生成)
└── cm-config.json          # Candy machine 配置(使用向导时生成)
```

## 工作流选项

### 选项 1: 向导模式(推荐)

适合初学者和大多数用例:

```bash
mplx cm create --wizard
```

**它的作用:**

1. 验证资产和配置
2. 带进度跟踪上传所有资产
3. 在链上创建 candy machine
4. 带交易进度插入所有项目
5. 提供全面的完成摘要

### 选项 2: 手动模式(高级)

适用于需要完全控制的高级用户:

```bash
# 1. 手动设置目录和配置
mkdir my-candy-machine && cd my-candy-machine
# (创建 assets/ 目录并添加您的资产)

# 2. 上传资产
mplx cm upload

# 3. 创建 candy machine
mplx cm create

# 4. 插入项目
mplx cm insert

# 5. 验证(可选)
mplx cm validate
```

## 守卫配置

CLI 支持所有 Core Candy Machine 守卫和守卫组:

### 全局守卫

```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "111111111111111111111111111111111"
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

### 守卫组(铸造阶段)

```json
{
  "groups": [
    {
      "label": "wl",
      "guards": {
        "allowList": {
          "merkleRoot": "MerkleRootHash..."
        },
        "solPayment": {
          "lamports": 500000000,
          "destination": "111111111111111111111111111111111"
        }
      }
    },
    {
      "label": "public",
      "guards": {
        "solPayment": {
          "lamports": 1000000000,
          "destination": "111111111111111111111111111111111"
        }
      }
    }
  ]
}
```

## 可用守卫

CLI 支持所有 Core Candy Machine 守卫:

**支付守卫**: `solPayment`、`solFixedFee`、`tokenPayment`、`token2022Payment`、`nftPayment`、`assetPayment`、`assetPaymentMulti`

**访问控制**: `addressGate`、`allowList`、`nftGate`、`tokenGate`、`assetGate`、`programGate`、`thirdPartySigner`

**基于时间**: `startDate`、`endDate`

**限制**: `mintLimit`、`allocation`、`nftMintLimit`、`assetMintLimit`、`redeemedAmount`

**销毁守卫**: `nftBurn`、`tokenBurn`、`assetBurn`、`assetBurnMulti`

**特殊**: `botTax`、`edition`、`vanityMint`

**冻结守卫**: `freezeSolPayment`、`freezeTokenPayment`

有关详细的守卫文档,请参阅 [Core Candy Machine 守卫](/zh/core-candy-machine/guards)参考。

## 最佳实践

### 目录组织

- 将每个 candy machine 保存在其自己的目录中
- 使用描述性目录名称
- 保持一致的资产命名(0.png、1.png 等)
- 备份您的 candy machine 目录

### 资产准备

- 使用一致的命名(0.png、1.png 等)
- 确保元数据 JSON 文件与图像文件匹配
- 验证图像格式(支持 PNG、JPG)
- 保持文件大小合理(建议 < 10MB)
- 包含带有有效 "name" 字段的 collection.json

### 配置

- 在主网之前先在开发网上测试
- 使用向导进行引导配置
- 备份配置文件
- 记录守卫设置
- 考虑至少添加一个守卫或守卫组

### 部署

- 验证 candy machine 创建
- 测试铸造功能
- 监控交易状态
- 保留浏览器链接以进行验证

## 相关文档

- [Core Candy Machine 概述](/zh/core-candy-machine) - 了解 MPL Core Candy Machine
- [Core Candy Machine 守卫](/zh/core-candy-machine/guards) - 完整守卫参考
- [CLI 安装](/zh/dev-tools/cli/installation) - 设置 MPLX CLI
- [CLI 配置](/zh/dev-tools/cli/config/wallets) - 钱包和 RPC 设置

## 下一步

1. **[安装 CLI](/zh/dev-tools/cli/installation)** 如果您还没有安装
2. **[创建您的第一个 candy machine](/zh/dev-tools/cli/cm/create)** 使用向导
3. **[探索守卫配置](/zh/core-candy-machine/guards)** 以获得高级铸造规则
4. **[了解守卫组](/zh/core-candy-machine/guard-groups)** 用于分阶段启动
