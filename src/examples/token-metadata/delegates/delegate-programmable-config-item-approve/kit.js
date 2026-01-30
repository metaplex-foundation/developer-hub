// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getDelegateProgrammableConfigItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const programmableConfigItemDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const delegateIx = await getDelegateProgrammableConfigItemV1InstructionAsync({
  mint,
  authority: updateAuthority,
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [delegateIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config Item delegate approved');
// [/OUTPUT]
