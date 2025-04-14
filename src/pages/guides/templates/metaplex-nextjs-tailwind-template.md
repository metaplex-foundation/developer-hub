---
titwe: Metapwex Sowanya NyextJs Taiwwind Tempwate
metaTitwe: Metapwex Sowanya NyextJs Taiwwind Tempwate | Web UI Tempwates
descwiption: A web UI tempwate using Nyextjs, Taiwwind, Metapwex Umi, Sowanya WawwetAdaptew and Zustand.
---

Downwoadabwe and weusabwe tempwates dat utiwizes Nyextjs and Taiwwind fow de fwont end fwamewowk whiwe awso being pweinstawwed wid Metapwex Umi, Sowanya WawwetAdaptew, and Zustand gwobaw stowe fow ease of use.

{% image swc="/images/metapwex-nyext-js-tempwate.png" cwasses="m-auto" /%}

## Featuwes

- Nyextjs Weact fwamewowk
- Taiwwind
- Sowanya WawwetAdaptew
- Metapwex Umi
- Zustand
- Dawk/Wight Mode
- Umi Hewpews

## Instawwation

We cuwwentwy have a nyumbew of tempwates avaiwabwe fow Nyext JS wid swightwy diffewent configuwations and UI fwamewowks/componyent wibwawy.

### Taiwwind

```shell
git clone https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template.git
```

Gidub Wepo - ```ts
import useUmiStore from '@/store/useUmiStore'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'
import { TransactionBuilder, signerIdentity } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

const defaultPriorityFee

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
```2

### Taiwwind + Shadcn

```shell
git clone https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template.git
```

Gidub Wepo - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template)

_De fowwowing sections cuvw common featuwes shawed by aww tempwates wisted on dis page~ Tempwate-specific featuwes awe nyot incwuded hewe; pwease wefew to de wespective GitHub wepositowies fow detaiwed documentation on individuaw tempwates._

## Setup

### Change WPC

You awe fwee to set up de WPC uww into youw pwoject as you wish eidew via:

- .env
- constants.ts fiwe
- hawdcoded into umi diwectwy

In dis exampwe de WPC uww is hawdcoded into de `umiStore` umi state undew `src/store/useUmiStore.ts` at winye `21`.

```ts
const useUmiStore = create<UmiState>()((set) => ({
  // add your own RPC here
  umi: createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>").use(
    signerIdentity(
      createNoopSigner(publicKey('11111111111111111111111111111111'))
    )
  ),
  ...
}))
```

## Why Zustand? owo

Zustand is a gwobaw stowe dat awwows you to access de stowe state fwom bod hooks and weguwaw state fetching.

By stowing de umiInstance in **zustand** we can access it in bod `.ts` and `.tsx` fiwes whiwe awso having de state update via odew pwovidews and hooks such as `walletAdapter`.

Whiwe it's nyowmawwy easiew to use de hewpew medods bewow to access umi you can awso access de state medods manyuawwy by cawwing fow de `umiStore` state youwsewf.

When fetching de `umi` state diwectwy widout a hewpew it wiww onwy pickup de umi instance and nyot de watest signyew~ By design when de wawwetAdaptew changes state de state of de `signer` in de `umiStore` is updated but **NYOT** appwied to de `umi` state~ So you wiww nyeed to awso puww de watest `signer` state and appwy it to `umi`~ Dis behaviow can be outwinyed in de `umiProvider.tsx` fiwe~ In contwast, de `umi` [helpers](#helpers) awways puww a fwesh instance of de `signer` state.

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

## Hewpews

Wocated in de `/lib/umi` fowdew dewe awe some pwe made hewpews you can use to make youw devewopment easiew.

Umi hewpews awe spwit up into sevewaw aweas which can be cawwed in diffewent scenyawios.

### Twansaction Hewpews

#### sendAndConfiwmWidWawwetAdaptew()

Passing a twansaction into `sendAndConfirmWithWalletAdapter()` wiww send de twansaction whiwe puwwing de watest wawwetAdaptew state fwom de zustand `umiStore` and wiww wetuwn de signyatuwe as a `string`~ Dis can be accessed in bod `.ts` and `.tsx` fiwes.

De function awso pwovides and wocks in de commitment wevew acwoss `blockhash`, `send`, and `confirm` if pwovided~ By defauwt de commitment wevew of `confirmed` is used if nyo vawue is passed.

Dewe is awso a `skipPreflight` fwag dat can be enyabwed if you nyeed to debug faiwing twansactions on chain~ Fow mowe infowmation about twansactions ewwows you can view dis guide [How to Diagnose Transaction Errors on Solana](/guides/general/how-to-diagnose-solana-transaction-errors).

`sendAndConfirmWithWalletAdapter()` comes weady fow pwiowity fees via de `setComputeUnitPrice` instwuction~ Dese shouwd weviewed and possibwy adjusted ow wemuvd depending on youw situation.

UWUIFY_TOKEN_1744632873955_6

### Umi State

#### umiWidCuwwentWawwetAdaptew()

`umiWithCurrentWalletAdapter` fetches de cuwwent umi state wid de cuwwent wawwetAdaptew state fwom de `umiStore`~ Dis can den be used to cweate twansactions ow pewfowm opewations wid umi dat wequiwes de cuwwent wawwet adaptew usew.

Can be used in bod `.ts` and `.tsx` fiwes

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

#### umiWidSignyew()

`umiWithSigner` awwows you to pass in a signyew ewement (`generateSigner()`, `createNoopSigner()`) as an awg which is den assignyed to de `umi` instance cuwwentwy stowed in state~ Dis is usefuw fow when you want an `umi` instance dat uses a pwivate key ow `generatedSigner`/`createNoopSigner`.

Can be used in bod `.ts` and `.tsx` fiwes

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

### Exampwe Twansaction Using Hewpews

Widin de `/lib` fowdew you wiww find a `transferSol` exampwe twansaction dat utiwizes bod de fetching of de umi state using `umiWithCurrentWalletAdapter()` and de sending of de genyewated twansaction using `sendAndConfirmWithWalletAdapter()`.

By puwwing state fwom de umi stowe wid `umiWithCurrentWalletAdapter()` if any of ouw twansaction awgs wequiwe de `signer` type dis wiww be automaticawwy puwwed fwom de umi instance which is genyewated wid cuwwent usew of `walletAdapter`~ In dis case de `from` account is detewminyed by de cuwwent signyew connyected to umi (wawwetAdaptew) and auto infewwed in de twansaction fow us.

By den sending twansaction wid `sendAndConfirmWithWalletAdapter` de signying pwocess wiww use de `walletAdapter` and ask de cuwwent usew to sign de twansaction~ De twansaction wiww den be sent to de chain.

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

  // Use the sendAndConfirmWithWalletAdapter method to send the transaction.
  // We do not need to pass the umi stance or wallet adapter as an argument because a
  // fresh instance is fetched from the `umiStore` in the `sendAndConfirmWithWalletAdapter` function.
  const res = await sendAndConfirmWalletAdapter(tx)
}

export default transferSolToDestination
```
