---
title: Transferring Assets
metaTitle: Transferring Assets | Core
description: Learn how to transfer Core NFT Assets between wallets using Metaplex packages.
---

# Component

{% github-code repo="metaplex-foundation/mpl-core" filePath="clients/js/test/transfer.test.ts" startLine="14" endLine="28" language="typescript" /%}

# Dialect Switcher

{% dialect-switcher title="Fetch a Compressed NFT" %}

{% dialect title="JavaScript" id="js" %}

{% github-code repo="metaplex-foundation/mpl-core" filePath="clients/js/test/transfer.test.ts" startLine="14" endLine="28" language="typescript" /%}

{% /dialect %}

{% dialect title="Rust" id="rust" %}

{% github-code repo="metaplex-foundation/mpl-core" filePath="clients/js/test/transfer.test.ts" startLine="12" endLine="30" language="typescript" /%}

{% /dialect %}
{% /dialect-switcher %}

# Regular

```ts
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const newOwner = generateSigner(umi);

  const asset = await createAsset(umi);
  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
  });

  await transferV1(umi, {
    asset: asset.publicKey,
    newOwner: newOwner.publicKey,
  }).sendAndConfirm(umi);
```
