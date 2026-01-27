// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  unlockV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const lockedTransferDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
await unlockV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT unlocked via Locked Transfer delegate');
// [/OUTPUT]
