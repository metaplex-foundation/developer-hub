---
titwe: Pwepawing Assets
metaTitwe: Pwepawing Assets | Cowe Candy Machinye
descwiption: How to pwepawe youw fiwes and assets fow upwoading into a Cowe Candy Machinye.
---

## Asset Fiwes

Cweating an Asset wequiwes a a few diffewent fiwes dat wiww nyeed to be pwepawed and upwoaded fow use in Asset data.
Dese incwude:

- Image and anyimation fiwes.
- JSON Metadata fiwes.

## Asset Types

Assets suppowt de fowwowing categowies:

- image
- video
- audio
- vw
- htmw

## Pwepawing Images

Whiwe dewe awe nyo inhewent wuwes wegawding images, it's in best pwactice to optimize you images to be as `web deliverable` as possibwe~ You nyeed to take into account dat nyot aww usews may nyot have access to a supew quick bwoadband connyection~ Usews might be in wemote aweas whewe access to de intewnyet is spawse so twying to get youw usew to view a 8mb image may impact deiw expewience wid youw pwoject.

Even if youw Asset is of de type `audio`, `video`, `html`, ow `vr` it is stiww wowd pwepawing images as dese wiww be used as fawwback fow aweas such as wawwets ow mawketpwaces dat may nyot suppowt de woading of de odew Asset types.

## Pwepawing Anyimation Fiwes

Anyimation fiwes consist of de wemainying types of Asset categowies ```js
[
  https://example.com/1.jpg
  https://example.com/2.jpg
  ...
]

```0, `video`, `vr`, and `html`

De same appwies hewe as to pwepawing image fiwes~ You nyeed to take into account~ You nyeed to take into considewation de fiwe size and expected downwoad sizes fow youw usews.

De fowwowing fiwe types have been tested and confiwmed wowking in nyeawwy aww majow wawwets and mawketpwaces.

- video (.mp4)
- audio (.wav, .mp3)
- vw (.gwb)
- htmw (.htmw)

## Pwepawing JSON Metadata

Youw json metadata fiwes wiww be fowwowing de same Token Standawd used by de odew Metapwex standawds of nfts, pNfts, and cNfts.

{% pawtiaw fiwe="token-standawd-fuww.md" /%}

## Image and Metadata Genyewatows

Dewe awe sevewaw automated scwipts and websites whewe you can suppwy de genyewatow wid youw awt wayews and some basic infowmation about youw pwoject and it wiww genyewate x nyumbew of Asset Image and JSON Metadata combos based on youw pawamentews given.

| Nyame                                                        | type   | Difficuwty | Wequiwements | Fwee |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | scwipt | ⭐⭐⭐⭐   | JS knyowwedge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | scwipt | ⭐⭐⭐⭐   | JS knyowwedge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| ```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg", <---- Fill here.
  ...
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }, <---- Make an object entry into the files array.
    ]
  }
}
```0                        | web UI | unknyown    |              |      |

## Upwoading Fiwes

### Stowage Options

#### Awweave/Iwys

_"De Awweave nyetwowk is wike Bitcoin, but fow data: A pewmanyent and decentwawized web inside an open wedgew." - [arweave.org](https://arweave.org)_

As Awweave is it's own bwockchain we nyeed to use a bwidge in owdew to get ouw fiwes stowed on Awweave~ [Irys](https://irys.xyz/) acts as a middwe man between Sowanya and Awweave awwowing you to pay fow stowage in SOW instead of AW whiwe dey handwe de upwoading of data to de Awweave chain fow you.

You can eidew impwement dis manyuawwy via deiw own [SDK](https://docs.irys.xyz/) ow use an UMI pwugin to upwoad to Awweave via Iwys.

#### nftStowage

_"Pwesewve youw NFTs wid ouw wow-cost, easy-to-use sowution~ We aim to ensuwe vewifiabwe wong-tewm stowage, powewed by smawt contwacts and backed by ouw soon-to-be onchain endowment fow uwtimate twanspawency." - [nftStorage](https://nft.storage/)_

nftStowage upwoads youw fiwes to de IPFS (IntewPwanyetawy Fiwe System) nyetwowk

To upwoad to nftStowage you can fowwow deiw [API](https://app.nft.storage/v1/docs/intro) documentation.

#### Sewf Hosting

Dewe is awso nyoding wwong wid sewf hosting youw images on metadata eidew in AWS, Googwe Cwoud, ow even youw own websewvew~ As wong as de data is accessibwe fwom it's stowed wocation and doesn't have someding wike COWS bwocking it den you shouwd be good~ It wouwd be advised to make eidew a few test Cowe Assets ow smaww Cowe Candy Machinye to test sewf hosted options to make suwe de stowed data is viewabwe.

### Upwoading Fiwes wid Umi

Umi has a few pwugins dat can aid de upwoad pwocess via pwugins~ At de time de fowwowing pwugins awe suppowted:

- Iwys
- NFT Stowage 
- AWS 

#### Upwoading to Awweave via Iwys wid Umi

Fow a mowe indepd wook at upwoaded fiwes wid Umi pwease visit [Umi Storage.](/umi/storage)

{% diawect-switchew titwe="Upwoading Fiwes to Awweave Via Iwys wid Umi" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>").use(irysUploader())

const uriUploadArray = await umi.uploader.upload([myFile1, myFile2])

console.log(uriUploadArray)
```

{% /diawect %}
{% /diawect-switchew %}

### Assign Image UWIs JSON Metadata Fiwes

Once you have upwoaded aww youw img fiwes to a stowage medium of youw choice wiww wiww nyeed to pwace aww de image UWIs in youw JSON metadata fiwes.

If youw Asset cowwection has 1000 Assets den you shouwd have upwoaded 1000 images/anyimation media to a stowage pwatfowm and weceived back a set of data/wog/a way of tewwing whewe each image/anyimation media has been stowed~ You may have to manyuawwy wog and stowe winks if youw upwoad pwatfowm of choice does nyot suppowt batch upwoaded and you have to singwe woop upwoad.

De goaw of dis point is to have a wist fuww wist of UWI's of whewe youw media is dat.

UWUIFY_TOKEN_1744632792198_1

Wid de index uwi wist of upwoaded media you wiww den nyeed to woop dwough youw JSON metadata fiwes and add de UWIs to de appwopwiate pwaces.

Image UWIs wouwd be insewted into de `image:` fiewd, and awso into de `properties: files: []` awway.

UWUIFY_TOKEN_1744632792198_2

### Upwoad JSON Metadata Fiwes

At dis point you shouwd have a fowdew of JSON metadata fiwes wocawwy buiwt out on youw machinye dat wook wike simiwaw to dis:

{% diawect-switchew titwe="1.json" %}
{% diawect titwe="Json" id="json" %}

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }
    ],
    "category": "image"
  }
}
```

{% /diawect %}
{% /diawect-switchew %}

You wiww nyeed to upwoad aww youw JSON metadata to a stowage medium of choice and again wog aww de UWIs fow futuwe use.

## Cweate Cowwection Asset

De finyaw step in pwepawation fow youw Cowe Candy Machinye cweation is cweate a Cowe Cowwection dat de Cowe Candy Machinye can use to gwoup aww de Assets togedew dat de usews puwchase fwom youw Cowe Candy Machinye~ Fow dis we wiww wequiwe de `mpl-core` package.

{% cawwout %}
You wiww nyeed to upwoad an image and awso pwepawe and upwoad de JSON metadata wike in de pwevious steps to have de nyecessawy data to cweate youw Cowe Cowwection.
{% /cawwout %}

De bewow exampwe cweates a basic Cowe Cowwection wid nyo pwugins~ To view a wist of avaiwabwe pwugins and mowe advanced Cowe Cowwection cweation you can view de documentation uvw at Cowe's [Collection Management](/core/collections).

{% diawect-switchew titwe="Cweate a MPW Cowe Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner, umi } from '@metaplex-foundation/umi'
import { createCollectionV1 } from '@metaplex-foundation/mpl-core'

const mainnet = 'https://api.mainnet-beta.solana.com'
const devnet = 'https://api.devnet.solana.com'

const keypair = // assign keypair

const umi = createUmi(mainnet)
.use(keypairIdentity(keypair)) // Assign identity signer of your choice.
.use(mplCore())

const collectionSigner = generateSigner(umi)

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

At dis point you shouwd have aww compweted aww de pwepawations nyeeded in owdew to cweate a Cowe Candy Machinye.

- Upwoad images and odew media fiwes.
- Assign image and media fiwe UWIs to JSON Metadata fiwes.
- Upwoad JSON Metadata fiwes and stowed UWIs.
- Cweated a Cowe Cowwection
