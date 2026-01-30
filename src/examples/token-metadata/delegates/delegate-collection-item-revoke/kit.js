// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getRevokeCollectionItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const collectionItemDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const revokeIx = await getRevokeCollectionItemV1InstructionAsync({
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Collection Item delegate revoked');
// [/OUTPUT]
