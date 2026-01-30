// [IMPORTS]
import {
  getRevokeAuthorityItemV1InstructionAsync,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, updateAuthority, and authorityItemDelegate are set up

const mintAddress = 'mintAddress...'; // The NFT mint address
// [/SETUP]

// [MAIN]
// Revoke an Authority Item delegate
// Note: Either the update authority or the delegate itself can revoke
const revokeIx = await getRevokeAuthorityItemV1InstructionAsync({
  mint: mintAddress,
  delegate: authorityItemDelegate,
  authority: updateAuthority, // Or pass the delegate to self-revoke
  payer: updateAuthority,
  tokenStandard: TokenStandard.NonFungible,
});

await sendAndConfirm({
  instructions: [revokeIx],
  payer: updateAuthority,
});
// [/MAIN]

// [OUTPUT]
console.log('Authority Item delegate revoked');
// [/OUTPUT]
