// [IMPORTS]
import { mplDistro } from '@metaplex-foundation/mpl-distro'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const rpcUrl = process.env.RPC_URL ?? 'https://api.devnet.solana.com'
// [/SETUP]

// [MAIN]
export const umi = createUmi(rpcUrl).use(mplDistro())
// [/MAIN]

// [OUTPUT]
// Umi is registered with the mplDistro plugin.
// [/OUTPUT]
