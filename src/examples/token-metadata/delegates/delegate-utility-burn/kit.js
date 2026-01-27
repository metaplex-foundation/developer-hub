// [IMPORTS]
import {
  getBurnV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and utilityDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
const currentOwner = 'currentOwnerAddress...';
// [/SETUP]

// [MAIN]
// Burn as Utility delegate (pNFT only)
const burnIx = await getBurnV1InstructionAsync({
  mint: mintAddress,
  authority: utilityDelegate,
  payer: utilityDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([burnIx], [utilityDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('pNFT burned by Utility delegate');
// [/OUTPUT]
