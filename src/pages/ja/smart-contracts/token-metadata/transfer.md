---
title: アセットの転送
metaTitle: アセットの転送 | Token Metadata
description: Token Metadataでアセットを転送する方法を学習します
---

アセットの所有者は、Token Metadataプログラムに**Transfer**命令を送信することで、アセットを別のアカウントに転送できます。この命令は以下の属性を受け取ります：

- **Authority**: 転送を承認する署名者。通常、これはアセットの所有者ですが、「[委任された権限](/ja/smart-contracts/token-metadata/delegates)」ページで説明されているように、特定の委任された権限も所有者の代わりにアセットを転送できることに注意してください。
- **Token Owner**: アセットの現在の所有者の公開鍵。
- **Destination Owner**: アセットの新しい所有者の公開鍵。
- **Token Standard**: 転送されるアセットの標準。この命令は、アセットを転送するための統一されたインターフェースを提供するために、すべてのToken Standardで動作します。つまり、プログラマブルでないアセットはSPL TokenプログラムのTransfer命令を直接使用して転送できることに注意する価値があります。

以下は、Token Metadataでアセットを転送するためのSDKの使用方法です。

## NFTの転送

{% dialect-switcher title="Transfer an NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: currentOwner,
  tokenOwner: currentOwner.publicKey,
  destinationOwner: newOwner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## pNFTの転送

以下のコードは、pNFTを新しい所有者に転送する例です。

{% dialect-switcher title="Transfer a pNFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { getMplTokenAuthRulesProgramId } from "@metaplex-foundation/mpl-candy-machine";
import {
  fetchDigitalAssetWithAssociatedToken,
  findTokenRecordPda,
  TokenStandard,
  transferV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { publicKey, unwrapOptionRecursively } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// NFT Asset Mint ID
const mintId = publicKey("11111111111111111111111111111111");

// Token Accountを持つpNFT Assetを取得
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// 宛先ウォレット
const destinationAddress = publicKey(
  "22222222222222222222222222222222"
);

// 宛先ウォレットのToken Accountを計算
const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintId,
  owner: destinationAddress,
});

// 宛先ウォレットのToken Record Accountを計算
const destinationTokenRecord = findTokenRecordPda(umi, {
  mint: mintId,
  token: destinationTokenAccount[0],
});

// pNFTを転送
const { signature } = await transferV1(umi, {
  mint: mintId,
  destinationOwner: destinationAddress,
  destinationTokenRecord: destinationTokenRecord,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // pNFTアセットに認証ルールがあるかチェック
  authorizationRules:
    unwrapOptionRecursively(assetWithToken.metadata.programmableConfig)
      ?.ruleSet || undefined,
  // 認証ルールプログラムID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // 一部のpNFTは設定されている場合に認証データが必要な場合があります
  authorizationData: undefined,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));
```

{% /dialect %}
{% /dialect-switcher %}