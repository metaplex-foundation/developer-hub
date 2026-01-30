// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getDelegateDataItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const dataItemDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const delegateIx = await getDelegateDataItemV1InstructionAsync({
  mint,
  authority: updateAuthority,
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [delegateIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Data Item delegate approved');
// [/OUTPUT]
