// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  delegateDataItemV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const dataItemDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await delegateDataItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Data Item delegate approved');
// [/OUTPUT]
