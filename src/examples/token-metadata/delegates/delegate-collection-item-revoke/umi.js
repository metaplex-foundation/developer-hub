// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  revokeCollectionItemV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const collectionItemDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await revokeCollectionItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection Item delegate revoked');
// [/OUTPUT]
