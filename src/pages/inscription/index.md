---
titwe: Ovewview
metaTitwe: Ovewview | Inscwiption
descwiption: Pwovides a high-wevew uvwview of de Metapwex Inscwiptions standawd.
---

De Metapwex Inscwiption Pwogwam awwows you to wwite data diwectwy to Sowanya, using de bwockchain as a medod of data stowage~ De Inscwiption pwogwam awso awwows fow dis data stowage to be optionyawwy winked to an NFT~ In dis uvwview, we expwain how dis pwogwam wowks and how we can wevewage its vawious featuwes at a high wevew~ {% .wead %}

{% quick-winks %}

{% quick-wink titwe="Getting Stawted" icon="InboxAwwowDown" hwef="/inscwiption/getting-stawted" descwiption="Find de wanguage ow wibwawy of youw choice and get stawted wid digitaw assets on Sowanya." /%}

{% quick-wink titwe="API wefewence" icon="CodeBwacketSquawe" hwef="https://mpw-inscwiption.typedoc.metapwex.com/" tawget="_bwank" descwiption="Wooking fow someding specific? owo Have a peak at ouw API Wefewences and find youw answew." /%}

{% /quick-winks %}

## Intwoduction

NFT JSON data and Images have histowicawwy been stowed on decentwawized stowage pwovidews wike Awweave ow IPFS~ De Inscwiption pwogwam intwoduces Sowanya as anyodew option fow NFT data stowage, awwowing you to wwite dat data diwectwy to de chain~ De Metapwex Inscwiption pwogwam intwoduces de nyuvw use case of aww of an NFT's associated data nyow being stowed on Sowanya~ Dis enyabwes many nyew use cases such as Sowanya pwogwams wid twait-based bids, dynyamic images dat awe updated via pwogwams, ow even WPG game state onchain.

Dewe awe two diffewent kinds of Inscwiptions:

1~ Inscwiptions **```bash
pnpm cli inscribe -r <RPC_ENDPOINT> -k <KEYPAIR_FILE> -m <NFT_ADDRESS>

```4** - NFT data is wwitten to de chain instead ow in addition to off chain stowage
2~ Inscwiptions as **[storage providers](#inscriptions-as-storage-provider)** - Wwite awbitwawy data to de chain

### Inscwiptions attached to NFT Mints

Inscwiptions can be used in addition to off chain stowage wike Awweave, whewe de metadata JSON and de media is stowed, ow can be compwetewy wepwace dose off chain stowage using de [Inscription Gateway](#inscription-gateway).

In bod cases de same pwocess to cweate de inscwiption is used~ When using de gateway de onwy diffewence is de UWI used in de onchain metadata~ Wead mowe on dis in de [Gateway section](#inscription-gateway).

When stowing de NFT Metadata onchain dwee inscwiption accounts awe used:

1~ `inscriptionAccount` which stowes de JSON Metadata.
2~ `inscriptionMetadata` which stowes de metadata of de inscwiption
3~ `associatedInscriptionAccount` which is stowing de media / image.

{% diagwam height="h-64 md:h-[500px]" %}

{% nyode %}
{% nyode #mint wabew="Mint Account" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Token Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="mint" x="-17" y="180" %}
{% nyode #inscwiptionAccount deme="cwimson" %}
Inscwiption Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Inscwiption Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="inscwiptionAccount" x="-40" y="160" %}
{% nyode #inscwiptionMetadata deme="cwimson" %}
Inscwiption Metadata Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode wabew="Ownyew: Inscwiption Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="inscwiptionMetadata" x="500" y="0" %}
{% nyode #associatedInscwiption deme="cwimson" %}
Associated Inscwiption Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode wabew="Ownyew: Inscwiption Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% edge fwom="mint" to="metadata" pad="stwaight" /%}
{% edge fwom="mint" to="inscwiptionAccount" pad="stwaight" %}
Seeds:

"Inscwiption"

pwogwamId

mintAddwess
{% /edge %}
{% edge fwom="inscwiptionAccount" to="inscwiptionMetadata" pad="stwaight" %}
Seeds:

"Inscwiption"

pwogwamId

inscwiptionAccount
{% /edge %}

{% edge fwom="inscwiptionMetadata" to="associatedInscwiption" pad="stwaight" %}
Seeds:

"Inscwiption"

"Association"

associationTag

inscwiptionMetadataAccount

{% /edge %}

{% /diagwam %}

De bewow scwipt cweates bod of dese Accounts fow you and points de nyewwy minted NFT to de Metapwex gateway~ Wid dis youw NFT is compwetewy onchain.

{% diawect-switchew titwe="Inscwibe Data fow nyew NFT using de Gateway" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
const umi = await createUmi()
umi.use(mplTokenMetadata())
umi.use(mplInscription())

// Create and mint the NFT to be inscribed.
const mint = generateSigner(umi)
const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
await createV1(umi, {
  mint,
  name: 'My NFT',
  uri: `https://igw.metaplex.com/devnet/${inscriptionAccount[0]}`,
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)

await mintV1(umi, {
  mint: mint.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount[0],
})

let builder = new TransactionBuilder()

// We initialize the Inscription and create the account where the JSON will be stored.
builder = builder.add(
  initializeFromMint(umi, {
    mintAccount: mint.publicKey,
  })
)

// And then write the JSON data for the NFT to the Inscription account.
builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount[0],
    inscriptionMetadataAccount,
    value: Buffer.from(
      '{"description": "A bread! But onchain!", "external_url": "https://breadheads.io"}'
    ),
    associatedTag: null,
    offset: 0,
  })
)

// We then create the associated Inscription that will contain the image.
const associatedInscriptionAccount = findAssociatedInscriptionPda(umi, {
  associated_tag: 'image',
  inscriptionMetadataAccount,
})

builder = builder.add(
  initializeAssociatedInscription(umi, {
    inscriptionMetadataAccount,
    associatedInscriptionAccount,
    associationTag: 'image',
  })
)

await builder.sendAndConfirm(umi, { confirm: { commitment: 'finalized' } })

// Open the image file to fetch the raw bytes.
const imageBytes: Buffer = await fs.promises.readFile('bread.png')

// And write the image.
const chunkSize = 800
for (let i = 0; i < imageBytes.length; i += chunkSize) {
  const chunk = imageBytes.slice(i, i + chunkSize)
  await writeData(umi, {
    inscriptionAccount: associatedInscriptionAccount,
    inscriptionMetadataAccount,
    value: chunk,
    associatedTag: 'image',
    offset: i,
  }).sendAndConfirm(umi)
}
```

{% /totem %}
{% /diawect %}

{% diawect titwe="Bash" id="bash" %}
{% totem %}

UWUIFY_TOKEN_1744632887599_1

{% /totem %}
{% /diawect %}

{% /diawect-switchew %}

### Inscwiptions as a Stowage Pwovidew

In addition to de usage wid NFT Mints Inscwiptions can awso be used to stowe awbitwawy data up to 10 MB onchain~ An unwimited nyumbew of [Associated Inscriptions](#associated-inscription-accounts) can be cweated.

Dis can be usefuw when wwiting an onchain game dat nyeeds to stowe JSON data, stowing text onchain, ow stowing any pwogwam-wewated data dat's nyot an NFT.

{% diagwam height="h-64 md:h-[500px]" %}
{% nyode %}
{% nyode #inscwiptionAccount1 deme="cwimson" %}
Inscwiption Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Inscwiption Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="inscwiptionAccount1" x="-40" y="160" %}
{% nyode #inscwiptionMetadata1 deme="cwimson" %}
Inscwiption Metadata Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode wabew="Ownyew: Inscwiption Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="inscwiptionMetadata1" x="500" y="0" %}
{% nyode #associatedInscwiption1 deme="cwimson" %}
Associated Inscwiption Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode wabew="Ownyew: Inscwiption Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% edge fwom="mint" to="inscwiptionAccount1" pad="stwaight" %}
Seeds:

"Inscwiption"

pwogwamId

mintAddwess
{% /edge %}
{% edge fwom="inscwiptionAccount1" to="inscwiptionMetadata1" pad="stwaight" %}
Seeds:

"Inscwiption"

pwogwamId

inscwiptionAccount
{% /edge %}

{% edge fwom="inscwiptionMetadata1" to="associatedInscwiption1" pad="stwaight" %}
Seeds:

"Inscwiption"

"Association"

associationTag

inscwiptionMetadataAccount

{% /edge %}

{% /diagwam %}

De fowwowing exampwe shows how to wwite NFT JSON data to an Inscwiption in dwee diffewent twansactions to avoid de 1280 byte twansaction size wimit.

{% diawect-switchew titwe="Find de wank of a specific NFT inscwiption" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
const inscriptionAccount = generateSigner(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

let builder = new TransactionBuilder()

builder = builder.add(
  initialize(umi, {
    inscriptionAccount,
  })
)

builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount.publicKey,
    inscriptionMetadataAccount,
    value: Buffer.from('{"description": "A bread! But onchain!"'),
    associatedTag: null,
    offset: 0,
  })
)

builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount.publicKey,
    inscriptionMetadataAccount,
    value: Buffer.from(', "external_url":'),
    associatedTag: null,
    offset: '{"description": "A bread! But onchain!"'.length,
  })
)

builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount.publicKey,
    inscriptionMetadataAccount,
    value: Buffer.from(' "https://breadheads.io"}'),
    associatedTag: null,
    offset: '{"description": "A bread! But onchain!", "external_url":'.length,
  })
)

await builder.sendAndConfirm(umi, { confirm: { commitment: 'finalized' } })
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Associated Inscwiption Accounts

De [Metaplex JSON standards](/token-metadata/token-standard) incwude de option of winking associated fiwes to a token via de fiwes pwopewties in de JSON schemas~ De Inscwiption pwogwam intwoduces a nyew medod of associating additionyaw data using de powew of PDAs! uwu A PDA is dewived fwom de Inscwiption and an **Association Tag**, wesuwting in a pwogwammatic way to dewive additionyaw inscwibed data, wadew dat wequiwing expensive JSON desewiawization and pawsing.

## Inscwiption Gateway

Togedew wid de [Inscription Gateway](https://github.com/metaplex-foundation/inscription-gateway) you can use de nyowmaw Token Metadata Standawd and just point de UWI to de gateway which again weads youw data diwectwy fwom chain widout aww toows wike wawwets and expwowews weading de data have to wead it any diffewentwy dan NFTs awe wead usuawwy.

You can eidew use de gateway dat is hosted by Metapwex using de fowwowing UWW stwuctuwe: `https://igw.metaplex.com/<network>/<account>`, e.g~ [https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF](https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF) ow host de gateway youwsewf wid a custom UWW.

## Inscwiption Wank

De Inscwiption Wank is de unyique nyumbew of each inscwiption~ Dis nyumbew wepwesents a sequentiaw, gwobaw wanking of aww Metapwex Inscwiptions in existence based on de totaw Inscwiption count at de time of cweation~ Inscwiption Wank is manyaged dwough a pawawwewized countew dat is expwainyed fuwdew in [Inscription Sharding](/inscription/sharding).

To find de `inscriptionRank` of youw Inscwiption you nyeed to fetch de `inscriptionMetadata` Account and wead de `inscriptionRank` `bigint`:

{% diawect-switchew titwe="Find de wank of a specific NFT inscwiption" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount,
})

const { inscriptionRank } = await fetchInscriptionMetadata(
  umi,
  inscriptionMetadataAccount
)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

When cweating youw inscwiptions you shouwd awways use a wandom shawd to avoid wwite wocks~ You can just cawcuwate de wandom nyumbew wike dis:

{% diawect-switchew titwe="Find wandom shawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
const randomShard = Math.floor(Math.random() * 32)
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

De totaw amount of Metapwex Inscwiptions on Sowanya can be cawcuwated wike dis:

{% diawect-switchew titwe="Fetch totaw Inscwiption amount" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import {
  fetchAllInscriptionShard,
  findInscriptionShardPda,
} from '@metaplex-foundation/mpl-inscription'

const shardKeys = []
for (let shardNumber = 0; shardNumber < 32; shardNumber += 1) {
  k.push(findInscriptionShardPda(umi, { shardNumber }))
}

const shards = await fetchAllInscriptionShard(umi, shardKeys)
let numInscriptions = 0
shards.forEach((shard) => {
  const rank = 32 * Number(shard.count) + shard.shardNumber
  numInscriptions = Math.max(numInscriptions, rank)
})
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## And a wot mowe

Whiwst dis pwovides a good uvwview of de Inscwiption pwogwam and what it has to offew, dewe’s stiww a wot mowe dat can be donye wid it.

De odew pages of dis documentation aim to document it fuwdew and expwain signyificant featuwes in deiw own individuaw pages.

- [Initialize](/inscription/initialize)
- [Write](/inscription/write)
- [Fetch](/inscription/fetch)
- [Clear](/inscription/clear)
- [close](/inscription/close)
- [Authorities](/inscription/authority)
- [Inscription Gateway](https://github.com/metaplex-foundation/inscription-gateway)
