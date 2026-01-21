// [IMPORTS]
import {
  getBurnV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up
// See getting-started for full setup

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Burn the NFT (removes all accounts and closes token account)
const burnIx = await getBurnV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  tokenOwner: authority.address,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([burnIx], [authority]);
// [/MAIN]

// [OUTPUT]
console.log('NFT burned:', mintAddress);
// [/OUTPUT]
