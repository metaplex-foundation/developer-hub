---
title: iOS SDK
metaTitle: iOS SDK | 开发者中心
description: Metaplex iOS SDK
---

[Metaplex iOS SDK][docs] 是一个允许您执行以下操作的库:

- 加载和反序列化账户
- 创建交易
- 运行操作(铸造 NFT、创建拍卖等)

它在 iOS 和其他支持 Swift 的 Apple 平台上都可以工作。

## 稳定性

[稳定性 1 - 实验性](/zh/security)

此项目正在积极开发中。**所有**接口_很可能_会非常频繁地更改。使用此库时请谨慎。当实验性 API 修改发生时,错误或行为更改可能会让用户感到惊讶。

## 参考

- [API 文档][docs]
- [源代码][github]

## 入门

### 安装
#### 要求 {#requirements}

- iOS 11.0+ / macOS 10.13+ / tvOS 11.0+ / watchOS 3.0+
- Swift 5.3+

从 Xcode 11 开始,您可以使用 [Swift Package Manager](https://swift.org/package-manager/) 将 Solana.swift 添加到您的项目中。

- File > Swift Packages > Add Package Dependency
- 添加 `https://github.com/metaplex-foundation/metaplex-ios`
- 选择 "branch" 和 "master"
- 选择 Metaplex

如果您在将包添加到 Xcode 项目时遇到任何问题或有疑问,我建议阅读 Apple 的[将包依赖项添加到您的应用程序](https://developer.apple.com/documentation/xcode/adding_package_dependencies_to_your_app)指南文章。

### 设置
Swift SDK 的入口点是一个 `Metaplex` 实例,它将为您提供对其 API 的访问。

设置 `SolanaConnectionDriver` 并设置您的环境。提供 `StorageDriver` 和 `IdentityDriver`。您还可以使用 URLShared 的具体实现 URLSharedStorageDriver 和访客身份驱动程序的 GuestIdentityDriver。

您可以自定义 SDK 应代表谁进行交互以及在上传资产时使用哪个存储提供程序。我们可能会在未来提供默认和简单的实现。

```swift
let solanaDriver = SolanaConnectionDriver(endpoint: RPCEndpoint.mainnetBetaSolana)
let identityDriver = GuestIdentityDriver(solanaRPC: solana.solanaRPC)
let storageDriver = URLSharedStorageDriver(urlSession: URLSession.shared)
let metaplex Metaplex(connection: solana, identityDriver: identityDriver, storageDriver: storageDriver)
```

# 使用
正确配置后,该 `Metaplex` 实例可用于访问提供不同功能集的模块。目前,只有一个 NFT 模块可以通过 `nfts()` 方法访问。从该模块中,您将能够查找、创建和更新 NFT,未来还会有更多功能。

## NFT
NFT 模块可以通过 `Metaplex.nfts()` 访问并提供以下方法。目前,我们只支持读取方法。未来将支持写入和创建 NFT。

- findNftByMint(mint, callback)
- findNftByMintList(mints, callback)
- findNftsByOwner(owner, callback)
- findNftsByCreator(creator, position = 1, callback)
- findNftsByCandyMachine(candyMachine, version = 2, callback)

所有方法都返回回调。也可以将它们包装在 RX、异步结果或 Combine 中。我们仅提供此接口,因为它是最兼容的,不会强制使用任何特定框架。

### 您的第一个请求

以下代码片段是一个基本代码片段,您可以使用它从公钥获取 NFT。这个用例对于钱包来说可能非常常见:

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

这将返回该特定公钥拥有的 NFT 数组。

### `Nft` 模型

上述所有方法都返回或与 `Nft` 对象交互。`Nft` 对象是您的 NFT 的只读数据表示,包含您在顶层需要的所有信息。

您可以通过查看代码来查看其完整的数据表示,但这里是 `Nft` 对象上可用属性的概述。

```swift
// 始终加载。
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

// 有时加载。
public let masterEditionAccount: MasterEditionAccount?
```

如您所见,某些属性是按需加载的。这是因为它们并不总是需要和/或加载成本可能很高。

为了加载这些属性,您可以运行 `Nft` 对象的 `metadata` 属性。

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

## 身份
`Metaplex` 实例的当前身份可以通过 `metaplex.identity()` 访问,并提供有关在与 SDK 交互时我们代表哪个钱包行事的信息。

此方法返回具有以下接口的身份对象。所有方法都需要 solana api 实例

```swift
public protocol IdentityDriver {
    var publicKey: PublicKey { get }
    func sendTransaction(serializedTransaction: String, onComplete: @escaping(Result<TransactionID, IdentityDriverError>) -> Void)
    func signTransaction(transaction: Transaction, onComplete: @escaping (Result<Transaction, IdentityDriverError>) -> Void)
    func signAllTransactions(transactions: [Transaction], onComplete: @escaping (Result<[Transaction?], IdentityDriverError>) -> Void)
}
```

这些方法的实现取决于正在使用的具体身份驱动程序。例如,使用 KeypairIdentity 或 Guest(未添加公钥)。

让我们快速看看可用的具体身份驱动程序。

### GuestIdentityDriver

`GuestIdentityDriver` 驱动程序是最简单的身份驱动程序。它本质上是一个 `null` 驱动程序,当我们不需要发送任何签名交易时很有用。如果您使用 `signTransaction` 方法,它将返回失败。

### KeypairIdentityDriver

`KeypairIdentityDriver` 驱动程序接受 `Account` 对象作为参数。

### ReadOnlyIdentityDriver

`KeypairIdentityDriver` 驱动程序接受 `PublicKey` 对象作为参数。它是类似于 GuestIdentity 的只读,但它有一个提供的 `PublicKey`。如果您使用 `signTransaction` 方法,它将返回失败。

## 存储

您可以使用 `metaplex.storage()` 访问当前存储驱动程序,它将为您提供对以下接口的访问。

```swift
public protocol StorageDriver {
    func download(url: URL, onComplete: @escaping(Result<NetworkingResponse, StorageDriverError>) -> Void)
}
```

目前,它仅用于检索链外 json 数据。

### URLSharedStorageDriver

这将使用 URLShared 网络。这是默认的 iOS 网络实现。这可能是最有用的调用。

### MemoryStorageDriver

这将使用返回大小为 0 的空数据对象。

## 示例应用

SDK 附带了一个[示例应用][sample]。请克隆它,在您的手机上运行它,并获取它可以帮助您的内容。

[github]: https://github.com/metaplex-foundation/metaplex-ios
[docs]: https://github.com/metaplex-foundation/metaplex-ios#metaplex-ios-sdk
[sample]: https://github.com/metaplex-foundation/metaplex-ios/tree/main/Sample
