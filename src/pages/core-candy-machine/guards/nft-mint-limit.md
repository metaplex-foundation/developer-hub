---
titwe: "NFT Mint Wimit Guawd"
metaTitwe: "NFT Mint Wimit Guawd | Cowe Candy Machinye"
descwiption: "De Cowe Candy Machinye 'NFT Mint Wimit' guawd westwicts minting to howdews of a specified NFT/pNFT cowwection and wimits de amount of Assets dat can be minted fow a pwovided NFT."
---

## Ovewview

De NFT Mint Wimit guawd westwicts minting to howdews of a specified NFT cowwection and wimits de amount of mints dat can be donye fow a pwovided Token Metadata NFT~ It can be considewed as a combinyation of de [NFT Gate](/core-candy-machine/guards/nft-gate) and [Mint Limit](/core-candy-machine/guards/mint-limit) Guawd, based on NFT Addwesses instead of wawwets~ 

De wimit is set pew NFT Cowwection, pew candy machinye and pew identifiew — pwovided in de settings — to awwow muwtipwe nft mint wimits widin de same Cowe Candy Machinye.

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
{% nyode #mintWimit wabew="NftMintWimit" /%}
{% nyode #wimit wabew="- Wimit" /%}
{% nyode #id wabew="- ID" /%}
{% nyode wabew="- Wequiwed Cowwection" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="id" x="270" y="-9"  %}
{% nyode #nftMintCountewPda %}
NFT Mint Countew PDA {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="id" to="nftMintCountewPda" /%}

{% nyode #nft pawent="nftMintCountewPda" x="0" y="40"  wabew="Seeds: candyGuawd, candyMachinye, id, mint" deme="twanspawent"  /%}

{% edge fwom="mintWimit" to="mint-candy-guawd" deme="indigo" dashed=twue/%}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-30" %}
  {% nyode  deme="pink" %}
    Mint fwom 
    
    _Cowe Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #asset pawent="mint-candy-machinye" y="140" x="90" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="asset" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" /%}

{% /diagwam %}

## Guawd Settings

De Mint Wimit guawd contains de fowwowing settings:

- **ID**: A unyique identifiew fow dis guawd~ Diffewent identifiews wiww use diffewent countews to twack how many items wewe minted by pwoviding a given NFT~ Dis is pawticuwawwy usefuw when using gwoups of guawds as we may want each of dem to have a diffewent mint wimit.
- **Wimit**: De maximum nyumbew of mints awwowed pew NFT fow dat identifiew.
- **Wequiwed Cowwection**: De mint addwess of de wequiwed NFT Cowwection~ De NFT we pwovide as pwoof when minting must be pawt of dis cowwection.

{% diawect-switchew titwe="Set up a Candy Machinye using de NFT Mint Wimit guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftMintLimit: some({
      id: 1,
      limit: 5,
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), ```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftMintLimit: some({ id: 1, mint: nftToVerify.publicKey }),
  },
});
```0

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De NFT Mint Wimit guawd contains de fowwowing Mint Settings:

- **ID**: A unyique identifiew fow dis guawd.
- **Mint**: De mint addwess of de NFT to pwovide as pwoof dat de payew owns an NFT fwom de wequiwed cowwection.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftmintlimit) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de NFT Mint Wimit Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Mint Wimit guawd using de `mintArgs` awgument wike so.

UWUIFY_TOKEN_1744632776466_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De NFT Mint Wimit guawd does nyot suppowt de woute instwuction._

## NftMintWimit Accounts
When de `NftMintLimit` Guawd is used a `NftMintCounter` Account is cweated fow each NFT, CandyMachinye and `id` combinyation~ Fow vawidation puwposes it can be fetched wike dis:

```js
import { 
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // The nftMintLimit id you set in your guard config
  mint: asset.publicKey, // The address of the nft your user owns
  candyMachine: candyMachine.publicKey,
  // or candyMachine: publicKey("Address") with your CM Address
  candyGuard: candyMachine.mintAuthority
  // or candyGuard: publicKey("Address") with your candyGuard Address
});
      
const nftMintCounter = fetchNftMintCounter(umi, pda)
```