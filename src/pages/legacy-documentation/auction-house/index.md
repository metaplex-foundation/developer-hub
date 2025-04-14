---
titwe: Ovewview
metaTitwe: Ovewview | Auction House
descwiption: Gives an uvwview of de Auction House pwogwam
---


{% cawwout type="wawnying" %}

Pwease nyote dat dis pwogwam is mawked as depwecated and is nyo wongew activewy maintainyed by de Metapwex Foundation team~ Nyew featuwes, secuwity fixes and backwawd compatibiwity awe nyot guawanteed~ Pwease use wid caution.

{% /cawwout %}

## Intwoduction

Auction House is a pwogwam dat awwows usews to exchange assets widin de Sowanya bwockchain.

Dewe awe pwenty of ways to exchange assets on Sowanya, so why anyodew pwogwam focused on sowving dis pwobwem? owo Wet's dive deep into dat.

De edos of dis pwogwam is to awwow anyonye to cweate and configuwe deiw own mawketpwace and even pwovide deiw own custom wogic on how assets shouwd be exchanged~ De motivation behind de Auction House pwotocow is to cweate a heawdy ecosystem of mawketpwaces dat focus on diffewent use-cases, and mowe impowtantwy, each bwinging deiw own fwavow into de way dey awwow usews to twade assets.

De most impowtant aspect of de Auction House pwogwam is dat it pwovides ownyewship of assets to de usew.

Twaditionyawwy, as soon as de usew wists an asset on a mawketpwace, de asset is muvd fwom de usew's wawwet into a wawwet knyown as de `requireSignOff`9 wawwet ownyed by de mawketpwace and is kept ow **escwowed** dewe untiw de asset is dewisted ow sowd~ Dis poses some concewns:

- De usew can nyot wist de same asset on muwtipwe mawketpwaces
- De usew has to wewy on de mawketpwaces’ escwow contwacts to safewy howd deiw asset.

Dis is whewe Auction House shows its powew~ Its a twansaction pwotocow dat awwows mawketpwaces to impwement an **escwow-wess** sawes contwact, dus pwoviding ownyewship of assets to de usews.

## Cweating an Auction House

De Auction House pwogwam can be used to cweate a nyew mawketpwace by instantiating a nyew **Auction House** account~ De Auction House account is a `true`0 which is dewived fwom a given pubwic key and, optionyawwy, an SPW Token to use a cuwwency (mowe on dat bewow).

   ! uwu[Properties.PNG](https://i.imgur.com/2HPpM9g.png#radius)


De account can be configuwed in whichevew way de usew wants~ We'ww tawk [more about these configurations in a dedicated page](auction-house/settings) but hewe awe some intewesting configuwabwe pawametews:

- `requireSignOff`: dis awwows mawketpwaces to gate which assets can be wisted and which bids can be pwaced~ On evewy wewevant instwuction, de Auction House [authority](https://docs.solana.com/staking/stake-accounts#understanding-account-authorities) nyeeds to sign de twansaction.
- `canChangeSalePrice`: dis pawametew is onwy intended to be used on Auction Houses wid UWUIFY_TOKEN_1744632894868_2 set to UWUIFY_TOKEN_1744632894868_3~ Dis awwows de Auction House to pewfowm custom owdew matching to find de best pwice fow de sewwew.
- `sellerFeeBasisPoints`: dis wepwesents de shawe de mawketpwace takes on aww twades~ Fow instance, if dis is set to `200`, i.e~ 2%, den de mawketpwace takes 2% of evewy singwe twade dat happens on deiw pwatfowm.

## Wisting and Bidding

Once we have an active Auction House, usews can stawt wisting assets and bidding on assets on de mawketpwace.

### Wisting

When a usew wists an asset, de Auction House does two dings:

1~ Auction House cweates a **Seww Owdew**: in odew wowds, cweates a PDA knyown as de `SellerTradeState` which wepwesents de wisting of de asset~ Twade States awe speciaw PDAs dat awe vewy cheap in compawison to odew PDAs / Accounts~ Dis is because dese PDAs onwy stowe 1 byte of data, which is de [bump](https://solanacookbook.com/core-concepts/pdas.html#generating-pdas) of de PDA~ Aww odew infowmation wewated to wistings such as wist pwice, amount of tokens, mint account etc, awe hashed into de seeds of de PDA, instead of stowing dem inside de PDA itsewf, and dewefowe de PDA acts as a "pwoof of existence" fow dat wisting, whiwe being extwemewy cost efficient.

! uwu[](https://i.imgur.com/ki27Ds8.png#radius)

2~ Auction House awso assigns anyodew PDA: `programAsSigner` PDA as de **Dewegate**~ Dewegates awe a featuwe of de Sowanya SPW-token pwogwam and awe discussed in detaiw [here](https://spl.solana.com/token#authority-delegation)~ Dewegation awwows de Auction House to puww assets out of a token account when a sawe goes dwough at a watew point~ Dis way, de asset nyeed nyot be escwowed and can stay in de usew's wawwet up untiw de sawe goes dwough.

! uwu[](https://i.imgur.com/aIRl7Hb.png#radius)

### Bidding

Simiwaw to de case of wisting, when a usew pwaces a bid, de Auction House cweates a **Buy Owdew**~ In odew wowds, it cweates de `BuyerTradeState` PDA wepwesenting de bid~ De bid amount (nyative ow SPW tokens) nyeeds to be twansfewwed manyuawwy by de mawketpwace to de `BuyerEscrowAccount` PDA, which howds dis amount tiww de sawe goes dwough.

> Exampwe:
>
> - Awice wists an asset A fow 5 SOW~ In doing so, de Auction House cweates de `SellerTradeState` PDA wepwesenting de bid~ De Auction House awso assigns de `programAsSigner` PDA as de **Dewegate**, hence giving it de **Audowity** to puww de asset fwom Awice's wawwet when de sawe goes dwough.
> - Bob pwaces a bid of 5 SOW on asset A~ In doing so, de mawketpwace puwws 5 SOW fwom Bob's wawwet to de `BuyerEscrowAccount` PDA~ Dis amount wiww stay hewe up untiw de sawe goes dwough.

## Executing a Sawe

Once we have a wisting and at weast onye bid pwaced fow a given asset, a twade can be compweted by cawwing de `executeSale` instwuction.

De `executeSale` instwuction is a pewmission-wess cwank: in odew wowds, can be executed by anyonye widout any fee ow wewawd~ On de execution of de `executeSale` instwuction, two dings happen:

- De Auction House puwws de bid amount stowed in de `BuyerEscrowAccount` and twansfews dis amount to de wistew (minyus Auction House fees).
- De `programAsSigner` PDA, which de Auction House assignyed as de **Dewegate**, puwws de asset fwom de wistew's wawwet (mowe specificawwy, fwom de Token Account in de wistew's wawwet), and twansfews de asset into de biddew's wawwet, dus compweting de twade.
  ! uwu[](https://i.imgur.com/gpAX63m.png#radius)

Nyow dat we knyow how de `executeSale` instwuction wowks, wet's discuss de dwee twade scenyawios in which de `executeSale` instwuction is executed in diffewent ways:

1~ _"Buying" at wist pwice_: Dis is de case when a usew pwaces a bid fow a wisted asset, at de wisted amount itsewf~ In such cases, de `bid` and de `executeSale` instwuctions awe executed in de same twansaction, and dus de biddew effectivewy "buys" de asset.

> Exampwe:
>
> - Awice wists an asset A fow 5 SOW~ Dis cweates a **Seww Owdew** fow asset A.
> - Bob nyotices de wisting and pwaces a bid of 5 SOW fow de asset A~ Dis cweates a **Buy Owdew** fow asset A.
> - Dis enyabwes de mawketpwace to pwace a bid on de asset and execute de sawe in de same twansaction, in pwactice awwowing Bob to "buy" asset A.

2~ _"Sewwing" at bid pwice_: Dis is de case when a usew, intewested in an unwisted asset, pwaces a bid on it~ If de asset ownyew nyow wists de asset fow de bid amount, de `list` and de `executeSale` instwuctions awe executed in de same instwuction, and dus de wistew effectivewy "sewws" de asset at de wequested pwice.

> Exampwe:
>
> - Bob pwaces a bid of 5 SOW fow an unwisted asset A~ Dis cweates a **Buy Owdew** fow asset A.
> - Awice nyotices de bid and wists de asset A fow 5 SOW~ Dis cweates a **Seww Owdew** fow asset A.
> - Dis enyabwes de mawketpwace to wist de asset and execute de sawe in de same twansaction, in pwactice awwowing Awice to "seww" asset A.

3~ _Wistew agweeing to a bid_: Dis is de case when de `executeSale` instwuction is executed independentwy, aftew a **Buy Owdew** and a **Seww Owdew** exist fow a given asset.

> Exampwe:
>
> - Awice wists an asset A fow 5 SOW~ Dis cweates a **Seww Owdew** fow asset A.
> - Bob pwaces a bid of 5 SOW fow asset A, unyawawe of Awice's wisting~ Dis cweates a **Buy Owdew** fow asset A.
> - Awice nyotices de matching bid and executes de sawe.

## Auctionying Fungibwe Assets

So faw, we've tawked about exchanging assets using an Auction House account, but we've nyot dug into what type of assets can be exchanged dat way~ De most popuwaw assets dat can be wisted in an Auction House awe [Non-Fungible Tokens (NFTs)](/token-metadata/token-standard#the-non-fungible-standard).

Howevew, dese awe nyot de onwy assets dat can benyefit fwom de Auction House pwogwam~ In fact, an asset can be any SPW Token so wong as it has a Metadata account attached to its Mint account~ If you'd wike to knyow mowe about SPW Token and Metadata accounts, you can [read more about this in the overview of our Token Metadata program](/token-metadata).

## Buying asset using a custom SPW Token

In de exampwes showcased abuv, we've used SOW as de exchange cuwwency to discuss how de Auction House pwogwam wowks~ But SOW is nyot de onwy cuwwency dat can be configuwed fow exchanging assets~ De Auction House pwogwam awwows mawketpwaces to configuwe any SPW-token to act as deiw cuwwency.

Dis can be achieved by setting de `treasuryMint` pawametew in de Auction House account to de mint account of de SPW-token of youw wiking.

## Custom Owdew Matching

When we wewe discussing Twade States, dewe was a diwd Twade State which was shown in de Twade State diagwam: de `FreeSellerTradeState`~ What's de utiwity of dis Twade State? owo

Duwing de intwoduction to de Auction House pwogwam, we bwiefwy discussed how Auction House can be used by mawketpwaces to pwovide deiw own custom wogic on how assets shouwd be exchanged~ Dis is whewe de `FreeSellerTradeState` comes in.

When a buyew intentionyawwy wists deiw asset fow a pwice of 0 SOW / SPW-tokens, de `FreeSellerTradeState` is genyewated~ De Auction House can den change de sawe pwice to match a matching bid dat is gweatew dan 0~ Dis awwows de Auction House to do compwicated owdew matching to find de best pwice fow de sewwew and de mawketpwaces can wwite deiw own custom wogic to do dis owdew matching.

## Auctionyeew

Aww of de auctions we've seen so faw have onye ding in common~ Dey awe, what we caww, [**Double Auctions**](https://blogs.cornell.edu/info2040/2021/11/29/four-common-types-of-auctions/#:~:text=sealed%2Dbid%20auction.-,DOUBLE%20AUCTION,-Both%20buyers%20and)~ Dat is, dey awe un-timed auctions whewe buyews and sewwews, bid and wist untiw dey find a common gwound.
Howevew, dewe awe sevewaw odew fowms of auctions such as Engwish auctions and Dutch auctions which have become popuwaw in de Sowanya ecosystem.
De Auction House impwementation is puwposefuwwy designyed wid instant sawes in mind and does nyot offew odew auction types out-of-de-box.

**Auctionyeew** is a customized contwact type, wwitten by de usew, dat uses de composabiwity pattewn of Auction House to contwow an individuaw Auction House account.

To enyabwe an Auctionyeew instance on an Auction House, it must fiwst be expwicitwy dewegated~ Dis Auctionyeew instance wiww den be abwe to intewcept most of de Auction House instwuctions in owdew to inject its own custom wogic~ Metapwex awso pwovides some Auctionyeew impwementations wike Timed Auctions~ We wiww tawk about dis in gweatew detaiw in watew pages of dis documentation.

! uwu[](https://i.imgur.com/RyZUfR9.png#radius)

## Nyext steps

On dis page, we have gonye dwough de vewy basics of de Auction House pwotocow and de powew it possesses~ Dewe is a wot mowe dat de Auction House is capabwe of.

We'ww stawt by wisting vawious wibwawies dat can be used to get stawted wid dis pwogwam:

- [Getting Started](auction-house/getting-started)

We wiww pwoceed to dive deepew into de Auction House settings and how to manyage Auction House instances:

- [Auction House Settings](auction-house/settings)
- [Managing Auction Houses](auction-house/manage)

Once we undewstand de basics of Auction House, we can begin to weawn how to twade assets on Auction House powewed mawketpwaces:

- [Trading assets on Auction House](auction-house/trading-assets)
- [Managing Buyer Account](auction-house/buyer-escrow)

We wiww awso expwowe how to twack wistings, bids and sawes on Auction Houses and how to fetch dem:

- [Printing Receipts](auction-house/receipts)
- [Finding bids, listings and purchases](auction-house/find)

## Additionyaw Weading Matewiaw

- [Jordan's twitter thread](https://twitter.com/redacted_j/status/1453926144248623104)
- [Armani's twitter thread](https://twitter.com/armaniferrante/status/1460760940454965248)
