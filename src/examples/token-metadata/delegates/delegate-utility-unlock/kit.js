// [IMPORTS]
import {
  getUnlockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, utilityDelegate, and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Unlock as Utility delegate (pNFT only)
const unlockIx = await getUnlockV1InstructionAsync({
  mint: mintAddress,
  authority: utilityDelegate,
  payer: utilityDelegate,
  tokenOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [unlockIx],
  payer: utilityDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('pNFT unlocked by Utility delegate');
// [/OUTPUT]
