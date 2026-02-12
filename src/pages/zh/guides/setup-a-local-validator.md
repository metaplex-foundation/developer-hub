---
# remember to update dates also in /components/guides/index.js
title: 设置本地验证者
metaTitle: 设置本地验证者 | Metaplex Guides
description: 了解如何设置本地开发环境并使用本地验证者
created: '04-19-2025'
updated: '04-19-2025'
keywords:
  - local validator
  - Solana testing
  - solana-test-validator
  - local development
  - Metaplex local validator
about:
  - Solana local validator
  - local development environment
  - program testing
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
  - Bash
howToSteps:
  - Install the Solana Tools CLI for your operating system
  - Start the local validator with solana-test-validator
  - Connect your application to the local validator at localhost port 8899
  - Download required programs and accounts from mainnet using the Solana CLI
  - Load programs and accounts into the local validator
  - Create a custom Metaplex validator script with pre-loaded programs
howToTools:
  - Solana CLI
  - solana-test-validator
  - Metaplex Umi
---

## 概述

**本地验证者**充当您的个人节点，为测试应用程序提供本地沙盒环境，而无需连接到实时区块链网络。它运行一个**完全可定制的本地测试账本**，这是 Solana 账本的简化版本，配备了所有**预装的原生程序**和启用的各种功能。

### 设置

要开始使用本地验证者，您需要使用适合您操作系统的命令安装 Solana Tools CLI。

{% dialect-switcher title="安装命令" %}

{% dialect title="MacOs & Linux" id="MacOs & Linux" %}

```
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
```

{% /dialect %}

{% dialect title="Windows" id="Windows" %}

```
cmd /c "curl https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
```

{% /dialect %}

{% /dialect-switcher %}

**注意**：安装脚本引用了 Solana 的 `1.18.18` 版本。要安装最新版本或了解不同的安装方法，请参阅官方 [Solana 文档](https://docs.solanalabs.com/cli/install)。

### 使用

安装 CLI 后，您可以通过运行一个简单的命令来启动本地验证者。

```
solana-test-validator
```

启动后，验证者将可在本地 URL（http://127.0.0.1:8899）访问。您需要通过使用此 URL 配置代码来建立连接。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi("http://127.0.0.1:8899")
```

本地验证者将在您的用户文件夹中生成一个名为 `test-ledger` 的目录。此目录保存与验证者相关的所有数据，包括账户和程序。

要重置本地验证者，您可以删除 `test-ledger` 文件夹或使用重置命令重新启动验证者。

此外，`solana-logs` 功能对于在测试期间监控程序输出非常有用。

## 管理程序和账户

本地验证者不包括主网上找到的特定程序和账户。它只附带原生程序和您在测试期间创建的账户。如果您需要主网上的特定程序或账户，Solana CLI 允许您下载并将它们加载到本地验证者上。

### 下载账户和程序：

您可以轻松地将账户或程序从源集群下载到本地验证者以进行测试。这允许您复制主网环境。

**对于账户：**
```
solana account -u <source cluster> --output <output format> --output-file <destination file name/path> <address of account to fetch>
```
**对于程序：**
```
solana program dump -u <source cluster> <address of account to fetch> <destination file name/path>
```

### 加载账户和程序：

下载后，可以使用 CLI 将这些账户和程序加载到本地验证者中。您可以运行命令将特定账户和程序加载到本地环境中，确保它们已准备好进行测试。

**对于账户：**
```
solana-test-validator --account <address to load the account to> <path to account file> --reset
```
**对于程序**
```
solana-test-validator --bpf-program <address to load the program to> <path to program file> --reset
```

## 在浏览器上查看本地交易

使用本地验证者不会阻止我们使用浏览器，因为许多浏览器都能够连接到我们的本地端口并读取我们之前提到的 `test-ledger` 文件夹中存储的本地账本。

有两种方法可以做到这一点：
- 创建指向您喜欢的浏览器的本地集群的交易签名的链接。
- 手动更改网页上的集群，然后粘贴交易链接。

### 创建交易签名的链接

当您使用 Umi 发送交易时，您将收到两条关键信息：签名和结果。签名采用 base58 格式，因此您需要对其进行反序列化以使其对区块链可读。

您可以使用以下代码执行此操作：
```typescript
const signature = base58.deserialize(transaction.signature)[0]
```

获得签名后，您可以像这样在您喜欢的浏览器中使用它：

{% totem %}

{% totem-accordion title="Solana Explorer" %}

```typescript
console.log(`Transaction Submitted! https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
```

{% /totem-accordion %}

{% totem-accordion title="SolanaFM" %}

```typescript
console.log(`Transaction Submitted! https://solana.fm/tx/${signature}?cluster=localnet-solana`)
```

{% /totem-accordion %}

{% /totem %}

### 手动更改集群

如前所述，区块浏览器允许用户使用自定义 RPC 查看交易。要查看本地验证者交易，您需要在`选择集群`模态中查找输入框并输入以下地址：`http://127.0.0.1:8899`。

注意：[Solana Explorer](https://explorer.solana.com/) 在您选择自定义 RPC URL 时会自动默认为本地验证者端口，因此您无需进行任何其他更改。

## 创建"Metaplex"本地验证者

{% callout title="免责声明" %}

不幸的是，由于使用 Bash 脚本，本指南的这一部分仅适用于 **Linux** 或 **MacOS** 上的用户。但是，如果您使用的是 Windows 并且仍想跟随创建自己的 Metaplex 验证者，您可以使用 [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) 或 [此线程](https://stackoverflow.com/questions/6413377/is-there-a-way-to-run-bash-scripts-on-windows) 中提供的解决方案之一！

{% /callout %}

了解了本地验证者设置和管理的基础知识后，您可以通过 **bash 脚本**创建和管理个性化的本地验证者。

例如，您可以创建一个包含主要 Metaplex 程序的 `metaplex-local-validator`：`mpl-token-metadata`、`mpl-bubblegum` 和 `mpl-core`。

### 设置目录并下载程序数据

首先，您将在路径中创建一个目录来存储本地验证者所需的程序。

```
mkdir ~/.local/share/metaplex-local-validator
```

然后，将程序数据从指定地址下载到此目录中。

```
solana program dump -u m metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so
```
```
solana program dump -u m BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so
```
```
solana program dump -u m CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so
```

{% totem %}

{% totem-accordion title="其他 Metaplex 程序" %}

| 名称               | 程序 ID                                   |
| ------------------ | -------------------------------------------- |
| Auction House      | hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk  |
| Auctioneer         | neer8g6yJq2mQM6KbnViEDAD4gr3gRZyMMf4F2p3MEh  |
| Bubblegum          | BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY |
| Candy Guard        | Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g |
| Candy Machine v3   | CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR |
| Core               | CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d |
| Core Candy Guard   | CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ |
| Core Candy Machine | CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J |
| Gumdrop            | gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a  |
| Hydra              | hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg  |
| Inscriptions       | 1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo  |
| MPL-Hybrid         | MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb  |
| Token Auth Rules   | auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg  |
| Token Metadata     | metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s  |

{% /totem-accordion %}

{% /totem %}

### 创建验证者脚本

接下来，创建一个验证者脚本，简化使用所有必需程序运行本地验证者的过程。通过编写验证者设置脚本，您可以轻松地开始使用个性化环境进行测试，包括所有相关的 Metaplex 程序。

首先使用以下命令打开一个新的脚本文件：

```
sudo nano /usr/local/bin/metaplex-local-validator
```

**注意**：如果 /usr/local/bin 目录不存在，您可以使用 `sudo mkdir -p -m 775 /usr/local/bin` 创建它

将以下代码粘贴到编辑器中并保存：

```bash
#!/bin/bash

# Validator command
COMMAND="solana-test-validator -r --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so --bpf-program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so"

# Append any additional arguments passed to the script
for arg in "$@"
do
    COMMAND+=" $arg"
done

# Execute the command
eval $COMMAND
```

**注意**：要退出并保存，请使用 Ctrl + X，然后按 Y 确认，然后按 Enter 保存。

脚本准备好后，修改其权限以便可以执行：

```
sudo chmod +x /usr/local/bin/metaplex-local-validator
```

最后，在项目文件夹中测试您的新验证者：

```
metaplex-local-validator
```
