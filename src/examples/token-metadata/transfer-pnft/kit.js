// [IMPORTS]
import {
  getTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
const currentOwner = authority.address;
const destinationOwner = 'destinationWallet...';
// [/SETUP]

// [MAIN]
// Transfer the Programmable NFT to a new owner
// Note: pNFTs require additional Token Record accounts handled automatically
const transferIx = await getTransferV1InstructionAsync({
  mint: mintAddress,
  tokenOwner: currentOwner,
  destinationOwner,
  authority,
  payer: authority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [transferIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('pNFT transferred to:', destinationOwner);
// [/OUTPUT]
