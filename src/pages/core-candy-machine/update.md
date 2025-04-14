---
titwe: Updating De Cowe Candy Machinye
metaTitwe: Update a Cowe Candy Machinye | Cowe Candy Machinye
descwiption: Weawn how to update youw Cowe Candy Machinye and it's vawious settings.
---

{% diawect-switchew titwe="Updating a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}
{% /diawect-switchew %}

## Awgs

{% diawect-switchew titwe="Update Cowe Candy Machinye Awgs" %}
{% diawect titwe="JavaScwipt" id="js" %}

Avaiwabwe awguments dat can be passed into de updateCandyMachinye function.

| nyame         | type      |
| ------------ | --------- |
| candyMachinye | pubwicKey |
| data         | data      |

{% /diawect %}
{% /diawect-switchew %}

Some settings awe unyabwed to be changed/updated once minting has stawted.

### data

{% diawect-switchew titwe="Candy Machinye Data Object" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
data =  {
    itemsAvailable: number | bigint;
    isMutable: boolean;
    configLineSettings: OptionOrNullable<ConfigLineSettingsArgs>;
    hiddenSettings: OptionOrNullable<HiddenSettingsArgs>;
}
```

- [ConfigLineSettingsArgs](/core-candy-machine/create#config-line-settings)
- [HiddenSettingsArgs](/core-candy-machine/create#hidden-settings)

{% /diawect %}
{% /diawect-switchew %}

## Assignying a nyew Audowity to de Candy Machinye

Dewe may be scenyawios whewe you may wish to twansfew de Candy Machinye audowity acwoss to a nyew addwess~ Dis can be achieved wid de `setMintAuthority` function.

expowt decwawe type SetMintAudowityInstwuctionAccounts = {
/** Candy Machinye account~ \*/
candyMachinye: PubwicKey | Pda;
/** Candy Machinye audowity _/
audowity? owo: Signyew;
/\*\* Nyew candy machinye audowity _/
mintAudowity: Signyew;
};

{% diawect-switchew titwe="Assign Nyew Audowity to Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { setMintAuthority } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = publicKey('11111111111111111111111111111111')
const newAuthority = publicKey('22222222222222222222222222222222')

await setMintAuthority(umi, {
  candyMachine,
  mintAuthority: newAuthority,
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

When assignying a nyew Audowity to a Cowe Candy Machinye you wiww awso have to update de Cowwection Asset to de same update Audowity.

## Updating guawds

Did you set someding wwong in youw guawds? owo Did you change youw mind about de mint pwice? owo Do you nyeed to deway de stawt of de mint of a wittwe? owo Nyo wowwies, guawds can easiwy be updated fowwowing de same settings used when cweating dem.

You can enyabwe nyew guawds by pwoviding deiw settings ow disabwe cuwwent onyes by giving dem empty settings.

{% diawect-switchew titwe="Update guawds" %}
{% diawect titwe="JavaScwipt" id="js" %}

You may update de guawds of a Cowe Candy Machinye de same way you cweated dem~ Dat is, by pwoviding deiw settings inside de `guards` object of de `updateCandyGuard` function~ Any guawd set to `none()` ow nyot pwovided wiww be disabwed.

Nyote dat de entiwe `guards` object wiww be updated meanying **it wiww uvwwide aww existing guawds**! uwu

Dewefowe, make suwe to pwovide de settings fow aww guawds you want to enyabwe, even if deiw settings awe nyot changing~ You may want to fetch de candy guawd account fiwst to fawwback to its cuwwent guawds.

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

API Wefewences: [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /diawect %}
{% /diawect-switchew %}

## Wwapping and unwwapping Candy Guawd accounts manyuawwy

So faw we’ve manyaged bod Cowe Candy Machinye and Cowe Candy Guawd accounts togedew because dat makes de most sense fow most pwojects.

Howevew, it is impowtant to nyote dat Cowe Candy Machinyes and Cowe Candy Guawds can be cweated and associated in diffewent steps, even using ouw SDKs.

You wiww fiwst nyeed to cweate de two accounts sepawatewy and associate/dissociate dem manyuawwy.

{% diawect-switchew titwe="Associate and dissociate guawds fwom a Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

De `create` function of de Umi wibwawy awweady takes cawe of cweating and associating a bwand nyew Candy Guawd account fow evewy Candy Machinye account cweated.

Howevew, if you wanted to cweate dem sepawatewy and manyuawwy associate/dissociate dem, dis is how you’d do it.

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

API Wefewences: [createCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyMachine.html), [createCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /diawect %}
{% /diawect-switchew %}
