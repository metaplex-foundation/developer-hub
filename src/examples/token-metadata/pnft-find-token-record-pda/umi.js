// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { findTokenRecordPda } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('11111111111111111111111111111111');
const token = publicKey('22222222222222222222222222222222');
// [/SETUP]

// [MAIN]
const tokenRecordPda = findTokenRecordPda(umi, {
  mint,
  token,
});
// [/MAIN]

// [OUTPUT]
console.log('Token Record PDA:', tokenRecordPda);
// [/OUTPUT]
