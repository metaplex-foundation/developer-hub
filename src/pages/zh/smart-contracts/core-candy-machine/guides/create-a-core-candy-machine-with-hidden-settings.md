---
title: 创建具有隐藏设置的 Core Candy Machine
metaTitle: 创建具有隐藏设置的 Core Candy Machine | Core Candy Machine
description: 如何创建具有隐藏设置的 Core Candy Machine 以创建隐藏和揭示 NFT 发行。
keywords:
  - hidden settings
  - hide and reveal
  - NFT reveal
  - placeholder metadata
  - candy machine reveal
  - hidden NFT
  - reveal mechanism
  - Core Candy Machine hidden settings
  - NFT drop
about:
  - Hidden settings
  - Reveal mechanism
  - NFT drops
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machine 中的隐藏设置是什么？
    a: 隐藏设置允许所有铸造的 NFT 最初共享相同的占位符元数据（名称和 URI），随后通过揭示过程更新以显示每个 NFT 的独特属性。
  - q: 隐藏设置中的哈希如何工作？
    a: 哈希是揭示数据数组的 SHA-256 校验和。揭示后，用户可以从更新的元数据重新计算哈希，以验证 NFT 未被篡改。
  - q: 隐藏设置能与 Config Line Settings 一起使用吗？
    a: 不能。Hidden Settings 和 Config Line Settings 是互斥的——创建 Candy Machine 时必须选择其中之一。
---

## 概要

本指南介绍如何创建带有隐藏设置的 [Core Candy Machine](/zh/smart-contracts/core-candy-machine)，用于隐藏和揭示 NFT 发行，其中所有铸造的资产共享占位符元数据，直到铸造后的揭示步骤为每个 NFT 更新独特的名称和 URI。 {% .lead %}

- 使用占位符名称、URI 和揭示数据的 SHA-256 哈希配置隐藏设置
- 创建 [Core 集合](/zh/smart-contracts/core/collections)和带有 `hiddenSettings` 字段的 Candy Machine
- 铸造所有资产——每个资产在揭示步骤之前都接收相同的占位符元数据
- 揭示和验证过程将在本指南的第 2 部分中介绍

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

## 设置 Umi

[Umi](/zh/dev-tools/umi) 是 Metaplex 的 JavaScript 客户端框架，提供与 Solana 程序交互的统一接口。在设置 Umi 时，您可以创建新钱包进行测试，从文件系统导入钱包，甚至使用带有 UI/前端的 `walletAdapter`。
在此示例中，我们将从包含密钥的 json 文件（wallet.json）创建密钥对。

我们将使用 Solana Devnet 端点。

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import * as fs from 'fs';

// We will be using Solana Devnet as the endpoint while also loading the `mplCoreCandyMachine()` plugin.
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCoreCandyMachine());

// Let's create a Keypair from our wallet json file that contains a secret key, and create a signer based on the created keypair
const walletFile = fs.readFileSync('./wallet.json');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
const signer = createSignerFromKeypair(umi, keypair);
console.log("Signer: ", signer.publicKey);

// Set the identity and the payer to the given signer
umi.use(signerIdentity(signer));
```

您可以在 [Core NFT 资产创建指南](/zh/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#setting-up-umi)中找到有关设置 UMI 的更多详细信息

## 准备揭示数据和哈希

揭示数据是一个 `{ name, uri }` 对象数组——集合中每个 NFT 对应一个——将在铸造后替换占位符元数据。我们还将生成揭示数据的哈希。此哈希将存储在 Core Candy Machine 的隐藏设置中，并在验证步骤中用于确认元数据已正确更新。

此元数据将为每个资产上传，我们将使用生成的 URI。

请注意，您需要自己上传揭示数据。
此过程默认可能不是确定性的。为了以确定性方式执行，您可以使用 [turbo](/zh/guides/general/create-deterministic-metadata-with-turbo)

在此示例中，我们将使用包含五个资产的集合，因此我们的揭示数据将包含一个包含五个对象的数组，每个对象代表单个 NFT 的名称和 URI。

```ts
import crypto from 'crypto';

// Reveal data of our assets, to be used during the reveal process
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

## 创建 Core 集合

创建 Candy Machine 中所有铸造 NFT 的父级需要一个 [Core 集合](/zh/smart-contracts/core/collections)资产。`mpl-core` 库的 `createCollection` 方法通过单个指令处理创建。

您可以在[集合页面](/zh/smart-contracts/core/collections)了解更多关于集合的信息

```ts
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core';

const collectionMint = generateSigner(umi);

const creator1 = generateSigner(umi).publicKey;
const creator2 = generateSigner(umi).publicKey;

console.log("collection update authority: ", collectionUpdateAuthority.publicKey);
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

console.log("Collection Details: \n", collection);
```

## 创建具有隐藏设置的 Core Candy Machine

`mpl-core-candy-machine` 库的 `create` 方法接受 `hiddenSettings` 字段来替代 `configLineSettings`。传入占位符名称、URI 和预计算哈希来配置 Candy Machine 的隐藏和揭示流程。

更多关于 Core Candy Machine 创建和守卫的详细信息可以在 [Core Candy Machine 创建页面](/zh/smart-contracts/core-candy-machine/create)找到。

此外，我们将配置 startDate 守卫，它决定铸造何时开始。这只是许多可用[守卫](/zh/smart-contracts/core-candy-machine/guards)中的一个，您可以在[守卫页面](/zh/smart-contracts/core-candy-machine/guards)找到所有可用守卫的列表。

{% callout type="note" %}
Hidden Settings 和 Config Line Settings 是互斥的。使用 `hiddenSettings` 时必须设置 `configLineSettings: none()`，反之亦然。
{% /callout %}

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

console.log("Candy Machine Details: \n", candyMachineDetails);
```

返回的 Candy Machine 数据如下：

```json
{
  "publicKey": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "header": {
    "executable": false,
    "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
    "lamports": { "basisPoints": 5428800, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
    51, 173, 177, 113,
    25, 241, 109, 189
  ],
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "mintAuthority": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "collectionMint": "3RLCk7G2ckGHt7XPNfzUYKLriME2BmMoumF8N4H5LvsS",
  "itemsRedeemed": 0,
  "data": {
    "itemsAvailable": 5,
    "maxEditionSupply": 0,
    "isMutable": true,
    "configLineSettings": { "__option": "None" },
    "hiddenSettings": { "__option": "Some", "value": "[Object]" }
  },
  "items": [],
  "itemsLoaded": 0
}
"Candy Guard Account":
 {
  "publicKey": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "header": {
    "executable": false,
    "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
    "lamports": { "basisPoints": 1538160, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
     44, 207, 199, 184,
    112, 103,  34, 181
  ],
  "base": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "bump": 251,
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "guards": {
    "botTax": { "__option": "None" },
    "solPayment": { "__option": "None" },
    "tokenPayment": { "__option": "None" },
    "startDate": { "__option": "Some", "value": "[Object]" },
    "thirdPartySigner": { "__option": "None" },
    "tokenGate": { "__option": "None" },
    "gatekeeper": { "__option": "None" },
    "endDate": { "__option": "None" },
    "allowList": { "__option": "None" },
    "mintLimit": { "__option": "None" },
    "nftPayment": { "__option": "None" },
    "redeemedAmount": { "__option": "None" },
    "addressGate": { "__option": "None" },
    "nftGate": { "__option": "None" },
    "nftBurn": { "__option": "None" },
    "tokenBurn": { "__option": "None" },
    "freezeSolPayment": { "__option": "None" },
    "freezeTokenPayment": { "__option": "None" },
    "programGate": { "__option": "None" },
    "allocation": { "__option": "None" },
    "token2022Payment": { "__option": "None" },
    "solFixedFee": { "__option": "None" },
    "nftMintLimit": { "__option": "None" },
    "edition": { "__option": "None" },
    "assetPayment": { "__option": "None" },
    "assetBurn": { "__option": "None" },
    "assetMintLimit": { "__option": "None" },
    "assetBurnMulti": { "__option": "None" },
    "assetPaymentMulti": { "__option": "None" },
    "assetGate": { "__option": "None" },
    "vanityMint": { "__option": "None" },
  },
  "groups": []
}
```

如您所见，它还打印了 Candy Guard 账户，我们可以检查确实只设置了 `startDate`，与预期一致。

## 铸造集合

每次 `mintV1` 调用铸造一个资产，该资产接收隐藏设置中的占位符名称和 URI。所有这些铸造的资产将具有我们在创建的 Core Candy Machine 的 `hiddenSettings` 字段中设置的占位符名称和 URI。

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

    console.log("NFT minted!");
};
```

## 注意事项

- **Hidden Settings 和 Config Line Settings 是互斥的。** 创建 Core Candy Machine 时，您必须选择 `hiddenSettings` 或 `configLineSettings`——不能同时使用两者。将未使用的选项设置为 `none()`。
- **哈希验证揭示完整性。** 存储在隐藏设置中的 SHA-256 哈希是从揭示数据数组计算的。揭示后，任何人都可以从链上元数据重新计算哈希，以验证没有 NFT 被篡改。
- **所有铸造的 NFT 在揭示前共享相同的元数据。** 揭示过程之前铸造的每个资产都将显示隐藏设置中配置的相同占位符名称和 URI。只有在第 2 部分介绍的揭示步骤中才会应用各自的元数据。

## 结论

您已完成本指南的第 1 部分，成功设置了具有隐藏设置的 Core Candy Machine。

让我们回顾一下我们做了什么：
- 我们从设置 UMI 开始。
- 设置 UMI 后，我们创建了一个包含元数据（名称和 URI）的数组，该元数据将用于在初始铸造后更新资产。这包括为验证目的计算哈希。
- 我们创建了一个集合资产，我们铸造的资产将属于该集合。
- 我们创建了一个具有隐藏设置、5 个可用物品和开始时间守卫的 Core Candy Machine。
- 我们从 Core Candy Machine 铸造了所有资产，这些资产具有存储在 Core Candy Machine 隐藏设置中的占位符值。

在第 2 部分中，我们将介绍揭示资产并验证其元数据的步骤。这将包括：
- 获取集合资产并使用准备好的揭示数据更新其元数据。
- 通过对揭示资产的元数据（名称和 URI）进行哈希处理并与预期哈希进行比较来确认揭示过程成功。

## 常见问题

### Core Candy Machine 中的隐藏设置是什么？

隐藏设置允许所有铸造的 NFT 最初共享相同的占位符元数据（名称和 URI），随后通过揭示过程更新以显示每个 NFT 的独特属性。

### 隐藏设置中的哈希如何工作？

哈希是揭示数据数组的 SHA-256 校验和。揭示后，用户可以从更新的元数据重新计算哈希，以验证 NFT 未被篡改。

### 隐藏设置能与 Config Line Settings 一起使用吗？

不能。Hidden Settings 和 Config Line Settings 是互斥的——创建 Candy Machine 时必须选择其中之一。

*由 Metaplex Foundation 维护。最后验证于 2026 年 3 月。适用于 `@metaplex-foundation/mpl-core-candy-machine`。*
