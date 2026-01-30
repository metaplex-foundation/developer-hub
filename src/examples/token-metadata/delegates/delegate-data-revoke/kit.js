// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getRevokeDataV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const dataDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const revokeIx = await getRevokeDataV1InstructionAsync({
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Data delegate revoked');
// [/OUTPUT]
