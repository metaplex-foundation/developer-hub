---
title: JavaScript SDK
metaTitle: JavaScript SDK | Metaplex Core
description: Metaplex Core JavaScript SDK 완전 레퍼런스. Umi 설정, Asset 생성, 전송, 소각, 업데이트, Collection, 플러그인, 데이터 조회를 다룹니다.
updated: '01-31-2026'
keywords:
  - mpl-core JavaScript
  - Core TypeScript SDK
  - Umi framework
  - NFT JavaScript
  - Solana NFT SDK
about:
  - JavaScript SDK
  - Umi integration
  - TypeScript development
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Core JavaScript SDK란 무엇인가요?
    a: Core JavaScript SDK(@metaplex-foundation/mpl-core)는 Solana의 Metaplex Core NFT와 상호작용하기 위한 TypeScript 라이브러리입니다. Asset과 Collection의 생성, 전송, 소각, 관리를 위한 타입 안전 함수를 제공합니다.
  - q: 이 SDK를 사용하려면 Umi가 필요한가요?
    a: 네. Core SDK는 지갑 연결, RPC 통신, 트랜잭션 빌드를 처리하는 Umi 프레임워크 위에 구축되었습니다. @metaplex-foundation/mpl-core와 @metaplex-foundation/umi-bundle-defaults를 모두 설치하세요.
  - q: 브라우저 지갑은 어떻게 연결하나요?
    a: 지갑 어댑터와 함께 @metaplex-foundation/umi-signer-wallet-adapters 패키지를 사용하고 umi.use(walletAdapterIdentity(wallet))를 호출합니다.
  - q: sendAndConfirm과 send의 차이점은 무엇인가요?
    a: sendAndConfirm()은 트랜잭션 확인을 기다린 후 반환합니다. send()는 브로드캐스트 후 즉시 반환합니다. 대부분의 경우 sendAndConfirm()을 사용하세요.
  - q: 여러 작업을 일괄 처리하려면 어떻게 하나요?
    a: transactionBuilder()를 사용하여 명령을 결합하지만, Solana의 트랜잭션 크기 제한(~1232바이트)에 주의하세요. 대량 배치의 경우 여러 트랜잭션을 전송하세요.
  - q: 이 SDK를 React/Next.js에서 사용할 수 있나요?
    a: 네. SDK는 브라우저와 Node.js 환경 모두에서 작동합니다. React의 경우 @solana/wallet-adapter-react의 지갑 어댑터를 Umi의 지갑 어댑터 identity와 함께 사용하세요.
---
**Metaplex Core JavaScript SDK**(`@metaplex-foundation/mpl-core`)는 Solana에서 Core Asset과 Collection을 다루기 위한 완전한 TypeScript/JavaScript 인터페이스를 제공합니다. [Umi 프레임워크](/dev-tools/umi) 위에 구축되어 모든 Core 작업에 대한 타입 안전 메서드를 제공합니다. {% .lead %}
{% callout title="배울 내용" %}
이 SDK 레퍼런스에서 다루는 내용:
- Core 플러그인으로 Umi 설정하기
- Asset 생성, 전송, 소각, 업데이트
- Collection 및 컬렉션 수준 작업 관리
- 플러그인 추가, 업데이트, 제거
- DAS로 Asset과 Collection 조회
- 에러 처리 및 일반적인 패턴
{% /callout %}
## 요약
**Core JavaScript SDK**는 JavaScript/TypeScript 애플리케이션에서 Metaplex Core와 상호작용하는 권장 방법입니다. Core 프로그램 명령을 타입 안전 API로 래핑합니다.
- 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
- 지갑/RPC 관리를 위해 Umi 프레임워크 필요
- 모든 함수는 유연한 실행을 위해 트랜잭션 빌더 반환
- 브라우저와 Node.js 환경 모두 지원
## 범위 외
Rust SDK 사용([Rust SDK](/ko/smart-contracts/core/sdk/rust) 참조), Token Metadata 작업, Candy Machine 통합, 저수준 Solana 트랜잭션 구성.
## 빠른 시작
**바로가기:** [설정](#umi-설정) · [생성](#asset-생성) · [전송](#asset-전송) · [소각](#asset-소각) · [업데이트](#asset-업데이트) · [Collection](#collection) · [플러그인](#플러그인) · [조회](#asset-조회) · [에러](#일반적인-에러) · [FAQ](#faq)
1. 의존성 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults`
2. `mplCore()` 플러그인으로 Umi 인스턴스 생성
3. 트랜잭션용 signer 생성 또는 로드
4. SDK 함수 호출 및 트랜잭션 확인
## 사전 요구사항
- **Node.js 18+** 또는 ES 모듈을 지원하는 최신 브라우저
- RPC와 signer가 구성된 **Umi 프레임워크**
- 트랜잭션 수수료를 위한 **SOL**(Asset당 약 0.003 SOL)
{% quick-links %}
{% quick-link title="API 레퍼런스" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="SDK의 전체 TypeDoc API 문서." /%}
{% quick-link title="NPM 패키지" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="npmjs.com의 패키지 및 버전 기록." /%}
{% /quick-links %}
## 설치
Core SDK와 Umi 프레임워크 설치:
```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults
```
메타데이터 업로드를 위해 업로더 플러그인 추가:
```bash {% title="Terminal" %}
npm install @metaplex-foundation/umi-uploader-irys
```
## Umi 설정
Core 플러그인으로 Umi 인스턴스 생성 및 구성:
```ts {% title="setup-umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
// RPC 엔드포인트로 Umi 생성
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader()) // 선택사항: 메타데이터 업로드용
```
{% totem %}
{% totem-accordion title="파일에서 Keypair 로드" %}
```ts {% title="load-keypair.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'
const secretKey = JSON.parse(
  readFileSync('/path/to/keypair.json', 'utf-8')
)
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(keypair))
```
{% /totem-accordion %}
{% totem-accordion title="브라우저 지갑 어댑터" %}
```ts {% title="browser-wallet.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(walletAdapterIdentity(wallet)) // @solana/wallet-adapter-react에서
```
{% /totem-accordion %}
{% /totem %}
## Asset
### Asset 생성
`create()`를 사용하여 새 Core Asset 민팅:
{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}
### Asset 전송
`transfer()`를 사용하여 Asset을 다른 지갑으로 전송:
{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}
### Asset 소각
`burn()`을 사용하여 Asset을 영구적으로 파괴하고 rent 회수:
{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}
### Asset 업데이트
`update()`를 사용하여 Asset 메타데이터 수정:
{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}
## Collection
### Collection 생성
`createCollection()`을 사용하여 Collection 계정 생성:
{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}
### Collection 내에 Asset 생성
`create()`에 `collection` 매개변수 전달:
{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}
## 플러그인
플러그인은 Asset과 Collection에 동작을 추가합니다. 생성 시 또는 나중에 추가할 수 있습니다.
### 생성 시 플러그인 추가
{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}
### 기존 Asset에 플러그인 추가
{% code-tabs-imported from="core/add-plugin" frameworks="umi" /%}
### 일반적인 플러그인 유형
| 플러그인 | 타입 문자열 | 용도 |
|--------|-------------|---------|
| Royalties | `'Royalties'` | 크리에이터 로열티 강제 |
| Freeze Delegate | `'FreezeDelegate'` | 동결/해제 허용 |
| Burn Delegate | `'BurnDelegate'` | 위임자에 의한 소각 허용 |
| Transfer Delegate | `'TransferDelegate'` | 위임자에 의한 전송 허용 |
| Update Delegate | `'UpdateDelegate'` | 메타데이터 업데이트 허용 |
| Attributes | `'Attributes'` | 온체인 키/값 데이터 |
| Permanent Freeze | `'PermanentFreezeDelegate'` | 영구 동결 상태 |
| Permanent Transfer | `'PermanentTransferDelegate'` | 영구 전송 위임 |
| Permanent Burn | `'PermanentBurnDelegate'` | 영구 소각 위임 |
자세한 플러그인 문서는 [플러그인 개요](/ko/smart-contracts/core/plugins)를 참조하세요.
## Asset 조회
### 단일 Asset 조회
{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}
### 소유자별 Asset 조회 (DAS)
DAS API를 사용하여 인덱싱된 Asset 쿼리:
```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
// Umi에 DAS 플러그인 추가
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(dasApi())
const owner = publicKey('OwnerAddressHere...')
const assets = await umi.rpc.getAssetsByOwner({
  owner,
  limit: 100,
})
console.log('소유한 Asset 수:', assets.items.length)
```
### Collection별 Asset 조회 (DAS)
```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
const collectionAddress = publicKey('CollectionAddressHere...')
const assets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionAddress,
  limit: 100,
})
console.log('Collection Asset 수:', assets.items.length)
```
## 메타데이터 업로드
Umi의 업로더 플러그인으로 메타데이터 JSON 저장:
```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader())
// 먼저 이미지 업로드
const imageFile = await fs.promises.readFile('image.png')
const [imageUri] = await umi.uploader.upload([imageFile])
// 메타데이터 JSON 업로드
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'An awesome NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
    { trait_type: 'Rarity', value: 'Rare' },
  ],
})
console.log('메타데이터 URI:', uri)
```
## 트랜잭션 패턴
### 전송 및 확인
표준 패턴은 확인을 기다림:
```ts {% title="send-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi)
console.log('서명:', result.signature)
```
### 커스텀 확인 옵션
```ts {% title="custom-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```
### 전송 없이 트랜잭션 빌드
```ts {% title="build-only.ts" %}
const tx = create(umi, { asset, name, uri })
const builtTx = await tx.buildAndSign(umi)
// 나중에 전송: await umi.rpc.sendTransaction(builtTx)
```
### 여러 명령 결합
```ts {% title="combine-instructions.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
const tx = transactionBuilder()
  .add(create(umi, { asset: asset1, name: 'NFT 1', uri: uri1 }))
  .add(create(umi, { asset: asset2, name: 'NFT 2', uri: uri2 }))
await tx.sendAndConfirm(umi)
```
## 일반적인 에러
### `Account does not exist`
Asset 또는 collection 주소가 존재하지 않습니다. 주소가 올바른지 확인:
```ts
const asset = await fetchAsset(umi, assetAddress).catch(() => null)
if (!asset) {
  console.log('Asset을 찾을 수 없습니다')
}
```
### `Invalid authority`
이 작업을 수행할 권한이 없습니다. 다음을 확인:
- Asset을 소유하고 있는지 (전송, 소각의 경우)
- update authority인지 (업데이트의 경우)
- 필요한 위임 권한을 가지고 있는지
### `Insufficient funds`
지갑에 SOL이 더 필요합니다. 다음으로 충전:
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
### `Asset already exists`
Asset keypair가 이미 사용되었습니다. 새 signer 생성:
```ts
const assetSigner = generateSigner(umi) // 고유해야 함
```
### `Plugin not found`
이 Asset에 플러그인이 존재하지 않습니다. 설치된 플러그인 확인:
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log('플러그인:', Object.keys(asset))
```
## 참고사항
- 새 Asset에는 항상 새 keypair 사용 - keypair를 재사용하지 마세요
- `create()`의 `asset` 매개변수는 public key가 아닌 signer여야 함
- Collection 수준 플러그인은 같은 유형의 Asset 수준 플러그인을 덮어씀
- 생성 후 즉시 조회하는 Asset에는 `commitment: 'finalized'` 사용
- 트랜잭션 빌더는 불변 - 각 메서드는 새 빌더 반환
## 빠른 참조
### 최소 의존성
```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-core": "^1.0.0",
    "@metaplex-foundation/umi": "^0.9.0",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.0"
  }
}
```
### 핵심 함수
| 함수 | 용도 |
|----------|---------|
| `create()` | 새 Asset 생성 |
| `createCollection()` | 새 Collection 생성 |
| `transfer()` | Asset 소유권 전송 |
| `burn()` | Asset 파괴 |
| `update()` | Asset 메타데이터 업데이트 |
| `updateCollection()` | Collection 메타데이터 업데이트 |
| `addPlugin()` | Asset에 플러그인 추가 |
| `addCollectionPlugin()` | Collection에 플러그인 추가 |
| `updatePlugin()` | 기존 플러그인 업데이트 |
| `removePlugin()` | Asset에서 플러그인 제거 |
| `fetchAsset()` | 주소로 Asset 조회 |
| `fetchCollection()` | 주소로 Collection 조회 |
### 프로그램 ID
| 네트워크 | 주소 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
## FAQ
### Core JavaScript SDK란 무엇인가요?
Core JavaScript SDK(`@metaplex-foundation/mpl-core`)는 Solana에서 Metaplex Core NFT와 상호작용하기 위한 TypeScript 라이브러리입니다. Asset과 Collection의 생성, 전송, 소각, 관리를 위한 타입 안전 함수를 제공합니다.
### 이 SDK를 사용하려면 Umi가 필요한가요?
네. Core SDK는 지갑 연결, RPC 통신, 트랜잭션 빌드를 처리하는 Umi 프레임워크 위에 구축되었습니다. `@metaplex-foundation/mpl-core`와 `@metaplex-foundation/umi-bundle-defaults`를 모두 설치하세요.
### 브라우저 지갑은 어떻게 연결하나요?
지갑 어댑터와 함께 `@metaplex-foundation/umi-signer-wallet-adapters` 패키지를 사용:
```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
umi.use(walletAdapterIdentity(wallet))
```
### sendAndConfirm과 send의 차이점은 무엇인가요?
`sendAndConfirm()`은 트랜잭션 확인을 기다린 후 반환합니다. `send()`는 브로드캐스트 후 즉시 반환합니다. 트랜잭션 성공을 확인하기 위해 대부분의 경우 `sendAndConfirm()`을 사용하세요.
### 여러 작업을 일괄 처리하려면 어떻게 하나요?
`transactionBuilder()`를 사용하여 명령을 결합하지만, Solana의 트랜잭션 크기 제한(~1232바이트)에 주의하세요. 대량 배치의 경우 여러 트랜잭션을 전송하세요.
### 이 SDK를 React/Next.js에서 사용할 수 있나요?
네. SDK는 브라우저와 Node.js 환경 모두에서 작동합니다. React의 경우 `@solana/wallet-adapter-react`의 지갑 어댑터를 Umi의 지갑 어댑터 identity와 함께 사용하세요.
### 에러는 어떻게 처리하나요?
SDK 호출을 try/catch 블록으로 감싸세요. SDK는 프로그램 에러 코드를 포함한 타입이 지정된 에러를 throw합니다:
```ts
try {
  await transfer(umi, { asset, newOwner }).sendAndConfirm(umi)
} catch (error) {
  console.error('전송 실패:', error.message)
}
```
### 전체 API 문서는 어디서 찾을 수 있나요?
전체 함수 시그니처와 타입은 [TypeDoc API 레퍼런스](https://mpl-core.typedoc.metaplex.com/)를 참조하세요.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Umi** | 지갑과 RPC 관리를 갖춘 Solana 애플리케이션 구축을 위한 Metaplex 프레임워크 |
| **Asset** | 소유권, 메타데이터, 플러그인을 가진 NFT를 나타내는 Core 온체인 계정 |
| **Collection** | 관련 Asset을 그룹화하고 컬렉션 전체 플러그인을 적용할 수 있는 Core 계정 |
| **Signer** | 트랜잭션에 서명할 수 있는 키페어 (새 계정 생성에 필요) |
| **Plugin** | Asset 또는 Collection에 동작을 추가하는 모듈식 확장 |
| **URI** | 이름, 이미지, 속성을 포함한 JSON 파일을 가리키는 오프체인 메타데이터 URL |
| **DAS** | Digital Asset Standard - RPC 제공자로부터 인덱싱된 NFT 데이터를 쿼리하기 위한 API |
| **Transaction Builder** | 전송 전에 트랜잭션을 구성하는 불변 객체 |
| **Identity** | Umi에서 트랜잭션 서명자로 구성된 지갑/키페어 |
| **Commitment** | Solana 확인 수준 (processed, confirmed, finalized) |
