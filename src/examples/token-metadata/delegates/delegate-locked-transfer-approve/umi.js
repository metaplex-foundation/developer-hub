// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  delegateLockedTransferV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const owner = umi.identity;
const lockedTransferDelegate = publicKey('delegateAddress...');
const lockedAddress = publicKey('escrowAddress...'); // Destination for locked transfers
// [/SETUP]

// [MAIN]
await delegateLockedTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: lockedTransferDelegate,
  lockedAddress,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Locked Transfer delegate approved');
// [/OUTPUT]
