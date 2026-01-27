// [IMPORTS]
import {
  getLockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, stakingDelegate, and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Lock as Staking delegate (pNFT only)
const lockIx = await getLockV1InstructionAsync({
  mint: mintAddress,
  authority: stakingDelegate,
  payer: stakingDelegate,
  tokenOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([lockIx], [stakingDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('pNFT locked by Staking delegate');
// [/OUTPUT]
