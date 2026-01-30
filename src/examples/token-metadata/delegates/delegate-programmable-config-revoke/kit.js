// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getRevokeProgrammableConfigV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const programmableConfigDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const revokeIx = await getRevokeProgrammableConfigV1InstructionAsync({
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config delegate revoked');
// [/OUTPUT]
