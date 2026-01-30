// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getDelegateCollectionItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const collectionItemDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const delegateIx = await getDelegateCollectionItemV1InstructionAsync({
  mint,
  authority: updateAuthority,
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [delegateIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Collection Item delegate approved');
// [/OUTPUT]
