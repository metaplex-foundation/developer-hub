// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  revokeCollectionV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const collectionDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await revokeCollectionV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Collection delegate revoked');
// [/OUTPUT]
