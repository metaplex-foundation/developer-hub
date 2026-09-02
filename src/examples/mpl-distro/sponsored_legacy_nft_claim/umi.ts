// [IMPORTS]
import {
  distributeToLegacyNft,
  mplDistro,
} from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

const airdropService = umi.payer
const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const rewardMint = publicKey(process.env.TOKEN_MINT!)
const nftMint = publicKey(process.env.LEGACY_NFT_MINT!)
const currentOwner = publicKey(process.env.NFT_OWNER!)
const amount = 100_000n
const proof = []
const nonce = 0
// [/SETUP]

// [MAIN]
await distributeToLegacyNft(umi, {
  payer: airdropService,
  distribution,
  mint: rewardMint,
  nftMint,
  nftOwner: currentOwner,
  amount,
  proof,
  nonce,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The current NFT owner's ATA receives the allocation.
// [/OUTPUT]
