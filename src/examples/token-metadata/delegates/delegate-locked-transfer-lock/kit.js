// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getLockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
// [/SETUP]

// [MAIN]
const lockIx = await getLockV1InstructionAsync({
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [lockIx],
  payer: lockedTransferDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('pNFT locked via Locked Transfer delegate');
// [/OUTPUT]
