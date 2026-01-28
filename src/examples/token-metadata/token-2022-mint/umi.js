// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up and mint was created with Token-2022

const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);
// [/SETUP]

// [MAIN]
// Derive the associated token account for Token-2022
const token = findAssociatedTokenPda(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
});

// Mint the token using Token-2022
await mintV1(umi, {
  mint: mint.publicKey,
  token,
  authority,
  amount: 1,
  tokenOwner: umi.identity.publicKey,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Token minted with Token-2022');
// [/OUTPUT]
