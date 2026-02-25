---
title: 简介
metaTitle: 简介 | Metaplex CLI
description: 欢迎使用 Metaplex CLI
---

Metaplex CLI 是一个强大的命令行工具,提供了一套全面的实用程序,用于在 Solana 上与 Metaplex 协议进行交互。无论您是构建 NFT 应用程序的开发者还是管理数字资产的创作者,CLI 都提供了一套强大的功能来简化您的工作流程。

## 主要功能

### 核心功能
- 创建和管理 MPL Core 资产和集合
- 上传和更新资产元数据
- 获取资产和集合信息
- 管理资产属性和特性

### Candy Machine 支持
- 通过分步指导创建 MPL Core Candy Machine
- 通过智能缓存上传、验证和插入资产
- 设置复杂的铸造规则和守卫组
- 上传、创建和部署的实时指示器

### 工具箱实用程序
- 创建和管理同质化代币
- 在地址之间转移 SOL
- 检查 SOL 余额
- 为测试目的空投 SOL

### 配置管理
- 管理多个钱包
- 配置 RPC 端点
- 设置首选区块链浏览器
- 自定义 CLI 行为

## 为什么使用 CLI?

1. **开发者友好**: 为开发者构建,提供简单命令和高级选项
2. **交互模式**: 用于复杂操作的用户友好向导
3. **灵活配置**: 使用多个钱包和 RPC 端点自定义您的环境
4. **全面工具**: 在一个地方满足 NFT 和代币管理的所有需求
5. **跨平台**: 适用于 Windows、macOS 和 Linux

## 开始使用

1. [安装 CLI](/zh/dev-tools/cli/installation)
2. 配置您的环境:
   - [设置您的钱包](/zh/dev-tools/cli/config/wallets)
   - [配置 RPC 端点](/zh/dev-tools/cli/config/rpcs)
   - [选择您首选的浏览器](/zh/dev-tools/cli/config/explorer)
3. 开始使用命令:
   - [创建资产](/zh/dev-tools/cli/core/create-asset)
   - [创建集合](/zh/dev-tools/cli/core/create-collection)

## 命令结构

CLI 遵循分层命令结构:

```bash
mplx <category> <command> [options]
```

类别包括:
- `core`: MPL Core 资产管理
- `cm`: Candy Machine 操作
- `toolbox`: 实用程序命令
- `config`: 配置管理

## 最佳实践

1. **使用配置**: 设置您的钱包和 RPC 端点以获得更流畅的体验
2. **交互模式**: 使用 `--wizard` 标志进行引导操作
3. **检查余额**: 在交易前始终验证您的 SOL 余额
4. **先测试**: 在主网部署之前使用开发网进行测试
5. **备份**: 保持您的钱包文件和配置安全

## 支持和资源

- [GitHub 仓库](https://github.com/metaplex-foundation/cli)
- [文档](https://developers.metaplex.com)
- [Discord 社区](https://discord.gg/metaplex)

## 快速入门示例

### 创建您的第一个 Candy Machine

使用交互式向导开始:
```bash
# 安装并配置 CLI
mplx config set keypair /path/to/my-wallet.json
mplx config set rpcUrl https://api.mainnet-beta.solana.com

# 使用引导设置创建 candy machine
mplx cm create --wizard
```

### 创建单个资产

对于单个资产或自定义集合:
```bash
# 创建一个集合
mplx core create-collection

# 在集合中创建一个资产
mplx core create-asset
```

## 下一步

准备好开始了吗?选择您的路径:

1. **设置**: 访问[安装指南](/zh/dev-tools/cli/installation)
2. **NFT 集合**: 从 [candy machine 向导](/zh/dev-tools/cli/cm/create)开始
3. **单个资产**: 从[资产创建](/zh/dev-tools/cli/core/create-asset)开始
