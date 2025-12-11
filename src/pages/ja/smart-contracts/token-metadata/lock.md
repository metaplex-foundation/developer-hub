---
title: アセットのロック
metaTitle: アセットのロック | Token Metadata
description: Token Metadataでアセットをロック/フリーズする方法を学習します
---

「[委任された権限](/ja/token-metadata/delegates#token-delegates)」ページで述べられているように、特定の委任はアセットをロックおよびロック解除でき、所有者がそれらを転送またはバーンすることを防ぐことができます。ロックされたアセットはまた、所有者が委任の権限を取り消すことも禁止します。このロック機能により、エスクローアカウントなしでは機能しない様々なユーティリティの使用例（ステーキングなど）が可能になります。 {% .lead %}

以下の表で、アセットのロックをサポートするすべてのToken委任をリストします。これらの各委任の詳細と、それらを承認/取り消す方法については、それぞれのセクションで学ぶことができます。

| 委任                                                                                | ロック/ロック解除 | 転送 | バーン | 対象              |
| ----------------------------------------------------------------------------------- | ----------------- | ---- | ------ | ---------------- |
| [Standard](/ja/token-metadata/delegates#standard-delegate)                         | ✅                | ✅   | ✅     | pNFT以外すべて   |
| [Locked Transfer](/ja/token-metadata/delegates#locked-transfer-delegate-pnft-only) | ✅                | ✅   | ❌     | pNFTのみ         |
| [Utility](/ja/token-metadata/delegates#utility-delegate-pnft-only)                 | ✅                | ❌   | ✅     | pNFTのみ         |
| [Staking](/ja/token-metadata/delegates#staking-delegate-pnft-only)                 | ✅                | ❌   | ❌     | pNFTのみ         |

アセットに承認されたToken委任があると仮定して、委任がそれをロックおよびロック解除する方法を見てみましょう。

## アセットのロック

### NFT

アセットをロックするには、委任がToken Metadataプログラムの**Lock**命令を使用できます。この命令は以下の属性を受け取ります：

- **Mint**: アセットのMintアカウントのアドレス。
- **Authority**: ロックを承認する署名者。これは委任された権限である必要があります。
- **Token Standard**: ロックされるアセットの標準。Token Metadataプログラムは明示的にこの引数を必要としませんが、SDKが他のほとんどのパラメーターに適切なデフォルト値を提供できるようにするために必要です。

{% dialect-switcher title="Lock an asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### pNFT

```ts
import {
  fetchDigitalAssetWithAssociatedToken,
  lockV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

// pNFT AssetのMint ID
const mintId = publicKey("11111111111111111111111111111111");

// Token Accountsを持つpNFT Assetを取得
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// ロック命令を送信
const { signature } = await lockV1(umi, {
  // pNFT AssetのMint ID
  mint: mintId,
  // Update AuthorityまたはDelegate Authority
  authority: umi.identity,
  // Token Standard
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // pNFT Assetの所有者
  tokenOwner: assetWithToken.token.owner,
  // pNFT AssetのToken Account
  token: assetWithToken.token.publicKey,
  // pNFT AssetのToken Record
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));
```

## アセットのロック解除

### NFT

相互に、委任はToken Metadataプログラムの**Unlock**命令を使用してアセットをロック解除できます。この命令は**Lock**命令と同じ属性を受け取り、同じ方法で使用できます。

{% dialect-switcher title="Unlock an NFT Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### pNFT

{% dialect-switcher title="Unlock a pNFT Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
    fetchDigitalAssetWithAssociatedToken,
    TokenStandard,
    unlockV1
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// AssetのMint pNFT ID
const mintId = publicKey("11111111111111111111111111111111");

// mintトークンアカウントを取得
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// ロック解除命令を送信
const { signature } = await unlockV1(umi, {
  // pNFT AssetのMint ID
  mint: mintId,
  // Update AuthorityまたはDelegate Authority
  authority: umi.identity,
  // Token Standard
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // pNFT Assetsの所有者
  tokenOwner: assetWithToken.token.owner,
  // pNFT AssetのToken Account
  token: assetWithToken.token.publicKey,
  // pNFT AssetのToken Record
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));
```