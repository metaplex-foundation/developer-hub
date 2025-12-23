---
title: 更新 Core Candy Machine
metaTitle: 更新 Core Candy Machine | Core Candy Machine
description: 学习如何更新您的 Core Candy Machine 及其各种设置。
---

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

## Args

{% dialect-switcher title="更新 Core Candy Machine Args" %}
{% dialect title="JavaScript" id="js" %}

可以传递给 updateCandyMachine 函数的可用参数。

| 名称         | 类型      |
| ------------ | --------- |
| candyMachine | publicKey |
| data         | data      |

{% /dialect %}
{% /dialect-switcher %}

一旦铸造开始，某些设置将无法更改/更新。

### data

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

## 为 Candy Machine 分配新权限

在某些情况下，您可能希望将 Candy Machine 权限转移到新地址。这可以通过 `setMintAuthority` 函数实现。

export declare type SetMintAuthorityInstructionAccounts = {
/** Candy Machine 账户。 \*/
candyMachine: PublicKey | Pda;
/** Candy Machine 权限 _/
authority?: Signer;
/\*\* 新的 candy machine 权限 _/
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

为 Core Candy Machine 分配新权限时，您还需要将 Collection Asset 更新为相同的更新权限。

## 更新守卫

您在守卫中设置了错误的内容？您改变了对铸造价格的想法？您需要稍微延迟铸造的开始？不用担心，守卫可以使用创建它们时使用的相同设置轻松更新。

您可以通过提供设置来启用新的守卫，或通过给它们空设置来禁用当前的守卫。

{% dialect-switcher title="更新守卫" %}
{% dialect title="JavaScript" id="js" %}

您可以用创建 Core Candy Machine 守卫的相同方式更新它们。也就是说，通过在 `updateCandyGuard` 函数的 `guards` 对象中提供它们的设置。任何设置为 `none()` 或未提供的守卫将被禁用。

注意，整个 `guards` 对象将被更新，这意味着**它将覆盖所有现有的守卫**！

因此，请确保为您想要启用的所有守卫提供设置，即使它们的设置没有变化。您可能需要先获取 candy guard 账户以回退到其当前的守卫。

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

## 手动包装和解包 Candy Guard 账户

到目前为止，我们一起管理 Core Candy Machine 和 Core Candy Guard 账户，因为这对大多数项目来说最有意义。

然而，重要的是要注意，Core Candy Machine 和 Core Candy Guard 可以在不同的步骤中创建和关联，即使使用我们的 SDK。

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
