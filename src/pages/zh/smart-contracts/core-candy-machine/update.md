---
title: 更新 Core Candy Machine
metaTitle: 更新 Core Candy Machine | Core Candy Machine
description: 了解如何更新 Core Candy Machine 设置、重新分配权限、修改守卫，以及手动包装或解包 Candy Guard 账户。
keywords:
  - core candy machine
  - update candy machine
  - candy machine settings
  - candy guard update
  - set mint authority
  - solana NFT
  - metaplex
  - mpl-core-candy-machine
  - wrap candy guard
  - unwrap candy guard
  - guard configuration
  - candy machine authority
about:
  - Core Candy Machine configuration updates
  - Candy Guard management on Solana
  - Metaplex mpl-core-candy-machine SDK
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 铸造开始后可以更改 itemsAvailable 数量吗？
    a: 不可以。某些 Core Candy Machine 设置，包括 itemsAvailable，一旦第一个物品被铸造就会锁定。请在任何铸造发生之前更新这些字段。
  - q: 更新 Candy Guards 会替换所有现有的守卫设置吗？
    a: 是的。updateCandyGuard 函数会覆盖整个 guards 对象。您必须包含所有想要保留的守卫，即使它们的设置没有变化。先获取当前守卫账户并将其值展开到您的更新调用中。
  - q: 重新分配 Candy Machine 权限时是否需要更新集合权限？
    a: 是的。Core Candy Machine 权限和集合资产更新权限必须匹配。调用 setMintAuthority 后，将集合资产更新为使用相同的新权限。
  - q: 包装和解包 Candy Guard 有什么区别？
    a: 包装将 Candy Guard 账户与 Core Candy Machine 关联，以便在铸造期间强制执行守卫规则。解包取消关联，移除守卫强制执行。大多数项目始终保持守卫处于包装状态。
---

## 概要

`updateCandyMachine` 函数在初始创建后修改 Core Candy Machine 的链上设置，而 `updateCandyGuard` 允许您更改控制铸造访问的[守卫](/zh/smart-contracts/core-candy-machine/guards)。

- 更新 Candy Machine 数据字段，如 `itemsAvailable`、`isMutable`、[Config Line Settings](/zh/smart-contracts/core-candy-machine/create#config-line-settings) 和 [Hidden Settings](/zh/smart-contracts/core-candy-machine/create#hidden-settings)
- 使用 `setMintAuthority` 将铸造权限重新分配给新钱包
- 使用 `updateCandyGuard` 修改守卫规则——注意每次更新都会替换整个 guards 对象
- 使用 `wrap` 和 `unwrap` 手动关联或取消关联 Candy Guard 账户
{.lead}

{% dialect-switcher title="更新 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  updateCandyMachine
} from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

await updateCandyMachine(umi, {
  candyMachine,
  data: {
    itemsAvailable: 3333;
    isMutable: true;
    configLineSettings: none();
    hiddenSettings: none();
}
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 更新函数参数

`updateCandyMachine` 函数接受 Candy Machine 公钥和一个包含要修改字段的 `data` 对象。

{% dialect-switcher title="更新 Core Candy Machine Args" %}
{% dialect title="JavaScript" id="js" %}

| 名称         | 类型      | 描述                                   |
| ------------ | --------- | ------------------------------------- |
| candyMachine | publicKey | 要更新的 Candy Machine 的公钥          |
| data         | data      | 包含更新设置的对象                      |

{% /dialect %}
{% /dialect-switcher %}

{% callout type="warning" %}
一旦铸造开始，某些设置将无法更改。始终在第一次铸造发生之前完成配置。
{% /callout %}

### Candy Machine Data 对象

`data` 对象定义了 Core Candy Machine 的可变设置。将此对象传递给 `updateCandyMachine` 并包含您要更改的字段。

{% dialect-switcher title="Candy Machine Data Object" %}
{% dialect title="JavaScript" id="js" %}

```ts
data =  {
    itemsAvailable: number | bigint;
    isMutable: boolean;
    configLineSettings: OptionOrNullable<ConfigLineSettingsArgs>;
    hiddenSettings: OptionOrNullable<HiddenSettingsArgs>;
}
```

- [ConfigLineSettingsArgs](/zh/smart-contracts/core-candy-machine/create#config-line-settings)
- [HiddenSettingsArgs](/zh/smart-contracts/core-candy-machine/create#hidden-settings)

{% /dialect %}
{% /dialect-switcher %}

## 分配新权限

`setMintAuthority` 函数将 Core Candy Machine 的铸造权限转移到新的钱包地址。当前权限和新权限都必须签署交易。

export declare type SetMintAuthorityInstructionAccounts = {
/**Candy Machine 账户。 \*/
candyMachine: PublicKey | Pda;
/** Candy Machine 权限 _/
authority?: Signer;
/\*\* 新的 candy machine 权限_/
mintAuthority: Signer;
};

{% dialect-switcher title="为 Core Candy Machine 分配新权限" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setMintAuthority } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = publicKey('11111111111111111111111111111111')
const newAuthority = publicKey('22222222222222222222222222222222')

await setMintAuthority(umi, {
  candyMachine,
  mintAuthority: newAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

{% callout type="warning" %}
为 Core Candy Machine 分配新权限时，您还必须将集合资产更新为使用相同的更新权限。Candy Machine 权限和集合更新权限必须匹配才能成功铸造。
{% /callout %}

## 更新 Candy Guards

`updateCandyGuard` 函数替换 Candy Guard 账户上的整个[守卫](/zh/smart-contracts/core-candy-machine/guards)配置。使用它来更改铸造价格、调整开始日期、启用新守卫或禁用现有守卫。

您可以通过提供设置来启用新的守卫，或通过给它们空设置来禁用当前的守卫。

{% dialect-switcher title="更新守卫" %}
{% dialect title="JavaScript" id="js" %}

您可以用创建 Core Candy Machine 守卫的相同方式更新它们。也就是说，通过在 `updateCandyGuard` 函数的 `guards` 对象中提供它们的设置。任何设置为 `none()` 或未提供的守卫将被禁用。

{% callout type="warning" %}
整个 `guards` 对象将被更新，这意味着**它将覆盖所有现有的守卫**。请确保为您想要启用的所有守卫提供设置，即使它们的设置没有变化。先获取 candy guard 账户以回退到其当前的守卫。
{% /callout %}

```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyGuardId)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
  groups: [
    // 如果使用组，在这里添加数据，否则为空
  ]
})
```

API 参考: [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 包装和解包 Candy Guard 账户

包装将 Candy Guard 与 Core Candy Machine 关联，以便在铸造期间强制执行守卫规则。解包取消关联。大多数项目在创建时就将两个账户一起创建，但您可以在需要时独立管理它们。

您首先需要分别创建两个账户并手动关联/取消关联它们。

{% dialect-switcher title="关联和取消关联 Candy Machine 的守卫" %}
{% dialect title="JavaScript" id="js" %}

Umi 库的 `create` 函数已经负责为创建的每个 Candy Machine 账户创建和关联一个全新的 Candy Guard 账户。

但是，如果您想分别创建它们并手动关联/取消关联它们，以下是您的操作方式。

```ts
import {
  some,
  percentAmount,
  sol,
  dateTime
} from '@metaplex-foundation/umi'
import {
  createCandyMachine,
  createCandyGuard,
  findCandyGuardPda,
  wrap,
  unwrap
} from '@metaplex-foundation/mpl-core-candy-machine'

// 创建没有 Candy Guard 的 Candy Machine。
const candyMachine = generateSigner(umi)
await createCandyMachine({
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    {
      address: umi.identity.publicKey,
      verified: false,
      percentageShare: 100
    },
  ],
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 3,
    prefixUri: 'https://example.com/',
    uriLength: 20,
    isSequential: false,
  }),
}).sendAndConfirm(umi)

// 创建 Candy Guard。
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })
await createCandyGuard({
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// 将 Candy Guard 与 Candy Machine 关联。
await wrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// 取消它们的关联。
await unwrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

API 参考: [createCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyMachine.html), [createCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}

## 注意事项

- 某些 Candy Machine 设置——包括 `itemsAvailable`——一旦第一个物品被铸造就会锁定。在铸造开始前完成所有数据字段的设置。
- 调用 `updateCandyGuard` 会替换**整个** guards 对象。始终先获取当前守卫状态并展开现有值再应用更改，否则您将无意中禁用活跃的守卫。
- Core Candy Machine 权限和集合资产更新权限必须匹配。如果您使用 `setMintAuthority` 重新分配权限，也要更新集合资产权限。
- 包装和解包与守卫创建是分开的。Candy Guard 在被包装（关联）到 Candy Machine 之前对铸造没有影响。

## 常见问题

### 铸造开始后可以更改 itemsAvailable 数量吗？

不可以。某些 Core Candy Machine 设置，包括 `itemsAvailable`，一旦第一个物品被铸造就会锁定。请在任何铸造发生之前更新这些字段。

### 更新 Candy Guards 会替换所有现有的守卫设置吗？

是的。`updateCandyGuard` 函数会覆盖整个 `guards` 对象。您必须包含所有想要保留的守卫，即使它们的设置没有变化。先获取当前守卫账户并将其值展开到您的更新调用中。

### 重新分配 Candy Machine 权限时是否需要更新集合权限？

是的。Core Candy Machine 权限和集合资产更新权限必须匹配。调用 `setMintAuthority` 后，将集合资产更新为使用相同的新权限。

### 包装和解包 Candy Guard 有什么区别？

包装将 Candy Guard 账户与 Core Candy Machine 关联，以便在铸造期间强制执行守卫规则。解包取消关联，移除守卫强制执行。大多数项目始终保持守卫处于包装状态。

