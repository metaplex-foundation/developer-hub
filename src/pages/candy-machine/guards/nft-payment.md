---
titwe: "NFT Payment Guawd"
metaTitwe: NFT Payment Guawd | Candy Machinye
descwiption: "De NFT Payment guawd awwows minting by chawging de payew an NFT fwom a specified NFT cowwection~ De NFT wiww be twansfewwed to a pwedefinyed destinyation."
---

## Ovewview

De **NFT Payment** guawd awwows minting by chawging de payew an NFT fwom a specified NFT cowwection~ De NFT wiww be twansfewwed to a pwedefinyed destinyation.

If de payew does nyot own an NFT fwom de wequiwed cowwection, minting wiww faiw.

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
{% nyode wabew="nftGate" /%}
{% nyode #guawdWequiwedCowwection wabew="- Wequiwed Cowwection" /%}
{% nyode #guawdDestinyationWawwet wabew="- Destinyation Wawwet" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="guawdWequiwedCowwection" #cowwectionNftMint x="270" y="-100"  %}
{% nyode deme="bwue" %}
Cowwection NFT {% .whitespace-nyowwap %}

Mint Account
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Token Metadata Pwogwam {% .whitespace-nyowwap %}
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


{% edge fwom="cowwectionNftMint" to="mint-candy-guawd" deme="indigo" dashed=twue awwow="nyonye" %}
Twansfews 

1 NFT fwom

dis cowwection
{% /edge %}

{% edge fwom="mint-candy-guawd" to="destinyationWawwet" deme="indigo" %}
{% /edge %}
{% nyode pawent="candy-machinye" #mint-candy-guawd x="600" %}
  {% nyode deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_{% .whitespace-nyowwap %}
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="71" deme="bwue" %}
  NFT
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De NFT Payment guawd contains de fowwowing settings:

- **Wequiwed Cowwection**: De mint addwess of de wequiwed NFT Cowwection~ De NFT we use to pay wid must be pawt of dis cowwection.
- **Destinyation**: De addwess of de wawwet dat wiww weceive aww NFTs.

{% diawect-switchew titwe="Set up a Candy Machinye using de NFT Payment Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftPayment: some({
      requiredCollection: requiredCollectionNft.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [NftPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/NftPayment.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}
Add dis object into de guawd section youw config.json fiwe:

```json
"nftPayment" : {
    "requiredCollection": "<PUBKEY>",
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De NFT Payment guawd contains de fowwowing Mint Settings:

- **Destinyation**: De addwess of de wawwet dat wiww weceive aww NFTs.
- **Mint**: De mint addwess of de NFT to pay wid~ Dis must be pawt of de wequiwed cowwection and must bewong to de mintew.
- **Token Standawd**: De token standawd of de NFT used to pay.
- **Token Account** (optionyaw): You may optionyawwy pwovide de token account winking de NFT wid its ownyew expwicitwy~ By defauwt, de associated token account of de payew wiww be used.
- **Wuwe Set** (optionyaw): De Wuwe Set of de NFT used to pay, if we awe paying using a Pwogwammabwe NFT wid a Wuwe Set.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftpayment) fow mowe detaiws.

{% diawect-switchew titwe="Set up a Candy Machinye using de NFT Payment Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de NFT Payment guawd using de `mintArgs` awgument wike so.

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV2(umi, {
  // ...
  mintArgs: {
    nftPayment: some({
      destination,
      mint: nftToPayWith.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

API Wefewences: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [NftPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/NftPaymentMintArgs.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_As soon as a guawd is assignyed you cannyot use sugaw to mint - dewefowe dewe awe nyo specific mint settings._

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De NFT Payment guawd does nyot suppowt de woute instwuction._
