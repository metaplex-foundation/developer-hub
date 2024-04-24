---
title: Updating a Candy Machine
metaTitle: Updating a Candy Machine
description: Learn how to update your CMV4 and it's various settings.
---

## Updating a CMV4

{% dialect-switcher title="Updating a Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

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

### Args

{% dialect-switcher title="Update Candy Machine Args" %}
{% dialect title="JavaScript" id="js" %}

Available arguments that can be passed into the createCandyMachineV2 function.

| name         | type      |
| ------------ | --------- |
| candyMachine | publicKey |
| data         | link      |

{% /dialect %}
{% /dialect-switcher %}

Some settings are unabled to be changed/updated once minting has started.

#### data

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

- [ConfigLineSettingsArgs](/test)
- [HiddenSettingsArgs](/test)

{% /dialect %}
{% /dialect-switcher %}

## Assigning a new Authority to the Candy Machine

There maybe scenarios where you may wish to transfer the Candy Machine authority across to a new address. This can be achieved with the `setMintAuthority` function.

export declare type SetMintAuthorityInstructionAccounts = {
/** Candy Machine account. \*/
candyMachine: PublicKey | Pda;
/** Candy Machine authority _/
authority?: Signer;
/\*\* New candy machine authority _/
mintAuthority: Signer;
};

{% dialect-switcher title="Assign New Authority to Candy Machine" %}
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

When assigning a new Authority to a Candy Machine you will also have to update the Collection Asset to the same update Authority.

// Todo: Check this is still the case because new authorties work different compared to Nft/pNft.

## Updating guards

Did you set something wrong in your guards? Did you change your mind about the mint price? Do you need to delay the start of the mint of a little? No worries, guards can easily be updated following the same settings used when creating them.

You can enable new guards by providing their settings or disable current ones by giving them empty settings.

{% dialect-switcher title="Update guards" %}
{% dialect title="JavaScript" id="js" %}

You may update the guards of a Candy Machine the same way you created them. That is, by providing their settings inside the `guards` object of the `updateCandyGuard` function. Any guard set to `none()` or not provided will be disabled.

Note that the entire `guards` object will be updated meaning **it will override all existing guards**!

Therefore, make sure to provide the settings for all guards you want to enable, even if their settings are not changing. You may want to fetch the candy guard account first to fallback to its current guards.

```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
})
```

API References: [updateCandyGuard](https://mpl-core-candy-machine-js-docs.vercel.app/functions/updateCandyGuard.html), [CandyGuard](https://mpl-core-candy-machine-js-docs.vercel.app/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine-js-docs.vercel.app/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Wrapping and unwrapping Candy Guard accounts manually

So far we’ve managed both Candy Machine and Candy Guard accounts together because that makes the most sense for most projects.

However, it is important to note that Candy Machines and Candy Guards can be created and associated in different steps, even using our SDKs.

You will first need to create the two accounts separately and associate/dissociate them manually.

{% dialect-switcher title="Associate and dissociate guards from a Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

The `create` function of the Umi library already takes care of creating and associating a brand new Candy Guard account for every Candy Machine account created.

However, if you wanted to create them separately and manually associate/dissociate them, this is how you’d do it.

```ts
import { some, percentAmount, sol, dateTime } from '@metaplex-foundation/umi'

// Create a Candy Machine without a Candy Guard.
const candyMachine = generateSigner(umi)
await createCandyMachineV2({
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    { address: umi.identity.publicKey, verified: false, percentageShare: 100 },
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

API References: [createCandyMachineV2](https://mpl-core-candy-machine-js-docs.vercel.app/functions/createCandyMachineV2.html), [createCandyGuard](https://mpl-core-candy-machine-js-docs.vercel.app/functions/createCandyGuard.html), [wrap](https://mpl-core-candy-machine-js-docs.vercel.app/functions/wrap.html), [unwrap](https://mpl-core-candy-machine-js-docs.vercel.app/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}
