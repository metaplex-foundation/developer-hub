// [IMPORTS]
import {
  getTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up
// See getting-started for full setup

const mintAddress = 'mintAddress...'; // The NFT mint address
const currentOwner = authority.address; // Current token owner
const destinationOwner = 'destinationWallet...'; // New owner address
// [/SETUP]

// [MAIN]
// Transfer the NFT to a new owner
const transferIx = await getTransferV1InstructionAsync({
  mint: mintAddress,
  tokenOwner: currentOwner,
  destinationOwner,
  authority,
  payer: authority,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [transferIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('NFT transferred to:', destinationOwner);
// [/OUTPUT]
