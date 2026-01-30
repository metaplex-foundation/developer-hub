// [IMPORTS]
import {
  getUnlockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, authority (delegate), and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Unlock an NFT (thaw) - requires approved delegate authority
const unlockIx = await getUnlockV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [unlockIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('NFT unlocked');
// [/OUTPUT]
