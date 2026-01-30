// [IMPORTS]
import {
  getTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and saleDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
const currentOwner = 'currentOwnerAddress...';
const newOwner = 'newOwnerAddress...';
// [/SETUP]

// [MAIN]
// Transfer as Sale delegate (pNFT only)
const transferIx = await getTransferV1InstructionAsync({
  mint: mintAddress,
  authority: saleDelegate,
  payer: saleDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [transferIx],
  payer: saleDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('pNFT transferred by Sale delegate');
// [/OUTPUT]
