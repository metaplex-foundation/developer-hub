// [IMPORTS]
import {
  getRevokeStandardV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and standardDelegate are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Revoke a Standard delegate
const revokeIx = await getRevokeStandardV1InstructionAsync({
  mint: mintAddress,
  delegate: standardDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: owner,
});
// [/MAIN]

// [OUTPUT]
console.log('Standard delegate revoked');
// [/OUTPUT]
