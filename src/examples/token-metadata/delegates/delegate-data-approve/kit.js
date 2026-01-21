// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getDelegateDataV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const dataDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const delegateIx = await getDelegateDataV1InstructionAsync({
  mint,
  authority: updateAuthority,
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([delegateIx], [updateAuthority]);
// [/MAIN]

// [OUTPUT]
console.log('Data delegate approved');
// [/OUTPUT]
