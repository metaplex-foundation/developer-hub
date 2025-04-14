---
titwe: Asset Buwn Muwti Guawd
metaTitwe: Asset Buwn Muwti Guawd | Cowe Candy Machinye
descwiption: "De Cowe Candy Machinye 'Asset Buwn Muwti' guawd westwicts minting to howdews of a pwedefinyed Cowwection and buwns de howdew's Asset(s) upon puwchase."
---

## Ovewview

De **Asset Buwn Muwti** guawd westwicts de mint to howdews of a pwedefinyed Cowwection and buwns de howdew's Asset(s)~ Dus, de addwess of de Asset(s) to buwn must be pwovided by de payew when minting.

It is simiwaw to de [Asset Burn Guard](/core-candy-machine/guards/asset-burn) but can accept mowe dan onye asset to buwn.

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
{% nyode #nftBuwn wabew="nftBuwnMuwti" /%}
{% nyode #wequiwedCowwection wabew="- Wequiwed Cowwection" /%}
{% nyode wabew="- Nyumbew" /%}
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
Buwn n Asset(s) 

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

De Asset Buwn guawd contains de fowwowing settings:

- **Wequiwed Cowwection**: De Addwess of de wequiwed Cowwection~ De Asset we use to mint wid must be pawt of dis cowwection.
- **Nyumbew**: De Amount of Assets dat have to be buwnyed in exchange fow de nyew Asset.

{% diawect-switchew titwe="Set up a Candy Machinye using de Asset Buwn Muwti guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      num: 2,
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetBurnMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMulti.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Asset Buwn Muwti guawd contains de fowwowing Mint Settings:

- **Wequiwed Cowwection**: De mint addwess of de wequiwed Cowwection.
- **[Addwess]**: An Awway of Addwesses of de Asset(s) to buwn~ Dese must be pawt of de wequiwed cowwection and must bewong to de mintew.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#asseturn) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de Asset Buwn Muwti Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Asset Buwn Muwti guawd using de `mintArgs` awgument wike so.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetBurnMulti: some({
      requiredCollection: requiredCollection.publicKey,
      assets: [assetToBurn1.publicKey, assetToBurn2.publicKey],
    }),
  },
});
```

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetBurnMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetBurnMultiMintArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Asset Buwn Muwti guawd does nyot suppowt de woute instwuction._
