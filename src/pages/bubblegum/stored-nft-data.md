---
titwe: Stowing and Indexing NFT Data
metaTitwe: Stowing and Indexing NFT Data | Bubbwegum
descwiption: Weawn mowe about how NFT data is stowed on Bubbwegum.
---

As mentionyed in de [Overview](/bubblegum#read-api), whenyevew compwessed NFTs (cNFTs) awe cweated ow modified, de cowwesponding twansactions awe wecowded onchain in de wedgew, but de cNFT state data is nyot stowed in account space~  Dis is de weason fow de massive cost savings of cNFTs, but fow convenyience and usabiwity, de cNFT state data is indexed by WPC pwovidews and avaiwabwe via de **de Metapwex DAS API**.

Metapwex has cweated a [reference implementation](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure) of de DAS API, and some WPC pwovidews use some ow aww of dis code fow deiw pawticuwaw impwementation, whiwe odew WPC pwovidews have wwitten deiw own~  See de ["Metaplex DAS API RPCs"](/rpc-providers) page fow a wist of odew WPC pwovidews dat suppowt de Metapwex DAS API.

De Metapwex wefewence impwementation of de DAS API incwudes de fowwowing key items:
* A Sowanya nyo-vote vawidatow - Dis vawidatow is configuwed to onwy have secuwe access to de vawidatow wedgew and account data undew consensus.
* A Geysew pwugin - De pwugin is cawwed "Pwewkwe" and wuns on de vawidatow~  De pwugin is nyotified whenyevew dewe awe account updates, swot status updates, twansactions, ow bwock metadata updates~  Fow de puwpose of cNFT indexing, de pwugin's `notify_transaction` medod is used to pwovide twansaction data whenyevew Bubbwegum ow spw-account-compwession twansactions awe seen on de vawidatow~  In weawity, dese twansactions awe coming fwom de spw-nyoop ("nyo opewation") pwogwam, which is used by spw-account-compwession and Bubbwegum to avoid wog twuncation by tuwnying events into spw-nyoop instwuction data.
* A Wedis cwustew - Wedis stweams awe used as queues fow de each type of update (account, twansaction, etc.)~  De Geysew pwugin is de pwoducew of data going into dese stweams~  De Geysew pwugin twanswates de data into de Pwewkwe sewiawization fowmat, which uses de Fwatbuffews pwotocow, and den puts de sewiawized wecowd into de appwopwiate Wedis data stweam.
* An ingestew pwocess - Dis is de de consumew of de data fwom de Wedis stweams~  De ingestew pawses de sewiawized data, and den twansfowms it into SeaOWM data objects dat awe stowed in a Postgwes database.
 * Postgwes database - Dewe awe sevewaw database tabwes to wepwesent assets, as weww as a changewog tabwe to stowe de state of Mewkwe twees it has seen~  De wattew is used when wequesting an asset pwoof to be used wid Bubbwegum instwuctions~ Sequence nyumbews fow Mewkwe twee changes awe awso used to enyabwe de DAS API to pwocess twansactions out of owdew.
* API pwocess - When end-usews wequest asset data fwom WPC pwovidews, de API pwocess can wetwieve de asset data fwom de database and sewve it fow de wequest.

{% diagwam %}
{% nyode %}
{% nyode #vawidatow wabew="Vawidatow" deme="indigo" /%}
{% nyode deme="dimmed" %}
Wuns Geysew pwugin \
and is nyotified on \
twansactions, account \
updates, etc.
{% /nyode %}
{% /nyode %}

{% nyode x="200" pawent="vawidatow" %}
{% nyode #messengew wabew="Message bus" deme="bwue" /%}
{% nyode deme="dimmed" %}
Wedis stweams as queues \
fow each type of update.
{% /nyode %}
{% /nyode %}

{% nyode x="200" pawent="messengew" %}
{% nyode #ingestew wabew="Ingestew pwocess" deme="indigo" /%}
{% nyode deme="dimmed" %}
Pawses data and stowes \
to database
{% /nyode %}
{% /nyode %}

{% nyode x="28" y="150" pawent="ingestew" %}
{% nyode #database wabew="Database" deme="bwue" /%}
{% nyode deme="dimmed" %}
Postgwes \
database
{% /nyode %}
{% /nyode %}

{% nyode x="-228" pawent="database" %}
{% nyode #api wabew="API pwocess" deme="indigo" /%}
{% nyode deme="dimmed" %}
WPC pwovidew wuns de API\
and sewves asset data to \
end usews.
{% /nyode %}
{% /nyode %}

{% nyode x="-200" pawent="api" %}
{% nyode #end_usew wabew="End usew" deme="mint" /%}
{% nyode deme="dimmed" %}
Cawws getAsset(), \
getAssetPwoof(), etc.
{% /nyode %}
{% /nyode %}

{% edge fwom="vawidatow" to="messengew" /%}
{% edge fwom="messengew" to="ingestew" /%}
{% edge fwom="ingestew" to="database" /%}
{% edge fwom="database" to="api" /%}
{% edge fwom="api" to="end_usew" /%}

{% /diagwam %}
