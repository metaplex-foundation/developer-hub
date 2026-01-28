// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  transferV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mintAddress = publicKey('mintAddress...');
const currentOwner = umi.identity; // Current token owner
const destinationOwner = publicKey('destinationWallet...');
// [/SETUP]

// [MAIN]
// Transfer the NFT to a new owner
await transferV1(umi, {
  mint: mintAddress,
  authority: currentOwner,
  tokenOwner: currentOwner.publicKey,
  destinationOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('NFT transferred to:', destinationOwner);
// [/OUTPUT]
