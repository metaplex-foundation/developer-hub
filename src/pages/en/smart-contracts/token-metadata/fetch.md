---
title: Fetching Assets
metaTitle: Fetching Assets | Token Metadata
description: Learn how to fetch the various onchain accounts of your assets on Token Metadata
---

Now that we know how to create and mint the various onchain accounts of our assets, let's learn how to fetch them. {% .lead %}

## Digital Assets

As mentioned in [the previous page](/smart-contracts/token-metadata/mint#creating-accounts), an asset — fungible or not — requires multiple onchain accounts to be created. Depending on the Token Standard of the asset, some accounts may not be required. Here's a quick overview of these accounts:

- **Mint** account (from the SPL Token program): It defines the core properties of the underlying SPL token. This is the entry point to any asset as all other accounts derive from it.
- **Metadata** account: It provides additional data and features to the underlying SPL token.
- **Master Edition** or **Edition** account (only for Non-Fungibles): It enables printing multiple copies of an original NFT. Even when an NFT does not allow printing editions, the **Master Edition** account is still created as it is used as the Mint authority and Freeze authority of the **Mint** account to ensure its non-fungibility.

In order to make fetching assets easier, our SDKs offer a set of helper methods that allow us to fetch all the relevant accounts of an asset in one go. We call the data type that stores all these accounts a **Digital Asset**. In the next sub-sections, we will go through the various ways to fetch **Digital Assets**.

{% dialect-switcher title="Digital Asset definition" %}
{% dialect title="Umi" id="umi" %}

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import { Mint } from '@metaplex-foundation/mpl-toolbox'
import {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAsset = {
  publicKey: PublicKey
  mint: Mint
  metadata: Metadata
  edition?:
    | ({ isOriginal: true } & MasterEdition)
    | ({ isOriginal: false } & Edition)
}
```

{% /dialect %}

{% dialect title="Kit" id="kit" %}

```ts
import type { Address } from '@solana/addresses'
import type { Mint } from '@solana-program/token'
import type {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAsset<TMint extends string = string> = {
  address: Address<TMint>
  mint: Mint
  metadata: Metadata
  edition?:
    | ({ isOriginal: true } & MasterEdition)
    | ({ isOriginal: false } & Edition)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch By Mint

This helper fetches a single **Digital Asset** from the public key of its **Mint** account.

{% code-tabs-imported from="token-metadata/fetch-asset" frameworks="umi,kit" /%}

### Fetch By Metadata

This helper fetches a single **Digital Asset** from the public key of its **Metadata** account. This is slightly less efficient than the previous helper as we first need to fetch the content of the **Metadata** account to find the **Mint** address but if you only have access to the **Metadata** public key, this can be helpful.

{% code-tabs-imported from="token-metadata/fetch-by-metadata" frameworks="umi,kit" /%}

### Fetch All By Mint List

This helper fetches as many **Digital Assets** as there are **Mint** public keys in the provided list.

{% code-tabs-imported from="token-metadata/fetch-all-by-mint-list" frameworks="umi,kit" /%}

### Fetch All By Creator

This helper fetches all **Digital Assets** by creator. Since creators can be located in five different positions in the **Metadata** account, we must also provide the creator position we are interested in. For instance, if we know that for a set of NFTs, the first creator is creator A and the second creator B, we will want to search for creator A in position 1 and creator B in position 2.

{% callout %}
This helper requires RPC calls to filter accounts and is available in the Umi SDK. For the Kit SDK, consider using a DAS (Digital Asset Standard) API provider for efficient queries.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-creator" frameworks="umi" /%}

### Fetch All By Owner

This helper fetches all **Digital Assets** by owner.

{% callout %}
This helper requires RPC calls to filter accounts and is available in the Umi SDK. For the Kit SDK, consider using a DAS (Digital Asset Standard) API provider for efficient queries.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-owner" frameworks="umi" /%}

### Fetch All By Update Authority

This helper fetches all **Digital Assets** from the public key of their update authority.

{% callout %}
This helper requires RPC calls to filter accounts and is available in the Umi SDK. For the Kit SDK, consider using a DAS (Digital Asset Standard) API provider for efficient queries.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-update-authority" frameworks="umi" /%}

## Digital Assets With Token

Note that the **Digital Asset** data structure mentioned above does not provide any information about the owner of the asset. This first definition only focuses on the onchain accounts that are required regardless of their owners. However, in order to provide a more complete picture of an asset, we may also need to know who owns it. This is where the **Digital Asset With Token** data structure comes in. It is an extension of the Digital Asset data structure that also includes the following accounts:

- **Token** account (from the SPL Token program): It defines the relationship between a **Mint** account and its owner. It stores important data such as the amount of tokens owned by the owner. In the case of NFTs, the amount is always 1.
- **Token Record** account (for PNFTs only): It defines additional token-related information for [Programmable Non-Fungibles](/smart-contracts/token-metadata/pnfts) such as its current [Token Delegate](/smart-contracts/token-metadata/delegates#token-delegates) and its role.

Note that, for fungible assets, the same Digital Asset will likely be associated with multiple owners via multiple Token accounts. Therefore, there can be multiple Digital Asset With Token for the same Digital Asset.

Here as well, we offer a set of helpers to fetch Digital Assets With Token.

{% dialect-switcher title="Digital Asset With Token definition" %}
{% dialect title="Umi" id="umi" %}

```ts
import { Token } from '@metaplex-foundation/mpl-toolbox'
import {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAssetWithToken = DigitalAsset & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}

{% dialect title="Kit" id="kit" %}

```ts
import type { Token } from '@solana-program/token'
import type {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAssetWithToken<TMint extends string = string> = DigitalAsset<TMint> & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch By Mint

This helper fetches a single **Digital Asset With Token** from the public key of its **Mint** account. This is mostly relevant for Non-Fungible assets since it will only return one Digital Asset With Token, regardless of how many exist for a Fungible asset.

{% callout %}
The Kit SDK requires knowing either the token address or the owner. Use the "Fetch By Mint and Owner" helper below if you know the owner.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-with-token-by-mint" frameworks="umi" /%}

### Fetch By Mint and Owner

This helper is more performant than the previous helper but requires that we know the owner of the asset.

{% code-tabs-imported from="token-metadata/fetch-with-token-by-owner" frameworks="umi,kit" /%}

### Fetch All By Owner

This helper fetches all **Digital Assets With Token** from a given owner.

{% callout %}
This helper requires RPC calls to filter accounts and is available in the Umi SDK. For the Kit SDK, consider using a DAS (Digital Asset Standard) API provider for efficient queries.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner" frameworks="umi" /%}

### Fetch All By Mint

This helper fetches all **Digital Assets With Token** from the public key of a **Mint** account. This is particularly relevant for Fungible assets since it fetches all **Token** accounts.

{% callout %}
This helper requires RPC calls to filter accounts and is available in the Umi SDK. For the Kit SDK, consider using a DAS (Digital Asset Standard) API provider for efficient queries.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-mint" frameworks="umi" /%}

### Fetch All By Owner and Mint

This helper fetches all **Digital Assets With Token** from both an owner and a **Mint** account. This can be useful for Fungible assets that have more than one **Token** account for a given owner.

{% callout %}
This helper requires RPC calls to filter accounts and is available in the Umi SDK. For the Kit SDK, consider using a DAS (Digital Asset Standard) API provider for efficient queries.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner-and-mint" frameworks="umi" /%}
