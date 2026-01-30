// [IMPORTS]
import { generateKeyPairSigner } from '@solana/kit';
import {
  getPrintV1InstructionAsync,
  fetchMasterEdition,
  findMasterEditionPda,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, originalOwner are set up

const masterEditionMintAddress = 'masterEditionMintAddress...';
const ownerOfThePrintedEdition = 'ownerAddress...';
const editionMint = await generateKeyPairSigner();
// [/SETUP]

// [MAIN]
// Fetch the master edition account to mint the next edition number
const [masterEditionPda] = await findMasterEditionPda({ mint: masterEditionMintAddress });
const masterEdition = await fetchMasterEdition(rpc, masterEditionPda);

// Print a new edition
const printIx = await getPrintV1InstructionAsync({
  masterTokenAccountOwner: originalOwner,
  masterEditionMint: masterEditionMintAddress,
  editionMint,
  editionTokenAccountOwner: ownerOfThePrintedEdition,
  editionNumber: masterEdition.data.supply + 1n,
  tokenStandard: TokenStandard.NonFungible,
  payer: originalOwner,
});

await sendAndConfirm({
  instructions: [printIx],
  payer: originalOwner,
});
// [/MAIN]

// [OUTPUT]
console.log('Edition printed:', editionMint.address);
// [/OUTPUT]
