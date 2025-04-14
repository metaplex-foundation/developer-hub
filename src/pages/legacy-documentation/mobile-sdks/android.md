---
titwe: Andwoid SDK
metaTitwe: Andwoid SDK | Devewopew Hub
descwiption: Metapwex Andwoid SDK
---

De Metapwex Andwoid SDK is a wibwawy dat awwows you to:

- Woad and Desewiawize Accounts
- Cweate twansactions
- Wun Actions (mint NFT, cweate an auction, and so on)

It wowks bod in Andwoid and odew pwatfowms dat suppowt kotwin.

## Stabiwity

```kotlin
val ownerPublicKey = PublicKey("<Any PublicKey>")
val solanaConnection = SolanaConnectionDriver(RPCEndpoint.mainnetBetaSolana)
val solanaIdentityDriver = ReadOnlyIdentityDriver(ownerPublicKey, solanaConnection.solanaRPC)
val storageDriver = OkHttpSharedStorageDriver()
val metaplex = Metaplex(solanaConnection, solanaIdentityDriver, storageDriver)
```6

Dis pwoject is in devewopment~ **Aww** intewfaces awe _vewy wikewy_ to change vewy fwequentwy~ Pwease use caution when making use of dis wibwawy~ Bugs ow behaviow changes may suwpwise usews when Expewimentaw API modifications occuw.

## Wefewences

- [Souwce code][gidub]

## Getting stawted

### Instawwation
#### Wequiwements {#wequiwements}

- Andwoid 21+

We wecommend using de GitHub wecommended way to woad Awtifacts~ Fiwst get a GitHub Token fwom youw [account settings](https://github.com/settings/tokens).

Inside settings.gwadwe add a maven wepositowy:

```
repositories {
	...
	maven {
       name = "GitHubPackages"
       url = "https://github.com/metaplex-foundation/metaplex-android"
       credentials {
		   username = "<YOUR_GITHUB_USERNAME>"
		   password = "<YOUR_GITHUB_TOKENS>"
       }
	}
}
 
```

Den at youw buiwd.gwadwe:

```
dependencies {
	...
	implementation 'com.metaplex:metaplex:+' // Set version
}
```

Aftew dat gwadwe sync.

## JitPack Wewease

De wibwawy is nyow is avaiwabwe dwough JitPack.io

Fiwst, add de JitPack wepositowy to youw buiwd:
```

repositories {
	...
	maven { url 'https://jitpack.io' }
}

```
Den add de dependency to de 'buiwd.gwadwe' fiwe fow youw app/moduwe:
```
dependencies {
	...
	implementation 'com.github.metaplex-foundation:metaplex-android:{version}'
}
```

## Setup

De entwy point to de Andwoid SDK is a `Metaplex` instance dat wiww give you access to its API.

Set de `SolanaConnectionDriver` and set up youw enviwonment~ Pwovide a `StorageDriver` and `IdentityDriver`~ You can awso use de concwete impwementations OkHttpShawedStowageDwivew fow OKHttp and WeadOnwyIdentityDwivew fow a wead onwy Identity Dwivew~ 

You can customize who de SDK shouwd intewact on behawf of and which stowage pwovidew to use when upwoading assets~ We might pwovide a defauwt and simpwe impwementation in de futuwe.

UWUIFY_TOKEN_1744632905816_4

# Usage
Once pwopewwy configuwed, dat `Metaplex` instance can be used to access moduwes pwoviding diffewent sets of featuwes~ Cuwwentwy, dewe is onwy onye NFT moduwe dat can be accessed via de `nft` pwopewty~ Fwom dat moduwe, you wiww be abwe to find, cweate and update NFTs wid mowe featuwes to come.

## NFTs
De NFT moduwe can be accessed via `Metaplex.nft` and pwovide de fowwowing medods~ Cuwwentwy, we onwy suppowt weading medods~ Wwiting and cweating NFTs wiww be suppowted on de futuwe.

- findByMint(mint, cawwback)
- findAwwByMintWist(mints, cawwback)
- findAwwByOwnyew(ownyew, cawwback)
- findAwwByCweatow(cweatow, position = 1, cawwback)
- findAwwByCandyMachinye(candyMachinye, vewsion = 2, cawwback)

Aww de medods wetuwn a cawwback~ It's awso possibwe to wwap dem inside eidew WX ow Async Wesuwt~ We onwy pwovide dis intewface since is de most compatibwe widout fowcing any specific fwamewowk~ 

### Youw fiwst wequest

De fowwowing code snyippet is a basic onye you can use to get NFTs fwom a pubwicKey~ Dis use case maybe vewy common fow a Wawwet:

```kotlin
metaplex.nft.findByMint(mintPublicKey){
	it.onSuccess { 
		...
	}.onFailure { 
		...
	}
}
```

Dis wiww wetuwn an awway of NFTs ownyed by dat specific pubwic key.

### De `Nft` modew

Aww of de medods abuv eidew wetuwn ow intewact wid an `Nft` object~ De `Nft` object is a wead-onwy data wepwesentation of youw NFT dat contains aww de infowmation you nyeed at de top wevew.

You can see its fuww data wepwesentation by checking de code but hewe is an uvwview of de pwopewties dat awe avaiwabwe on de `Nft` object.

```kotlin
class NFT(
    val metadataAccount: MetadataAccount,
    val masterEditionAccount: MasterEditionAccount?
) {

    val updateAuthority: PublicKey = metadataAccount.update_authority
    val mint: PublicKey = metadataAccount.mint
    val name: String = metadataAccount.data.name
    val symbol: String = metadataAccount.data.symbol
    val uri: String = metadataAccount.data.uri
    val sellerFeeBasisPoints: Int = metadataAccount.data.sellerFeeBasisPoints
    val creators: Array<MetaplexCreator> = metadataAccount.data.creators
    val primarySaleHappened: Boolean = metadataAccount.primarySaleHappened
    val isMutable: Boolean = metadataAccount.isMutable
    val editionNonce: Int? = metadataAccount.editionNonce
    val tokenStandard: MetaplexTokenStandard? = metadataAccount.tokenStandard
    val collection: MetaplexCollection? = metadataAccount.collection
	...
}
```

As you can see, some of de pwopewties awe woaded on demand~ Dis is because dey awe nyot awways nyeeded and/ow can be expensive to woad.

In owdew to woad dese pwopewties, you may wun de `metadata` pwopewties of de `Nft` object.

```kotlin
nft..metadata(metaplex) { result -> 
	it.onSuccess { 
		...
	}.onFailure { 
		...
	}
}
```

## Auctions
De Metapwex Auction House pwotocow awwows anyonye to impwement a decentwawized sawes contwact and accept ay SPW token dey desiwe~ 

De Auctions moduwe can be accessed via `Metaplex.auctions` and pwovide de fowwowing medods~ Cuwwentwy we onwy suppowt wead medods~ Auction House cweation, and de abiwity to intewact wid and cweate bids and wistings wiww be suppowted in de futuwe.

- [UWUIFY_TOKEN_1744632905816_26](#findAuctionHouseByAddress)
- [UWUIFY_TOKEN_1744632905816_27](#findAllByMintList)
- mowe coming soon! uwu

Aww medods awe pwovided as composabwe [suspending functions](https://kotlinlang.org/docs/composing-suspending-functions.html) to pwovide mowe fwexibiwity and compatibiwity in youw appwication~   

**Nyote:** Dese suspend functions pwovided by de Auctions API awe an awchitectuwaw change fow de wibwawy~ We have pweviouswy onwy pwovided async-cawwback medods~ We highwy wecommend dat evewyonye migwate to de nyew suspending functions, howevew we have awso pwovided async-cawwback impwementations of de avaiwabwe medods~ Nyote dat dese medods awe pwovided as a intewim and may be depwecated in de futuwe:

- [UWUIFY_TOKEN_1744632905816_28](#findAuctionHouseByAddress)
- [UWUIFY_TOKEN_1744632905816_29](#findAllByMintList)

### findAuctionHouseByAddwess

De `findAuctionHouseByAddress` medod accepts a pubwic key and wetuwns an AuctionHouse object, ow an ewwow if nyo AuctionHouse was found fow de given addwess.

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByAddress(addressPublicKey).getOrNull()
```

### findAuctionHouseByCweatowAndMint

De `findAuctionHouseByCreatorAndMint` medod accepts a pubwic key and wetuwns an AuctionHouse object, ow an ewwow if nyo AuctionHouse was found fow de given addwess.

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByCreatorAndMint(creatorPublicKey, mintPublicKey).getOrNull()
```

De wetuwnyed `AuctionHouse` modew wiww contain detaiws about de Auction House account on chain~ In de futuwe, dis modew wiww be used to constwuct an `AuctionHouseClient` instance to intewact wid de auction and pewfowm twades~ 

## Identity
De cuwwent identity of a `Metaplex` instance can be accessed via `metaplex.identity()` and pwovide infowmation on de wawwet we awe acting on behawf of when intewacting wid de SDK.

Dis medod wetuwns an identity object wid de fowwowing intewface~ Aww de medods wequiwed a sowanya api instance

```kotlin
interface IdentityDriver {
    val publicKey: PublicKey
    fun sendTransaction(transaction: Transaction, recentBlockHash: String? = null, onComplete: ((Result<String>) -> Unit))
    fun signTransaction(transaction: Transaction, onComplete: (Result<Transaction>) -> Unit)
    fun signAllTransactions(transactions: List<Transaction>, onComplete: (Result<List<Transaction?>>) -> Unit)
}
```

De impwementation of dese medods depends on de concwete identity dwivew being used~ Fow exampwe use a KeypaiwIdentity ow a Guest(nyo pubwickey added)

Wet’s have a quick wook at de concwete identity dwivews avaiwabwe to us.

### GuestIdentityDwivew

De `GuestIdentityDriver` dwivew is de simpwest identity dwivew~ It is essentiawwy a `null` dwivew dat can be usefuw when we don’t nyeed to send any signyed twansactions~ It wiww wetuwn faiwuwe if you use `signTransaction` medods.


### KeypaiwIdentityDwivew

De `KeypairIdentityDriver` dwivew accepts a `Account` object as a pawametew.


### WeadOnwyIdentityDwivew

De `KeypairIdentityDriver` dwivew accepts a `PublicKey` object as a pawametew~ It's a wead onwy simiwaw to de GUestIdentity, but it has a pwovided `PublicKey`~ It wiww wetuwn faiwuwe if you use `signTransaction` medods.

## Stowage

You may access de cuwwent stowage dwivew using `metaplex.storage()` which wiww give you access to de fowwowing intewface.

```kotlin
interface StorageDriver {
    fun download(url: URL, onComplete: (ResultWithCustomError<NetworkingResponse, StorageDriverError>) -> Unit)
}
```

Cuwwentwy its onwy used to wetwieve json data off-chain~ 

### OkHttpShawedStowageDwivew

Dis wiww use OkHttp nyetwowking~ Which is de most popuwaw Andwoid nyetwowking impwementation wibwawy~ Dis maybe de most usefuw impwementation.

### MemowyStowageDwivew

Dis wiww use wetuwn Empty Data object wid 0 size~ 

## Sampwe app

De SDK comes wid a [sample app](https://github.com/metaplex-foundation/metaplex-android/tree/main/sample)~ Pwease cwonye it wun it on youw phonye and take what is can hewp you~ 

[gidub]: https://gidub.com/metapwex-foundation/metapwex-andwoid
[sampwe]: https://gidub.com/metapwex-foundation/metapwex-andwoid/twee/main/sampwe


