// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import {
  getCreateV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirm are set up
// See getting-started for full setup

const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner(); // Your wallet
// [/SETUP]

// [MAIN]
// Create the onchain accounts (Mint + Metadata + MasterEdition for NFTs)
const createIx = await getCreateV1InstructionAsync({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenStandard: TokenStandard.NonFungible,
});

// Send the transaction
await sendAndConfirm([createIx], [mint, authority]);
// [/MAIN]

// [OUTPUT]
console.log('Created NFT accounts');
console.log('Mint:', mint.address);
// [/OUTPUT]
