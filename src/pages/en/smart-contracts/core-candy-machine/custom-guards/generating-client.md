---
title: Generating Custom Guard Client for Core Candy Machine
metaTitle: Custom Guard Client | Core Candy Machine
description: Learn how to generate a Umi-compatible JavaScript client for custom guards on the Core Candy Machine program using Kinobi and Shankjs.
keywords:
  - custom guard
  - core candy machine
  - kinobi
  - IDL
  - shankjs
  - client generation
  - umi sdk
  - candy guard
  - solana nft
  - custom minting logic
  - guard manifest
  - code generation
  - metaplex
about:
  - Custom guards
  - Client generation
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

Generating a custom guard client produces a [Umi](/dev-tools/umi)-compatible JavaScript SDK from your custom [Core Candy Machine](/smart-contracts/core-candy-machine) guard program, enabling frontend and script integration. {% .lead %}

- Use [Shankjs](https://github.com/metaplex-foundation/shank) to generate an IDL from your custom Candy Guard program
- Run the Kinobi code generator to produce TypeScript client files
- Register your guard manifest, types, and mint args in the generated client package
- Build and publish the client package to npm or link it locally

## Generate IDL and Initial Client

The first step after writing your custom guard is to generate an IDL and an initial TypeScript client using Shankjs and Kinobi from the [mpl-core-candy-machine repository](https://github.com/metaplex-foundation/mpl-core-candy-machine).

### Configuring Shankjs for IDL Generation

Shankjs is an IDL generator that works on both Anchor and non-Anchor programs. Configure it with your custom Candy Guard deployment key by editing the file located at `/configs/shank.cjs` in the mpl-candy-machine repo.

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

{% callout %}
If you are generating using anchor 28 you will need to add a fallback in to Shankjs idl generator to anchor 27 due to a missing crates.io crate.
{% /callout %}

```js
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

```

### Running the IDL and Client Generation

Now you should be able to generate the IDL and the initial client. From the root of the project run

```shell
pnpm run generate
```

this will in turn execute both scripts `pnpm generate:idls` and `pnpm generate:clients` and build out the initial clients.
If you need to run these separately for what ever reason you are able to do so.

## Adding Custom Guards to the Generated Client

After successful generation of the initial client, you need to create a guard file and register it in the client's type system.

### Creating the Guard File

Navigate to `/clients/js/src/defaultGuards` in the generated client and create a new file for your custom guard. The template below can be adjusted based on the type of guard you have created. This example uses the name `customGuard.ts`.

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

### Registering the Guard in Existing Files

After creating the guard file, you must register the guard in several existing files within the generated client.

Export your new guard from `/clients/js/src/defaultGuards/index.ts`

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// add your guard to the list
export * from './customGuard';
```

Within `/clients/js/src/defaultGuards/defaults.ts` add your guard to these locations;

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

Finally you need to add the exported customGuardManifest to the plugin file located at `/clients/js/src/plugin.ts`

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// add your guard manifest to the list
  customGuardManifest
)
```

From this point you can build and upload your client package to npm or link/move it to your project folder where you would like to access the new guard client.

## Notes

- This workflow requires a forked copy of the [mpl-core-candy-machine repository](https://github.com/metaplex-foundation/mpl-core-candy-machine). Clone and work within that fork.
- Use the built-in [AVA](https://github.com/avajs/ava) testing suite to write tests that fully exercise your custom guard across multiple scenarios. Examples of tests can be found in `/clients/js/tests`.
- If using Anchor 28, you must add the `rustbin` fallback configuration to Shankjs as shown above due to a missing crates.io dependency.
- The generated client files should not be edited manually after generation except for adding your custom guard registrations.

*Maintained by [Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine) · Last verified March 2026*
