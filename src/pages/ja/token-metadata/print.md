---
title: エディションの印刷
metaTitle: エディションの印刷 | Token Metadata
description: Token MetadataでNFTエディションを印刷する方法を学習します
---

すべてのNFTは、その**Master Edition**アカウントが適切に設定されている場合、複数のエディションとして印刷される可能性を持っています。このページでは、印刷可能なNFTを作成し、そこからエディションを印刷する方法を学びます。

## 印刷可能NFT

印刷可能NFTの所有者は、その最大供給量に達していない限り、そこから好きなだけエディションを印刷できます。

すべての非代替可能アセット（すなわち、`NonFungible`および`ProgrammableNonFungible`トークン標準）は、作成時に印刷可能NFTになることができます。これは、アセットのMaster Editionアカウントの**Max Supply**属性を設定することで行われます。この属性はオプションであり、以下の値のいずれかを持つことができます：

- `None`: NFTには固定の供給量がありません。言い換えると、**NFTは印刷可能で無制限の供給量を持ちます**。
- `Some(x)`: NFTは`x`エディションの固定供給量を持ちます。
  - `x = 0`の場合、これは**NFTが印刷不可能**であることを意味します。
  - `x > 0`の場合、これは**NFTが印刷可能で`x`エディションの固定供給量を持つ**ことを意味します。

印刷可能NFTから新しい印刷エディションが作成されるたびに、いくつかのことが起こります：

- 全く新しいエディションNFTが作成され、そのデータは元のNFTと一致します。唯一の違いは、印刷されたエディションが元のNFTとは異なるトークン標準を使用することです。
  - `NonFungible`アセットの場合、印刷エディションは`NonFungibleEdition`トークン標準を使用します。
  - `ProgrammableNonFungible`アセットの場合、印刷エディションは`ProgrammableNonFungibleEdition`トークン標準を使用します。
- **Master Edition**アカウントを使用する代わりに、新しいエディションNFTは**Edition**アカウントを使用し、そのエディション番号と親NFTを追跡するために、親の**Master Edition**アカウントのアドレスを保存します。
- Master Editionアカウントの**Supply**属性が1増加します。**Supply**属性が**Max Supply**属性に達すると、NFTはもはや印刷できません。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-280" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" theme="orange" z=1 /%}
{% /node %}

{% node parent="master-edition" y="-140" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = EditionV1" /%}
{% node #edition-parent label="Parent" /%}
{% node label="Edition" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" fromPosition="left" label="OR" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="edition-parent" to="master-edition" dashed=true arrow="none" fromPosition="left" toPosition="left" /%}
{% /diagram %}

## 印刷可能NFTの作成

印刷可能NFTを作成するには、通常のNFTを作成するときと同様のプロセスに従いますが、**maxSupply**属性を設定します。

{% dialect-switcher title="Create a Printable NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My Printable NFT',
  uri: 'https://example.com/my-printable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  maxSupply: 10, // 10エディションの最大供給量
  // または無制限供給の場合は maxSupply: null
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## エディションの印刷

印刷可能NFTが作成されると、所有者（または適切な権限）はそこからエディションを印刷できます。

{% dialect-switcher title="Print an Edition" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { 
  generateSigner,
  publicKey 
} from '@metaplex-foundation/umi'
import { printV2 } from '@metaplex-foundation/mpl-token-metadata'

// 新しいエディション用のMint
const editionMint = generateSigner(umi)

// 元の印刷可能NFTのMintアドレス
const originalMint = publicKey('...')

await printV2(umi, {
  masterTokenAccountOwner: umi.identity,
  masterEditionMint: originalMint,
  editionMint,
  editionTokenAccountOwner: umi.identity,
  editionNumber: 1, // エディション番号（1から開始）
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## プログラマブルNFTエディション

プログラマブルNFTのエディションを印刷する場合、追加の考慮事項があります：

{% dialect-switcher title="Print pNFT Edition" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  generateSigner,
  publicKey,
  unwrapOptionRecursively
} from '@metaplex-foundation/umi'
import { 
  printV2,
  fetchDigitalAsset,
  TokenStandard
} from '@metaplex-foundation/mpl-token-metadata'

// 元のpNFTのデータを取得
const originalMint = publicKey('...')
const originalAsset = await fetchDigitalAsset(umi, originalMint)

const editionMint = generateSigner(umi)

await printV2(umi, {
  masterTokenAccountOwner: umi.identity,
  masterEditionMint: originalMint,
  editionMint,
  editionTokenAccountOwner: umi.identity,
  editionNumber: 1,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // 認証ルールがある場合
  authorizationRules: unwrapOptionRecursively(
    originalAsset.metadata.programmableConfig
  )?.ruleSet,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}