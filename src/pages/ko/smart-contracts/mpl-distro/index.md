---
title: MPL-Distro
metaTitle: MPL-Distro - Solana에서 Merkle 토큰 클레임과 에어드롭
description: 기존 SPL 토큰을 지갑 또는 레거시 NFT 보유자에게 배포합니다. MPL-Distro는 전체 수신자 목록 대신 Merkle 루트를 온체인에 저장합니다.
keywords:
  - MPL-Distro
  - Solana token distribution
  - Merkle airdrop
  - token claim
  - SPL token distribution
  - legacy NFT holder rewards
about:
  - MPL-Distro
  - Token Distribution
  - Merkle Claims
proficiencyLevel: Intermediate
created: '08-25-2026'
updated: '08-27-2026'
faqs:
  - q: MPL-Distro는 무엇에 쓰이나요?
    a: MPL-Distro는 기존 SPL 토큰 할당을 지갑 주소 또는 레거시 NFT mint의 고정 목록에 Merkle 증명으로 배포합니다.
  - q: MPL-Distro는 토큰 런치패드인가요?
    a: 아니요. MPL-Distro는 기존 mint를 배포합니다. 토큰 생성 이벤트, 세일, Launch Pool, 본딩 커브가 필요하면 Genesis를 사용하세요.
  - q: 누군가 수신자 대신 트랜잭션 수수료를 낼 수 있나요?
    a: 예. Permissionless 배포는 임의의 지불자가 수신자를 위한 유효한 클레임을 제출할 수 있게 하고, Recipient와 Permissioned 모드는 제출할 수 있는 주체를 제한합니다.
  - q: MPL-Distro는 베스팅을 지원하나요?
    a: 아니요. MPL-Distro는 각 Merkle 할당을 한 번의 클레임으로 해제합니다. 일정 기반 프로젝트 할당에는 Genesis 프로젝트 베스팅을 사용하세요.
---

**MPL-Distro**는 기존 [SPL 토큰](/ko/solana/spl-tokens-and-token-programs)을 지갑 또는 [레거시 NFT](/ko/smart-contracts/token-metadata) 보유자 목록에 배포하는 Solana 프로그램입니다. 전체 수신자 목록 대신 컴팩트한 Merkle 루트를 온체인에 저장합니다. {% .lead %}

## 요약

MPL-Distro는 수신자 목록을 하나의 온체인 Merkle 루트로 커밋하고, 토큰을 볼트에 보관하며, 각 성공 클레임을 기록해 재사용할 수 없게 합니다.

- 전체 수신자 목록을 온체인에 저장하지 않고 기존 SPL 토큰 mint를 배포합니다.
- 지갑 주소 또는 특정 레거시 NFT mint의 현재 보유자를 대상으로 합니다.
- Permissionless, recipient 전용, 또는 permissioned 클레임 제출을 선택합니다.
- 클레임 창이 끝난 뒤 미클레임 토큰과 사용하지 않은 영수증 임대료 보조금을 회수합니다.

{% quick-links %}
{% quick-link title="배포 구축하기" icon="InboxArrowDown" href="/ko/smart-contracts/mpl-distro/getting-started" description="지갑 배포를 생성, 자금 투입, 클레임합니다." /%}
{% quick-link title="프로덕션에서 클레임 전달하기" icon="PaperAirplane" href="/ko/smart-contracts/mpl-distro/production-delivery" description="증명을 저장하고, 클레임 페이지 또는 API를 운영하며, 미클레임 토큰을 회수합니다." /%}
{% quick-link title="배포 유형 선택" icon="ArrowsRightLeft" href="/ko/smart-contracts/mpl-distro/wallet-distribution" description="지갑과 레거시 NFT 할당 모델을 비교합니다." /%}
{% quick-link title="CLI" icon="CodeBracketSquare" href="/ko/dev-tools/cli/distro" description="터미널에서 배포를 생성, 자금 투입, 조회, 회수합니다." /%}
{% /quick-links %}

## MPL-Distro 배포 모델

Merkle 트리는 수신자 목록을 하나의 32바이트 해시(루트)로 만듭니다. 각 수신자는 짧은 증명으로 그 목록에 있음을 보이므로, 전체 목록을 온체인에 둘 필요가 없습니다.

1. 배포 권한자가 각 수신자, amount, 선택적 nonce를 담은 오프체인 목록을 만듭니다.
2. `prepareDistribution`이 Merkle 루트와 할당별 증명을 만듭니다.
3. `createDistribution`이 루트, 클레임 창, mint, 접근 규칙을 저장합니다.
4. `deposit`이 전체 토큰 할당을 배포의 associated token account로 전송합니다.
5. `distribute` 또는 `distributeToLegacyNft`가 증명을 검증하고 영구 클레임 영수증을 만듭니다.
6. `withdraw`가 배포가 비활성인 뒤 미클레임 토큰을 반환합니다.

{% callout title="클레임 데이터 저장" type="warning" %}
프로그램은 Merkle 루트만 저장하며 수신자 목록이나 증명은 저장하지 않습니다. 각 할당의 주소, amount, nonce, 증명을 데이터베이스 또는 다운로드 가능한 클레임 파일에 보존하세요.
{% /callout %}

## MPL-Distro 배포 유형

MPL-Distro는 지갑 주소 할당과 레거시 NFT mint 할당을 별도의 클레임 명령으로 지원합니다.

| 배포 유형 | Merkle 리프 identity | 클레임 명령 | 적합한 용도 |
|---|---|---|---|
| `Wallet` | 지갑 또는 다른 공개 키 | `distribute` | 수당, 기여자 보상, 직접 토큰 에어드롭 |
| `LegacyNft` | 레거시 NFT mint | `distributeToLegacyNft` | NFT의 현재 토큰 계정 소유자가 클레임하는 보상 |

`LegacyNft` 유형은 나열된 NFT mint를 현재 소유한 지갑에 지급합니다. 대상 NFT와 소유권 확인은 [레거시 NFT 배포](/ko/smart-contracts/mpl-distro/legacy-nft-distribution)를 참조하세요.

## MPL-Distro Allowed Distributor 모드

Allowed distributor 모드는 유효한 Merkle 클레임 트랜잭션을 누가 제출할 수 있는지를 제어합니다.

| 모드 | 필수 서명자 | 동작 |
|---|---|---|
| `Permissionless` | 임의의 지불자 | 서비스 또는 제3자가 수신자 대신 클레임을 제출할 수 있습니다 |
| `Recipient` | 수신자 지갑 또는 레거시 NFT 소유자 | 수혜자가 클레임을 승인해야 합니다 |
| `Permissioned` | 구성된 distributor | 지정된 하나의 distributor만 클레임을 제출할 수 있습니다 |

Permissionless 제출은 토큰의 목적지를 바꾸지 않습니다. 프로그램은 항상 수신자의 정규 [associated token account](/ko/solana/understanding-solana-accounts#associated-token-accounts-atas)로 할당을 보냅니다.

## MPL-Distro 프로토콜 수수료

성공한 Merkle 클레임은 프로토콜 수수료를 부과하며, 클레임 트랜잭션 지불자가 냅니다.

{% protocol-fees program="mpl-distro" config="claim" showTitle=false /%}

Metaplex 프로그램 전반의 현재 금액은 [프로토콜 수수료](/ko/protocol-fees)를 참조하세요.

## 참고사항

MPL-Distro의 온체인 검사는 클레임을 보호하지만 오프체인 할당 검증을 대체하지 않습니다.

- `totalClaimants`는 메타데이터이며 유효한 증명 수의 상한이 아닙니다.
- 입금은 모든 Merkle 할당의 합과 대조되지 않습니다. 클레임이 시작되기 전에 볼트에 충분한 토큰을 넣으세요.
- 클레임 영수증은 닫히지 않으므로 임대료가 할당된 채로 남습니다.
- 프로그램은 Token-2022가 아니라 원본 SPL Token 프로그램을 대상으로 합니다.
- MPL-Distro는 베스팅, 스트리밍, 부분 클레임, 구조화된 프로그램 이벤트를 제공하지 않습니다.

## FAQ

### MPL-Distro는 무엇에 쓰이나요?

MPL-Distro는 기존 SPL 토큰 할당을 지갑 주소 또는 레거시 NFT mint의 고정 목록에 Merkle 증명으로 배포합니다.

### MPL-Distro는 토큰 런치패드인가요?

아니요. MPL-Distro는 기존 mint를 배포합니다. 토큰 생성 이벤트, 세일, Launch Pool, 본딩 커브가 필요하면 [Genesis](/ko/smart-contracts/genesis)를 사용하세요.

### 누군가 수신자 대신 트랜잭션 수수료를 낼 수 있나요?

예. Permissionless 배포는 임의의 지불자가 수신자를 위한 유효한 클레임을 제출할 수 있게 하고, `Recipient`와 `Permissioned` 모드는 제출할 수 있는 주체를 제한합니다.

### MPL-Distro는 베스팅을 지원하나요?

아니요. MPL-Distro는 각 Merkle 할당을 한 번의 클레임으로 해제합니다. 일정 기반 프로젝트 할당에는 [Genesis 프로젝트 베스팅](/ko/smart-contracts/genesis/project-vesting)을 사용하세요.

## 용어집

MPL-Distro는 Merkle 증명과 결정적 계정으로 토큰 할당을 검증하고 기록합니다.

| 용어 | 정의 |
|---|---|
| Distribution | 토큰 mint, Merkle 루트, 시간 창, 권한자, 클레임 합계를 담은 프로그램 계정 |
| Distribution authority | 구성을 업데이트하고, 토큰을 입금하며, 미클레임 자금을 회수할 수 있는 지갑 |
| Merkle tree | 온체인 루트와 할당별 증명을 만드는 오프체인 구조 |
| Merkle root | 전체 오프체인 할당 목록에 대한 32바이트 커밋먼트 |
| Merkle proof | 하나의 할당이 커밋된 트리에 속함을 보이는 형제 해시 |
| Claim receipt | 하나의 `(distribution, recipient, amount, nonce)` 할당이 클레임되었음을 보이는 [PDA](/ko/solana/understanding-pdas) |
| Nonce | 그 외에는 동일한 수신자와 amount 리프를 구분하는 숫자 |
| Token base units | mint의 최소 단위. decimals가 6인 토큰은 1.0 토큰당 `1_000_000` 단위 |
| Receipt subsidy | 클레임 영수증 임대료를 환급하기 위해 배포 PDA가 선택적으로 보유하는 SOL |
