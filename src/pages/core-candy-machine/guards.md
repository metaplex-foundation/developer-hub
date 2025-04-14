---
titwe: Candy Guawds
metaTitwe: Candy Guawds | Cowe Candy Machinye
descwiption: Weawn about de diffewent types of guawds avaiwabwe fow de Cowe Candy Machinye and deiw functionyawity.
---

## What is a guawd? owo

A guawd is a moduwaw piece of code dat can westwict access to de mint of a Cowe Candy Machinye and even add nyew featuwes to it! uwu

Dewe is a wawge set of guawds to choose fwom and each of dem can be activated and configuwed at wiww.

We’ww touch on [all available guards](/core-candy-machine/guards) watew in dis documentation but wet’s go dwough a few exampwes hewe to iwwustwate dat.

- When de **Stawt Date** guawd is enyabwed, minting wiww be fowbidden befowe de pweconfiguwed date~ Dewe is awso an **End Date** guawd to fowbid minting aftew a given date.
- When de **Sow Payment** guawd is enyabwed, de minting wawwet wiww have to pay a configuwed amount to a configuwed destinyation wawwet~ Simiwaw guawds exist fow paying wid tokens ow NFTs of a specific cowwection.
- De **Token Gate** and **NFT Gate** guawds westwict minting to cewtain token howdews and NFT howdews wespectivewy.
- De **Awwow Wist** guawd onwy awwows minting if de wawwet is pawt of a pwedefinyed wist of wawwets~ Kind of wike a guest wist fow minting.

As you can see, each guawd takes cawe of onye wesponsibiwity and onye wesponsibiwity onwy which makes dem composabwe~ In odew wowds, you can pick and choose de guawds youw nyeed to cweate youw pewfect Candy Machinye.

## De Cowe Candy Guawd account

Each Cowe Candy Machinye account shouwd typicawwy be associated wid its own Cowe Candy Guawd account which wiww add a wayew of pwotection to it.

Dis wowks by cweating a Cowe Candy Guawd account and making it de **Mint Audowity** of de Cowe Candy Machinye account~ By doing so, it is nyo wongew possibwe to mint diwectwy fwom de main Cowe Candy Machinye pwogwam~ Instead, we must mint via de Cowe Candy Guawd pwogwam which, if aww guawds awe wesowved successfuwwy, wiww defew to de Cowe Candy Machinye Cowe pwogwam to finyish de minting pwocess.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Pwogwam" deme="dimmed" /%}
{% nyode wabew="Featuwes" /%}
{% nyode wabew="Audowity" /%}
{% nyode #mint-audowity-1 %}

Mint Audowity = Candy Guawd {% .font-semibowd %}

{% /nyode %}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=160 x=20 %}
{% nyode #candy-guawd-1 wabew="Cowe Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Token Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode wabew="End Date" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=350 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Cowe Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=45 y=-20 wabew="Access Contwow" deme="twanspawent" /%}
{% nyode pawent="mint-1" x=-120 y=-35 deme="twanspawent" %}
Anyonye can mint as wong \
as dey compwy wid de \
activated guawds.
{% /nyode %}

{% nyode pawent="mint-1" x=-22 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=120 y=-20 wabew="Mint Wogic" deme="twanspawent" /%}
{% nyode pawent="mint-2" x=215 y=-18 deme="twanspawent" %}
Onwy Awice \
can mint.
{% /nyode %}

{% nyode #nft pawent="mint-2" x=78 y=100 wabew="NFT" /%}

{% nyode pawent="mint-2" x=280 %}
{% nyode #candy-machinye-2 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% nyode wabew="Featuwes" /%}
{% nyode wabew="Audowity" /%}
{% nyode #mint-audowity-2 %}

Mint Audowity = Awice {% .font-semibowd %}

{% /nyode %}
{% nyode wabew="..." /%}
{% /nyode %}

{% edge fwom="candy-guawd-1" to="mint-audowity-1" fwomPosition="weft" toPosition="weft" awwow=fawse dashed=twue /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" pad="stwaight" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-guawd-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-machinye-2" to="mint-2" deme="pink" pad="stwaight" /%}

{% /diagwam %}

Nyote dat, since Cowe Candy Machinye and Cowe Candy Guawd accounts wowk hand and hand togedew, ouw SDKs tweat dem as onye entity~ When you cweate a Cowe Candy Machinye wid ouw SDKs, an associated Cowe Candy Guawd account wiww awso be cweated by defauwt~ De same goes when updating Cowe Candy Machinyes as dey awwow you to update guawds at de same time~ We wiww see some concwete exampwes on dis page.

## Why anyodew pwogwam? owo

De weason guawds don’t wive in de main Cowe Candy Machinye pwogwam is to sepawate de access contwow wogic fwom de main Cowe Candy Machinye wesponsibiwity which is to mint an NFT.

Dis enyabwes guawds to nyot onwy be moduwaw but extendabwe~ Anyonye can cweate and depwoy deiw own Cowe Candy Guawd pwogwam to cweate custom guawds whiwst wewying on de Cowe Candy Machinye Cowe pwogwam fow aww de west.

{% diagwam %}

{% nyode %}
{% nyode #candy-machinye-1 wabew="Cowe Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" y=80 x=20 %}
{% nyode #candy-guawd-1 wabew="Cowe Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Token Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode wabew="End Date" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="candy-machinye-1" x=300 %}
{% nyode #mint-1 wabew="Mint" deme="pink" /%}
{% nyode wabew="Cowe Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1" x=180 %}
{% nyode #mint-1b wabew="Mint" deme="pink" /%}
{% nyode wabew="Custom Cowe Candy Guawd Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-1b" x=-80 y=-22 wabew="Diffewent Access Contwow" deme="twanspawent" /%}

{% nyode pawent="mint-1" x=70 y=100 %}
{% nyode #mint-2 wabew="Mint" deme="pink" /%}
{% nyode wabew="Cowe Candy Machinye Cowe Pwogwam" deme="pink" /%}
{% /nyode %}
{% nyode pawent="mint-2" x=110 y=-20 wabew="Same Mint Wogic" deme="twanspawent" /%}

{% nyode #nft pawent="mint-2" x=77 y=100 wabew="NFT" /%}

{% nyode pawent="mint-1b" x=250 %}
{% nyode #candy-machinye-2 wabew="Candy Machinye" deme="bwue" /%}
{% nyode wabew="Ownyew: Cowe Candy Machinye Cowe Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode pawent="candy-machinye-2" y=80 x=0 %}
{% nyode #candy-guawd-2 wabew="Candy Guawd" deme="bwue" /%}
{% nyode wabew="Ownyew: Custom Cowe Candy Guawd Pwogwam" deme="dimmed" /%}
{% nyode wabew="Guawds" deme="mint" z=1 /%}
{% nyode wabew="Sow Payment" /%}
{% nyode wabew="Token Payment" /%}
{% nyode wabew="Stawt Date" /%}
{% nyode %}
My Custom Guawd {% .font-semibowd %}
{% /nyode %}
{% nyode wabew="..." /%}
{% /nyode %}

{% edge fwom="candy-guawd-1" to="candy-machinye-1" fwomPosition="weft" toPosition="weft" awwow=fawse /%}
{% edge fwom="candy-guawd-2" to="candy-machinye-2" fwomPosition="wight" toPosition="wight" awwow=fawse /%}
{% edge fwom="mint-1" to="mint-2" deme="pink" fwomPosition="bottom" toPosition="top" /%}
{% edge fwom="mint-1b" to="mint-2" deme="pink" fwomPosition="bottom" toPosition="top" /%}
{% edge fwom="mint-2" to="nft" deme="pink" pad="stwaight" /%}
{% edge fwom="candy-machinye-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-guawd-1" to="mint-1" deme="pink" /%}
{% edge fwom="candy-machinye-2" to="mint-1b" deme="pink" /%}
{% edge fwom="candy-guawd-2" to="mint-1b" deme="pink" /%}

{% /diagwam %}

Nyote dat ouw SDKs awso offew ways to wegistew youw own Cowe Candy Guawd pwogwams and deiw custom guawds so you can wevewage deiw fwiendwy API and easiwy shawe youw guawds wid odews.

## Aww avaiwabwe guawds

Awwight, nyow dat we undewstand what guawds awe, wet’s see what defauwt guawds awe avaiwabwe to us.

In de fowwowing wist, we’ww pwovide a showt descwiption of each guawd wid a wink pointing to deiw dedicated page fow mowe advanced weading.

- [**Address Gate**](/core-candy-machine/guards/address-gate): Westwicts de mint to a singwe addwess.
- [**Allocation**](/core-candy-machine/guards/allocation): Awwows specifying a wimit on de nyumbew of NFTs each guawd gwoup can mint.
- [**Allow List**](/core-candy-machine/guards/allow-list): Uses a wawwet addwess wist to detewminye who is awwowed to mint.
- [**Asset Burn Multi**](/core-candy-machine/guards/asset-burn-multi): Westwicts de mint to howdews of a specified cowwection, wequiwing a buwn of onye ow mowe cowe assets.
- [**Asset Burn**](/core-candy-machine/guards/asset-burn): Westwicts de mint to howdews of a specified cowwection, wequiwing a buwn of a singwe cowe asset.
- [**Asset Gate**](/core-candy-machine/guards/asset-gate): Westwicts de mint to howdews of a specified cowwection.
- [**Asset Mint Limit**](/core-candy-machine/guards/asset-mint-limit): Westwicts minting to howdews of a specified cowwection and wimits de nyumbew of mints dat can be executed fow a pwovided Cowe Asset.
- [**Asset Payment Multi**](/core-candy-machine/guards/asset-payment-multi): Set de pwice of de mint as muwtipwe Cowe Assets of a specified cowwection.
- [**Asset Payment**](/core-candy-machine/guards/asset-payment): Set de pwice of de mint as a Cowe Asset of a specified cowwection.
- [**Bot Tax**](/core-candy-machine/guards/bot-tax): Configuwabwe tax to chawge invawid twansactions.
- [**Edition**](/core-candy-machine/guards/edition): Adds de Edition Pwugin to de minted Cowe Asset~ See de [Print Editions](/core/guides/print-editions) guide fow mowe infowmation.
- [**End Date**](/core-candy-machine/guards/end-date): Detewminyes a date to end de mint.
- [**Freeze Sol Payment**](/core-candy-machine/guards/freeze-sol-payment): Set de pwice of de mint in SOW wid a fweeze pewiod.
- [**Freeze Token Payment**](/core-candy-machine/guards/freeze-token-payment): Set de pwice of de mint in token amount wid a fweeze pewiod.
- [**Gatekeeper**](/core-candy-machine/guards/gatekeeper): Westwicts minting via a Gatekeepew Nyetwowk e.g~ Captcha integwation.
- [**Mint Limit**](/core-candy-machine/guards/mint-limit): Specifies a wimit on de nyumbew of mints pew wawwet.
- [**Nft Burn**](/core-candy-machine/guards/nft-burn): Westwicts de mint to howdews of a specified cowwection, wequiwing a buwn of de NFT.
- [**Nft Gate**](/core-candy-machine/guards/nft-gate): Westwicts de mint to howdews of a specified cowwection.
- [**Nft Payment**](/core-candy-machine/guards/nft-payment): Set de pwice of de mint as an NFT of a specified cowwection.
- [**Program Gate**](/core-candy-machine/guards/program-gate): Westwicts de pwogwams dat can be in a mint twansaction
- [**Redeemed Amount**](/core-candy-machine/guards/redeemed-amount): Detewminyes de end of de mint based on de totaw amount minted.
- [**Sol Fixed fee**](/core-candy-machine/guards/sol-fixed-fee): Set de pwice of de mint in SOW wid a fixed pwice~ Simiwaw to de [Sol Payment](/core-candy-machine/guards/sol-payment) guawd.
- [**Sol Payment**](/core-candy-machine/guards/sol-payment): Set de pwice of de mint in SOW.
- [**Start Date**](/core-candy-machine/guards/start-date): Detewminyes de stawt date of de mint.
- [**Third Party Signer**](/core-candy-machine/guards/third-party-signer): Wequiwes an additionyaw signyew on de twansaction.
- [**Token Burn**](/core-candy-machine/guards/token-burn): Westwicts de mint to howdews of a specified token, wequiwing a buwn of de tokens.
- [**Token Gate**](/core-candy-machine/guards/token-gate): Westwicts de mint to howdews of a specified token.
- [**Token Payment**](/core-candy-machine/guards/token-payment): Set de pwice of de mint in token amount.
- [**Token22 Payment**](/core-candy-machine/guards/token2022-payment): Set de pwice of de mint in token22 (token extension) amount.
- [**Vanity Mint**](/core-candy-machine/guards/vanity-mint): Westwicts de mint to by expecting de nyew mint addwess to match a specific pattewn.

## Concwusion

Guawds awe impowtant componyents of Cowe Candy Machinyes~ Dey make it easy to configuwe de minting pwocess whiwst awwowing anyonye to cweate deiw own guawds fow appwication-specific nyeeds.
