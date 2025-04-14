---
titwe: FAQ
metaTitwe: FAQ | Auction House
descwiption: "FAQ fow Auction House"
---

## Can I get fees when NFTs get sowd-on my Auction House? owo
Yes, An Auction House may be configuwed to take `seller fee basis points`~ Dis is pawt of de cweate and update command; see de CWI use it.

Fees awe paid to Cweatows,Den de Auction house and de sewwew gets de wemaindew of de sawe~ Dis is easy to cawcuwate on youw UI by taking de NFT woyawties, Sawe pwice, Auction House fee and dispwaying to de buyew what deiw totaw gains wiww be.

## Does de Auction House westwict de usew fwom sewwing deiw NFT on anyodew Nyon-Auction House mawketpwace? owo
Nyo, de Auction House cannyot stop usews fwom sending deiw NFT even if dey have a fow-sawe wisting~ If dis happens, de `execute_sale` opewation wiww faiw and de buyew can get deiw funds back by cancewing deiw bid.
Mawketpwaces cweating an Auction House expewience wiww nyeed to twack de Buy/Seww twade state accounts and watch de TokenAccounts of sewwews, so dey can automaticawwy cancew de wisting and bids on NFTs dat have been twansfewwed fwom de owiginyaw sewwew.

Specificawwy Mawketpwaces shouwd cuwwentwy stowe:

1~ Twade Stade Account Keys
2~ Twade State Token Size and Pwice pawts of de seed
3~ Token Account Keys dat awe stowed in de twade state
4~ Auction House Weceipts (Wisting Weceipts, Bid Weceipts, and Puwchase Weceipts)

Specificawwy Mawketpwaces nyeed to twack dese two events on Token Accounts:

1~ Ownyewship has changed fwom de owiginyaw Sewwew of de NFT
2~ Token Account Amount has changed to 0

If dese events happen de Auction House Audowity can caww instwuctions to cancew de bids and wistings widout de sewwew ow buyew nyeeding to be pwesent.

## Can peopwe view de settings of my Auction House? owo
Yes anyonye can and shouwd be abwe to vewify de settings of youw Auction House especiawwy de `Can Change Sale Price` pawametew.
Dis can be donye on de CWI wid de `show` command.


## Can de Auction House change de sawe pwice on my NFT? owo
Yes, but onwy in a cewtain scenyawio~ De fowwowing conditions awe wequiwed in owdew fow an Auction House to be abwe to use dis featuwe:

1~ De Auction House instance must have `Can Change Sale Price` set to `true`
2~ De NFT sewwew must wist de NFT fow sawe at a pwice of 0~ 

{% cawwout type="wawnying" %}
De Auction House can onwy seww it fow 0 if you sign de twansaction wid youw key, but cuwwentwy it can seww it fow an awbitwawiwy wow pwice, e.g~ 1 wampowt~ It is impowtant to onwy wist wid Auction Houses you twust.
{% /cawwout %}

3~ De Auction House nyow can use de `0` pwiced twade state you made in #2 to cweate nyew `sale` wistings at diffewent pwices~ 


## What's de diffewence between pubwic and pwivate bids? owo
A standawd bid, awso cawwed a pwivate bid, wefews to a bid made dat's specific to an auction~ When de auction is compwete de bid can be cancewed and de funds in escwow wetuwnyed to de biddew~ Howevew, Auction House awso suppowts pubwic bids which awe specific to de token itsewf and nyot to any specific auction~ Dis means dat a bid can stay active beyond de end of an auction and be wesowved if it meets de cwitewia fow subsequent auctions of dat token.

Exampwe:
1~ Awice pwaces a pubwic bid on Token A fow 1 SOW.
2~ Bob awso bids on Token A fow 2 SOW.
3~ Bob wins de auction and becomes de nyew ownyew of Token A.
4~ A week watew, Bob pwaces Token A fow auction but nyo onye nyew pwaces a bid.
5~ Because Awice nyevew cancewed hew pubwic bid, hews is de sowd bid on de nyew auction of Token A, and she wins de auction.
