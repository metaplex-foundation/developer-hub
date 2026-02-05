---
title: Asset 생성
metaTitle: Asset 생성 | Metaplex Core
description: JavaScript 또는 Rust를 사용하여 Solana에서 Core NFT Asset을 생성하는 방법을 배웁니다. 메타데이터 업로드, 컬렉션에 민팅, 플러그인 추가를 포함합니다.
updated: '01-31-2026'
keywords:
  - create NFT
  - mint NFT
  - Solana NFT
  - mpl-core create
  - upload metadata
about:
  - NFT minting
  - Metadata upload
  - Asset creation
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi로 SDK 설치
  - 메타데이터 JSON을 Arweave 또는 IPFS에 업로드하여 URI 획득
  - 메타데이터 URI로 create(umi, { asset, name, uri }) 호출
  - core.metaplex.com에서 Asset 확인
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
  - Arweave or IPFS for storage
faqs:
  - q: Core Asset과 Token Metadata NFT의 차이점은 무엇인가요?
    a: Core Asset은 단일 계정을 사용하고 비용이 약 80% 저렴합니다. Token Metadata는 3개 이상의 계정(mint, metadata, token)을 사용합니다. 새 프로젝트에는 Core가 권장됩니다.
  - q: 하나의 트랜잭션에서 여러 자산을 생성할 수 있나요?
    a: 아니요. 각 create 명령어는 하나의 자산을 생성합니다. 대량 민팅에는 Core Candy Machine 또는 배치 트랜잭션을 사용하세요.
  - q: 먼저 Collection을 생성해야 하나요?
    a: 아니요. Asset은 Collection 없이 존재할 수 있습니다. 그러나 Collection은 컬렉션 수준의 로열티와 작업을 가능하게 합니다.
  - q: 다른 지갑에 민팅하려면 어떻게 하나요?
    a: create 함수에서 owner 파라미터에 수신자의 주소를 전달합니다.
  - q: 어떤 메타데이터 형식을 사용해야 하나요?
    a: name, description, image, 그리고 선택적 attributes 배열을 포함하는 표준 NFT 메타데이터 형식을 사용하세요. JSON Schema 문서를 참조하세요.
---
이 가이드는 Metaplex Core SDK를 사용하여 Solana에서 **Core Asset**(NFT)을 생성하는 방법을 보여줍니다. 오프체인 메타데이터를 업로드하고, 온체인 Asset 계정을 생성하며, 선택적으로 Collection에 추가하거나 플러그인을 첨부합니다. {% .lead %}
{% callout title="빌드할 내용" %}
다음을 포함하는 Core Asset:
- Arweave에 저장된 오프체인 메타데이터 (이름, 이미지, 속성)
- 소유권과 메타데이터 URI가 있는 온체인 Asset 계정
- 선택 사항: Collection 멤버십
- 선택 사항: 플러그인 (로열티, 동결, 속성)
{% /callout %}
## 요약
메타데이터 JSON을 분산 스토리지에 업로드한 다음 URI로 `create()`를 호출하여 **Core Asset**을 생성합니다. Asset은 독립적으로 민팅하거나 Collection에 민팅할 수 있으며, 생성 시 플러그인을 포함할 수 있습니다.
- 메타데이터 JSON을 Arweave/IPFS에 업로드하고 URI 획득
- name, URI, 선택적 플러그인으로 `create()` 호출
- 컬렉션의 경우: `collection` 파라미터 전달
- 자산당 약 0.0029 SOL 비용
## 범위 외
Token Metadata NFT (mpl-token-metadata 사용), 압축 NFT (Bubblegum 사용), 대체 가능 토큰 (SPL Token 사용), NFT 마이그레이션.
## 빠른 시작
**바로가기:** [메타데이터 업로드](#uploading-off-chain-data) · [Asset 생성](#create-an-asset) · [Collection과 함께](#create-an-asset-into-a-collection) · [플러그인과 함께](#create-an-asset-with-plugins)
1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 메타데이터 JSON을 업로드하여 URI 획득
3. `create(umi, { asset, name, uri })` 호출
4. [core.metaplex.com](https://core.metaplex.com)에서 확인
## 전제 조건
- 서명자와 RPC 연결로 구성된 **Umi**
- 트랜잭션 수수료용 **SOL** (자산당 약 0.003 SOL)
- 업로드 준비된 **메타데이터 JSON** (이름, 이미지, 속성)
## 생성 프로세스
1. **오프체인 데이터 업로드.** 이름, 설명, 이미지 URL, 속성이 포함된 JSON 파일을 저장합니다. 파일은 공개 **URI**를 통해 접근 가능해야 합니다.
2. **온체인 Asset 계정 생성.** 메타데이터 URI로 `create` 명령어를 호출하여 Asset을 민팅합니다.
## 오프체인 데이터 업로드
메타데이터 JSON을 업로드하려면 모든 스토리지 서비스 (Arweave, IPFS, AWS)를 사용하세요. Umi는 일반적인 서비스용 업로더 플러그인을 제공합니다. 사용 가능한 모든 메타데이터 필드는 [JSON Schema](/smart-contracts/core/json-schema)를 참조하세요.
```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
// 업로더 구성 (Irys, AWS 등)
umi.use(irysUploader())
// 먼저 이미지 업로드
const [imageUri] = await umi.uploader.upload([imageFile])
// 메타데이터 JSON 업로드
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
  ],
})
```
**URI**를 얻었으면 Asset을 생성할 수 있습니다.
## Asset 생성
`create` 명령어를 사용하여 새 Core Asset을 민팅합니다.
{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정**
| 계정 | 설명 |
|---------|-------------|
| asset | 새 MPL Core Asset의 주소 (서명자) |
| collection | Asset을 추가할 컬렉션 (선택 사항) |
| authority | 새 자산의 권한 |
| payer | 스토리지 수수료를 지불하는 계정 |
| owner | 자산을 소유할 지갑 |
| systemProgram | System Program 계정 |
**명령어 인수**
| 인수 | 설명 |
|----------|-------------|
| name | MPL Core Asset의 이름 |
| uri | 오프체인 JSON 메타데이터 URI |
| plugins | 생성 시 추가할 플러그인 (선택 사항) |
전체 명령어 세부사항: [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs)
{% /totem-accordion %}
{% /totem %}
{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}
## Collection에 Asset 생성
Collection의 일부로 Asset을 생성하려면 `collection` 파라미터를 전달합니다. Collection이 이미 존재해야 합니다.
{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}
Collection 생성에 대해서는 [Collection](/ko/smart-contracts/core/collections)을 참조하세요.
## 플러그인과 함께 Asset 생성
`plugins` 배열에 전달하여 생성 시 플러그인을 추가합니다. 이 예제에서는 Royalties 플러그인을 추가합니다:
{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}
### 일반적인 플러그인
자주 사용되는 플러그인입니다. 전체 목록은 [플러그인 개요](/ko/smart-contracts/core/plugins)를 참조하세요.
- [Royalties](/ko/smart-contracts/core/plugins/royalties) - 크리에이터 로열티 강제
- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) - 동결/해제 허용
- [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) - 소각 허용
- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) - 전송 허용
- [Update Delegate](/ko/smart-contracts/core/plugins/update-delegate) - 메타데이터 업데이트 허용
- [Attributes](/ko/smart-contracts/core/plugins/attribute) - 온체인 키/값 데이터
전체 목록은 [플러그인 개요](/ko/smart-contracts/core/plugins)를 참조하세요.
## 일반적인 오류
### `Asset account already exists`
자산 키페어가 이미 사용되었습니다. 새 서명자를 생성하세요:
```ts
const assetSigner = generateSigner(umi) // 고유해야 함
```
### `Collection not found`
컬렉션 주소가 존재하지 않거나 유효한 Core Collection이 아닙니다. 주소를 확인하고 먼저 Collection을 생성했는지 확인하세요.
### `Insufficient funds`
지불자 지갑에 렌트용으로 약 0.003 SOL이 필요합니다. 다음으로 자금 추가:
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
## 참고사항
- `asset` 파라미터는 **새 키페어**여야 합니다 - 기존 계정을 재사용할 수 없습니다
- 다른 소유자에게 민팅하려면 `owner` 파라미터를 전달합니다
- 생성 시 추가된 플러그인은 나중에 추가하는 것보다 저렴합니다 (1 트랜잭션 vs 2)
- 즉시 가져오는 스크립트에서 자산을 생성할 때는 `commitment: 'finalized'` 사용
## 빠른 참조
### 프로그램 ID
| 네트워크 | 주소 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### 최소 코드
```ts {% title="minimal-create.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const asset = generateSigner(umi)
await create(umi, { asset, name: 'My NFT', uri: 'https://...' }).sendAndConfirm(umi)
```
### 비용 내역
| 항목 | 비용 |
|------|------|
| Asset 계정 렌트 | ~0.0029 SOL |
| 트랜잭션 수수료 | ~0.000005 SOL |
| **합계** | **~0.003 SOL** |
## FAQ
### Core Asset과 Token Metadata NFT의 차이점은 무엇인가요?
Core Asset은 단일 계정을 사용하고 비용이 약 80% 저렴합니다. Token Metadata는 3개 이상의 계정 (mint, metadata, token)을 사용합니다. 새 프로젝트에는 Core가 권장됩니다.
### 하나의 트랜잭션에서 여러 자산을 생성할 수 있나요?
아니요. 각 `create` 명령어는 하나의 자산을 생성합니다. 대량 민팅에는 [Core Candy Machine](/smart-contracts/core-candy-machine) 또는 배치 트랜잭션을 사용하세요.
### 먼저 Collection을 생성해야 하나요?
아니요. Asset은 Collection 없이 존재할 수 있습니다. 그러나 Collection은 컬렉션 수준의 로열티와 작업을 가능하게 합니다.
### 다른 지갑에 민팅하려면 어떻게 하나요?
`owner` 파라미터를 전달합니다:
```ts
await create(umi, { asset, name, uri, owner: recipientAddress })
```
### 어떤 메타데이터 형식을 사용해야 하나요?
`name`, `description`, `image`, 그리고 선택적 `attributes` 배열을 포함하는 표준 NFT 메타데이터 형식을 사용하세요. [JSON Schema](/smart-contracts/core/json-schema)를 참조하세요.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Asset** | NFT를 나타내는 Core 온체인 계정 |
| **URI** | 오프체인 메타데이터 JSON을 가리키는 URL |
| **서명자** | 트랜잭션에 서명하는 키페어 (자산은 생성 시 서명자여야 함) |
| **Collection** | 관련 Asset을 그룹화하는 Core 계정 |
| **Plugin** | Asset에 동작을 추가하는 모듈식 확장 |
| **렌트** | Solana에서 계정을 유지하는 데 필요한 SOL |
