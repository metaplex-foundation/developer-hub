---
title: Asset 가져오기
metaTitle: Asset 가져오기 | Metaplex Core
description: Solana에서 Core NFT Asset과 Collection을 가져오는 방법을 배웁니다. 단일 Asset 조회, 소유자 또는 Collection별 쿼리, 빠른 인덱스 쿼리를 위한 DAS API 사용 방법을 설명합니다.
updated: '01-31-2026'
keywords:
  - fetch NFT
  - query NFT
  - DAS API
  - get NFT by owner
  - mpl-core fetch
about:
  - NFT queries
  - DAS API
  - Asset retrieval
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Configure Umi with your RPC endpoint
  - Call fetchAsset(umi, publicKey) with the Asset address
  - Access Asset properties like name, uri, owner, plugins
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
  - DAS-enabled RPC (optional)
faqs:
  - q: 여러 Asset을 가져올 때 GPA와 DAS 중 무엇을 사용해야 하나요?
    a: 가능한 한 DAS를 사용하세요. GPA 쿼리는 모든 프로그램 계정을 스캔하므로 메인넷에서 느리고 비용이 많이 들 수 있습니다. DAS는 더 빠르고 오프체인 메타데이터를 포함하는 인덱스 쿼리를 제공합니다.
  - q: Asset의 오프체인 메타데이터는 어떻게 가져오나요?
    a: uri 필드에 메타데이터 URL이 포함되어 있습니다. Asset을 가져온 후 표준 HTTP 요청으로 별도로 가져옵니다.
  - q: 여러 Collection에 걸쳐 Asset을 가져올 수 있나요?
    a: 단일 쿼리로는 불가능합니다. 각 Collection의 Asset을 별도로 가져와서 결과를 결합하거나 DAS에서 커스텀 필터를 사용하세요.
  - q: skipDerivePlugins는 왜 유용한가요?
    a: 기본적으로 fetchAsset은 Collection 수준 플러그인을 Asset에 상속합니다. skipDerivePlugins를 true로 설정하면 이 단계를 건너뛰고 Asset 수준 플러그인만 반환하여 더 빠르게 가져올 수 있습니다.
  - q: 큰 결과 세트를 페이지네이션하려면 어떻게 하나요?
    a: GPA 함수는 내장 페이지네이션을 지원하지 않습니다. 대규모 컬렉션의 경우 page와 limit 매개변수를 지원하는 DAS를 사용하거나 클라이언트 측 페이지네이션을 구현하세요.
---
이 가이드에서는 Metaplex Core SDK를 사용하여 Solana 블록체인에서 **Core Asset과 Collection을 가져오는** 방법을 설명합니다. 개별 Asset을 조회하거나 소유자 또는 Collection별로 쿼리하거나 인덱스 쿼리에 DAS를 사용할 수 있습니다. {% .lead %}
{% callout title="배울 내용" %}
- 주소로 단일 Asset 또는 Collection 가져오기
- 소유자, Collection 또는 Update Authority로 Asset 쿼리
- DAS(Digital Asset Standard) API로 빠른 인덱스 쿼리 사용
- GPA와 DAS 성능 트레이드오프 이해
{% /callout %}
## 요약
SDK 헬퍼 함수 또는 DAS API를 사용하여 Core Asset과 Collection을 가져옵니다. 사용 사례에 따라 적절한 방법을 선택하세요:
- **단일 Asset/Collection**: 공개 키로 `fetchAsset()` 또는 `fetchCollection()` 사용
- **여러 Asset**: `fetchAssetsByOwner()`, `fetchAssetsByCollection()` 또는 `fetchAssetsByUpdateAuthority()` 사용
- **DAS API**: 더 빠른 성능을 위한 인덱스 쿼리 사용(DAS 지원 RPC 필요)
## 범위 외
Token Metadata 가져오기(mpl-token-metadata 사용), 압축 NFT 가져오기(Bubblegum DAS 확장 사용), 오프체인 메타데이터 가져오기(URI 직접 페치).
## 빠른 시작
**바로가기:** [단일 Asset](#단일-asset-또는-collection-가져오기) · [소유자별](#소유자별-asset-가져오기) · [Collection별](#collection별-asset-가져오기) · [DAS API](#das---digital-asset-standard-api)
1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. RPC 엔드포인트로 Umi 설정
3. Asset 주소로 `fetchAsset(umi, publicKey)` 호출
4. Asset 속성 접근: `name`, `uri`, `owner`, `plugins`
## 전제 조건
- RPC 연결이 구성된 **Umi**
- 가져올 **Asset/Collection 주소**(공개 키)
- 인덱스 쿼리용 **DAS 지원 RPC**(선택 사항이지만 권장)
## 단일 Asset 또는 Collection 가져오기
단일 Asset을 가져오려면 다음 함수를 사용할 수 있습니다:
{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}
{% seperator h="6" /%}
{% dialect-switcher title="Core Collection 가져오기" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core'
const asset = await fetchCollection(umi, collection.publicKey, {
  skipDerivePlugins: false,
})
console.log(asset)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;
pub async fn fetch_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let collection_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client.get_account_data(&collection_id).await.unwrap();
    let collection = Collection::from_bytes(&rpc_data).unwrap();
    print!("{:?}", collection)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 여러 Asset 가져오기
여러 Asset은 `getProgramAccounts`(GPA) 호출을 사용하여 가져올 수 있습니다. 이는 RPC 측면에서 상당히 비용이 많이 들고 느릴 수 있지만, `Digital Asset Standard` API를 사용하는 방법도 있습니다. 이 방법이 더 빠르지만 [특정 RPC 제공자](/ko/solana/rpcs-and-das)가 필요합니다.
### 소유자별 Asset 가져오기
{% dialect-switcher title="소유자별 Asset 가져오기" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
const owner = publicKey('11111111111111111111111111111111')
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
console.log(assetsByOwner)
```
{% /dialect %}
{% /dialect-switcher %}
### Collection별 Asset 가져오기
{% dialect-switcher title="Collection별 Asset 가져오기" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'
const collection = publicKey('11111111111111111111111111111111')
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
console.log(assetsByCollection)
```
{% /dialect %}
{% /dialect-switcher %}
## DAS - Digital Asset Standard API
DAS 지원 RPC를 사용하면 인덱스화된 Asset을 활용하여 매우 빠른 페치와 데이터 조회가 가능합니다.
DAS는 메타데이터, 오프체인 메타데이터, 컬렉션 데이터, 플러그인(Attributes 포함) 등 모든 것을 인덱스화합니다. Metaplex DAS API에 대해 자세히 알아보려면 [여기](/dev-tools/das-api)를 참조하세요.
## 일반적인 오류
### `Asset not found`
공개 키가 유효한 Core Asset을 가리키지 않습니다. 확인하세요:
- 주소가 정확하고 예상 네트워크(devnet 대 mainnet)에 있는지
- 계정이 존재하고 Core Asset(Token Metadata 아님)인지
### `RPC rate limit exceeded`
GPA 쿼리는 비용이 많이 들 수 있습니다. 해결책:
- 인덱스 쿼리에 DAS 지원 RPC 사용
- 결과 제한을 위한 페이지네이션 추가
- 적절한 곳에서 결과 캐싱
## 참고 사항
- `fetchAsset`은 Collection에서 상속된 플러그인을 포함한 전체 Asset을 반환
- Asset 수준 플러그인만 가져오려면 `skipDerivePlugins: true` 설정(더 빠름)
- GPA 쿼리(`fetchAssetsByOwner` 등)는 메인넷에서 느릴 수 있음 - DAS 권장
- DAS는 오프체인 메타데이터를 반환하고 SDK 페치 함수는 온체인 데이터만 반환
## 빠른 참조
### 페치 함수
| 함수 | 사용 사례 |
|----------|----------|
| `fetchAsset(umi, publicKey)` | 주소로 단일 Asset |
| `fetchCollection(umi, publicKey)` | 주소로 단일 Collection |
| `fetchAssetsByOwner(umi, owner)` | 지갑이 소유한 모든 Asset |
| `fetchAssetsByCollection(umi, collection)` | Collection 내 모든 Asset |
| `fetchAssetsByUpdateAuthority(umi, authority)` | Update Authority별 모든 Asset |
### DAS vs GPA 비교
| 기능 | GPA (getProgramAccounts) | DAS API |
|---------|--------------------------|---------|
| 속도 | 느림(모든 계정 스캔) | 빠름(인덱스화) |
| RPC 부하 | 높음 | 낮음 |
| 오프체인 메타데이터 | 없음 | 있음 |
| 특별 RPC 필요 | 아니요 | 예 |
## FAQ
### 여러 Asset을 가져올 때 GPA와 DAS 중 무엇을 사용해야 하나요?
가능한 한 DAS를 사용하세요. GPA 쿼리는 모든 프로그램 계정을 스캔하므로 메인넷에서 느리고 비용이 많이 들 수 있습니다. DAS는 더 빠르고 오프체인 메타데이터를 포함하는 인덱스 쿼리를 제공합니다.
### Asset의 오프체인 메타데이터는 어떻게 가져오나요?
`uri` 필드에 메타데이터 URL이 포함되어 있습니다. 별도로 가져오세요:
```ts
const asset = await fetchAsset(umi, assetAddress)
const metadata = await fetch(asset.uri).then(res => res.json())
```
## 용어집
| 용어 | 정의 |
|------|------------|
| **GPA** | getProgramAccounts - 프로그램이 소유한 모든 계정을 쿼리하는 Solana RPC 메서드 |
| **DAS** | Digital Asset Standard - 빠른 Asset 쿼리를 위한 인덱스 API |
| **상속된 플러그인** | Collection에서 Asset으로 상속된 플러그인 |
| **skipDerivePlugins** | 페치 시 Collection 플러그인 상속을 건너뛰는 옵션 |
| **오프체인 메타데이터** | Asset의 URI에 저장된 JSON 데이터(이름, 이미지, 속성) |
| **온체인 데이터** | Solana 계정에 직접 저장된 데이터(소유자, 플러그인, URI) |
