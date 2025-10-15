---
title: Android SDK
metaTitle: Android SDK | Developer Hub
description: Metaplex Android SDK
---

Metaplex Android SDKは、次のことを可能にするライブラリです：

- アカウントの読み込みと逆シリアル化
- トランザクションの作成
- アクション実行（NFTのミント、オークションの作成など）

Androidおよびkotlinをサポートする他のプラットフォームで動作します。

## 安定性

[安定性 1 - 実験的](/stability-index)

このプロジェクトは開発中です。**すべての**インターフェースは非常に頻繁に変更される可能性があります。このライブラリを使用する際は注意してください。実験的なAPI変更が発生すると、バグや動作の変更がユーザーを驚かせる可能性があります。

## リファレンス

- [ソースコード][github]

## はじめに

### インストール
#### 要件 {#requirements}

- Android 21+

GitHubが推奨するアーティファクトの読み込み方法を使用することをお勧めします。まず、[アカウント設定](https://github.com/settings/tokens)からGitHubトークンを取得します。

settings.gradle内にmavenリポジトリを追加します：

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

次にbuild.gradleで：

```
dependencies {
	...
	implementation 'com.metaplex:metaplex:+' // バージョンを設定
}
```

その後、gradleを同期します。

## JitPackリリース

ライブラリはJitPack.ioを通じて利用可能になりました。

まず、JitPackリポジトリをビルドに追加します：
```

repositories {
	...
	maven { url 'https://jitpack.io' }
}

```
次に、アプリ/モジュールの'build.gradle'ファイルに依存関係を追加します：
```
dependencies {
	...
	implementation 'com.github.metaplex-foundation:metaplex-android:{version}'
}
```

## セットアップ

Android SDKへのエントリーポイントは、APIにアクセスできる`Metaplex`インスタンスです。

`SolanaConnectionDriver`を設定し、環境を設定します。`StorageDriver`と`IdentityDriver`を提供します。OKHttp用のOkHttpSharedStorageDriverと読み取り専用Identity Driver用のReadOnlyIdentityDriverの具体的な実装も使用できます。

SDKが誰の代わりに対話するべきか、およびアセットをアップロードするときにどのストレージプロバイダーを使用するかをカスタマイズできます。将来的にはデフォルトで簡単な実装を提供する可能性があります。

```kotlin
val ownerPublicKey = PublicKey("<Any PublicKey>")
val solanaConnection = SolanaConnectionDriver(RPCEndpoint.mainnetBetaSolana)
val solanaIdentityDriver = ReadOnlyIdentityDriver(ownerPublicKey, solanaConnection.solanaRPC)
val storageDriver = OkHttpSharedStorageDriver()
val metaplex = Metaplex(solanaConnection, solanaIdentityDriver, storageDriver)
```

# 使用方法
適切に設定されると、その`Metaplex`インスタンスを使用して、さまざまな機能セットを提供するモジュールにアクセスできます。現在、`nft`プロパティを介してアクセスできるNFTモジュールが1つだけあります。そのモジュールから、NFTの検索、作成、更新ができ、さらに多くの機能が追加される予定です。

## NFT
NFTモジュールは`Metaplex.nft`を介してアクセスでき、以下のメソッドを提供します。現在、読み取りメソッドのみをサポートしています。NFTの作成と更新は将来サポートされる予定です。

- findByMint(mint, callback)
- findAllByMintList(mints, callback)
- findAllByOwner(owner, callback)
- findAllByCreator(creator, position = 1, callback)
- findAllByCandyMachine(candyMachine, version = 2, callback)

すべてのメソッドはコールバックを返します。RXまたはAsync Result内にラップすることもできます。特定のフレームワークを強制せずに最も互換性があるため、このインターフェースのみを提供します。

### 最初のリクエスト

以下のコードスニペットは、publicKeyからNFTを取得するために使用できる基本的なものです。このユースケースはウォレットにとって非常に一般的です：

```kotlin
metaplex.nft.findByMint(mintPublicKey){
	it.onSuccess {
		...
	}.onFailure {
		...
	}
}
```

これにより、その特定の公開鍵が所有するNFTの配列が返されます。

### `Nft`モデル

上記のすべてのメソッドは、`Nft`オブジェクトを返すか、対話します。`Nft`オブジェクトは、トップレベルで必要なすべての情報を含むNFTの読み取り専用データ表現です。

コードをチェックすることで完全なデータ表現を確認できますが、`Nft`オブジェクトで利用可能なプロパティの概要を以下に示します。

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

ご覧のとおり、一部のプロパティはオンデマンドで読み込まれます。これは、常に必要とは限らず、読み込むのにコストがかかる可能性があるためです。

これらのプロパティを読み込むには、`Nft`オブジェクトの`metadata`プロパティを実行する必要があります。

```kotlin
nft..metadata(metaplex) { result ->
	it.onSuccess {
		...
	}.onFailure {
		...
	}
}
```

## オークション
Metaplex Auction Houseプロトコルにより、誰でも分散型販売契約を実装し、希望するSPLトークンを受け入れることができます。

オークションモジュールは`Metaplex.auctions`を介してアクセスでき、以下のメソッドを提供します。現在、読み取りメソッドのみをサポートしています。Auction Houseの作成、およびビッドとリスティングの対話と作成は、将来サポートされる予定です。

- [`findAuctionHouseByAddress(address)`](#findAuctionHouseByAddress)
- [`findAuctionHouseByCreatorAndMint(creator, treasuryMint)`](#findAllByMintList)
- さらに近日公開予定！

すべてのメソッドは、アプリケーションでより柔軟性と互換性を提供するために、構成可能な[サスペンド関数](https://kotlinlang.org/docs/composing-suspending-functions.html)として提供されます。

**注意：** Auctions APIが提供するこれらのサスペンド関数は、ライブラリのアーキテクチャの変更です。以前は非同期コールバックメソッドのみを提供していました。すべてのユーザーが新しいサスペンド関数に移行することを強くお勧めしますが、利用可能なメソッドの非同期コールバック実装も提供しています。これらのメソッドは暫定的に提供されており、将来的に非推奨になる可能性があることに注意してください：

- [`findAuctionHouseByAddress(address, callback)`](#findAuctionHouseByAddress)
- [`findAuctionHouseByCreatorAndMint(creator, treasuryMint, callback)`](#findAllByMintList)

### findAuctionHouseByAddress

`findAuctionHouseByAddress`メソッドは公開鍵を受け入れ、AuctionHouseオブジェクトを返すか、指定されたアドレスにAuctionHouseが見つからなかった場合はエラーを返します。

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByAddress(addressPublicKey).getOrNull()
```

### findAuctionHouseByCreatorAndMint

`findAuctionHouseByCreatorAndMint`メソッドは公開鍵を受け入れ、AuctionHouseオブジェクトを返すか、指定されたアドレスにAuctionHouseが見つからなかった場合はエラーを返します。

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByCreatorAndMint(creatorPublicKey, mintPublicKey).getOrNull()
```

返される`AuctionHouse`モデルには、チェーン上のAuction Houseアカウントに関する詳細が含まれます。将来的には、このモデルを使用してオークションと対話し、取引を実行する`AuctionHouseClient`インスタンスを構築します。

## アイデンティティ
`Metaplex`インスタンスの現在のアイデンティティは`metaplex.identity()`を介してアクセスでき、SDKと対話するときに誰の代わりに行動しているかについての情報を提供します。

このメソッドは、以下のインターフェースを持つアイデンティティオブジェクトを返します。すべてのメソッドにはsolana apiインスタンスが必要です

```kotlin
interface IdentityDriver {
    val publicKey: PublicKey
    fun sendTransaction(transaction: Transaction, recentBlockHash: String? = null, onComplete: ((Result<String>) -> Unit))
    fun signTransaction(transaction: Transaction, onComplete: (Result<Transaction>) -> Unit)
    fun signAllTransactions(transactions: List<Transaction>, onComplete: (Result<List<Transaction?>>) -> Unit)
}
```

これらのメソッドの実装は、使用されている具体的なアイデンティティドライバーに依存します。たとえば、KeypairIdentityまたはGuest（公開鍵が追加されていない）を使用します

利用可能な具体的なアイデンティティドライバーを簡単に見てみましょう。

### GuestIdentityDriver

`GuestIdentityDriver`ドライバーは最もシンプルなアイデンティティドライバーです。これは本質的に`null`ドライバーであり、署名されたトランザクションを送信する必要がない場合に便利です。`signTransaction`メソッドを使用すると失敗を返します。


### KeypairIdentityDriver

`KeypairIdentityDriver`ドライバーは、パラメーターとして`Account`オブジェクトを受け入れます。


### ReadOnlyIdentityDriver

`KeypairIdentityDriver`ドライバーは、パラメーターとして`PublicKey`オブジェクトを受け入れます。GuestIdentityに似た読み取り専用ですが、提供された`PublicKey`があります。`signTransaction`メソッドを使用すると失敗を返します。

## ストレージ

`metaplex.storage()`を使用して現在のストレージドライバーにアクセスでき、次のインターフェースにアクセスできます。

```kotlin
interface StorageDriver {
    fun download(url: URL, onComplete: (ResultWithCustomError<NetworkingResponse, StorageDriverError>) -> Unit)
}
```

現在、オフチェーンでjsonデータを取得するためにのみ使用されています。

### OkHttpSharedStorageDriver

これはOkHttpネットワーキングを使用します。これは最も人気のあるAndroidネットワーキング実装ライブラリです。これが最も便利な実装かもしれません。

### MemoryStorageDriver

これは、サイズが0の空のDataオブジェクトを返します。

## サンプルアプリ

SDKには[サンプルアプリ](https://github.com/metaplex-foundation/metaplex-android/tree/main/sample)が付属しています。クローンして電話で実行し、役立つものを取ってください。

[github]: https://github.com/metaplex-foundation/metaplex-android
[sample]: https://github.com/metaplex-foundation/metaplex-android/tree/main/sample
