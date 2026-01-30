// [IMPORTS]
import {
  getMintV1InstructionAsync,
  findAssociatedTokenPda,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up
// See getting-started for full setup

const mintAddress = 'YOUR_TOKEN_MINT_ADDRESS'; // Your fungible token mint
const destinationOwner = 'DESTINATION_WALLET_ADDRESS'; // Wallet to receive tokens
// [/SETUP]

// [MAIN]
// Mint additional tokens to a destination wallet
const mintIx = await getMintV1InstructionAsync({
  mint: mintAddress,
  authority, // Must be the mint authority
  payer: authority,
  tokenOwner: destinationOwner,
  amount: 100n, // Amount to mint (accounting for decimals)
  tokenStandard: TokenStandard.Fungible,
});

await sendAndConfirm({
  instructions: [mintIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('Minted tokens');
console.log('Mint:', mintAddress);
console.log('To:', destinationOwner);
// [/OUTPUT]
