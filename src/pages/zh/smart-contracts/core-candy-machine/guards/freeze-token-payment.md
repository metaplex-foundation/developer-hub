---
title: '冻结代币支付守卫'
metaTitle: '冻结代币支付守卫 | Core Candy Machine'
description: "Core Candy Machine '冻结代币支付' 守卫允许您将 SPL 代币设置为铸造货币及其价值，同时在购买后将铸造的 Core NFT 资产冻结一段设定的时间。"
---

## 概述

**冻结代币支付** 守卫通过向付款人收取来自特定铸币账户的一定数量代币来允许铸造冻结资产。冻结资产在解冻之前不能转移或在任何市场上架。

冻结资产可以由任何人解冻，只要满足以下条件之一：

- Candy Machine 已全部铸造完毕。
- Candy Machine 已被删除。
- 配置的冻结期限（最长 30 天）已过。

代币被转移到"冻结托管"账户，该账户必须在铸造开始之前由 Candy Guard 权限初始化。一旦所有冻结资产被解冻，资金可以由 Candy Guard 权限解锁并转移到配置的目标账户。

您可以通过此守卫的[路由指令](#路由指令)初始化冻结托管账户、解冻资产和解锁资金。

## 守卫设置

冻结代币支付守卫包含以下设置：

- **数量**：要向付款人收取的代币数量。
- **铸币**：定义我们要支付的 SPL 代币的铸币账户地址。
- **目标关联代币地址 (ATA)**：最终将代币发送到的关联代币账户地址。我们可以使用 **铸币** 属性和任何应该接收这些代币的钱包地址来查找关联代币地址 PDA 获取此地址。

{% dialect-switcher title="使用冻结代币支付守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下是如何使用冻结代币支付守卫创建 Candy Machine。请注意，在此示例中，我们使用 Umi 的身份作为目标钱包。

```tsx
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

create(umi, {
  // ...
  guards: {
    freezeTokenPayment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      }),
    }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

冻结代币支付守卫包含以下铸造设置：

- **铸币**：定义我们要支付的 SPL 代币的铸币账户地址。
- **目标关联代币地址 (ATA)**：最终将代币发送到的关联代币账户地址。

{% dialect-switcher title="使用冻结代币支付守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递冻结代币支付守卫的铸造设置：

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    freezeTokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 路由指令

冻结代币支付路由指令支持以下功能。

### 初始化冻结托管

_路径: `initialize`_

使用冻结代币支付守卫时，我们必须在铸造开始之前初始化冻结托管账户。这将创建一个从守卫设置的目标 ATA 属性派生的 PDA 账户。

冻结托管 PDA 账户将跟踪多个参数，例如：

- 通过此守卫铸造了多少冻结资产。
- 第一个冻结资产何时通过此守卫铸造，因为冻结期限从那时开始计算。

初始化此冻结托管账户时，我们必须向守卫的路由指令提供以下参数：

- **路径** = `initialize`：选择在路由指令中执行的路径。
- **铸币**：定义我们要支付的 SPL 代币的铸币账户地址。
- **目标关联代币地址 (ATA)**：最终将代币发送到的关联代币账户地址。
- **期限**：冻结期限应持续的时间（以秒为单位）。最长为 30 天（2,592,000 秒），将从通过此守卫铸造的第一个冻结资产开始计算。
- **Candy Guard 权限**：Candy Guard 账户的权限作为签名者。

{% dialect-switcher title="初始化冻结托管" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

在下面的示例中，我们使用最长 15 天的冻结期限初始化冻结托管账户，并使用当前身份作为 Core Candy Guard 权限。

```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "initialize",
    mint: tokenMint.publicKey,
    destinationAta,
    period: 15 * 24 * 60 * 60, // 15 天。
    candyGuardAuthority: umi.identity,
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 解冻冻结资产

_路径: `thaw`_

冻结资产可以由任何人解冻，只要满足以下条件之一：

- Core Candy Machine 已全部铸造完毕。
- Core Candy Machine 已被删除。
- 配置的冻结期限（最长 30 天）已过。

请注意，由于冻结托管中的代币在所有资产解冻之前不可转移，这为国库尽快解冻所有资产创造了激励。

要解冻冻结资产，我们必须向守卫的路由指令提供以下参数：

- **路径** = `thaw`：选择在路由指令中执行的路径。
- **铸币**：定义我们要支付的 SPL 代币的铸币账户地址。
- **目标关联代币地址 (ATA)**：最终将代币发送到的关联代币账户地址。
- **资产地址**：要解冻的冻结资产的铸币地址。
- **资产所有者**：要解冻的冻结资产的所有者地址。

{% dialect-switcher title="使用冻结代币支付守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

在下面的示例中，我们解冻属于当前身份的冻结资产。

```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "thaw",
    mint: tokenMint.publicKey,
    destinationAta,
    AssetMint: AssetMint.publicKey,
    AssetOwner: umi.identity.publicKey,
    AssetTokenStandard: candyMachine.tokenStandard,
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 解锁资金

_路径: `unlockFunds`_

一旦所有冻结资产被解冻，国库可以从冻结托管账户解锁资金。这将把代币转移到配置的目标 ATA 地址。

要解锁资金，我们必须向守卫的路由指令提供以下参数：

- **路径** = `unlockFunds`：选择在路由指令中执行的路径。
- **铸币**：定义我们要支付的 SPL 代币的铸币账户地址。
- **目标关联代币地址 (ATA)**：最终将代币发送到的关联代币账户地址。
- **Candy Guard 权限**：Core Candy Guard 账户的权限作为签名者。

{% dialect-switcher title="使用冻结代币支付守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

在下面的示例中，我们使用当前身份作为 Candy Guard 权限从冻结托管账户解锁资金。

```ts
route(umi, {
  // ...
  guard: 'freezeTokenPayment',
  routeArgs: {
    path: 'unlockFunds',
    destination,
    candyGuardAuthority: umi.identity,
  },
})
```

API 参考：[route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [freezeTokenPaymentRouteArgsUnlockFunds](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeTokenPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 停止冻结资产

可以在冻结代币支付守卫内停止冻结资产。换句话说，新铸造的资产将不再被冻结，但**现有的冻结资产将保持冻结**。

实现这一点有几种方法，可以分为两类：

- ☀️ **可以解冻**：现有的冻结资产可以由任何人使用路由指令的 `thaw` 路径解冻。
- ❄️ **不能解冻**：现有的冻结资产目前还不能解冻，我们必须等待"可以解冻"条件满足。

考虑到这一点，以下是停止冻结资产的完整方法列表以及每种方法是否允许解冻现有冻结资产：

- Candy Machine 已全部铸造完毕 → ☀️ **可以解冻**。
- 配置的冻结期限（最长 30 天）已过 → ☀️ **可以解冻**。
- Candy Machine 账户已被删除 → ☀️ **可以解冻**。
- Candy Guard 账户已被删除 → ❄️ **不能解冻**。
- 冻结代币支付守卫已从设置中移除 → ❄️ **不能解冻**。

## 冻结托管和守卫组

在各种[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)中使用多个冻结代币支付守卫时，了解冻结代币支付守卫和冻结托管账户之间的关系很重要。

冻结托管账户是从目标地址派生的 PDA。这意味着如果**多个冻结代币支付守卫**配置为使用**相同的目标地址**，它们将都**共享同一个冻结托管账户**。

因此，它们也将共享相同的冻结期限，所有资金将由同一个托管账户收集。这也意味着，我们只需要在每个配置的目标地址调用一次 `initialize` 路由指令。这意味着路由指令只需要在每个配置的目标地址执行一次。`unlockFunds` 同样适用。要 `thaw`，您可以使用任何共享同一托管账户的标签。

也可以使用具有不同目标地址的多个冻结代币支付守卫。在这种情况下，每个冻结代币支付守卫将拥有自己的冻结托管账户和自己的冻结期限。
