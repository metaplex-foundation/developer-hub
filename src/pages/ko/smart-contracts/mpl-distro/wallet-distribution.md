---
title: 지갑 배포
metaTitle: MPL-Distro 지갑 클레임과 Merkle 증명
description: 지갑 할당 트리를 만들고, 클레임 권한을 구성하며, MPL-Distro 토큰 클레임을 제출합니다.
keywords:
  - MPL-Distro wallet distribution
  - Merkle proof format
  - permissionless token claim
  - Solana airdrop
about:
  - MPL-Distro
  - Wallet Claims
  - Merkle Trees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - 지갑 할당과 고유 nonce를 정의합니다.
  - Merkle 루트와 증명을 생성하고 저장합니다.
  - 필요한 제출 모드로 Wallet 배포를 만듭니다.
  - distribute 명령으로 각 할당을 제출합니다.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: 백엔드가 수신자 서명 없이 클레임을 제출할 수 있나요?
    a: 예. Permissionless 모드는 릴레이어가 SOL을 내고 증명을 제출할 수 있게 합니다. 토큰은 리프 주소로 갑니다. 가스리스 클레임용이며 SPL 전송의 일괄 대체가 아닙니다.
  - q: 같은 지갑 할당이 두 번 클레임되는 것을 무엇이 막나요?
    a: 결정적 클레임 영수증 PDA가 고유한 distribution, recipient, amount, nonce 튜플을 기록합니다.
  - q: totalClaimants가 성공 클레임 수를 제한하나요?
    a: 아니요. totalClaimants는 메타데이터입니다. Merkle 포함과 사용 가능한 볼트 자금이 할당을 클레임할 수 있는지를 정합니다.
  - q: Core 에셋 할당 리프에는 어떤 주소를 넣나요?
    a: Core 에셋 서명자 PDA를 사용하세요. distributeToAssetAndClaim이 그 토큰을 현재 소유자에게 옮깁니다.
---

지갑 배포는 공개 키에 고정 토큰량을 할당하고 `distribute`로 각 할당을 검증합니다. {% .lead %}

## 요약

지갑 배포는 지갑 또는 다른 공개 키를 Merkle 리프 identity로 쓰고, 항상 그 identity의 associated token account로 할당을 전송합니다.

- `prepareDistribution`으로 호환 루트와 증명을 생성합니다.
- 중복 수신자와 amount 할당을 구분해야 할 때 nonce를 설정합니다.
- 애플리케이션의 서명 모델에 맞는 distributor 모드를 고릅니다.
- 온체인 루트만으로는 증명을 재구성할 수 없으므로 모든 증명을 보존합니다.

## 지갑 할당 형태

각 지갑 할당에는 주소, 토큰 기본 단위의 amount, 선택적 부호 없는 64비트 nonce가 들어갑니다.

{% code-tabs-imported from="mpl-distro/wallet_allocations" frameworks="umi" filename="walletAllocations" /%}

amount는 0보다 커야 합니다. nonce 기본값은 0이며, 두 리프가 같은 주소와 amount가 될 때만 바꿉니다.

## MPL-Distro Merkle 형식

MPL-Distro는 Keccak-256과 정렬된 내부 노드 쌍으로 할당 데이터를 해시합니다.

| 요소 | 인코딩 |
|---|---|
| Leaf data | `recipient_pubkey[32] || amount_u64_le || nonce_u64_le` |
| Leaf hash | `keccak256("claim" || leaf_data)` |
| Internal node | `keccak256(0x01 || min(left,right) || max(left,right))` |
| Odd node | 자신과 쌍을 이룸 |
| Proof item | 32바이트 형제 해시 하나 |
| Maximum configured height | 64 |

이 형식을 직접 구현하지 말고 SDK 헬퍼를 사용하세요. SHA-256, 빅엔디안 정수, 미정렬 쌍, 다른 도메인 접두사로 만든 증명은 `InvalidClaimProof`로 실패합니다.

{% callout title="트리 높이는 증명 상한" type="note" %}
온체인 `treeHeight`는 증명 길이를 제한합니다. `totalClaimants`를 독립적으로 검증하지 않습니다. `prepareDistribution`이 반환한 값을 전달하세요.
{% /callout %}

## 지갑 클레임 제출 모드

`allowedDistributor` 설정은 누가 `distribute`를 제출할 수 있는지를 정합니다.

### Permissionless 지갑 클레임

Permissionless 클레임은 자금이 있는 임의의 지불자가 유효한 증명을 제출할 수 있게 하고, 프로그램은 커밋된 수신자에게만 토큰을 보냅니다.

수신자가 내는 클레임 페이지, 또는 실제로 클레임할 때 릴레이어가 SOL을 내는 경우에 사용하세요. 백엔드에서 모든 할당을 Distro로 밀어 내지 마세요. 보통 직접 SPL 전송보다 비쌉니다.

### Recipient 서명 지갑 클레임

Recipient 클레임은 커밋된 수신자가 트랜잭션에 서명해야 합니다.

수혜자가 할당을 명시적으로 수락해야 하거나, 증명 접근만으로 제출을 허용하지 않으려 할 때 사용하세요.

### Permissioned 지갑 클레임

Permissioned 클레임은 구성된 `permissionedDistributor` 서명자가 필요합니다.

하나의 백엔드가 더 넓은 온체인 클레임 창 안에서 해제 시점을 제어할 때 사용하세요. 권한자는 나중에 [permissioned distributor를 변경](/ko/smart-contracts/mpl-distro/updates#permissioned-distributor-변경)할 수 있습니다.

{% callout title="생성 시 Permissioned Distributor 설정" type="warning" %}
`createDistribution`은 `permissionedDistributor`를 System Program 공개 키로 기본 설정합니다. `allowedDistributor`가 `Permissioned`일 때 실제 distributor 주소를 전달하지 않으면 모든 클레임이 `InvalidDistributor`로 실패합니다.
{% /callout %}

## 지갑 클레임 제출

`distribute` 명령은 증명을 검증하고, 필요하면 associated token account를 만들며, 토큰을 전송하고, 영수증을 원자적으로 기록합니다.

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

지불자가 트랜잭션 수수료, {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} 프로토콜 수수료, 계정 임대료를 냅니다. 선택적 클레임 영수증 임대료 보조금은 [자금 투입과 회수](/ko/smart-contracts/mpl-distro/funding-and-recovery)를 참조하세요.

## 지갑 클레임 영수증

클레임 영수증은 하나의 정확한 할당이 두 번 이상 처리되지 않게 합니다.

| 필드 | 값 |
|---|---|
| PDA seeds | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |
| Stored distribution | 배포 PDA |
| Stored recipient | 리프의 지갑 또는 공개 키 |
| Stored amount | 클레임된 토큰 기본 단위 |
| Stored nonce | 리프 nonce |
| Account size | 88바이트 |

현재 프로그램에서 클레임 영수증은 영구적이며 닫기 명령이 없습니다.

## Core 에셋 서명자에 대한 클레임

`distributeToAssetAndClaim`은 `Wallet` 할당을 [MPL Core](/ko/smart-contracts/core) 에셋 서명자 PDA로 클레임한 뒤, [Core Execute](/ko/smart-contracts/core/execute-asset-signing)로 토큰을 현재 소유자에게 옮깁니다.

Merkle 리프는 소유자 지갑이 아니라 각 에셋의 서명자 PDA에서 만듭니다. 헬퍼는 그 PDA의 associated token account에서 클레임된 토큰을 전송합니다.

{% code-tabs-imported from="mpl-distro/claim_to_core_asset" frameworks="umi" filename="claimToCoreAsset" /%}

이 헬퍼는 `Wallet` 배포 흐름입니다. `LegacyNft` 클레임이 아니며 온체인에서 Core 컬렉션 소속도 검증하지 않습니다.

## 지갑 배포 보안 체크리스트

프로덕션 지갑 배포는 루트를 공개하기 전에 할당 무결성을 검증해야 합니다.

- 할당 합이 계획 입금을 넘지 않는지 확인합니다.
- SDK를 호출하기 전에 0, 음수, 범위 밖 amount를 거부합니다.
- 결정적 nonce를 할당하고 증명과 함께 저장합니다.
- 최종 루트에 대해 무작위 증명과 모든 가장자리 할당을 테스트합니다.
- 권한자와 permissioned-distributor 키를 브라우저 애플리케이션 밖에 둡니다.
- 클러스터 타임스탬프를 확인하고 시작·종료 경계 주변에 운영 시간을 남깁니다.

## 참고사항

지갑 배포는 임의의 공개 키를 리프 identity로 쓸 수 있지만, 기본 목적지는 그 SPL 토큰 associated token account입니다.

- Core 에셋 클레임은 `distributeToAssetAndClaim`을 쓰며 Merkle 리프에 에셋 서명자 PDA가 필요합니다.
- `totalClaimants`는 온체인 클레임 상한이 아닙니다.
- 유효한 증명도 볼트에 토큰이 부족하면 실패할 수 있습니다.
- 경계의 두 타임스탬프에서 클레임이 수락됩니다: `startTime <= now <= endTime`.

## FAQ

### 백엔드가 수신자 서명 없이 클레임을 제출할 수 있나요?

예. `Permissionless` 배포는 릴레이어가 SOL을 내고 증명을 제출할 수 있게 합니다. 토큰은 리프 주소로 갑니다. SOL이 없는 수신자가 클레임할 수 있게 쓰는 것이며, 일괄 SPL 전송의 대체가 아닙니다.

### 같은 지갑 할당이 두 번 클레임되는 것을 무엇이 막나요?

결정적 클레임 영수증 PDA가 고유한 distribution, recipient, amount, nonce 튜플을 기록합니다.

### totalClaimants가 성공 클레임 수를 제한하나요?

아니요. `totalClaimants`는 메타데이터입니다. Merkle 포함과 사용 가능한 볼트 자금이 할당을 클레임할 수 있는지를 정합니다.

### Core 에셋 할당 리프에는 어떤 주소를 넣나요?

Core 에셋 서명자 PDA를 사용하세요. `distributeToAssetAndClaim`이 그 토큰을 현재 소유자에게 옮깁니다.
