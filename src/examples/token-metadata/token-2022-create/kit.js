// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import {
  getCreateV1InstructionAsync,
  TokenStandard,
  SPL_TOKEN_2022_PROGRAM_ADDRESS,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority are set up

const mint = await generateKeyPairSigner();
// [/SETUP]

// [MAIN]
// Create NFT with Token-2022 program
const createIx = await getCreateV1InstructionAsync({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ADDRESS,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [createIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('NFT created with Token-2022:', mint.address);
// [/OUTPUT]
