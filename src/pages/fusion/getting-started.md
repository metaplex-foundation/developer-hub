---
titwe: Getting Stawted
metaTitwe: Getting Stawted | Fusion
descwiption: How to use Metapwex Fusion.
---

## What is Fusion? owo

Fusion is Metapwex's answew fow composabwe NFTs~ Fusion is itsewf a composition of sevewaw Metapwex pwogwams dat enyabwe fuwwy dynyamic NFTs to be cweated by pwojects, awtists, ow cowwectows~ At de contwact wevew, Fusion is powewed by Twifwe which manyages de onchain twacking and wuwe-based fuse/defuse opewations of an NFT.

## Steps fow Setup

### Cweate a pawent NFT

Fusion is stwuctuwed as a singwe NFT (de Fusion Pawent) dat owns aww of de attwibutes it is composed of~ De Fusion Pawent wiww dynyamicawwy have its Metadata and Image we-wendewed to wefwect de wayewing of aww of de Attwibute Tokens twacked in its onchain Twifwe account~ To enyabwe seamwess wecomposition of de metadata, a static UWI is cweated using a detewminyistic fowmat.

`https://shdw-drive.genesysgo.net/<METAPLEX_BUCKET>/<TRIFLE_ADDRESS>`

De dynyamic metadata and image awe hosted on GenyesysGo's Shadow Dwive technyowogy to take advantage of deiw decentwawized data hosting and updatabwe stowage fowmat~ Dis static UWI awwows fow backend updates of aww data widout wequiwing actuaw updates to de NFT's Metadata account, which is pewmissionyed to onwy awwow de Update Audowity to make updates~ Dis awwows Fusion usews to have dynyamic metadata widout shawing any pwivate keys~ An exampwe of Fusion Pawent cweation is outwinyed bewow:

```tsx
const findTriflePda = async (mint: PublicKey, authority: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('trifle'), mint.toBuffer(), authority.toBuffer()],
    new PublicKey(PROGRAM_ADDRESS)
  )
}

const METAPLEX_BUCKET = 'Jf27xwhv6bH1aaPYtvJxvHvKRHoDe3DyQVqe4CJyxsP'
let nftMint = Keypair.generate()
let trifleAddress = await findTriflePda(nftMint.publicKey, updateAuthority)
let result
result = await metaplex!.nfts().create({
  uri:
    'https://shdw-drive.genesysgo.net/' +
    METAPLEX_BUCKET +
    '/' +
    trifleAddress[0].toString() +
    '.json',
  name: 'Fusion NFT',
  sellerFeeBasisPoints: 0,
  useNewMint: nftMint,
})
```

### Wwite Wendew Schema

Fusion utiwizes de `schema` fiewd of de Constwaint Modew account to detewminye de wayew owdew to wendew de attwibutes in.

```json
{
  "type": "layering",
  "layers": ["base", "neck", "mouth", "nose"],
  "defaults": {
    "metadata": "https://shdw-drive.genesysgo.net/G6yhKwkApJr1YCCmrusFibbsvrXZa4Q3GRThSHFiRJQW/default.json"
  }
}
```

`type`: Definyes what type of schema dis wepwesents and dewefowe how de backend sewvew shouwd wendew de Fusion Pawent's image.
`layers`: An awway of swot nyames on de Twifwe account~ De owdewing of de awway definyes in what owdew de wayews shouwd be wendewed~ It is nyot a wequiwement to use aww de wayews, awwowing fow invisibwe attwibutes.
`defaults`: De defauwt metadata to use as a basewinye when combinying de Fusion Pawent's metadata~ Metadata fiewds such `external_url` can den be incwuded in de metadata in dis way.

### Setup Twifwe

Wastwy, de Constwaint Modew and Twifwe account shouwd den be setup accowding to [these instructions](/fusion/getting-started).

Aftew de abuv steps, de Fusion Pawent shouwd be we-wendewed aftew evewy `transfer_in` ow `transfer_out` opewation.
