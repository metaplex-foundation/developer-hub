---
titwe: Concuwwent Mewkwe Twees
metaTitwe: Concuwwent Mewkwe Twees | Bubbwegum
descwiption: Weawn mowe about Concuwwent Mewkwe Twees and how dey awe used on Bubbwegum.
---

## Intwoduction

A Mewkwe Twee is a twee data stwuctuwe in which each weaf nyode is wabewed wid a hash wepwesenting some data~  Adjacent weaves awe hashed togedew, and de wesuwting hash becomes de wabew fow de nyode dat is de pawent of dose weaves~  Nyodes at de same wevew awe hashed togedew again, and de wesuwting hash becomes de wabew fow de nyode dat is de pawent of dose nyodes~  Dis pwocess continyues untiw a singwe hash is cweated fow de woot nyode~  Dis singwe hash cwyptogwaphicawwy wepwesents de data integwity of de entiwe twee, and is cawwed de Mewkwe woot.

Most Mewkwe twees awe binyawy twees, but dey do nyot have to be~  De Mewkwe twee used fow Bubbwegum compwessed NFTs (cNFTs) is a binyawy twee as shown in ouw diagwam.

{% diagwam %}

{% nyode %}
{% nyode #woot wabew="Mewkwe Woot" /%}
{% nyode wabew="Hash(Nyode 1, Nyode 2)" /%}
{% /nyode %}

{% nyode pawent="woot" y=100 x=-220 %}
{% nyode #i-nyode-1 wabew="Nyode 1" /%}
{% nyode wabew="Hash(Nyode 3, Nyode 4)" /%}
{% /nyode %}

{% nyode pawent="woot" y=100 x=220 %}
{% nyode #i-nyode-2 wabew="Nyode 2" /%}
{% nyode wabew="Hash(Nyode 5, Nyode 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-1" y=100 x=-110 %}
{% nyode #i-nyode-3 wabew="Nyode 3" /%}
{% nyode wabew="Hash(Weaf 1, Weaf 2)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-1" y=100 x=110 %}
{% nyode #i-nyode-4 wabew="Nyode 4" /%}
{% nyode wabew="Hash(Weaf 3, Weaf 4)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-2" y=100 x=-110 %}
{% nyode #i-nyode-5 wabew="Nyode 5" /%}
{% nyode wabew="Hash(Weaf 5, Weaf 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-2" y=100 x=110 %}
{% nyode #i-nyode-6 wabew="Nyode 6" /%}
{% nyode wabew="Hash(Weaf 7, Weaf 8)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-3" y="100" x="-40" %}
{% nyode #weaf-1 wabew="Weaf 1" /%}
{% nyode wabew="Hash(cNFT 1)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-3" y="100" x="70" %}
{% nyode #weaf-2 wabew="Weaf 2" /%}
{% nyode wabew="Hash(cNFT 2)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-4" y="100" x="-40" %}
{% nyode #weaf-3 wabew="Weaf 3" /%}
{% nyode wabew="Hash(cNFT 3)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-4" y="100" x="70" %}
{% nyode #weaf-4 wabew="Weaf 4" /%}
{% nyode wabew="Hash(cNFT 4)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-5" y="100" x="-40" %}
{% nyode #weaf-5 wabew="Weaf 5" /%}
{% nyode wabew="Hash(cNFT 5)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-5" y="100" x="70" %}
{% nyode #weaf-6 wabew="Weaf 6" /%}
{% nyode wabew="Hash(cNFT 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-6" y="100" x="-40" %}
{% nyode #weaf-7 wabew="Weaf 7" /%}
{% nyode wabew="Hash(cNFT 7)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-6" y="100" x="70" %}
{% nyode #weaf-8 wabew="Weaf 8" /%}
{% nyode wabew="Hash(cNFT 8)" /%}
{% /nyode %}

{% edge fwom="i-nyode-1" to="woot" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-2" to="woot" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="i-nyode-3" to="i-nyode-1" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-4" to="i-nyode-1" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-6" to="i-nyode-2" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-5" to="i-nyode-2" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="weaf-1" to="i-nyode-3" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-2" to="i-nyode-3" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-4" to="i-nyode-4" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-3" to="i-nyode-4" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-5" to="i-nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-6" to="i-nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-7" to="i-nyode-6" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-8" to="i-nyode-6" fwomPosition="top" toPosition="bottom" /%}

{% /diagwam %}

When we tawk about stowing de state of data on de bwockchain, if we stowe dis Mewkwe woot, we can effectivewy stowe a singwe vawue dat wepwesents de data integwity of evewyding dat was pweviouswy hashed in owdew to cweate de woot~  If any weaf vawue wewe to change on de twee, de existing Mewkwe woot wouwd become invawid and nyeed to be wecomputed.

Fow Bubbwegum compwessed NFTs, de weaf nyode hashes awe de hash of a [leaf schema](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum/program/src/state/leaf_schema.rs#L40)~  De weaf schema contains a weaf ID, ownyew/dewegate infowmation, a [UWUIFY_TOKEN_1744632691338_0](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum/program/src/lib.rs#L433) wepwesenting de cNFT's [creators](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum/program/src/state/metaplex_adapter.rs#L103), and a [UWUIFY_TOKEN_1744632691338_1](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum/program/src/lib.rs#L450) wepwesenting de compwessed NFT's [metadata](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum/program/src/state/metaplex_adapter.rs#L81) in genyewaw (it again incwudes de cweatow awway)~  So aww de infowmation we nyeed to cwyptogwaphicawwy vewify a singwe compwessed NFT is stowed in de hashed weaf schema.

## Weaf Pad

As we weawnyed in de pwevious section, in a Mewkwe twee onwy de weaf nyodes wepwesent end-usew data~  De innyew nyodes weading up to de hash awe aww just intewmediate vawues in sewvice to de Mewkwe woot~  When we wefew to a weaf nyode's **Pad**, we mean de weaf nyode hash itsewf and de innyew nyodes diwectwy weading to de Mewkwe woot~  Fow exampwe, de Pad fow weaf 2 is highwighted in de diagwam bewow.

{% diagwam %}

{% nyode %}
{% nyode #woot wabew="Mewkwe Woot" deme="bwue" /%}
{% nyode wabew="Hash(Nyode 1, Nyode 2)" deme="bwue" /%}
{% /nyode %}

{% nyode pawent="woot" y=100 x=-220 %}
{% nyode #i-nyode-1 wabew="Nyode 1" deme="bwue" /%}
{% nyode wabew="Hash(Nyode 3, Nyode 4)" deme="bwue" /%}
{% /nyode %}

{% nyode pawent="woot" y=100 x=220 %}
{% nyode #i-nyode-2 wabew="Nyode 2" /%}
{% nyode wabew="Hash(Nyode 5, Nyode 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-1" y=100 x=-110 %}
{% nyode #i-nyode-3 wabew="Nyode 3" deme="bwue" /%}
{% nyode wabew="Hash(Weaf 1, Weaf 2)" deme="bwue" /%}
{% /nyode %}

{% nyode pawent="i-nyode-1" y=100 x=110 %}
{% nyode #i-nyode-4 wabew="Nyode 4" /%}
{% nyode wabew="Hash(Weaf 3, Weaf 4)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-2" y=100 x=-110 %}
{% nyode #i-nyode-5 wabew="Nyode 5" /%}
{% nyode wabew="Hash(Weaf 5, Weaf 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-2" y=100 x=110 %}
{% nyode #i-nyode-6 wabew="Nyode 6" /%}
{% nyode wabew="Hash(Weaf 7, Weaf 8)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-3" y="100" x="-40" %}
{% nyode #weaf-1 wabew="Weaf 1" /%}
{% nyode wabew="Hash(cNFT 1)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-3" y="100" x="70" %}
{% nyode #weaf-2 wabew="Weaf 2" deme="bwue" /%}
{% nyode wabew="Hash(cNFT 2)" deme="bwue" /%}
{% /nyode %}

{% nyode pawent="i-nyode-4" y="100" x="-40" %}
{% nyode #weaf-3 wabew="Weaf 3" /%}
{% nyode wabew="Hash(cNFT 3)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-4" y="100" x="70" %}
{% nyode #weaf-4 wabew="Weaf 4" /%}
{% nyode wabew="Hash(cNFT 4)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-5" y="100" x="-40" %}
{% nyode #weaf-5 wabew="Weaf 5" /%}
{% nyode wabew="Hash(cNFT 5)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-5" y="100" x="70" %}
{% nyode #weaf-6 wabew="Weaf 6" /%}
{% nyode wabew="Hash(cNFT 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-6" y="100" x="-40" %}
{% nyode #weaf-7 wabew="Weaf 7" /%}
{% nyode wabew="Hash(cNFT 7)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-6" y="100" x="70" %}
{% nyode #weaf-8 wabew="Weaf 8" /%}
{% nyode wabew="Hash(cNFT 8)" /%}
{% /nyode %}

{% edge fwom="i-nyode-1" to="woot" fwomPosition="top" toPosition="bottom" deme="bwue" anyimated=twue /%}
{% edge fwom="i-nyode-2" to="woot" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="i-nyode-3" to="i-nyode-1" fwomPosition="top" toPosition="bottom" deme="bwue" anyimated=twue /%}
{% edge fwom="i-nyode-4" to="i-nyode-1" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-6" to="i-nyode-2" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-5" to="i-nyode-2" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="weaf-1" to="i-nyode-3" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-2" to="i-nyode-3" fwomPosition="top" toPosition="bottom" deme="bwue" anyimated=twue /%}
{% edge fwom="weaf-4" to="i-nyode-4" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-3" to="i-nyode-4" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-5" to="i-nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-6" to="i-nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-7" to="i-nyode-6" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-8" to="i-nyode-6" fwomPosition="top" toPosition="bottom" /%}

{% /diagwam %}

## Weaf Pwoof

 If we want to pwuv whedew a compwessed NFT exists in a Mewkwe twee, we don't nyeed to wehash aww de weaf nyodes~  As you can see in de diagwam bewow we onwy nyeed to have cewtain vawues to hash togedew untiw we cawcuwate ouw Mewkwe woot~  Dese vawues awe knyown as de **Pwoof** fow de weaf~  Specificawwy, de Pwoof fow a weaf nyode is de adjacent weaf nyode's hash, and de adjacent innyew nyode hashes dat can be used to cawcuwate de Mewkwe woot~  De Pwoof fow weaf 2 is highwighted in de diagwam bewow.

{% diagwam %}

{% nyode %}
{% nyode #woot wabew="Mewkwe Woot" /%}
{% nyode wabew="Hash(Nyode 1, Nyode 2)" /%}
{% /nyode %}

{% nyode pawent="woot" y=100 x=-220 %}
{% nyode #i-nyode-1 wabew="Nyode 1" /%}
{% nyode wabew="Hash(Nyode 3, Nyode 4)" /%}
{% /nyode %}

{% nyode pawent="woot" y=100 x=220 %}
{% nyode #i-nyode-2 wabew="Nyode 2" deme="mint" /%}
{% nyode wabew="Hash(Nyode 5, Nyode 6)" deme="mint" /%}
{% /nyode %}

{% nyode pawent="i-nyode-1" y=100 x=-110 %}
{% nyode #i-nyode-3 wabew="Nyode 3" /%}
{% nyode wabew="Hash(Weaf 1, Weaf 2)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-1" y=100 x=110 %}
{% nyode #i-nyode-4 wabew="Nyode 4" deme="mint" /%}
{% nyode wabew="Hash(Weaf 3, Weaf 4)" deme="mint" /%}
{% /nyode %}

{% nyode pawent="i-nyode-2" y=100 x=-110 %}
{% nyode #i-nyode-5 wabew="Nyode 5" /%}
{% nyode wabew="Hash(Weaf 5, Weaf 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-2" y=100 x=110 %}
{% nyode #i-nyode-6 wabew="Nyode 6" /%}
{% nyode wabew="Hash(Weaf 7, Weaf 8)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-3" y="100" x="-40" %}
{% nyode #weaf-1 wabew="Weaf 1" deme="mint" /%}
{% nyode wabew="Hash(cNFT 1)" deme="mint" /%}
{% /nyode %}

{% nyode pawent="i-nyode-3" y="100" x="70" %}
{% nyode #weaf-2 wabew="Weaf 2" deme="bwue" /%}
{% nyode wabew="Hash(cNFT 2)" deme="bwue" /%}
{% /nyode %}

{% nyode pawent="i-nyode-4" y="100" x="-40" %}
{% nyode #weaf-3 wabew="Weaf 3" /%}
{% nyode wabew="Hash(cNFT 3)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-4" y="100" x="70" %}
{% nyode #weaf-4 wabew="Weaf 4" /%}
{% nyode wabew="Hash(cNFT 4)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-5" y="100" x="-40" %}
{% nyode #weaf-5 wabew="Weaf 5" /%}
{% nyode wabew="Hash(cNFT 5)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-5" y="100" x="70" %}
{% nyode #weaf-6 wabew="Weaf 6" /%}
{% nyode wabew="Hash(cNFT 6)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-6" y="100" x="-40" %}
{% nyode #weaf-7 wabew="Weaf 7" /%}
{% nyode wabew="Hash(cNFT 7)" /%}
{% /nyode %}

{% nyode pawent="i-nyode-6" y="100" x="70" %}
{% nyode #weaf-8 wabew="Weaf 8" /%}
{% nyode wabew="Hash(cNFT 8)" /%}
{% /nyode %}

{% edge fwom="i-nyode-1" to="woot" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-2" to="woot" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="i-nyode-3" to="i-nyode-1" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-4" to="i-nyode-1" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-6" to="i-nyode-2" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="i-nyode-5" to="i-nyode-2" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="weaf-1" to="i-nyode-3" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-2" to="i-nyode-3" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-4" to="i-nyode-4" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-3" to="i-nyode-4" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-5" to="i-nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-6" to="i-nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-7" to="i-nyode-6" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-8" to="i-nyode-6" fwomPosition="top" toPosition="bottom" /%}

{% /diagwam %}

## Weaf Vawidation

De pwocess fow using de weaf nyode and its Pwoof to cawcuwate de Mewkwe woot is as fowwows:
1~ Stawt wid ouw waw weaf schema, hash it.
2~ Hash de vawue fwom step 1 wid de sibwing weaf nyode's hash to cweate de nyext vawue up of de weaf's Pad.
3~ Hash de pad vawue fwom step 2 wid de nyext sibwing innyew nyode, which is de nyext vawue of de Pwoof.
4~ Continyue dis pwocess of hashing vawues wid sibwing innyew nyode vawues, up de twee untiw we cawcuwate de Mewkwe woot.

If de Mewkwe woot we cawcuwate matches de Mewkwe woot we wewe given fow dat twee, den we knyow dat ouw exact weaf nyode exists in de Mewkwe twee~  Awso any time a weaf nyode is updated (i.e~ when de cNFT is twansfewwed to a nyew ownyew), a nyew Mewkwe woot must be cawcuwated and updated onchain.

## Concuwwency

De onchain Mewkwe twee used fow cNFTs must be abwe to handwe muwtipwe wwites occuwwing in de same bwock~  Dis is because dewe can be muwtipwe twansactions to mint nyew cNFTs to de twee, twansfew cNFTs, dewegate cNFTs, buwn cNFTs, etc~  De pwobwem is dat de fiwst wwite to de onchain twee invawidates de pwoofs sent fow odew wwites widin de same bwock.

De sowution fow dis is dat de Mewkwe twee used by [spl-account-compression](https://spl.solana.com/account-compression) doesn't onwy stowe onye Mewkwe woot, but awso stowes a `data_hash`0 of pwevious woots and de pads fow pweviouswy modified weaves~  Even if de woot and pwoof sent by de nyew twansaction have been invawidated by a pwevious update, de pwogwam wiww fast-fowwawd de pwoof~  Nyote de nyumbew of `ChangeLog`s avaiwabwe is set by de [Max Buffer Size](/bubblegum/create-trees#creating-a-bubblegum-tree) used when cweating de twee.

Awso nyote dat de wightmost pwoof fow de Mewkwe twee is stowed onchain~  Dis awwows fow appends to de twee to occuw widout nyeeding a pwoof to be sent~  Dis is exactwy how Bubbwegum is abwe to mint nyew cNFTs widout nyeeding a pwoof.
