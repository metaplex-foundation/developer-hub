---
title: Getting Started using JavaScript
metaTitle: JavaScript SDKs | Token Metadata
description: Get started with NFTs using the Metaplex Token Metadata JavaScript SDKs.
---

Metaplex provides two JavaScript SDKs for interacting with Token Metadata NFTs. Both provide full access to Token Metadata functionality - choose based on your project's architecture. {% .lead %}

## Choose Your SDK

{% quick-links %}

{% quick-link title="Umi SDK" icon="JavaScript" href="/smart-contracts/token-metadata/getting-started/umi" description="Built on the Umi framework with a fluent API. Best for projects using Umi." /%}

{% quick-link title="Kit SDK" icon="JavaScript" href="/smart-contracts/token-metadata/getting-started/kit" description="Built on @solana/kit with functional instruction builders. Best for new projects." /%}

{% /quick-links %}

## Comparison

| Feature | Umi SDK | Kit SDK |
| ------- | ------- | ------- |
| Package | `@metaplex-foundation/mpl-token-metadata` | `@metaplex-foundation/mpl-token-metadata-kit` |
| Built on | Umi framework | @solana/kit |
| Transaction building | Fluent API with `.sendAndConfirm()` | Functional with instruction builders |
| Wallet handling | Built-in identity system | Standard @solana/signers |
| Best for | Projects already using Umi | New projects using @solana/kit |

## Quick Example

{% dialect-switcher title="Create an NFT" %}
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

See the dedicated pages for complete setup instructions and more examples.
