---
title: 获取集合中的 Mint
metaTitle: 获取集合中的 Mint | Token Metadata 指南
description: 如何获取集合中所有 mint 的指南。
---

Metaplex Token Metadata 具有[链上集合](/zh/smart-contracts/token-metadata/collections)功能，允许客观识别 NFT 集合，而不是社区在缺乏链上标准时采用的各种主观且可能相互冲突的启发式方法。

规范设计使得查找任何给定 NFT 并确定它是否属于某个集合以及属于哪个集合变得非常容易，只需从 metadata 账户读取 Collection 字段即可。链上 `Metadata` 结构包含一个可选的 `Collection` 结构，其中有一个 `key` 字段，即它所属集合的 SPL token mint 的 Pubkey。

```rust
pub struct Metadata {
 pub key: Key,
 pub update_authority: Pubkey,
 pub mint: Pubkey,
 pub data: Data,
 // 不可变，一旦翻转，此元数据的所有销售都被视为二次销售。
 pub primary_sale_happened: bool,
 // 数据结构是否可变，默认不可变
 pub is_mutable: bool,
 /// 用于轻松计算版本的 nonce（如果存在）
 pub edition_nonce: Option<u8>,
 /// Token Standard 是确定性的，如果您调用 create master edition 调用并成功，
 /// 它将从 SemiFungible 更改为 NonFungible。
 pub token_standard: Option<TokenStandard>,
 /// 由于我们无法轻松更改 Metadata，我们在末尾添加新的 DataV2 字段。
 /// Collection
 pub collection: Option<Collection>,
...
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Collection {
 pub verified: bool, // 集合是否已验证
 pub key: Pubkey,    // 集合 NFT 的 SPL token mint 账户
}
```

然而，给定一个集合 mint 地址，在直接从链上读取时，找到属于该特定集合的所有 NFT 要困难得多。使用 [DAS](/zh/dev-tools/das-api) 有一种更优越的方法，还有两种直接从链上获取数据的基本方法。

## DAS API
当使用[支持它的 RPC 提供商](/zh/rpc-providers#metaplex-das-api)时，使用 DAS 获取 mint 是更优越的方法。

{% dialect-switcher title="getAssetByGroup 示例" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

将 `endpoint` 替换为您的 RPC URL，将 `collection` 替换为您要查找的集合地址。

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const endpoint = '<ENDPOINT>';
const collection = 'J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p'

const umi = createUmi(endpoint).use(dasApi());

const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collection,
});
console.log(assets.items.length > 0);
```

{% /totem %}
{% /dialect %}
{% dialect title="cURL" id="curl" %}
{% totem %}

在您的 shell 中运行此命令。记得替换 `<ENDPOINT>` 和 `<GROUPVALUE>`

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "<GROUPVALUE>",
        "page": 1
    },
    "id": 0
}'
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

您可以在我们的 [DAS 文档](/zh/dev-tools/das-api)中找到更多关于 DAS 的方法和允许获取和过滤数据的其他方法

## 使用预计算偏移量的 GetProgramAccounts

人们很容易认为我们可以简单地使用 [getProgramAccounts](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts) 调用，并使用偏移量进入 `Collection` 结构来匹配集合 id 与 `key` 字段。这与大多数客户端程序查找的方式相同，例如，获取属于特定 candy machine 或创建者 ID 的 NFT mint 账户快照。然而，由于 `edition_nonce`、`token_standard` 和 `collection` 都是 Rust `Option`，这变得复杂得多。

Rust `Option` 在 [Borsh](https://borsh.io/) 编码中用 0 表示 `None` 变体，用 1 表示 `Some` 变体，以及 `Some` 变体包含的任何值的正常编码。（例如，`u8` 用一个字节。）这意味着我们无法在不知道 `Collection` 字段之前两个 `Option` 中每个的变体类型的情况下计算进入 `Collection` 结构的偏移量。

有两种方法可以做到这一点：暴力破解和收集先验变体知识。

暴力破解需要计算所有可能的变体并并行运行多个 `getProgramAccount` 调用。鉴于创建者数组中最多有五个创建者，以及 `Collection` 之前两个 `Option` 字段各有两个可能的选项，这导致总共有 20 种可能的组合，意味着您需要进行 20 次具有不同偏移量的 `getProgramAccount` 调用才能采用这种方法。这显然不是一种可行或可扩展的方法。
如果提前知道集合的一些信息，这可以减少到更少的调用次数。知道有多少个创建者是最大的收益，将 `getProgramAccount` 调用次数减少到只有四次，可以合理地并行运行。

由于它涉及的边缘情况数量众多，以及它只能实际用于只有一个创建者或提前知道创建者数量变化的集合，因此不推荐这种方法。

相反，我们推荐使用交易爬取方法。

## 交易爬取

交易爬取涉及获取与集合 mint 地址关联的所有交易，然后解析它们以找到创建集合的特定指令。从那里我们可以确定哪些 mint 账户是集合的一部分。

执行此操作的算法如下所示：

- 为集合 mint 地址调用 `[getSignaturesForAddress](https://docs.solana.com/developing/clients/jsonrpc-api#getsignaturesforaddress)` 以获取所有以任何方式涉及集合 mint 地址的交易签名。
- 对于每个签名，调用 `[getTransaction](https://docs.solana.com/developing/clients/jsonrpc-api#gettransaction)` 以获取每个签名的实际交易数据。
- 解析交易以找到程序 ID，并过滤掉任何不涉及 `token-metadata` 程序（地址为 `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`）的交易。
- 我们只想检索已验证的集合成员，`token-metadata` 中唯一验证集合成员的两个处理程序是 `verify_collection` 和 `set_and_verify`，它们在 `MetadataInstruction` 枚举中的位置分别是 `18` 和 `25`，即 base58 值 `K` 和 `S`。
- 过滤指令，只保留 `data` 值为 `K` 或 `S` 的指令，以确保我们只获取那些特定的 `token-metadata` 处理程序。
- 被验证的 `metadata` 地址将是传递给这两个处理程序的第一个账户。
- 将 `metadata` 地址添加到 `Set` 以确保没有重复。

- 一旦找到所有 `metadata` 地址，遍历它们并调用 `getAccountInfo` 以查找账户数据。
    - 将账户数据反序列化为 Metadata 结构/对象，并从 `mint` 字段中找到 mint 地址。将 `mint` 地址添加到 Set。
    - 这个最终的 Set 就是集合中所有项目的 mint 地址列表。

交易爬取以获取集合成员的 Rust 和 TypeScript 示例代码可以在[get-collection代码库](https://github.com/metaplex-foundation/get-collection)中找到。
