---
title: 레거시 NFT 배포
metaTitle: MPL-Distro로 레거시 NFT 보유자에게 토큰 배포하기
description: 레거시 NFT mint로 MPL-Distro 할당을 구성하고, 각 NFT의 현재 소유자가 SPL 토큰을 클레임하게 합니다.
keywords:
  - legacy NFT holder rewards
  - Token Metadata NFT airdrop
  - MPL-Distro NFT distribution
  - NFT-gated token claim
about:
  - MPL-Distro
  - Legacy NFTs
  - Holder Rewards
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - 레거시 NFT mint 주소로 키잉된 할당을 만듭니다.
  - LegacyNft 배포를 만들고 자금을 넣습니다.
  - 현재 NFT 소유자와 토큰 계정을 해석합니다.
  - distributeToLegacyNft 클레임을 제출합니다.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: NFT가 전송된 뒤 누가 할당을 받나요?
    a: 클레임이 실행될 때 NFT 토큰 계정을 소유한 지갑이 할당을 받습니다.
  - q: 이후 NFT 소유자가 다시 클레임할 수 있나요?
    a: 아니요. 클레임 영수증은 NFT mint, amount, nonce로 키잉되므로 소유권 이전이 재설정하지 않습니다.
  - q: 이 흐름으로 MPL Core 에셋 보유자에게 토큰을 배포할 수 있나요?
    a: 아니요. LegacyNft는 SPL 토큰 계정 소유권을 검증합니다. Core 에셋에는 Wallet 배포의 에셋 서명자 패턴이 필요합니다.
  - q: LegacyNft는 pNFT에서 동작하나요?
    a: 예. pNFT 토큰 계정이 원본 SPL Token 프로그램 소유이고 잔액이 1일 때입니다. Token-2022 pNFT는 지원되지 않습니다.
---

레거시 NFT 배포는 NFT mint 주소에 토큰 할당을 붙이고, 클레임이 실행될 때 각 NFT를 소유한 지갑에 지급합니다. {% .lead %}

## 요약

`LegacyNft` 배포는 레거시 NFT mint를 Merkle 리프로 쓰고, `distributeToLegacyNft` 중에 현재 SPL 토큰 계정 소유자를 검증합니다.

- 소유자 지갑이 아니라 NFT mint 주소에서 할당 트리를 만듭니다.
- `DistributionType.LegacyNft`로 배포를 만듭니다.
- 배포 토큰을 현재 소유자의 토큰 계정으로 보냅니다.
- NFT mint에 대해 영수증을 기록해 소유권 이전이 두 번째 클레임을 가능하게 하지 못하게 합니다.

{% callout title="레거시 NFT만" type="warning" %}
이 흐름은 잔액이 1인 원본 SPL Token 계정을 검증합니다. 그 토큰 프로그램의 Token Metadata NFT와 pNFT가 대상입니다. MPL Core 에셋이나 Token-2022 NFT와는 호환되지 않습니다.
{% /callout %}

## 레거시 NFT 할당 모델

각 할당은 레거시 NFT mint 주소, 토큰량, 선택적 nonce를 커밋합니다.

{% code-tabs-imported from="mpl-distro/legacy_nft_allocations" frameworks="umi" filename="legacyNftAllocations" /%}

스냅샷 소유자 지갑에서 리프를 만들지 마세요. NFT mint가 안정 identity이며 클레임 전 소유권 이전을 허용합니다.

## 레거시 NFT 소유권 검증

프로그램은 클레임 시점에 NFT의 SPL 토큰 계정에서 현재 소유권을 검증합니다.

전달된 NFT 토큰 계정은 다음을 충족해야 합니다.

- 원본 SPL Token 프로그램 소유일 것.
- Merkle 리프에 커밋된 NFT mint를 사용할 것.
- 정확히 1토큰을 보유할 것.
- 전달된 `nftOwner`가 소유자일 것.

프로그램은 [Token Metadata](/ko/smart-contracts/token-metadata), Token Record, Authorization Rules를 호출하지 않습니다. 위의 SPL 토큰 계정만 확인합니다.

## 레거시 NFT 클레임 제출

`distributeToLegacyNft` 명령은 mint 증명을 검증하고 현재 NFT 소유자의 associated token account로 토큰을 보냅니다.

{% code-tabs-imported from="mpl-distro/claim_legacy_nft" frameworks="umi" filename="claimLegacyNft" /%}

`nftOwner`를 생략하면 SDK는 트랜잭션 지불자를 기본값으로 쓰고 그 지불자의 NFT 토큰 계정을 유도합니다. Permissionless 서비스가 다른 소유자 대신 낼 때는 `nftOwner`를 명시하세요.

{% code-tabs-imported from="mpl-distro/sponsored_legacy_nft_claim" frameworks="umi" filename="sponsoredLegacyNftClaim" /%}

## 레거시 NFT 클레임 영수증

레거시 NFT 영수증은 NFT mint를 수신자 identity로 저장합니다.

| 영수증 요소 | 값 |
|---|---|
| Recipient seed | NFT mint(소유자 지갑 아님) |
| Destination | 배포 mint에 대한 현재 소유자의 associated token account |
| Ownership transfer effect | 미클레임 할당의 수령인을 바꿈 |
| Repeat claim after transfer | 영수증이 NFT mint에 묶여 있어 거부됨 |

## 레거시 NFT 배포 접근 모드

Allowed distributor 모드는 NFT mint가 아니라 NFT 소유자에게 적용됩니다.

| 모드 | 클레임 서명자 요구사항 |
|---|---|
| `Permissionless` | 검증된 현재 소유자를 위해 임의의 지불자가 제출할 수 있음 |
| `Recipient` | 현재 `nftOwner`가 서명해야 함 |
| `Permissioned` | 구성된 permissioned distributor가 서명해야 함 |

현재 보유자가 옵트인해야 하면 `Recipient`를 사용하세요. 검증된 현재 소유자가 서명하지 않고 릴레이어가 클레임을 낼 수 있으면 `Permissionless`를 사용하세요.

## 레거시 NFT 스냅샷 고려사항

Merkle 트리는 대상 NFT mint를 고정하지만, 각 mint가 클레임할 때까지 소유권은 동적입니다.

이 구분에서 흔한 두 모델이 나옵니다.

1. **Mint 적격 모델:** 이후 전송과 관계없이 대상 NFT mint는 클레임할 수 있고, 클레임 시점의 소유자가 보상을 받습니다.
2. **소유자 스냅샷 모델:** 스냅샷 이후 전송이 적격성을 옮기지 않게 하려면 스냅샷 소유자 지갑을 쓰고 [지갑 배포](/ko/smart-contracts/mpl-distro/wallet-distribution)를 사용하세요.

{% callout title="마켓플레이스 혼동 방지" type="note" %}
적격성이 NFT mint를 따르는지 스냅샷 소유자를 따르는지 공개하세요. 구매자는 미클레임 mint 기반 할당을 받을 수 있지만, 소유권만으로는 클레임 상태를 알 수 없습니다. 애플리케이션이 클레임 영수증을 확인해야 합니다.
{% /callout %}

## 참고사항

레거시 NFT 배포는 완전한 NFT 메타데이터 의미가 아니라 대체 가능 토큰 계정 사실을 검증합니다.

- 컬렉션 검증과 NFT 적격성은 루트 생성 전에 해야 합니다.
- 동결되거나 위임된 NFT 토큰 계정은 애플리케이션 계층에서 확인이 필요합니다.
- 보상 토큰은 NFT 소유자의 정규 associated token account로 갑니다.
- 현재 프로그램은 상환 후 클레임 영수증을 닫지 않습니다.

## FAQ

### NFT가 전송된 뒤 누가 할당을 받나요?

클레임이 실행될 때 NFT 토큰 계정을 소유한 지갑이 할당을 받습니다.

### 이후 NFT 소유자가 다시 클레임할 수 있나요?

아니요. 클레임 영수증은 NFT mint, amount, nonce로 키잉되므로 소유권 이전이 재설정하지 않습니다.

### 이 흐름으로 MPL Core 에셋 보유자에게 토큰을 배포할 수 있나요?

아니요. `LegacyNft`는 SPL 토큰 계정 소유권을 검증합니다. Core 에셋에는 `Wallet` 배포의 에셋 서명자 패턴이 필요합니다.

### LegacyNft는 pNFT에서 동작하나요?

예. pNFT 토큰 계정이 원본 SPL Token 프로그램 소유이고 잔액이 1일 때입니다. 프로그램은 Token Metadata, Token Record, Authorization Rules를 호출하지 않습니다. Token-2022 pNFT는 지원되지 않습니다.
