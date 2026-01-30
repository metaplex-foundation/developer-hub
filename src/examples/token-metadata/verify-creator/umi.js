// [IMPORTS]
import { verifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi, metadata, and creator are set up
// [/SETUP]

// [MAIN]
await verifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Creator verified');
// [/OUTPUT]
