// [IMPORTS]
import { generateSigner } from '@metaplex-foundation/umi';
import {
  printV1,
  fetchMasterEditionFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, masterEditionMint, originalOwner, and ownerOfThePrintedEdition are set up

const editionMint = generateSigner(umi);
// [/SETUP]

// [MAIN]
// (Optional) Fetch the master edition account to mint the next edition number.
const masterEdition = await fetchMasterEditionFromSeeds(umi, {
  mint: masterEditionMint,
});

await printV1(umi, {
  masterTokenAccountOwner: originalOwner,
  masterEditionMint,
  editionMint,
  editionTokenAccountOwner: ownerOfThePrintedEdition,
  editionNumber: masterEdition.supply + 1n,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Edition printed:', editionMint.publicKey);
// [/OUTPUT]
