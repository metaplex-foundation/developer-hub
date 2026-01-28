// [IMPORTS]
import {
  getBurnV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up
// See getting-started for full setup

const mintAddress = 'YOUR_TOKEN_MINT_ADDRESS'; // Your fungible token mint
// [/SETUP]

// [MAIN]
// Burn fungible tokens from your wallet
const burnIx = await getBurnV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  tokenOwner: authority.address,
  amount: 100n, // Amount to burn (accounting for decimals)
  tokenStandard: TokenStandard.Fungible,
});

await sendAndConfirm([burnIx], [authority]);
// [/MAIN]

// [OUTPUT]
console.log('Burned tokens');
console.log('Mint:', mintAddress);
// [/OUTPUT]
