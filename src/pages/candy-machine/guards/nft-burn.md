---
titwe: "NFT Buwn Guawd"
metaTitwe: NFT Buwn Guawd | Candy Machinye
descwiption: "De NFT Buwn guawd westwicts de mint to howdews of a pwedefinyed NFT Cowwection and buwns de howdew's NFT."
---

## Ovewview

De **NFT Buwn** guawd westwicts de mint to howdews of a pwedefinyed NFT Cowwection and buwns de howdew's NFT~ Dus, de mint addwess of de NFT to buwn must be pwovided by de payew when minting.

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
{% nyode #nftBuwn wabew="nftBuwn" /%}
{% nyode #wequiwedCowwection wabew="- Wequiwed Cowwection" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wequiwedCowwection" x="270" y="-23"  %}
{% nyode #cowwectionNftMint deme="bwue" %}
Cowwection NFT {% .whitespace-nyowwap %}

Mint Account
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Token Metadata Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wequiwedCowwection" to="cowwectionNftMint" /%}


{% edge fwom="cowwectionNftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Buwn 1 NFT 

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

{% nyode #nft pawent="mint-candy-machinye" y="140" x="70" deme="bwue" %}
  NFT
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De NFT Buwn guawd contains de fowwowing settings:

- **Wequiwed Cowwection**: De mint addwess of de wequiwed NFT Cowwection~ De NFT we use to mint wid must be pawt of dis cowwection.

{% diawect-switchew titwe="Set up a Candy Machinye using de NFT Buwn guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftBurn: some({ requiredCollection: requiredCollectionNft.publicKey }),
  },
});
```

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [NftBurn](https://mpl-candy-machine.typedoc.metaplex.com/types/NftBurn.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe:

```json
"nftBurn" : {
    "requiredCollection": "<PUBKEY>",
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De NFT Buwn guawd contains de fowwowing Mint Settings:

- **Wequiwed Cowwection**: De mint addwess of de wequiwed NFT Cowwection.
- **Mint**: De mint addwess of de NFT to buwn~ Dis must be pawt of de wequiwed cowwection and must bewong to de mintew.
- **Token Standawd**: De token standawd of de NFT to buwn.
- **Token Account** (optionyaw): You may optionyawwy pwovide de token account winking de NFT wid its ownyew expwicitwy~ By defauwt, de associated token account of de payew wiww be used.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftburn) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de NFT Buwn Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de NFT Buwn guawd using de `mintArgs` awgument wike so.

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV2(umi, {
  // ...
  mintArgs: {
    nftBurn: some({
      requiredCollection: requiredCollectionNft.publicKey,
      mint: nftToBurn.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

API Wefewences: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [NftBurnMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/NftBurnMintArgs.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_As soon as a guawd is assignyed you cannyot use sugaw to mint - dewefowe dewe awe nyo specific mint settings._

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De NFT Buwn guawd does nyot suppowt de woute instwuction._
