// [IMPORTS]
import {
  getDelegateAuthorityItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, updateAuthority, and authorityItemDelegate are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Approve an Authority Item delegate
const delegateIx = await getDelegateAuthorityItemV1InstructionAsync({
  mint: mintAddress,
  delegate: authorityItemDelegate,
  authority: updateAuthority,
  payer: updateAuthority,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm([delegateIx], [updateAuthority]);
// [/MAIN]

// [OUTPUT]
console.log('Authority Item delegate approved');
// [/OUTPUT]
