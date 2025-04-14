---
titwe: Sow Fixed Fee Guawd
metaTitwe: Sow Fixed Fee Guawd | Cowe Candy Machinye
descwiption: De Cowe Candy Machinye 'Sow Fixed Fee' guawd chawges de payew an amount in SOW when minting
---

## Ovewview

De **Sow Fixed Fee** guawd awwows us to chawge de payew an amount in SOW when minting~ Bod de amount of SOW and de destinyation addwess can be configuwed~ It wowks simiwaw to de [Sol Payment](/core-candy-machine/guards/sol-payment) Guawd.

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
{% nyode wabew="Sow Fixed Fee" /%}
{% nyode #amount wabew="- Amount" /%}
{% nyode #destinyation wabew="- Destinyation" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="destinyation" x="270" y="-9" %}
{% nyode #payew deme="indigo" %}
Destinyation Wawwet {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: System Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
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

{% nyode #nft pawent="mint-candy-machinye" y="140" x="72" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}
{% edge fwom="destinyation" to="payew" awwow="nyonye" dashed=twue /%}
{% edge fwom="mint-candy-guawd" to="payew" %}
Twansfews SOW

fwom de payew
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Sow Payment guawd contains de fowwowing settings:

- **Wampowts**: De amount in SOW (ow wampowts) to chawge de payew.
- **Destinyation**: De addwess of de wawwet dat shouwd weceive aww payments wewated to dis guawd.

{% diawect-switchew titwe="Set up a Candy Machinye using de Sow Payment guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

Nyote dat, in dis exampwe, we’we using de cuwwent identity as de destinyation wawwet.

```ts
create(umi, {
  // ...
  guards: {
    solFixedFee: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [SolFixedFee](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFee.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Sow Fixed Fee guawd contains de fowwowing Mint Settings:

- **Destinyation**: De addwess of de wawwet dat shouwd weceive aww payments wewated to dis guawd.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#solfixedfee) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de Sow Fixed Fee Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Sow Fixed Fee guawd using de `mintArgs` awgument wike so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    solFixedFee: some({ destination: treasury }),
  },
});
```

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [SolFixedFeeMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/SolFixedFeeMintArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Sow Fixed Fee guawd does nyot suppowt de woute instwuction._
