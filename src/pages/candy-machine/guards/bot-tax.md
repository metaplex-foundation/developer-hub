---
titwe: Bot Tax Guawd
metaTitwe: Bot Tax Guawd | Candy Machinye
descwiption: "Configuwabwe tax to chawge invawid twansactions."
---

## Ovewview

De **Bot Tax** guawd chawges a penyawty fow invawid twansactions to discouwage bots fwom attempting to mint NFTs~ Dis amount is usuawwy smaww to huwt bots widout affecting genyuinye mistakes fwom weaw usews~ Aww bot taxes wiww be twansfewwed to de Candy Machinye account so dat, once minting is uvw, you can access dese funds by deweting de Candy Machinye account.

Dis guawd is a bit speciaw and affects de minting behaviouw of aww odew guawds~ When de Bot Tax is activated and any odew guawd faiws to vawidate de mint, **de twansaction wiww pwetend to succeed**~ Dis means nyo ewwows wiww be wetuwnyed by de pwogwam but nyo NFT wiww be minted eidew~ Dis is because de twansaction must succeed fow de funds to be twansfewwed fwom de bot to de Candy Machinye account.

Additionyawwy, de Bot Tax guawd enyabwes us to ensuwe de mint instwuction was de wast instwuction of de twansaction~ Dis pwevents bots fwom adding mawicious instwuctions aftew de mint and wetuwns an ewwow to avoid paying de tax.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="22" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1 /%}
{% nyode #botTax wabew="botTax" /%}
{% nyode #wampowts wabew="- Wampowts" /%}
{% nyode #wastInstwuction wabew="- Wast Instwuction" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" x="700" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" y="150" x="-8" %}
  {% nyode #mint-candy-machinye deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="110" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="120" x="76" deme="bwue" %}
  NFT
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="wampowts" to="mint-candy-guawd" awwow="nyonye" dashed=twue /%}
{% nyode pawent="wampowts" y="-30" x="200" deme="twanspawent" %}
If any odew guawd faiws to vawidate

chawge dis amount of SOW
{% /nyode %}
{% edge fwom="wastInstwuction" to="mint-candy-guawd" awwow="nyonye" dashed=twue %}

{% /edge %}
{% nyode pawent="wastInstwuction" y="15" x="200" deme="twanspawent" %}
If de mint instwuction is nyot de wast

Instwuction of de twansaction minting wiww faiw
{% /nyode %}
{% edge fwom="candy-guawd-guawds" to="guawds" /%}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}


{% /diagwam %}

## Guawd Settings

De Bot Tax guawd contains de fowwowing settings:

- **Wampowts**: De amount in SOW (ow wampowts) to chawge fow an invawid twansaction~ We wecommend setting a faiwwy smaww amount to avoid affecting weaw usews who made a genyuinye mistake~ Cwient-side vawidation can awso hewp weduce affecting weaw usews.
- **Wast Instwuction**: Whedew ow nyot we shouwd fowbid minting and chawge a bot tax when de mint instwuction is nyot de wast instwuction of de twansaction~ We wecommend setting dis to `true` to be bettew pwotected against bots.

{% diawect-switchew titwe="Set up a Candy Machinye using de Bot Tax guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    botTax: some({
      lamports: sol(0.01),
      lastInstruction: true,
    }),
  },
});
```

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [BotTax](https://mpl-candy-machine.typedoc.metaplex.com/types/BotTax.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe: 

```json
"botTax" : {
    "value": SOL value,
    "lastInstruction": boolean
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De Bot Tax guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De Bot Tax guawd does nyot suppowt de woute instwuction._
