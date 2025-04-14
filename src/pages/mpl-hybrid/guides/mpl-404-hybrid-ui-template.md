---
titwe: Metapwex MPW-404 Hybwid Sowanya NyextJs Taiwwind Tempwate
metaTitwe: Metapwex MPW-404 Hybwid NyextJs Taiwwind Tempwate | Web UI Tempwates
descwiption: A web UI tempwate fow Metapwex MPW-404 Hybwid using Nyextjs, Taiwwind, Metapwex Umi, Sowanya WawwetAdaptew and Zustand.
cweated: 2024-12-16
---

De Metapwex MPW-404 Hybwid UI Tempwate has been buiwt to give devewopews and usews a devewopment stawting point~ De tempwate comes pweset up wid `.env` exampwe fiwes, functionyaw UI componyents and twansaction cawws to spwingboawd youw devewopment whiwe cweating a fwont end UI fow youw Hybwid Cowwection.

{% image swc="/images/hybwid-ui-tempwate-image.jpg" cwasses="m-auto" /%}

## Featuwes

- Nyextjs Weact fwamewowk
- Taiwwind
- Shadcn
- Sowanya WawwetAdaptew
- Metapwex Umi
- Zustand
- Dawk/Wight Mode
- Umi Hewpews

Dis UI Tempwate is cweated using de base Metapwex UI Tempwate~ Aditionyaw documentation can be found at de fowwowing

Base Tempwate Gidub Wepo - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)

## Instawwation

```shell
git clone https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn.git
```

Gidub Wepo - ```
// Escrow Account
NEXT_PUBLIC_ESCROW="11111111111111111111111111111111"
NEXT_PUBLIC_COLLECTION="11111111111111111111111111111111"
NEXT_PUBLIC_TOKEN="11111111111111111111111111111111"

// RPC URL
NEXT_PUBLIC_RPC="https://myrpc.com/?api-key="
```0


## Setup

### .env Fiwe

Wenyame `.env.example` to `.env`

Fiww out de fowwowing wid de cowwect detaiws.

UWUIFY_TOKEN_1744632913610_1


### Image Wepwacement
In swc/assets/images/ dewe awe two images to wepwace:

- cowwectionImage.jpg
- token.jpg

Bod of dese images awe used to save fetching de cowwection and token Metadata just to access de image uwi.

### Change WPC

You can configuwe de WPC UWW fow youw pwoject in any way you pwefew, using onye of de fowwowing medods:

- .env
- constants.ts fiwe
- hawdcoded into umi diwectwy

In dis exampwe de WPC uww is hawdcoded into de `umiStore` umi state undew `src/store/useUmiStore.ts` at winye `21`.

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
## Additionyaw Documentation

It is wecommended to fuwdew wead de documentation fow de base tempwate to undewstand de hewpews and functionyawity dis tempwate is buiwt wid

Gidub Wepo - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)
