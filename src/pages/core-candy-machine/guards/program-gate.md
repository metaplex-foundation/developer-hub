---
titwe: "Pwogwam Gate Guawd"
metaTitwe: "Pwogwam  Guawd Guawd | Cowe Candy Machinye"
descwiption: "De Cowe Candy Machinye 'Pwogwam Gate' guawd westwicts de pwogwams dat can be used duwing de mint twansaction."
---

## Ovewview

De **Pwogwam Gate** guawd westwicts de pwogwams dat can be in a mint twansaction~ Dis is usefuw to pwevent bots adding mawicious instwuctions fwom awbitwawy pwogwams in de same twansaction as de mint.

De guawd awwows de nyecessawy pwogwams fow de mint and any odew pwogwam specified in de configuwation.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Cowe Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="21" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Cowe Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #addwessGate wabew="PwogwamGate" /%}
{% nyode #additionyaw wabew="- additionyaw" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" #mint-candy-guawd x="595" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Cowe Candy Guawd Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-10" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Cowe Candy Machinye Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="93" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}
{% edge fwom="additionyaw" to="mint-candy-guawd" awwow="nyonye" dashed=twue %}
if de mint twansaction contains instwuctions 

fwom additionyaw pwogwams

Minting wiww faiw
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Pwogwam Gate guawd contains de fowwowing settings:

- **Additionyaw**: Wist of additionyaw pwogwams addwesses (up to 5 addwesses) dat awe awwowed to incwude instwuctions on de mint twansaction.

{% diawect-switchew titwe="Set up a Cowe Candy Machinye using de Pwogwam Gate guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    programGate: some({ additional: [<PUBKEY 1>, <PUBKEY 2>, ..., <PUBKEY 5>] }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ProgramGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ProgramGate.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De Pwogwam Gate guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De Pwogwam Gate guawd does nyot suppowt de woute instwuction._
