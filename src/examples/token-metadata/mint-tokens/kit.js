// [IMPORTS]
import {
  getMintV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirm are set up
// mint and authority from createV1

const mintAddress = mint.address; // From the created mint
const tokenOwner = authority.address; // Wallet to receive the token
// [/SETUP]

// [MAIN]
// Mint the NFT token
const mintIx = await getMintV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  amount: 1,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([mintIx], [authority]);
// [/MAIN]

// [OUTPUT]
console.log('Minted NFT to:', tokenOwner);
// [/OUTPUT]
