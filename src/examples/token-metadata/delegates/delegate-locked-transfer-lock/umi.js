// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  lockV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const lockedTransferDelegate = umi.identity; // The delegate authority
// [/SETUP]

// [MAIN]
await lockV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('pNFT locked via Locked Transfer delegate');
// [/OUTPUT]
