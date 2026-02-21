---
title: 创建MPL 404混合托管
metaTitle: 创建MPL 404混合托管 | MPL-Hybrid
description: 学习创建使404交换成为可能的MPL 404混合托管账户。
---

## 先决条件

- MPL Core集合 - [创建Core集合指南](/zh/smart-contracts/core/guides/javascript/how-to-create-a-core-collection-with-javascript)
- 铸造到集合的Core NFT资产 - [创建Core NFT资产指南](/zh/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)
- 创建具有所需代币数量的SPL代币 - [创建Solana代币指南](/zh/guides/javascript/how-to-create-a-solana-token)
- 在一致的网关/uri上在线存储顺序元数据JSON文件。

初始化托管是将NFT集合与同质化代币链接的关键步骤。在开始此步骤之前，您应该准备好Core集合地址、同质化代币铸造地址，以及使用数字命名、顺序文件的链下元数据URI范围。对基础URI字符串一致性的需求将限制一些链下元数据选项。请注意，托管的权限需要与集合的权限匹配才能执行元数据更新。此外，由于托管是有资金的，因此无需成为代币权限，这允许集合由现有的memecoin或其他同质化资产支持。

## MPL-Hybrid托管账户结构

MPL Hybrid托管是程序的核心，存储有关项目的所有信息。

{% totem %}
{% totem-accordion title="链上MPL-404托管数据结构" %}

MPL-404托管的链上账户结构 [查看源代码](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

| 名称           | 类型   | 大小 | 描述                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| collection     | Pubkey | 32   | 集合账户                           |     |
| authority      | Pubkey | 32   | 托管的权限                      |     |
| token          | Pubkey | 32   | 要分发的同质化代币               |     |
| fee_location   | Pubkey | 32   | 发送代币费用的账户                |     |
| name           | String | 4    | NFT名称                                     |     |
| uri            | String | 8    | NFT元数据的基础uri                |     |
| max            | u64    | 8    | 附加到uri的NFT的最大索引     |     |
| min            | u64    | 8    | 附加到uri的NFT的最小索引 |     |
| amount         | u64    | 8    | 交换的代币成本                           |     |
| fee_amount     | u64    | 8    | 捕获NFT的代币费用              |     |
| sol_fee_amount | u64    | 8    | 捕获NFT的sol费用                |     |
| count          | u64    | 8    | 交换总次数                        |     |
| path           | u16    | 1    | 链上/链下元数据更新路径       |     |
| bump           | u8     | 1    | 托管bump                                  |     |

{% /totem-accordion %}
{% /totem %}

## 创建托管

### 参数

#### name

托管的名称。此数据可用于在UI上显示托管名称。

```ts
name: 'My Test Escrow'
```

#### uri

这是元数据池的基础uri。这需要是一个静态uri，其中还包含顺序目标的元数据json文件。即：

```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: 'https://shdw-drive.genesysgo.net/<bucket-id>/'
```

#### escrow

托管地址是以下两个种子的PDA `["escrow", collectionAddress]`。

```ts
const collectionAddress = publicKey('11111111111111111111111111111111')

const escrowAddress = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(collectionAddress),
])
```

#### collection

用于MPL Hybrid 404项目的集合地址。

```ts
collection: publicKey('11111111111111111111111111111111')
```

#### token

用于MPL Hybrid 404项目的代币铸造地址。

```ts
token: publicKey('11111111111111111111111111111111')
```

#### feeLocation

将接收交换费用的钱包地址。

```ts
feeLocation: publicKey('11111111111111111111111111111111')
```

#### feeAta

将接收代币的钱包的代币账户。

```ts
feeAta: findAssociatedTokenPda(umi, {
  mint: publicKey('111111111111111111111111111111111'),
  owner: publicKey('22222222222222222222222222222222'),
})
```

#### min和max

min和max表示元数据池中可用的最小和最大索引。

```
最低索引: 0.json
...
最高索引: 4999.json
```

这将转换为min和max参数。

```ts
min: 0,
max: 4999
```

#### 费用

可以设置3个单独的费用。

```ts
// 将NFT交换为代币时收到的代币数量。
// 此值以lamports为单位，您需要考虑代币的
// 小数位数。如果代币有5位小数
// 并且您希望收取1个完整代币，则feeAmount为`100000`。

amount: swapToTokenValueReceived,
```

```ts
// 将代币交换为NFT时支付的费用金额。此值
// 以lamports为单位，您需要考虑代币的小数位数。
// 如果代币有5位小数并且您希望
// 收取1个完整代币，则feeAmount为`100000`。

feeAmount: swapToNftTokenFee,
```

```ts
// 从代币交换为NFT时支付的可选费用。
// 这以lamports为单位，因此您可以使用`sol()`来计算
// lamports。

solFeeAmount: sol(0.5).basisPoints,
```

#### path

`path`参数启用或禁用mpl-hybrid程序上的元数据重掷功能。

```ts
// 交换时重掷元数据 0 = true, 1 = false
path: rerollEnabled,
```

#### associatedTokenProgram

`SPL_ASSOCIATED_TOKEN_PROGRAM_ID`可以从`mpl-toolbox`包中获取。

```ts
import { SPL_ASSOCIATED_TOKEN_PROGRAM_ID } from @metaplex/mpl-toolbox
```

```ts
// 关联代币程序ID
associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
```

### 代码

```ts
const initTx = await initEscrowV1(umi, {
  // 托管名称
  name: escrowName,
  // 元数据池基础Uri
  uri: baseMetadataPoolUri,
  // 基于"escrow" + 集合地址种子的托管地址
  escrow: escrowAddress,
  // 集合地址
  collection: collectionAddress,
  // 代币铸造
  token: tokenMint,
  // 费用钱包
  feeLocation: feeWallet,
  // 费用代币账户
  feeAta: feeTokenAccount,
  // 池中NFT的最小索引
  min: minAssetIndex,
  // 池中NFT的最大索引
  max: maxAssetIndex,
  // 交换时收到的同质化代币数量
  amount: swapToTokenValueReceived,
  // 交换为NFT时支付的费用金额
  feeAmount: swapToNftTokenFee,
  // 交换为NFT时支付的可选额外费用
  solFeeAmount: sol(0.5).basisPoints,
  // 交换时重掷元数据 0 = true, 1 = false
  path: rerollEnabled,
  // 关联代币程序ID
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}).sendAndConfirm(umi)
```
