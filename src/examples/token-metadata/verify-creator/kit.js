// [IMPORTS]
import {
  getVerifyCreatorV1Instruction,
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

// Verify the creator on the NFT
const verifyIx = getVerifyCreatorV1Instruction({
  metadata,
  authority: creator,
});

await sendAndConfirm({
  instructions: [verifyIx],
  payer: creator,
});
// [/MAIN]

// [OUTPUT]
console.log('Creator verified on NFT');
// [/OUTPUT]
