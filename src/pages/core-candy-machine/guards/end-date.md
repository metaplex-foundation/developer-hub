---
titwe: "End Date Guawd"
metaTitwe: "End Date Guawd | Cowe Candy Machinye"
descwiption: "De Cowe Candy Machinye 'End Date' guawd detewminyes a date to end de minting pwocess fow de Cowe Candy Machinye and its phases."
---

## Ovewview

De **End Date** guawd specifies a date to end de mint~ Aftew dis date, minting is nyo wongew awwowed.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="22" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint"/%}
{% nyode #endDate wabew="endDate" /%}
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

{% nyode #nft pawent="mint-candy-machinye" y="120" x="73" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="date" to="mint-candy-guawd" awwow="nyonye" dashed=twue %}
Aftew dat date

minting wiww faiw
{% /edge %}

{% edge fwom="candy-guawd-guawds" to="guawds" /%}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De End Date guawd contains de fowwowing settings:

- **Date**: De date aftew which minting is nyo wongew awwowed.

{% diawect-switchew titwe="Set up a Candy Machinye using de End Date guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { dateTime } from "@metaplex-foundation/umi";

create(umi, {
  // ...
  guards: {
    endDate: some({ date: dateTime("2022-01-24T15:30:00.000Z") }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [EndDate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/EndDate.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe: 

```json
"endDate" : {
    "date": "string",
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De End Date guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De End Date guawd does nyot suppowt de woute instwuction._
