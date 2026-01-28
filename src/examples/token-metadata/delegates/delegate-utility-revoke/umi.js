// [IMPORTS]
import { revokeUtilityV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, owner, and utilityDelegate are set up
// [/SETUP]

// [MAIN]
await revokeUtilityV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Utility delegate revoked');
// [/OUTPUT]
