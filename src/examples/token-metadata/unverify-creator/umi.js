// [IMPORTS]
import { unverifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, metadata, and creator are set up
// [/SETUP]

// [MAIN]
await unverifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Creator unverified');
// [/OUTPUT]
