---
title: 为 Core Candy Machine 创建铸造资产网站
metaTitle: 为 Core Candy Machine 创建铸造资产网站 | Core Candy Machine
description: 如何创建与 Solana 上 Candy Machine 铸造程序交互的 UI。
---

如果您想在 Solana 上发布 Core NFT 集合，您通常会使用 Candy Machine，让用户可以来购买您的资产。为了提供用户友好的体验，建议为其创建一个网站。本指南将重点介绍如何构建自己的铸造功能。它还将展示如何从 Candy Machine 获取数据，例如显示可铸造的剩余数量。

本指南侧重于核心 Candy Machine 功能和交互，而不是提供完整的网站实现。它不会涵盖向网站添加按钮或与钱包适配器集成等方面。相反，它提供了有关使用 Core Candy Machine 的基本信息。

对于完整的网站实现，包括 UI 元素和钱包集成，您可能需要从 [`metaplex-nextjs-tailwind-template`](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template) 等模板开始。此模板包含钱包适配器等组件的许多设置步骤。

## 前提条件

- 已创建的 Candy Machine。在[这里](https://developers.metaplex.com/core-candy-machine/create)找到有关如何创建的更多信息。
- 对 Web 开发和您选择的框架有基本了解。我们推荐 Next JS 以便与 umi 最容易兼容。

## 所需包

无论您选择的模板或实现方式如何，您都需要安装以下包以与 Core Candy Machine 交互：

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## 获取链上数据

设置环境后，我们可以开始关注 Candy Machine。铸造 UI 通常想要显示以下数据：

- 已铸造资产的数量
- Candy Machine 中的资产数量
- 铸造开始前的时间
- 资产价格
- 等等

获取不显示给用户但用于后台计算的额外数据也是有意义的。例如，在使用 [Redeemed Amount](/core-candy-machine/guards/redeemed-amount) 守卫时，您需要获取已兑换的数量以查看用户是否被允许铸造更多。

### 获取 Candy Machine 数据

在 Candy Machine 账户中，存储了可用和已兑换资产数量等数据。它还存储了 `mintAuthority`，通常是您的 Candy Guard 的地址。

要获取 Candy Machine，可以使用如下所示的 `fetchCandyMachine` 函数：

我们将使用 Metaplex Aura Devnet 端点。
要获得 Solana 和 Eclipse 区块链上 Metaplex Aura 网络的访问权限，您可以访问 [Aura App](https://aura-app.metaplex.com/) 获取端点和 API 密钥。

```ts
import {
  mplCandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// 仅当您之前未设置 umi 时才需要以下两行
// 我们将使用来自 Aura 数据网络的 Solana Devnet 作为端点
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
            .use(mplCandyMachine());

const candyMachineId = "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9";
const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
console.log(candyMachine)
```

#### 显示剩余资产数量

要显示类似 `已铸造 13 / 16 资产` 的部分，可以使用：

```ts
const mintedString = `${candyMachine.itemsRedeemed} / ${candyMachine.itemsAvailable} 资产已铸造`
```

如果您想获取剩余可铸造资产数量，如 `3 可用`，您可以运行如下计算：

```ts
const availableString = `${candyMachine.itemsAvailable - candyMachine.itemsRedeemed} 可用`;
```

### 获取 Candy Guard 数据

Candy Guard 包含必须满足才能允许铸造的条件。例如，发生 Sol 或代币支付、限制一个钱包允许铸造的资产数量等等。您可以在 [Candy Guard 页面](/core-candy-machine/guards)找到有关 Candy Guards 的更多信息。

```ts
import { safeFetchCandyGuard } from "@metaplex-foundation/mpl-core-candy-machine";

const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
```

## 验证资格

获取所有所需数据后，您可以验证连接的钱包是否被允许铸造。

需要注意的是，当组附加到 Candy Machine 时，`default` 守卫在所有创建的组中普遍适用。此外，启用组后，从 `default` 组铸造的能力将被禁用，您必须使用创建的组进行铸造。

假设一个附加了 `startDate`、`SolPayment` 和 `mintLimit` 守卫且未使用组的 Candy Machine，在允许用户调用铸造功能之前应进行以下验证：

1. 验证 `startDate` 在过去：
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

let allowed = true;

// 获取当前 slot 并读取区块时间
const slot = await umi.rpc.getSlot();
let solanaTime = await umi.rpc.getBlockTime(slot);

// 检查是否附加了 `default` startDate 守卫
const startDate = unwrapOption(candyGuard.guards.startDate);
if (startDate) {
  // 验证开始时间是否在未来
  if (solanaTime < startDate) {
        console.info(`StartDate 未到达！`);
        allowed = false;
  }
}
```

2. 检查钱包是否有足够的 SOL 支付铸造费用：
```ts
const solPayment = unwrapOption(candyGuard.guards.solPayment);
if (solPayment){
  if (solPayment.lamports.basisPoints > solBalance){
    console.info(`SOL 不足！`);
    allowed = false;
  }
}
```

3. 确保 `mintLimit` 尚未达到：
```ts
const mintLimit = unwrapOption(candyGuard.guards.mintLimit);
if (mintLimit){
      const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
      id: mintLimit.id,
      user: umi.identity.publicKey,
      candyMachine: candyMachine.publicKey,
      candyGuard: candyMachine.mintAuthority,
    });

    // mintCounter PDA 存在（不是第一次铸造）
    if (mintCounter && mintLimit.limit >= mintCounter.count) {
      allowed = false;
    }
}
```

## 创建铸造功能

建议为所有附加的守卫实施资格检查。请记住，如果附加了任何组，`default` 守卫将应用于所有其他组，同时禁用 `default` 组。

完成这些检查后，如果需要，运行路由指令后可以构建铸造交易。根据守卫，可能需要传入 `mintArgs`。这些是通过传入正确的账户和数据来帮助构建铸造交易的参数。

假设再次是附加了 `startDate`、`SolPayment` 和 `mintLimit` 守卫的 Candy Machine，让我们看看如何构建 `mintArgs`：

```ts
import { some, unwrapOption } from '@metaplex-foundation/umi';
import {
  DefaultGuardSetMintArgs
} from "@metaplex-foundation/mpl-core-candy-machine";

let mintArgs: Partial<DefaultGuardSetMintArgs> = {};

// 添加 solPayment mintArgs
const solPayment = unwrapOption(candyGuard.guards.solPayment)
if (solPayment) {
  mintArgs.solPayment = some({
    destination: solPayment.destination,
  });
}

// 添加 mintLimit mintArgs
const mintLimit = unwrapOption(candyGuard.guards.mintLimit)
if (mintLimit) {
  mintArgs.mintLimit = some({ id: mintLimit.id });
}
```

现在 `mintArgs` 已构建，让我们看看如何调用铸造功能本身：

```ts
// 生成 NFT 地址
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} 已铸造！`)
```

## 高级铸造技术

### 在一个交易中铸造多个 NFT

为了效率，您可能希望允许用户在单个交易中铸造多个 NFT。通过组合 [Transaction Builders](/umi/transactions#transaction-builders) 可以实现这一点：

```ts
let builder = transactionBuilder()
  .add(mintV1(...))
  .add(mintV1(...))
```

如果您在交易中添加太多 `mintV1` 指令，您将收到 `Transaction too large` 错误。函数 [`builder.fitsInOneTransaction(umi)`](/umi/transactions#transaction-builders) 允许在发送前检查，以便在需要时拆分交易。

### 守卫组

守卫组是 Core Candy Machine 的强大功能，允许您定义具有不同配置的多组守卫。

要调整 `mintV1` 指令以使用您的特定组，关键修改是包含指定所需标签的 `group` 参数：

```ts
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
  group: "group1",
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} 已铸造！`)
```

## 后续步骤

现在您已经掌握了在前端与 Candy Machine 交互的基础知识，您可能需要考虑以下步骤来进一步增强和分发您的项目：

1. **托管**：将前端部署到托管平台，使其可供用户访问。开发者中流行的选项包括：
   - Vercel
   - Cloudflare Pages
   - Netlify
   - GitHub Pages

2. **测试**：在各种设备和浏览器上彻底测试您的 UI，以确保流畅的用户体验。

3. **优化**：针对性能微调您的前端，特别是如果您预期在铸造活动期间有高流量。

4. **监控**：设置监控工具来跟踪您的 Candy Machine UI 状态，并快速解决可能出现的任何问题。

通过关注这些领域，您将为使用 Core Candy Machine 成功发布和维护 NFT 铸造项目做好充分准备。
