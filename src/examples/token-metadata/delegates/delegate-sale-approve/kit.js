// [IMPORTS]
import {
  getDelegateSaleV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, owner, and saleDelegate are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Approve a Sale delegate (pNFT only)
const delegateIx = await getDelegateSaleV1InstructionAsync({
  mint: mintAddress,
  delegate: saleDelegate,
  authority: owner,
  payer: owner,
  tokenOwner: owner.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([delegateIx], [owner]);
// [/MAIN]

// [OUTPUT]
console.log('Sale delegate approved');
// [/OUTPUT]
