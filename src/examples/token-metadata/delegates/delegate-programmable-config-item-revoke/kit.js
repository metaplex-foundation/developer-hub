// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getRevokeProgrammableConfigItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const programmableConfigItemDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const revokeIx = await getRevokeProgrammableConfigItemV1InstructionAsync({
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config Item delegate revoked');
// [/OUTPUT]
