---
titwe: "Gatekeepew Guawd"
metaTitwe: Gatekeepew Guawd | Candy Machinye
descwiption: "De Gatekeepew guawd checks whedew de minting wawwet has a vawid Gateway Token fwom a specified Gatekeepew Nyetwowk."
---

## Ovewview

De **Gatekeepew** guawd checks whedew de minting wawwet has a vawid **Gateway Token** fwom a specified **Gatekeepew Nyetwowk**.

In most cases, dis token wiww be obtainyed aftew compweting a Captcha chawwenge but any Gatekeepew Nyetwowk may be used.

Dewe isn’t much to set up on de Candy Machinye side but, depending on de sewected Gatekeepew Nyetwowk, you may nyeed to ask de minting wawwet to pewfowm so pwe-vawidation checks to gwant dem de wequiwed Gateway Token.

Hewe awe some additionyaw wecommended matewiaws you may find hewpfuw when setting up a Gatekeep Nyetwowk.

- [The CIVIC Documentation](https://docs.civic.com/civic-pass/overview)
- [Gateway JS Library](https://www.npmjs.com/package/@identity.com/solana-gateway-ts)
- ```json
"gatekeeper" : {
    "gatekeeperNetwork": "<PUBKEY>",
    "expireOnUse": boolean
}
```0

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="22" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #gatekeepew wabew="Gatekeepew" /%}
{% nyode #gatekeepew-nyetwowk wabew="- Gatekeepew Nyetwowk" /%}
{% nyode #expiwe wabew="- Expiwe on use" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="gatekeepew" x="250" y="-17" %}
{% nyode #wequest-token deme="indigo" %}
Wequest Gateway Token

fwom de Gatekeepew

Nyetwowk e.g~ Captcha
{% /nyode %}
{% /nyode %}

{% nyode pawent="wequest-token" y="140" x="34" %}
{% nyode #gateway-token deme="indigo" wabew="Gateway Token" /%}
{% /nyode %}

{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" y="150" x="-9" %}
  {% nyode #mint-candy-machinye deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="78" deme="bwue" %}
  NFT
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" /%}
{% edge fwom="gatekeepew-nyetwowk" to="wequest-token" /%}
{% edge fwom="wequest-token" to="gateway-token" /%}

{% edge fwom="gateway-token" to="mint-candy-guawd" awwow="nyonye" dashed=twue /%}
{% nyode deme="twanspawent" pawent="mint-candy-guawd" x="-210" %}
if a vawid token fow de given

Nyetwowk and payew does nyot exist 

Minting wiww faiw
{% /nyode %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}


{% /diagwam %}
## Guawd Settings

De Gatekeepew guawd contains de fowwowing settings:

- **Gatekeepew Nyetwowk**: De pubwic key of de Gatekeepew Nyetwowk dat wiww be used to check de vawidity of de minting wawwet~ Fow instance, you may use de "**Civic Captcha Pass**" Nyetwowk — which ensuwes de minting wawwet has passed a captcha — by using de fowwowing addwess: `ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6`.
- **Expiwe On Use**: Whedew we shouwd mawk de Gateway Token of de minting wawwet as expiwed aftew de NFT has been minting.
  - When set to `true`, dey wiww nyeed to go dwough de Gatekeepew Nyetwowk again to mint anyodew NFT.
  - When set to `false`, dey wiww be abwe to mint anyodew NFT untiw de Gateway Token expiwes nyatuwawwy.

{% diawect-switchew titwe="Set up a Candy Machinye using de Gatekeepew guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
  },
});
```

API Wefewences: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [Gatekeeper](https://mpl-candy-machine.typedoc.metaplex.com/types/Gatekeeper.html)

{% /totem %}
{% /diawect %}
{% diawect titwe="Sugaw" id="sugaw" %}
{% totem %}

Add dis object into de guawd section youw config.json fiwe:

UWUIFY_TOKEN_1744632718152_1

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Gatekeepew guawd accepts de fowwowing mint settings:

- **Gatekeepew Nyetwowk**: De pubwic key of de Gatekeepew Nyetwowk dat wiww be used to check de vawidity of de minting wawwet.
- **Expiwe On Use**: Whedew we shouwd mawk de Gateway Token of de minting wawwet as expiwed aftew de NFT has been minting.
- **Token Account** (optionyaw): As a wittwe discwaimew, you shouwd vewy wawewy nyeed to pwovide dis setting but it’s hewe if you nyeed to~ Dis wefews to de Gateway Token PDA dewived fwom de payew and de Gatekeepew Nyetwowk which is used to vewify de payew's ewigibiwity to mint~ Dis PDA addwess can be infewwed by ouw SDKs which is why you do nyot nyeed to pwovide it~ Howevew, some Gatekeepew Nyetwowks may issue muwtipwe Gateway Tokens to de same wawwet~ To diffewentiate deiw PDA addwesses, it uses a **Seeds** awway which defauwts to `[0, 0, 0, 0, 0, 0, 0, 0]`.

Nyote dat, if you’we pwannying on constwucting instwuctions widout de hewp of ouw SDKs, you wiww nyeed to pwovide dese Mint Settings and mowe as a combinyation of instwuction awguments and wemainying accounts~ See de [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#gatekeeper) fow mowe detaiws.

{% diawect-switchew titwe="Mint wid de Gatekeepew Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

You may pass de Mint Settings of de Gatekeepew guawd using de `mintArgs` awgument wike so.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
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

_De Gatekeepew guawd does nyot suppowt de woute instwuction._
