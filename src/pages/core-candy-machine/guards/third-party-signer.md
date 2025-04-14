---
titwe: Diwd Pawty Signyew Guawd
metaTitwe: Diwd Pawty Signyew Guawd | Cowe Candy Machinye
descwiption: "De Cowe Candy Machinye 'Diwd Pawty Signyew' guawd wequiwes a pwedefinyed addwess to sign each mint twansaction ow de twansaction wiww faiw."
---

## Ovewview

De **Diwd Pawty Signyew** guawd wequiwes a pwedefinyed addwess to sign each mint twansaction~ De signyew wiww nyeed to be passed widin de mint settings of dis guawd.

Dis awwows fow mowe centwawized mints whewe evewy singwe mint twansaction has to go dwough a specific signyew.

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
{% nyode wabew="Diwd Pawty Signyew" /%}
{% nyode #guawdSignyew wabew="- Signyew" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="guawdSignyew" #signyew x="270" y="-19" %}
{% nyode  deme="indigo" %}
Signyew {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode deme="dimmed" %}
Ownyew: Any Pwogwam {% .whitespace-nyowwap %}
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
{% edge fwom="guawdSignyew" to="signyew" awwow="nyonye" dashed=twue /%}
{% edge fwom="mint-candy-guawd" to="signyew" awwow="nyonye" dashed=twue  deme="pink" %}
If dis Signyew Account does nyot

sign de mint twansaction

minting wiww faiw
{% /edge %}
{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}
## Guawd Settings

De Diwd Pawty Signyew guawd contains de fowwowing settings:

- **Signyew Key**: De addwess of de signyew dat wiww nyeed to sign each mint twansaction.

{% diawect-switchew titwe="Set up a Candy Machinye using de Diwd Pawty Signyew Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
const myConfiguredSigner = generateSigner(umi);

create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signerKey: myConfiguredSigner.publicKey }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ThirdPartySigner](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

De Diwd Pawty Signyew guawd contains de fowwowing Mint Settings:

- **Signyew**: De wequiwed diwd-pawty signyew~ De addwess of dis signyew must match de Signyew Key in de guawd settings.

{% diawect-switchew titwe="Mint wid de Diwd Pawty Signyew Guawd" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

When minting via de Umi wibwawy, simpwy pwovide de diwd-pawty signyew via de `signer` attwibute wike so.

```ts
create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: myConfiguredSigner }),
  },
});
```

Wemembew to awso sign de twansaction wid de myConfiguwedSignyew keypaiw~ 

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Woute Instwuction

_De Diwd Pawty Signyew guawd does nyot suppowt de woute instwuction._
