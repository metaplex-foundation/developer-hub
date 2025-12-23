---
title: sign
metaTitle: sign | Sugar
description: sign 命令。
---

`sign` 命令允许使用创作者的密钥对签署所有 NFT，以验证 NFT 元数据中创作者数组中的该创作者。每个创作者只能为自己签名，并且此命令一次只能有一个创作者签名。创作者的密钥对可以通过 `--keypair` 选项传入，否则默认使用 Solana CLI 配置中指定的默认密钥对。

使用默认密钥对运行命令：

```
sugar sign
```

使用特定密钥对运行：

```
sugar sign -k creator-keypair.json
```

开发者可以使用以下命令提供自定义 RPC URL：
```
sugar sign -r <RPC_URL>
```
注意，使用 `sugar sign` 依赖于对 Metaplex Token Metadata 程序（即 `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`）的低效 `getProgramAccounts` 调用。推荐的解决方案是使用以下命令单独签署 NFT：
```
sugar sign -m <MINT_ADDRESS>
```
