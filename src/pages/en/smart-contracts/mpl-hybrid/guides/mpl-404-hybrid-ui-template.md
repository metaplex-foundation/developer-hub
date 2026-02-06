---
title: Metaplex MPL-404 Hybrid Solana NextJs Tailwind Template
metaTitle: Metaplex MPL-404 Hybrid NextJs Tailwind Template | Web UI Templates
description: A web UI template for Metaplex MPL-404 Hybrid using Nextjs, Tailwind, Metaplex Umi, Solana WalletAdapter and Zustand.
created: 2024-12-16
---

The Metaplex MPL-404 Hybrid UI Template has been built to give developers and users a development starting point. The template comes preset up with `.env` example files, functional UI components and transaction calls to springboard your development while creating a front end UI for your Hybrid Collection.

{% image src="/images/hybrid-ui-template-image.jpg" alt="MPL-404 Hybrid UI Template Screenshot" classes="m-auto" /%}

## Features

- Nextjs React framework
- Tailwind
- Shadcn
- Solana WalletAdapter
- Metaplex Umi
- Zustand
- Dark/Light Mode
- Umi Helpers

This UI Template is created using the base Metaplex UI Template. Aditional documentation can be found at the following

Base Template Github Repo - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)

## Installation

```shell
git clone https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn.git
```

Github Repo - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)

## Setup

### .env File

Rename `.env.example` to `.env`

Fill out the following with the correct details.

```
// Escrow Account
NEXT_PUBLIC_ESCROW="11111111111111111111111111111111"
NEXT_PUBLIC_COLLECTION="11111111111111111111111111111111"
NEXT_PUBLIC_TOKEN="11111111111111111111111111111111"

// RPC URL
NEXT_PUBLIC_RPC="https://myrpc.com/?api-key="
```

### Image Replacement

In src/assets/images/ there are two images to replace:

- collectionImage.jpg
- token.jpg

Both of these images are used to save fetching the collection and token Metadata just to access the image uri.

### Change RPC

You can configure the RPC URL for your project in any way you prefer, using one of the following methods:

- .env
- constants.ts file
- hardcoded into umi directly

In this example the RPC url is hardcoded into the `umiStore` umi state under `src/store/useUmiStore.ts` at line `21`.

```ts
const useUmiStore = create<UmiState>()((set) => ({
  // add your own RPC here
  umi: createUmi('http://api.devnet.solana.com').use(
    signerIdentity(
      createNoopSigner(publicKey('11111111111111111111111111111111'))
    )
  ),
  ...
}))
```

## Additional Documentation

It is recommended to further read the documentation for the base template to understand the helpers and functionality this template is built with

Github Repo - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)
