---
title: Get Mints in a collection
metaTitle: Token Metadata - Get Mints in a collection
description: How-to guide to get all mints in a collection.
---

Metaplex Token Metadata has [onchain collections](/token-metadata/collections) to allow objective identifying of NFT collections instead of various subjective and potentially conflicting heuristics employed by the community in absence of an onchain standard. 

The specification design makes it very easy to look up any given NFT and determine if it is in a collection and if so, which collection, by simply reading the Collection fields from the metadata account. The onchain `Metadata` struct contains an option `Collection` struct which has a `key` field which is the Pubkey of the SPL token mint of the collection it belongs to.

```rust
pub struct Metadata {
	pub key: Key,
	pub update_authority: Pubkey,
	pub mint: Pubkey,
	pub data: Data,
	// Immutable, once flipped, all sales of this metadata are considered secondary.
	pub primary_sale_happened: bool,
	// Whether or not the data struct is mutable, default is not
	pub is_mutable: bool,
	/// nonce for easy calculation of editions, if present
	pub edition_nonce: Option<u8>,
	/// Token Standard is deterministic and will change from SemiFungible to NonFungible if
	/// you call the create master edition call and it succeeds.
	pub token_standard: Option<TokenStandard>,
	/// Since we cannot easily change Metadata, we add the new DataV2 fields here at the end.
	/// Collection
	pub collection: Option<Collection>,
...
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Collection {
	pub verified: bool, // Whether or not the collection is verified
	pub key: Pubkey,    // The SPL token mint account of the collection NFT
}
```

However, given a collection mint address, finding all NFTs that belong to that particular collection is significantly more difficult when reading directly from chain. There is one superior method using [DAS](/das-api) and two basic approaches to get the data from chain directly.

## DAS API
Fetching the mints using DAS is the superior method when using a [RPC Provider that supports it](/rpc-providers#metaplex-das-api).

{% dialect-switcher title="getAssetByGroup Example" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Replace the `endpoint` with your RPC URL and `collection` with the collection address you are looking for. 

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const endpoint = '<ENDPOINT>';
const collection = 'J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p'

const umi = createUmi(endpoint).use(dasApi());

const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collection,
});
console.log(assets.items.length > 0);
```

{% /totem %}
{% /dialect %}
{% dialect title="cURL" id="curl" %}
{% totem %}

Run this command in your shell. Remember to replace the `<ENDPOINT>` and `<<GROUPVALUE>>`

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "<GROUPVALUE>",
        "page": 1
    },
    "id": 0
}'
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

You can find more methods on DAS and additional Methods that allows fetching and filtering data in our [DAS Documentation](/das-api)

## GetProgramAccounts with PreCalculated Offsets

It’s tempting to think we can simply use a [getProgramAccounts](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts) call with an offset into the `Collection` struct to match the collection id against the `key` field. This is the same way that most client programs find, e.g. a snapshot of NFT mint accounts belonging to a specific candy machine or creator ID. However, due to the fact that `edition_nonce`, `token_standard`, and `collection` are all Rust `Option`s, this gets significantly more complicated. 

Rust `Option`s are represented in [Borsh](https://borsh.io/) encoding with a 0 for the `None` variant and a 1 for the `Some` variant along with the normal encoding for whatever the contained value of the `Some` variant is. (One byte for a `u8`, for example.) This means that we can’t calculate an offset into the `Collection` struct without knowing what variant type is in each two of the two `Option`s prior to the `Collection` field. 

There are two ways to do this: brute force and gathering a priori knowledge of the variants. 

Brute force requires computing all the possible variants and running multiple `getProgramAccount` calls in parallel. Given up to five creators in the creators array and two possible options for each of the two `Option` fields prior to `Collection`, that leads to a total number of 20 possible combinations, meaning that you would have to make 20 `getProgramAccount` calls with various offsets to take this approach. This is obviously not a feasible nor scaleable approach. 
If some a priori information is known about a collection though, this can be reduced to a smaller number of calls. Knowing how many creators there are is the biggest gain, reducing the number of `getProgramAccount` calls down to only four which can be reasonably run in parallel. 

This approach is not the recommended one due to the high number of edge cases it involves and the fact that it can only be pragmatically used on collections where there is only one creator or the number of variations of how many creators there are is known ahead of time. 

Instead, we recommend using the transaction crawling approach.

## Transaction Crawling

Transaction crawling involves getting all the transactions associated with the collection mint address and then parsing them to find the specific instructions that create collections. From there we can determine which mint accounts are part of the collection. 

The algorithm for doing this is shown below:

- Call `[getSignaturesForAddress](https://docs.solana.com/developing/clients/jsonrpc-api#getsignaturesforaddress)` for the collection mint address to get all transaction signatures that in anyway involved the collection mint address.
- For each signature, call `[getTransaction](https://docs.solana.com/developing/clients/jsonrpc-api#gettransaction)` to get the actual transaction data for each signature.
- Parse the transactions to find the program ids and filter out any that do not involve the `token-metadata` program which has an address of `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`.
- We only want to retrieve collection members that are verified, and the only two handlers in the `token-metadata` that verify collection members are `verify_collection` and `set_and_verify` which have the respective positions in the `MetadataInstruction` enum of `18` and `25`, which are base58 values of `K` and `S`.
- Filter the instructions to only have ones with a `data` value of `K` or `S` to insure we only get those specific `token-metadata` handlers.
- The `metadata` address being verified will be the first account passed into either of these handlers.
- Add the `metadata` address to a `Set` to ensure no duplicates.

- Once all `metadata` address are found, loop over them and call `getAccountInfo` to find the account data.
    - Deserialize the account data into a Metadata struct/object, and find the mint address from the `mint` field. Add the `mint` address to a Set.
    - This final Set is your list of mint addresses for all items in the collection.

Example Rust and TypeScript code for transaction crawling to get collection members can be found [here](https://github.com/metaplex-foundation/get-collection).