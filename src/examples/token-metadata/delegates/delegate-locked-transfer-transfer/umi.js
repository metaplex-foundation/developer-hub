// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  transferV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const lockedTransferDelegate = umi.identity; // The delegate authority
const currentOwner = publicKey('currentOwnerAddress...');
const newOwner = publicKey('newOwnerAddress...');
// [/SETUP]

// [MAIN]
await transferV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT transferred via Locked Transfer delegate');
// [/OUTPUT]
