// [IMPORTS]
import {
  fetchDigitalAssetWithAssociatedToken,
  lockV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin

// Mint ID of the pNFT Asset
const mintId = publicKey('11111111111111111111111111111111');
// [/SETUP]

// [MAIN]
// Fetch pNFT Asset with Token Accounts
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// Send lock instruction
const { signature } = await lockV1(umi, {
  // Mint ID of the pNFT Asset
  mint: mintId,
  // Update Authority or Delegate Authority
  authority: umi.identity,
  // Token Standard
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // Owner of the pNFT Asset
  tokenOwner: assetWithToken.token.owner,
  // Token Account of the pNFT Asset
  token: assetWithToken.token.publicKey,
  // Token Record of the pNFT Asset
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Signature: ', base58.deserialize(signature));
// [/OUTPUT]
