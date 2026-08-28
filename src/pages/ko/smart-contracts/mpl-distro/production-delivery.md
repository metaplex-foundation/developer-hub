---
title: 프로덕션 전달
metaTitle: 프로덕션에서 MPL-Distro 클레임 전달하기
description: Merkle 증명을 유지하고, 수신자가 클레임할 수단을 제공하며, 창이 끝난 뒤 미클레임 MPL-Distro 토큰을 회수합니다.
keywords:
  - MPL-Distro airdrop
  - Merkle proof delivery
  - token claim page
  - recover unclaimed tokens
about:
  - MPL-Distro
  - Claim Delivery
  - Token Airdrop
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - 누가 서명해야 하는지에 맞는 클레임 제출 모드를 선택합니다.
  - 각 할당의 주소, amount, nonce, 증명을 유지합니다.
  - 클레임 페이지 또는 조회 API로 그 레코드를 전달합니다.
  - 클레임 창이 끝난 뒤 미클레임 토큰을 회수합니다.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: MPL-Distro가 클레임 웹사이트를 호스팅하나요?
    a: 아니요. 프로그램은 Merkle 루트만 저장합니다. 애플리케이션이 증명을 유지하고 클레임 페이지 또는 API를 제공해야 합니다.
  - q: 이메일 또는 Discord 핸들을 Merkle 리프로 쓸 수 있나요?
    a: 아니요. 리프는 지갑 공개 키 또는 레거시 NFT mint입니다. 오프체인 채널로 알릴 수는 있지만 온체인 identity는 아닙니다.
  - q: Merkle 증명을 공개해도 안전한가요?
    a: Permissionless 모드에서는 유효한 증명을 가진 누구나 클레임을 제출할 수 있습니다. 토큰은 리프 주소로 갑니다. 증명 접근만으로 제출을 허용하지 않으려면 Recipient 모드를 사용하세요.
  - q: 백엔드가 모든 Merkle 증명을 직접 제출해야 하나요?
    a: 아니요. 각 Distro 클레임이 프로토콜 수수료를 내므로 보통 SPL 전송보다 비쌉니다. 사용자 시작 클레임의 SOL을 릴레이어가 내거나, 일부 할당이 미클레임으로 남을 때 Distro를 사용하세요.
  - q: 미클레임 토큰은 언제 회수할 수 있나요?
    a: 권한자는 시작 타임스탬프 이전 또는 종료 타임스탬프 이후에 토큰을 출금할 수 있습니다. 배포가 활성일 때 출금은 거부됩니다.
---

[MPL-Distro](/ko/smart-contracts/mpl-distro)는 온체인에 Merkle 루트만 저장합니다. 프로덕션 에어드롭은 각 할당의 증명을 오프체인에 유지하고 수신자가 제출할 수단을 제공합니다. {% .lead %}

## 요약

프로덕션 전달은 MPL-Distro 배포를 둘러싼 오프체인 작업입니다. 클레임 레코드를 저장하고, 올바른 청구자에게 제공하며, 창이 끝나면 나머지를 회수합니다.

- [시작하기](/ko/smart-contracts/mpl-distro/getting-started) 흐름 또는 [Metaplex CLI](/ko/dev-tools/cli/distro)로 배포를 만들고 자금을 넣습니다.
- 클레임이 열리기 전에 모든 할당의 `address`, `amount`, `nonce`, `proof`를 유지합니다.
- 누가 서명해야 하는지에 맞춰 [Permissionless, Recipient, 또는 Permissioned](/ko/smart-contracts/mpl-distro/wallet-distribution#지갑-클레임-제출-모드)를 선택합니다.
- 창이 끝난 뒤 [자금 투입과 회수](/ko/smart-contracts/mpl-distro/funding-and-recovery)로 미클레임 토큰을 회수합니다.

{% callout title="호스팅된 클레임 UI는 없음" type="note" %}
MPL-Distro는 클레임 웹사이트나 이메일, SMS, Discord identity를 제공하지 않습니다. [Metaplex CLI](/ko/dev-tools/cli/distro)는 배포를 생성, 자금 투입, 조회, 회수할 수 있지만 Merkle 증명을 생성하거나 클레임을 제출하지는 않습니다. 이미 쓰는 채널로 사용자에게 알리세요. 온체인 리프는 여전히 지갑 또는 [레거시 NFT](/ko/smart-contracts/mpl-distro/legacy-nft-distribution) mint입니다.
{% /callout %}

**바로가기:** [사전 요구사항](#사전-요구사항) · [제출 모드](#클레임-제출-모드-선택) · [레코드 보관](#할당-레코드-보관) · [증명 전달](#merkle-증명-전달) · [토큰 회수](#미클레임-토큰-회수)

## 빠른 시작

프로덕션 MPL-Distro 에어드롭에는 온체인 프로그램을 둘러싼 다섯 개의 전달 단계가 있습니다.

1. 완전한 할당 목록을 만들고 `prepareDistribution`으로 루트를 생성합니다.
2. 할당마다 클레임 레코드를 유지한 뒤 배포를 만들고 자금을 넣습니다.
3. 지갑 또는 NFT mint로 키잉된 클레임 페이지 또는 조회 API에서 각 레코드를 제공합니다.
4. 저장된 amount, nonce, 증명으로 `distribute` 또는 `distributeToLegacyNft`를 제출합니다.
5. `endTime` 이후 미클레임 토큰과 사용하지 않은 영수증 임대료 보조금을 출금합니다.

## 사전 요구사항

프로덕션 전달은 기존 [SPL 토큰](/ko/solana/spl-tokens-and-token-programs) mint와 완성된 할당 목록에서 시작합니다.

- [시작하기](/ko/smart-contracts/mpl-distro/getting-started) 배포(또는 백엔드에서 동일한 생성·입금 단계)
- 클레임 레코드를 위한 내구성 있는 저장소(데이터베이스, 오브젝트 스토어, 또는 다운로드 파일)
- 임대료, 네트워크 수수료, {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 프로토콜 수수료용으로 자금이 있는 클레임 트랜잭션 지불자
- 배포 유형: [지갑](/ko/smart-contracts/mpl-distro/wallet-distribution) 또는 [레거시 NFT](/ko/smart-contracts/mpl-distro/legacy-nft-distribution)

할당량은 토큰 기본 단위입니다. decimals가 6인 mint에서 `1.0` 토큰은 `1_000_000`입니다.

## 클레임 제출 모드 선택

`allowedDistributor`는 누가 유효한 증명을 제출할 수 있는지를 정하며, 토큰이 가는 곳은 바꾸지 않습니다.

| 모드 | 클레임에 서명하는 주체 | 일반적인 프로덕션 형태 |
|---|---|---|
| `Permissionless` | 자금이 있는 임의의 지불자 | 사용자 또는 릴레이어가 내는 클레임 페이지. 토큰은 리프로 갑니다 |
| `Recipient` | 리프 지갑 또는 현재 NFT 소유자 | 수혜자가 트랜잭션을 승인해야 하는 클레임 페이지 |
| `Permissioned` | 구성된 `permissionedDistributor` | 하나의 백엔드만 증명 제출 서명자가 됩니다 |

토큰은 항상 리프의 정규 [associated token account](/ko/solana/understanding-solana-accounts#associated-token-accounts-atas)로 갑니다(`LegacyNft`에서는 현재 NFT 소유자의 ATA). Permissionless 제출은 자금을 지불자에게 돌릴 수 없습니다.

배포 권한자와 permissioned-distributor 키는 브라우저 애플리케이션 밖에 두세요.

## 할당 레코드 보관

각 클레임은 그 리프에 대해 `prepareDistribution`이 사용한 동일한 주소, amount, nonce, 증명이 필요합니다. 온체인 계정은 루트만으로 그 값을 재구성할 수 없습니다.

완전한 목록에서 시작한 뒤 같은 인덱스에 증명을 저장하세요.

```json {% title="allocations.json" %}
[
  {
    "address": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
    "amount": "10000000",
    "nonce": "0"
  },
  {
    "address": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
    "amount": "5000000",
    "nonce": "0"
  }
]
```

{% code-tabs-imported from="mpl-distro/persist_claim_records" frameworks="umi" filename="persistClaimRecords" /%}

`createDistribution` 이후 모든 레코드에 배포 [PDA](/ko/solana/understanding-pdas)를 저장하세요. 클레임 트랜잭션에는 그 주소와 `mint`, `amount`, `nonce`, `proof`가 필요합니다.

| 필드 | 필요한 곳 | 참고 |
|---|---|---|
| `address` | 리프 identity | 지갑 공개 키 또는 레거시 NFT mint |
| `amount` | 리프 데이터 | 문자열 또는 `bigint`인 토큰 기본 단위 |
| `nonce` | 리프 데이터 | 기본값은 `0`. 같은 주소와 amount가 두 번 나올 때 필요 |
| `proof` | `distribute` | 트리 레벨당 32바이트 형제 해시 하나, SDK 순서 |
| `distribution` | `distribute` | 생성 후 `findDistributionPda`의 PDA |

{% callout title="클레임을 열기 전에 증명 저장" type="warning" %}
권한자는 `startTime <= now <= endTime` 동안 Merkle 루트, 트리 높이, 시작 시각, claimant 수를 바꿀 수 없습니다. 창이 시작되기 전에 전체 할당 파일을 백업하세요.
{% /callout %}

## Merkle 증명 전달

애플리케이션은 저장된 레코드 하나를 조회해 `distribute` 또는 `distributeToLegacyNft`에 넘깁니다. MPL-Distro는 수신자를 인덱싱하지 않습니다.

일반적인 전달 형태:

1. **클레임 페이지.** 사용자가 지갑을 연결하고 네트워크 수수료를 내며 저장된 증명을 제출합니다.
2. **조회 API.** 서비스가 `address` → `{ amount, nonce, proof, distribution }`을 프론트엔드 또는 릴레이어에 매핑합니다.
3. **스폰서 클레임.** 수신자(또는 적격성 검사)가 여전히 클레임을 트리거합니다. 릴레이어가 SOL을 내서 사용자에게 자금이 있는 지갑이 필요 없습니다. 토큰은 리프 ATA로 갑니다.

스폰서 클레임은 백엔드 루프에서 모든 할당을 보내는 대체가 아닙니다. 각 Distro 클레임은 여전히 {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 프로토콜 수수료를 냅니다. 모든 수신자가 클레임 단계 없이 즉시 토큰을 받아야 하면 직접 [SPL 토큰](/ko/solana/spl-tokens-and-token-programs) 전송을 사용하세요.

일부 할당이 미클레임으로 남을 수 있거나, 공개 Merkle 커밋먼트와 시간 창이 필요하거나, 실제로 클레임하는 사람에 대해서만 릴레이어가 내야 할 때 Distro를 사용하세요.

`LegacyNft`는 NFT mint로 조회를 키잉하세요. 클레임 시점에 현재 소유자를 해석하세요. 스냅샷 소유자를 리프에 고정하려면 대신 [지갑 배포](/ko/smart-contracts/mpl-distro/wallet-distribution)를 의도한 것입니다.

온체인 루트에서 증명을 다시 만들지 마세요. 다른 해시, 바이트 순서, 또는 리프 집합으로 만든 증명은 `InvalidClaimProof`로 실패합니다.

## 클레임 창 열기

클레임은 클러스터 시각이 포함적 `startTime`–`endTime` 창 안에 있고 볼트에 충분한 토큰이 있을 때만 성공합니다.

모든 수신자에게 목록을 열기 전에 [시작하기](/ko/smart-contracts/mpl-distro/getting-started) 흐름으로 생성, 입금, 첫 테스트 클레임을 제출하세요. 다음을 확인하세요.

- 유지된 파일의 샘플 증명이 `distribute`와 일치합니다.
- 프로토콜 수수료 지불자에게 {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 수수료와 영수증 임대료용 SOL이 있거나, [영수증 보조금](/ko/smart-contracts/mpl-distro/funding-and-recovery#클레임-영수증-보조금에-자금-투입)이 자금이 있습니다.
- 권한자 키가 클레임 프론트엔드에 노출되지 않습니다.

## 클레임 모니터링

성공한 클레임은 영구 클레임 영수증 [PDA](/ko/solana/understanding-pdas)를 만듭니다. 그 계정을 가져오거나 배포의 `claimCount` / `claimAmount`를 비교해 어떤 할당이 끝났는지 알 수 있습니다.

정확한 `(distribution, recipient, amount, nonce)` 튜플에 대해 `AlreadyClaimed`를 성공으로 취급하세요. `LegacyNft` mint의 소유권 이전은 영수증을 재설정하지 않습니다.

## 미클레임 토큰 회수

배포 권한자는 배포가 비활성일 때만 남은 토큰과 사용하지 않은 보조금 SOL을 출금합니다. `startTime` 이전 또는 `endTime` 이후입니다.

`withdraw`와 `withdrawSubsidy`는 [자금 투입과 회수](/ko/smart-contracts/mpl-distro/funding-and-recovery#미클레임-토큰-회수)를 참조하세요. 마지막 클레임이 회수 트랜잭션과 경합하지 않도록 종료 타임스탬프 주변에 운영 여유를 두세요.

## 프로덕션 전달 체크리스트

사용자가 의존하기 전에 오프체인 파일을 온체인 루트와 대조하세요.

- `amount` 값의 합이 볼트 입금으로 커버됩니다.
- 유지된 모든 증명이 같은 목록, 같은 순서의 `prepareDistribution` 출력입니다.
- 유출된 증명만으로 제출되면 안 되면 `Recipient` 모드를 사용합니다.
- 클레임 프론트엔드가 배포 권한자를 보유하지 않습니다.
- `endTime` 이후 `withdraw`를 호출할 수 있는 소유자가 미클레임 토큰에 있습니다.

## 참고사항

MPL-Distro는 할당 데이터베이스, 알림 채널, 클레임 UI를 대체하지 않습니다.

- `totalClaimants`는 메타데이터이며 성공 증명의 상한이 아닙니다.
- 클레임 영수증은 닫히지 않으므로 영수증 임대료가 할당된 채로 남습니다.
- 큰 목록은 제어된 Node.js 프로세스에서 만들어야 합니다. `prepareDistribution`은 1,000개 리프에서 구현을 전환합니다.

## FAQ

### MPL-Distro가 클레임 웹사이트를 호스팅하나요?

아니요. 프로그램은 Merkle 루트만 저장합니다. 애플리케이션이 증명을 유지하고 클레임 페이지 또는 API를 제공해야 합니다.

### 이메일 또는 Discord 핸들을 Merkle 리프로 쓸 수 있나요?

아니요. 리프는 지갑 공개 키 또는 레거시 NFT mint입니다. 오프체인 채널로 알릴 수는 있지만 온체인 identity는 아닙니다.

### Merkle 증명을 공개해도 안전한가요?

`Permissionless` 모드에서는 유효한 증명을 가진 누구나 클레임을 제출할 수 있습니다. 토큰은 리프 주소로 갑니다. 증명 접근만으로 제출을 허용하지 않으려면 `Recipient` 모드를 사용하세요.

### 백엔드가 모든 Merkle 증명을 직접 제출해야 하나요?

아니요. 백엔드에서 모든 증명을 제출하는 것은 각 Distro 클레임이 프로토콜 수수료를 내므로 보통 [SPL 토큰](/ko/solana/spl-tokens-and-token-programs) 전송보다 비쌉니다. SOL이 없는 사용자도 클레임할 수 있게 릴레이어를 쓰거나, 일부 할당이 미클레임으로 남고 Merkle 창이 필요할 때 Distro를 사용하세요.

### 미클레임 토큰은 언제 회수할 수 있나요?

권한자는 시작 타임스탬프 이전 또는 종료 타임스탬프 이후에 토큰을 출금할 수 있습니다. `startTime <= clusterTime <= endTime`일 때 출금은 거부됩니다.
