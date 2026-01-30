// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getDelegateLockedTransferV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const lockedTransferDelegate = address('delegateAddress...');
const lockedAddress = address('escrowAddress...'); // Destination for locked transfers
// [/SETUP]

// [MAIN]
const delegateIx = await getDelegateLockedTransferV1InstructionAsync({
  mint,
  tokenOwner: owner.address,
  authority: owner,
  delegate: lockedTransferDelegate,
  lockedAddress,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [delegateIx],
  payer: owner,
});
// [/MAIN]

// [OUTPUT]
console.log('Locked Transfer delegate approved');
// [/OUTPUT]
