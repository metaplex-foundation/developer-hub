// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, sendAndConfirm, and authority are set up

const mintAddress = address('mintAddress...'); // Your pNFT mint address
const currentOwner = authority.address;
const destinationOwner = address('destinationWallet...'); // Destination wallet
// [/SETUP]

// [MAIN]
// For pNFTs with auth rules, the SDK handles most resolution automatically
const transferIx = await getTransferV1InstructionAsync({
  mint: mintAddress,
  tokenOwner: currentOwner,
  destinationOwner,
  authority,
  payer: authority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // Auth rules are resolved automatically when available
});

await sendAndConfirm([transferIx], [authority]);
// [/MAIN]

// [OUTPUT]
console.log('pNFT transferred to:', destinationOwner);
// [/OUTPUT]
