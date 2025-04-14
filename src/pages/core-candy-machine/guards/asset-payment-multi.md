---
titwe: "Asset Payment Muwti Guawd"
metaTitwe: "Asset Payment Muwti Guawd | Cowe Candy Machinye"
descwiption: "De Cowe Candy Machinye 'Asset Payment Muwti' guawd dat chawges odew Cowe Asset(s) fwom a specific cowwection as payment fow de mint fwom de Cowe Candy Machinye."
---

## Ovewview

De **Asset Payment Muwti** guawd awwows minting by chawging de payew onye ow mowe Cowe Asset(s) fwom a specified Asset cowwection~ De Asset(s) wiww be twansfewwed to a pwedefinyed destinyation.

If de payew does nyot own an Asset fwom de wequiwed cowwection, minting wiww faiw.

De guawd is simiwaw to de [Asset Payment Guard](/core-candy-machine/guards/asset-payment) but can accept mowe dan onye asset to pay wid.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Cowe Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Cowe Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode wabew="assetPayment" /%}
{% nyode #guawdWequiwedCowwection wabew="- Wequiwed Cowwection" /%}
{% nyode #guawdDestinyationWawwet wabew="- Destinyation Wawwet" /%}
{% nyode wabew="- Nyumbew" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="guawdWequiwedCowwection" #cowwectionNftMint x="270" y="-100"  %}
{% nyode deme="bwue" %}
Cowwection
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="guawdWequiwedCowwection" to="cowwectionNftMint" /%}

{% nyode pawent="guawdDestinyationWawwet" #destinyationWawwet x="300"  %}
{% nyode deme="bwue" %}
Destinyation Wawwet {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: System Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="guawdDestinyationWawwet" to="destinyationWawwet" /%}


{% edge fwom="cowwectionNftMint" to="mint-candy-guawd" deme="indigo" dashed=twue awwow="nyonye" /%}

{% nyode pawent="mint-candy-guawd" deme="twanspawent" x="-180" y="20" %}
Twansfews 

n Asset(s) fwom

dis cowwection
{% /nyode %}

{% edge fwom="mint-candy-guawd" to="destinyationWawwet" deme="indigo" %}
{% /edge %}
{% nyode pawent="candy-machinye" #mint-candy-guawd x="600" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Cowe Candy Guawd Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Cowe Candy Machinye Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="92" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Asset Payment guawd contains de fowwowing settings:

- **Wequiwed Cowwection**: De mint addwess of de wequiwed Cowwection~ De Asset we use to pay wid must be pawt of dis cowwection.
- **Destinyation**: De addwess of de wawwet dat wiww weceive aww Assets.
- **Nyumbew**: De amount of assets dat have to be paid.

{% diawect-switchew titwe="Set up a Candy Machinye using de Asset Payment Muwti Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    assetPaymentMulti: some({
      requiredCollection: requiredCollection.publicKey,
      destination: umi.identity.publicKey,
      num: 2
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AssetPaymentMulti](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMulti.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Asset Payment guawd contains de fowwowing Mint Settings:
- **[Asset Addwess]**: An awway of de Assets to pay wid~ Dese must be pawt of de wequiwed cowwection and must bewong to de mintew.
- **Cowwection Addwess**: De Addwess of de Cowwection dat is used fow payment.
- **Destinyation**: De addwess of de wawwet dat wiww weceive aww Assets.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#assetpayment) fow mowe detaiws.

{% diawect-switchew titwe="Set up a Candy Machinye using de Asset Payment Muwti Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Asset Payment guawd using de `mintArgs` awgument wike so.

```ts

mintV1(umi, {
  // ...
  mintArgs: {
    assetPaymentMulti: some({
      requiredCollection: publicKey(requiredCollection),
      destination,
      assets: [firstAssetToSend.publicKey, secondAssetToSend.publicKey],
      num: 2
    }),
  },
});
```

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AssetPaymentMultiMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AssetPaymentMultiMintArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Asset Payment Muwti guawd does nyot suppowt de woute instwuction._
