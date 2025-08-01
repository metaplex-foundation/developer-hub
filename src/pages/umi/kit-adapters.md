---
title: '@solana/kit Adapters'
metaTitle: 'Umi - @solana/kit Adapters'
description: 'Adapters to convert between Umi and @solana/kit.'
---

The new [`@solana/kit`](https://github.com/anza-xyz/kit) library is part of Solana's modern JavaScript SDK and provides improved type safety and performance compared to [`@solana/web3.js`](https://github.com/solana-foundation/solana-web3.js/). When working with both Umi and `@solana/kit`, you may need to convert between their respective types.

To help with this, Umi provides adapters in the [`@metaplex-foundation/umi-kit-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-kit-adapters) package that allow you to convert types between Umi and `@solana/kit`.

## Installation and Imports

Install the adapters package:

```
npm i @metaplex-foundation/umi-kit-adapters
```

After the installation the conversion functions are available to you:

```ts
import { 
  // Addresses/PublicKeys
  fromKitAddress, toKitAddress,
  // Keypairs
  fromKitKeypair, toKitKeypair,
  // Instructions
  fromKitInstruction, toKitInstruction
} from '@metaplex-foundation/umi-kit-adapters';
```

## Addresses

Both Umi and `@solana/kit` use base58 strings for addresses, making conversion straightforward.

### From @solana/kit to Umi

```ts
import { address } from '@solana/kit';
import { fromKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// Create a Kit address
const kitAddress = address("11111111111111111111111111111112");

// Convert to Umi PublicKey
const umiPublicKey = fromKitAddress(kitAddress);
```

### From Umi to @solana/kit

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// Create a Umi PublicKey
const umiPublicKey = publicKey("11111111111111111111111111111112");

// Convert to Kit address
const kitAddress = toKitAddress(umiPublicKey);
```

## Keypairs

Converting keypairs requires handling the different formats used by each library.

### From @solana/kit to Umi

```ts
import { generateKeyPair } from '@solana/kit';
import { fromKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// Create a new Kit CryptoKeyPair as example
const kitKeypair = await generateKeyPair();

// Convert to Umi Keypair
const umiKeypair = await fromKitKeypair(kitKeypair);
```

### From Umi to @solana/kit

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { toKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// Create Umi instance and generate example keypair
const umi = createUmi('https://api.devnet.solana.com');
const umiKeypair = generateSigner(umi);

// Convert to Kit CryptoKeyPair
const kitKeypair = await toKitKeypair(umiKeypair);
```

## Instructions

Instructions can be converted between the two formats, handling the different account role systems.

### From @solana/kit to Umi

```ts
import { getSetComputeUnitLimitInstruction } from '@solana-program/compute-budget';
import { fromKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// Create a new Kit instruction as example
const kitInstruction = getSetComputeUnitLimitInstruction({ units: 500 });

// Convert to Umi Instruction
const umiInstruction = fromKitInstruction(kitInstruction);
```

### From Umi to @solana/kit

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox';
import { toKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// Create a new Umi instance for the example
const umi = createUmi('https://api.devnet.solana.com');

// Create a new Umi instruction as example
const umiInstruction = setComputeUnitPrice(umi, { microLamports: 1 });

// Convert to Kit instruction
const kitInstruction = toKitInstruction(umiInstruction);
```

## Use Cases

These adapters are particularly useful when:

- You want to use Umi and Metaplex functionality together with `@solana/kit`
- Building applications that need to interoperate between different parts of the Solana ecosystem
- Integrating existing code that uses different type systems

The adapters ensure type safety and handle the conversion details automatically, making it easy to work with both libraries in the same project.