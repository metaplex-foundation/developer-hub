---
title: 安装
metaTitle: 安装 | Metaplex CLI
description: 安装和设置 Metaplex CLI
---

本指南将帮助您在系统上安装和设置 Metaplex CLI。

## 前置条件

在安装 CLI 之前,请确保您具有:

- Node.js 16.x 或更高版本
- npm 7.x 或更高版本
- Solana 钱包(可选,但推荐)
- Git(可选,用于开发)

## 安装方法

### 使用 npm(推荐)

```bash
npm install -g @metaplex-foundation/cli
```

### 使用 yarn

```bash
yarn global add @metaplex-foundation/cli
```

### 使用 pnpm

```bash
pnpm add -g @metaplex-foundation/cli
```

## 验证安装

安装后,验证 CLI 是否正确安装:

```bash
mplx --version
```

您应该看到显示 CLI 的当前版本。

## 初始设置

### 1. 创建配置目录

CLI 将在首次设置配置时自动在 `~/.config/mplx` 创建配置文件。此配置存储:
- 钱包配置
- RPC 端点设置
- 浏览器首选项
- 其他 CLI 设置

### 2. 配置您的环境

#### 设置钱包
```bash
# 创建一个新钱包
mplx config wallets new --name dev1

# 或添加现有钱包
mplx config wallets add <name> <path>
mplx config wallets add dev1 /path/to/keypair.json

# 添加钱包后,您需要设置它
mplx config wallets set
```

进一步阅读请参见

#### 配置 RPC 端点
```bash
mplx config set rpcUrl  https://api.mainnet-beta.solana.com
```

#### 设置首选浏览器
```bash
mplx config explorer set
```

## 开发安装

如果您想为 CLI 做贡献或从源代码运行它:

1. 克隆仓库:
```bash
git clone https://github.com/metaplex-foundation/cli.git
cd cli
```

2. 安装依赖:
```bash
npm install
```

3. 构建项目:
```bash
npm run build
```

4. 链接 CLI:
```bash
npm link
```

## 故障排除

### 常见问题

1. **找不到命令**
   - 确保全局 npm bin 目录在您的 PATH 中
   - 尝试重新安装软件包

2. **权限错误**
   - 在基于 Unix 的系统上,使用 `sudo` 进行全局安装
   - 或配置 npm 在不使用 sudo 的情况下安装全局包

3. **Node 版本问题**
   - 使用 nvm 管理 Node.js 版本
   - 确保您使用的是兼容的 Node.js 版本

### 获取帮助

如果您遇到任何问题:

1. 查看[文档](https://developers.metaplex.com)
2. 搜索 [GitHub 问题](https://github.com/metaplex-foundation/cli/issues)
3. 加入 [Discord 社区](https://discord.gg/metaplex)

## 下一步

现在您已经安装了 CLI,您可以:

1. [了解核心命令](/zh/dev-tools/cli/core/create-asset)
2. [探索工具箱实用程序](/zh/dev-tools/cli/toolbox/token-create)
3. [配置您的环境](/zh/dev-tools/cli/config/wallets)

## 更新

要将 CLI 更新到最新版本:

```bash
npm update -g @metaplex-foundation/cli
```

或者如果您通过 yarn 安装:

```bash
yarn global upgrade @metaplex-foundation/cli
```

## 卸载

要删除 CLI:

```bash
npm uninstall -g @metaplex-foundation/cli
```

或者如果您通过 yarn 安装:

```bash
yarn global remove @metaplex-foundation/cli
```
