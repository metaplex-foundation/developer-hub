// [IMPORTS]
import {
  getDelegateUtilityV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and utilityDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Approve a Utility delegate (pNFT only)
const delegateIx = await getDelegateUtilityV1InstructionAsync({
  mint: mintAddress,
  delegate: utilityDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([delegateIx], [owner]);
// [/MAIN]

// [OUTPUT]
console.log('Utility delegate approved');
// [/OUTPUT]
