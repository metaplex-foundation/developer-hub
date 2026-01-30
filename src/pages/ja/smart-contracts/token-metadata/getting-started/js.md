---
title: JavaScriptを使用したはじめに
metaTitle: JavaScript SDKs | Token Metadata
description: Metaplex Token Metadata JavaScript SDKsを使用してNFTの開発を始めましょう。
---

Metaplexは Token Metadata NFTとやり取りするための2つのJavaScript SDKを提供しています。両方ともToken Metadataのすべての機能にアクセスできます - プロジェクトのアーキテクチャに基づいて選択してください。 {% .lead %}

## SDKを選択

{% quick-links %}

{% quick-link title="Umi SDK" icon="JavaScript" href="/ja/smart-contracts/token-metadata/getting-started/umi" description="流暢なAPIを持つUmiフレームワーク上に構築。Umiを使用するプロジェクトに最適。" /%}

{% quick-link title="Kit SDK" icon="JavaScript" href="/ja/smart-contracts/token-metadata/getting-started/kit" description="関数型インストラクションビルダーを持つ@solana/kit上に構築。新しいプロジェクトに最適。" /%}

{% /quick-links %}

## 比較

| 機能 | Umi SDK | Kit SDK |
| ------- | ------- | ------- |
| パッケージ | `@metaplex-foundation/mpl-token-metadata` | `@metaplex-foundation/mpl-token-metadata-kit` |
| ベース | Umiフレームワーク | @solana/kit |
| トランザクション構築 | `.sendAndConfirm()`を使用した流暢なAPI | インストラクションビルダーを使用した関数型 |
| ウォレット処理 | 組み込みアイデンティティシステム | 標準の@solana/signers |
| 最適な用途 | 既にUmiを使用しているプロジェクト | @solana/kitを使用する新しいプロジェクト |

## クイックサンプル

{% dialect-switcher title="NFTを作成" %}
{% dialect title="Umi SDK" id="umi" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

const mint = generateSigner(umi);
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);
```

{% /dialect %}
{% dialect title="Kit SDK" id="kit" %}

```ts
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

const mint = await generateKeyPairSigner();
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550,
  tokenOwner: authority.address,
});
await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});
```

{% /dialect %}
{% /dialect-switcher %}

詳細なセットアップ手順とより多くのサンプルについては、各ページをご覧ください。
