---
title: Android SDK
metaTitle: Android SDK | 开发者中心
description: Metaplex Android SDK
---

Metaplex Android SDK 是一个允许您执行以下操作的库:

- 加载和反序列化账户
- 创建交易
- 运行操作(铸造 NFT、创建拍卖等)

它在 Android 和其他支持 kotlin 的平台上都可以工作。

## 稳定性

[稳定性 1 - 实验性](/zh/security)

此项目正在开发中。**所有**接口_很可能_会非常频繁地更改。使用此库时请谨慎。当实验性 API 修改发生时,错误或行为更改可能会让用户感到惊讶。

## 参考

- [源代码][github]

## 入门

### 安装
#### 要求 {#requirements}

- Android 21+

我们建议使用 GitHub 推荐的方式加载工件。首先从您的[账户设置](https://github.com/settings/tokens)获取 GitHub 令牌。

在 settings.gradle 中添加 maven 仓库:

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

然后在您的 build.gradle 中:

```
dependencies {
 ...
 implementation 'com.metaplex:metaplex:+' // 设置版本
}
```

之后进行 gradle 同步。

## JitPack 发布

该库现在可通过 JitPack.io 获得

首先,将 JitPack 仓库添加到您的构建中:
```

repositories {
 ...
 maven { url 'https://jitpack.io' }
}

```
然后将依赖项添加到您的应用程序/模块的 'build.gradle' 文件中:
```
dependencies {
 ...
 implementation 'com.github.metaplex-foundation:metaplex-android:{version}'
}
```

## 设置

Android SDK 的入口点是一个 `Metaplex` 实例,它将为您提供对其 API 的访问。

设置 `SolanaConnectionDriver` 并设置您的环境。提供 `StorageDriver` 和 `IdentityDriver`。您还可以使用 OKHttp 的具体实现 OkHttpSharedStorageDriver 和只读身份驱动程序的 ReadOnlyIdentityDriver。

您可以自定义 SDK 应代表谁进行交互以及在上传资产时使用哪个存储提供程序。我们可能会在未来提供默认和简单的实现。

```kotlin
val ownerPublicKey = PublicKey("<Any PublicKey>")
val solanaConnection = SolanaConnectionDriver(RPCEndpoint.mainnetBetaSolana)
val solanaIdentityDriver = ReadOnlyIdentityDriver(ownerPublicKey, solanaConnection.solanaRPC)
val storageDriver = OkHttpSharedStorageDriver()
val metaplex = Metaplex(solanaConnection, solanaIdentityDriver, storageDriver)
```

正确配置后,该 `Metaplex` 实例可用于访问提供不同功能集的模块。目前,只有一个 NFT 模块可以通过 `nft` 属性访问。从该模块中,您将能够查找、创建和更新 NFT,未来还会有更多功能。

## NFT
NFT 模块可以通过 `Metaplex.nft` 访问并提供以下方法。目前,我们只支持读取方法。未来将支持写入和创建 NFT。

- findByMint(mint, callback)
- findAllByMintList(mints, callback)
- findAllByOwner(owner, callback)
- findAllByCreator(creator, position = 1, callback)
- findAllByCandyMachine(candyMachine, version = 2, callback)

所有方法都返回回调。也可以将它们包装在 RX 或异步结果中。我们仅提供此接口,因为它是最兼容的,不会强制使用任何特定框架。

### 您的第一个请求

以下代码片段是一个基本代码片段,您可以使用它从公钥获取 NFT。这个用例对于钱包来说可能非常常见:

```kotlin
metaplex.nft.findByMint(mintPublicKey){
 it.onSuccess {
  ...
 }.onFailure {
  ...
 }
}
```

这将返回该特定公钥拥有的 NFT 数组。

### `Nft` 模型

上述所有方法都返回或与 `Nft` 对象交互。`Nft` 对象是您的 NFT 的只读数据表示,包含您在顶层需要的所有信息。

您可以通过查看代码来查看其完整的数据表示,但这里是 `Nft` 对象上可用属性的概述。

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

如您所见,某些属性是按需加载的。这是因为它们并不总是需要和/或加载成本可能很高。

为了加载这些属性,您可以运行 `Nft` 对象的 `metadata` 属性。

```kotlin
nft..metadata(metaplex) { result ->
 it.onSuccess {
  ...
 }.onFailure {
  ...
 }
}
```

## 拍卖
Metaplex 拍卖行协议允许任何人实施去中心化的销售合约并接受他们想要的任何 SPL 代币。

拍卖模块可以通过 `Metaplex.auctions` 访问并提供以下方法。目前我们只支持读取方法。未来将支持拍卖行创建以及与出价和列表交互和创建的能力。

- [`findAuctionHouseByAddress(address)`](#findAuctionHouseByAddress)
- [`findAuctionHouseByCreatorAndMint(creator, treasuryMint)`](#findAllByMintList)
- 更多即将推出!

所有方法都作为可组合的[挂起函数](https://kotlinlang.org/docs/composing-suspending-functions.html)提供,以在您的应用程序中提供更多的灵活性和兼容性。

**注意:** 拍卖 API 提供的这些挂起函数是库的架构更改。我们以前只提供异步回调方法。我们强烈建议每个人都迁移到新的挂起函数,但我们也提供了可用方法的异步回调实现。请注意,这些方法作为临时方案提供,将来可能会被弃用:

- [`findAuctionHouseByAddress(address, callback)`](#findAuctionHouseByAddress)
- [`findAuctionHouseByCreatorAndMint(creator, treasuryMint, callback)`](#findAllByMintList)

### findAuctionHouseByAddress

`findAuctionHouseByAddress` 方法接受公钥并返回 AuctionHouse 对象,如果未找到给定地址的 AuctionHouse,则返回错误。

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByAddress(addressPublicKey).getOrNull()
```

### findAuctionHouseByCreatorAndMint

`findAuctionHouseByCreatorAndMint` 方法接受公钥并返回 AuctionHouse 对象,如果未找到给定地址的 AuctionHouse,则返回错误。

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByCreatorAndMint(creatorPublicKey, mintPublicKey).getOrNull()
```

返回的 `AuctionHouse` 模型将包含有关链上拍卖行账户的详细信息。将来,此模型将用于构造 `AuctionHouseClient` 实例以与拍卖交互并执行交易。

## 身份
`Metaplex` 实例的当前身份可以通过 `metaplex.identity()` 访问,并提供有关在与 SDK 交互时我们代表哪个钱包行事的信息。

此方法返回具有以下接口的身份对象。所有方法都需要 solana api 实例

```kotlin
interface IdentityDriver {
    val publicKey: PublicKey
    fun sendTransaction(transaction: Transaction, recentBlockHash: String? = null, onComplete: ((Result<String>) -> Unit))
    fun signTransaction(transaction: Transaction, onComplete: (Result<Transaction>) -> Unit)
    fun signAllTransactions(transactions: List<Transaction>, onComplete: (Result<List<Transaction?>>) -> Unit)
}
```

这些方法的实现取决于正在使用的具体身份驱动程序。例如,使用 KeypairIdentity 或 Guest(未添加公钥)

让我们快速看看可用的具体身份驱动程序。

### GuestIdentityDriver

`GuestIdentityDriver` 驱动程序是最简单的身份驱动程序。它本质上是一个 `null` 驱动程序,当我们不需要发送任何签名交易时很有用。如果您使用 `signTransaction` 方法,它将返回失败。

### KeypairIdentityDriver

`KeypairIdentityDriver` 驱动程序接受 `Account` 对象作为参数。

### ReadOnlyIdentityDriver

`KeypairIdentityDriver` 驱动程序接受 `PublicKey` 对象作为参数。它是类似于 GuestIdentity 的只读,但它有一个提供的 `PublicKey`。如果您使用 `signTransaction` 方法,它将返回失败。

## 存储

您可以使用 `metaplex.storage()` 访问当前存储驱动程序,它将为您提供对以下接口的访问。

```kotlin
interface StorageDriver {
    fun download(url: URL, onComplete: (ResultWithCustomError<NetworkingResponse, StorageDriverError>) -> Unit)
}
```

目前它仅用于检索链外 json 数据。

### OkHttpSharedStorageDriver

这将使用 OkHttp 网络。这是最流行的 Android 网络实现库。这可能是最有用的实现。

### MemoryStorageDriver

这将使用返回大小为 0 的空数据对象。

## 示例应用

SDK 附带了一个[示例应用](https://github.com/metaplex-foundation/metaplex-android/tree/main/sample)。请克隆它,在您的手机上运行它,并获取它可以帮助您的内容。

[github]: https://github.com/metaplex-foundation/metaplex-android
[sample]: https://github.com/metaplex-foundation/metaplex-android/tree/main/sample
