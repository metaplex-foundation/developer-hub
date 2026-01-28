---
title: Asset 생성하기
metaTitle: Asset 생성하기 | Metaplex Core
description: JavaScript 또는 Rust를 사용하여 Solana에서 Core NFT Asset을 생성하는 방법을 알아보세요. 메타데이터 업로드, 컬렉션에 민팅, 플러그인 추가를 포함합니다.
---

이 가이드에서는 Metaplex Core SDK를 사용하여 Solana에서 **Core Asset**(NFT)을 생성하는 방법을 설명합니다. 오프체인 메타데이터를 업로드하고, 온체인 Asset 계정을 생성하고, 선택적으로 Collection에 추가하거나 플러그인을 연결합니다. {% .lead %}

{% callout title="구축할 내용" %}

다음을 포함하는 Core Asset:
- Arweave/IPFS에 저장된 오프체인 메타데이터 (이름, 이미지, 속성)
- 소유권과 메타데이터 URI를 가진 온체인 Asset 계정
- 선택 사항: Collection 멤버십
- 선택 사항: 플러그인 (로열티, 동결, 속성)

{% /callout %}

## 요약

분산 스토리지에 메타데이터 JSON을 업로드한 다음 해당 URI로 `create()`를 호출하여 **Core Asset**을 생성합니다. Asset은 단독으로 민팅하거나 Collections에 민팅할 수 있으며, 생성 시 플러그인을 포함할 수 있습니다.

- 메타데이터 JSON을 Arweave/IPFS에 업로드하고 URI 획득
- 이름, URI, 선택적 플러그인으로 `create()` 호출
- Collections의 경우: `collection` 매개변수 전달
- Asset당 약 0.0029 SOL 비용

## 범위 외

Token Metadata NFT (mpl-token-metadata 사용), 압축 NFT (Bubblegum 사용), Fungible Token (SPL Token 사용), NFT 마이그레이션.

## 빠른 시작

**이동:** [메타데이터 업로드](#오프체인-데이터-업로드) · [Asset 생성](#asset-생성) · [Collection 포함](#collection에-asset-생성) · [플러그인 포함](#플러그인과-함께-asset-생성)

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 메타데이터 JSON을 업로드하여 URI 획득
3. `create(umi, { asset, name, uri })` 호출
4. [core.metaplex.com](https://core.metaplex.com)에서 확인

## 전제 조건

- **Umi** - signer와 RPC 연결이 구성됨
- **SOL** - 트랜잭션 수수료용 (Asset당 약 0.003 SOL)
- **메타데이터 JSON** - 업로드 준비 완료 (이름, 이미지, 속성)

## 생성 과정

1. **오프체인 데이터 업로드.** 이름, 설명, 이미지 URL, 속성을 포함하는 JSON 파일을 저장합니다. 파일은 공개 **URI**를 통해 액세스 가능해야 합니다.
2. **온체인 Asset 계정 생성.** 메타데이터 URI로 `create` 명령어를 호출하여 Asset을 민팅합니다.

## 오프체인 데이터 업로드

모든 스토리지 서비스(Arweave, IPFS, AWS)를 사용하여 메타데이터 JSON을 업로드합니다. Umi는 일반적인 서비스를 위한 업로더 플러그인을 제공합니다.

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

이제 **URI**가 있으므로 Asset을 생성할 수 있습니다.

## Asset 생성

`create` 명령어를 사용하여 새 Core Asset을 민팅합니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정**

| 계정 | 설명 |
|---------|-------------|
| asset | 새 MPL Core Asset의 주소 (signer) |
| collection | Asset을 추가할 Collection (선택 사항) |
| authority | 새 Asset의 권한 |
| payer | 저장 수수료를 지불하는 계정 |
| owner | Asset을 소유할 지갑 |
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

Collection에 Asset을 생성하려면 `collection` 매개변수를 전달합니다. Collection이 이미 존재해야 합니다.

{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}

Collections 생성에 대해서는 [Collections](/ko/smart-contracts/core/collections)를 참조하세요.

## 플러그인과 함께 Asset 생성

`plugins` 배열에 플러그인을 전달하여 생성 시 플러그인을 추가합니다. 이 예시에서는 Royalties 플러그인을 추가합니다:

{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}

### 사용 가능한 플러그인

- [Royalties](/ko/smart-contracts/core/plugins/royalties) - 크리에이터 로열티 시행
- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) - 동결/해제 허용
- [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) - 소각 허용
- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) - 전송 허용
- [Update Delegate](/ko/smart-contracts/core/plugins/update-delegate) - 메타데이터 업데이트 허용
- [Attributes](/ko/smart-contracts/core/plugins/attribute) - 온체인 키/값 데이터

전체 목록은 [플러그인 개요](/ko/smart-contracts/core/plugins)를 참조하세요.

## 일반적인 오류

### `Asset account already exists`

Asset 키페어가 이미 사용되었습니다. 새 signer를 생성하세요:

```ts
const assetSigner = generateSigner(umi) // 고유해야 함
```

### `Collection not found`

Collection 주소가 존재하지 않거나 유효한 Core Collection이 아닙니다. 주소를 확인하고 먼저 Collection을 생성했는지 확인하세요.

### `Insufficient funds`

지불 지갑에 렌트용으로 약 0.003 SOL이 필요합니다. 다음으로 충전하세요:

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## 참고 사항

- `asset` 매개변수는 **새 키페어**여야 합니다 - 기존 계정을 재사용할 수 없음
- 다른 소유자에게 민팅하려면 `owner` 매개변수를 전달하세요
- 생성 시 플러그인을 추가하는 것이 나중에 추가하는 것보다 저렴합니다 (1 트랜잭션 vs 2 트랜잭션)
- 즉시 Asset을 가져오는 스크립트에서는 `commitment: 'finalized'`를 사용하세요

## 빠른 참조

### Program ID

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
| Asset 계정 렌트 | 약 0.0029 SOL |
| 트랜잭션 수수료 | 약 0.000005 SOL |
| **총계** | **약 0.003 SOL** |

## FAQ

### Core Asset과 Token Metadata NFT의 차이점은 무엇인가요?

Core Asset은 단일 계정을 사용하며 약 80% 저렴합니다. Token Metadata는 3개 이상의 계정(mint, metadata, token)을 사용합니다. 새 프로젝트에는 Core가 권장됩니다.

### 하나의 트랜잭션에서 여러 Asset을 생성할 수 있나요?

아니요. 각 `create` 명령어는 하나의 Asset을 생성합니다. 대량 민팅에는 [Core Candy Machine](/ko/smart-contracts/core-candy-machine) 또는 배치 트랜잭션을 사용하세요.

### 먼저 Collection을 생성해야 하나요?

아니요. Asset은 Collection 없이 존재할 수 있습니다. 하지만 Collections는 컬렉션 수준의 로열티와 작업을 가능하게 합니다.

### 다른 지갑에 민팅하려면 어떻게 하나요?

`owner` 매개변수를 전달하세요:

```ts
await create(umi, { asset, name, uri, owner: recipientAddress })
```

### 어떤 메타데이터 형식을 사용해야 하나요?

`name`, `description`, `image`, 선택적 `attributes` 배열을 포함하는 표준 NFT 메타데이터 형식을 사용하세요. [JSON Schema](/ko/smart-contracts/core/json-schema)를 참조하세요.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Asset** | NFT를 나타내는 Core 온체인 계정 |
| **URI** | 오프체인 메타데이터 JSON을 가리키는 URL |
| **Signer** | 트랜잭션에 서명하는 키페어 (Asset은 생성 시 signer여야 함) |
| **Collection** | 관련 Asset을 그룹화하는 Core 계정 |
| **Plugin** | Asset에 동작을 추가하는 모듈 확장 |
| **Rent** | Solana에서 계정을 유지하는 데 필요한 SOL |

---

*Metaplex Foundation에서 관리 · 마지막 확인 2026년 1월 · @metaplex-foundation/mpl-core에 적용*
