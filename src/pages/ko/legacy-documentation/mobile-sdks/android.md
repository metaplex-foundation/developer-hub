---
title: Android SDK
metaTitle: Android SDK | 개발자 허브
description: Metaplex Android SDK
---

Metaplex Android SDK는 다음을 가능하게 하는 라이브러리입니다:

- 계정 로드 및 역직렬화
- 트랜잭션 생성
- 작업 실행 (NFT 민트, 경매 생성 등)

Android 및 kotlin을 지원하는 다른 플랫폼에서 모두 작동합니다.

## 안정성

[안정성 1 - 실험적](/ko/security)

이 프로젝트는 개발 중입니다. **모든** 인터페이스는 매우 자주 변경될 _가능성이 높습니다_. 이 라이브러리를 사용할 때 주의하시기 바랍니다. 실험적 API 수정이 발생하면 버그 또는 동작 변경이 사용자를 놀라게 할 수 있습니다.

## 참조

- [소스 코드][github]

## 시작하기

### 설치
#### 요구 사항 {#requirements}

- Android 21+

GitHub 권장 방식을 사용하여 아티팩트를 로드하는 것이 좋습니다. 먼저 [계정 설정](https://github.com/settings/tokens)에서 GitHub 토큰을 가져옵니다.

settings.gradle 내부에 maven 저장소를 추가합니다:

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

그런 다음 build.gradle에서:

```
dependencies {
 ...
 implementation 'com.metaplex:metaplex:+' // 버전 설정
}
```

그 후 gradle 동기화를 수행합니다.

## JitPack 릴리스

이제 라이브러리는 JitPack.io를 통해 사용할 수 있습니다.

먼저 빌드에 JitPack 저장소를 추가합니다:
```

repositories {
 ...
 maven { url 'https://jitpack.io' }
}

```
그런 다음 앱/모듈의 'build.gradle' 파일에 종속성을 추가합니다:
```
dependencies {
 ...
 implementation 'com.github.metaplex-foundation:metaplex-android:{version}'
}
```

## 설정

Android SDK의 진입점은 API에 대한 액세스를 제공하는 `Metaplex` 인스턴스입니다.

`SolanaConnectionDriver`를 설정하고 환경을 설정합니다. `StorageDriver` 및 `IdentityDriver`를 제공합니다. OKHttp용 OkHttpSharedStorageDriver 및 읽기 전용 Identity Driver용 ReadOnlyIdentityDriver와 같은 구체적인 구현을 사용할 수도 있습니다.

SDK가 누구를 대신하여 상호 작용해야 하는지 및 자산을 업로드할 때 사용할 스토리지 공급자를 사용자 정의할 수 있습니다. 향후 기본적이고 간단한 구현을 제공할 수 있습니다.

```kotlin
val ownerPublicKey = PublicKey("<Any PublicKey>")
val solanaConnection = SolanaConnectionDriver(RPCEndpoint.mainnetBetaSolana)
val solanaIdentityDriver = ReadOnlyIdentityDriver(ownerPublicKey, solanaConnection.solanaRPC)
val storageDriver = OkHttpSharedStorageDriver()
val metaplex = Metaplex(solanaConnection, solanaIdentityDriver, storageDriver)
```

# 사용법
올바르게 구성되면 해당 `Metaplex` 인스턴스를 사용하여 다양한 기능 세트를 제공하는 모듈에 액세스할 수 있습니다. 현재 `nft` 속성을 통해 액세스할 수 있는 NFT 모듈이 하나만 있습니다. 해당 모듈에서 NFT를 찾고, 생성하고, 업데이트할 수 있으며 더 많은 기능이 추가될 예정입니다.

## NFT
NFT 모듈은 `Metaplex.nft`를 통해 액세스할 수 있으며 다음 메서드를 제공합니다. 현재는 읽기 메서드만 지원합니다. NFT 작성 및 생성은 향후 지원될 예정입니다.

- findByMint(mint, callback)
- findAllByMintList(mints, callback)
- findAllByOwner(owner, callback)
- findAllByCreator(creator, position = 1, callback)
- findAllByCandyMachine(candyMachine, version = 2, callback)

모든 메서드는 콜백을 반환합니다. RX 또는 Async Result 내부에 래핑하는 것도 가능합니다. 특정 프레임워크를 강제하지 않고 가장 호환성이 높기 때문에 이 인터페이스만 제공합니다.

### 첫 번째 요청

다음 코드 스니펫은 publicKey에서 NFT를 가져오는 데 사용할 수 있는 기본 코드입니다. 이 사용 사례는 지갑에서 매우 일반적일 수 있습니다:

```kotlin
metaplex.nft.findByMint(mintPublicKey){
 it.onSuccess {
  ...
 }.onFailure {
  ...
 }
}
```

이것은 특정 공개 키가 소유한 NFT 배열을 반환합니다.

### `Nft` 모델

위의 모든 메서드는 `Nft` 객체를 반환하거나 상호 작용합니다. `Nft` 객체는 최상위 수준에서 필요한 모든 정보를 포함하는 NFT의 읽기 전용 데이터 표현입니다.

코드를 확인하여 전체 데이터 표현을 볼 수 있지만 다음은 `Nft` 객체에서 사용할 수 있는 속성의 개요입니다.

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

보시다시피 일부 속성은 필요에 따라 로드됩니다. 이는 항상 필요한 것은 아니며 로드하는 데 비용이 많이 들 수 있기 때문입니다.

이러한 속성을 로드하려면 `Nft` 객체의 `metadata` 속성을 실행할 수 있습니다.

```kotlin
nft..metadata(metaplex) { result ->
 it.onSuccess {
  ...
 }.onFailure {
  ...
 }
}
```

## 경매
Metaplex Auction House 프로토콜을 사용하면 누구나 분산된 판매 계약을 구현하고 원하는 SPL 토큰을 수락할 수 있습니다.

경매 모듈은 `Metaplex.auctions`를 통해 액세스할 수 있으며 다음 메서드를 제공합니다. 현재는 읽기 메서드만 지원합니다. Auction House 생성 및 입찰 및 목록 생성 및 상호 작용 기능은 향후 지원될 예정입니다.

- [`findAuctionHouseByAddress(address)`](#findAuctionHouseByAddress)
- [`findAuctionHouseByCreatorAndMint(creator, treasuryMint)`](#findAllByMintList)
- 곧 더 많이!

모든 메서드는 애플리케이션에서 더 많은 유연성과 호환성을 제공하기 위해 구성 가능한 [일시 중단 함수](https://kotlinlang.org/docs/composing-suspending-functions.html)로 제공됩니다.

**참고:** Auctions API에서 제공하는 이러한 일시 중단 함수는 라이브러리의 아키텍처 변경 사항입니다. 이전에는 비동기 콜백 메서드만 제공했습니다. 모든 사람이 새로운 일시 중단 함수로 마이그레이션할 것을 강력히 권장하지만 사용 가능한 메서드의 비동기 콜백 구현도 제공했습니다. 이러한 메서드는 임시로 제공되며 향후 더 이상 사용되지 않을 수 있습니다:

- [`findAuctionHouseByAddress(address, callback)`](#findAuctionHouseByAddress)
- [`findAuctionHouseByCreatorAndMint(creator, treasuryMint, callback)`](#findAllByMintList)

### findAuctionHouseByAddress

`findAuctionHouseByAddress` 메서드는 공개 키를 받아들이고 AuctionHouse 객체를 반환하거나 주어진 주소에 대한 AuctionHouse를 찾을 수 없는 경우 오류를 반환합니다.

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByAddress(addressPublicKey).getOrNull()
```

### findAuctionHouseByCreatorAndMint

`findAuctionHouseByCreatorAndMint` 메서드는 공개 키를 받아들이고 AuctionHouse 객체를 반환하거나 주어진 주소에 대한 AuctionHouse를 찾을 수 없는 경우 오류를 반환합니다.

```kotlin
val theAuctionHouse: AuctionHouse? = metaplex.auctions.findAuctionHouseByCreatorAndMint(creatorPublicKey, mintPublicKey).getOrNull()
```

반환된 `AuctionHouse` 모델에는 체인의 Auction House 계정에 대한 세부 정보가 포함됩니다. 향후 이 모델은 경매와 상호 작용하고 거래를 수행하기 위해 `AuctionHouseClient` 인스턴스를 구성하는 데 사용됩니다.

## Identity
`Metaplex` 인스턴스의 현재 ID는 `metaplex.identity()`를 통해 액세스할 수 있으며 SDK와 상호 작용할 때 우리가 대신하여 행동하는 지갑에 대한 정보를 제공합니다.

이 메서드는 다음 인터페이스를 가진 ID 객체를 반환합니다. 모든 메서드에는 solana api 인스턴스가 필요합니다

```kotlin
interface IdentityDriver {
    val publicKey: PublicKey
    fun sendTransaction(transaction: Transaction, recentBlockHash: String? = null, onComplete: ((Result<String>) -> Unit))
    fun signTransaction(transaction: Transaction, onComplete: (Result<Transaction>) -> Unit)
    fun signAllTransactions(transactions: List<Transaction>, onComplete: (Result<List<Transaction?>>) -> Unit)
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

```kotlin
interface StorageDriver {
    fun download(url: URL, onComplete: (ResultWithCustomError<NetworkingResponse, StorageDriverError>) -> Unit)
}
```

현재는 오프체인 json 데이터를 검색하는 데만 사용됩니다.

### OkHttpSharedStorageDriver

OkHttp 네트워킹을 사용합니다. 가장 인기 있는 Android 네트워킹 구현 라이브러리입니다. 이것이 가장 유용한 구현일 수 있습니다.

### MemoryStorageDriver

크기가 0인 빈 데이터 객체를 반환합니다.

## 샘플 앱

SDK에는 [샘플 앱](https://github.com/metaplex-foundation/metaplex-android/tree/main/sample)이 함께 제공됩니다. 휴대폰에서 복제하여 실행하고 도움이 될 수 있는 것을 가져가세요.

[github]: https://github.com/metaplex-foundation/metaplex-android
[sample]: https://github.com/metaplex-foundation/metaplex-android/tree/main/sample
