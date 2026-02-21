---
title: 使用 Candy Machine 在 Solana 上创建 Token Metadata NFT 集合
metaTitle: 使用 Candy Machine 在 Solana 上创建 Token Metadata TM NFT 集合 | Candy Machine
description: 如何使用 Candy Machine 在 Solana 区块链上创建 NFT 集合。
---

如果您想在 Solana 上启动 NFT 集合，Sugar CLI 工具包将为您抽象一些复杂的设置和管理步骤，为您提供一个自动化的启动系统，在 Solana 区块链上创建 Candy Machine。

## 前提条件

- 已安装和配置 Solana CLI。[安装指南](https://docs.solanalabs.com/cli/install)
  - 使用 CLI 生成文件系统钱包
  - 钱包需要有主网或开发网 SOL 资金

## 初始设置

### 安装 Sugar

#### Mac/Linux

```
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

#### Windows

您可以使用以下 URL 下载安装可执行文件来安装 Sugar：

```
https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe
```

尝试双击运行二进制文件。如果您收到关于不受信任的二进制文件的弹出消息警告，请尝试点击"更多信息"，然后选择"仍然运行"。

## 准备您的资产

NFT 有两个基本部分：`image`（图像）和 `metadata`（元数据）。

图像是在钱包和市场中展示和显示的内容，而 `metadata` 包含该 NFT 在区块链上的所有相关信息，如 `name`（名称）、找到 `image` 的链接、NFT 的 `attributes`（属性）。

### Assets 文件夹

从 Sugar 执行命令时，Sugar 将期望在您启动命令的目录中找到一个 `assets` 文件夹。

您的图像和元数据文件都将存放在 `assets` 文件夹中。

### 文件命名

图像和元数据 JSON 文件应遵循从 0 开始的递增索引命名约定。

如果缺少任何索引，或者 `image` 和 `metadata` 文件夹不包含相同数量的文件，则文件夹验证将失败。

```
assets/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

### 元数据 JSON

{% partial file="token-standard-full.md" /%}

```json
{
  "name": "My NFT #1",
  "description": "My NFT Collection",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

### 示例图像和元数据

如果您希望使用示例图像和元数据来创建 Candy Machine，可以从我们的 github 下载 zip 格式的文件，点击绿色的 `code` 按钮并选择 `zip 格式`。

[Example Candy Machine Assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

或者，如果您安装了 git，可以将资产克隆到您的系统，或从提供的链接下载压缩副本

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```

### 图像和元数据生成器

如果您需要从图层生成艺术图像和元数据，有几个自动化脚本和网站，您可以向生成器提供图像图层和项目的一些基本信息，它将根据您给定的参数生成 x 个资产图像和 JSON 元数据组合。

| 名称                                                        | 类型   | 难度     | 要求        | 免费 |
| ----------------------------------------------------------- | ------ | -------- | ----------- | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | 脚本   | ⭐⭐⭐⭐ | JS 知识     | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | 脚本   | ⭐⭐⭐⭐ | JS 知识     | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | 网页UI | ⭐⭐     |             |      |
| [bueno](https://bueno.art/generator)                        | 网页UI | 未知     |             |      |

### Collection 详情

创建 Collection 时，我们需要与 NFT 资产相同的详细信息，即一个 `image` 文件和一个 `metadata` json 文件。这些将放置在 `asset/` 文件夹的根目录中，如下所示：

```
assets/
├─ collection.jpg/
├─ collection.json/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

collection 元数据文件与 NFT 资产 json 文件格式相同。对于 Collection，您可以省略填写 `attributes` 字段。

```json
{
  "name": "My Collection",
  "description": "This is My Nft Collection",
  "image": "collection.jpg",
  "external_url": "https://example.com",
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }
    ],
    "category": "image"
  }
}
```

## Sugar

默认情况下，**Sugar** 将使用 Solana CLI 使用的相同配置文件来加载要使用的默认值，例如：

- Solana CLI 设置的钱包
- Solana CLI 设置的 RPC URL

### Sugar Launch

一旦您的 assets 文件夹准备就绪，您可以使用 **Sugar** 开始部署过程。我们将运行的第一个命令是

```shell
sugar launch
```

这将启动 **Sugar** 的 CLI 流程，收集有关 Candy Machine 部署的信息。

如果 `sugar` 没有找到配置文件，它会要求您创建一个。

然后会询问您以下问题

```
Found xx file pairs in "assets". Is this how many NFTs you will have in your candy machine?
```

```
Found symbol "xxxx" in your metadata file. Is this value correct?
```

```
Found value xxx for seller fee basis points in your metadata file. Is this value correct?
```

```
Do you want to use a sequential mint index generation? We recommend you choose no.
```

```
How many creator wallets do you have? (max limit of 4)
```

创建者钱包用于分配版税。如果选择，您将被要求输入每个钱包的 `address` 和 `share` 数量。

```
Which extra features do you want to use? (use [SPACEBAR] to select options you want and hit [ENTER] when done)
```

在本指南中，我们将保持 `hidden settings` 未选中，然后按 `enter` 继续

```
What upload method do you want to use?
```

在本指南中，我们将选择 `Bundlr`

```
Do you want your NFTs to remain mutable? We HIGHLY recommend you choose yes.
```

为此选项选择是(y)，以便将来需要时可以编辑 NFT。

Sugar 现在应该开始以下过程

- 创建和上传 Collection NFT
- 使用 Irys（以前称为 Bundlr）将您的资产上传到 Arweave
- 创建 Candy Machine

如果成功，您将看到以下消息，但包含您自己的 Candy Machine 地址链接：

```
https://www.solaneyes.com/address/Beag81WvAPUCeFpJ2qFnvd2f1CFCpQBf3abTJXA1fH9o?cluster=devnet
```

恭喜，您刚刚在 Solana 上创建了一个 Candy Machine。
如果您点击上面的链接，可以在链上查看您的 Candy Machine 详情。

### 使用守卫和组更新 Candy Machine

目前您的 Candy Machine 没有附加守卫。默认情况下，如果没有附加 Candy Guard 到 Candy Machine，只有**铸造权限**（即您）可以从 Candy Machine 铸造。

为了解决这个问题，我们必须将守卫附加到 Candy Machine，允许公众按照一组规则从 Candy Machine 铸造。例如，我们可能希望公众能够从 Candy Machine 铸造，同时向用户收取 1 SOL。为此，我们可以使用 **Sol Payment 守卫**。

#### 添加守卫（SOL Payment）

要将 Sol Payment 守卫添加到 Candy Machine，我们需要打开 Sugar 在我们在终端中启动 `sugar launch` 的文件夹根目录生成的 `config.json` 文件。

配置文件看起来像这样：

```json
{
  "tokenStandard": "nft",
  "number": 16,
  "symbol": "NUMBERS",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "creators": [
    {
      "address": "B1kwbSHRiXFPYvNbuhCX92ibngzxdmfBzfaJYuy9WYp5",
      "share": 100
    }
  ],
  "uploadMethod": "bundlr",
  "ruleSet": null,
  "awsConfig": null,
  "sdriveApiKey": null,
  "pinataConfig": null,
  "hiddenSettings": null,
  "guards": null,
  "maxEditionSupply": null
}
```

在这里，我们可以编辑配置文件末尾的 `guards` 字段，并填写我们希望 SOL Payment 发送到的目标地址。

```json
"guards": {
    "default": {
        "solPayment": {
            "value": 1,
            "destination": "11111111111111111111111111111111"
        }
    }
},
```

将守卫添加到 `config.json` 后，保存文件并运行命令：

```
sugar guard add
```

如果您之前已经创建了 Candy Guard，可以改为运行命令：

```
sugar guard update
```

这将创建 Candy Guard 并将 **SOL Payment 守卫**添加到默认守卫列表。

## 显示 Candy Machine

要在终端中显示 Candy Machine 详情，您可以运行命令

```shell
sugar show
```

这将列出所有 Candy Machine 和守卫详情，但不包括所有插入的项目。

## 显示 Candy Guard

要在终端中显示 Candy Machine 详情，您可以运行命令

```shell
sugar guard show
```

这将列出所有 Candy Machine 和守卫详情，但不包括所有插入的项目。

## 下一步

现在您有了一个正常工作的 Candy Machine，您需要在 Web UI 上托管 Candy Machine，以便人们能够从 Candy Machine 铸造。

您可以生成自己的 UI 并使用 `umi` 客户端包装器和 `mpl-candy-machine` SDK，或者您可以使用预构建的社区 UI，只需提供您的 Candy Machine 详情。

### 开发 UI 资源

- 推荐 nextJS/React
- [Metaplex Umi](/zh/dev-tools/umi)
- [Metaplex Candy Machine SDK](/zh/smart-contracts/candy-machine)

### 延伸阅读
- [Sugar CLI 文档](/zh/smart-contracts/candy-machine/sugar)
