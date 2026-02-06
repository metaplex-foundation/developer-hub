---
title: 使用Javascript创建Core质押
metaTitle: 使用Javascript创建Core质押 | Core指南
description: 本指南将展示如何利用FreezeDelegate和Attribute插件使用Web2实践和后端服务器创建质押平台。
updated: '01-31-2026'
keywords:
  - NFT staking
  - TypeScript staking
  - freeze delegate
  - web2 staking
about:
  - Staking mechanics
  - Backend integration
  - Plugin usage
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 使用Umi和您的authority密钥对设置TypeScript后端
  - 向质押Asset添加Freeze Delegate和Attribute插件
  - 创建冻结Asset并写入质押时间戳的stake端点
  - 创建解冻Asset并计算质押持续时间的unstake端点
howToTools:
  - Node.js
  - Umi框架
  - mpl-core SDK
  - Express或类似后端
---
本开发者指南演示了如何仅使用TypeScript为您的收藏品创建质押程序，利用attribute插件和freeze delegate。**这种方法无需智能合约**来跟踪质押时间和管理质押/解除质押，使其对Web2开发人员更加易用。

## 入门：理解程序背后的逻辑

此程序使用标准TypeScript后端运行，并使用secret中的asset密钥对authority来签署属性更改。
**要实现此示例，您需要以下组件：**

- **一个Asset**
- **一个Collection**（可选，但与此示例相关）
- **FreezeDelegate插件**
- **Attribute插件**

### Freeze Delegate插件

**Freeze Delegate插件**是一个**所有者管理的插件**，这意味着它需要所有者的签名才能应用到资产上。
此插件允许**委托人冻结和解冻资产，防止转移**。资产所有者或插件authority可以随时撤销此插件，除非资产被冻结（在这种情况下必须先解冻才能撤销）。
**使用此插件很轻量**，因为冻结/解冻资产只涉及更改插件数据中的布尔值（唯一的参数是Frozen: bool）。
_在[此处](/smart-contracts/core/plugins/freeze-delegate)了解更多信息_

### Attribute插件

**Attribute插件**是一个**authority管理的插件**，这意味着它需要authority的签名才能应用到资产上。对于包含在收藏品中的资产，收藏品authority充当authority，因为资产的authority字段被收藏品地址占用。
此插件允许**直接在资产上存储数据，作为链上属性或特征**。这些特征可以直接由链上程序访问，因为它们不像mpl-program那样存储在链下。
**此插件接受AttributeList字段**，由键值对数组组成，键和值都是字符串。
_在[此处](/smart-contracts/core/plugins/attribute)了解更多信息_

### 程序逻辑

为简单起见，此示例仅包含两个指令：**stake**和**unstake**函数，因为它们是质押程序正常工作所必需的。虽然可以添加其他指令，如**spendPoint**指令来使用累积的积分，但这留给读者自行实现。
_Stake和Unstake函数都以不同方式使用前面介绍的插件_。
在深入指令之前，让我们花一些时间讨论使用的属性，即`staked`和`staked_time`键。`staked`键指示资产是否已质押以及何时质押（unstaked = 0，staked = 质押时间）。`staked_time`键跟踪资产的总质押持续时间，仅在资产解除质押后更新。
**指令**：

- **Stake**：此指令应用Freeze Delegate插件，通过将标志设置为true来冻结资产。此外，它将Attribute插件中的`staked`键从0更新为当前时间。
- **Unstake**：此指令更改Freeze Delegate插件的标志并撤销它，以防止恶意实体控制资产并要求赎金才能解冻。它还将`staked`键更新为0，并将`staked_time`设置为当前时间减去质押时间戳。

## 构建程序：分步指南

现在我们了解了程序背后的逻辑，**是时候深入代码并将所有内容整合在一起了**！

### 依赖项和导入

在编写程序之前，让我们看看我们需要哪些包以及从中需要哪些函数来确保程序正常工作！
让我们看看此示例使用的不同包：

```json
"dependencies": {
    "@metaplex-foundation/mpl-core": "1.1.0-alpha.0",
    "@metaplex-foundation/mpl-token-metadata": "^3.2.1",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.1",
    "bs58": "^5.0.0",
    "typescript": "^5.4.5"
}
```

以及这些包中的不同函数如下：

```typescript
import { createSignerFromKeypair, signerIdentity, publicKey, transactionBuilder, Transaction } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addPlugin, updatePlugin, fetchAsset, removePlugin } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';
```

### Umi和Core SDK概述

在本指南中，我们将使用**Umi**和**Core SDK**来创建所有必要的指令。
**Umi是一个用于构建和使用Solana程序JavaScript客户端的模块化框架**。它提供了一个零依赖的库，定义了一组核心接口，使库能够独立于特定实现运行。
_有关更多信息，您可以在[此处](/dev-tools/umi/getting-started)找到概述_
**此示例的基本Umi设置如下**：

```typescript
const umi = createUmi("https://api.devnet.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
```

此设置涉及：

- **为我们的Umi提供程序建立与Devnet的连接**
- **设置一个密钥对**，用作authority和付款人（umi.use(signerIdentity(...))）
**注意**：如果您更喜欢为此示例使用新的密钥对，您可以随时使用generateSigner()函数创建一个。

### 创建Asset并将其添加到Collection

在深入质押和解除质押的逻辑之前，我们应该学习**如何从头创建资产并将其添加到收藏品中**。
**创建Collection**：

```typescript
(async () => {
   // 生成Collection密钥对
   const collection = generateSigner(umi)
   console.log("\nCollection Address: ", collection.publicKey.toString())
   // 生成收藏品
   const tx = await createCollection(umi, {
       collection: collection,
       name: 'My Collection',
       uri: 'https://example.com/my-collection.json',
   }).sendAndConfirm(umi)
   // 从交易反序列化签名
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`\nCollection Created: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```

**创建Asset并将其添加到Collection：**

```typescript
(async () => {
   // 生成Asset密钥对
   const asset = generateSigner(umi)
   console.log("\nAsset Address: ", asset.publicKey.toString())
   // 传递并获取Collection
   const collection = publicKey("<collection_pubkey>")
   const fetchedCollection = await fetchCollection(umi, collection);
   // 生成Asset
   const tx = await create(umi, {
       name: 'My NFT',
       uri: 'https://example.com/my-nft.json',
       asset,
       collection: fetchedCollection,
   }).sendAndConfirm(umi)
   // 从交易反序列化签名
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`Asset added to the Collection: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```

### 质押指令

以下是完整的**质押指令**
我们首先使用mpl-core SDK中的`fetchAsset(...)`指令来检索有关资产的信息，包括它是否具有attribute插件，如果有，它包含哪些属性。

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1. **检查Attribute插件**
如果资产没有attribute插件，添加它并用`staked`和`stakedTime`键填充它。

```typescript
if (!fetchedAsset.attributes) {
    tx = await transactionBuilder().add(addPlugin(umi, {
        asset,
        collection,
        plugin: {
        type: "Attributes",
        attributeList: [
            { key: "staked", value: currentTime },
            { key: "stakedTime", value: "0" },
        ],
        },
    })).add(
        [...]
    )
} else {
```
1. **检查质押属性**：
如果资产具有staking属性，确保它包含质押指令所需的质押属性。

```typescript
} else {
    const assetAttribute = fetchedAsset.attributes.attributeList;
    const isInitialized = assetAttribute.some(
        (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
    );
```

如果有，检查资产是否已经质押，并用当前时间戳作为字符串更新`staked`键：

```typescript
if (isInitialized) {
    const stakedAttribute = assetAttribute.find(
        (attr) => attr.key === "staked"
    );
    if (stakedAttribute && stakedAttribute.value !== "0") {
        throw new Error("Asset is already staked");
    } else {
        assetAttribute.forEach((attr) => {
            if (attr.key === "staked") {
                attr.value = currentTime;
            }
        });
    }
} else {
```

如果没有，将它们添加到现有属性列表中。

```typescript
} else {
    assetAttribute.push({ key: "staked", value: currentTime });
    assetAttribute.push({ key: "stakedTime", value: "0" });
}
```
1. **更新Attribute插件**：
使用新的或修改的属性更新attribute插件。

```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
)
```
1. **冻结Asset**
无论资产之前是否有attribute插件，冻结资产以使其无法交易

```typescript
tx = await transactionBuilder().add(
    [...]
).add(addPlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "FreezeDelegate",
        frozen: true,
        authority: { type: "UpdateAuthority" }
    }
})).buildAndSign(umi);
```

**以下是完整指令**：

```typescript
(async () => {
    // 传递Asset和Collection
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")
    // 获取Asset属性
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("\nThis is the current state of your Asset Attribute Plugin: ", fetchedAsset.attributes);
    const currentTime = new Date().getTime().toString();
    let tx: Transaction;
    // 检查Asset是否附加了Attribute插件，如果没有，添加它
    if (!fetchedAsset.attributes) {
        tx = await transactionBuilder().add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
            attributeList: [
                { key: "staked", value: currentTime },
                { key: "stakedTime", value: "0" },
            ],
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    } else {
        // 如果有，获取Asset Attribute插件的attributeList
        const assetAttribute = fetchedAsset.attributes.attributeList;
        // 检查Asset是否已经被质押过
        const isInitialized = assetAttribute.some(
            (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
        );
        // 如果是，检查它是否已经质押，如果没有则更新staked属性
        if (isInitialized) {
            const stakedAttribute = assetAttribute.find(
                (attr) => attr.key === "staked"
            );
            if (stakedAttribute && stakedAttribute.value !== "0") {
                throw new Error("Asset is already staked");
            } else {
                assetAttribute.forEach((attr) => {
                    if (attr.key === "staked") {
                        attr.value = currentTime;
                    }
                });
            }
        } else {
            // 如果不是，添加staked和stakedTime属性
            assetAttribute.push({ key: "staked", value: currentTime });
            assetAttribute.push({ key: "stakedTime", value: "0" });
        }
        // 更新Asset Attribute插件并添加FreezeDelegate插件
        tx = await transactionBuilder().add(updatePlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
                attributeList: assetAttribute,
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    }
    // 从交易反序列化签名
    console.log(`Asset Staked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```

### 解除质押指令

解除质押指令会更简单，因为解除质押指令只能在质押指令之后调用，许多检查本质上已经被质押指令覆盖了。
我们首先调用`fetchAsset(...)`指令来检索有关资产的所有信息。

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1. **对attribute插件运行所有检查**
要验证资产是否已经通过质押指令，**指令检查attribute插件是否满足以下条件**：

- **资产上是否存在attribute插件？**
- **是否有staked键？**
- **是否有stakedTime键？**
如果缺少任何这些检查，资产从未通过质押指令。

```typescript
if (!fetchedAsset.attributes) {
    throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
    );
}
const assetAttribute = fetchedAsset.attributes.attributeList;
const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
if (!stakedTimeAttribute) {
    throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
    );
}
const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
if (!stakedAttribute) {
    throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
    );
}
```

一旦我们确认资产具有质押属性，**我们检查资产当前是否已质押**。如果已质押，我们按如下方式更新质押属性：

- 将`Staked`字段设置为零
- 将`stakedTime`更新为`stakedTime` +（当前时间戳 - 质押时间戳）

```typescript
if (stakedAttribute.value === "0") {
    throw new Error("Asset is not staked");
} else {
    const stakedTimeValue = parseInt(stakedTimeAttribute.value);
    const stakedValue = parseInt(stakedAttribute.value);
    const elapsedTime = new Date().getTime() - stakedValue;
    assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
            attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
            attr.value = "0";
        }
    });
}
```
1. **更新Attribute插件**
使用新的或修改的属性更新attribute插件。

```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
).add(
    [...]
).buildAndSign(umi);
```
1. **解冻并移除FreezeDelegate插件**
在指令结束时，解冻资产并移除FreezeDelegate插件，使资产"自由"且不受`update_authority`控制

```typescript
tx = await transactionBuilder().add(
    [...]
).add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    frozen: false,
    },
})).add(removePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    },
})).buildAndSign(umi);
```

**以下是完整指令**：

```typescript
(async () => {
    // 传递Asset和Collection
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")
    let tx: Transaction;
    // 获取Asset属性
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("This is the current state of your Asset Attribute Plugin", fetchedAsset.attributes);
    // 如果资产没有附加attribute插件，抛出错误
    if (!fetchedAsset.attributes) {
      throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
      );
    }

    const assetAttribute = fetchedAsset.attributes.attributeList;
    // 检查资产是否附加了stakedTime属性，如果没有抛出错误
    const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
    if (!stakedTimeAttribute) {
      throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
      );
    }
    // 检查资产是否附加了staked属性，如果没有抛出错误
    const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
    if (!stakedAttribute) {
      throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
      );
    }
    // 检查资产是否已经质押(!0)，如果没有抛出错误。
    if (stakedAttribute.value === "0") {
      throw new Error("Asset is not staked");
    } else {
      const stakedTimeValue = parseInt(stakedTimeAttribute.value);
      const stakedValue = parseInt(stakedAttribute.value);
      const elapsedTime = new Date().getTime() - stakedValue;
      // 将stakedTime属性更新为新值，将staked属性更新为0
      assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
          attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
          attr.value = "0";
        }
      });
    }
    // 使用新的attributeList更新Asset Attribute插件
    // 然后更新Asset FreezeDelegate插件以解冻资产
    // 然后从资产中移除FreezeDelegate插件
    tx = await transactionBuilder().add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
      },
    })).add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
        frozen: false,
      },
    })).add(removePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
      },
    })).buildAndSign(umi);
     // 从交易反序列化签名
     console.log(`Asset Unstaked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```

## 结论

恭喜！您现在已准备好为您的NFT收藏品创建质押解决方案！如果您想了解更多关于Core和Metaplex的信息，请查看[开发者中心](/smart-contracts/core/getting-started)。
