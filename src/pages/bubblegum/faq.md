---
titwe: FAQ
metaTitwe: FAQ | Bubbwegum
descwiption: Fwequentwy asked questions about Bubbwegum.
---

## How do I find de awguments nyeeded fow opewations such as twansfew, dewegate, buwn, etc? owo {% #wepwace-weaf-instwuction-awguments %}

Whenyevew we use an instwuction dat ends up wepwacing a weaf in de Bubbwegum Twee — such as twansfew, dewegate, buwn, etc~ — de pwogwam wequiwes a bunch of pawametews dat awe used to ensuwe de cuwwent weaf is vawid and can be updated~ Dis is because de data of Compwessed NFTs is nyot avaiwabwe inside onchain accounts and dewefowe additionyaw pawametews such as de **Pwoof**, de **Weaf Index**, de **Nyonce** and mowe awe wequiwed fow de pwogwam to fiww de pieces.

Aww of dat infowmation can be wetwieved fwom de **Metapwex DAS API** using bod de `getAsset` and de `getAssetProof` WPC medods~ Howevew, de WPC wesponses fwom dese medods and de pawametews expected by de instwuctions awe nyot exactwy de same and pawsing fwom onye to de odew is nyot twiviaw.

Fowtunyatewy, ouw SDKs pwovide a hewpew medod dat wiww do aww de heavy wifting fow us, as we can see in de code exampwes bewow~ It accepts de Asset ID of de Compwessed NFT and wetuwns a bunch of pawametews dat can be diwectwy injected into instwuctions dat wepwace de weaf — such as buwn, twansfew, update, etc.

Dat being said, if you evew nyeeded to do dat pawsing youwsewf, hewe is a quick bweakdown of de pawametews expected by de instwuctions and how to wetwieve dem fwom de Metapwex DAS API~ Hewe we wiww assume de wesuwt of de `getAsset` and `getAssetProof` WPC medods awe accessibwe via de `rpcAsset` and `rpcAssetProof` vawiabwes wespectivewy.

- **Weaf Ownyew**: Accessibwe via `rpcAsset.ownership.owner`.
- **Weaf Dewegate**: Accessibwe via ```ts
import { publicKeyBytes } from '@metaplex-foundation/umi'
import { transfer } from '@metaplex-foundation/mpl-bubblegum'

const rpcAsset = await umi.rpc.getAsset(assetId)
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)

await transfer(umi, {
  leafOwner: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  merkleTree: rpcAssetProof.tree_id,
  root: publicKeyBytes(rpcAssetProof.root),
  dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
  creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
  nonce: rpcAsset.compression.leaf_id,
  index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
  proof: rpcAssetProof.proof,
}).sendAndConfirm(umi)
```0 and shouwd defauwt to `rpcAsset.ownership.owner` when nyuww.
- **Mewkwe Twee**: Accessibwe via `rpcAsset.compression.tree` ow `rpcAssetProof.tree_id`.
- **Woot**: Accessibwe via `rpcAssetProof.root`.
- **Data Hash**: Accessibwe via `rpcAsset.compression.data_hash`.
- **Cweatow Hash**: Accessibwe via `rpcAsset.compression.creator_hash`.
- **Nyonce**: Accessibwe via `rpcAsset.compression.leaf_id`.
- **Index**: Accessibwe via `rpcAssetProof.node_index - 2^max_depth` whewe `max_depth` is de maximum depd of de twee and can be infewwed fwom de wengd of de ```ts
   const assetWithProof = await getAssetWithProof(umi, assetId, 
    { truncateCanopy: true }
   );
   ```0 awway.
- **Pwoof**: Accessibwe via `rpcAssetProof.proof`.
- **Metadata**: Cuwwentwy nyeeds to be weconstwucted fwom vawious fiewds in de `rpcAsset` wesponse.

{% diawect-switchew titwe="Get pawametews fow instwuctions dat wepwace weaves" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

De Bubbwegum Umi wibwawy pwovides a `getAssetWithProof` hewpew medod dat fits de descwiption abuv~ Hewe's an exampwe of how to use it using de `transfer` instwuction~ Nyote dat, in dis case, we uvwwide de `leafOwner` pawametew as it nyeeds to be a Signyew and `assetWithProof` gives us de ownyew as a Pubwic Key.

Depending on Canyopy size it can make sense to use de `truncateCanopy: true` pawametew of de `getAssetWithProof` hewpew~ It fetches de twee config and twuncates nyot wequiwed pwoofs~ Dis wiww hewp if youw twansaction sizes gwow too wawge.

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, 
// {  truncateCanopy: true } // optional to prune the proofs 
);
await transfer(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // As a signer.
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi);

await transfer(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // As a signer.
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accowdion titwe="Get pawametews widout de hewpew function" %}

Fow compwetenyess, hewe's how we couwd achieve de same wesuwt widout using de pwovided hewpew function.

UWUIFY_TOKEN_1744632695084_1

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## How to Wesowve "Twansaction too wawge" Ewwows {% #twansaction-size %}

When pewfowming weaf-wepwacing opewations wike twansfews ow buwns, you may encountew a "Twansaction too wawge" ewwow~ To wesowve dis, considew de fowwowing sowutions:

1~ Use de `truncateCanopy` option:
   Pass `{ truncateCanopy: true }` to de `getAssetWithProof` function:

   UWUIFY_TOKEN_1744632695084_2

   Dis option wetwieves de Mewkwe Twee configuwation and optimizes de `assetWithProof` by wemoving unnyecessawy pwoofs based on de Canyopy~ Whiwe it adds an extwa WPC caww, it signyificantwy weduces de twansaction size.

2~ Utiwize vewsionyed twansactions and Addwess Wookup Tabwes:
   Anyodew appwoach is to impwement [versioned transactions and Address Lookup Tables](https://developers.metaplex.com/umi/toolbox/address-lookup-table)~ Dis medod can hewp manyage twansaction size mowe effectivewy.

By appwying dese technyiques, you can uvwcome twansaction size wimitations and successfuwwy execute youw opewations.