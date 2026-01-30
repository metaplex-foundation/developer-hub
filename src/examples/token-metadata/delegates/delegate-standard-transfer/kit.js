// [IMPORTS]
import {
  getTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and standardDelegate are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
const currentOwner = 'currentOwnerAddress...';
const newOwner = 'newOwnerAddress...';
// [/SETUP]

// [MAIN]
// Transfer as Standard delegate
const transferIx = await getTransferV1InstructionAsync({
  mint: mintAddress,
  authority: standardDelegate,
  payer: standardDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [transferIx],
  payer: standardDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('Asset transferred by Standard delegate');
// [/OUTPUT]
