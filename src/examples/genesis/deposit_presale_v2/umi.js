// [IMPORTS]
import {
  genesis,
  depositPresaleV2,
  findPresaleDepositV2Pda,
  fetchPresaleDepositV2,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// umi.use(keypairIdentity(yourKeypair));

// Assumes genesisAccount, presaleBucket, and baseMint from previous steps.
// [/SETUP]

// [MAIN]
await depositPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(1).basisPoints,
}).sendAndConfirm(umi)

// Verify
const [depositPda] = findPresaleDepositV2Pda(umi, {
  bucket: presaleBucket,
  recipient: umi.identity.publicKey,
})
const deposit = await fetchPresaleDepositV2(umi, depositPda)
// [/MAIN]

// [OUTPUT]
console.log('Deposited (after fee):', deposit.amountQuoteToken)
// [/OUTPUT]
