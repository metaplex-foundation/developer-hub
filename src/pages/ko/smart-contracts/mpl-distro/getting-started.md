---
title: 시작하기
metaTitle: Solana에서 MPL-Distro 토큰 배포 만들기
description: Merkle 할당을 만들고, MPL-Distro 볼트에 자금을 넣으며, JavaScript SDK로 지갑 클레임을 제출합니다.
keywords:
  - MPL-Distro tutorial
  - create token distribution
  - Solana Merkle claim
  - SPL token airdrop
about:
  - MPL-Distro
  - JavaScript SDK
  - Wallet Distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - MPL-Distro와 Umi JavaScript 패키지를 설치합니다.
  - Merkle 할당 데이터를 만들고 보존합니다.
  - 온체인 배포를 생성하고 자금을 넣습니다.
  - 수신자 클레임을 제출하고 확인합니다.
howToTools:
  - Node.js 20 or newer
  - Umi
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: MPL-Distro가 토큰 mint를 만드나요?
    a: 아니요. 배포를 만들기 전에 SPL 토큰 mint를 만들고 자금을 넣으세요.
  - q: Merkle 증명은 어디에 저장해야 하나요?
    a: 프로그램은 루트만 저장하므로 각 주소, amount, nonce, 증명을 내구성 있는 데이터베이스 또는 클레임 파일에 저장하세요. 프로덕션 전달을 참조하세요.
  - q: 한 지갑이 여러 할당을 받을 수 있나요?
    a: 예. 그 외에는 동일한 지갑과 amount 할당마다 다른 nonce를 지정하세요.
---

이 가이드는 [MPL-Distro](/ko/smart-contracts/mpl-distro)와 [Umi 프레임워크](/ko/dev-tools/umi)로 기존 토큰을 두 지갑에 보냅니다. {% .lead %}

## 요약

MPL-Distro 런치에는 기존 SPL 토큰 mint, 보존된 오프체인 Merkle 할당, 배포 볼트에 충분한 토큰이 필요합니다.

- `prepareDistribution`으로 루트와 증명을 만듭니다.
- Permissionless 제출로 7일 `Wallet` 배포를 만듭니다.
- 클레임이 시작되기 전에 모든 할당의 합을 입금합니다.
- 트리에 커밋된 정확한 amount, nonce, 증명을 제출합니다.

{% callout title="만들게 될 것" %}
두 수신자 배포를 만들고 `350,000` 토큰 기본 단위를 입금한 뒤, 첫 수신자의 `100,000` 단위 클레임을 제출합니다.
{% /callout %}

{% callout title="CLI에서 생성과 자금 투입" type="note" %}
[Metaplex CLI](/ko/dev-tools/cli/distro)로 배포를 만들고 토큰을 입금하거나 출금할 수 있습니다. Merkle 증명 생성과 클레임 제출은 이 SDK 워크스루에서 합니다.
{% /callout %}

**바로가기:** [사전 요구사항](#사전-요구사항) · [설치](#mpl-distro-sdk-설치) · [생성](#지갑-배포-생성) · [자금 투입](#지갑-배포에-자금-투입) · [클레임](#지갑-할당-클레임) · [오류](#일반적인-mpl-distro-오류)

## 빠른 시작

MPL-Distro 빠른 시작에는 네 개의 필수 단계가 있습니다.

1. MPL-Distro 클라이언트를 설치하고 Umi에 `mplDistro()`를 등록합니다.
2. 할당 루트, 증명, amount, nonce를 생성하고 보존합니다.
3. 배포를 만들고 전체 토큰 할당을 입금합니다.
4. `distribute`로 증명을 제출하고 클레임 영수증을 확인합니다.

## 사전 요구사항

MPL-Distro에는 자금이 있는 Solana 서명자와 원본 SPL Token 프로그램이 소유한 기존 mint가 필요합니다.

- Node.js 20 이상
- 임대료, 트랜잭션 수수료, {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 클레임 프로토콜 수수료용 SOL을 가진 [Umi](/ko/dev-tools/umi) identity
- 기존 [SPL 토큰](/ko/solana/spl-tokens-and-token-programs) mint와 그 권한자의 자금이 있는 associated token account
- 토큰 기본 단위로 표현한 수신자 주소와 할당량(mint의 최소 단위. decimals가 6인 토큰은 1.0 토큰당 `1_000_000` 단위)

{% callout type="warning" %}
예제는 Token-2022 mint를 받지 않습니다. 원본 SPL Token 프로그램 mint를 사용하세요.
{% /callout %}

## MPL-Distro SDK 설치

트랜잭션을 준비하고 제출하는 애플리케이션에 MPL-Distro 클라이언트와 Umi 피어 의존성을 설치합니다.

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

Core 에셋 서명자로 클레임할 때만 [`@metaplex-foundation/mpl-core`](/ko/smart-contracts/mpl-distro/wallet-distribution#core-에셋-서명자에-대한-클레임)를 설치하세요.

## 지갑 배포 생성

수신자 목록을 Merkle 루트로 커밋하고 반환된 증명을 오프체인에 저장해 배포를 만듭니다.

{% code-tabs-imported from="mpl-distro/create_distribution" frameworks="umi" filename="createDistribution" /%}

`seed` 서명자는 mint에 대해 배포 주소를 고유하게 만들므로 같은 토큰에 둘 이상의 배포를 둘 수 있습니다. 결과 [PDA](/ko/solana/understanding-pdas)는 `["distribution", mint, seed]`를 쓰므로, 주소를 다시 유도하려면 seed 공개 키를 보관해야 합니다.

{% callout title="클레임 중 할당 데이터는 불변" type="warning" %}
권한자는 `startTime <= now <= endTime` 동안 Merkle 루트, 트리 높이, 시작 시각, claimant 수를 바꿀 수 없습니다. 클레임을 열기 전에 전체 할당 파일을 검증하고 백업하세요.
{% /callout %}

## 지갑 배포에 자금 투입

모든 할당의 합 이상을 프로그램 소유 associated token account에 입금해 배포에 자금을 넣습니다. 현재 배포 권한자가 `deposit`에 서명해야 합니다.

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

이 튜토리얼은 토큰만 입금합니다. 선택적 클레임 영수증 임대료 보조금은 [자금 투입과 회수](/ko/smart-contracts/mpl-distro/funding-and-recovery)에서 다룹니다.

## 지갑 할당 클레임

커밋된 목록에서 생성한 동일한 수신자, amount, nonce, 증명을 제출해 할당을 클레임합니다.

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

프로그램은 필요하면 수신자의 정규 associated token account를 만들고, 볼트에서 토큰을 전송하며, 클레임 영수증을 만듭니다. 같은 할당의 두 번째 트랜잭션은 `AlreadyClaimed`로 실패합니다.

## MPL-Distro 계정 확인

확인 후 배포와 결정적 클레임 영수증을 가져와 클레임을 검증합니다.

{% code-tabs-imported from="mpl-distro/verify_claim" frameworks="umi" filename="verifyClaim" /%}

## 일반적인 MPL-Distro 오류

MPL-Distro 오류는 일치하지 않는 증명, 창, 권한, 볼트 잔액을 식별합니다.

| 오류 | 원인 | 해결 |
|---|---|---|
| `InvalidClaimProof` | 주소, amount, nonce, 또는 증명이 커밋된 리프와 다름 | 같은 보존된 할당 레코드에서 모든 값을 불러오세요 |
| `DistributionNotStarted` | 클러스터 타임스탬프가 `startTime`보다 앞섬 | 구성된 Unix 타임스탬프까지 기다리세요 |
| `DistributionEnded` | 클러스터 타임스탬프가 `endTime`보다 뒤 | 권한자가 새 배포를 만들어야 합니다 |
| `AlreadyClaimed` | 클레임 영수증 PDA가 이미 존재함 | 할당을 완료로 취급하세요 |
| `InsufficientFunds` | 기록된 배포 잔액이 클레임 금액보다 적음 | 활성 창 전·중·후에 더 입금하거나 이전 출금을 검토하세요 |
| `RecipientMustSign` | recipient 게이트 클레임에서 수신자 서명자가 빠짐 | 수신자를 서명자로 제출하세요 |
| `InvalidDistributor` | permissioned distributor가 일치하지 않음 | 구성된 distributor 서명자를 사용하세요 |

## 검증된 구성

시작하기 흐름은 현재 MPL-Distro 클라이언트 테스트와 생성된 명령 빌더를 따릅니다.

| 구성 요소 | 버전 |
|---|---|
| `@metaplex-foundation/mpl-distro` | 0.4.x |
| `@metaplex-foundation/umi` | 1.1.x 이상 |
| `@metaplex-foundation/mpl-toolbox` | 0.10.x |
| Token program | 원본 SPL Token 프로그램 |

## 참고사항

시작하기 흐름은 작은 지갑 배포를 보여 줍니다. [프로덕션 전달](/ko/smart-contracts/mpl-distro/production-delivery)이 증명 저장, 클레임 페이지, 미클레임 토큰 회수를 다룹니다.

- Unix 타임스탬프는 초이며 JavaScript 밀리초가 아닙니다.
- 토큰 기본 단위 수량과 타임스탬프에는 `bigint`를 사용하세요.
- `prepareDistribution`은 1,000개 할당에서 메모리 최적화 구현으로 전환합니다.
- 매우 큰 할당 구축은 제어된 Node.js 프로세스에서 실행하고, mainnet에 자금을 넣기 전에 증명 전달을 테스트하세요.
- Permissionless 지불자는 다른 지갑의 클레임을 제출할 수 있지만, 토큰은 그 수신자에게만 갑니다.

## FAQ

### MPL-Distro가 토큰 mint를 만드나요?

아니요. 배포를 만들기 전에 [SPL 토큰](/ko/tokens/create-a-token) mint를 만들고 자금을 넣으세요.

### Merkle 증명은 어디에 저장해야 하나요?

프로그램은 루트만 저장하므로 각 주소, amount, nonce, 증명을 내구성 있는 데이터베이스 또는 클레임 파일에 저장하세요. [프로덕션 전달](/ko/smart-contracts/mpl-distro/production-delivery)을 참조하세요.

### 한 지갑이 여러 할당을 받을 수 있나요?

예. 그 외에는 동일한 지갑과 amount 할당마다 다른 nonce를 지정하세요.
