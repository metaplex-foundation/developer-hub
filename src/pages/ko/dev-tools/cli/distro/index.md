---
title: 개요
metaTitle: MPL-Distro CLI 개요 | Metaplex CLI
description: Metaplex CLI(mplx distro)로 MPL-Distro 토큰 배포를 생성, 자금 투입, 조회, 회수합니다.
keywords:
  - MPL-Distro CLI
  - mplx distro
  - Solana token airdrop CLI
  - Merkle distribution
  - Metaplex CLI
about:
  - MPL-Distro
  - Metaplex CLI
  - token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '08-27-2026'
updated: '08-27-2026'
faqs:
  - q: mplx distro는 무엇을 하나요?
    a: mplx distro 명령어 그룹은 MPL-Distro 계정을 생성하고, SPL 토큰을 입금·출금하며, 온체인 배포 정보를 조회합니다. Merkle 증명을 생성하거나 클레임을 제출하지는 않습니다.
  - q: 현재 MPL-Distro 프로그램과 맞는 CLI 버전은 무엇인가요?
    a: 온체인 프로그램에는 @metaplex-foundation/mpl-distro 0.4.x 클라이언트가 필요합니다. 게시된 @metaplex-foundation/cli 0.4.3은 아직 0.3.x에 의존하며 distro create가 BorshIoError로 실패합니다. mpl-distro 0.4.0 이상에 의존하는 CLI 빌드를 사용하세요.
  - q: CLI가 수신자 클레임을 제출하나요?
    a: 아니요. prepareDistribution으로 증명을 만들고 JavaScript SDK 또는 클레임 앱에서 distribute 또는 distributeToLegacyNft를 제출하세요.
  - q: 권한자는 언제 토큰을 출금할 수 있나요?
    a: 시작 타임스탬프 이전 또는 종료 타임스탬프 이후입니다. 클레임 창이 활성일 때 출금은 거부됩니다.
---

{% callout title="이 문서에서 다루는 내용" %}
[MPL-Distro](/ko/smart-contracts/mpl-distro) 권한자 작업을 위한 완전한 CLI 레퍼런스입니다.
- **생성**: 플래그, JSON, 또는 마법사로 지갑 또는 레거시 NFT 배포 초기화
- **자금 투입과 회수**: 토큰을 입금하고 클레임 창 밖에서 잔여분을 출금
- **조회**: 온체인 구성, 상태, Merkle 루트 가져오기
{% /callout %}

## 요약

`mplx distro` 명령어는 터미널에서 [MPL-Distro](/ko/smart-contracts/mpl-distro) 배포를 생성, 자금 투입, 조회, 회수합니다.

- **도구**: Metaplex CLI(`mplx`)의 `distro` 명령어 그룹
- **클라이언트**: 현재 프로그램에 대해 `@metaplex-foundation/mpl-distro` **0.4.x** 필요
- **온체인 작업**: 배포 PDA 생성, 토큰 입금, 잔여 출금, 계정 데이터 조회
- **오프체인 작업**: Merkle 루트, 증명, 클레임은 [JavaScript SDK](/ko/smart-contracts/mpl-distro/sdk/javascript)에 남음

{% callout title="게시된 CLI 0.4.3" type="warning" %}
이 문서의 Distro 명령어에는 `@metaplex-foundation/mpl-distro` **0.4.x**가 필요합니다. 게시된 `@metaplex-foundation/cli` **0.4.3**은 아직 0.3.x에 의존하므로 `mplx distro create`가 `BorshIoError`로 실패합니다. `@metaplex-foundation/mpl-distro@^0.4.0`에 의존하는 CLI 빌드(또는 이후 CLI 릴리스)를 사용하세요.
{% /callout %}

**바로가기:** [사전 요구사항](#사전-요구사항) · [일반 흐름](#일반-흐름) · [명령어 레퍼런스](#명령어-레퍼런스) · [Merkle 루트 인코딩](#merkle-루트-인코딩) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq) · [용어집](#용어집)

## 사전 요구사항

MPL-Distro CLI 명령어에는 자금이 있는 identity, 기존 원본 SPL Token mint, 32바이트 Merkle 루트가 필요합니다.

- `@metaplex-foundation/mpl-distro` 0.4.x로 빌드되어 `PATH`에 있는 Metaplex CLI
- `mplx config`로 설정한 Solana 키페어(배포 권한자)
- 임대료와 트랜잭션 수수료용 SOL
- 기존 [SPL 토큰](/ko/solana/spl-tokens-and-token-programs) mint(Token-2022 아님)와 입금용 자금이 있는 associated token account
- `mplx config rpcs add` 또는 `-r`로 지정한 RPC 엔드포인트

명령어 그룹을 확인합니다.

```bash {% title="CLI 확인" %}
mplx distro --help
```

## 일반 흐름

권한자 설정은 CLI로 합니다. 수신자는 증명을 저장하는 앱에서 클레임합니다.

1. **할당** — [JavaScript SDK](/ko/smart-contracts/mpl-distro/sdk/javascript)의 `prepareDistribution`으로 수신자 목록을 만들고 Merkle 루트를 생성합니다. 모든 주소, amount, nonce, 증명을 보존합니다.
2. **생성** — `mplx distro create`가 루트, 클레임 창, mint, 접근 모드를 온체인에 기록합니다.
3. **입금** — `mplx distro deposit`가 토큰을 배포 볼트로 이동합니다. 입금은 언제든 가능합니다.
4. **클레임** — 수신자(또는 릴레이어)가 저장된 증명으로 `distribute` / `distributeToLegacyNft`를 제출합니다. CLI에는 클레임 명령어가 없습니다.
5. **회수** — `endTime` 이후(또는 `startTime` 이전)에 `mplx distro withdraw`가 미클레임 토큰을 반환합니다.

증명 저장과 클레임 페이지는 [프로덕션 전달](/ko/smart-contracts/mpl-distro/production-delivery)을 참조하세요.

```bash {% title="생성, 자금 투입, 조회, 회수" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 2 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-08T00:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>

mplx distro deposit <DISTRIBUTION> --amount 1.0
mplx distro fetch <DISTRIBUTION>
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

{% callout title="배포 주소 저장" type="note" %}
`distro create`는 배포 PDA를 base58 공개키로 출력합니다. 그 주소를 그대로 `deposit`, `fetch`, `withdraw`에 전달하세요.
{% /callout %}

## 명령어 레퍼런스

`mplx distro`는 네 가지 명령어를 제공합니다. 증명을 생성하거나 클레임을 제출하지 않습니다.

| 명령어 | 설명 |
|---------|-------------|
| [`distro create`](/ko/dev-tools/cli/distro/create) | 지갑 또는 레거시 NFT 배포 생성 |
| [`distro deposit`](/ko/dev-tools/cli/distro/deposit) | SPL 토큰을 배포 볼트에 입금 |
| [`distro fetch`](/ko/dev-tools/cli/distro/fetch) | 온체인 배포 상세 조회 |
| [`distro withdraw`](/ko/dev-tools/cli/distro/withdraw) | 창이 비활성일 때 미클레임 토큰 출금 |

CLI는 `AllowedDistributor.Permissioned`, `updateDistribution`, `withdrawSubsidy`, 클레임 명령을 지원하지 않습니다.

## Merkle 루트 인코딩

`--merkleRoot`는 32바이트 할당 루트의 base58 인코딩이며 16진 문자열이 아닙니다.

`prepareDistribution`으로 생성한 뒤 `root` 바이트를 인코딩합니다.

```ts {% title="Distro Merkle 루트 인코딩" %}
import { prepareDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

const { root, proofs, treeHeight } = prepareDistribution([
  { address: publicKey('RecipientWallet111111111111111111111111111'), amount: 100_000n },
  { address: publicKey('RecipientWallet222222222222222222222222222'), amount: 250_000n },
])

const merkleRoot = base58.deserialize(root)[0]
console.log(merkleRoot)
```

`--totalClaimants`를 그 목록의 할당 수로 설정하세요. CLI는 `computeTreeHeight(totalClaimants)`를 온체인에 저장합니다. `prepareDistribution` 증명은 그 높이보다 길면 안 됩니다.

## 일반적인 오류

`mplx distro`에서 가장 자주 보는 실패입니다.

| 오류 | 원인 | 해결 |
|-------|-------|-----|
| `BorshIoError` / Failed to serialize or deserialize account data | CLI가 아직 mpl-distro 0.3.x(게시된 0.4.3)를 사용함 | `@metaplex-foundation/mpl-distro@^0.4.0`에 의존하는 CLI 빌드 사용 |
| `InvalidPublicKeyError` | 배포 인자가 base58 공개키가 아님 | `distro create`가 출력한 PDA를 전달 |
| Missing required flag | 플래그, JSON, `--wizard` 없이 create를 실행함 | `--name`, `--mint`, `--totalClaimants`, `--startTime`, `--endTime`, `--merkleRoot`를 전달하거나 `--distroConfig` / `--wizard` 사용 |
| Insufficient balance | identity ATA에 토큰이 부족함 | 민트 또는 전송 후 입금 재시도 |
| Distribution not found | PDA 또는 클러스터가 다름 | 같은 RPC에서 `distro fetch`로 주소 확인 |

## 참고사항

CLI는 SDK로 만든 Merkle 할당을 다루는 권한자 도구입니다.

- mint는 원본 SPL Token 프로그램 소유여야 합니다. Token-2022 mint는 거부됩니다.
- `--amount` 수량은 mint의 decimals를 사용합니다. `--basisAmount`는 토큰 최소 단위입니다.
- 입금은 시간 제한이 없습니다. `startTime <= clusterTime <= endTime`이면 출금이 거부됩니다.
- `--allowedDistributor`는 `permissionless` 또는 `recipient`만 받습니다.
- CLI는 무작위 seed 서명자를 생성하고 seed는 출력하지 않습니다. create 출력에서 배포 PDA를 저장하세요.

## FAQ

### mplx distro는 무엇을 하나요?

`mplx distro` 명령어 그룹은 MPL-Distro 계정을 생성하고, SPL 토큰을 입금·출금하며, 온체인 배포 정보를 조회합니다. Merkle 증명을 생성하거나 클레임을 제출하지는 않습니다.

### 현재 MPL-Distro 프로그램과 맞는 CLI 버전은 무엇인가요?

온체인 프로그램에는 `@metaplex-foundation/mpl-distro` 0.4.x 클라이언트가 필요합니다. 게시된 `@metaplex-foundation/cli` 0.4.3은 아직 0.3.x에 의존하며 `distro create`가 `BorshIoError`로 실패합니다. mpl-distro 0.4.0 이상에 의존하는 CLI 빌드를 사용하세요.

### CLI가 수신자 클레임을 제출하나요?

아니요. `prepareDistribution`으로 증명을 만들고 [JavaScript SDK](/ko/smart-contracts/mpl-distro/sdk/javascript) 또는 [클레임 페이지](/ko/smart-contracts/mpl-distro/production-delivery)에서 `distribute` 또는 `distributeToLegacyNft`를 제출하세요.

### 권한자는 언제 토큰을 출금할 수 있나요?

시작 타임스탬프 이전 또는 종료 타임스탬프 이후입니다. 클레임 창이 활성일 때 출금은 거부됩니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| Distribution PDA | `["distribution", mint, seed]`에서 유도된 온체인 계정. CLI가 seed를 내부 생성합니다. |
| Merkle root | 할당 트리의 32바이트 해시. create에 base58로 전달합니다. |
| Basis amount | 토큰 최소 단위(1.0 토큰당 `10 ^ decimals`). |
| Claim window | `startTime`부터 `endTime`까지 포함 기간. 이 기간에 클레임은 성공하고 출금은 실패합니다. |
| Allowed distributor | 유효한 증명을 제출할 수 있는 주체. CLI에서는 `permissionless` 또는 `recipient`. |
