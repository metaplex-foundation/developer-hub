// [IMPORTS]
import { genesis, revokeV2 } from '@metaplex-foundation/genesis'
import { mplToolbox, SPL_TOKEN_PROGRAM_ID } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

// The identity must be the Genesis authority.
// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
// Permanently removes the mint and freeze authorities from the token.
// This cannot be undone.
await revokeV2(umi, {
  genesisAccount,
  baseMint,
  baseTokenProgram: SPL_TOKEN_PROGRAM_ID,
  revokeMintAuthority: true,
  revokeFreezeAuthority: true,
  padding: Array(5).fill(0),
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The base mint now has no mint authority and no freeze authority.
// [/OUTPUT]
