// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  delegateDataV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const dataDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await delegateDataV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Data delegate approved');
// [/OUTPUT]
