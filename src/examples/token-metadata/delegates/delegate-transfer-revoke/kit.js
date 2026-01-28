// [IMPORTS]
import {
  getRevokeTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and transferDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Revoke a Transfer delegate (pNFT only)
const revokeIx = await getRevokeTransferV1InstructionAsync({
  mint: mintAddress,
  delegate: transferDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([revokeIx], [owner]);
// [/MAIN]

// [OUTPUT]
console.log('Transfer delegate revoked');
// [/OUTPUT]
