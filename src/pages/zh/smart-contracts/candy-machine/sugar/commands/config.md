---
title: config
metaTitle: config | Sugar
description: config 命令。
---

`config` 命令允许您管理 Candy Machine 配置。默认情况下，Sugar 在当前目录中查找 `config.json` 文件来加载 Candy Machine 配置——配置文件名可以在每个需要它的命令上使用 `-c` 或 `--config` 选项指定。

您可以按照这些[说明](/zh/smart-contracts/candy-machine/sugar/configuration)手动创建此文件，或使用 config create 命令：

```
sugar config create
```

执行该命令会启动一个交互式流程，包含一系列提示来收集所有配置选项的信息。最后，配置文件将被保存（默认为 config.json）或其内容显示在屏幕上。要指定自定义文件名，请使用 `-c` 选项：

```
sugar config create -c my-config.json
```

部署 Candy Machine 后，必须使用 `update` 子命令将配置文件的任何更改设置到 Candy Machine 账户：

```
sugar config update
```

您可以使用 `-n` 选项更新 Candy Machine 权限（控制 Candy Machine 的公钥）：

```
sugar config update -n <NEW PUBLIC KEY>
```

您还可以使用 `set` 子命令更改通过 Candy Machine 铸造的资产的代币标准。此命令支持使用 `-t` 选项将资产类型更改为 `NFT` 或 `pNFT`。它还允许您为铸造的 pNFT 指定规则集。

```
sugar config set -t "pnft" --rule-set <PUBLIC KEY>
```
