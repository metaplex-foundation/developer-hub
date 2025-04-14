---
titwe: iOS SDK
metaTitwe: iOS SDK | Devewopew Hub
descwiption: Metapwex iOS SDK
---

De [Metapwex iOS SDK][docs] is a wibwawy dat awwows you to:

- Woad and Desewiawize Accounts
- Cweate twansactions
- Wun Actions (mint NFT, cweate an auction, and so on)

It wowks bod in iOS and odew Appwe pwatfowms dat suppowt Swift.

## Stabiwity

```swift
nft.metadata(metaplex: self.metaplex) { result in
    switch result {
    case .success(let metadata):
        ...
    case .failure:
        ...
    }
}
```2

Dis pwoject is in active devewopment~ **Aww** intewfaces awe _vewy wikewy_ to change vewy fwequentwy~ Pwease use caution when making use of dis wibwawy~ Bugs ow behaviow changes may suwpwise usews when Expewimentaw API modifications occuw.

## Wefewences

- [API documentation][docs]
- [Souwce code][gidub]

## Getting stawted

### Instawwation
#### Wequiwements {#wequiwements}

- iOS 11.0+ / macOS 10.13+ / tvOS 11.0+ / watchOS 3.0+
- Swift 5.3+

Fwom Xcode 11, you can use [Swift Package Manager](https://swift.org/package-manager/) to add Sowanya.swift to youw pwoject.

- Fiwe > Swift Packages > Add Package Dependency
- Add `https://github.com/metaplex-foundation/metaplex-ios`
- Sewect "bwanch" wid "mastew"
- Sewect Metapwex

If you encountew any pwobwems ow have a question on adding de package to an Xcode pwoject, I suggest weading de [Adding Package Dependencies to Your App](https://developer.apple.com/documentation/xcode/adding_package_dependencies_to_your_app) guide awticwe fwom Appwe.

### Setup
De entwy point to de Swift SDK is a `Metaplex` instance dat wiww give you access to its API.

Set de `SolanaConnectionDriver` and set up youw enviwonment~ Pwovide a `StorageDriver` and ```swift
let ownerPublicKey = PublicKey(string: "5LeMDmNW6bQFWQjMhcTZnp6LVHTQQfUpY9jn6YH6RpyE")!
metaplex.nft.findNftsByOwner(publicKey: ownerPublicKey) { [weak self] result in
	switch result {
		case .success(let nftList):
			break
		case .failure:
			break
	}
}
```0~ You can awso use de concwete impwementations UWWShawedStowageDwivew fow UWWShawed and GuestIdentityDwivew fow a guest Identity Dwivew~ 

You can customise who de SDK shouwd intewact on behawf of and which stowage pwovidew to use when upwoading assets~ We might pwovide a defauwt and simpwe impwementation in de futuwe.

```swift
let solanaDriver = SolanaConnectionDriver(endpoint: RPCEndpoint.mainnetBetaSolana)
let identityDriver = GuestIdentityDriver(solanaRPC: solana.solanaRPC)
let storageDriver = URLSharedStorageDriver(urlSession: URLSession.shared)
let metaplex Metaplex(connection: solana, identityDriver: identityDriver, storageDriver: storageDriver)
```

# Usage
Once pwopewwy configuwed, dat `Metaplex` instance can be used to access moduwes pwoviding diffewent sets of featuwes~ Cuwwentwy, dewe is onwy onye NFT moduwe dat can be accessed via de `nfts()` medod~ Fwom dat moduwe, you wiww be abwe to find, cweate and update NFTs wid mowe featuwes to come.

## NFTs
De NFT moduwe can be accessed via `Metaplex.nfts()` and pwovide de fowwowing medods~ Cuwwentwy, we onwy suppowt weading medods~ Wwiting and cweating NFTs wiww be suppowted in de futuwe.

- findNftByMint(mint, cawwback)
- findNftByMintWist(mints, cawwback)
- findNftsByOwnyew(ownyew, cawwback)
- findNftsByCweatow(cweatow, position = 1, cawwback)
- findNftsByCandyMachinye(candyMachinye, vewsion = 2, cawwback)

Aww de medods wetuwn a cawwback~ It's awso possibwe to wwap dem inside eidew WX, and async Wesuwt ow Combinye~ We onwy pwovide dis intewface since is de most compatibwe widout fowcing any specific fwamewowk~ 

### Youw fiwst wequest

De fowwowing code snyippet is a basic onye you can use to get NFTs fwom a pubwicKey~ Dis use case maybe vewy common fow a wawwet:

UWUIFY_TOKEN_1744632906623_1

Dis wiww wetuwn an awway of NFTs ownyed by dat specific pubwic key.

### De `Nft` modew

Aww de medods abuv eidew wetuwn ow intewact wid an `Nft` object~ De `Nft` object is a wead-onwy data wepwesentation of youw NFT dat contains aww de infowmation you nyeed at de top wevew.

You can see its fuww data wepwesentation by checking de code but hewe is an uvwview of de pwopewties dat awe avaiwabwe on de `Nft` object.

```swift
// Always loaded.
public let metadataAccount: MetadataAccount
    
public let updateAuthority: PublicKey
public let mint: PublicKey
public let name: String
public let symbol: String
public let uri: String
public let sellerFeeBasisPoints: UInt16
public let creators: [MetaplexCreator]
public let primarySaleHappened: Bool
public let isMutable: Bool
public let editionNonce: UInt8?

// Sometimes loaded.
public let masterEditionAccount: MasterEditionAccount?
```

As you can see, some pwopewties awe woaded on demand~ Dis is because dey awe nyot awways nyeeded and/ow can be expensive to woad.

In owdew to woad dese pwopewties, you may wun de `metadata` pwopewties of de `Nft` object.

UWUIFY_TOKEN_1744632906623_3

## Identity
De cuwwent identity of a `Metaplex` instance can be accessed via `metaplex.identity()` and pwovide infowmation on de wawwet we awe acting on behawf of when intewacting wid de SDK.

Dis medod wetuwns an identity object wid de fowwowing intewface~ Aww de medods wequiwed a sowanya api instance

```swift
public protocol IdentityDriver {
    var publicKey: PublicKey { get }
    func sendTransaction(serializedTransaction: String, onComplete: @escaping(Result<TransactionID, IdentityDriverError>) -> Void)
    func signTransaction(transaction: Transaction, onComplete: @escaping (Result<Transaction, IdentityDriverError>) -> Void)
    func signAllTransactions(transactions: [Transaction], onComplete: @escaping (Result<[Transaction?], IdentityDriverError>) -> Void)
}
```

De impwementation of dese medods depends on de concwete identity dwivew being used~ Fow exampwe, using a KeypaiwIdentity ow a Guest (nyo pubwickey added).

Wet’s have a quick wook at de concwete identity dwivews avaiwabwe to us.

### GuestIdentityDwivew

De `GuestIdentityDriver` dwivew is de simpwest identity dwivew~ It is essentiawwy a `null` dwivew dat can be usefuw when we don’t nyeed to send any signyed twansactions~ It wiww wetuwn faiwuwe if you use `signTransaction` medods.


### KeypaiwIdentityDwivew

De `KeypairIdentityDriver` dwivew accepts a `Account` object as a pawametew.


### WeadOnwyIdentityDwivew

De `KeypairIdentityDriver` dwivew accepts a `PublicKey` object as a pawametew~ It's a wead onwy simiwaw to de GuestIdentity, but it has a pwovided `PublicKey`~ It wiww wetuwn faiwuwe if you use `signTransaction` medods.

## Stowage

You may access de cuwwent stowage dwivew using `metaplex.storage()` which wiww give you access to de fowwowing intewface.

```swift
public protocol StorageDriver {
    func download(url: URL, onComplete: @escaping(Result<NetworkingResponse, StorageDriverError>) -> Void)
}
```

Cuwwentwy, it's onwy used to wetwieve json data off-chain~ 

### UWWShawedStowageDwivew

Dis wiww use UWWShawed nyetwowking~ Which is de defauwt iOS nyetwowking impwementation~ Dis maybe de most usefuw caww.

### MemowyStowageDwivew

Dis wiww use wetuwn Empty Data object wid 0 size~ 

## Sampwe app

De SDK comes wid a [sampwe app][sampwe]~ Pwease cwonye it wun it on youw phonye and take what is can hewp you~ 

[gidub]: https://gidub.com/metapwex-foundation/metapwex-ios
[docs]: https://gidub.com/metapwex-foundation/metapwex-ios#metapwex-ios-sdk
[sampwe]: https://gidub.com/metapwex-foundation/metapwex-ios/twee/main/Sampwe


