// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  revokeDataItemV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const dataItemDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await revokeDataItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Data Item delegate revoked');
// [/OUTPUT]
