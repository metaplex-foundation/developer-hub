---
title: MPL Core 中的灵魂绑定资产
metaTitle: MPL Core 中的灵魂绑定资产 | Core 指南
description: 本指南探讨 MPL Core 中灵魂绑定资产的不同选项
---


灵魂绑定 NFT 是永久绑定到特定钱包地址且无法转移给另一个所有者的非同质化代币。它们对于表示应该与特定身份绑定的成就、凭证或会员资格非常有用。{% .lead %}

## 概述

在本指南中，我们将探讨如何使用 MPL Core 和 Umi 框架创建灵魂绑定资产。无论您是希望在 TypeScript 中实现灵魂绑定 NFT 的开发者，还是只想了解它们的工作原理，我们都将涵盖从基本概念到实际实现的所有内容。我们将检查使资产灵魂绑定的不同方法，并逐步在集合中创建您的第一个灵魂绑定 NFT。

要访问 Solana 和 Eclipse 区块链上的 Metaplex Aura 网络，您可以访问 Aura 应用获取端点和 API 密钥 [这里](https://aura-app.metaplex.com/)。

在 MPL Core 中，有两种主要方法来创建灵魂绑定 NFT：

### 1. Permanent Freeze Delegate 插件
- 使资产完全不可转移且不可销毁
- 可以在以下级别应用：
  - 单个资产级别
  - 集合级别（更节省租金）
- 集合级别实现允许在单个交易中解冻所有资产

### 2. Oracle 插件
- 使资产不可转移但仍可销毁
- 也可以在以下级别应用：
  - 单个资产级别
  - 集合级别（更节省租金）
- 集合级别实现允许在单个交易中解冻所有资产

## 使用 Permanent Freeze Delegate 插件创建灵魂绑定 NFT

Permanent Freeze Delegate 插件提供通过冻结使资产不可转移的功能。创建灵魂绑定资产时，您需要：

1. 在资产创建期间包含 Permanent Freeze 插件
2. 将初始状态设置为冻结
3. 将权限设置为 None，使冻结状态永久且不可变

这有效地创建了一个无法转移或解冻的永久灵魂绑定资产。在以下代码片段中显示了在哪里添加这三个选项：

```js
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: 'PermanentFreezeDelegate', // 包含 Permanent Freeze 插件
        frozen: true, // 将初始状态设置为冻结
        authority: { type: "None" }, // 将权限设置为 None
      },
    ],
  })
```


### 资产级别实现
Permanent Freeze Delegate 插件可以附加到单个资产上使其灵魂绑定。这提供了更精细的控制，但需要更多租金，并且如果以后不应该是灵魂绑定，则需要为每个资产进行单独的解冻交易。

{% totem %}
{% totem-accordion title="代码示例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 定义用于测试转移限制的虚拟目标钱包
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 步骤 1：使用 devnet RPC 端点初始化 Umi
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 步骤 2：创建并为测试钱包注资
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 步骤 3：创建一个新集合来持有我们的冻结资产
  console.log("Creating parent collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // 等待交易确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证集合已创建
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Collection created successfully:", collectionSigner.publicKey);

  // 步骤 4：在集合中创建冻结资产
  console.log("Creating frozen asset...");
  const assetSigner = generateSigner(umi);

  // 使用 PermanentFreezeDelegate 插件创建具有永久冻结的资产
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // PermanentFreezeDelegate 插件永久冻结资产
        type: 'PermanentFreezeDelegate',
        frozen: true, // 将资产设置为冻结
        authority: { type: "None" }, // 没有权限可以解冻它
      },
    ],
  }).sendAndConfirm(umi);

  // 等待交易确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证资产已创建
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Frozen asset created successfully:", assetSigner.publicKey);

  // 步骤 5：演示资产确实已冻结
  console.log(
    "Testing frozen property by attempting a transfer (this should fail)..."
  );

  // 尝试转移资产（由于冻结，这将失败）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 记录失败的转移尝试签名
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}

### 集合级别实现
对于所有资产都应该是灵魂绑定的集合，在集合级别应用插件更高效。这需要更少的租金，并能在一个交易中解冻整个集合。

{% totem %}
{% totem-accordion title="代码示例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 定义用于测试转移限制的虚拟目标钱包
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 步骤 1：使用 devnet RPC 端点初始化 Umi
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 步骤 2：创建并为测试钱包注资
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 等待空投确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 步骤 3：创建一个新的冻结集合
  console.log("Creating frozen collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Frozen Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // PermanentFreezeDelegate 插件永久冻结集合
        type: 'PermanentFreezeDelegate',
        frozen: true, // 将集合设置为冻结
        authority: { type: "None" }, // 没有权限可以解冻它
      },
    ],
  }).sendAndConfirm(umi);

  // 等待集合创建确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证集合已创建
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Frozen collection created successfully:", collectionSigner.publicKey);

  // 步骤 4：在冻结集合中创建资产
  console.log("Creating asset in frozen collection...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Frozen Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

  // 等待资产创建确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证资产已创建
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Asset created successfully in frozen collection:", assetSigner.publicKey);

  // 步骤 5：演示资产被集合冻结
  console.log(
    "Testing frozen property by attempting a transfer (this should fail)..."
  );

  // 尝试转移资产（由于集合冻结，这将失败）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 记录失败的转移尝试签名
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}

## 使用 Oracle 插件创建灵魂绑定 NFT

Oracle 插件提供了一种批准或拒绝资产不同生命周期事件的方法。要创建灵魂绑定 NFT，我们可以使用 Metaplex 部署的特殊 Oracle，它始终拒绝转移事件，同时仍允许其他操作如销毁。这与 Permanent Freeze Delegate 插件方法不同，因为即使资产无法转移，它们仍然可以销毁。

使用 Oracle 插件创建灵魂绑定资产时，需要将插件附加到资产上。这可以在创建时或之后完成。在此示例中，我们使用 Metaplex 部署的[默认 Oracle](/zh/smart-contracts/core/external-plugins/oracle#metaplex-部署的默认-oracles)，它将始终拒绝。

这有效地创建了一个无法转移但可以销毁的永久灵魂绑定资产。以下代码片段展示了如何操作：

```js
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: "My Soulbound Asset",
  uri: "https://example.com/my-asset.json",
  plugins: [
    {
      // Oracle 插件允许我们控制转移权限
      type: "Oracle",
      resultsOffset: {
        type: "Anchor",
      },
      baseAddress: ORACLE_ACCOUNT,
      lifecycleChecks: {
        // 配置 Oracle 拒绝所有转移尝试
        transfer: [CheckResult.CAN_REJECT],
      },
      baseAddressConfig: undefined,
    },
  ],
})
```

### 资产级别实现
Oracle 插件可以使单个资产不可转移，同时保留销毁它们的能力。这为可能需要销毁资产的情况提供了灵活性。

{% totem %}
{% totem-accordion title="代码示例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 定义将控制转移权限的 Oracle 账户
// 这是 Metaplex 部署的始终拒绝转移的 Oracle
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

// 定义用于测试转移限制的虚拟目标钱包
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 步骤 1：使用 devnet RPC 端点初始化 Umi
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 步骤 2：创建并为测试钱包注资
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 步骤 3：创建一个新集合来持有我们的灵魂绑定资产
  console.log("Creating parent collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // 等待交易确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证集合已创建
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Collection created successfully:", collectionSigner.publicKey);

  // 步骤 4：在集合中创建灵魂绑定资产
  console.log("Creating soulbound asset...");
  const assetSigner = generateSigner(umi);

  // 使用 Oracle 插件创建具有转移限制的资产
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Soulbound Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // Oracle 插件允许我们控制转移权限
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // 配置 Oracle 拒绝所有转移尝试
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);

  // 等待交易确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证资产已创建
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Soulbound asset created successfully:", assetSigner.publicKey);

  // 步骤 5：演示资产确实是灵魂绑定的
  console.log(
    "Testing soulbound property by attempting a transfer (this should fail)..."
  );

  // 尝试转移资产（由于 Oracle 限制，这将失败）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 记录失败的转移尝试签名
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}

### 集合级别实现
在集合级别应用 Oracle 插件使集合中的所有资产不可转移但可销毁。这更节省租金，并允许一次性管理整个集合的权限。

{% totem %}
{% totem-accordion title="代码示例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

// 定义将控制转移权限的 Oracle 账户
// 这是 Metaplex 部署的始终拒绝转移的 Oracle
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

// 定义用于测试转移限制的虚拟目标钱包
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

(async () => {
  // 步骤 1：使用 devnet RPC 端点初始化 Umi
  const umi = createUmi(
    "https://devnet-aura.metaplex.com/<YOUR_API_KEY>"
  ).use(mplCore());

  // 步骤 2：创建并为测试钱包注资
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));

  console.log("Funding test wallet with devnet SOL...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // 等待空投确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 步骤 3：创建具有转移限制的新集合
  console.log("Creating soulbound collection...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Soulbound Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // Oracle 插件允许我们控制转移权限
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // 配置 Oracle 拒绝所有转移尝试
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);

  // 等待集合创建确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证集合已创建
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("Soulbound collection created successfully:", collectionSigner.publicKey);

  // 步骤 4：在集合中创建灵魂绑定资产
  console.log("Creating soulbound asset...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Soulbound Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

  // 等待资产创建确认
  await new Promise(resolve => setTimeout(resolve, 15000));

  // 获取并验证资产已创建
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("Soulbound asset created successfully:", assetSigner.publicKey);

  // 步骤 5：演示资产确实是灵魂绑定的
  console.log(
    "Testing soulbound property by attempting a transfer (this should fail)..."
  );

  // 尝试转移资产（由于 Oracle 限制，这将失败）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  // 记录失败的转移尝试签名
  console.log(
    "Transfer attempt signature:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();

```
{% /totem-accordion  %}
{% /totem %}
