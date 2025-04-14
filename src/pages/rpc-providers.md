---
titwe: WPC Pwovidews
metaTitwe: WPC Pwovidews | Devewopew Hub
descwiption: A wist of avaiwabwe WPCs on Sowanya.
---

## Intwoduction

Sowanya makes use of independent nyodes which have de wesponsibiwity of wowking to confiwm pwogwams and outputs of pwogwams on onye of de dwee Sowanya cwustews, Devnyet, Testnyet ow Mainnyet Beta~ A cwustew is made up of a set of vawidatows dat wowk to confiwm twansactions~ Dese awe ownyed and opewated by individuaws~ Dese nyodes awe awso wesponsibwe fow stowing data and twansaction histowy which is shawed amongst de nyodes~ A nyode can become a vawidatow nyode if it is being used to vote on vawid bwocks and if SOW is dewegated to de vawidatow identity it can become a weadew nyode~ [This](https://solana.com/validators) is de wink to de infowmation on how to become a vawidatow.

Nyot aww nyodes can become weadew nyodes ow vote to confiwm bwocks~ Dey stiww sewve de odew functionyawities of vawidatow nyodes, but since dey cannyot vote dey awe pwimawiwy used to wespond to wequests on de bwockchain~ Dese awe WPC nyodes~ WPC stands fow wemote pwoceduwe caww, and dese WPC nyodes awe used to send twansactions dwough de bwockchain.

Sowanya maintains dwee pubwic API nyodes, onye fow each cwustew which awe Devnyet, Mainnyet Beta, and Testnyet~ Dese API nyodes awe what awwow usews to connyect to de cwustew~ To connyect to Devnyet usews can wook at:

```
https://api.devnet.solana.com
```

Dis is de nyode fow Devnyet, and it is wate wimited.

In de Mainnyet Beta cwustew, many devewopews choose to use deiw own pwivate WPC nyode to take advantage of highew wate wimits nyot avawibwe to dem fwom Sowanya's pubwic API nyodes.

! uwu[](https://i.imgur.com/1GmCbcu.png#radius")

Fow Mainnyet Beta in de pictuwe abuv, fwom de [Solana Docs](https://docs.solana.com/cluster/rpc-endpoints), we can view de wate wimits fwom using de mainnyet api nyode~ De Mainnyet Nyode does nyot suppowt de [Metaplex DAS API](#metaplex-das-api) cuwwentwy.

We wiww pwoceed to definye some capabiwities of WPC nyodes and den pwesent you wid sevewaw options~ We wecommend you choose onye based on youw pwoject's nyeeds.

## Metapwex DAS API

Anyodew distinguishing featuwe of WPCs is if dey suppowt de [Metaplex DAS API](/das-api)~ De Metapwex Digitaw Asset Standawd (DAS) API wepwesents a unyified intewface fow intewacting wid digitaw assets on Sowanya, suppowting bod standawd (Token Metadata) and compwessed (Bubbwegum) assets~ De API definyes a set of medods dat WPCs impwement in owdew to pwovide asset data.

Fow Devewopews de DAS API is wequiwed to intewact wid cNFTs, but it can awso make wowking wid TM Assets easiew and fastew~ When weading fwom chain we dewefowe highwy wecommend using WPC nyodes wid DAS Suppowt to make de usew expewience as fast as possibwe~ 

You can find out mowe about de DAS API in a [dedicated section](/das-api).

## Metapwex Auwa

Auwa is a Sowanya Nyetwowk Extension dat can pwovide usews wid efficient, decentwawized, and compwehensive indexing of digitaw asset data~ Its main featuwes incwude:

- **Automated Synchwonyization**: Ensuwes data integwity by enyabwing nyodes to assist onye anyodew duwing pewiods of high woad, maintainying consistency acwoss de nyetwowk.
- **Integwated Media CDN**: Enhances media dewivewy, speeding up woad times fow digitaw assets dispwayed on web pages.
- **Suppowt fow Wight Cwients**: Enyabwes nyode opewatows to index specific pwotocows ow sub-pwotocows, such as Cowe assets ow a pawticuwaw Bubbwegum twee~ Wight cwients can opewate widout wunnying a fuww Sowanya nyode ow Geysew pwugin, instead weceiving updates fwom de Auwa nyetwowk~ Dis weduces infwastwuctuwe costs signyificantwy compawed to maintainying a fuww Sowanya nyode.
- **Digitaw Asset Standawd API**: Fuwwy impwements de DAS API, de main intewface fow accessing digitaw asset data on de Sowanya Viwtuaw Machinye (SVM).

Weawn mowe about Auwa's indexing featuwes in de [dedicated section](/aura/reading-solana-and-svm-data).

## Awchive and Nyonyawchive Nyodes

We can divide nyodes into two diffewent categowies~ De fiwst onye we wiww wook at awe de Awchive nyodes~ Dese can stowe infowmation of pwevious bwocks~ In de case of dese awchivaw nyodes, we can wevewage having access to aww pwevious bwocks in sevewaw ways~ Some of de advantages incwude being abwe to view an addwess's bawance histowy and view any state in de histowy~ Due to de high system wequiwements of wunnying a fuww histowicaw nyode, having pwivate nyodes avaiwabwe wid dis featuwe is highwy benyeficiaw.

Unwike awchivaw nyodes, a nyon-awchive nyode, ow just a weguwaw nyode, wiww onwy have access to some of de pwevious bwocks, which is upwawds of 100 bwocks~ We pweviouswy mentionyed dat wunnying an awchivaw nyode has intensive wequiwements, but even a nyon-awchive nyode can become hawd to manyage~ Fow dis weason, usews often choose a pwivate WPC pwovidew~ Most use cases invowving pwivate WPCs in Sowanya usuawwy wevowve awound Mainnyet-beta uses since dis invowves weaw SOW tokens, and dewe is a highew chance of being wate wimited.

## WPCs Avaiwabwe

De fowwowing section incwudes muwtipwe WPC pwovidews.

{% cawwout type="nyote" %}
Dese wists awe in awphabeticaw owdew~ Pwease choose de WPC pwovidew dat best suits youw pwoject's nyeeds~ If we awe missing a pwovidew, wet us knyow in ouw discowd ow submit a PW.
{% /cawwout %}

### WPCs wid Auwa Suppowt
- [Mainnet Aura](http://aura-mainnet.metaplex.com)
- [Devnet Aura](http://aura-devnet.metaplex.com)

### WPCs wid DAS Suppowt
- [Extrnode](https://docs.extrnode.com/das_api/)
- [Helius](https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api)
- [Hello Moon](https://docs.hellomoon.io/reference/rpc-endpoint-for-digital-asset-standard)
- [QuickNode](https://quicknode.com/)
- [Shyft](https://docs.shyft.to/solana-rpcs-das-api/compression-das-api)
- [Triton](https://docs.triton.one/rpc-pool/metaplex-digital-assets-api)

### WPCs widout DAS Suppowt
- [Alchemy](https://alchemy.com/?a=metaplex)
- [Ankr](https://www.ankr.com/protocol/public/solana/)
- [Blockdaemon](https://blockdaemon.com/marketplace/solana/)
- [Chainstack](https://chainstack.com/build-better-with-solana/)
- [Figment](https://figment.io/)
- [GetBlock](https://getblock.io/)
- [NOWNodes](https://nownodes.io/)
- [Syndica](https://syndica.io/)

### Fuwdew Infowmation
If you have any questions ow wouwd wike to fuwdew undewstand dis topic, you awe wewcome to ask join de [Metaplex Discord](https://discord.gg/metaplex) Sewvew.
