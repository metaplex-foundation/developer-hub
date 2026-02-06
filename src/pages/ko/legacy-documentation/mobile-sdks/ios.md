---
title: iOS SDK
metaTitle: iOS SDK | 개발자 허브
description: Metaplex iOS SDK
---

[Metaplex iOS SDK][docs]는 다음을 가능하게 하는 라이브러리입니다:

- 계정 로드 및 역직렬화
- 트랜잭션 생성
- 작업 실행 (NFT 민트, 경매 생성 등)

iOS 및 Swift를 지원하는 다른 Apple 플랫폼에서 모두 작동합니다.

## 안정성

[안정성 1 - 실험적](/ko/smart-contracts/security)

이 프로젝트는 활발한 개발 중입니다. **모든** 인터페이스는 매우 자주 변경될 _가능성이 높습니다_. 이 라이브러리를 사용할 때 주의하시기 바랍니다. 실험적 API 수정이 발생하면 버그 또는 동작 변경이 사용자를 놀라게 할 수 있습니다.

## 참조

- [API 문서][docs]
- [소스 코드][github]

## 시작하기

### 설치

#### 요구 사항 {#requirements}

- iOS 11.0+ / macOS 10.13+ / tvOS 11.0+ / watchOS 3.0+
- Swift 5.3+

Xcode 11부터 [Swift Package Manager](https://swift.org/package-manager/)를 사용하여 프로젝트에 Solana.swift를 추가할 수 있습니다.

- File > Swift Packages > Add Package Dependency
- `https://github.com/metaplex-foundation/metaplex-ios` 추가
- "master"와 함께 "branch" 선택
- Metaplex 선택

문제가 발생하거나 Xcode 프로젝트에 패키지 추가에 대한 질문이 있는 경우 Apple의 [Adding Package Dependencies to Your App](https://developer.apple.com/documentation/xcode/adding_package_dependencies_to_your_app) 가이드 문서를 읽는 것이 좋습니다.

### 설정

Swift SDK의 진입점은 API에 대한 액세스를 제공하는 `Metaplex` 인스턴스입니다.

`SolanaConnectionDriver`를 설정하고 환경을 설정합니다. `StorageDriver` 및 `IdentityDriver`를 제공합니다. URLShared용 URLSharedStorageDriver 및 게스트 Identity Driver용 GuestIdentityDriver와 같은 구체적인 구현을 사용할 수도 있습니다.

SDK가 누구를 대신하여 상호 작용해야 하는지 및 자산을 업로드할 때 사용할 스토리지 공급자를 사용자 정의할 수 있습니다. 향후 기본적이고 간단한 구현을 제공할 수 있습니다.

```swift
let solanaDriver = SolanaConnectionDriver(endpoint: RPCEndpoint.mainnetBetaSolana)
let identityDriver = GuestIdentityDriver(solanaRPC: solana.solanaRPC)
let storageDriver = URLSharedStorageDriver(urlSession: URLSession.shared)
let metaplex Metaplex(connection: solana, identityDriver: identityDriver, storageDriver: storageDriver)
```

# 사용법

올바르게 구성되면 해당 `Metaplex` 인스턴스를 사용하여 다양한 기능 세트를 제공하는 모듈에 액세스할 수 있습니다. 현재 `nfts()` 메서드를 통해 액세스할 수 있는 NFT 모듈이 하나만 있습니다. 해당 모듈에서 NFT를 찾고, 생성하고, 업데이트할 수 있으며 더 많은 기능이 추가될 예정입니다.

## NFT

NFT 모듈은 `Metaplex.nfts()`를 통해 액세스할 수 있으며 다음 메서드를 제공합니다. 현재는 읽기 메서드만 지원합니다. NFT 작성 및 생성은 향후 지원될 예정입니다.

- findNftByMint(mint, callback)
- findNftByMintList(mints, callback)
- findNftsByOwner(owner, callback)
- findNftsByCreator(creator, position = 1, callback)
- findNftsByCandyMachine(candyMachine, version = 2, callback)

모든 메서드는 콜백을 반환합니다. RX, 비동기 Result 또는 Combine 내부에 래핑하는 것도 가능합니다. 특정 프레임워크를 강제하지 않고 가장 호환성이 높기 때문에 이 인터페이스만 제공합니다.

### 첫 번째 요청

다음 코드 스니펫은 publicKey에서 NFT를 가져오는 데 사용할 수 있는 기본 코드입니다. 이 사용 사례는 지갑에서 매우 일반적일 수 있습니다:

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

이것은 특정 공개 키가 소유한 NFT 배열을 반환합니다.

### `Nft` 모델

위의 모든 메서드는 `Nft` 객체를 반환하거나 상호 작용합니다. `Nft` 객체는 최상위 수준에서 필요한 모든 정보를 포함하는 NFT의 읽기 전용 데이터 표현입니다.

코드를 확인하여 전체 데이터 표현을 볼 수 있지만 다음은 `Nft` 객체에서 사용할 수 있는 속성의 개요입니다.

```swift
// 항상 로드됩니다.
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

// 때때로 로드됩니다.
public let masterEditionAccount: MasterEditionAccount?
```

보시다시피 일부 속성은 필요에 따라 로드됩니다. 이는 항상 필요한 것은 아니며 로드하는 데 비용이 많이 들 수 있기 때문입니다.

이러한 속성을 로드하려면 `Nft` 객체의 `metadata` 속성을 실행할 수 있습니다.

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

## Identity

`Metaplex` 인스턴스의 현재 ID는 `metaplex.identity()`를 통해 액세스할 수 있으며 SDK와 상호 작용할 때 우리가 대신하여 행동하는 지갑에 대한 정보를 제공합니다.

이 메서드는 다음 인터페이스를 가진 ID 객체를 반환합니다. 모든 메서드에는 solana api 인스턴스가 필요합니다

```swift
public protocol IdentityDriver {
    var publicKey: PublicKey { get }
    func sendTransaction(serializedTransaction: String, onComplete: @escaping(Result<TransactionID, IdentityDriverError>) -> Void)
    func signTransaction(transaction: Transaction, onComplete: @escaping (Result<Transaction, IdentityDriverError>) -> Void)
    func signAllTransactions(transactions: [Transaction], onComplete: @escaping (Result<[Transaction?], IdentityDriverError>) -> Void)
}
```

이러한 메서드의 구현은 사용 중인 구체적인 ID 드라이버에 따라 다릅니다. 예를 들어 KeypairIdentity 또는 Guest(추가된 publickey 없음)를 사용합니다.

사용 가능한 구체적인 ID 드라이버를 빠르게 살펴보겠습니다.

### GuestIdentityDriver

`GuestIdentityDriver` 드라이버는 가장 간단한 ID 드라이버입니다. 본질적으로 서명된 트랜잭션을 보낼 필요가 없을 때 유용할 수 있는 `null` 드라이버입니다. `signTransaction` 메서드를 사용하면 실패를 반환합니다.

### KeypairIdentityDriver

`KeypairIdentityDriver` 드라이버는 `Account` 객체를 매개변수로 받아들입니다.

### ReadOnlyIdentityDriver

`KeypairIdentityDriver` 드라이버는 `PublicKey` 객체를 매개변수로 받아들입니다. GuestIdentity와 유사한 읽기 전용이지만 제공된 `PublicKey`가 있습니다. `signTransaction` 메서드를 사용하면 실패를 반환합니다.

## Storage

`metaplex.storage()`를 사용하여 현재 스토리지 드라이버에 액세스할 수 있으며 다음 인터페이스에 액세스할 수 있습니다.

```swift
public protocol StorageDriver {
    func download(url: URL, onComplete: @escaping(Result<NetworkingResponse, StorageDriverError>) -> Void)
}
```

현재는 오프체인 json 데이터를 검색하는 데만 사용됩니다.

### URLSharedStorageDriver

URLShared 네트워킹을 사용합니다. 기본 iOS 네트워킹 구현입니다. 가장 유용한 호출일 수 있습니다.

### MemoryStorageDriver

크기가 0인 빈 데이터 객체를 반환합니다.

## 샘플 앱

SDK에는 [샘플 앱][sample]이 함께 제공됩니다. 휴대폰에서 복제하여 실행하고 도움이 될 수 있는 것을 가져가세요.

[github]: https://github.com/metaplex-foundation/metaplex-ios
[docs]: https://github.com/metaplex-foundation/metaplex-ios#metaplex-ios-sdk
[sample]: https://github.com/metaplex-foundation/metaplex-ios/tree/main/Sample
