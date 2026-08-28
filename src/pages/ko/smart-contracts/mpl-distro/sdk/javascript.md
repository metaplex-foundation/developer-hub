---
title: JavaScript SDK
metaTitle: MPL-Distro JavaScript SDK 레퍼런스
description: MPL-Distro Umi 클라이언트, 명령 빌더, 계정 조회, Merkle 헬퍼, PDA 유틸리티를 설치하고 사용합니다.
keywords:
  - MPL-Distro SDK
  - '@metaplex-foundation/mpl-distro'
  - Umi token distribution
  - MPL-Distro API
about:
  - MPL-Distro
  - JavaScript SDK
  - Umi
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
---

`@metaplex-foundation/mpl-distro` 패키지는 Umi 명령 빌더, 계정 시리얼라이저, [PDA](/ko/solana/understanding-pdas) 헬퍼, 호환 Merkle 트리 유틸리티를 제공합니다. {% .lead %}

## 요약

MPL-Distro JavaScript SDK는 배포를 생성, 자금 투입, 클레임, 업데이트, 확인하기 위한 지원 TypeScript 인터페이스입니다.

- 명령을 만들기 전에 Umi 클라이언트에 `mplDistro()`를 등록합니다.
- `prepareDistribution`으로 루트와 증명을 생성합니다.
- 운영 프로그램 명령에는 생성된 빌더를 사용합니다.
- 내보낸 헬퍼로 결정적 배포와 클레임 영수증 계정을 가져옵니다.

## MPL-Distro JavaScript SDK 설치

MPL-Distro 0.4.x를 Umi와 Toolbox 피어 의존성과 함께 설치합니다.

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/mpl-core@^1.3 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

`@metaplex-foundation/mpl-core`는 선언된 피어 의존성이며 [Core 에셋 서명자 헬퍼 흐름](/ko/smart-contracts/core/execute-asset-signing)을 지원합니다.

## MPL-Distro Umi 플러그인 등록

애플리케이션의 [Umi](/ko/dev-tools/umi) 인스턴스에 `mplDistro()`를 한 번 등록합니다.

{% code-tabs-imported from="mpl-distro/setup_umi" frameworks="umi" filename="setupUmi" /%}

플러그인은 프로그램 이름 `mplDistro`를 `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8`에 등록합니다.

## MPL-Distro 명령 빌더

SDK는 각 운영 프로그램 명령에 대한 트랜잭션 빌더를 공개합니다.

| 빌더 | 목적 | 주요 인자 |
|---|---|---|
| `createDistribution` | 배포 PDA 생성 | 루트, 높이, 기간, claimant 수, 이름, 유형, 접근 모드 |
| `updateDistribution` | 선택 구성 필드 변경 | 배포와 교체할 필드 |
| `deposit` | 배포 토큰 볼트에 자금 투입 | 배포, mint, amount |
| `withdraw` | 비활성일 때 토큰 회수 | 배포, mint, amount |
| `distribute` | 지갑 할당 클레임 | 배포, mint, 수신자, amount, 증명, nonce |
| `distributeToLegacyNft` | NFT mint 할당 클레임 | 배포, 보상 mint, NFT mint, 소유자, amount, 증명, nonce |
| `withdrawSubsidy` | 사용하지 않은 영수증 보조금 회수 | 배포, 수신자, lamports amount |

각 빌더는 Umi `TransactionBuilder`를 반환하며 `.sendAndConfirm(umi)`로 합성하거나 제출할 수 있습니다.

## MPL-Distro Merkle 헬퍼

SDK는 수신자 레코드에서 할당 호환 루트와 증명을 생성합니다.

| 내보내기 | 목적 |
|---|---|
| `prepareDistribution(recipients)` | `root`, `proofs`, `treeHeight` 반환 |
| `hashDistroLeaf(recipient)` | 해시를 위해 주소, amount, nonce 하나를 직렬화 |
| `computeTreeHeight(leavesCount)` | 리프 수에 대한 최소 내부 높이 반환 |
| `distributeToAssetAndClaim` | Core [에셋 서명자](/ko/smart-contracts/core/execute-asset-signing)로 클레임하고 Core Execute로 토큰 전송 |
| `Recipient` | `address`, `amount`, 선택적 `nonce`를 담은 타입 |
| `LegacyNft` | 주소가 NFT mint일 때의 `Recipient` 별칭 |

{% code-tabs-imported from="mpl-distro/prepare_distribution" frameworks="umi" filename="prepareDistribution" /%}

증명은 그 할당과 같은 배열 인덱스에서 사용하세요. 그 증명과 함께 amount와 nonce를 보존하세요.

## MPL-Distro 계정 조회

계정 헬퍼는 배포 상태와 개별 클레임 영수증을 역직렬화합니다.

| 내보내기 | 결과 |
|---|---|
| `fetchDistribution(umi, address)` | 디코드된 배포 하나 |
| `safeFetchDistribution(umi, address)` | 배포 또는 `null` |
| `fetchAllDistribution(umi, addresses)` | 여러 디코드된 배포 |
| `fetchClaimReceipt(umi, address)` | 디코드된 영수증 하나 |
| `safeFetchClaimReceipt(umi, address)` | 영수증 또는 `null` |
| `fetchAllClaimReceipt(umi, addresses)` | 여러 디코드된 영수증 |
| `getDistributionSize()` | 현재 배포 계정 크기 |
| `getClaimReceiptSize()` | 클레임 영수증 계정 크기 |

SDK는 권한자 또는 mint별 전체 배포 인덱스 쿼리를 제공하지 않습니다. 애플리케이션은 알려진 PDA 입력, 인덱싱된 트랜잭션 데이터, 또는 외부 계정 인덱스가 필요합니다.

## MPL-Distro 배포 계정

배포 계정은 하나의 mint와 Merkle 루트에 대한 구성과 집계 장부를 저장합니다.

| 필드 | 타입 | 의미 |
|---|---|---|
| `distributionType` | `DistributionType` | `Wallet` 또는 `LegacyNft` |
| `subsidizeReceipts` | boolean | 클레임에 영수증 임대료 환급이 필요한지 |
| `allowedDistributor` | `AllowedDistributor` | 제출 인가 모드 |
| `treeHeight` | number | 받는 최대 증명 길이 |
| `authority` | public key | 관리 서명자 |
| `mint` | public key | 배포하는 SPL 토큰 mint |
| `merkleRoot` | 32 bytes | 할당 커밋먼트 |
| `startTime`, `endTime` | bigint | 포함적 Unix 클레임 창 |
| `totalClaimants` | bigint | 선언된 할당 수 메타데이터 |
| `totalAmount` | bigint | 입금 마이너스 출금. 클레임은 줄이지 않음 |
| `claimCount` | bigint | 기록된 클레임 수 |
| `claimAmount` | bigint | 클레임된 토큰 기본 단위의 합 |
| `seed` | public key | 배포 PDA가 쓰는 seed 서명자 |
| `name` | 32 bytes | 패딩된 UTF-8 배포 이름 |
| `permissionedDistributor` | public key | permissioned 모드의 필수 서명자 |

## MPL-Distro 열거 값

배포와 인가 열거는 클레임 identity와 서명자 규칙을 선택합니다.

| 열거 | 값 | 의미 |
|---|---:|---|
| `DistributionType.Wallet` | 0 | 할당 identity는 지갑 또는 공개 키 |
| `DistributionType.LegacyNft` | 1 | 할당 identity는 레거시 NFT mint |
| `AllowedDistributor.Permissionless` | 0 | 임의의 지불자가 제출할 수 있음 |
| `AllowedDistributor.Recipient` | 1 | 수신자 또는 NFT 소유자가 서명해야 함 |
| `AllowedDistributor.Permissioned` | 2 | 구성된 distributor가 서명해야 함 |

## MPL-Distro PDA 헬퍼

PDA 헬퍼는 프로그램의 결정적 배포 주소와 영수증 주소를 유도합니다.

{% code-tabs-imported from="mpl-distro/derive_distro_pdas" frameworks="umi" filename="deriveDistroPdas" /%}

| PDA | Seeds |
|---|---|
| Distribution | `["distribution", mint, seed]` |
| Claim receipt | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |

`LegacyNft`에서는 영수증 유도 시 NFT mint를 `recipient`로 전달하세요.

## MPL-Distro 오류 헬퍼

등록된 Umi 프로그램은 커스텀 오류 코드를 생성된 JavaScript 오류 클래스로 매핑합니다.

| 오류 | 전형적인 원인 |
|---|---|
| `DistributionNotStarted` | 시작 타임스탬프 전에 클레임 제출 |
| `DistributionEnded` | 종료 타임스탬프 후에 클레임 제출 |
| `InvalidClaimProof` | 할당 필드 또는 증명이 루트와 일치하지 않음 |
| `AlreadyClaimed` | 영수증이 이미 존재함 |
| `CannotWithdrawDuringActiveDistribution` | 활성 중 토큰 회수 시도 |
| `CannotWithdrawWhileActive` | 활성 중 영수증 보조금 회수 시도 |
| `InsufficientFunds` | 기록 토큰 잔액이 클레임보다 적음 |
| `InsufficientFundsToSubsidizeReceipts` | 배포 SOL이 영수증 임대료를 환급할 수 없음 |
| `RecipientMustSign` | Recipient 모드에서 수신자 서명자가 빠짐 |
| `InvalidDistributionType` | 클레임 빌더가 구성 유형과 일치하지 않음 |
| `InvalidDistributor` | Permissioned 클레임이 잘못된 서명자를 사용함 |

시뮬레이션과 확인 실패를 디코딩할 때 `getMplDistroErrorFromCode` 또는 등록 프로그램의 오류 맵을 사용하세요.

## MPL-Distro JavaScript 빠른 참조

JavaScript 클라이언트와 배포된 프로그램은 다음 안정 식별자를 사용합니다.

| 항목 | 값 |
|---|---|
| Package | `@metaplex-foundation/mpl-distro` |
| Tested package range | 0.4.x |
| Umi peer dependency | 1.1.1 이상 |
| Program ID | `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8` |
| Fee wallet | `9kFjQsxtpBsaw8s7aUyiY3wazYDNgFP4Lj5rsBVVF8tb` |
| Source | [metaplex-foundation/mpl-distro](https://github.com/metaplex-foundation/mpl-distro) |

## 참고사항

생성된 클라이언트는 저수준 명령 빌더를 공개하며 오프체인 증명 전달은 관리하지 않습니다.

- `prepareDistribution`은 1,000개 리프 이상에서 메모리 최적화 구현을 사용합니다.
- 두 클레임 빌더에서 `nonce` 기본값은 0입니다.
- 선택 계정 기본값은 Umi 지불자에 의존하므로 스폰서 흐름에서는 명시적으로 전달하세요.
- SDK 패키지 버전, Rust crate 버전, 내부 프로그램 crate 버전은 독립적으로 릴리스됩니다.
- 권한자의 생성, 입금, 조회, 출금은 [Metaplex CLI](/ko/dev-tools/cli/distro)에서도 실행할 수 있습니다. 클레임은 SDK 쪽에 남습니다.
