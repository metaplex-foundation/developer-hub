// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  revokeLockedTransferV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const owner = umi.identity;
const lockedTransferDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await revokeLockedTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Locked Transfer delegate revoked');
// [/OUTPUT]
