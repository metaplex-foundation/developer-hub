// [IMPORTS]
import {
  getDelegateTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and transferDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Approve a Transfer delegate (pNFT only)
const delegateIx = await getDelegateTransferV1InstructionAsync({
  mint: mintAddress,
  delegate: transferDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [delegateIx],
  payer: owner,
});
// [/MAIN]

// [OUTPUT]
console.log('Transfer delegate approved');
// [/OUTPUT]
