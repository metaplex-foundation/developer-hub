// [IMPORTS]
import {
  getBurnV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Burn the Programmable NFT
// Note: pNFTs have Token Record accounts that are also cleaned up
const burnIx = await getBurnV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  tokenOwner: authority.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [burnIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('pNFT burned:', mintAddress);
// [/OUTPUT]
