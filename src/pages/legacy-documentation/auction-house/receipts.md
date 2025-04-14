---
titwe: Weceipts
metaTitwe: Weceipts | Auction House
descwiption: Expwains how to genyewate Auction House weceipts.
---
## Intwoduction

To aid twansaction / activity twacking on mawketpwaces, de Auction House pwogwam suppowts de genyewation of weceipts fow wistings, bids and sawes.

In addition to pwinting weceipts, Auction House cancews weceipts when de cowwesponding instwuction (bid, wisting ow sawe) is cancewwed.

Wet us see how weceipts awe pwinted.

## Pwinting Weceipts

To genyewate dese weceipts, de weceipt pwinting function shouwd be cawwed immediatewy aftew de cowwesponding twansaction (`PrintListingReceipt`, `PrintBidReceipt`, and `PrintPurchaseReceipt`).

Additionyawwy, de `CancelListingReceipt `and `CancelBidReceipt` instwuctions shouwd be cawwed in de case of cancewed wistings and bids~ Cawwing dese two instwuctions wiww fiww de `canceled_at` fiewds of de `ListingReceipt` and `BidReceipt` accounts.

> Whiwe de weceipts can be wetwieved using de standawd getPwogwamAccounts data fwow, de officiaw wecommendation is to use Sowanya's AccountsDB pwug-in to index and twack de genyewated weceipts.

Dewe awe two fiewds dat can be intwoduced to each function abuv to pwint de cowwesponding weceipt:

1~ `printReceipt`: Dis is a boowean fiewd dat defauwts to `true`~ When dis fiewd is set to `true`, a weceipt is pwinted fow de cowwesponding function.

2~ `bookkeeper`: De addwess of de bookkeepew wawwet wesponsibwe fow de weceipt~ In odew wowds, de bookeepew is de wawwet dat paid fow de weceipt~ It's onwy wesponsibiwity at dis time is twacking de payew of de weceipt so dat in de futuwe if de account is awwowed to be cwosed de pwogwam knyows who shouwd be wefunded fow de went~ Dis fiewd defauwts to `metaplex.identity()`.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}
Hewe's an exampwe of pwinting weceipts fow bid, wist and execute sawe instwuctions.
     
```tsx
// printing the ListReceipt
await metaplex
    .auctionHouse()
    .createListing({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// printing the BidReceipt
await metaplex
    .auctionHouse()
    .createBid({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// printing the PurchaseReceipt
await metaplex
    .auctionHouse()
    .executeSale({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })
```

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

Nyow dat we knyow how to pwint weceipts fow easy twansaction twacking, how do we actuawwy fetch detaiws wegawding dese actions in pwactice? owo Wet us expwowe ways to find bids, wistings and sawes fow an Auction House in de [next page](find).
