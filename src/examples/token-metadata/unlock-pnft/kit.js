// [IMPORTS]
import {
  getUnlockV1InstructionAsync,
  fetchDigitalAssetWithAssociatedToken,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Assuming rpc, rpcSubscriptions, sendAndConfirm, and authority (delegate) are set up

const mintAddress = 'mintAddress...'; // The pNFT mint address
// [/SETUP]

// [MAIN]
// Fetch pNFT Asset with Token Accounts
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  rpc,
  mintAddress,
  authority.address
);

// Unlock a pNFT - requires approved delegate authority
const unlockIx = await getUnlockV1InstructionAsync({
  mint: mintAddress,
  authority,
  payer: authority,
  tokenOwner: assetWithToken.token.owner,
  token: assetWithToken.token.address,
  tokenRecord: assetWithToken.tokenRecord?.address,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
});

await sendAndConfirm({
  instructions: [unlockIx],
  payer: authority,
});
// [/MAIN]

// [OUTPUT]
console.log('pNFT unlocked');
// [/OUTPUT]
