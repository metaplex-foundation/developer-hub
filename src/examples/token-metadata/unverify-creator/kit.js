// [IMPORTS]
import {
  getUnverifyCreatorV1Instruction,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and creator (signer) are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Find the metadata PDA
const [metadata] = await findMetadataPda({ mint: mintAddress });

// Unverify the creator on the NFT
const unverifyIx = getUnverifyCreatorV1Instruction({
  metadata,
  authority: creator,
});

await sendAndConfirm([unverifyIx], [creator]);
// [/MAIN]

// [OUTPUT]
console.log('Creator unverified on NFT');
// [/OUTPUT]
