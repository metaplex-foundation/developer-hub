---
title: 创建具有隐藏设置的 Core Candy Machine
metaTitle: 创建具有隐藏设置的 Core Candy Machine | Core Candy Machine
description: 如何创建具有隐藏设置的 Core Candy Machine 以创建隐藏和揭示 NFT 发行。
---

如果您想创建隐藏和揭示 NFT 发行，您可以使用 Core Candy Machine 来实现该目标。本指南分为两部分，以确保对整个过程进行全面演练。

在本指南（第 1 部分）中，我们将逐步引导您使用 Core Candy Machine 设置和铸造隐藏和揭示 NFT 发行的过程。无论您是经验丰富的开发者还是 NFT 发行新手，本指南都将为您提供入门所需的一切。揭示和验证您的 NFT 发行将在第 2 部分中介绍。

隐藏和揭示 NFT 发行在您希望在所有 NFT 铸造后再揭示它们时非常有用。

其工作原理是，在设置 Core Candy Machine 时，您将配置隐藏设置字段。此字段将包含占位符元数据（通用名称和 URI），将在揭示之前应用于所有铸造的 NFT。此外，它还包含元数据的预计算哈希。
每个在揭示前铸造的 NFT 将具有相同的名称和 URI。集合铸造完成后，资产将使用正确的名称和 URI（元数据）更新。

铸造集合后，需要执行揭示过程，我们将使用适当的元数据更新资产。

为确保资产正确更新，需要执行验证步骤。这涉及对揭示资产的更新元数据（名称和 URI）进行哈希处理，并将其与存储在隐藏设置中的原始哈希进行比较。这确保每个 NFT 都已准确更新。

揭示和验证步骤将在本指南的第 2 部分中介绍。

## 所需包

您需要安装以下包以与 Core Candy Machine 交互：

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore", "mpl-toolbox"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## 设置 umi

设置环境后，让我们从设置 umi 开始。

在设置 Umi 时，您可以创建新钱包进行测试，从文件系统导入钱包，甚至使用带有 UI/前端的 `walletAdapter`。
在此示例中，我们将从包含密钥的 json 文件（wallet.json）创建密钥对。

我们将使用 Solana Devnet 端点。

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import * as fs from 'fs';

// 我们将使用 Solana Devnet 作为端点，同时加载 `mplCoreCandyMachine()` 插件。
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCoreCandyMachine());

// 让我们从包含密钥的钱包 json 文件创建密钥对，并基于创建的密钥对创建签名者
const walletFile = fs.readFileSync('./wallet.json');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
const signer = createSignerFromKeypair(umi, keypair);
console.log("签名者: ", signer.publicKey);

// 将身份和付款者设置为给定的签名者
umi.use(signerIdentity(signer));
```

您可以在[这里](https://metaplex.com/docs/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#setting-up-umi)找到有关设置 UMI 的更多详细信息

## 准备揭示数据

现在，让我们准备揭示数据，其中将包含最终揭示 NFT 的元数据。此数据包含集合中每个 NFT 的名称和 URI，将用于在铸造后更新占位符元数据。
此元数据将为每个资产上传，我们将使用生成的 URI

请注意，您需要自己上传揭示数据。
此过程默认可能不是确定性的。为了以确定性方式执行，您可以使用 [turbo](https://metaplex.com/docs/guides/general/create-deterministic-metadata-with-turbo)

在此示例中，我们将使用包含五个资产的集合，因此我们的揭示数据将包含一个包含五个对象的数组，每个对象代表单个 NFT 的名称和 URI。

我们还将生成揭示数据的哈希。此哈希将存储在 Core Candy Machine 的隐藏设置中，并在验证步骤中用于确认元数据已正确更新。

```ts
import crypto from 'crypto';

// 我们资产的揭示数据，将在揭示过程中使用
const revealData = [
      { name: 'Nft #1', uri: 'http://example.com/1.json' },
      { name: 'Nft #2', uri: 'http://example.com/2.json' },
      { name: 'Nft #3', uri: 'http://example.com/3.json' },
      { name: 'Nft #4', uri: 'http://example.com/4.json' },
      { name: 'Nft #5', uri: 'http://example.com/5.json' },
    ]

let string = JSON.stringify(revealData)
let hash = crypto.createHash('sha256').update(string).digest()
```

## 创建集合

现在让我们创建一个集合资产。
为此，mpl-core 库提供了 `createCollection` 方法来帮助我们执行该操作

您可以在[这里](https://metaplex.com/docs/core/collections)了解更多关于集合的信息

```ts
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core';

const collectionMint = generateSigner(umi);

const creator1 = generateSigner(umi).publicKey;
const creator2 = generateSigner(umi).publicKey;

console.log("集合更新权限: ", collectionUpdateAuthority.publicKey);
await createCollection(umi, {
    collection: collectionMint,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    plugins: [
        {
            type: 'Royalties',
            basisPoints: 500,
            creators: [
            {
                address: creator1,
                percentage: 20,
            },
            {
                address: creator2,
                percentage: 80,
            },
        ],
        ruleSet: ruleSet('None'),
        },
    ],
}).sendAndConfirm(umi)
```

我们添加了 `Royalties` 类型的插件，并添加了 2 个不同的创建者来共享这些版税

现在让我们获取创建的集合并打印其详细信息

```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core';

const collection = await fetchCollection(umi, collectionMint.publicKey);

console.log("集合详情: \n", collection);
```

## 创建具有隐藏设置的 Core Candy Machine

下一步是创建具有隐藏设置的 Core Candy Machine。

为此，我们将使用 mpl-core-candy-machine 库的 `create` 方法，并使用来自 `revealData` 的占位符名称、URI 和预计算哈希设置 `hiddenSettings`

更多关于 Core Candy Machine 创建和守卫的详细信息可以在[这里](https://metaplex.com/docs/core-candy-machine/create)找到。

此外，我们将配置 startDate 守卫，它决定铸造何时开始。这只是许多可用守卫中的一个，您可以在[这里](https://metaplex.com/docs/candy-machine/guards)找到所有可用守卫的列表。

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine';

const candyMachine = generateSigner(umi);

const res = await create(umi, {
    candyMachine,
    collection: collectionMint.publicKey,
    collectionUpdateAuthority: umi.identity,
    itemsAvailable: 5,
    configLineSettings: none(),
    hiddenSettings: some({
        name: 'My Hidden NFT Project',
        uri: 'https://example.com/path/to/teaser.json',
        hash: hash,
    }),
    guards: {
        startDate: some({ date: dateTime('2024-01-01T16:00:00Z') }),
    }
});
let tx = await res.sendAndConfirm(umi);
```

现在让我们获取创建的 candy machine 并打印其详细信息。
为此，我们将使用 mpl-core-candy-machine 库的 `fetchCandyMachine` 方法

```ts
import { fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';

let candyMachineDetails = await fetchCandyMachine(umi, candyMachine.publicKey);

console.log("Candy Machine 详情: \n", candyMachineDetails);
```

## 铸造集合

现在让我们从 Core Candy Machine 铸造 5 个 NFT。

所有这些铸造的资产将具有我们在创建的 Core Candy machine 的 `hiddenSettings` 字段中设置的占位符名称和 URI。

这些占位符元素将在揭示过程中更新

```ts
import { mintV1 } from '@metaplex-foundation/mpl-core-candy-machine';

const nftMint = [
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
];

for(let i = 0; i < nftMint.length; i++) {
    let mintNFT = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
        mintV1(umi, {
            candyMachine: candyMachine.publicKey,
            asset: nftMint[i],
            collection: collectionMint.publicKey,
        })
    ).sendAndConfirm(umi);

    console.log("NFT 已铸造！");
};
```

## 结论

恭喜！您刚刚完成了本指南的第 1 部分，并成功设置了具有隐藏设置的 Core Candy Machine。

让我们回顾一下我们做了什么：
- 我们从设置 UMI 开始。
- 设置 UMI 后，我们创建了一个包含元数据（名称和 URI）的数组，该元数据将用于在初始铸造后更新资产。这包括为验证目的计算哈希。
- 我们创建了一个集合资产，我们铸造的资产将属于该集合。
- 我们创建了一个具有隐藏设置、5 个可用物品和开始时间守卫的 Core Candy Machine。
- 我们从 Core Candy Machine 铸造了所有资产，这些资产具有存储在 Core Candy Machine 隐藏设置中的占位符值。

在第 2 部分中，我们将介绍揭示资产并验证其元数据的步骤。这将包括：
- 获取集合资产并使用准备好的揭示数据更新其元数据。
- 通过对揭示资产的元数据（名称和 URI）进行哈希处理并与预期哈希进行比较来确认揭示过程成功。
