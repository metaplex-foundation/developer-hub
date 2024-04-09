---
title: Updating a Candy Machine
metaTitle: Updating a Candy Machine
description: Learn how to update your CMV4 and it's various settings.
---

## Updating a CMV4

### Args

Available arguments that can be passed into the createCandyMachineV2 function.

| name         | type      |
| ------------ | --------- |
| candyMachine | publicKey |
| data         | link      |

Some settings are unabled to be changed/updated once minting has started.

#### data

| key                | value                      |
| ------------------ | -------------------------- |
| itemsAvailable     | number                     |
| isMutable          | boolean                    |
| configLineSettings | Option<ConfigLineSettings> |
| hiddenSettings     | Option<HiddenSettings>     |

{% dialect-switcher title="data object" %}
{% dialect title="JavaScript" id="js" %}

```ts
data =  {
    itemsAvailable: number | bigint;
    isMutable: boolean;
    configLineSettings: OptionOrNullable<ConfigLineSettingsArgs>;
    hiddenSettings: OptionOrNullable<HiddenSettingsArgs>;
}
```

{% /dialect %}
{% /dialect-switcher %}

##### itemsAvailable

### Example

{% dialect-switcher title="Create a Candy Machine with configLineSettings" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

await updateCandyMachine(umi, {
  candyMachine,
  data: {
    itemsAvailable: number | bigint;
    isMutable: boolean;
    configLineSettings: OptionOrNullable<ConfigLineSettingsArgs>;
    hiddenSettings: OptionOrNullable<HiddenSettingsArgs>;
}
}).sendAndConfirm(umi)
```

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

{% dialect-switcher title="Create a Candy Machine with configLineSettings" %}
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
