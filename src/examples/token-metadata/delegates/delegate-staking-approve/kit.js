// [IMPORTS]
import {
  getDelegateStakingV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and stakingDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Approve a Staking delegate (pNFT only)
const delegateIx = await getDelegateStakingV1InstructionAsync({
  mint: mintAddress,
  delegate: stakingDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [delegateIx],
  payer: owner,
});
// [/MAIN]

// [OUTPUT]
console.log('Staking delegate approved');
// [/OUTPUT]
