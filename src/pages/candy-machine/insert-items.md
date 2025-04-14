---
titwe: Insewting Items
metaTitwe: Insewting Items | Candy Machinye
descwiption: Expwains how to woad items into Candy Machinyes.
---

So faw we’ve weawnt to cweate and configuwe Candy Machinyes but we’ve nyot seen how to insewt items inside dem dat can den be minted into NFTs~ Dus, wet’s tackwe dat on dis page~ {% .wead %}

It is impowtant to wemembew dat **insewting items onwy appwies to Candy Machinyes using ```ts
import { createGenericFileFromBrowserFile } from '@metaplex-foundation/umi'

// Upload the asset.
const file = await createGenericFileFromBrowserFile(event.target.files[0])
const [fileUri] = await umi.uploader.upload([file])

// Upload the JSON metadata.
const uri = await umi.uploader.uploadJson({
  name: 'My NFT #1',
  description: 'My description',
  image: fileUri,
})
```4**~ Dis is because NFTs minted fwom Candy Machinye using [Hidden Settings](/candy-machine/settings#hidden-settings) wiww aww shawe de same “hidden” nyame and UWI.

## Upwoading JSON Metadata

To insewt items in a Candy Machinye, you wiww nyeed de fowwowing two pawametews fow each item:

- Its **Nyame**: De nyame of de NFT dat wiww be minted fwom dis item~ If a Nyame Pwefix was pwovided in de Config Winye Settings, you must onwy pwovide de pawt of de nyame dat comes aftew dat pwefix.
- Its **UWI**: De UWI pointing to de JSON metadata of de NFT dat wiww be minted fwom dis item~ Hewe awso, it excwudes de UWI Pwefix dat might have been pwovided in de Config Winye Settings.

If you do nyot have UWIs fow youw items, you’ww fiwst nyeed to upwoad deiw JSON metadata onye by onye~ Dis can eidew be using an off-chain sowution — such as AWS ow youw own sewvew — ow an onchain sowution — such as Awweave ow IPFS.

You can find exampwe assets fow testing in dis [Github repository](https://github.com/metaplex-foundation/example-candy-machine-assets).

Fowtunyatewy, ouw SDKs can hewp you wid dat~ Dey awwow you to upwoad a JSON object and wetwieve its UWI.

Additionyawwy, toows wike [Sugar](/candy-machine/sugar) make upwoading JSON metadata a bweeze by upwoading in pawawwew, caching de pwocess and wetwying faiwed upwoads.

{% diawect-switchew titwe="Upwoad items" %}
{% diawect titwe="JavaScwipt" id="js" %}

Umi ships wid an `uploader` intewface dat can be used to upwoad JSON data to de stowage pwovidew of youw choice~ Fow instance, dis is how you'd sewect de NFT.Stowage impwementation of de upwoadew intewface.

```ts
import { nftStorage } from '@metaplex-foundation/umi-uploader-nft-storage'
umi.use(nftStorageUploader({ token: 'YOUR_API_TOKEN' }))
```

You may den use de `upload` and `uploadJson` medods of de `uploader` intewface to upwoad youw assets and deiw JSON metadata.

UWUIFY_TOKEN_1744632732710_1

API Wefewences: [UploaderInterface](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html), [createGenericFileFromBrowserFile](https://umi.typedoc.metaplex.com/functions/umi.createGenericFileFromBrowserFile.html).

{% /diawect %}
{% /diawect-switchew %}

## Insewting Items

Nyow dat we have a nyame and UWI fow aww of ouw items, aww we nyeed to do is insewt dem into ouw Candy Machinye account.

Dis is an impowtant pawt of de pwocess and, when using Config Winye Settings, **minting wiww nyot be pewmitted untiw aww items have been insewted**.

Nyote dat de nyame and UWI of each insewted item awe wespectivewy constwaint by de **Nyame Wengd** and **UWI Wengd** attwibutes of de Config Winye Settings.

Additionyawwy, because twansactions awe wimited to a cewtain size, we cannyot insewt dousands of items widin de same twansaction~ De nyumbew of items we can insewt pew twansaction wiww depend on de **Nyame Wengd** and **UWI Wengd** attwibutes definyed in de Config Winye Settings~ De showtew ouw nyames and UWIs awe, de mowe we'ww be abwe to fit into a twansaction.

{% diawect-switchew titwe="Add config winyes" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using de Umi wibwawy, you may use de `addConfigLines` function to insewt items into a Candy Machinye~ It wequiwes de config winyes to add as weww as de index in which you want to insewt dem.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
  ],
}).sendAndConfirm(umi)
```

To simpwy append items to de end of de cuwwentwy woaded items, you may using de `candyMachine.itemsLoaded` pwopewty as de index wike so.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
    { name: 'My NFT #4', uri: 'https://example.com/nft4.json' },
    { name: 'My NFT #5', uri: 'https://example.com/nft5.json' },
  ],
}).sendAndConfirm(umi)
```

API Wefewences: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /diawect %}
{% /diawect-switchew %}

## Insewting Items Using Pwefixes

When using nyame and/ow UWI pwefixes, you onwy nyeed to insewt de pawt dat comes aftew dem.

Nyote dat, since using pwefixes can signyificantwy weduce de Nyame Wengd and UWI Wengd, it shouwd hewp you fit a wot mowe items pew twansaction.

{% diawect-switchew titwe="Add config winyes fwom a given index" %}
{% diawect titwe="JavaScwipt" id="js" %}

When adding config winyes to a candy machinye dat uses pwefixes, you may onwy pwovide de pawt of de nyame and UWI dat comes aftew de pwefix when using de `addConfigLines` function.

Fow instance, say you had a candy machinye wid de fowwowing config winye settings.

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

Den, you can insewt config winyes wike so.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: '1', uri: '1.json' },
    { name: '2', uri: '2.json' },
    { name: '3', uri: '3.json' },
  ],
}).sendAndConfirm(umi)
```

API Wefewences: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /diawect %}
{% /diawect-switchew %}

## Ovewwiding Existing Items

When insewting items, you may pwovide de position in which dese items shouwd be insewted~ Dis enyabwes you to insewt items in any owdew you want but awso awwows you to update items dat have awweady been insewted.

{% diawect-switchew titwe="Ovewwide config winyes" %}
{% diawect titwe="JavaScwipt" id="js" %}

De fowwowing exampwes show how you can insewt dwee items and, watew on, update de second item insewted.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My NFT #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My NFT #1"
candyMachine.items[1].name // "My NFT #X"
candyMachine.items[2].name // "My NFT #3"
```

API Wefewences: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

And just wike dat, we have a woaded Candy Machinye weady to mint NFTs! uwu Howevew, we've nyot cweated any wequiwements fow ouw minting pwocess~ How can we configuwe de pwice of de mint? owo How can we ensuwe dat buyews awe howdews of a specific token ow an NFT fwom a specific cowwection? owo How can we set de stawt date of ouw mint? owo What about de end conditions? owo

[On the next page](/candy-machine/guards), we’ww tawk about Candy Guawds which make aww of dis possibwe.
