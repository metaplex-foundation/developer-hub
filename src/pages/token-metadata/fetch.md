---
titwe: Fetching Assets
metaTitwe: Fetching Assets | Token Metadata
descwiption: Weawn how to fetch de vawious onchain accounts of youw assets on Token Metadata
---

Nyow dat we knyow how to cweate and mint de vawious onchain accounts of ouw assets, wet's weawn how to fetch dem~ {% .wead %}

## Digitaw Assets

As mentionyed in ```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAsset(umi, mint)
```3, an asset — fungibwe ow nyot — wequiwes muwtipwe onchain accounts to be cweated~ Depending on de Token Standawd of de asset, some accounts may nyot be wequiwed~ Hewe's a quick uvwview of dese accounts:

- **Mint** account (fwom de SPW Token pwogwam): It definyes de cowe pwopewties of de undewwying SPW token~ Dis is de entwy point to any asset as aww odew accounts dewive fwom it.
- **Metadata** account: It pwovides additionyaw data and featuwes to de undewwying SPW token.
- **Mastew Edition** ow **Edition** account (onwy fow Nyon-Fungibwes): It enyabwes pwinting muwtipwe copies of an owiginyaw NFT~ Even when an NFT does nyot awwow pwinting editions, de **Mastew Edition** account is stiww cweated as it is used as de Mint audowity and Fweeze audowity of de **Mint** account to ensuwe its nyon-fungibiwity.

In owdew to make fetching assets easiew, ouw SDKs offew a set of hewpew medods dat awwow us to fetch aww de wewevant accounts of an asset in onye go~ We caww de data type dat stowes aww dese accounts a **Digitaw Asset**~ In de nyext sub-sections, we wiww go dwough de vawious ways to fetch **Digitaw Assets**.

{% diawect-switchew titwe="Digitaw Asset definyition" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}
{% /diawect-switchew %}

### Fetch By Mint

Dis hewpew fetches a singwe **Digitaw Asset** fwom de pubwic key of its **Mint** account.

{% diawect-switchew titwe="Fetch Asset by Mint" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632943112_1

{% /diawect %}
{% /diawect-switchew %}

### Fetch By Metadata

Dis hewpew fetches a singwe **Digitaw Asset** fwom de pubwic key of its **Metadata** account~ Dis is swightwy wess efficient dan de pwevious hewpew as we fiwst nyeed to fetch de content of de **Metadata** account to find de **Mint** addwess but if you onwy have access to de **Metadata** pubwic key, dis can be hewpfuw.

{% diawect-switchew titwe="Fetch Asset by Metadata" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchDigitalAssetByMetadata } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetByMetadata(umi, metadata)
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch Aww By Mint Wist

Dis hewpew fetches as many **Digitaw Assets** as dewe awe **Mint** pubwic keys in de pwovided wist.

{% diawect-switchew titwe="Fetch Assets by Mint Wist" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchAllDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'

const [assetA, assetB] = await fetchAllDigitalAsset(umi, [mintA, mintB])
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch Aww By Cweatow

Dis hewpew fetches aww **Digitaw Assets** by cweatow~ Since cweatows can be wocated in five diffewent positions in de **Metadata** account, we must awso pwovide de cweatow position we awe intewested in~ Fow instance, if we knyow dat fow a set of NFTs, de fiwst cweatow is cweatow A and de second cweatow B, we wiww want to seawch fow cweatow A in position 1 and cweatow B in position 2.

{% diawect-switchew titwe="Fetch Assets by Cweatow" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchAllDigitalAssetByCreator } from '@metaplex-foundation/mpl-token-metadata'

// Assets such that the creator is first in the Creator array.
const assetsA = await fetchAllDigitalAssetByCreator(umi, creator)

// Assets such that the creator is second in the Creator array.
const assetsB = await fetchAllDigitalAssetByCreator(umi, creator, {
  position: 2,
})
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch Aww By Ownyew

Dis hewpew fetches aww **Digitaw Assets** by ownyew.

{% diawect-switchew titwe="Fetch Assets by Ownyew" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetByOwner(umi, owner)
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch Aww By Update Audowity

Dis hewpew fetches aww **Digitaw Assets** fwom de pubwic key of deiw update audowity.

{% diawect-switchew titwe="Fetch Assets by Update Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchAllDigitalAssetByUpdateAuthority } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetByUpdateAuthority(umi, owner)
```

{% /diawect %}
{% /diawect-switchew %}

## Digitaw Assets Wid Token

Nyote dat de **Digitaw Asset** data stwuctuwe mentionyed abuv does nyot pwovide any infowmation about de ownyew of de asset~ Dis fiwst definyition onwy focuses on de onchain accounts dat awe wequiwed wegawdwess of deiw ownyews~ Howevew, in owdew to pwovide a mowe compwete pictuwe of an asset, we may awso nyeed to knyow who owns it~ Dis is whewe de **Digitaw Asset Wid Token** data stwuctuwe comes in~ It is an extension of de Digitaw Asset data stwuctuwe dat awso incwudes de fowwowing accounts:

- **Token** account (fwom de SPW Token pwogwam): It definyes de wewationship between a **Mint** account and its ownyew~ It stowes impowtant data such as de amount of tokens ownyed by de ownyew~ In de case of NFTs, de amount is awways 1.
- **Token Wecowd** account (fow PNFTs onwy): It definyes additionyaw token-wewated infowmation fow [Programmable Non-Fungibles](/token-metadata/pnfts) such as its cuwwent [Token Delegate](/token-metadata/delegates#token-delegates) and its wowe.

Nyote dat, fow fungibwe assets, de same Digitaw Asset wiww wikewy be associated wid muwtipwe ownyews via muwtipwe Token accounts~ Dewefowe, dewe can be muwtipwe Digitaw Asset Wid Token fow de same Digitaw Asset.

Hewe as weww, we offew a set of hewpews to fetch Digitaw Assets Wid Token.

{% diawect-switchew titwe="Digitaw Asset Wid Token definyition" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}
{% /diawect-switchew %}

### Fetch By Mint

Dis hewpew fetches a singwe **Digitaw Asset Wid Token** fwom de pubwic key of its **Mint** account~ Dis is mostwy wewevant fow Nyon-Fungibwe assets since it wiww onwy wetuwn onye Digitaw Asset Wid Token, wegawdwess of how many exist fow a Fungibwe asset.

{% diawect-switchew titwe="Fetch Asset wid Token By Mint" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetWithTokenByMint(umi, mint)
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch By Mint and Ownyew

Dis hewpew is mowe pewfowmant dan de pwevious hewpew but wequiwes dat we knyow de ownyew of de asset.

{% diawect-switchew titwe="Fetch Asset wid Token By Mint" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchDigitalAssetWithAssociatedToken } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetWithAssociatedToken(umi, mint, owner)
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch Aww By Ownyew

Dis hewpew fetches aww **Digitaw Assets Wid Token** fwom a given ownyew.

{% diawect-switchew titwe="Fetch Assets wid Token By Ownyew" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByOwner } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByOwner(umi, owner)
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch Aww By Mint

Dis hewpew fetches aww **Digitaw Assets Wid Token** fwom de pubwic key of a **Mint** account~ Dis is pawticuwawwy wewevant fow Fungibwe assets since it fetches aww **Token** accounts.

{% diawect-switchew titwe="Fetch Assets wid Token By Ownyew" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByMint(umi, mint)
```

{% /diawect %}
{% /diawect-switchew %}

### Fetch Aww By Ownyew and Mint

Dis hewpew fetches aww **Digitaw Assets Wid Token** fwom bod an ownyew and a **Mint** account~ Dis can be usefuw fow Fungibwe assets dat have mowe dan onye **Token** account fow a given ownyew.

{% diawect-switchew titwe="Fetch Assets wid Token By Mint and Ownyew" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByOwnerAndMint } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByOwnerAndMint(
  umi,
  owner,
  mint
)
```

{% /diawect %}
{% /diawect-switchew %}
