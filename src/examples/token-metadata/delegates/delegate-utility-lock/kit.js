// [IMPORTS]
import {
  getLockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, utilityDelegate, and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Lock as Utility delegate (pNFT only)
const lockIx = await getLockV1InstructionAsync({
  mint: mintAddress,
  authority: utilityDelegate,
  payer: utilityDelegate,
  tokenOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([lockIx], [utilityDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('pNFT locked by Utility delegate');
// [/OUTPUT]
