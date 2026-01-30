// [IMPORTS]
import {
  getUnlockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, stakingDelegate, and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Unlock as Staking delegate (pNFT only)
const unlockIx = await getUnlockV1InstructionAsync({
  mint: mintAddress,
  authority: stakingDelegate,
  payer: stakingDelegate,
  tokenOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [unlockIx],
  payer: stakingDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('pNFT unlocked by Staking delegate');
// [/OUTPUT]
