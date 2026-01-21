// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  delegateCollectionV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const collectionDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await delegateCollectionV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection delegate approved');
// [/OUTPUT]
