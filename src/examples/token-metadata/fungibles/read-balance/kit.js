// [IMPORTS]
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-token-metadata-kit';
import { getAccount } from '@solana/spl-token';
// [/IMPORTS]

// [SETUP]
// Assuming rpc is set up
// See getting-started for full setup

const mintAddress = 'YOUR_TOKEN_MINT_ADDRESS'; // Your fungible token mint
const walletAddress = 'WALLET_ADDRESS'; // Wallet to check balance for
// [/SETUP]

// [MAIN]
// Find the Associated Token Account address
const [tokenAccount] = await findAssociatedTokenPda({
  mint: mintAddress,
  owner: walletAddress,
});

// Fetch the token account data using SPL Token
const tokenData = await getAccount(rpc, tokenAccount);
// [/MAIN]

// [OUTPUT]
console.log('Token Balance:', tokenData.amount);
console.log('Mint:', tokenData.mint);
console.log('Owner:', tokenData.owner);
// [/OUTPUT]
