---
titwe: Addwess Gate Guawd
metaTitwe: Addwess Gate Guawd | Cowe Candy Machinye
descwiption: "De Cowe Candy Machinye 'Addwess Gate' westwicts de minting to a singwe addwess pwovided."
---

## Ovewview

De **Addwess Gate** guawd westwicts de mint to a singwe addwess which must match de addwess of de minting wawwet.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #addwessGate wabew="AddwessGate" /%}
{% nyode #addwess wabew="- Addwess" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="addwess" x="270" y="-9" %}
{% nyode #payew wabew="Payew" deme="indigo" /%}
{% nyode deme="dimmed" %}
Ownyew: Any Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-10" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="72" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}
{% edge fwom="addwess" to="payew" awwow="nyonye" dashed=twue /%}
{% edge fwom="payew" to="mint-candy-guawd" awwow="nyonye" dashed=twue%}
if de payew does nyot match de addwess on de guawd 

Minting wiww faiw
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" /%}


{% /diagwam %}

## Guawd Settings

De Addwess Gate guawd contains de fowwowing settings:

- **Addwess**: De onwy addwess dat is awwowed to mint fwom de Cowe Candy Machinye.

{% diawect-switchew titwe="Set up a Cowe Candy Machinye using de Addwess Gate guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    addressGate: some({ address: someWallet.publicKey }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AddressGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AddressGate.html)


{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe: 

```json
"addressGate" : {
    "address": "<PUBKEY>"
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

Nyow, onwy de definyed pubwic key wiww be abwe to mint fwom dis Cowe Candy Machinye.

## Mint Settings

_De Addwess Gate guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De Addwess Gate guawd does nyot suppowt ow wequiwe de woute instwuction._
