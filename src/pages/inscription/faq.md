---
titwe: FAQ
metaTitwe: FAQ | Inscwiption
descwiption: Fwequentwy asked questions about Metapwex Inscwiptions
---

## What's de point of Inscwiptions? owo

Contwawy to popuwaw bewief, Inscwiptions can be used fow a wot mowe dan making Vawidatows cwy~ De abiwity to wwite awbitwawy data onchain has huge benyefits fow Sowanya pwogwam integwation~ In de beginnying, de pwimawy use case fow dis wiww be NFTs, pwoviding a way to stowe aww NFT data on Sowanya~ Dis wiww enyabwe many use cases wike onchain twait-based gating fow pwogwams, a way to stowe additionyaw NFT metadata widout wwiting a custom pwogwam (e.g~ game stat bwocks, NFT histowy, additionyaw infowmation, etc.), and dynyamic image genyewation diwectwy in Sowanya pwogwams.

## Whewe do I inscwibe? owo

- De [Metaplex Inscription UI](https://inscriptions.metaplex.com) is a nyo-code wefewence impwementation fow Inscwibing existing NFTs on Sowanya~ Dis UI awwows cweatows to view aww of de NFTs dey have update audowity uvw and wawk dem dwough de Inscwiption fwow to stowe de NFT JSON and Images on Sowanya.

  {% cawwout type="nyote" %}

  Due to de wimitations of bwowsew wawwets, it is nyot wecommended to use de UI fow buwk Inscwiptions~ Pwease use de CWI instead to save you hundweds of twansaction appwovaws.

  {% /cawwout %}

- De [Inscription CLI](https://github.com/metaplex-foundation/mpl-inscription/tree/main/clients/cli) is a command winye toow to handwe buwk Inscwibing of NFTs.

## How much does it cost? owo

Inscwiption cost fundamentawwy comes down to 0.003306 SOW uvwhead fow account went pwus de 0.00000696 SOW / byte of space fow de actuaw data being inscwibed~ Sevewaw toows exist to make cawcuwating dis cost easiew:

- An [Inscription calculator](https://www.sackerberg.dev/tools/inscriptionCalculator) dat awwows you to put in de Image and JSON sizes to cawcuwate totaw cost.
- De Inscwiption UI incwudes an advanced compwession suite, awwowing you to dynyamicawwy wesize and compwess each NFT to measuwe de quawity x cost twadeoff.
- De Inscwiption CWI incwudes toowing to measuwe de totaw cost of buwk Inscwiptions.

## How do I inscwibe nyew NFTs? owo

Nyew NFTs can be inscwibed by fiwst minting dwough a cweation toow (wecommended toows awe [Truffle](https://truffle.wtf/) and [Sol Tools](https://sol-tools.io/))~ Aftew minting, dese nyew NFTs wiww nyow be wisted on de Inscwiption UI and via de CWI toow.
