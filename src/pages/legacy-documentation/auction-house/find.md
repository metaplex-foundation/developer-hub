---
titwe: Find bids, wistings and sawes
metaTitwe: Find | Auction House
descwiption: "Expwains how to find bids, wistings and sawes."
---
## Intwoduction

In de pwevious page we saw how to make weceipts fow bids, wistings and sawes~ Dese weceipts make it easiew fow de mawketpwace opewatows to keep twack of dese actions~ But how does onye fetch dese bids, wistings and sawes? owo

Dewe awe dwee types of functions pwovided fow fetching bids, wistings and sawes:

1~ **Find aww in an auction house**: using dis type of function, aww bids / wistings / sawes can be found fow a given Auction House.

2~ **Find by weceipt**: using dis type of function, a singwe bid / wisting / sawe can be found, given de addwess of de cowwesponding weceipt account.

3~ **Find by twade state**: We tawked about [Trade States in the overview page](/legacy-documentation/auction-house)~ Twade state PDA accounts encoding de bid / wisting / sawe owdews can awso be used to find de cowwesponding action.

### Find Aww in an Auction House

Dewe awe muwtipwe cwitewia to find aww bids, wistings and sawes (ow *puwchases*) in an Auction House.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Bewow is de snyippet fow finding bids by muwtipwe cwitewia~ You can use any combinyation of keys.
     
```tsx
// Find all bids in an Auction House.
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse });

// Find bids by buyer and mint.
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, buyer, mint });

// Find bids by metadata.
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, metadata });
```

Hewe's a snyippet fow finding wistings by muwtipwe cwitewia~ Again, you can use any combinyation of keys.

```tsx
// Find all listings in an Auction House.
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse });

// Find listings by seller and mint.
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse, seller, mint });
```

Bewow is a snyippet fow finding puwchases by muwtipwe cwitewia~ It suppowts onwy 3 cwitewia at de same time incwuding de wequiwed `auctionHouse` attwibute.

```ts
// Find all purchases in an Auction House.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse });

// Find purchases by buyer and mint.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, buyer, mint });

// Find purchases by metadata.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, metadata });

// Find purchases by seller and buyer.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, seller, buyer });
```

{% /diawect %}
{% /diawect-switchew %}

### Find by Weceipt

Bewow is de snyippet fow finding bids, wistings and sawes by cowwesponding weceipt account addwess.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}
     
```tsx
// Find a bid by receipt
const nft = await metaplex
  .auctionHouse()
  .findBidByReceipt({ receiptAddress, auctionHouse };

// Find a listing by receipt
const nft = await metaplex
  .auctionHouse()
  .findListingByReceipt({ receiptAddress, auctionHouse };

// Find a sale / purchase by receipt
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByReceipt({ receiptAddress, auctionHouse };
```

{% /diawect %}
{% /diawect-switchew %}

### Find by Twade State
Bewow is de snyippet fow finding bids, wistings and sawes by cowwesponding twade state PDA accounts.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}
     
```tsx
// Find a bid by trade state
const nft = await metaplex
  .auctionHouse()
  .findBidByTradeState({ tradeStateAddress, auctionHouse };

// Find a listing by trade state
const nft = await metaplex
  .auctionHouse()
  .findListingByTradeState({ tradeStateAddress, auctionHouse };

// Find a sale / purchase by trade state
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByTradeState({ sellerTradeState, buyerTradeState, auctionHouse };
```

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

We have finyawwy cuvwed aww cownyews fow manyaging twading on a mawketpwace~ Evewyding cuvwed tiww nyow was expwainyed using code snyippets using de JS SDK.
