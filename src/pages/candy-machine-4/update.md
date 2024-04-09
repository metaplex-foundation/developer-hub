---
title: Updating a CMV4
metaTitle: Updating a CMV4
description: Learn how to update your CMV4 and it's various settings.
---

## Args

Available arguments that can be passed into the createCandyMachineV2 function.

| name         | type   |
| ------------ | ------ |
| candyMachine | publicKey |
| data         | link   |

Some settings are unabled to be changed/updated once minting has started.

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
