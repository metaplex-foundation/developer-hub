// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUnlockV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
// [/SETUP]

// [MAIN]
const unlockIx = await getUnlockV1InstructionAsync({
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([unlockIx], [lockedTransferDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('pNFT unlocked via Locked Transfer delegate');
// [/OUTPUT]
