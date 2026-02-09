---
title: Updating The Core Candy Machine
metaTitle: Update a Core Candy Machine | Core Candy Machine
description: Learn how to update your Core Candy Machine and it's various settings.
---

{% dialect-switcher title="Updating a Core Candy Machine" %}
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

{% dialect-switcher title="Update Core Candy Machine Args" %}
{% dialect title="JavaScript" id="js" %}

Available arguments that can be passed into the updateCandyMachine function.

| name         | type      |
| ------------ | --------- |
| candyMachine | publicKey |
| data         | data      |

{% /dialect %}
{% /dialect-switcher %}

Some settings are unabled to be changed/updated once minting has started.

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

- [ConfigLineSettingsArgs](/smart-contracts/core-candy-machine/create#config-line-settings)
- [HiddenSettingsArgs](/smart-contracts/core-candy-machine/create#hidden-settings)

{% /dialect %}
{% /dialect-switcher %}

## Assigning a new Authority to the Candy Machine

There may be scenarios where you may wish to transfer the Candy Machine authority across to a new address. This can be achieved with the `setMintAuthority` function.

export declare type SetMintAuthorityInstructionAccounts = {
/**Candy Machine account. \*/
candyMachine: PublicKey | Pda;
/** Candy Machine authority _/
authority?: Signer;
/\*\* New candy machine authority_/
mintAuthority: Signer;
};

{% dialect-switcher title="Assign New Authority to Core Candy Machine" %}
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

When assigning a new Authority to a Core Candy Machine you will also have to update the Collection Asset to the same update Authority.

## Updating guards

Did you set something wrong in your guards? Did you change your mind about the mint price? Do you need to delay the start of the mint of a little? No worries, guards can easily be updated following the same settings used when creating them.

You can enable new guards by providing their settings or disable current ones by giving them empty settings.

{% dialect-switcher title="Update guards" %}
{% dialect title="JavaScript" id="js" %}

You may update the guards of a Core Candy Machine the same way you created them. That is, by providing their settings inside the `guards` object of the `updateCandyGuard` function. Any guard set to `none()` or not provided will be disabled.

Note that the entire `guards` object will be updated meaning **it will override all existing guards**!

Therefore, make sure to provide the settings for all guards you want to enable, even if their settings are not changing. You may want to fetch the candy guard account first to fallback to its current guards.

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
    // Either empty, or if you are using groups add the data here
  ]
})
```

API References: [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Wrapping and unwrapping Candy Guard accounts manually

So far we’ve managed both Core Candy Machine and Core Candy Guard accounts together because that makes the most sense for most projects.

However, it is important to note that Core Candy Machines and Core Candy Guards can be created and associated in different steps, even using our SDKs.

You will first need to create the two accounts separately and associate/dissociate them manually.

{% dialect-switcher title="Associate and dissociate guards from a Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

The `create` function of the Umi library already takes care of creating and associating a brand new Candy Guard account for every Candy Machine account created.

However, if you wanted to create them separately and manually associate/dissociate them, this is how you’d do it.

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

// Create a Candy Machine without a Candy Guard.
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

// Create a Candy Guard.
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

// Associate the Candy Guard with the Candy Machine.
await wrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// Dissociate them.
await unwrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

API References: [createCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyMachine.html), [createCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}
