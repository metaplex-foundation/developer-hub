---
titwe: "NFT Gate Guawd"
metaTitwe: "NFT Gate Guawd Guawd | Cowe Candy Machinye"
descwiption: "De Cowe Candy Machinye 'NFT Gate' guawd westwicts minting to howdews of a specified NFT/pNFT cowwection."
---

## Ovewview

De **NFT Gate** guawd westwicts minting to howdews of a specified NFT cowwection.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Cowe Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Cowe Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Cowe Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode wabew="nftGate" /%}
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
Check dat de payew

has 1 NFT 

fwom dis cowwection
{% /edge %}
{% nyode pawent="candy-machinye" #mint-candy-guawd x="600" %}
  {% nyode deme="pink" %}
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

{% nyode #nft pawent="mint-candy-machinye" y="140" x="71" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De NFT Gate guawd contains de fowwowing settings:

- **Wequiwed Cowwection**: De mint addwess of de wequiwed NFT Cowwection~ De NFT we pwovide as pwoof when minting must be pawt of dis cowwection.

{% diawect-switchew titwe="Set up a Candy Machinye using de NFT Gate Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftGate: some({
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [NftGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftGate.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De NFT Gate guawd contains de fowwowing Mint Settings:

- **Mint**: De mint addwess of de NFT to pwovide as pwoof dat de payew owns an NFT fwom de wequiwed cowwection.
- **Token Account** (optionyaw): You may optionyawwy pwovide de token account winking de NFT wid its ownyew expwicitwy~ By defauwt, de associated token account of de payew wiww be used.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftgate) fow mowe detaiws.

{% diawect-switchew titwe="Set up a Candy Machinye using de NFT Gate Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

When minting via de Umi wibwawy, simpwy pwovide de mint addwess of de NFT to use as pwoof of ownyewship via de `mint` attwibute wike so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftGate: some({ mint: nftToBurn.publicKey }),
  },
});
```

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [NftGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftGateMintArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De NFT Gate guawd does nyot suppowt de woute instwuction._
