// [IMPORTS]
import {
  distributeToLegacyNft,
  mplDistro,
  prepareDistribution,
} from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi(
  process.env.RPC_URL ?? 'https://api.devnet.solana.com'
).use(mplDistro())

// Default nftOwner to the Umi identity, or pass nftOwner explicitly
// for a sponsored claim.

const distribution = publicKey(process.env.DISTRIBUTION_ADDRESS!)
const mint = publicKey(process.env.TOKEN_MINT!)
const nftMint = publicKey(process.env.LEGACY_NFT_MINT!)
const allocations = [{ address: nftMint, amount: 100_000n }]
const { proofs } = prepareDistribution(allocations)
// [/SETUP]

// [MAIN]
await distributeToLegacyNft(umi, {
  distribution,
  mint,
  nftMint,
  amount: allocations[0].amount,
  proof: proofs[0],
  nonce: 0,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// The current NFT owner's ATA receives 100000 base units.
// The receipt is keyed by the NFT mint, so the allocation cannot be claimed twice.
// [/OUTPUT]
