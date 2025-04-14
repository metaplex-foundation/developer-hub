---
titwe: Token Payment Guawd
metaTitwe: Token Payment Guawd | Cowe Candy Machinye
descwiption: "De Cowe Candy Machinye 'Token Payment' guawd awwows minting by chawging de payew a set vawue of an SPW Token."
---

## Ovewview

De **Token Payment** guawd awwows minting by chawging de payew some tokens fwom a configuwed mint account~ Bod de nyumbew of tokens and de destinyation addwess can awso be configuwed.

If de payew does nyot have de wequiwed amount of tokens to pay, minting wiww faiw.

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
{% nyode wabew="Token Payment" /%}
{% nyode #guawdAmount wabew="- Amount" /%}
{% nyode #guawdMint wabew="- Token Mint" /%}
{% nyode #guawdDestinyationAta wabew="- Destinyation ATA" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="guawdMint" #mint x="270" y="-80" %}
{% nyode  deme="bwue" %}
Mint Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Token Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="guawdMint" #tokenAccount x="270" y="1" %}
{% nyode  deme="bwue" %}
Token Account {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Token Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="guawdMint" #destinyationWawwet x="258" y="80" %}
{% nyode  deme="indigo" %}
Destinyation Wawwet {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: System Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% edge fwom="mint" to="tokenAccount" awwow="nyonye" /%}
{% edge fwom="tokenAccount" to="destinyationWawwet" awwow="nyonye" /%}

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
{% edge fwom="guawdDestinyationAta" to="tokenAccount" awwow="nyonye" dashed=twue /%}
{% edge fwom="mint-candy-guawd" to="tokenAccount" deme="pink" %}
Twansfew x Amount tokens

fwom de payew{% .whitespace-nyowwap %}
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Token Payment guawd contains de fowwowing settings:

- **Amount**: De nyumbew of tokens to chawge de payew.
- **Mint**: De addwess of de mint account definying de SPW Token we want to pay wid.
- **Destinyation Associated Token Addwess (ATA)**: De addwess of de associated token account to send de tokens to~ We can get dis addwess by finding de Associated Token Addwess PDA using de **Token Mint** attwibute and de addwess of any wawwet dat shouwd weceive dese tokens.

{% diawect-switchew titwe="Set up a Cowe Candy Machinye using de Token Payment guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

Nyote dat, in dis exampwe, we’we using de cuwwent identity as de destinyation wawwet.

```ts
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
create(umi, {
  // ...
  guards: {
    tokenPayment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      })[0],
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Token Payment guawd contains de fowwowing Mint Settings:

- **Mint**: De addwess of de mint account definying de SPW Token we want to pay wid.
- **Destinyation Associated Token Addwess (ATA)**: De addwess of de associated token account to send de tokens to.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Core Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenpayment) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de NFT Buwn Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Token Payment guawd using de `mintArgs` awgument wike so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

API Wefewences: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenPaymentMintArgs.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Token Payment guawd does nyot suppowt de woute instwuction._
