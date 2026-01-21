// [IMPORTS]
import {
  getMintV1InstructionAsync,
  findMetadataPda,
  findAssociatedTokenPda,
  TokenStandard,
  SPL_TOKEN_2022_PROGRAM_ADDRESS,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, authority, and mint are set up
// mint is the NFT created with Token-2022

const mintAddress = mint.address;
// [/SETUP]

// [MAIN]
// Derive the associated token account for Token-2022
const [tokenAddress] = await findAssociatedTokenPda({
  mint: mintAddress,
  owner: authority.address,
  tokenProgram: SPL_TOKEN_2022_PROGRAM_ADDRESS,
});

// Mint the token using Token-2022
const [metadataAddress] = await findMetadataPda({ mint: mintAddress });

const mintIx = await getMintV1InstructionAsync({
  mint: mintAddress,
  token: tokenAddress,
  authority,
  payer: authority,
  metadata: metadataAddress,
  amount: 1,
  tokenOwner: authority.address,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ADDRESS,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([mintIx], [authority]);
// [/MAIN]

// [OUTPUT]
console.log('Token minted with Token-2022:', tokenAddress);
// [/OUTPUT]
