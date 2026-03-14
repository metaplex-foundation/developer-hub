---
title: Updating a Core Candy Machine
metaTitle: Update a Core Candy Machine | Core Candy Machine
description: Learn how to update your Core Candy Machine settings, reassign authority, modify guards, and manually wrap or unwrap Candy Guard accounts.
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
  - q: Can I change the itemsAvailable count after minting has started?
    a: No. Some Core Candy Machine settings, including itemsAvailable, are locked once the first item has been minted. Update these fields before any minting occurs.
  - q: Does updating Candy Guards replace all existing guard settings?
    a: Yes. The updateCandyGuard function overwrites the entire guards object. You must include all guards you want to keep, even if their settings have not changed. Fetch the current guard account first and spread its values into your update call.
  - q: Do I need to update the collection authority when I reassign the Candy Machine authority?
    a: Yes. The Core Candy Machine authority and the collection asset update authority must match. After calling setMintAuthority, update the collection asset to use the same new authority.
  - q: What is the difference between wrapping and unwrapping a Candy Guard?
    a: Wrapping associates a Candy Guard account with a Core Candy Machine so the guard rules are enforced during minting. Unwrapping dissociates them, removing guard enforcement. Most projects keep guards wrapped at all times.
---

## Summary

The `updateCandyMachine` function modifies a Core Candy Machine's on-chain settings after initial creation, while `updateCandyGuard` lets you change the [guards](/smart-contracts/core-candy-machine/guards) that control minting access.

- Update Candy Machine data fields such as `itemsAvailable`, `isMutable`, [Config Line Settings](/smart-contracts/core-candy-machine/create#config-line-settings), and [Hidden Settings](/smart-contracts/core-candy-machine/create#hidden-settings)
- Reassign the mint authority to a new wallet using `setMintAuthority`
- Modify guard rules with `updateCandyGuard` -- note that the entire guards object is replaced on each update
- Manually associate or dissociate Candy Guard accounts using `wrap` and `unwrap`
{.lead}

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

## Update Function Arguments

The `updateCandyMachine` function accepts the Candy Machine public key and a `data` object containing the fields to modify.

{% dialect-switcher title="Update Core Candy Machine Args" %}
{% dialect title="JavaScript" id="js" %}

| Name         | Type      | Description                                   |
| ------------ | --------- | --------------------------------------------- |
| candyMachine | publicKey | The public key of the Candy Machine to update  |
| data         | data      | Object containing the updated settings         |

{% /dialect %}
{% /dialect-switcher %}

{% callout type="warning" %}
Some settings cannot be changed once minting has started. Always finalize your configuration before the first mint occurs.
{% /callout %}

### Candy Machine Data Object

The `data` object defines the mutable settings of a Core Candy Machine. Pass this object to `updateCandyMachine` with the fields you want to change.

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

## Assigning a New Authority

The `setMintAuthority` function transfers the Core Candy Machine's mint authority to a new wallet address. Both the current authority and the new authority must sign the transaction.

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

{% callout type="warning" %}
When assigning a new authority to a Core Candy Machine you must also update the collection asset to use the same update authority. The Candy Machine authority and the collection update authority must match for minting to succeed.
{% /callout %}

## Updating Candy Guards

The `updateCandyGuard` function replaces the entire [guards](/smart-contracts/core-candy-machine/guards) configuration on a Candy Guard account. Use it to change mint prices, adjust start dates, enable new guards, or disable existing ones.

You can enable new guards by providing their settings or disable current ones by giving them empty settings.

{% dialect-switcher title="Update guards" %}
{% dialect title="JavaScript" id="js" %}

You may update the guards of a Core Candy Machine the same way you created them. That is, by providing their settings inside the `guards` object of the `updateCandyGuard` function. Any guard set to `none()` or not provided will be disabled.

{% callout type="warning" %}
The entire `guards` object will be updated meaning **it will override all existing guards**. Make sure to provide the settings for all guards you want to enable, even if their settings are not changing. Fetch the candy guard account first to fall back to its current guards.
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
    // Either empty, or if you are using groups add the data here
  ]
})
```

API References: [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Wrapping and Unwrapping Candy Guard Accounts

Wrapping associates a Candy Guard with a Core Candy Machine so that the guard rules are enforced during minting. Unwrapping dissociates them. Most projects create both accounts together, but you can manage them independently when needed.

You will first need to create the two accounts separately and associate/dissociate them manually.

{% dialect-switcher title="Associate and dissociate guards from a Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

The `create` function of the Umi library already takes care of creating and associating a brand new Candy Guard account for every Candy Machine account created.

However, if you wanted to create them separately and manually associate/dissociate them, this is how you'd do it.

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

## Notes

- Some Candy Machine settings -- including `itemsAvailable` -- are locked once the first item has been minted. Finalize all data fields before minting begins.
- Calling `updateCandyGuard` replaces the **entire** guards object. Always fetch the current guard state and spread existing values before applying changes, or you will unintentionally disable active guards.
- The Core Candy Machine authority and the collection asset update authority must match. If you reassign authority with `setMintAuthority`, update the collection asset authority as well.
- Wrapping and unwrapping are separate from guard creation. A Candy Guard has no effect on minting until it is wrapped (associated) with a Candy Machine.

## FAQ

### Can I change the itemsAvailable count after minting has started?

No. Some Core Candy Machine settings, including `itemsAvailable`, are locked once the first item has been minted. Update these fields before any minting occurs.

### Does updating Candy Guards replace all existing guard settings?

Yes. The `updateCandyGuard` function overwrites the entire `guards` object. You must include all guards you want to keep, even if their settings have not changed. Fetch the current guard account first and spread its values into your update call.

### Do I need to update the collection authority when I reassign the Candy Machine authority?

Yes. The Core Candy Machine authority and the collection asset update authority must match. After calling `setMintAuthority`, update the collection asset to use the same new authority.

### What is the difference between wrapping and unwrapping a Candy Guard?

Wrapping associates a Candy Guard account with a Core Candy Machine so the guard rules are enforced during minting. Unwrapping dissociates them, removing guard enforcement. Most projects keep guards wrapped at all times.

