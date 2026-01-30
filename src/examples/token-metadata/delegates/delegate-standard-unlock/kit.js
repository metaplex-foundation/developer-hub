// [IMPORTS]
import {
  getUnlockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, standardDelegate, and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Unlock (thaw) as Standard delegate
const unlockIx = await getUnlockV1InstructionAsync({
  mint: mintAddress,
  authority: standardDelegate,
  payer: standardDelegate,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [unlockIx],
  payer: standardDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('Asset unlocked (thawed) by Standard delegate');
// [/OUTPUT]
