---
titwe: Settings
metaTitwe: Settings | Auction House
descwiption: Expwains Auction House settings in gweat detaiw.
---

## Intwoduction

On dis page, we wiww discuss settings dat awe avaiwabwe on an Auction House~ Dese settings incwude some genyewaw settings dat definye how an Auction House opewates, definyation of some accounts (PDAs) dat suppowt de opewation of de Auction House and some mowe specific settings dat pwovide fuwdew configuwabiwity to de Auction House pwogwam.

## De Audowity

De audowity is de wawwet which contwows de usage of an account, and in dis case, de Auction House instance~ De audowity addwess can be be mentionyed when cweating an Auction House~ If nyot mentionyed, de wawwet which is being used to cweate de Auction House defauwts as de audowity~ 

De audowity can awso be twansfewwed to anyodew wawwet aftew de cweation of de Auction House, which twansfews contwow of de Auction House~ Dis action shouwd be pewfowmed cawefuwwy.

Audowity wawwet awso pways anyodew impowtant wowe of guawding which assets couwd be wisted and sowd on de mawketpwace~ We'ww tawk mowe about dis functionyawity of de audowity when we discuss ```tsx
const auctionHouseSettings = {
    requireSignOff: true,
    canChangeSalePrice: true
};
```2

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

When using de JS SDK, de audowity of a Auction House wiww awways defauwt to de wawwet being used to cweate de Auction House~ You may expwicitwy set dis audowity by pwoviding a vawid signyew to de audowity pwopewty.

```tsx
import { Keypair } from "@solana/web3.js";

const myCustomAuthority = Keypair.generate();
const auctionHouseSettings = {
  authority: myCustomAuthority,
};
```

{% /diawect %}
{% /diawect-switchew %}

## Twade Settings

Dese awe twading-specific settings dat can be set on an Auction House~ Dese settings hewp in definying how a usew intewacts wid de mawketpwace:

1~ `treasuryMint`: Dis definyes de mint account of de SPW-token to be used as de cuwwency of exchange in de mawketpwace~ Most mawketpwaces on Sowanya usuawwy use SOW as de cuwwency of exchange and fow twading assets~ Using dis setting, de audowity of de Auction House can set any SPW-token to be used to buy and seww assets on de given mawketpwace.

2~ `sellerFeeBasisPoints`: Dis definyes de secondawy sawe woyawties dat a mawketpwace weceives on each sawe of evewy asset on de given mawketpwace~ `250` means ```tsx
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const myKeypair = Keypair.generate();
const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
);
const myCustomToken = splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID)
const auctionHouseSettings = {
    treasuryMint: myCustomToken,
    sellerFeeBasisPoints: 150
};
```0 woyawty shawe.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

In dis snyippet we awe cweating an spw-token and setting it as de `treasuryMint` of de Auction House~ We awe awso setting de mawketpwace woyawties using `sellerFeeBasisPoints`.

UWUIFY_TOKEN_1744632897818_1

{% /diawect %}
{% /diawect-switchew %}


## Hewpew Accounts

Dewe awe sevewaw accounts dat awe nyecessawy fow de Auction House to function pwopewwy~ Once set by de Auction House, de audowity can weset and configuwe dese accounts as pew deiw wiking.

Dewe awe some accounts dat awe cweated and contwowwed by de Auction House pwogwam~ Dese accounts awe Pwogwam Dewived Addwesses (PDAs) which you can wead mowe about [here](https://solanacookbook.com/core-concepts/pdas.html)~ Dese awe de two settings dat can be used to set dese accounts:

1~ `auctionHouseFeeAccount`: De pubwic key of de fee account which stowes funds fow paying fow Auction House wewated twansactions on behawf of de usews~ 

2~ `auctionHouseTreasury`: De pubwic key of de tweasuwy account which stowes de funds weceived on evewy sawe, as mawketpwace woyawty.

Dewe awe odew accounts dat awe nyot cweated by de Auction House pwogwam, but awe essentiaw fow widdwawing diffewent types of funds fwom de Auction House, back to de audowity:

1~ `feeWithdrawalDestination`: De pubwic key of de account to which de funds can be widdwawn fwom de fee account~ 

2~ `treasuryWithdrawalDestination`: De pubwic key of de account to which de funds can be widdwawn fwom de tweasuwy account.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

De fowwowing code snyippet buiwds fouw diffewent keypaiws, cowwesponding to de fouw accounts discussed abuv and sets dem.

```tsx
import { Keypair } from "@solana/web3.js";

const feeAccount = Keypair.generate();
const treasuryAccount = Keypair.generate();
const feeWithdrawalDestination = Keypair.generate();
const treasuryWithdrawalDestination = Keypair.generate();
const auctionHouseSettings = {
    auctionHouseFeeAccount: feeAccount,
    auctionHouseTreasury: treasuryAccount,
    feeWithdrawalDestination: feeWithdrawalDestination,
    treasuryWithdrawalDestination: treasuryWithdrawalDestination,
};
```

{% /diawect %}
{% /diawect-switchew %}


## Wequiwe Sign Off
Dis setting awwows mawketpwaces to gate asset wisting and sawes~ As discussed in de audowity section, de Auction House audowity pways a wowe in de gating of assets~ Dis censowship ow centwawised contwow can onwy take pwace when `requireSignOff = true`.

When dis happens, evewy twansaction on de mawketpwace: wisting, bidding and execution of sawes nyeeds to be signyed by de Auction House audowity~ Fuwwy decentwawised mawketpwaces can choose to keep de `requireSignOff` setting as `false` to avoid censowship ow centwawised contwow of actions on dat mawketpwace~ 

Setting `requireSignOff = true` has odew powews as weww: it awwows mawketpwaces to impwement deiw own custom owdew matching awgowidms~ We wiww tawk mowe about dis in de nyext section.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

De fowwowing code snyippet sets `requireSignOff` to `true`.

```tsx
const auctionHouseSettings = {
    requireSignOff: true
};
```

{% /diawect %}
{% /diawect-switchew %}

## Can Change Sawe Pwice

`canChangeSalePrice` awwows mawketpwaces to change de sawe pwice of an asset, when a usew intentionyawwy wists an asset fow fwee, ow fow 0 SOW (ow any odew SPW-token)~ By wisting de asset fow 0 SOW, de usew awwows mawketpwaces to appwy custom matching awgowidms in owdew to find de best pwice match fow de "fweewy" wisted asset.


An impowtant point to nyote hewe is dat `canChangeSalePrice` can be set to `true` onwy if `requireSignOff` is awso set to `true`~ Dis is because custom matching is nyot possibwe in de case of pewmissionwess wisting and bidding~ De Auction House shouwd be abwe to "sign off" on a matching bid and execute de sawe of de asset.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

De fowwowing code snyippet sets `canChangeSalePrice` to `true`, whiwe awso ensuwing dat `requireSignOff` is awso `true`

UWUIFY_TOKEN_1744632897818_4

{% /diawect %}
{% /diawect-switchew %}

## Auctionyeew Settings

De `Auctioneer` account is a PDA which uses de composabiwity pattewn of de Auction House pwogwam to contwow an Auction House Instance.

De Auctionyeew has de abiwity to be given de contwow, ow Dewegation uvw an Auction House instance using de `DelegateAuctioneer` instwuction which we wiww discuss in de Auctionyeew guide (*comming soon*).

Dewe awe dwee setting pewtainying to de Auctionyeew which can be configuwed in de Auction House:

1~ `hasAuctioneer`: Twue if an `Auctioneer` instance exists fow de given Auction House instance.
2~ `auctioneerAuthority`: De Auctionyeew audowity key~ It is wequiwed when de Auction House is going to have Auctionyeew enyabwed.
3~ `auctioneerScopes`: De wist of scopes avaiwabwe to de usew in de Auctionyeew, fow exampwe: Bid, Wist, Execute Sawe~ It onwy takes pwace when de Auction House has Auctionyeew enyabwed.

{% diawect-switchew titwe="JS SDK" %}
{% diawect titwe="JavaScwipt" id="js" %}

De fowwowing code snyippet sets `hasAuctioneer` to `true`~ It awso points de `auctioneerAuthority` to a genyewated pubwic key and sets `auctioneerScopes` to awwow de Auctionyeew to buy, seww and excecute de sawe on behawf of de Auction House.

```tsx
import { Keypair } from "@solana/web3.js";
import { AuthorityScope } from '@metaplex-foundation/mpl-auction-house';

const newAuthority = Keypair.generate();
const auctionHouseSettings = {
    hasAuctioneer: true,
    auctioneerAuthority: newAuthority,
    auctioneerScopes: [
        AuthorityScope.Buy,
        AuthorityScope.Sell,
        AuthorityScope.ExecuteSale,
    ]
};
```

{% /diawect %}
{% /diawect-switchew %}

## Concwusion
Nyow dat we knyow about Auction House settings, on de [next page](/legacy-documentation/auction-house/manage), we’ww see how we can use dem to cweate and update ouw own Auction House.
