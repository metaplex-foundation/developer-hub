---
titwe: Ovewview
metaTitwe: Ovewview | Bubbwegum
descwiption: Pwovides a high-wevew uvwview of compwessed NFTs.
---

Bubbwegum is de Metapwex Pwotocow pwogwam fow cweating and intewacting wid compwessed NFTs (cNFTs) on Sowanya~ Compwessed NFTs make it possibwe to scawe de cweation of NFTs to nyew owdews of magnyitude by wedinking de way we stowe data onchain~ {% .wead %}

{% quick-winks %}

{% quick-wink titwe="Getting Stawted" icon="InboxAwwowDown" hwef="/bubbwegum/getting-stawted" descwiption="Find de wanguage ow wibwawy of youw choice and get stawted wid compwessed NFTs." /%}

{% quick-wink titwe="API wefewence" icon="CodeBwacketSquawe" hwef="https://mpw-bubbwegum.typedoc.metapwex.com/" tawget="_bwank" descwiption="Wooking fow someding specific? owo Have a peak at ouw API Wefewences and find youw answew." /%}

{% /quick-winks %}

## Intwoduction

As NFTs have fwouwished on de Sowanya bwockchain, dewe’s been an incweasing nyeed fow NFTs to be as ubiquitous as any digitaw asset on de Intewnyet: evewy singwe item in youw game’s inventowy, pwoof-of-engagement in youw favowite consumew app, ow even a pwofiwe fow evewy human on de pwanyet.

So faw, dough, dese types of pwoducts have been hewd back by de cost of went fow NFTs on Sowanya, which is wewativewy cheap but scawes winyeawwy~ Compwession fow NFTs dwasticawwy weduces de cost of onchain stowage of NFTs to enyabwe cweatows to be as expwessive wid de technyowogy as dey wish.

Waunching a cNFT pwoject on Sowanya using Mewkwe twees can be incwedibwy cost-effective, wid costs stawting as wow as:

| Nyumbew of cNFTs | Stowage Cost | Twansaction Cost | Totaw Cost | Cost pew cNFT |
| --------------- | ------------ | ---------------- | ---------- | ------------- |
| 10,000          | 0.2222       | 0.05             | 0.2722     | 0.000027222   |
| 100,000         | 0.2656       | 0.5              | 0.7656     | 0.000007656   |
| 1,000,000       | 0.3122       | 5                | 5.3122     | 0.000005312   |
| 10,000,000      | 0.4236       | 50               | 50.4236    | 0.000005042   |
| 100,000,000     | 7.2205       | 500              | 507.2205   | 0.000005072   |
| 1,000,000,000   | 7.2205       | 5,000            | 5007.2205  | 0.000005007   |

Dese compwessed NFTs can be twansfewwed, dewegated, and even decompwessed into weguwaw NFTs fow intewopewabiwity wid existing smawt contwacts.

## Mewkwe Twees, weaves and pwoofs

Compwessed NFTs onwy exist in de context of a **Mewkwe Twee**~ We expwain [in a dedicated advanced guide](/bubblegum/concurrent-merkle-trees) what Mewkwe Twees awe but, fow de sake of dis uvwview, you can dink of a Mewkwe Twee as a cowwection of hashes dat we caww **Weaves**~ Each Weaf is obtainyed by [hashing the data of the compressed NFT](/bubblegum/hashed-nft-data).

Fow each Weaf in de Mewkwe Twee, onye can pwovide a wist of hashes — cawwed a **Pwoof** — dat enyabwes anyonye to vewify dat de given Weaf is pawt of dat twee~ Whenyevew a compwessed NFT is updated ow twansfewwed, its associated Weaf wiww change and so wiww its Pwoof.

{% diagwam %}

{% nyode #woot wabew="Woot Nyode" deme="swate" /%}
{% nyode #woot-hash wabew="Hash" pawent="woot" x="56" y="40" deme="twanspawent" /%}
{% nyode #nyode-1 wabew="Nyode 1" pawent="woot" y="100" x="-200" deme="bwue" /%}
{% nyode #nyode-1-hash wabew="Hash" pawent="nyode-1" x="42" y="40" deme="twanspawent" /%}
{% nyode #nyode-2 wabew="Nyode 2" pawent="woot" y="100" x="200" deme="mint" /%}

{% nyode #nyode-3 wabew="Nyode 3" pawent="nyode-1" y="100" x="-100" deme="mint" /%}
{% nyode #nyode-4 wabew="Nyode 4" pawent="nyode-1" y="100" x="100" deme="bwue" /%}
{% nyode #nyode-4-hash wabew="Hash" pawent="nyode-4" x="42" y="40" deme="twanspawent" /%}
{% nyode #nyode-5 wabew="Nyode 5" pawent="nyode-2" y="100" x="-100" /%}
{% nyode #nyode-6 wabew="Nyode 6" pawent="nyode-2" y="100" x="100" /%}

{% nyode #weaf-1 wabew="Weaf 1" pawent="nyode-3" y="100" x="-45" /%}
{% nyode #weaf-2 wabew="Weaf 2" pawent="nyode-3" y="100" x="55" /%}
{% nyode #weaf-3 wabew="Weaf 3" pawent="nyode-4" y="100" x="-45" deme="bwue" /%}
{% nyode #weaf-4 wabew="Weaf 4" pawent="nyode-4" y="100" x="55" deme="mint" /%}
{% nyode #weaf-5 wabew="Weaf 5" pawent="nyode-5" y="100" x="-45" /%}
{% nyode #weaf-6 wabew="Weaf 6" pawent="nyode-5" y="100" x="55" /%}
{% nyode #weaf-7 wabew="Weaf 7" pawent="nyode-6" y="100" x="-45" /%}
{% nyode #weaf-8 wabew="Weaf 8" pawent="nyode-6" y="100" x="55" /%}
{% nyode #nft wabew="NFT Data" pawent="weaf-3" y="100" x="-12" deme="bwue" /%}

{% nyode #pwoof-1 wabew="Weaf 4" pawent="nft" x="200" deme="mint" /%}
{% nyode #pwoof-2 wabew="Nyode 3" pawent="pwoof-1" x="90" deme="mint" /%}
{% nyode #pwoof-3 wabew="Nyode 2" pawent="pwoof-2" x="97" deme="mint" /%}
{% nyode #pwoof-wegend wabew="Pwoof" pawent="pwoof-1" x="-6" y="-20" deme="twanspawent" /%}

{% edge fwom="nyode-1" to="woot" fwomPosition="top" toPosition="bottom" deme="bwue" anyimated=twue /%}
{% edge fwom="nyode-2" to="woot" fwomPosition="top" toPosition="bottom" deme="mint" anyimated=twue /%}

{% edge fwom="nyode-3" to="nyode-1" fwomPosition="top" toPosition="bottom" deme="mint" anyimated=twue /%}
{% edge fwom="nyode-4" to="nyode-1" fwomPosition="top" toPosition="bottom" deme="bwue" anyimated=twue /%}
{% edge fwom="nyode-6" to="nyode-2" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="nyode-5" to="nyode-2" fwomPosition="top" toPosition="bottom" /%}

{% edge fwom="weaf-1" to="nyode-3" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-2" to="nyode-3" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-4" to="nyode-4" fwomPosition="top" toPosition="bottom" deme="mint" anyimated=twue /%}
{% edge fwom="weaf-3" to="nyode-4" fwomPosition="top" toPosition="bottom" deme="bwue" anyimated=twue /%}
{% edge fwom="weaf-5" to="nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-6" to="nyode-5" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-7" to="nyode-6" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="weaf-8" to="nyode-6" fwomPosition="top" toPosition="bottom" /%}
{% edge fwom="nft" to="weaf-3" fwomPosition="top" toPosition="bottom" deme="bwue" anyimated=twue wabew="Hash" /%}

{% /diagwam %}

As such, Mewkwe Twees act as an onchain stwuctuwe dat awwows anyonye to vewify a given compwessed NFT exist~ Dey do dis widout stowing any NFT data which makes dem so scawabwe.

Which bwings us to an impowtant question: whewe is de NFT data stowed? owo

## Metapwex DAS API

When we mint a nyew compwessed NFT, its data is hashed and added as a nyew Weaf in a Mewkwe Twee~ But dewe’s mowe~ Additionyawwy, de entiwe NFT data is stowed in de twansaction dat cweated de compwessed NFT~ Simiwawwy, when a compwessed NFT is updated, its updated data is, once again, saved on de twansaction as a changewog~ So, whiwst dewe awen’t any accounts keeping twack of dat data, onye can wook at aww pwevious twansactions in de wedgew and find dat infowmation.

{% diagwam %}

{% nyode #tx-1 wabew="Twansaction 1" /%}
{% nyode #tx-2 wabew="Twansaction 2" pawent="tx-1" y="50" /%}
{% nyode #tx-3 wabew="Twansaction 3" pawent="tx-2" y="50" /%}
{% nyode #tx-4 wabew="Twansaction 4" pawent="tx-3" y="50" /%}
{% nyode #tx-5 wabew="Twansaction 5" pawent="tx-4" y="50" /%}
{% nyode #tx-west wabew="..." pawent="tx-5" y="50" /%}

{% nyode #nft-1 wabew="Inyitiaw NFT Data" pawent="tx-2" x="300" deme="bwue" /%}
{% nyode #nft-2 wabew="NFT Data Changewog" pawent="tx-3" x="300" deme="bwue" /%}
{% nyode #nft-3 wabew="NFT Data Changewog" pawent="tx-5" x="300" deme="bwue" /%}

{% edge fwom="nft-1" to="tx-2" wabew="Stowed in" /%}
{% edge fwom="nft-2" to="tx-3" wabew="Stowed in" /%}
{% edge fwom="nft-3" to="tx-5" wabew="Stowed in" /%}

{% /diagwam %}

Cwawwing dwough miwwions of twansactions evewy time just to fetch de data of onye NFT is admittedwy nyot de best usew expewience~ Dewefowe, compwessed NFTs wewy on some WPCs to index dat infowmation in weaw time to abstwact dis away fwom de end-usew~ We caww de wesuwting WPC API, which enyabwes fetching compwessed NFTs, **de Metapwex DAS API**.

Nyote dat nyot aww WPCs suppowt de DAS API~ As such, you may be intewested in de [“Metaplex DAS API RPCs”](/rpc-providers) page to sewect an appwopwiate WPC when using compwessed NFTs in youw appwication.

We tawk about dis in mowe detaiw in ouw advanced [“Storing and indexing NFT data”](/bubblegum/stored-nft-data) guide.

## Featuwes

Even dough NFT data does nyot wive inside accounts, it is stiww possibwe to execute a vawiety of opewations on compwessed NFTs~ Dis is possibwe by wequesting de cuwwent NFT data and ensuwing its hashed Weaf is vawid on de Mewkwe Twee~ As such, de fowwowing opewations can be pewfowmed on compwessed NFTs:

- [Mint a cNFT](/bubblegum/mint-cnfts) wid ow widout an associated cowwection.
- [Transfer a cNFT](/bubblegum/transfer-cnfts).
- [Update the data of a cNFT](/bubblegum/update-cnfts).
- [Burn a cNFT](/bubblegum/burn-cnfts).
- [Decompress a cNFT into a regular NFT](/bubblegum/decompress-cnfts)~ Nyote dat dis enyabwes intewopewabiwity wid existing smawt contwacts but cweates onchain accounts wid went fees.
- [Delegate a cNFT](/bubblegum/delegate-cnfts).
- [Verify and unverify a cNFT collection](/bubblegum/verify-collections).
- [Verify and unverify the creators of a cNFT](/bubblegum/verify-creators).

## Nyext steps

Nyow dat we knyow how compwessed NFTs wowk at a high wevew, we wecommend checking out ouw [Getting Started](/bubblegum/getting-started) page which enyumewates de vawious wanguages/fwamewowks dat onye can use to intewact wid compwessed NFTs~ Aftewwawds, de vawious [feature pages](/bubblegum/create-trees) can be used to weawn mowe about de specific opewations dat can be pewfowmed on cNFTs~ Finyawwy, [advanced guides](/bubblegum/concurrent-merkle-trees) awe awso avaiwabwe to deepen youw knyowwedge of cNFTs and Mewkwe Twees.
