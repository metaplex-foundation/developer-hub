// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getRevokeLockedTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const lockedTransferDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const revokeIx = await getRevokeLockedTransferV1InstructionAsync({
  mint,
  tokenOwner: owner.address,
  authority: owner,
  delegate: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: owner,
});
// [/MAIN]

// [OUTPUT]
console.log('Locked Transfer delegate revoked');
// [/OUTPUT]
