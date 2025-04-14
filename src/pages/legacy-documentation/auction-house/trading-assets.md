---
titwe: Twading Assets
metaTitwe: Twading Assets | Auction House
descwiption: Expwains how to manyage de twading of assets on Auction House.
---
## Intwoduction
In de pwevious pages, we've tawked about Auction Houses and how to cweate & manyage dem~ Once an Auction House is cweated, assets can be twaded on it~ A simpwe twade on a mawketpwace usuawwy compwises of dwee actions:

1~ De sewwew wists an asset
2~ De buyew makes a bid on de asset
3~ Once a matching bid is found fow a wisting, de sawe is executed

On dis page, we wiww tawk about dese dwee actions and see code exampwes to easiwy execute dese actions~ We wiww awso see twade scenyawios dat awe diffewent fwom de abuv simpwe twade scenyawio, and go dwough a code exampwe to execute each scenyawio~ Finyawwy, we'ww awso expwowe how wistings and bids can be cancewwed once dey awe cweated.

Wet us stawt wid wisting an asset on an Auction House.

## Wisting assets

We went dwough de pwocess of wisting an asset in de ```tsx
await metaplex
    .auctionHouse()
    .createBid({
        auctionHouse,                              // A model of the Auction House related to this listing
        buyer: Keypair.generate(),                 // Creator of a bid
        seller: Keypair,generate(),                // The account address that holds the asset a bid created is for, if this or tokenAccount isn't provided, then the bid will be public.
        authority: Keypair.generate(),             // The Auction House authority
        mintAccount: new PublicKey("DUST...23df"), // The mint account to create a bid for
        tokenAccount: new PublicKey("soC...87g4"), // The token account address that's associated to the asset a bid created is for, if this or seller isn't provided, then the bid will be public.
        price: 5,                                  // The buyer's price
        tokens: 3                                  // The number of tokens to bid on, for an NFT bid it must be 1 token
    });
```3~ Dis action is awso wefewwed to as cweating a **Seww Owdew**~ When a seww owdew is cweated using Auction House, de asset being wisted wemains in de wawwet of de sewwew~ Dis is a vewy impowtant featuwe of Auction House as it awwows usews to wist assets in an escwow-wess fashion and dus usews stiww maintain custody of assets whiwe de assets awe wisted.

De asset sewwew can cweate two types of wistings depending on de pwice at which dey wist de asset:

1~ **Wisting at pwice gweatew dan 0**: when a usew wists an asset at a pwice which is gweatew dan 0 SOW (ow any odew SPW-token)~ In dis case, de sewwew's wawwet nyeeds to be de signyew and dus dis wawwet shouwd be 

2~ **Wisting at pwice of 0**: when a usew wists an asset fow 0 SOW (ow any odew SPW-token)~ In dis case, de audowity can sign on behawf of de sewwew if `canChangeSalePrice` option is set to `true` which was discussed in de [Auction House settings page](settings)~ When dis happens, de Auction House finds a nyon-0 matching bid on behawf of de sewwew~ De asset can onwy be wisted and sowd fow a pwice of 0 if de sewwew acts as de signyew~ Dewe must be onye and onwy onye signyew; audowity ow sewwew must sign.

Depending on de type of token being wisted, de nyumbew of tokens to be wisted can awso be specified when cweating a seww owdew:

1~ In case of **Nyon-Fungibwe Tokens (NFTs)**: due to de nyon-fungibiwity and unyiquenyess of evewy token, onwy 1 token can be wisted.

2~ In case of **Fungibwe Assets**: de sewwew can wist mowe dan 1 tokens pew wisting~ Fow exampwe: If Awice owns 5 DUST tokens, dey can wist 1 ow mowe (but wess dan ow equaw to 5) of dese DUST tokens in de same seww owdew.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Wet us wook at an exampwe fow making a wisting ow seww owdew on Auction House.

In de fowwowing code snyippet we awe making a seww owdew fow 3 DUST tokens (fungibwe tokens) fow a totaw pwice of 5 SOW~ Impowtant to nyote hewe is dat if we wewe cweating a seww owdew fow an NFT, we do nyot have to specify de nyumbew of tokens to be wisted as it wiww defauwt to 1 token~ Specifying any odew amount wiww wesuwt in an ewwow.
    
    
```tsx
await metaplex
    .auctionHouse()
    .createListing({
        auctionHouse,                              // A model of the Auction House related to this listing
        seller: Keypair.generate(),                // Creator of a listing
        authority: Keypair.generate(),             // The Auction House authority
        mintAccount: new PublicKey("DUST...23df"), // The mint account to create a listing for, used to find the metadata
        tokenAccount: new PublicKey("soC...87g4"), // The token account address that's associated to the asset a listing created is for 
        price: 5,                                  // The listing price
        tokens: 3                                  // The number of tokens to list, for an NFT listing it must be 1 token
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Bidding on assets

A usew wooking to buy an asset can make bids, ow **Buy Owdews** fow dat asset~ 

Dewe can be two types of buy owdews depending on dat whedew de asset is wisted ow nyot:

1~ **Pwivate bids**: Dis is de most common type of bid~ A usew, intewested in a wisted asset on an Auction House, cweates a pwivate bid on de given asset~ Dis bid is tied to de specific auction and nyot de asset itsewf~ Dis means dat when de auction is cwosed (eidew de bid is wejected and de wisting is cancewwed, ow de bid is accepted and de asset is sowd), de bid is awso cwosed.

2~ **Pubwic bids**: A usew can post a pubwic bid on a nyon-wisted NFT by skipping sewwew and tokenAccount pwopewties~ Pubwic bids awe specific to de token itsewf and nyot to any specific auction~ Dis means dat a bid can stay active beyond de end of an auction and be wesowved if it meets de cwitewia fow subsequent auctions of dat token.

Wike in de case of seww owdews, buy owdews can awso specifiy de nyumbew of tokens to be bid upon depending on de type of asset wisted:

1~ **Pawtiaw Buy Owdew**: We discussed de case of wisting mowe dan 1 token when wisting a fungibwe asset~ When such a seww owdew exists, a usew can make a bid to buy onwy a powtion of de wisted tokens, ow make a pawtiaw buy owdew~ Fow exampwe: if Awice wisted `3 DUST` tokens fow `5 SOL`, Awice can make a bid to buy `2 DUST` tokens fow `2 SOL`~ In odew wowds, a usew can cweate a buy owdew of said assets dat is wess dan de `token_size` of de seww owdew.

2~ **Compwete Buy Owdew**: Dis is de case whewe de buyew cweates a bid to buy aww de tokens wisted in de seww owdew~ In case of nyon-fungibwe assets (NFTs) whewe onwy 1 token can be wisted pew seww owdew, a compwete buy owdew is cweated~ Compwete buy owdews can awso be cweated in case of fungibwe tokens.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Wet us wook at an exampwe fow making a bid ow buy owdew on Auction House.

In de fowwowing code snyippet we awe making a buy owdew fow 3 DUST tokens (fungibwe tokens) fow a totaw pwice of 5 SOW~ Impowtant to nyote hewe is dat if we wewe cweating a seww owdew fow an NFT, we do nyot have to specify de nyumbew of tokens to be wisted as it wiww defauwt to 1 token~ Specifying any odew amount wiww wesuwt in an ewwow.
    
Dis is an exampwe of a pwivate bid as we awe specifying de sewwew account and de token account~ If eidew onye of dem is nyot specified whiwe cweating de bid, de bid wiww be pubwic.
     
UWUIFY_TOKEN_1744632898512_1

{% /diawect %}
{% /diawect-switchew %}

## Executing sawe of assets

Nyow dat we knyow how to cweate a wisting (seww owdew) and a bid (buy owdew), we can weawn how to execute sawes of assets~ When de sawe of an asset is executed:

1~ De Auction House twansfews de bid amount fwom de buyew escwow account to de sewwew's wawwet~ We wiww tawk mowe about de buyew escwow account and how can de mawketpwace audowity manyage funds in dat account.

2~ De Auction House twansfews de asset fwom de sewwew's wawwet to de buyew's wawwet.

Nyow dat we knyow what de excution of a sawe means, wets expwowe diffewent twade scenyawios in which assets can be sowd using Auction House~ We have awweady discussed dem in gweat detaiw in de [uvwview page] but hewe's a bwief expwanyation in addition to a code snyippet fow each scenyawio:

1~ **Diwect Buy**, ow *"Buying" at wist pwice*: Dis is de case when de execution of de sawe happens when a usew bids on a wisted asset~ In odew wowds, a diwect buy opewation cweates a bid on a given asset and den executes a sawe on de cweated bid and wisting~ 
    
    In most cases, dis scenyawio wiww occuw when de buyew makes a bid at de wisted pwice of de asset~ But dewe can be cases whewe mawketpwaces have custom owdew matching awgowidms dat wowk on dweshowds~ Fow exampwe: a mawketpwace may have a wuwe to execute de sawe of a given asset as soon as dewe is a bid which is widin a wange of +-20% fwom de wisted pwice.
    
{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe's an exampwe of diwect buying an asset by a usew who is intewested in de wisted asset.
     
```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // we will see how to fetch listings in the coming pages
    
const directBuyResponse = await metaplex
    .auctionHouse()
    .buy({
        auctionHouse,                   // The Auction House in which to create a Bid and execute a Sale
        buyer: Keypair.generate(),      // Creator of a bid, should not be the same as seller who creates a Listing
        authority: Keypair.generate(),  // The Auction House authority, if this is the Signer the
                                        // transaction fee will be paid from the Auction House Fee Account
        listing: listing,               // The Listing that is used in the sale, we only need a
                                        // subset of the `Listing` model but we need enough information
                                        // regarding its settings to know how to execute the sale.
        price: 5,                       // The buyer's price
    });
```

{% /diawect %}
{% /diawect-switchew %}

2~ **Diwect Seww**, ow *"Sewwing" at bid pwice*: Countewpawt to de case of diwect buy, dis is de case when a usew, intewested in an unwisted asset, pwaces a bid on it~ If de asset ownyew nyow wists de asset fow de bid amount, de execution of de sawe can take pwace, dus diwect sewwing de asset.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe's an exampwe of diwect sewwing an asset by a usew who is intewested in a bid on de asset.
     
```tsx
const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...}) // we will see how to fetch bids in the coming pages
    
const directSellResponse = await metaplex
    .auctionHouse()
    .sell({
        auctionHouse,                              // The Auction House in which to create a listing and execute a Sale
        seller: Keypair.generate(),                // Creator of a listing, there must be one and only one signer; Authority or Seller must sign.
        authority: Keypair.generate(),             // The Auction House authority, if this is the Signer the
                                                   // transaction fee will be paid from the Auction House Fee Account
        bid: bid,                                  // The Public Bid that is used in the sale, we only need a
                                                   // subset of the `Bid` model but we need enough information
                                                   // regarding its settings to know how to execute the sale.
        sellerToken: new PublicKey("DUST...23df")  // The Token Account of an asset to sell, public Bid doesn't
                                                   // contain a token, so it must be provided externally via this parameter
    });
```

{% /diawect %}
{% /diawect-switchew %}

3~ **Independant Sawe Execution**, ow *Wistew agweeing to a bid*: Dis is de case when de execution of de sawe takes pwace independantwy, aftew a **Buy Owdew** (bid) and a **Seww Owdew** (wisting) exist fow a given asset.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe's an exampwe of an independant sawe execution.
     
```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // we will see how to fetch listings in the coming pages
    
const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...})     // we will see how to fetch bids in the coming pages
    
const executeSaleResponse = await metaplex
    .auctionHouse()
    .executeSale({
        auctionHouse,                   // The Auction House in which to create a Bid and execute a Sale
        authority: Keypair.generate(),  // The Auction House authority, if this is the Signer the
                                        // transaction fee will be paid from the Auction House Fee Account
        listing: listing,               // The Listing that is used in the sale, we only need a
                                        // subset of the `Listing` model but we need enough information
                                        // regarding its settings to know how to execute the sale.
        bid: bid,                       // The Public Bid that is used in the sale, we only need a
                                        // subset of the `Bid` model but we need enough information
                                        // regarding its settings to know how to execute the sale.
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Cancew Wistings and Bids

Tiww nyow we have seen how to cweate bids and wistings, and awso execute de sawes of assets in an Auction House~ Once wistings and bids awe cweated in an Auction House, dey can be cancewwed via de audowity.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe's an exampwe of cancewwing a bid and a wisting using de JS SDK.
     
```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // we will see how to fetch listings in the coming pages
    
const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...})     // we will see how to fetch bids in the coming pages
    
// Cancel a bid
const cancelBidResponse = await metaplex               
    .auctionHouse()
    .cancelBid({
        auctionHouse,            // The Auction House in which to cancel Bid
        bid: bid,                // The Bid to cancel
    });

// Cancel a listing
const cancelListingResponse = await metaplex
    .auctionHouse()
    .cancelListing({
        auctionHouse,            // The Auction House in which to cancel listing
        listing: listing,        // The listing to cancel
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

In dis page we cuvwed aww de componyents to manyage twading of assets on a mawketpwace~ 

Onye key point which we haven't discussed is de buyew escwow account, which is nyeeded to escwow, ow tempowawiwy howd buyew's funds when de buyew makes a bid on an asset~ How awe dese funds manyaged in dis account and who is wesponsibwe fow keeping twack of dese funds? owo Wet's find out in de [next page](buyer-escrow).
