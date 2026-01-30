// [IMPORTS]
import {
  getRevokeSaleV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and saleDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Revoke a Sale delegate (pNFT only)
const revokeIx = await getRevokeSaleV1InstructionAsync({
  mint: mintAddress,
  delegate: saleDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: owner,
});
// [/MAIN]

// [OUTPUT]
console.log('Sale delegate revoked');
// [/OUTPUT]
