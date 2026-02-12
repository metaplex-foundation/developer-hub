---
title: Metaplex Solana NextJs Tailwind Template
metaTitle: Metaplex Solana NextJs Tailwind Template | Web UI Templates
description: A web UI template using Nextjs, Tailwind, Metaplex Umi, Solana WalletAdapter and Zustand.
keywords:
  - Next.js template
  - Solana dApp template
  - wallet adapter
  - Metaplex Umi
  - Zustand
about:
  - Next.js template
  - Solana wallet adapter
  - Metaplex Umi integration
  - Zustand state management
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
howToSteps:
  - Clone the template repository from GitHub
  - Configure the RPC URL in the Umi store
  - Use Zustand helpers to access Umi state in .ts and .tsx files
  - Build transactions using umiWithCurrentWalletAdapter helper
  - Send transactions using sendAndConfirmWalletAdapter helper
howToTools:
  - Next.js
  - Metaplex Umi
  - Solana Wallet Adapter
  - Zustand
---

Downloadable and reusable templates that utilize Nextjs and Tailwind for the front end framework while also being preinstalled with Metaplex Umi, Solana WalletAdapter, and Zustand global store for ease of use.

{% image src="/images/metaplex-next-js-template.png" alt="Metaplex Next.js Tailwind Template Screenshot" classes="m-auto" /%}

## Features

- Nextjs React framework
- Tailwind
- Solana WalletAdapter
- Metaplex Umi
- Zustand
- Dark/Light Mode
- Umi Helpers

## Installation

We currently have a number of templates available for Next JS with slightly different configurations and UI frameworks/component library.

### Tailwind

```shell
git clone https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template.git
```

Github Repo - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)

### Tailwind + Shadcn

```shell
git clone https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template.git
```

Github Repo - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template)

_The following sections cover common features shared by all templates listed on this page. Template-specific features are not included here; please refer to the respective GitHub repositories for detailed documentation on individual templates._

## Setup

### Change RPC

You are free to set up the RPC url into your project as you wish either via:

- .env
- constants.ts file
- hardcoded into umi directly

In this example the RPC url is hardcoded into the `umiStore` umi state under `src/store/useUmiStore.ts` at line `21`.

```ts
const useUmiStore = create<UmiState>()((set) => ({
  // Add your own RPC here.
  umi: createUmi("https://api.devnet.solana.com").use(
    signerIdentity(
      createNoopSigner(publicKey('11111111111111111111111111111111'))
    )
  ),
  ...
}))
```

## Why Zustand?

Zustand is a global store that allows you to access the store state from both hooks and regular state fetching.

By storing the umiInstance in **zustand** we can access it in both `.ts` and `.tsx` files while also having the state update via other providers and hooks such as `walletAdapter`.

While it's normally easier to use the helper methods below to access umi you can also access the state methods manually by calling for the `umiStore` state yourself.

When fetching the `umi` state directly without a helper it will only pickup the umi instance and not the latest signer. By design when the walletAdapter changes state the state of the `signer` in the `umiStore` is updated but **NOT** automatically applied to the `umi` state. This behavior of keeping the signer and umi instance separate until explicitly combined can be seen in the `umiProvider.tsx` file. In contrast, the `umi` [helpers](#helpers) always pull a fresh instance of the `signer` state.

```ts
// umiProvider.tsx snippet
useEffect(() => {
  if (!wallet.publicKey) return
  // When wallet.publicKey changes, update the signer in umiStore with the new wallet adapter.
  umiStore.updateSigner(wallet as unknown as WalletAdapter)
}, [wallet, umiStore])
```

### Access Umi in .tsx

```ts
// Pulls the umi state from the umiStore using hook.
const umi = useUmiStore().umi
const signer = useUmiStore().signer

umi.use(signerIdentity(signer))
```

### Access Umi in .ts

```ts
// Pulls umi state from the umiStore.
const umi = useUmiStore.getState().umi
const signer = useUmiStore.getState().signer

umi.use(signerIdentity(signer))
```

## Helpers

Located in the `/lib/umi` folder there are some pre made helpers you can use to make your development easier.

Umi helpers are split up into several areas which can be called in different scenarios.

### Transaction Helpers

#### sendAndConfirmWalletAdapter()

Passing a transaction into `sendAndConfirmWalletAdapter()` will send the transaction while pulling the latest walletAdapter state from the zustand `umiStore` and will return the signature as a `string`. This can be accessed in both `.ts` and `.tsx` files.

The function also provides and locks in the commitment level across `blockhash`, `send`, and `confirm` if provided. By default the commitment level of `confirmed` is used if no value is passed.

There is also a `skipPreflight` flag that can be enabled if you need to debug failing transactions on chain. For more information about transactions errors you can view this guide [How to Diagnose Transaction Errors on Solana](/guides/general/how-to-diagnose-solana-transaction-errors).

`sendAndConfirmWalletAdapter()` comes ready for priority fees via the `setComputeUnitPrice` instruction. These should reviewed and possibly adjusted or removed depending on your situation.

```ts
import useUmiStore from '@/store/useUmiStore'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'
import { TransactionBuilder, signerIdentity } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'


const sendAndConfirmWalletAdapter = async (
  tx: TransactionBuilder,
  settings?: {
    commitment?: 'processed' | 'confirmed' | 'finalized'
    skipPreflight?: boolean
      }
) => {
  const umi = useUmiStore.getState().umi
  const currentSigner = useUmiStore.getState().signer
  console.log('currentSigner', currentSigner)
  umi.use(signerIdentity(currentSigner!))

  const blockhash = await umi.rpc.getLatestBlockhash({
    commitment: settings?.commitment || 'confirmed',
  })

  const transactions = tx
    // Set the priority fee for your transaction. Can be removed if unneeded.
    .add(setComputeUnitPrice(umi, { microLamports: BigInt(100000) }))
    .setBlockhash(blockhash)

  const signedTx = await transactions.buildAndSign(umi)

  const signature = await umi.rpc
    .sendTransaction(signedTx, {
      preflightCommitment: settings?.commitment || 'confirmed',
      commitment: settings?.commitment || 'confirmed',
      skipPreflight: settings?.skipPreflight || false,
    })
    .catch((err) => {
      throw new Error(`Transaction failed: ${err}`)
    })

  const confirmation = await umi.rpc.confirmTransaction(signature, {
    strategy: { type: 'blockhash', ...blockhash },
    commitment: settings?.commitment || 'confirmed',
  })
  return {
    signature: base58.deserialize(signature),
    confirmation,
  }
}

export default sendAndConfirmWalletAdapter
```

### Umi State

#### umiWithCurrentWalletAdapter()

`umiWithCurrentWalletAdapter` fetches the current umi state with the current walletAdapter state from the `umiStore`. This can then be used to create transactions or perform operations with umi that requires the current wallet adapter user.

Can be used in both `.ts` and `.tsx` files

```ts
import useUmiStore from '@/store/useUmiStore'
import { signerIdentity } from '@metaplex-foundation/umi'

const umiWithCurrentWalletAdapter = () => {
  // Because Zustand is used to store the Umi instance, the Umi instance can be accessed from the store
  // in both hook and non-hook format. This is an example of a non-hook format that can be used in a ts file
  // instead of a React component file.

  const umi = useUmiStore.getState().umi
  const currentWallet = useUmiStore.getState().signer
  if (!currentWallet) throw new Error('No wallet selected')
  return umi.use(signerIdentity(currentWallet))
}
export default umiWithCurrentWalletAdapter
```

#### umiWithSigner()

`umiWithSigner` allows you to pass in a signer element (`generateSigner()`, `createNoopSigner()`) as an arg which is then assigned to the `umi` instance currently stored in state. This is useful for when you want an `umi` instance that uses a private key or `generatedSigner`/`createNoopSigner`.

Can be used in both `.ts` and `.tsx` files

```ts
import useUmiStore from '@/store/useUmiStore'
import { Signer, signerIdentity } from '@metaplex-foundation/umi'

const umiWithSigner = (signer: Signer) => {
  const umi = useUmiStore.getState().umi
  if (!signer) throw new Error('No Signer selected')
  return umi.use(signerIdentity(signer))
}

export default umiWithSigner
```

### Example Transaction Using Helpers

Within the `/lib` folder you will find a `transferSol` example transaction that utilizes both the fetching of the umi state using `umiWithCurrentWalletAdapter()` and the sending of the generated transaction using `sendAndConfirmWalletAdapter()`.

By pulling state from the umi store with `umiWithCurrentWalletAdapter()` if any of our transaction args require the `signer` type this will be automatically pulled from the umi instance which is generated with current user of `walletAdapter`. In this case the `from` account is determined by the current signer connected to umi (walletAdapter) and auto inferred in the transaction for us.

By then sending transaction with `sendAndConfirmWalletAdapter` the signing process will use the `walletAdapter` and ask the current user to sign the transaction. The transaction will then be sent to the chain.

```ts
// Example of a function that transfers SOL from one account to another pulling umi
// from the useUmiStore in a ts file which is not a React component.

import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import umiWithCurrentWalletAdapter from './umi/umiWithCurrentWalletAdapter'
import { publicKey, sol } from '@metaplex-foundation/umi'
import sendAndConfirmWalletAdapter from './umi/sendAndConfirmWithWalletAdapter'

// This function transfers SOL from the current wallet to a destination account and is callable
// from any tsx/ts or component file in the project because of the zustand global store setup.

const transferSolToDestination = async ({
  destination,
  amount,
}: {
  destination: string
  amount: number
}) => {
  // Import Umi from `umiWithCurrentWalletAdapter`.
  const umi = umiWithCurrentWalletAdapter()

  // Create a transactionBuilder using the `transferSol` function from the mpl-toolbox.
  // Umi by default will use the current signer (walletAdapter) to also set the `from` account.
  const tx = transferSol(umi, {
    destination: publicKey(destination),
    amount: sol(amount),
  })

  // Use the sendAndConfirmWalletAdapter method to send the transaction.
  // We do not need to pass the umi stance or wallet adapter as an argument because a
  // fresh instance is fetched from the `umiStore` in the `sendAndConfirmWalletAdapter` function.
  const res = await sendAndConfirmWalletAdapter(tx)
}

export default transferSolToDestination
```
