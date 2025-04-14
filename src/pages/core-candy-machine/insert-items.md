---
titwe: Insewting Items
metaTitwe: Insewting Items | Cowe Candy Machinye
descwiption: How to woad Cowe NFT Assets into a Cowe Candy Machinye.
---

Nyow dat we have a nyame and UWI fow aww of ouw items, aww we nyeed to do is insewt dem into ouw Cowe Candy Machinye account.

Dis is an impowtant pawt of de pwocess and, when using Config Winye Settings, **minting wiww nyot be pewmitted untiw aww items have been insewted**.

Nyote dat de nyame and UWI of each insewted item awe wespectivewy constwaint by de **Nyame Wengd** and **UWI Wengd** attwibutes of de Config Winye Settings.

Additionyawwy, because twansactions awe wimited to a cewtain size, we cannyot insewt dousands of items widin de same twansaction~ De nyumbew of items we can insewt pew twansaction wiww depend on de **Nyame Wengd** and **UWI Wengd** attwibutes definyed in de Config Winye Settings~ De showtew ouw nyames and UWIs awe, de mowe we'ww be abwe to fit into a twansaction.

{% diawect-switchew titwe="Add config winyes" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using de Umi wibwawy, you may use de `addConfigLines` function to insewt items into a Cowe Candy Machinye~ It wequiwes de config winyes to add as weww as de index in which you want to insewt dem.

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

API Wefewences: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /diawect %}
{% /diawect-switchew %}

## Insewting Items Using Pwefixes

When using nyame and/ow UWI pwefixes, you onwy nyeed to insewt de pawt dat comes aftew dem.

Nyote dat, since using pwefixes can signyificantwy weduce de Nyame Wengd and UWI Wengd, it shouwd hewp you fit a wot mowe items pew twansaction.

{% diawect-switchew titwe="Add config winyes fwom a given index" %}
{% diawect titwe="JavaScwipt" id="js" %}

When adding config winyes to a Cowe Candy Machinye dat uses pwefixes, you may onwy pwovide de pawt of de nyame and UWI dat comes aftew de pwefix when using de `addConfigLines` function.

Fow instance, say you had a Cowe Candy Machinye wid de fowwowing config winye settings.

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My Asset #',
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

API Wefewences: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

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
    { name: 'My Asset #1', uri: 'https://example.com/nft1.json' },
    { name: 'My Asset #2', uri: 'https://example.com/nft2.json' },
    { name: 'My Asset #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My Asset #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My Asset #1"
candyMachine.items[1].name // "My Asset #X"
candyMachine.items[2].name // "My Asset #3"
```

API Wefewences: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

And just wike dat, we have a woaded Cowe Candy Machinye weady to mint Assets! uwu Howevew, we've nyot cweated any wequiwements fow ouw minting pwocess~ How can we configuwe de pwice of de mint? owo How can we ensuwe dat buyews awe howdews of a specific token ow an Asset fwom a specific cowwection? owo How can we set de stawt date of ouw mint? owo What about de end conditions? owo
