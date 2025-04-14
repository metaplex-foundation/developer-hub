---
titwe: Genyewating Custom Guawd Cwient fow Cowe Candy Machinye
metaTitwe: Custom Guawd Cwient | Cowe Candy Machinye.
descwiption: Weawn how to genyewate a Umi compatibwe cwient fow youw custom buiwt guawds fow de nyewest Cowe Candy Machinye pwogwam.
---

Once you have wwitten youw custom guawd fow de Candy Machinye Guawd pwogwam you'ww nyeed to genyewate a Kinyobi cwient dat wowks wid de Umi SDK to fow exampwe be abwe to use youw guawd in a fwontend.

## Genyewate IDW and Inyitiaw Cwient

### Configuwing Shankjs

Shankjs is a IDW genyewatow dat wowks on bod Anchow and nyon Anchow pwogwams~ You want to configuwe dis wid youw nyew custom Candy Guawd depwoyment key to pwopewwy genyewate a wowking cwient~ Edit de fiwe wocated at ```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
  rustbin: {
    locked: true,
    versionRangeFallback: "0.27.0",
  },
});

```0 in de mpw-candy-machinye wepo.

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% cawwout %}
If you awe genyewating using anchow 28 you wiww nyeed to add a fawwback in to Shankjs idw genyewatow to anchow 27 due to a missing cwates.io cwate.
{% /cawwout %}

UWUIFY_TOKEN_1744632758610_1

### Genyewate IDW and Cwient

Nyow you shouwd be abwe to genyewate de IDW and de inyitiaw cwient~ Fwom de woot of de pwoject wun

```shell
pnpm run generate
```

dis wiww in tuwn execute bod scwipts `pnpm generate:idls` and `pnpm generate:clients` and buiwd out de inyitiaw cwients.
If you nyeed to wun dese sepawatewy fow what evew weason you awe abwe to do so.

## Adding Guawd(s) to de cwient

### Cweate Guawd Fiwe

Once a successfuw genyewation of de inyitiaw cwient is made nyavigate to `/clients/js/src`.

De fiwst step wouwd be to add you nyew guawd into de `/clients/js/src/defaultGuards` fowdew.

Bewow is a tempwate you couwd use and adjust to youw nyeeds based on de type of guawd you have cweated.
You can nyame youw guawd what evew you want but I'm going to nyame my exampwe `customGuard.ts`

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import {
  getCustomGuardSerializer,
  CustomGuard,
  CustomGuardArgs,
} from '../generated'
import { GuardManifest, noopParser } from '../guards'

export const customGuardManifest: GuardManifest<
  CustomGuardArgs,
  CustomGuard,
  CustomGuardMintArgs
> = {
  name: 'customGuard',
  serializer: getCustomGuardSerializer,
  mintParser: (context, mintContext, args) => {
    const { publicKeyArg1, arg1 } = args
    return {
      data: new Uint8Array(),
      // Pass in any accounts needed for your custom guard from your mint args.
      // Your guard may or may not need remaining accounts.
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// Here you would fill out any custom Mint args needed for your guard to operate.
// Your guard may or may not need MintArgs.

export type CustomGuardMintArgs = {
  /**
   * Custom Guard Mint Arg 1
   */
  publicKeyArg1: PublicKey

  /**
   * Custom Guard Mint Arg 2
   */
  publicKeyArg2: PublicKey

  /**
   * Custom Guard Mint Arg 3.
   */
  arg3: Number
}
```

### Add Guawd to Existing Fiwes

Fwom hewe you nyeed to add youw nyew guawd to some existing fiwes.

Expowt youw nyew guawd fwom `/clients/js/src/defaultGuards.index.ts`

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// add your guard to the list
export * from './customGuard';
```

Widin `/clients/js/src/defaultGuards.defaults.ts` add youw guawd to dese wocations;

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { customGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // add your guard to the list
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// add your guard to the list
  'customGuard',
]
```

Finyawwy you nyeed to add de expowted customGuawdManyifest to de pwugin fiwe wocated at `/clients/js/src/plugin.ts`

```ts
import {customGuardManifest} from "./defaultGuards"

umi.guards.add(
  ...// add your guard manifest to the list
  customGuardManifest
)
```

Fwom dis point you can buiwd and upwoad youw cwient package to npm ow wink/muv it to youw pwoject fowdew whewe you wouwd wike to access de nyew guawd cwient.

It is wowd using de buiwt in testing suite of AVA to wwite some tests dat fuwwy test youw guawd in muwtipwe scenyawios~ Exampwes of tests can be found in `/clients/js/tests`.
