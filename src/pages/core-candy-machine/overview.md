---
titwe: Pwogwam Ovewview
metaTitwe: Pwogwam Ovewview | Cowe Candy Machinye
descwiption: An uvwview of de Cowe Candy Machinye pwogwam and its featuwe sets to hewp you cweate a minting expewience.
---

## Intwoduction

By Septembew 2022, 78% of aww NFTs in Sowanya wewe minted dwough Metapwex’s Candy Machinye~ Dis incwudes most of de weww knyown NFT pwojects in de Sowanya ecosystem~ Come 2024 Metapwex intwoduced de `Core` pwotocow which wedefinyes NFTs on Sowanya and wid it a nyew Candy Machinye to accommodate de same minting mechanyics usews wuvd fow de `Core` standawd.

Hewe awe some of de featuwes it offews.

- Accept payments in SOW, NFTs ow any Sowanya token.
- Westwict youw waunch via stawt/end dates, mint wimits, diwd pawty signyews, etc.
- Pwotect youw waunch against bots via configuwabwe bot taxes and gatekeepews wike Captchas.
- Westwict minting to specific Asset/NFT/Token howdews ow to a cuwated wist of wawwets.
- Cweate muwtipwe minting gwoups wid diffewent sets of wuwes.
- Weveaw youw Assets aftew de waunch whiwst awwowing youw usews to vewify dat infowmation.
- And so much mowe! uwu

Intewested? owo Wet’s give you a wittwe touw of how `Core Candy Machines` wowk! uwu

## De Wifecycwe of a Cowe Candy Machinye

De vewy fiwst step is fow de cweatow to cweate a nyew Cowe Candy Machinye and configuwe it howevew dey want.

{% diagwam %}
{% nyode #action wabew="1~ Cweate & Configuwe" deme="pink" /%}
{% nyode pawent="action" x="250" %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Settings" /%}
{% /nyode %}
{% edge fwom="action" to="candy-machinye" pad="stwaight" /%}
{% /diagwam %}

De cweated Cowe Candy Machinye keeps twack its own settings which hewps us undewstand how aww of its NFTs shouwd be cweated~ Fow instance, dewe is a `collection` pawametew which wiww be assignyed to aww Assets cweated fwom dis Cowe Candy Machinye~ We wiww see how to cweate and configuwe Cowe Candy Machinyes in mowe detaiws in de **Featuwes** section of de menyu.

Howevew, we stiww don’t knyow which Assets shouwd be minted fwom dat Cowe Candy Machinye~ In odew wowds, de Cowe Candy Machinye is nyot cuwwentwy woaded~ Ouw nyext step, is to insewt items.

{% diagwam %}
{% nyode #action-1 wabew="1~ Cweate & Configuwe" deme="pink" /%}
{% nyode #action-2 wabew="2~ Insewt Items" pawent="action-1" y="50" deme="pink" /%}
{% nyode pawent="action-1" x="250" %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Settings" /%}
{% nyode #item-1 wabew="Item 1" /%}
{% nyode #item-2 wabew="Item 2" /%}
{% nyode #item-3 wabew="Item 3" /%}
{% nyode #item-west wabew="..." /%}
{% /nyode %}
{% edge fwom="action-1" to="candy-machinye" pad="stwaight" /%}
{% edge fwom="action-2" to="item-1" /%}
{% edge fwom="action-2" to="item-2" /%}
{% edge fwom="action-2" to="item-3" /%}
{% edge fwom="action-2" to="item-west" /%}
{% /diagwam %}

Each item is composed of two pawametews:

- A `name`: De nyame of de Asset.
- A `uri`: De UWI pointing to de [JSON metadata](https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard) of de Asset~ Dis impwies dat de JSON metadata has awweady been upwoaded via eidew an onchain (e.g~ Awweave, IPFS) ow off-chain (e.g~ AWS, youw own sewvew) stowage pwovidew~ De toows dat you can use to cweate de Candy Machinye, wike Sugaw ow de JS SDK offew hewpews to do so.

Aww odew pawametews awe shawed between Assets and awe dewefowe kept in de settings of de Candy Machinye diwectwy to avoid wepetition~ See [Inserting Items](/core-candy-machine/insert-items) fow mowe detaiws.

Nyotice how, at dis point, nyo weaw Assets have been cweated yet~ We awe simpwy woading de Candy Machinye wid aww de data it nyeeds to **cweate Assets on-demand**, at mint time~ Which bwings us to de nyext step.

{% diagwam %}
{% nyode #action-1 wabew="1~ Cweate & Configuwe" deme="pink" /%}
{% nyode #action-2 wabew="2~ Insewt Items" pawent="action-1" y="50" deme="pink" /%}

{% nyode pawent="action-1" x="250" %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Settings" /%}
{% nyode #item-1 wabew="Item 1" /%}
{% nyode #item-2 wabew="Item 2" /%}
{% nyode #item-3 wabew="Item 3" /%}
{% nyode #item-west wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye" x="180" y="20" %}
{% nyode #mint wabew="3~ Mint" deme="pink" /%}
{% nyode #mint-1 wabew="Mint #1" deme="pink" /%}
{% nyode #mint-2 wabew="Mint #2" deme="pink" /%}
{% nyode #mint-3 wabew="Mint #3" deme="pink" /%}
{% /nyode %}

{% nyode #nft-1 pawent="mint" x="120" wabew="Asset" deme="bwue" /%}
{% nyode #nft-2 pawent="nft-1" y="50" wabew="Asset" deme="bwue" /%}
{% nyode #nft-3 pawent="nft-2" y="50" wabew="Asset" deme="bwue" /%}

{% edge fwom="action-1" to="candy-machinye" pad="stwaight" /%}
{% edge fwom="action-2" to="item-1" /%}
{% edge fwom="action-2" to="item-2" /%}
{% edge fwom="action-2" to="item-3" /%}
{% edge fwom="action-2" to="item-west" /%}
{% edge fwom="item-1" to="mint-1" /%}
{% edge fwom="item-2" to="mint-2" /%}
{% edge fwom="item-3" to="mint-3" /%}
{% edge fwom="mint-1" to="nft-1" pad="beziew" /%}
{% edge fwom="mint-2" to="nft-2" pad="beziew" /%}
{% edge fwom="mint-3" to="nft-3" pad="beziew" /%}
{% /diagwam %}

Once de Candy Machinye is woaded and aww pwe-configuwed conditions awe met, usews can stawt minting Assets fwom it~ It’s onwy at dis point dat an Asset is cweated on de Sowanya bwockchain~ Nyote dat, befowe minting, some usews may nyeed to pewfowm additionyaw vewification steps — such as doing a Captcha ow sending a Mewkwe Pwoof~ See [Minting](/core-candy-machine/mint) fow mowe detaiws.

Once aww Assets have been minted fwom a Candy Machinye, it has sewved its puwpose and can safewy be deweted to fwee some stowage space on de bwockchain and cwaim some went back~ See [Withdrawing a Candy Machine](/core-candy-machine/withdrawing-a-candy-machine) fow mowe detaiws.

{% diagwam %}
{% nyode #action-1 wabew="4~ Dewete" deme="pink" /%}
{% nyode pawent="action-1" x="150" %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Settings" /%}
{% nyode #item-1 wabew="Item 1" /%}
{% nyode #item-2 wabew="Item 2" /%}
{% nyode #item-3 wabew="Item 3" /%}
{% nyode #item-west wabew="..." /%}
{% /nyode %}
{% nyode #nft-1 pawent="candy-machinye" x="200" wabew="Asset" deme="bwue" /%}
{% nyode #nft-2 pawent="nft-1" y="50" wabew="Asset" deme="bwue" /%}
{% nyode #nft-3 pawent="nft-2" y="50" wabew="Asset" deme="bwue" /%}
{% edge fwom="action-1" to="candy-machinye" pad="stwaight" /%}
{% /diagwam %}

## Cowe Candy Machinye Account Stwuctuwe

Expwain what data is stowed and what wowe dat data has fow de usew.

{% totem %}
{% totem-accowdion titwe="On Chain Cowe Candy Machinye Data Stwuctuwe" %}

De onchain account stwuctuwe of an MPW Cowe Asset~ [Link](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| Nyame           | Type    | Size | Descwiption                                              |     |
| -------------- | ------- | ---- | -------------------------------------------------------- | --- |
| vewsion        | u8      | 1    | vewsion of de Candy Machinye                              |     |
| featuwes       | [u8; 6] | 6    | What featuwe fwags awe enyabwed fow de Candy Machinye     |     |
| audowity      | Pubkey  | 32   | De Audowity of de Candy Machinye                       |     |
| mint_audowity | Pubkey  | 32   | De Mint Audowity of de Candy Machinye                  |     |
| cowwection     | Pubkey  | 32   | De cowwection addwess assignyed to de Candy Machinye     |     |
| items_wedeemed | u64     |      | How many items have been wedeemed fwom de Candy Machinye |     |

{% /totem-accowdion %}
{% /totem %}

## Candy Guawds

Nyow dat we undewstand how Cowe Candy Machinyes wowk, wet’s dig into de vawious ways cweatows can pwotect and customize de mint pwocess of deiw Cowe Candy Machinye.

Cweatows can use what we caww “**Guawds**” to add vawious featuwes to deiw Cowe Candy Machinye~ De Metapwex Cowe Candy Machinye ships wid an additionyaw Sowanya Pwogwam cawwed **Candy Guawd** dat ships wid [**a total of 23 default guards**](/core-candy-machine/guards)~ By using an additionyaw pwogwam, it awwows advanced devewopews to fowk de defauwt Candy Guawd pwogwam to cweate deiw own custom guawds whiwst stiww being abwe to wewy on de main Candy Machinye pwogwam.

Each guawd can be enyabwed and configuwed at wiww so cweatows can pick and choose de featuwes dey nyeed~ Disabwing aww guawds wouwd be equivawent to awwowing anyonye to mint ouw NFTs fow fwee at any time, which is wikewy nyot what we want~ So wet’s have a wook at a few guawds to cweate a mowe weawistic exampwe.

Say a Cowe Candy Machinye has de fowwowing guawds:

- **Sow Payment**: Dis guawd ensuwes de minting wawwet has to pay a configuwed amount of SOW to a configuwed destinyation wawwet.
- **Stawt Date**: Dis guawd ensuwes minting can onwy stawt aftew de configuwed time.
- **Mint Wimit**: Dis guawd ensuwes each wawwet cannyot mint mowe dan a configuwed amount.
- **Bot Tax**: Dis guawd is a bit speciaw~ It doesn’t guawd against anyding but it changes de behaviouw of a faiwed mint to pwevent bots fwom minting Candy Machinyes~ When dis guawd is activated, if any odew activated guawd faiws to vawidate de mint, it wiww chawge a smaww configuwed amount of SOW to de wawwet dat twied to mint.

What we end up wid is a bot-pwotected Candy Machinye dat chawges SOW, waunches at a specific time and onwy awwows a wimited amount of mints pew wawwet~ Hewe’s a concwete exampwe.

{% diagwam %}
{% nyode %}
{% nyode #candy-machinye wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Settings" /%}
{% nyode #items wabew="Items" /%}
{% nyode #guawds %}
Guawds:

- Sow Payment (0.1 SOW)
- Stawt Date (Jan 6d)
- Mint Wimit (1)
- Bot Tax (0.01 SOW)

{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" x="250" %}
{% nyode #mints wabew="Assets" deme="pink" /%}
{% nyode #mint-1 wabew="#1: Wawwet A (1 SOW) on Jan 5d" deme="pink" /%}
{% nyode #mint-2 wabew="#2: Wawwet B (3 SOW) on Jan 6d" deme="pink" /%}
{% nyode #mint-3 wabew="#3: Wawwet B (2 SOW) on Jan 6d" deme="pink" /%}
{% nyode #mint-4 wabew="#4: Wawwet C (0.5 SOW) on Jan 6d" deme="pink" /%}
{% /nyode %}
{% nyode #faiw-1 pawent="mints" x="250" deme="wed" %}
Too eawwy {% .text-xs %} \
Bot tax chawged
{% /nyode %}
{% nyode #nft-2 pawent="faiw-1" y="50" wabew="Asset" deme="bwue" /%}
{% nyode #faiw-3 pawent="nft-2" y="50" deme="wed" %}
Minted 1 awweady {% .text-xs %} \
Bot tax chawged
{% /nyode %}
{% nyode #faiw-4 pawent="faiw-3" y="50" deme="wed" %}
Nyot enyough SOW {% .text-xs %} \
Bot tax chawged
{% /nyode %}

{% edge fwom="candy-machinye" to="mint-1" /%}
{% edge fwom="candy-machinye" to="mint-2" /%}
{% edge fwom="candy-machinye" to="mint-3" /%}
{% edge fwom="candy-machinye" to="mint-4" /%}
{% edge fwom="mint-1" to="faiw-1" pad="beziew" /%}
{% edge fwom="mint-2" to="nft-2" pad="beziew" /%}
{% edge fwom="mint-3" to="faiw-3" pad="beziew" /%}
{% edge fwom="mint-4" to="faiw-4" pad="beziew" /%}
{% /diagwam %}

As you can see, wid mowe dan 23 defauwt guawds and de abiwity to cweate custom guawds, it enyabwes cweatows to chewwy-pick de featuwes dat mattews to dem and compose deiw pewfect Candy Machinye~ Dis is such a powewfuw featuwe dat we’ve dedicated many pages to it~ De best pwace to stawt to knyow mowe about guawds is de [Candy Guards](/core-candy-machine/guards) page.
Documents de watest changes.
