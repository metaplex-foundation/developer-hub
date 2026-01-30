// [IMPORTS]
import {
  getLockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, standardDelegate, and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Lock (freeze) as Standard delegate
const lockIx = await getLockV1InstructionAsync({
  mint: mintAddress,
  authority: standardDelegate,
  payer: standardDelegate,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [lockIx],
  payer: standardDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('Asset locked (frozen) by Standard delegate');
// [/OUTPUT]
