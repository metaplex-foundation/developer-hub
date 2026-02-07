// [IMPORTS]
import {
  findAssociatedTokenPda,
  createTokenIfMissing,
  transferSol,
  syncNative,
  mplToolbox,
} from '@metaplex-foundation/mpl-toolbox'
import { WRAPPED_SOL_MINT, genesis } from '@metaplex-foundation/genesis'
import { keypairIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair));
// [/SETUP]

// [MAIN]
const userWsolAccount = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: WRAPPED_SOL_MINT,
})

await createTokenIfMissing(umi, {
  mint: WRAPPED_SOL_MINT,
  owner: umi.identity.publicKey,
  token: userWsolAccount,
})
  .add(
    transferSol(umi, {
      destination: publicKey(userWsolAccount),
      amount: sol(10),
    })
  )
  .add(syncNative(umi, { account: userWsolAccount }))
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
