// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getRevokeCollectionV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const collectionDelegate = address('delegateAddress...');
// [/SETUP]

// [MAIN]
const revokeIx = await getRevokeCollectionV1InstructionAsync({
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([revokeIx], [updateAuthority]);
// [/MAIN]

// [OUTPUT]
console.log('Collection delegate revoked');
// [/OUTPUT]
