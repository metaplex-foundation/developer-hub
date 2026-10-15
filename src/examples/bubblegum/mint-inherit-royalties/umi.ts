// [IMPORTS]
import { createTreeV2, mintV2, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { createCollection, mplCore, ruleSet } from '@metaplex-foundation/mpl-core'
import { generateSigner, some } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplCore())

const merkleTree = generateSigner(umi)
const collectionSigner = generateSigner(umi)

await createTreeV2(umi, {
  merkleTree,
  maxDepth: 5,
  maxBufferSize: 8,
}).sendAndConfirm(umi)

// The collection must include BubblegumV2 and Royalties plugins.
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/collection.json',
  plugins: [
    { type: 'BubblegumV2' },
    {
      type: 'Royalties',
      basisPoints: 500, // 5%
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
// [/SETUP]

// [MAIN]
// sellerFeeBasisPoints is omitted — the SDK sends the inherit sentinel (65535).
await mintV2(umi, {
  collectionAuthority: umi.identity,
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  coreCollection: collectionSigner.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    collection: some(collectionSigner.publicKey),
    creators: [], // must be empty when inheriting royalties
  },
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// cNFT minted with SELLER_FEE_BASIS_POINTS_INHERIT (65535) on the leaf
// [/OUTPUT]
