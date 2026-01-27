// [IMPORTS]
import { revokeStandardV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, owner, and standardDelegate are set up
// [/SETUP]

// [MAIN]
await revokeStandardV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Standard delegate revoked');
// [/OUTPUT]
