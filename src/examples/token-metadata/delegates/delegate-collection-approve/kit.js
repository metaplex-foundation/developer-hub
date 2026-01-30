// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getDelegateCollectionV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const collectionDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const delegateIx = await getDelegateCollectionV1InstructionAsync({
  mint,
  authority: updateAuthority,
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [delegateIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Collection delegate approved');
// [/OUTPUT]
