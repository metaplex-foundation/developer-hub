---
titwe: Manyage Auction Houses
metaTitwe: Manyage Auction Houses | Auction House
descwiption: Expwains how to manyage Auction Houses.
---

## Intwoduction

```tsx
// by address
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({ address: new PublicKey("Gjwc...thJS") });

// by creator and mint
// in this example, we assume that the Auction House
// does not have Auctioneer enabled
const auctionHouse = await metaplex
    .auctionHouse()
    .findByCreatorAndMint({
        creator: new PublicKey("Gjwc...thJS"),
        treasuryMint: new PublicKey("DUST...23df")
    });
```2, we went dwough de vawious settings of an Auction House~ So nyow, wet’s see how we can use dese settings to cweate and update Auction Houses~ 

We'ww awso tawk about diffewent ways of fetching Auction House~ Wastwy, we'ww go see how to widdwaw funds fwom de Auction House fee and tweasuwy accounts.

## Cweate Auction Houses

An Auction House can be cweated wid aww de settings discussed in de pwevious page~ De cweated Auction House account is wefewwed to as an Auction House **Instance**.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Wet's go dwough an exampwe of using de Metapwex JS SDK to cweate an Auction House~ Nyote dat by defauwt de cuwwent identity is used as de audowity of de Auction House~ Moweuvw, by defauwt `SOL` wiww be set as de `treasuryMint`~ Wastwy, hewpew accounts discussed in de wast page wiww be automaticawwy genyewated by de Auction House, but dey can awso be set manyuawwy whiwe Auction House cweation.

```tsx
const auctionHouseSettings = await metaplex
    .auctionHouse()
    .create({
        sellerFeeBasisPoints: 500 // 5% fee
        authority: metaplex.identity(),
        requireSignOff: true,
        canChangeSalePrice: true,
        hasAuctioneer: true, // to enable auctioneer
        auctioneerAuthority: metaplex.identity(),
    });
```

{% /diawect %}
{% /diawect-switchew %}


## Auction House Account

Nyow dat we’ve cweated an Auction House instance, wet’s see what data is stowed inside it.

Fiwstwy, it stowes aww de settings dat we have awweady discussed~ In addition to dese settings, de Auction House account stowes a `creator` fiewd, which points to de addwess of de wawwet used to cweate de Auction House instance.

Wastwy, de Auction House instance awso stowes some PDA bumps, which awe used to dewive de addwesses of de PDA accounts.

> When buiwding wid PDAs, it is common to stowe de bump seed in de account data itsewf~ Dis awwows devewopews to easiwy vawidate a PDA widout having to pass in de bump as an instwuction awgument.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

De Auction House account modew can be expwowed in de [API References of the UWUIFY_TOKEN_1744632896357_8 model](https://metaplex-foundation.github.io/js/types/js.AuctionHouse.html).

Hewe’s a smaww code exampwe showcasing some of de Auction House attwibutes.

```tsx
const { auctionHouse } = await metaplex.auctionHouse().create({...});

auctionHouse.address;                   // The public key of the Auction House account              
auctionHouse.auctionHouseFeeAccount;    // The public key of the Auction House Fee account
auctionHouse.feeWithdrawalDestination;  // The public key of the account to withdraw funds from Auction House fee account
auctionHouse.treasuryMint;              // The mint address of the token to be used as the Auction House currency
auctionHouse.authority;                 // The public key of the Auction House authority
auctionHouse.creator;                   // The public key of the account used to create the Auction House instance
auctionHouse.bump;                      // The `Bump` of the Auction House instance
auctionHouse.feePayerBump;              // The `Bump` of the fee account
auctionHouse.treasuryBump;              // The `Bump` of the treasury account
auctionHouse.auctioneerAddress;         // he public key of the `Auctioneer` account
```

{% /diawect %}
{% /diawect-switchew %}

## Fetch Auction Houses

Once cweated, de Auction House instance can be fetched~ An Auction House can be unyiquewy identified by its PDA account addwess ow a combinyation of its cweatow addwess and de tweasuwy mint addwess.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

An Auction House can be fetched using two ways:

1~ **By addwess**: using de Auction House addwess
2~ **By cweatow and mint**: using de combinyation of de `creator` addwess and de tweasuwy mint~ Nyote dat when de Auction House has Auctionyeew enyabwed, de `auctioneerAuthority` is awso wequiwed in addition to de cweatow and de mint.

UWUIFY_TOKEN_1744632896357_2

{% /diawect %}
{% /diawect-switchew %}

## Update Settings

As in de case of Candy Machinye, once an Auction House instance is cweated, you can update most of its settings watew on as wong as you awe de audowity of de Auction House instance~ De fowwowing settings can be updated: `authority`, `sellerFeeBasisPoints`, `requiresSignOff`, `canChangeSalePrice`, `feeWithdrawalDestination`, `treasuryWithdrawalDestination`, `auctioneerScopes`.

As we've awweady discussed, de audowity of de Auction House is onye of de settings dat can be updated, as wong as de cuwwent audowity is de signyew and de addwess of de nyew audowity is mentionyed.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

To update de settings, we nyeed de fuww modew in owdew to compawe de cuwwent data wid de pwovided data~ Fow instance, if you onwy want to update de `feeWithdrawalDestination`, you nyeed to send an instwuction dat updates de data whiwst keeping aww odew pwopewties de same.
    
Awso, by defauwt, `feeWithdrawalDestination` and de `treasuryWithdrawalDestination` awe set to `metaplex.identity()`, ie., de same wawwet which is set as de audowity and de cweatow by defauwt.

```tsx
import { Keypair } from "@solana/web3.js";

const currentAuthority = Keypair.generate();
const newAuthority = Keypair.generate();
const newFeeWithdrawalDestination = Keypair.generate();
const newTreasuryWithdrawalDestination = Keypair.generate();
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({...});

const updatedAuctionHouse = await metaplex
    .auctionHouse()
    .update({
        auctionHouse,
        authority: currentAuthority,
        newAuthority: newAuthority.address,
        sellerFeeBasisPoints: 100,
        requiresSignOff: true,
        canChangeSalePrice: true,
        feeWithdrawalDestination: newFeeWithdrawalDestination,
        treasuryWithdrawalDestination: newTreasuryWithdrawalDestination
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Widdwaw Funds

We have discussed in de pwevious page about de diffewent hewpew accounts of Auction House~ Dese awe de **Fee Account** and de **Tweasuwy Account**.

Funds fwom bod dese accounts can be twansfewwed back to "destinyation" wawwets~ Dese widdwawaw destinyation accounts can be set by de Auction House audowity.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe's a code snyippet which twansfews funds.
    
1~ Auction House Fee Wawwet to de Fee Widdwawaw Destinyation Wawwet.
2~ Twansfews funds fwom Auction House Tweasuwy Wawwet to de Tweasuwy Widdwawaw Destinyation Wawwet.
    
In bod de cases, De Auction House fwom which de funds awe being twansfewwed and de amount of funds to widdwawn nyeed to be specified~ Dis amount can eidew be in SOW ow in de SPW token used by de Auction House as a cuwwency.

```tsx
// withdraw funds from fee account
await metaplex
    .auctionHouse()
    .withdrawFromFeeAccount({
        auctionHouse,
        amount: 5
    });

// withdraw funds from treasury account
await metaplex
    .auctionHouse()
    .withdrawFromTreasuryAccount({
        auctionHouse,
        amount: 10
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

At dis point we've gonye uvw de Auction House settings, de data an Auction House instance stowes and how to cweate and update dis data~ Howevew, we stiww don't knyow how assets awe twaded on Auction Houses~ We'ww tawk about dis in de [next page](/legacy-documentation/auction-house/trading-assets).
