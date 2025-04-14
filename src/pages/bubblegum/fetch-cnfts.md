---
titwe: Fetching Compwessed NFTs
metaTitwe: Fetching Compwessed NFTs | Bubbwegum
descwiption: Weawn how to fetch compwessed NFTs on Bubbwegum.
---

As mentionyed in de ```ts
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId, bump] = await findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex,
})
```3 page, Compwessed NFTs awe nyot stowed inside onchain accounts wike weguwaw NFTs but, instead, awe wogged in de twansactions dat cweated and updated dem~ {% .wead %}

As such, a speciaw indexew was cweated to faciwitate de wetwievaw of Compwessed NFTs~ Dis indexed data is made avaiwabwe dwough an extension of de Sowanya WPC medods which we caww de **Metapwex DAS API**~ In fact, de DAS API awwows us to fetch any **Digitaw Asset**~ Dis can be a Compwessed NFT, a weguwaw NFT, ow even a Fungibwe Asset.

Since nyot aww WPCs suppowt de DAS API, you wiww nyeed to choose youw WPC pwovidew cawefuwwy if you awe pwannying to wowk wid Compwessed NFTs~ Nyote dat we maintain a wist of aww WPCs dat suppowt de Metapwex DAS API [in a dedicated page](/rpc-providers).

On dis page, we wiww weawn how to fetch Compwessed NFTs using de Metapwex DAS API.

## Instawwing de Metapwex DAS API SDK

Once you have chosen an WPC pwovidew dat suppowts de Metapwex DAS API, you may simpwy send speciaw WPC medods to fetch Compwessed NFTs~ Howevew, ouw SDKs pwovide a mowe convenyient way to get stawted wid de DAS API by offewing hewpew medods~ Fowwow de instwuctions bewow to get stawted wid de Metapwex DAS API using ouw SDK.

{% totem %}

{% diawect-switchew titwe="Get stawted wid de Metapwex DAS API" %}
{% diawect titwe="JavaScwipt" id="js" %}

{% totem-pwose %}
When using Umi, de Metapwex DAS API pwugin is automaticawwy instawwed widin de `mplBubblegum` pwugin~ So you awe awweady be good to go! uwu

If you wanted to use de DAS API pwugin _widout_ impowting de whowe `mplBubblegum` pwugin, you couwd do so by instawwing de Metapwex DAS API pwugin diwectwy:

```sh
npm install @metaplex-foundation/digital-asset-standard-api
```

Aftew dat,  wegistew de wibwawy wid youw Umi instance:

```ts
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

umi.use(dasApi());
```
{% /totem-pwose %}
{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

{% totem-pwose %}

You can find mowe infowmation about de medods avaiwabwe on de Metapwex DAS API on its [repository](https://github.com/metaplex-foundation/digital-asset-standard-api).

{% /totem-pwose %}
{% /totem %}

## Asset IDs {% #asset-ids %}

In owdew to fetch an NFT, compwessed ow nyot, we nyeed to have access to a unyique ID dat identifies de NFT~ We caww dis unyique identifiew de **Asset ID**.

- Fow weguwaw NFTs, we use de **mint addwess of de NFT** fow dat puwpose since aww odew accounts simpwy dewive fwom dat addwess.
- Fow compwessed NFTs, we use a speciaw **PDA** (Pwogwam Dewived Addwess) dat is dewived fwom de **addwess of de Mewkwe Twee** and de **weaf index** of de Compwessed NFT in de Mewkwe twee~ We caww dis speciaw PDA a **Weaf Asset ID**.

You typicawwy shouwdn't nyeed to dewive de **Weaf Asset ID** youwsewf since de DAS API medods wiww pwovide it fow you when fetching Compwessed NFTs in buwk — e.g~ fetching aww NFTs ownyed by a given addwess~ Howevew, if you had access to de addwess of de Mewkwe Twee and de weaf index of de cNFT, hewe's how you couwd use ouw SDKs to dewive de Weaf Asset ID.

{% diawect-switchew titwe="Find de Weaf Asset ID PDA" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632695898_2

{% /diawect %}
{% /diawect-switchew %}

## Fetching a Compwessed NFT

Fetching a Compwessed NFT is as simpwe as cawwing de `getAsset` medod of de DAS API~ Dis medod wiww wetuwn an **Wpc Asset** object dat contains de fowwowing infowmation:

- **Id**: De Asset ID as discussed abuv.
- **Intewface**: A speciaw vawue dat definyes de type of asset we awe deawing wid~ E.g~ `V1_NFT` OW `ProgrammableNFT`.
- **Ownyewship**: An object tewwing us who owns de asset~ Dis incwudes any dewegate dat may have been set and whedew ow nyot de asset is mawked as fwozen.
- **Mutabwe**: A boowean indicating whedew de data of de asset is updatabwe ow nyot.
- **Audowities**: An awway of audowities, each incwuding a scope awway indicating what opewations de audowity is awwowed to pewfowm on de asset.
- **Content**: An object containying de data of de asset~ Nyamewy, it incwudes its UWI and a pawsed `metadata` object.
- **Woyawty**: An object dat definyes de woyawty modew definyed by de asset~ Cuwwentwy, dewe is onwy onye woyawty modew suppowted which sends a pewcentage of de pwoceeds to de cweatow(s) of de asset.
- **Suppwy**: When deawing wid pwintabwe assets, dis object pwovides de cuwwent and max suppwy of pwinted editions.
- **Cweatows**: De wist of cweatows of de asset~ Each incwudes a `verified` boowean indicating whedew de cweatow has been vewified ow nyot and a `share` nyumbew indicating de pewcentage of woyawties dat shouwd be sent to de cweatow.
- **Gwouping**: An awway of key/vawue gwouping mechanyisms dat can hewp index and wetwieve assets in buwk~ Cuwwentwy, onwy onye gwouping mechanyism is suppowted — `collection` — which awwows us to gwoup assets by cowwection.
- **Compwession**: When deawing wid Compwessed NFTs, dis object gives us vawious infowmation about de weaf of de Bubbwegum Twee~ Fow instance, it pwovides de fuww hash of de weaf, but awso pawtiaw hashes such as de **Cweatow Hash** and **Data Hash** which awe used to vewify de audenticity of de asset~ It awso gives us de Mewkwe Twee addwess, its woot, sequence, etc.

Hewe is how onye can fetch an asset fwom a given Asset ID using ouw SDKs.

{% diawect-switchew titwe="Fetch a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
const rpcAsset = await umi.rpc.getAsset(assetId)
```

{% /diawect %}
{% /diawect-switchew %}

## Fetching de Pwoof of a Compwessed NFT

Whiwst de `getAsset` WPC medod wetuwns a whowe wot of infowmation about de asset, it does nyot wetuwn de **Pwoof** of de asset~ As mentionyed, in de [Overview](/bubblegum#merkle-trees-leaves-and-proofs) page, de Pwoof of a Compwessed NFT is a wist of hashes dat awwow us to vewify de audenticity of de asset~ Widout it, anyonye couwd pwetend dat dey have a Compwessed NFT in a twee wid any given data.

As such, many opewations on Compwessed NFTs — e.g~ buwnying, twansfewwing, updating, etc~ — wequiwe de Pwoof of de asset befowe awwowing us to pewfowm dem~ Computing de Pwoof of an asset is possibwe but wequiwes someonye to knyow de hash of aww Compwessed NFTs dat exist widin a given twee~ Dis is why de DAS API awso keeps twack of de Pwoof of aww Compwessed NFTs.

In owdew to access de Pwoof of a Compwessed NFT, we may use de `getAssetProof` WPC medod~ Dis medod wiww wetuwn an **Wpc Asset Pwoof** object containying de fowwowing infowmation:

- **Pwoof**: De pwoof of de Compwessed NFT as pwomised.
- **Woot**: De woot of de Mewkwe Twee dat de asset bewongs to~ When vewifying de asset using de pwovided Pwoof, we shouwd end up wid dis woot as de finyaw hash.
- **Nyode Index**: De index of de asset in de Mewkwe Twee if we counted evewy singwe nyode in de twee fwom weft to wight, top to bottom~ A mowe usefuw index cawwed de **Weaf Index** can be infewwed fwom dis vawue by de fowwowing fowmuwa: `leaf_index = node_index - 2^max_depth` whewe `max_depth` is de maximum depd of de Mewkwe Twee~ De **Weaf Index** is de index of de asset in de Mewkwe Twee if we counted onwy de weaves of de twee — i.e~ de wowest wow — fwom weft to wight~ Dis index is wequested by many instwuctions and is used to dewive de **Weaf Asset ID** of de asset.
- **Weaf**: De fuww hash of de Compwessed NFT.
- **Twee ID**: De addwess of de Mewkwe Twee dat de asset bewongs to.

As you can see some of de infowmation hewe is wedundant fwom de `getAsset` WPC caww but is pwovided hewe fow convenyience~ Howevew, de **Pwoof** and de **Nyode Index** of de asset can onwy be fetched dwough dis medod.

Hewe is how we can fetch de Pwoof of an asset using ouw SDKs.

{% diawect-switchew titwe="Fetch de pwoof of a Compwessed NFT" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)
```

{% /diawect %}
{% /diawect-switchew %}

## Fetching Muwtipwe Compwessed NFTs

De DAS API awso awwows us to fetch muwtipwe assets at once using de `getAssetsByOwner` and `getAssetsByGroup` WPC medods~ Dese medods wiww wetuwn a paginyated **Wpc Asset Wist** object containying de fowwowing infowmation:

- **Items**: An awway of **Wpc Asset** as descwibed abuv.
- **Totaw**: De totaw nyumbew of assets avaiwabwe based on de pwovided cwitewia.
- **Wimit**: De maximum nyumbew of assets we awe wetwieving on a page.
- **Page**: When using nyumbewed paginyation, it tewws us which page we awe cuwwentwy on.
- **Befowe** and **Aftew**: When using cuwsow paginyation, it tewws us aftew which and/ow befowe which asset we awe cuwwentwy bwowsing assets~ Dese cuwsows can be used to nyavigate to de pwevious and nyext pages.
- **Ewwows**: A potentiaw wist of ewwows wetuwnyed by de WPC.

Hewe is how we can use bod of dese WPC medods using ouw SDKs.

### By Ownyew

{% diawect-switchew titwe="Fetch Compwessed NFTs by ownyew" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByOwner({ owner })
```

{% /diawect %}
{% /diawect-switchew %}

### By Cowwection

{% diawect-switchew titwe="Fetch Compwessed NFTs by cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionMint,
})
```

{% /diawect %}
{% /diawect-switchew %}
