// [IMPORTS]
import { getMplTokenAuthRulesProgramId } from '@metaplex-foundation/mpl-candy-machine';
import {
  fetchDigitalAssetWithAssociatedToken,
  findTokenRecordPda,
  TokenStandard,
  transferV1,
} from '@metaplex-foundation/mpl-token-metadata';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey, unwrapOptionRecursively } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
// [/IMPORTS]

// [SETUP]
// The NFT Asset Mint ID
const mintId = publicKey('11111111111111111111111111111111');

// The destination wallet
const destinationAddress = publicKey('22222222222222222222222222222222');
// [/SETUP]

// [MAIN]
// Fetch the pNFT Asset with the Token Account
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// Calculates the destination wallet's Token Account
const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintId,
  owner: destinationAddress,
});

// Calculates the destinations wallet's Token Record Account
const destinationTokenRecord = findTokenRecordPda(umi, {
  mint: mintId,
  token: destinationTokenAccount[0],
});

// Transfer the pNFT
const { signature } = await transferV1(umi, {
  mint: mintId,
  destinationOwner: destinationAddress,
  destinationTokenRecord: destinationTokenRecord,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // Check to see if the pNFT asset as auth rules.
  authorizationRules:
    unwrapOptionRecursively(assetWithToken.metadata.programmableConfig)
      ?.ruleSet || undefined,
  // Auth rules program ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // Some pNFTs may require authorization data if set.
  authorizationData: undefined,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Signature:', base58.deserialize(signature));
// [/OUTPUT]
