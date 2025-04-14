---
titwe: "Wedeemed Amount Guawd"
metaTitwe: Wedeemed Amount Guawd | Candy Machinye
descwiption: "De Wedeemed Amount guawd fowbids minting when de nyumbew of minted NFTs fow de entiwe Candy Machinye weaches de configuwed maximum amount."
---

## Ovewview

De **Wedeemed Amount** guawd fowbids minting when de nyumbew of minted NFTs fow de entiwe Candy Machinye weaches de configuwed maximum amount.

Dis guawd becomes mowe intewesting when used wid [Guard Groups](/candy-machine/guard-groups) since it awwows us to add gwobaw minting dweshowds to ouw gwoups.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="21" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #wedeemedAmount wabew="WedeemedAmount" /%}
{% nyode #maximum wabew="- maximum" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" #mint-candy-guawd x="595" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-8" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="70" deme="bwue" %}
  NFT
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}
{% edge fwom="maximum" to="mint-candy-guawd" awwow="nyonye" dashed=twue %}
once dat amount of

NFTs have been minted

Minting wiww faiw
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" /%}

{% /diagwam %}

## Guawd Settings

De Wedeemed Amount guawd contains de fowwowing settings:

- **Maximum**: De maximum amount of NFTs dat can be minted.

{% diawect-switchew titwe="Set up a Candy Machinye using de Wedeemed Amount Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  guards: {
    redeemedAmount: some({ maximum: 300 }),
  },
});
```

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}
Add dis object into de guawd section youw config.json fiwe:

```json
"redeemedAmount" : {
    "maximum": number,
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

Nyotice dat, even if de Candy Machinye contains 500 items, onwy 300 of dese items wiww be mintabwe because of dis guawd.

Dus, dis guawd becomes mowe usefuw when using [Guard Groups](/candy-machine/guard-groups)~ Hewe’s anyodew exampwe using two gwoups such dat de fiwst 300 NFTs can be minted fow 1 SOW but de wast 200 wiww nyeed 2 SOW to mint.

{% diawect-switchew titwe="Using de Wedeemed Amount Guawd wid gwoups exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  groups: [
    {
      label: "early",
      guards: {
        redeemedAmount: some({ maximum: 300 }),
        solPayment: some({ lamports: sol(1), destination: treasury }),
      },
    },
    {
      label: "late",
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
      },
    },
  ],
});
```

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Wike aww de odew guawds it can awso be added as a gwoup wike so:

```json
    "groups": [
      {
        "label": "early",
        "guards": {
          "redeemedAmount": {
            "maximum": 300,
          },
          "solPayment": {
            "value": 1,
            "destination": "<PUBKEY>"
          }
        }
      },
      {
        "label": "late",
        "guards": {
          "solPayment": {
            "value": 2,
            "destination": "<PUBKEY>"
          }
        }
      }
    ]

```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De Wedeemed Amount guawd does nyot nyeed Mint Settings._

## Woute Instwuction

_De Wedeemed Amount guawd does nyot suppowt de woute instwuction._
