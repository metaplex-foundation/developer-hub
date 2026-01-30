// [IMPORTS]
import { address } from '@solana/addresses';
import { findTokenRecordPda } from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('11111111111111111111111111111111');
const token = address('22222222222222222222222222222222');
// [/SETUP]

// [MAIN]
const [tokenRecordPda] = await findTokenRecordPda({
  mint,
  token,
});
// [/MAIN]

// [OUTPUT]
console.log('Token Record PDA:', tokenRecordPda);
// [/OUTPUT]
