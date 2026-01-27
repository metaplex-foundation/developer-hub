// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  revokeDataV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const dataDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await revokeDataV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Data delegate revoked');
// [/OUTPUT]
