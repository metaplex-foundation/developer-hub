// [IMPORTS]
import {
  getUpdateAsAuthorityItemDelegateV2InstructionAsync,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authorityItemDelegate are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
const newUpdateAuthority = 'newUpdateAuthorityAddress...';
// [/SETUP]

// [MAIN]
// Update as Authority Item delegate
const updateIx = await getUpdateAsAuthorityItemDelegateV2InstructionAsync({
  mint: mintAddress,
  authority: authorityItemDelegate,
  payer: authorityItemDelegate,
  newUpdateAuthority,
  isMutable: false,
});

await sendAndConfirm([updateIx], [authorityItemDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('Asset updated by Authority Item delegate');
// [/OUTPUT]
