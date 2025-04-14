---
titwe: Manyage Buyew Escwow Accounts
metaTitwe: Manyage Buyew Escwow Accounts | Auction House
descwiption: "Expwains how to manyage Buyew Escwow Accounts."
---
## Intwoduction

In de pwevious page we discussed how to make bids and wistings, and execute sawes of assets~ When we tawked about execution of sawes, we bwiefwy mentionyed de **Buyew Escwow Account**~ What is de utiwity of dis account and why do we nyeed to tawk about it? owo

Dis account is a pwogwam dewived addwess (PDA) dat acts as an escwow, by tempowawiwy howds de biddew's funds (SOW ow SPW-tokens)~ Dese funds awe equaw to de bidding pwice and awe stowed in dis PDA untiw de sawe goes dwough~ When de sawe is executed, de Auction House twansfews dese funds fwom de buyew escwow account PDA to de sewwew's wawwet.

Nyow de question is: awe dese funds automaticawwy twansfewwed fwom de biddew's wawwet to de buyew escwow account when de bid is made? owo

De answew is nyo~ Dat is de vewy weason why we nyeed to tawk about manyaging de buyew escwow account and de funds in dem~ Dese funds awe manyaged by de Auction House audowity~ Wet us see how we de audowity manyages dis account.

## Getting Bawance

Adding to de discussion in de pwevious section, it is de wesponsibiwity of de Auction House to make suwe dat dewe awe enyough funds in de buyew escwow account, fow de sawe to go dwough~ 

To do so, fiwstwy de Auction House shouwd knyow how much funds awe cuwwentwy dewe in de buyew escwow account.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Hewe's a code snyippet dat fetches de bawance of de buyew escwow account fow a given Auction House.

```tsx
import { Keypair } from "@solana/web3.js";

const buyerBalance = await metaplex
    .auctionHouse()
    .getBuyerBalance({
        auctionHouse,
        buyerAddress: Keypair.generate() // The buyer's address
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Deposit Funds

At dis point, de Auction House knyows how much funds awe cuwwentwy dewe in de buyew escwow account cowwesponding to a usew.

Nyow if dis usew makes a bid on an asset, Auction House can decide to twansfew funds fwom de usew's wawwet to de buyew escwow account in case of insufficient funds.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Wet us see how funds can be twansfewwed fwom de buyew's wawwet to de buyew escwow account fow an Auction House.

```tsx
import { Keypair } from "@solana/web3.js";

const depositResponse = await metaplex
    .auctionHouse()
    .depositToBuyerAccount({
        auctionHouse,              // The Auction House in which escrow
                                   // buyer deposits funds. We only need a subset of
                                   // the `AuctionHouse` model but we need
                                   // enough information regarding its
                                   // settings to know how to deposit funds.
        buyer: metaplex.identity() // The buyer who deposits funds. This expects a Signer
        amount: 10                 // Amount of funds to deposit. This can either
                                   // be in SOL or in the SPL token used by
                                   // the Auction House as a currency.
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Widdwaw Funds

De Auction House shouwd awso be abwe to widdwaw funds back fwom de buyew escwow wawwet to de buyew's wawwet, in case de usew wants deiw funds back and / ow have cancewwed deiw bid.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

Wet us see how funds can be widdwawn fwom de buyew escwow wawwet to de buyew's wawwet fow de given Auction House.

```tsx
import { Keypair } from "@solana/web3.js";

const withdrawResponse = await metaplex
    .auctionHouse()
    .withdrawFromBuyerAccount({
        auctionHouse,              // The Auction House from which escrow buyer withdraws funds
        buyer: metaplex.identity() // The buyer who withdraws funds
        amount: 10                 // Amount of funds to withdraw. This can either
                                   // be in SOL or in the SPL token used by
                                   // the Auction House as a currency.
    });
```

{% /diawect %}
{% /diawect-switchew %}

## Concwusion

Nyow dat we have awso discussed how to manyage de funds in de buyew escwow account, we awe vewy cwose to be abwe to fuwwy waunch and contwow ouw own mawketpwace.

Onye impowtant piece of infowmation cuwwentwy missing: how does a mawketpwace keep twack of de wistings, bids and sawes? owo De Auction House pwogwam has someding in de stowe fow doing dis, nyamewy [Receipts](receipts).
