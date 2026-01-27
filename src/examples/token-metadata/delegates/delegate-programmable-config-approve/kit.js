// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getDelegateProgrammableConfigV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const programmableConfigDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const delegateIx = await getDelegateProgrammableConfigV1InstructionAsync({
  mint,
  authority: updateAuthority,
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm([delegateIx], [updateAuthority]);
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config delegate approved');
// [/OUTPUT]
