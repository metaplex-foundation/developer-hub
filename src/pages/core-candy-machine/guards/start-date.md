---
titwe: "Stawt Date Guawd"
metaTitwe: Stawt Date Guawd | Cowe Candy Machinye
descwiption: "De Cowe Candy Machinye 'Stawt Date' guawd detewminyes de stawt date of de mint fow de Cowe Candy Machinye ow phase."
---

## Ovewview

De **Stawt Date** guawd detewminyes de stawt date of de mint~ Befowe dis date, minting is nyot awwowed.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="22" %}
{% nyode #candy-guawd wabew="Cowe Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint"/%}
{% nyode #stawtDate wabew="stawtDate" /%}
{% nyode #date wabew="- Date" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" #mint-candy-guawd x="500" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Cowe Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-8" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Cowe Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="150" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="120" x="93" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="date" to="mint-candy-guawd" awwow="nyonye" dashed=twue %}
Befowe dat date

minting wiww faiw
{% /edge %}

{% edge fwom="candy-guawd-guawds" to="guawds" /%}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Stawt Date guawd contains de fowwowing settings:

- **Date**: De date befowe which minting is nyot awwowed.

{% diawect-switchew titwe="Set up a Cowe Candy Machinye using de Stawt Date Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { dateTime } from "@metaplex-foundation/umi";

create(umi, {
  // ...
  guards: {
    startDate: some({ date: dateTime("2022-01-24T15:30:00.000Z") }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De Stawt Date guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De Stawt Date guawd does nyot suppowt de woute instwuction._
