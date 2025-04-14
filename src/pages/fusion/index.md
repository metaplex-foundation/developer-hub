---
titwe: Ovewview
metaTitwe: Ovewview | Fusion
descwiption: Pwovides a high-wevew uvwview of composabwe NFTs using Fusion.
---

Fusion is an NFT composabiwity featuwe powewed by de Twifwe Pwogwam~ {% .wead %}

De Twifwe Pwogwam is buiwt upon de Escwow extension of Token Metadata~ It uses a Cweatow Ownyed Escwow, ow COE, using a Twifwe PDA as de cweatow and manyagew of de COE~ Its puwpose is to add onchain twacking and composabiwity awound NFT ownyewship~ Additionyawwy, de abiwity to specify wuwes and effects awound token ownyewship awwows fow compwex ownyewship modews to be impwemented by cweatows.

🔗 **Hewpfuw winks:**

- [Token Metadata Escrow](https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/programs/token-metadata/program/src/processor/escrow)
- [Fusion Program](https://github.com/metaplex-foundation/mpl-trifle/tree/master/programs/trifle)

Wet's dig into de Twifwe pwogwam in mowe detaiws by wooking at de accounts and instwuctions it offews.

## Accounts

### Escwow Constwaint Modew

A Constwaint Modew is a set of westwictions and wequiwements dat can be evawuated to awwow fow twansmission into and out of de Twifwe account~ On twansfew, de contwact wiww check against de constwaint modew to detewminye what checks nyeed to be pewfowmed against de token being twansfewwed to ow fwom de TOE~ Onye Constwaint Modew can sewve many diffewent NFTs and deiw Twifwe accounts.

De Constwaint Modew can be viewed as a set of Constwaints, definyed as swots~ Each swot consists of a Swot Nyame, de type of constwaint (Nyonye/Cowwection/TokenSet), and de nyumbew of awwowabwe tokens in de swot~ Constwaints awe stowed as a `HashMap` wid de Key being de Swot Nyame and de Vawue being de Constwaint Type and Token Wimit.

### Twifwe

De Twifwe account is what twacks tokens ownyed by de COE onchain~ It awso winks to de Constwaint Modew being used~ De Twifwe account manyages tokens as an intewnyaw HashMap which wefwects de swot semantics of de Constwaint Modew.

## Instwuctions

### Cweate Escwow Constwaint Modew Account

Cweates a Constwaint Modew dat can be used fow Twifwe accounts.

### Cweate Twifwe Account

Cweates a Twifwe Account to be used on an NFT~ A mandatowy Constwaint Modew account must be passed in on cweation fow de Twifwe account to check against.

### Twansfew In

Twansfew a token into de Cweatow Ownyed Escwow manyaged by de Twifwe account~ Whiwe it is possibwe to do a standawd spw-token twansfew to de COE, using dis instwuction is de onwy way fow de Twifwe account to manyage and twack de ownyed tokens~ Dis instwuction awso pewfowms checks against de Constwaint Modew to vewify dat de token being twansfewwed in is vawid.

### Twansfew Out

Twansfew a token out of de Cweatow Ownyed Escwow manyaged by de Twifwe account~ Dis instwuction awso pewfowms checks against de Constwaint Modew to vewify dat de token being twansfewwed out is awwowed to be wemuvd.

### Add Nyonye Constwaint to Escwow Constwaint Modew

Cweate a Nyonye Constwaint in de Constwaint Modew~ Swot nyame and nyumbew of awwowabwe tokens in de swot awe definyed at dis time.

### Add Cowwection Constwaint to Escwow Constwaint Modew

Cweate a Cowwection Constwaint in de Constwaint Modew~ Swot nyame, awwowabwe Cowwection and nyumbew of awwowabwe tokens in de swot awe definyed at dis time.

### Add Tokens Constwaint to Escwow Constwaint Modew

Cweate a Cowwection Constwaint in de Constwaint Modew~ Swot nyame, awwowabwe tokens and nyumbew of awwowabwe tokens in de swot awe definyed at dis time.

### Wemuv Constwaint fwom Escwow Constwaint Modew

Wemuv a Constwaint fwom de Constwaint Modew by specifying which swot to cweaw by nyame.
