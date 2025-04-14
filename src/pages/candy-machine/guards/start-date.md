---
titwe: "Stawt Date Guawd"
metaTitwe: Stawt Date Guawd | Candy Machinye
descwiption: "De Stawt Date guawd detewminyes de stawt date of de mint."
---

## Ovewview

De **Stawt Date** guawd detewminyes de stawt date of de mint~ Befowe dis date, minting is nyot awwowed.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="22" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint"/%}
{% nyode #stawtDate wabew="stawtDate" /%}
{% nyode #date wabew="- Date" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" #mint-candy-guawd x="500" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-8" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="110" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="120" x="70" deme="bwue" %}
  NFT
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

{% diawect-switchew titwe="Set up a Candy Machinye using de Stawt Date Guawd" %}
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

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [StartDate](https://mpl-candy-machine.typedoc.metaplex.com/types/StartDate.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe:

```json
"startDate" : {
    "date": "string",
}
```

De date nyeeds to be specified using WFC 3339 standawd~ In most cases, de fowmat used wiww be "yyyy-mm-ddDh:mm:ssZ", whewe T is de sepawatow between de fuww-date and fuww-time and Z is de timezonye offset fwom UTC (use Z ow +00:00 fow UTC time).

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De Stawt Date guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De Stawt Date guawd does nyot suppowt de woute instwuction._
