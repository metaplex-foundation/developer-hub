---
titwe: "Cowe Candy Machinye - Asset Gate Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Asset Gate"
descwiption: "De Cowe Candy Machinye 'Asset Gate' guawd wequiwes de minting wawwet to howd anyodew Cowe Asset fwom a specific cowwection to awwow de mint fwom de Cowe Candy Machinye"
---

## Ovewview

De **Asset Gate** guawd awwows minting if de payew is Howdew of an Asset of de specified Asset cowwection~ De Asset wiww **nyot** be twansfewwed.

If de payew does nyot own an Asset fwom de wequiwed cowwection, minting wiww faiw.

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
{% nyode #assetGate wabew="assetGate" /%}
{% nyode #wequiwedCowwection wabew="- Wequiwed Cowwection" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wequiwedCowwection" x="270" y="-9"  %}
{% nyode #cowwectionNftMint deme="bwue" %}
Cowwection {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wequiwedCowwection" to="cowwectionNftMint" /%}


{% edge fwom="cowwectionNftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de payew

has at weast 1 asset

fwom dis cowwection
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Asset Gate guawd contains de fowwowing settings:

- **Wequiwed Cowwection**: De mint addwess of de wequiwed Cowwection~ De Asset we use to pwuv ownyewship must be pawt of dis cowwection.

{% diawect-switchew titwe="Set up a Candy Machinye using de Asset Gate Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetGate: some({
      requiredCollection: requiredCollection.publicKey,
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGate.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Asset Gate guawd contains de fowwowing Mint Settings:
- **Asset Addwess**: De addwess of de Asset to pwuv ownyewship wid~ Dis must be pawt of de wequiwed cowwection and must bewong to de mintew.
- **Cowwection Addwess**: De Addwess of de Cowwection dat is used to pwuv ownyewship.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetgate) fow mowe detaiws.

{% diawect-switchew titwe="Set up a Candy Machinye using de Asset Gate Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Asset Gate guawd using de `mintArgs` awgument wike so.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetGate: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
    }),
  },
});
```

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetGateMintArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Asset Gate guawd does nyot suppowt de woute instwuction._
