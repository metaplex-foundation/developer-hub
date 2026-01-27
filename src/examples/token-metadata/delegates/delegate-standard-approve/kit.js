// [IMPORTS]
import {
  getDelegateStandardV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and standardDelegate are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Approve a Standard delegate
const delegateIx = await getDelegateStandardV1InstructionAsync({
  mint: mintAddress,
  delegate: standardDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([delegateIx], [owner]);
// [/MAIN]

// [OUTPUT]
console.log('Standard delegate approved');
// [/OUTPUT]
