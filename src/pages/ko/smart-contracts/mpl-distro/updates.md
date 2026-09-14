---
title: 업데이트
metaTitle: MPL-Distro 배포 업데이트하기
description: 배포 PDA를 다시 만들지 않고 MPL-Distro 구성, 권한자, permissioned distributor를 변경합니다.
keywords:
  - update MPL-Distro
  - change distribution authority
  - change Merkle root
  - permissioned distributor
about:
  - MPL-Distro
  - Distribution Updates
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
faqs:
  - q: 권한자가 활성 창 중에 Merkle 루트를 바꿀 수 있나요?
    a: 아니요. 루트, 트리 높이, 시작 시각, claimant 수는 활성 창 동안 잠기지만 시작 전 또는 종료 후에는 바꿀 수 있습니다.
  - q: 활성 배포 중에 클레임 종료 시각을 연장할 수 있나요?
    a: 예. 권한자는 배포가 활성인 동안 endTime을 업데이트할 수 있습니다.
  - q: 새 권한자가 권한 변경에 서명해야 하나요?
    a: 아니요. 현재 권한자만 updateDistribution에 서명합니다. 제출 전에 대상 키를 확인하세요.
---

현재 [MPL-Distro](/ko/smart-contracts/mpl-distro) 권한자는 새 PDA를 만들지 않고 기존 클레임 영수증을 무효화하지 않으면서 선택한 배포 필드를 바꿀 수 있습니다. {% .lead %}

## 요약

`updateDistribution`은 기존 배포에 권한자가 승인한 구성 변경을 적용합니다.

- 전체 할당 구성은 활성 클레임 창 밖에서만 바꿉니다.
- 권한자와 permissioned distributor 같은 운영 필드는 클레임 중에 바꿀 수 있습니다.
- 권한자 변경은 즉시이며 보안에 민감하다고 취급합니다.
- 루트 업데이트와 동시에 교체 Merkle 증명을 원자적으로 공개합니다.

## 빠른 시작

MPL-Distro 배포 업데이트는 기존 계정에 대한 서명된 구성 변경입니다.

1. 클러스터 시각이 포함적 `startTime`–`endTime` 안에 있는지 확인합니다.
2. 바꿀 필드만 `updateDistribution`에 전달합니다.
3. Merkle 루트가 바뀌면 모든 오프체인 증명을 동시에 교체합니다.
4. 확인 후 저장된 권한자와 permissioned distributor를 검증합니다.

## MPL-Distro 업데이트 권한

현재 권한자가 모든 배포 업데이트에 서명해야 합니다.

| 필드 | 시작 전 | 활성 창 중 | 종료 후 |
|---|---:|---:|---:|
| `merkleRoot` | Yes | No | Yes |
| `treeHeight` | Yes | No | Yes |
| `startTime` | Yes | No | Yes |
| `endTime` | Yes | Yes | Yes |
| `totalClaimants` | Yes | No | Yes |
| `newAuthority` | Yes | Yes | Yes |
| `name` | Yes | Yes | Yes |
| `newPermissionedDistributor` | Yes | Yes | Yes |

활성 창은 양쪽 경계 타임스탬프를 포함합니다. 보호된 할당 필드는 `startTime <= clusterTime <= endTime`일 때 잠깁니다.

{% callout title="루트 업데이트에는 일치하는 증명이 필요" type="warning" %}
Merkle 루트를 바꾸면 이전 루트용으로 생성한 모든 증명이 무효가 됩니다. 교체 할당 파일을 온체인 업데이트와 원자적으로 공개하고 보존하세요.
{% /callout %}

## MPL-Distro 구성 업데이트

바꿀 필드만 `updateDistribution`에 전달합니다.

{% code-tabs-imported from="mpl-distro/update_distribution" frameworks="umi" filename="updateDistribution" /%}

명시적 `treeHeight` 없이 `totalClaimants`를 바꾸면 프로그램이 최소 높이를 추론합니다. 새로 준비한 트리가 반환하는 `treeHeight`를 전달하는 것이 더 명확하고 claimant 수 추론에 묶이지 않습니다.

## 배포 권한자 변경

`updateDistribution`은 업데이트, 입금, 토큰 출금, 보조금 출금을 할 수 있는 서명자를 교체합니다.

{% code-tabs-imported from="mpl-distro/change_distribution_authority" frameworks="umi" filename="changeDistributionAuthority" /%}

새 권한자는 업데이트에 서명할 필요가 없습니다. 변경을 제출하기 전에 대상 공개 키를 확인하고 그 서명 인프라가 동작하는지 확인하세요.

## Permissioned Distributor 변경

`updateDistribution`은 `AllowedDistributor.Permissioned`로 구성된 배포가 받는 서명자를 바꿉니다. `updateDistribution`에 `newPermissionedDistributor`를 전달하세요.

이 변경은 Merkle 트리나 기존 영수증을 바꾸지 않습니다. 이전 distributor가 서명한 진행 중 트랜잭션은 업데이트가 착지한 뒤 실패합니다.

## 업데이트 오류

업데이트 오류는 권한자와 타이밍 제약을 보호합니다.

| 오류 | 의미 | 해결 |
|---|---|---|
| `DistributionStarted` | 보호된 할당 필드가 활성 창 중에 변경됨 | 배포가 끝날 때까지 기다리거나 필드를 바꾸지 마세요 |
| `InvalidDistributionAuthority` | 전달된 서명자가 저장된 권한자가 아님 | 현재 권한자를 사용하세요 |
| `InvalidTreeHeight` | 트리 높이가 최댓값을 초과함 | 64 이하 값을 사용하세요 |
| `NameTooLong` | UTF-8 이름이 32바이트를 초과함 | 배포 이름을 짧게 하세요 |

## 참고사항

구성 변경은 확인 직후 증명 유효성과 운영 권한에 영향을 줍니다.

- 활성 창 중 `endTime` 변경은 클레임 기간을 연장하거나 단축할 수 있습니다.
- 창 이후 루트 업데이트는 기존 클레임 영수증을 삭제하지 않습니다.
- 기존 영수증은 업데이트 후에도 배포 PDA에 키잉된 채로 남습니다.

## FAQ

### 권한자가 활성 창 중에 Merkle 루트를 바꿀 수 있나요?

아니요. 루트, 트리 높이, 시작 시각, claimant 수는 활성 창 동안 잠기지만 시작 전 또는 종료 후에는 바꿀 수 있습니다.

### 활성 배포 중에 클레임 종료 시각을 연장할 수 있나요?

예. 권한자는 배포가 활성인 동안 `endTime`을 업데이트할 수 있습니다.

### 새 권한자가 권한 변경에 서명해야 하나요?

아니요. 현재 권한자만 `updateDistribution`에 서명합니다. 제출 전에 대상 키를 확인하세요.
