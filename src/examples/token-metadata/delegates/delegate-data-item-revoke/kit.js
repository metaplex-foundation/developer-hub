// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getRevokeDataItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const dataItemDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const revokeIx = await getRevokeDataItemV1InstructionAsync({
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([revokeIx], [updateAuthority]);
// [/MAIN]

// [OUTPUT]
console.log('Data Item delegate revoked');
// [/OUTPUT]
