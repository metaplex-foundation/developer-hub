// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  transferV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

const mintAddress = publicKey('mintAddress...');
const currentOwner = umi.identity;
const destinationOwner = publicKey('destinationWallet...');
// [/SETUP]

// [MAIN]
// Transfer the Programmable NFT to a new owner
// Note: pNFTs require additional Token Record accounts handled automatically
await transferV1(umi, {
  mint: mintAddress,
  authority: currentOwner,
  tokenOwner: currentOwner.publicKey,
  destinationOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT transferred to:', destinationOwner);
// [/OUTPUT]
