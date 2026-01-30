// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  delegateCollectionItemV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const collectionItemDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await delegateCollectionItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection Item delegate approved');
// [/OUTPUT]
