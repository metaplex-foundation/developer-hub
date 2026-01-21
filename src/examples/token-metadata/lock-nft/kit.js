// [IMPORTS]
import {
  getLockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, authority (delegate), and tokenOwner are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Lock an NFT (freeze) - requires approved delegate authority
const lockIx = await getLockV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([lockIx], [authority]);
// [/MAIN]

// [OUTPUT]
console.log('NFT locked');
// [/OUTPUT]
