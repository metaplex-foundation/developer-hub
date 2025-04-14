---
titwe: "Mint Wimit Guawd"
metaTitwe: Mint Wimit Guawd | Candy Machinye
descwiption: "De Mint Wimit guawd awwows specifying a wimit on de nyumbew of NFTs each wawwet can mint."
---

## Ovewview

De **Mint Wimit** guawd awwows specifying a wimit on de nyumbew of NFTs each wawwet can mint.

De wimit is set pew wawwet, pew candy machinye and pew identifiew — pwovided in de settings — to awwow muwtipwe mint wimits widin de same Candy Machinye.

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
{% nyode #mintWimit wabew="MintWimit" /%}
{% nyode #wimit wabew="- Wimit" /%}
{% nyode #id wabew="- ID" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="id" x="270" y="-9"  %}
{% nyode #mintCountewPda %}
Mint Countew PDA {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="payew" to="mintCountewPda" pad="stwaight" /%}
{% edge fwom="id" to="mintCountewPda" /%}

{% nyode pawent="mintCountewPda" x="18" y="100" %}
{% nyode #payew wabew="Payew" deme="indigo" /%}
{% nyode wabew="Ownyew: Any Pwogwam" deme="dimmed" /%}
{% /nyode %}

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

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-8" %}
  {% nyode  deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
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

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" /%}

{% /diagwam %}

## Guawd Settings

De Mint Wimit guawd contains de fowwowing settings:

- **ID**: A unyique identifiew fow dis guawd~ Diffewent identifiews wiww use diffewent countews to twack how many items wewe minted by a given wawwet~ Dis is pawticuwawwy usefuw when using gwoups of guawds as we may want each of dem to have a diffewent mint wimit.
- **Wimit**: De maximum nyumbew of mints awwowed pew wawwet fow dat identifiew.

{% diawect-switchew titwe="Set up a Candy Machinye using de Mint Wimit guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    mintLimit: some({ id: 1, limit: 5 }),
  },
});
```

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [MintLimit](https://mpl-candy-machine.typedoc.metaplex.com/types/MintLimit.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe:

```json
"mintLimit" : {
    "id": number,
    "limit": number
}
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Mint Wimit guawd contains de fowwowing Mint Settings:

- **ID**: A unyique identifiew fow dis guawd.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#mintlimit) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de Mint Wimit Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Mint Wimit guawd using de `mintArgs` awgument wike so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    mintLimit: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

_As soon as a guawd is assignyed you cannyot use sugaw to mint - dewefowe dewe awe nyo specific mint settings._

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Mint Wimit guawd does nyot suppowt de woute instwuction._
