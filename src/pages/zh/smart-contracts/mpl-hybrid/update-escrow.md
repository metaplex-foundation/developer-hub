---
title: 更新MPL Hybrid 404托管配置
metaTitle: 更新MPL Hybrid 404托管配置 | MPL-Hybrid
description: 学习更新MPL 404混合托管账户的配置。
---

托管配置可通过`updateEscrowV1`插件升级。

为了更方便，您可以使用`mpl-hybrid`包中的`fetchEscrowV1()`获取托管账户，并使用展开运算符将所有当前字段值提供给更新指令，只调整您希望更改的值，因为原始未更改的值将由展开运算符处理。

## 更新托管

```ts
const escrowConfigurationAddress = publicKey("11111111111111111111111111111111");

// 获取托管配置账户。
const escrowConfigurationData = await fetchEscrowV1(umi, escrowConfigurationAddress);

// 使用展开运算符`...`将`escrowConfigurationData`字段展开到对象中
// 并调整您希望更新的任何字段。
const res = await updateEscrowV1(umi, {
    ...escrowConfigurationData,
    // 您的托管配置地址。
    escrow: escrowConfigurationAddress,
    authority: umi.identity,
    // 在下面添加您希望更改和更新的任何字段。
    feeAmount: 100000,
}).sendAndConfirm(umi);

```

## 可更新字段

可以传递给`updateEscrowV1`参数对象的可更新字段。

```ts
{
    name,
    uri,
    max,
    min,
    amount,
    feeAmount,
    solFeeAmount,
    path
}

```

### name

托管的名称。

```ts
name: "My Test Escrow"
```

### uri

这是元数据池的基础uri。这需要是一个静态uri，其中还包含顺序目标的元数据json文件。即：

```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: "https://shdw-drive.genesysgo.net/<bucket-id>/"
```

### token

用于MPL Hybrid 404项目的代币铸造地址。

```ts
token: publicKey("11111111111111111111111111111111")
```

### feeLocation

将接收交换费用的钱包地址。

```ts
feeLocation: publicKey("11111111111111111111111111111111")
```

### feeAta

将接收代币的钱包的代币账户。

```ts
feeAta: findAssociatedTokenPda(umi, {
    mint: publicKey("111111111111111111111111111111111"),
    owner: publicKey("22222222222222222222222222222222"),
  });
```

### min和max

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

### 费用

可以更新3个单独的费用。

```ts
// 将NFT交换为代币时收到的代币数量。
// 此值以lamports为单位，您需要考虑代币的
// 小数位数。如果代币有5位小数
// 并且您希望收取1个完整代币，则feeAmount为`100000`

amount: 100000,
```

```ts
// 将代币交换为NFT时支付的费用金额。
// 此值以lamports为单位，您需要考虑代币的小数位数。
// 如果代币有5位小数并且您希望收取1个完整代币，
// 则feeAmount为`100000`

feeAmount: 100000,
```

```ts
// 从代币交换为NFT时支付的可选费用。
// 这以lamports为单位，因此您可以使用`sol()`来计算
// lamports。

solFeeAmount: sol(0.5).basisPoints,
```

### path

`path`参数启用或禁用mpl-hybrid程序上的元数据重掷功能。

```ts
// 交换时重掷元数据 0 = true, 1 = false
path: 0,
```
