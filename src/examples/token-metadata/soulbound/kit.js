// [IMPORTS]
import { generateKeyPairSigner } from '@solana/signers';
import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeNonTransferableMintInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import {
  getCreateV1InstructionAsync,
  getMintV1InstructionAsync,
  findAssociatedTokenPda,
  TokenStandard,
  SPL_TOKEN_2022_PROGRAM_ADDRESS,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, and sendAndConfirm are set up

const authority = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();
// [/SETUP]

// [MAIN]
// Calculate space needed for Token22 mint with NonTransferable extension
const extensions = [ExtensionType.NonTransferable];
const space = getMintLen(extensions);
const { value: lamports } = await rpc.getMinimumBalanceForRentExemption(BigInt(space)).send();

// Create the mint account with Token22 program
const createAccountIx = SystemProgram.createAccount({
  fromPubkey: new PublicKey(authority.address),
  newAccountPubkey: new PublicKey(mint.address),
  lamports: Number(lamports),
  space,
  programId: TOKEN_2022_PROGRAM_ID,
});

// Initialize the non-transferable extension (must be before mint init)
const initNonTransferableIx = createInitializeNonTransferableMintInstruction(
  new PublicKey(mint.address),
  TOKEN_2022_PROGRAM_ID
);

// Initialize the mint
const initMintIx = createInitializeMintInstruction(
  new PublicKey(mint.address),
  0, // decimals
  new PublicKey(authority.address), // mint authority
  new PublicKey(authority.address), // freeze authority
  TOKEN_2022_PROGRAM_ID
);

// Send the Token22 setup transaction first
// (Convert web3.js instructions to your transaction format)

// Create the Token Metadata
const createMetadataIx = await getCreateV1InstructionAsync({
  mint,
  authority,
  payer: authority,
  name: 'My Soulbound NFT',
  uri: 'https://example.com/my-soulbound-nft.json',
  sellerFeeBasisPoints: 550,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ADDRESS,
});

// Derive the token PDA for Token22
const [token] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: authority.address,
  tokenProgram: SPL_TOKEN_2022_PROGRAM_ADDRESS,
});

// Mint the token
const mintTokenIx = await getMintV1InstructionAsync({
  mint: mint.address,
  authority,
  payer: authority,
  token,
  tokenOwner: authority.address,
  amount: 1,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ADDRESS,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

// Send metadata and mint instructions
await sendAndConfirm([createMetadataIx, mintTokenIx], [mint, authority]);
// [/MAIN]

// [OUTPUT]
console.log('Soulbound NFT created:', mint.address);
// [/OUTPUT]
