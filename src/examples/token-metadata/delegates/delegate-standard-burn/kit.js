// [IMPORTS]
import {
  getBurnV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and standardDelegate are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
const currentOwner = 'currentOwnerAddress...';
// [/SETUP]

// [MAIN]
// Burn as Standard delegate
const burnIx = await getBurnV1InstructionAsync({
  mint: mintAddress,
  authority: standardDelegate,
  payer: standardDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([burnIx], [standardDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('Asset burned by Standard delegate');
// [/OUTPUT]
