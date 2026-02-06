---
title: 配置文件
metaTitle: 配置文件 | Sugar
description: Sugar 配置文件的详细概述。
---

Sugar 使用 JSON 配置文件来上传资产和配置 Candy Machine——在大多数情况下，该文件将命名为 `config.json`。配置包括用于初始化和更新 Candy Machine 的设置，以及上传要铸造的资产。它还将包括守卫的配置，这些守卫将提供对铸造的访问控制。

基本配置文件如下所示：

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

配置文件可以看作包含三个主要部分：Candy Machine 设置（从 `"tokenStandard"` 到 `"hiddenSettings"`）、上传设置（从 `"uploadMethod"` 到 `"sdriveApiKey"`）和守卫设置（`"guards"`）。

## Candy Machine 设置

Candy Machine 设置决定资产的类型、可用资产数量及其元数据信息。

| 设置 | 选项 | 值/类型 | 描述 |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandard |   |                 |                           |
|         |         | "nft"           | 非同质化资产（`NFT`）        |
|         |         | "pnft"           | 可编程非同质化资产（`pNFT`） |
| number  |         | 整数         | 可用项目数量 |
| symbol  |         | 字符串          | 表示 NFT 符号的字符串 |
| sellerFeeBasisPoint  |         | 整数          | 创作者分享的版税，以基点表示（即 550 表示 5.5%）  |
| isMutable |       | 布尔值         | 表示 NFT 元数据账户是否可以更新的布尔值 |
| isSequential |    | 布尔值         | 表示在铸造期间是否应使用顺序索引生成的布尔值 |
| ruleSet  |        | 公钥 | *（可选）* 铸造的 `pNFT` 使用的规则集 |

`creators` 设置允许您指定最多 4 个地址及其百分比份额。

| 设置 | 选项 | 值/类型 | 描述 |
| ------- | ------- | --------------- | ------------------------- |
| creators |        | 最多 4 个创作者 | 创作者列表及其版税百分比份额 |
|          | address | 公钥 | 创作者公钥 |
|          | share | 整数 | 介于 `0` 和 `100` 之间的值 |

{% callout %}

虽然链上元数据存储最多 5 个创作者，但 Candy Machine 被设置为其中一个创作者。因此，最多只能有 4 个创作者。

份额值的总和必须加起来等于 100，否则将生成错误。

{% /callout %}

Candy Machine 可以配置为在铸造 NFT 时没有最终元数据。当您计划在铸造完成后进行揭示步骤时，这很有用。在这种情况下，您可以为*隐藏*的 NFT 指定"占位符"元数据值：

| 设置 | 选项 | 值/类型 | 描述 |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | name | 字符串 | 铸币名称（必须使用 `$ID$` 或 `$ID+1$` 铸币索引替换变量，以便 `sugar reveal` 可以工作） |
| | uri | 字符串 | 铸币的 URI（可以使用 `$ID$` 或 `$ID+1$` 铸币索引替换变量） |
| | hash | 字符串 | 32 个字符的哈希值（在大多数情况下，这是带有铸币编号和元数据映射的缓存文件的哈希，以便在铸造完成时可以验证顺序。可以使用 `sugar hash` 找到）

{% totem %}
{% totem-accordion title="hiddenSettings 示例" %}
配置文件中的 `hiddenSettings` 部分可能如下所示：

```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```

{% /totem-accordion %}
{% /totem %}

## 上传设置

Sugar 支持多种存储提供商——要使用的提供商由 `uploadMethod` 设置定义。根据提供商的不同，可能需要额外的配置。

下表提供了可用设置的概述：

| 设置 | 选项 | 接受的值 | 描述 |
| ------- | ------- | --------------- | ------------------------- |
| uploadMethod |   |  | 配置用于上传图像和元数据的存储 |
|  |   | "bundlr" |  使用 [Bundlr](https://bundlr.network) 上传到 Arweave，并使用 SOL 支付（适用于主网和开发网；文件在开发网上仅存储 7 天）
|  |   | "aws" | 上传到 Amazon Web Services（AWS） |
|  |   | "pinata" | 上传到 [Pinata](https://www.pinata.cloud)（适用于所有网络；有免费和分级订阅） |
|  |   | "sdrive" | 使用 [SDrive Cloud Storage](https://sdrive.app) 上传到 Shadow Drive |
|awsConfig | | | *（使用 "aws" 时必需）* |
| | bucket | 字符串 | AWS 存储桶名称
| | profile | 字符串 | 从凭证文件名使用的 AWS 配置文件 |
| | directory | 字符串 | 存储桶内要上传项目的目录。空字符串表示将文件上传到存储桶根目录。 |
| pinataConfig | | | *（使用 "pinata" 时必需）* |
| | JWT | 字符串 | JWT 认证令牌 |
| | apiGateway | 字符串 | 连接到 Pinata API 的 URL |
| | apiContent | 字符串 | 用作创建资产链接基础的 URL |
| | parallelLimit | 整数 | 并发上传数量；使用此设置避免速率限制 |
| sdriveApiKey | | 字符串 | SDrive API 密钥 *（使用 "sdrive" 时必需）* |

特定上传方法设置：

{% totem %}
{% totem-accordion title="Bundlr" %}

`"bundlr"` 上传方法不需要额外配置。与上传相关的任何费用将使用配置的密钥对以 `SOL` 支付。

{% /totem-accordion %}
{% totem-accordion title="AWS" %}

`"aws"` 方法将文件上传到 Amazon S3 存储。这需要额外配置，您需要在配置文件的 `"awsConfig"` 下指定 `bucket`、`profile`、`directory` 和 `domain` 值，并在系统中设置凭证。在大多数情况下，这将涉及创建具有以下属性的文件 `~/.aws/credentials`：

```
[default]
aws_access_key_id=<ACCESS KEY ID>
aws_secret_access_key=<SECRET ACCESS KEY>
region=<REGION>
```

正确设置存储桶的 ACL 权限以启用 `"public-read"` 并应用跨域资源共享（CORS）规则以启用从不同来源请求的内容访问也很重要（这是启用钱包和区块链浏览器加载元数据/媒体文件所必需的）。有关这些配置的更多信息可以在以下位置找到：

* [存储桶策略示例](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)
* [CORS 配置](https://aws.amazon.com/premiumsupport/knowledge-center/s3-configure-cors/)

`profile` 值允许您指定从凭证文件中读取哪个配置文件。`directory` 值是存储桶中将上传文件的目录名称，允许您在单个存储桶中按不同目录分隔多个 candy machine 或 collection。将此保留为空字符串将把文件上传到存储桶的根目录。（可选的）`domain` 允许您指定自定义域来从 AWS 提供数据——例如，使用域 `https://mydomain.com` 将创建格式为 `https://mydomain.com/0.json` 的文件链接。如果您没有指定域，将使用默认的 AWS S3 域（`https://<BUCKET_NAME>.s3.amazonaws.com`）。

{% /totem-accordion %}
{% totem-accordion title="Pinata" %}

`"pinata"` 方法将文件上传到 Pinata 存储。您需要在配置文件的 `"pinataConfig"` 下指定 `jwt`、`apiGateway`、`contentGateway` 和 `parallelLimit` 值：

* `jwt`：JWT 认证令牌
* `apiGateway`：连接到 Pinata API 的 URL（公共 API 端点使用 `https://api.pinata.cloud`）
* `contentGateway`：用作创建资产链接基础的 URL（公共网关使用 `https://gateway.pinata.cloud`）
* `parallelLimit`：（可选）并发上传数量，调整此值以避免速率限制

{% callout %}

公共网关不适用于生产环境——它们适合用于测试，因为它们受到严格的速率限制，并且不是为速度设计的。

{% /callout %}

{% /totem-accordion %}
{% totem-accordion title="SDrive" %}

SDrive 是建立在 GenesysGo Shadow Drive 之上的存储应用程序。您需要注册账户以获取 API 密钥（令牌），该密钥需要在配置文件中通过 `"sdriveApiKey"` 指定。

{% /totem-accordion %}
{% /totem %}

## 守卫设置

`guards` 设置允许您指定在 Candy Machine 上启用哪些守卫。

Candy Machine 支持多种守卫，这些守卫提供对铸造的访问控制。[守卫](/zh/smart-contracts/candy-machine/guards)可以配置为"default"[守卫组](/zh/smart-contracts/candy-machine/guard-groups)或出现在多个守卫组中。
