// [IMPORTS]
import { revokeStakingV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, mint, owner, and stakingDelegate are set up
// [/SETUP]

// [MAIN]
await revokeStakingV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Staking delegate revoked');
// [/OUTPUT]
