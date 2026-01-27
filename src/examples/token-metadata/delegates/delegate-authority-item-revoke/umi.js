// [IMPORTS]
import { revokeAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, updateAuthority, and authorityItemDelegate are set up
// [/SETUP]

// [MAIN]
await revokeAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke.
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Authority Item delegate revoked');
// [/OUTPUT]
