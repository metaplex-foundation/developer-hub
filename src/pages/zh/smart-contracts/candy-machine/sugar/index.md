---
title: 概述
metaTitle: Sugar CLI 工具概述 | Metaplex Candy Machine
description: Sugar 的详细概述，一个用于管理 Candy Machine 的 CLI 工具。
---

Sugar 是一个用于与 Candy Machine 交互的命令行工具。它允许您管理 Candy Machine 的整个生命周期，具有以下优势：

- 单个配置文件包含所有 Candy Machine 设置；
- 媒体/元数据文件上传和 Candy Machine 部署的更好性能——这些操作利用多线程系统显著加快所需的计算时间；
- 强大的错误处理和输入验证，提供信息丰富的错误消息；
- 即使命令停止也能保持状态——例如，如果您的上传失败，您可以重新运行上传，只有失败的会被重试。

设置 Sugar 就像打开您喜欢的终端应用程序并下载一个二进制文件一样简单。

{% callout %}
在[此处](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine)找到关于如何使用 sugar 创建 Candy Machine 的完整指南。

{% /callout %}

Sugar 包含一系列用于创建和管理 Candy Machine 的命令。可以通过在命令行上运行以下命令来查看完整的命令列表：

```bash
sugar
```

这将显示命令列表及其简短描述：
```
sugar-cli 2.7.1
用于创建和管理 Metaplex Candy Machine 的命令行工具。

USAGE:
    sugar [OPTIONS] <SUBCOMMAND>

OPTIONS:
    -h, --help                     打印帮助信息
    -l, --log-level <LOG_LEVEL>    日志级别：trace, debug, info, warn, error, off
    -V, --version                  打印版本信息

SUBCOMMANDS:
    airdrop       从 candy machine 空投 NFT
    bundlr        与 bundlr 网络交互
    collection    管理 candy machine 上的 collection
    config        管理 candy machine 配置
    deploy        将缓存项目部署到链上 candy machine 配置
    freeze        管理冻结守卫操作
    guard         管理 candy machine 上的守卫
    hash          为隐藏设置生成缓存文件的哈希
    help          打印此消息或给定子命令的帮助
    launch        从资产创建 candy machine 部署
    mint          从 candy machine 铸造一个 NFT
    reveal        从隐藏设置的 candy machine 揭示 NFT
    show          显示现有 candy machine 的链上配置
    sign          签名 candy machine 中的一个或所有 NFT
    upload        上传资产到存储并创建缓存配置
    validate      验证 JSON 元数据文件
    verify        验证上传的数据
    withdraw      从 candy machine 账户提取资金并关闭它
```

要获取有关特定命令（例如 `deploy`）的更多信息，请使用 help 命令：

```
sugar help deploy
```

这将显示选项列表及其简短描述：

```
将缓存项目部署到链上 candy machine 配置

USAGE:
    sugar deploy [OPTIONS]

OPTIONS:
    -c, --config <CONFIG>
            配置文件路径，默认为 "config.json" [默认: config.json]

        --cache <CACHE>
            缓存文件路径，默认为 "cache.json" [默认: cache.json]

        --collection-mint <COLLECTION_MINT>
            可选的 collection 地址，candymachine 将在此铸造代币

    -h, --help
            打印帮助信息

    -k, --keypair <KEYPAIR>
            密钥对文件路径，使用 Sol 配置或默认为 "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            日志级别：trace, debug, info, warn, error, off

    -p, --priority-fee <PRIORITY_FEE>
            优先费用值 [默认: 500]

    -r, --rpc-url <RPC_URL>
            RPC URL
```

在[此处](https://docsend.com/view/is7963h8tbbvp2g9)查看由 Ape16Z 委托 OtterSec 对 Sugar 进行的审计。
