---
title: iOS SDK
metaTitle: iOS SDK | Developer Hub
description: Metaplex iOS SDK
---

[Metaplex iOS SDK][docs]は、次のことを可能にするライブラリです：

- アカウントの読み込みと逆シリアル化
- トランザクションの作成
- アクション実行（NFTのミント、オークションの作成など）

iOSおよびSwiftをサポートする他のAppleプラットフォームで動作します。

## 安定性

[安定性 1 - 実験的](/stability-index)

このプロジェクトは活発に開発中です。**すべての**インターフェースは非常に頻繁に変更される可能性があります。このライブラリを使用する際は注意してください。実験的なAPI変更が発生すると、バグや動作の変更がユーザーを驚かせる可能性があります。

## リファレンス

- [APIドキュメント][docs]
- [ソースコード][github]

## はじめに

### インストール
#### 要件 {#requirements}

- iOS 11.0+ / macOS 10.13+ / tvOS 11.0+ / watchOS 3.0+
- Swift 5.3+

Xcode 11から、[Swift Package Manager](https://swift.org/package-manager/)を使用してSolana.swiftをプロジェクトに追加できます。

- File > Swift Packages > Add Package Dependency
- `https://github.com/metaplex-foundation/metaplex-ios`を追加
- 「branch」を選択し、「master」を選択
- Metaplexを選択

問題が発生した場合、またはXcodeプロジェクトへのパッケージの追加に関する質問がある場合は、Appleの[Adding Package Dependencies to Your App](https://developer.apple.com/documentation/xcode/adding_package_dependencies_to_your_app)ガイド記事を読むことをお勧めします。

### セットアップ
Swift SDKへのエントリーポイントは、APIにアクセスできる`Metaplex`インスタンスです。

`SolanaConnectionDriver`を設定し、環境を設定します。`StorageDriver`と`IdentityDriver`を提供します。URLShared用のURLSharedStorageDriverとゲストIdentity Driver用のGuestIdentityDriverの具体的な実装も使用できます。

SDKが誰の代わりに対話するべきか、およびアセットをアップロードするときにどのストレージプロバイダーを使用するかをカスタマイズできます。将来的にはデフォルトで簡単な実装を提供する可能性があります。

```swift
let solanaDriver = SolanaConnectionDriver(endpoint: RPCEndpoint.mainnetBetaSolana)
let identityDriver = GuestIdentityDriver(solanaRPC: solana.solanaRPC)
let storageDriver = URLSharedStorageDriver(urlSession: URLSession.shared)
let metaplex Metaplex(connection: solana, identityDriver: identityDriver, storageDriver: storageDriver)
```

# 使用方法
適切に設定されると、その`Metaplex`インスタンスを使用して、さまざまな機能セットを提供するモジュールにアクセスできます。現在、`nfts()`メソッドを介してアクセスできるNFTモジュールが1つだけあります。そのモジュールから、NFTの検索、作成、更新ができ、さらに多くの機能が追加される予定です。

## NFT
NFTモジュールは`Metaplex.nfts()`を介してアクセスでき、以下のメソッドを提供します。現在、読み取りメソッドのみをサポートしています。NFTの作成と更新は将来サポートされる予定です。

- findNftByMint(mint, callback)
- findNftByMintList(mints, callback)
- findNftsByOwner(owner, callback)
- findNftsByCreator(creator, position = 1, callback)
- findNftsByCandyMachine(candyMachine, version = 2, callback)

すべてのメソッドはコールバックを返します。RX、非同期Result、またはCombine内にラップすることもできます。特定のフレームワークを強制せずに最も互換性があるため、このインターフェースのみを提供します。

### 最初のリクエスト

以下のコードスニペットは、publicKeyからNFTを取得するために使用できる基本的なものです。このユースケースはウォレットにとって非常に一般的です：

```swift
let ownerPublicKey = PublicKey(string: "5LeMDmNW6bQFWQjMhcTZnp6LVHTQQfUpY9jn6YH6RpyE")!
metaplex.nft.findNftsByOwner(publicKey: ownerPublicKey) { [weak self] result in
	switch result {
		case .success(let nftList):
			break
		case .failure:
			break
	}
}
```

これにより、その特定の公開鍵が所有するNFTの配列が返されます。

### `Nft`モデル

上記のすべてのメソッドは、`Nft`オブジェクトを返すか、対話します。`Nft`オブジェクトは、トップレベルで必要なすべての情報を含むNFTの読み取り専用データ表現です。

コードをチェックすることで完全なデータ表現を確認できますが、`Nft`オブジェクトで利用可能なプロパティの概要を以下に示します。

```swift
// 常に読み込まれます。
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

// 時々読み込まれます。
public let masterEditionAccount: MasterEditionAccount?
```

ご覧のとおり、一部のプロパティはオンデマンドで読み込まれます。これは、常に必要とは限らず、読み込むのにコストがかかる可能性があるためです。

これらのプロパティを読み込むには、`Nft`オブジェクトの`metadata`プロパティを実行する必要があります。

```swift
nft.metadata(metaplex: self.metaplex) { result in
    switch result {
    case .success(let metadata):
        ...
    case .failure:
        ...
    }
}
```

## アイデンティティ
`Metaplex`インスタンスの現在のアイデンティティは`metaplex.identity()`を介してアクセスでき、SDKと対話するときに誰の代わりに行動しているかについての情報を提供します。

このメソッドは、以下のインターフェースを持つアイデンティティオブジェクトを返します。すべてのメソッドにはsolana apiインスタンスが必要です

```swift
public protocol IdentityDriver {
    var publicKey: PublicKey { get }
    func sendTransaction(serializedTransaction: String, onComplete: @escaping(Result<TransactionID, IdentityDriverError>) -> Void)
    func signTransaction(transaction: Transaction, onComplete: @escaping (Result<Transaction, IdentityDriverError>) -> Void)
    func signAllTransactions(transactions: [Transaction], onComplete: @escaping (Result<[Transaction?], IdentityDriverError>) -> Void)
}
```

これらのメソッドの実装は、使用されている具体的なアイデンティティドライバーに依存します。たとえば、KeypairIdentityまたはGuest（公開鍵が追加されていない）を使用します。

利用可能な具体的なアイデンティティドライバーを簡単に見てみましょう。

### GuestIdentityDriver

`GuestIdentityDriver`ドライバーは最もシンプルなアイデンティティドライバーです。これは本質的に`null`ドライバーであり、署名されたトランザクションを送信する必要がない場合に便利です。`signTransaction`メソッドを使用すると失敗を返します。


### KeypairIdentityDriver

`KeypairIdentityDriver`ドライバーは、パラメーターとして`Account`オブジェクトを受け入れます。


### ReadOnlyIdentityDriver

`KeypairIdentityDriver`ドライバーは、パラメーターとして`PublicKey`オブジェクトを受け入れます。GuestIdentityに似た読み取り専用ですが、提供された`PublicKey`があります。`signTransaction`メソッドを使用すると失敗を返します。

## ストレージ

`metaplex.storage()`を使用して現在のストレージドライバーにアクセスでき、次のインターフェースにアクセスできます。

```swift
public protocol StorageDriver {
    func download(url: URL, onComplete: @escaping(Result<NetworkingResponse, StorageDriverError>) -> Void)
}
```

現在、オフチェーンでjsonデータを取得するためにのみ使用されています。

### URLSharedStorageDriver

これはURLSharedネットワーキングを使用します。これはデフォルトのiOSネットワーキング実装です。これが最も便利な呼び出しかもしれません。

### MemoryStorageDriver

これは、サイズが0の空のDataオブジェクトを返します。

## サンプルアプリ

SDKには[サンプルアプリ][sample]が付属しています。クローンして電話で実行し、役立つものを取ってください。

[github]: https://github.com/metaplex-foundation/metaplex-ios
[docs]: https://github.com/metaplex-foundation/metaplex-ios#metaplex-ios-sdk
[sample]: https://github.com/metaplex-foundation/metaplex-ios/tree/main/Sample
