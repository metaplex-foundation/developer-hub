// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const currentOwner = address('currentOwnerAddress...');
const newOwner = address('newOwnerAddress...');
// [/SETUP]

// [MAIN]
const transferIx = await getTransferV1InstructionAsync({
  mint,
  authority: lockedTransferDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([transferIx], [lockedTransferDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('pNFT transferred via Locked Transfer delegate');
// [/OUTPUT]
