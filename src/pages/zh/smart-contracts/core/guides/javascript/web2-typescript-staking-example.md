---
title: 使用 Javascript 创建 Core 质押
metaTitle: 使用 Javascript 创建 Core 质押 | Core 指南
description: 本指南将向您展示如何利用 FreezeDelegate 和 Attribute 插件使用 Web2 实践和后端服务器创建质押平台。
---

本开发者指南演示如何仅使用 TypeScript 利用 attribute 插件和 freeze delegate 为您的集合创建质押程序。**这种方法消除了跟踪质押时间和管理质押/取消质押的智能合约需求**，使 Web2 开发者更容易上手。

## 起步：理解程序背后的逻辑

该程序使用标准 TypeScript 后端运行，并使用秘密中的资产密钥对权限来签署属性更改。

**要实现此示例，您需要以下组件：**
- **一个 Asset**
- **一个 Collection**（可选，但与此示例相关）
- **FreezeDelegate 插件**
- **Attribute 插件**

### Freeze Delegate 插件

**Freeze Delegate 插件**是一个**所有者管理的插件**，这意味着它需要所有者的签名才能应用于资产。

此插件允许**委托者冻结和解冻资产，防止转移**。资产所有者或插件权限可以随时撤销此插件，除非资产被冻结（在这种情况下必须先解冻才能撤销）。

**使用此插件是轻量级的**，因为冻结/解冻资产只涉及更改插件数据中的布尔值（唯一的参数是 Frozen: bool）。

_在[这里](/zh/smart-contracts/core/plugins/freeze-delegate)了解更多_

### Attribute 插件

**Attribute 插件**是一个**权限管理的插件**，这意味着它需要权限的签名才能应用于资产。对于包含在集合中的资产，集合权限充当权限，因为资产的权限字段被集合地址占用。

此插件允许**直接在资产上存储数据，作为链上属性或特征**。这些特征可以直接被链上程序访问，因为它们不像 mpl-program 那样存储在链下。

**此插件接受 AttributeList 字段**，它由键值对数组组成，键和值都是字符串。

_在[这里](/zh/smart-contracts/core/plugins/attribute)了解更多_

### 程序逻辑

为简单起见，此示例只包含两个指令：**stake** 和 **unstake** 函数，因为这些是质押程序正常工作所必需的。虽然可以添加额外的指令，如 **spendPoint** 指令来使用累积的积分，但这留给读者自己实现。

_Stake 和 Unstake 函数都以不同方式使用之前介绍的插件_。

在深入指令之前，让我们花一些时间讨论使用的属性，`staked` 和 `staked_time` 键。`staked` 键表示资产是否已质押以及何时质押（取消质押 = 0，质押 = 质押时间）。`staked_time` 键跟踪资产的总质押持续时间，仅在资产取消质押后更新。

**指令**：
- **Stake**：此指令应用 Freeze Delegate 插件，通过将标志设置为 true 来冻结资产。此外，它将 Attribute 插件中的 `staked` 键从 0 更新为当前时间。
- **Unstake**：此指令更改 Freeze Delegate 插件的标志并撤销它，以防止恶意实体控制资产并要求赎金才能解冻。它还将 `staked` 键更新为 0，并将 `staked_time` 设置为当前时间减去质押时间戳。

## 构建程序：逐步指南

现在我们理解了程序背后的逻辑，**是时候深入代码并将一切整合在一起了**！

### 依赖项和导入

在编写程序之前，让我们看看我们需要什么包以及从它们中需要什么函数来确保我们的程序工作！

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

这些包中的不同函数如下：

```typescript
import { createSignerFromKeypair, signerIdentity, publicKey, transactionBuilder, Transaction } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addPlugin, updatePlugin, fetchAsset, removePlugin } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';
```

### Umi 和 Core SDK 概述

在本指南中，我们将使用 **Umi** 和 **Core SDK** 来创建所有必要的指令。

**Umi 是一个用于构建和使用 Solana 程序 JavaScript 客户端的模块化框架**。它提供了一个零依赖库，定义了一组核心接口，使库能够独立于特定实现运行。

_有关更多信息，您可以在[这里](/zh/umi/getting-started)找到概述_

**此示例的基本 Umi 设置如下**：
```typescript
const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
```

此设置涉及：
- **为我们的 Umi 提供者建立与 Devnet 的连接**
- **设置要用作权限和付款者的密钥对** (umi.use(signerIdentity(...)))

**注意**：如果您更喜欢为此示例使用新的密钥对，您可以随时使用 generateSigner() 函数创建一个。

### 创建 Asset 并将其添加到 Collection

在深入质押和取消质押的逻辑之前，我们应该学习**如何从头创建资产并将其添加到集合**。

**创建 Collection**：
```typescript
(async () => {
   // 生成 Collection 密钥对
   const collection = generateSigner(umi)
   console.log("\nCollection Address: ", collection.publicKey.toString())

   // 生成集合
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

**创建 Asset 并将其添加到 Collection：**
```typescript
(async () => {
   // 生成 Asset 密钥对
   const asset = generateSigner(umi)
   console.log("\nAsset Address: ", asset.publicKey.toString())


   // 传递并获取 Collection
   const collection = publicKey("<collection_pubkey>")
   const fetchedCollection = await fetchCollection(umi, collection);


   // 生成 Asset
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

这是完整的**质押指令**
我们首先使用 mpl-core SDK 的 `fetchAsset(...)` 指令检索有关资产的信息，包括它是否有 attribute 插件，如果有，它包含哪些属性。

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1. **检查 Attribute 插件**
如果资产没有 attribute 插件，添加它并用 `staked` 和 `stakedTime` 键填充它。

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

2. **检查质押属性**：
如果资产有质押属性，确保它包含质押指令所需的质押属性。

```typescript
} else {
    const assetAttribute = fetchedAsset.attributes.attributeList;
    const isInitialized = assetAttribute.some(
        (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
    );
```

如果有，检查资产是否已经质押，并用当前时间戳作为字符串更新 `staked` 键：

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

3. **更新 Attribute 插件**：
用新的或修改的属性更新 attribute 插件。

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

4. **冻结资产**
无论资产之前是否已有 attribute 插件，都冻结资产使其无法交易。

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

**这是完整的指令**：
```typescript
(async () => {
    // 传递 Asset 和 Collection
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")

    // 获取 Asset 属性
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("\nThis is the current state of your Asset Attribute Plugin: ", fetchedAsset.attributes);

    const currentTime = new Date().getTime().toString();

    let tx: Transaction;

    // 检查 Asset 是否附加了 Attribute 插件，如果没有，添加它
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
        // 如果有，获取 Asset Attribute 插件的 attributeList
        const assetAttribute = fetchedAsset.attributes.attributeList;
        // 检查 Asset 是否已经被质押
        const isInitialized = assetAttribute.some(
            (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
        );

        // 如果是，检查是否已经质押，如果没有则更新 staked 属性
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
            // 如果不是，添加 staked 和 stakedTime 属性
            assetAttribute.push({ key: "staked", value: currentTime });
            assetAttribute.push({ key: "stakedTime", value: "0" });
        }

        // 更新 Asset Attribute 插件并添加 FreezeDelegate 插件
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

### 取消质押指令

取消质押指令会更简单，因为取消质押指令只能在质押指令之后调用，所以许多检查本质上已经被质押指令覆盖了。

我们首先调用 `fetchAsset(...)` 指令检索有关资产的所有信息。

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1. **对 attribute 插件运行所有检查**

为了验证资产是否已经通过质押指令，**指令检查 attribute 插件的以下内容**：
- **资产上是否存在 attribute 插件？**
- **是否有 staked 键？**
- **是否有 stakedTime 键？**

如果这些检查中的任何一个缺失，资产从未通过质押指令。

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

一旦我们确认资产有质押属性，**我们检查资产当前是否已质押**。如果已质押，我们按如下方式更新质押属性：
- 将 `Staked` 字段设置为零
- 将 `stakedTime` 更新为 `stakedTime` + (currentTimestamp - stakedTimestamp)

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

2. **更新 Attribute 插件**
用新的或修改的属性更新 attribute 插件。

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

3. **解冻并移除 FreezeDelegate 插件**
在指令结束时，解冻资产并移除 FreezeDelegate 插件，使资产"自由"且不受 `update_authority` 控制。

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

**这是完整的指令**：
```typescript
(async () => {
    // 传递 Asset 和 Collection
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")

    let tx: Transaction;

    // 获取 Asset 属性
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("This is the current state of your Asset Attribute Plugin", fetchedAsset.attributes);

    // 如果资产没有附加 attribute 插件，抛出错误
    if (!fetchedAsset.attributes) {
      throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
      );
    }

    const assetAttribute = fetchedAsset.attributes.attributeList;
    // 检查资产是否附加了 stakedTime 属性，如果没有则抛出错误
    const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
    if (!stakedTimeAttribute) {
      throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
      );
    }

    // 检查资产是否附加了 staked 属性，如果没有则抛出错误
    const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
    if (!stakedAttribute) {
      throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
      );
    }

    // 检查资产是否已经质押（!0），如果没有则抛出错误。
    if (stakedAttribute.value === "0") {
      throw new Error("Asset is not staked");
    } else {
      const stakedTimeValue = parseInt(stakedTimeAttribute.value);
      const stakedValue = parseInt(stakedAttribute.value);
      const elapsedTime = new Date().getTime() - stakedValue;

      // 将 stakedTime 属性更新为新值，将 staked 属性更新为 0
      assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
          attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
          attr.value = "0";
        }
      });
    }

    // 用新的 attributeList 更新 Asset Attribute 插件
    // 然后更新 Asset FreezeDelegate 插件以解冻资产
    // 然后从资产移除 FreezeDelegate 插件
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

恭喜！您现在已经具备为您的 NFT 集合创建质押解决方案的能力！如果您想了解更多关于 Core 和 Metaplex 的信息，请查看[开发者中心](/zh/smart-contracts/core/getting-started)。
