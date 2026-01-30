// [IMPORTS]
import {
  getRevokeUtilityV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and utilityDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Revoke a Utility delegate (pNFT only)
const revokeIx = await getRevokeUtilityV1InstructionAsync({
  mint: mintAddress,
  delegate: utilityDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: owner,
});
// [/MAIN]

// [OUTPUT]
console.log('Utility delegate revoked');
// [/OUTPUT]
