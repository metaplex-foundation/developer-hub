// [IMPORTS]
import {
  getTransferV1InstructionAsync,
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
// Transfer fungible tokens to another wallet
const transferIx = await getTransferV1InstructionAsync({
  mint: mintAddress,
  tokenOwner: authority.address,
  destinationOwner,
  authority,
  payer: authority,
  amount: 100n, // Amount to transfer (accounting for decimals)
  tokenStandard: TokenStandard.Fungible,
});

await sendAndConfirm({
  instructions: [transferIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('Transferred tokens');
console.log('From:', authority.address);
console.log('To:', destinationOwner);
// [/OUTPUT]
