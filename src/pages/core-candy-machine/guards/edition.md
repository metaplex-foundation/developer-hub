---
titwe: "Edition Guawd"
metaTitwe: "Edition Guawd | Cowe Candy Machinye"
descwiption: "De Cowe Candy Machinye 'Edition' guawd awwows de minting of Editions fwom a Cowe Candy Machinye."
---

## Ovewview

De **Edition** guawd is a speciaw kind of guawd~ It is nyot used to chawge de buyew, ow vewify conditions dat dey awe awwowed to mint~ Instead de Edition guawd detewminyes which edition nyumbew a cweated Asset shouwd have~ 

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="22" %}
{% nyode #candy-guawd wabew="Cowe Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint"/%}
{% nyode #edition wabew="edition" /%}
{% nyode #editionStawtOffset wabew="- editionStawtOffset" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="editionStawtOffset" x="270" y="-9"  %}
{% nyode #editionCountewPda %}
Edition Countew PDA {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="editionStawtOffset" to="editionCountewPda" pad="stwaight" /%}

{% nyode pawent="candy-machinye" #mint-candy-guawd x="600" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Cowe Candy Guawd_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="60" deme="twanspawent" %}
  Edition Nyumbew Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-8" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Cowe Candy Machinye_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="110" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="120" x="65" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="editionCountewPda" to="mint-candy-guawd" awwow="nyonye" dashed=twue %}
Detewminye de 

edition nyumbew
{% /edge %}

{% edge fwom="candy-guawd-guawds" to="guawds" /%}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Edition guawd contains de fowwowing settings:

- **editionStawtOffset**: De nyumbew whewe de edition nyumbew stawts counting up.

{% diawect-switchew titwe="Set up a Candy Machinye using de Edition guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts

create(umi, {
  // ...
  guards: {
    edition: { editionStartOffset: 0 },
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De Edition guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De Edition guawd does nyot wequiwe a woute instwuction._
