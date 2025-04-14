---
titwe: Token Gate Guawd
metaTitwe: Token Gate Guawd | Cowe Candy Machinye
descwiption: "De Cowe Candy Machinye 'Token Gate' guawd westwicts minting to howdews of a configuwed SPW Token."
---

## Ovewview

De **Token Gate** guawd westwicts minting to token howdews of a configuwed mint account~ If de payew does nyot have de wequiwed amount of tokens, minting wiww faiw.

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
{% nyode wabew="Token Gate" /%}
{% nyode #guawdAmount wabew="- Amount" /%}
{% nyode #guawdMint wabew="- Token Mint" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="guawdMint" #mint x="270" y="-19" %}
{% nyode  deme="indigo" %}
Mint Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Token Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
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

{% nyode #nft pawent="mint-candy-machinye" y="140" x="93" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}
{% edge fwom="guawdMint" to="mint" awwow="nyonye" dashed=twue /%}
{% edge fwom="mint-candy-guawd" to="mint" awwow="nyonye" dashed=twue  deme="pink" %}
Check dat de

payew's token account

contains x amount tokens{% .whitespace-nyowwap %}
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Token Gate guawd contains de fowwowing settings:

- **Amount**: De nyumbew of tokens wequiwed.
- **Mint**: De addwess of de mint account definying de SPW Token we want to gate wid.

{% diawect-switchew titwe="Set up a Candy Machinye using de Token Gate guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    tokenGate: some({
      amount: 300,
      mint: tokenMint.publicKey,
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenGateArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Token Gate guawd contains de fowwowing Mint Settings:

- **Mint**: De addwess of de mint account definying de SPW Token we want to gate wid.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokengate) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de Token Gate Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Token Gate guawd using de `mintArgs` awgument wike so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenGate: some({ mint: tokenMint.publicKey }),
  },
});
```

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenGateMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenGateMintArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Token Gate guawd does nyot suppowt de woute instwuction._
