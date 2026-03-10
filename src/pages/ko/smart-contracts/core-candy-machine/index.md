---
title: Core Candy Machine - Solana에서의 NFT 민팅 및 배포
metaTitle: Core Candy Machine — NFT 민팅 및 공정 런칭 배포 | Metaplex
description: Core Candy Machine은 Solana에서 Core Asset을 민팅하고 배포하기 위한 Metaplex 프로그램입니다. 가드를 구성하고, 아이템을 삽입하고, 사용자 정의 가능한 민팅 규칙으로 NFT 컬렉션을 런칭하세요.
created: '06-01-2024'
updated: '03-10-2026'
keywords:
  - core candy machine
  - candy machine
  - NFT minting
  - NFT launch
  - Solana NFT
  - Core Assets
  - minting program
  - candy guard
  - NFT distribution
  - fair mint
  - collection launch
  - Metaplex Core
  - SPL token payment
  - bot protection
  - mint guards
about:
  - Core Candy Machine minting program
  - NFT collection launches on Solana
  - Candy Guard access control
proficiencyLevel: Beginner
faqs:
  - q: Core Candy Machine과 Candy Machine V3의 차이점은 무엇인가요?
    a: Core Candy Machine은 단일 계정 모델을 사용하여 비용이 낮고 내장 플러그인이 있는 Metaplex Core Asset을 민팅합니다. Candy Machine V3는 토큰당 여러 계정이 필요한 레거시 Token Metadata NFT를 민팅합니다. 새 프로젝트는 Core Candy Machine을 사용해야 합니다.
  - q: Core Candy Machine을 생성하는 데 비용이 얼마나 드나요?
    a: Core Candy Machine을 생성하려면 온체인 계정에 대한 임대료가 필요하며, 이는 로드된 아이템 수에 따라 달라집니다. 민팅 비용은 활성화된 가드에 따라 다릅니다. 예를 들어 Sol Payment 가드는 민팅당 창작자가 정의한 SOL 금액을 청구합니다. Solana 트랜잭션 수수료도 적용됩니다.
  - q: Core Candy Machine에서 여러 가드를 동시에 사용할 수 있나요?
    a: 네. 가드는 조합 가능합니다. 23개 이상의 기본 가드를 동시에 원하는 조합으로 활성화할 수 있습니다. 예를 들어 Sol Payment, Start Date, Mint Limit, Bot Tax를 결합하여 시간 제한, 수량 제한, 봇 보호가 적용된 유료 민팅을 만들 수 있습니다.
  - q: 모든 아이템이 민팅된 후 Core Candy Machine은 어떻게 되나요?
    a: 모든 아이템이 민팅된 후 Candy Machine을 삭제(철회)하여 온체인 임대료를 회수할 수 있습니다. 민팅된 Core Asset은 온체인에 남아 있으며 삭제의 영향을 받지 않습니다.
  - q: 별도의 Candy Guard 계정이 필요한가요?
    a: 실질적으로 그렇습니다. Candy Guard 계정은 민팅 규칙(결제, 타이밍, 허용 목록, 봇 보호)을 시행하는 역할을 합니다. 이것이 없으면 누구나 언제든지 무료로 민팅할 수 있습니다. Candy Guard를 생성하고 민팅 권한으로 설정하는 것이 표준 워크플로우입니다.
---

Metaplex Protocol **Core Candy Machine**은 Solana에서 공정한 NFT 컬렉션 출시를 위한 선도적인 민팅 및 배포 프로그램입니다. [Metaplex Core](/ko/smart-contracts/core) 자산 표준을 위해 설계된 Core Candy Machine은 창작자가 아이템을 로드하고 구매자가 민팅하는 임시 온체인 자판기 역할을 합니다. 이를 통해 창작자는 안전하고 사용자 정의 가능한 방식으로 디지털 자산을 온체인에 가져올 수 있습니다. {% .lead %}

- [Core Asset](/ko/smart-contracts/core/what-is-an-asset)을 단일 계정 모델로 민팅 -- 레거시 Token Metadata NFT보다 비용이 낮고 간단합니다
- 결제, 타이밍, 허용 목록, 봇 보호를 위한 [23개 이상의 조합 가능한 가드](/ko/smart-contracts/core-candy-machine/guards)로 민팅 프로세스를 사용자 정의합니다
- 전체 수명주기를 관리합니다: [생성](/ko/smart-contracts/core-candy-machine/create), [아이템 삽입](/ko/smart-contracts/core-candy-machine/insert-items), [민팅](/ko/smart-contracts/core-candy-machine/mint), [철회](/ko/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)
- 가드 구성을 통해 SOL, SPL 토큰 또는 NFT로 결제를 지원합니다

이 이름은 기계식 크랭크를 통해 동전을 넣고 사탕을 뽑는 자판기에서 따온 것입니다. 이 경우 사탕은 NFT이고 지불 수단은 SOL 또는 SPL 토큰입니다.

{% quick-links %}
{% quick-link title="시작하기" icon="InboxArrowDown" href="/ko/smart-contracts/core-candy-machine/sdk" description="원하는 언어나 라이브러리를 선택하고 Candy Machine을 시작하세요." /%}

{% quick-link title="CLI 명령어" icon="CommandLine" href="/ko/dev-tools/cli/cm" description="Metaplex CLI의 인터랙티브 위자드를 사용하여 캔디 머신을 생성하고 관리하세요." /%}

{% quick-link title="API 레퍼런스" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" target="_blank" description="Javascript API 문서를 확인하세요." /%}

{% quick-link title="API 레퍼런스" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" target="_blank" description="Rust API 문서를 확인하세요." /%}
{% /quick-links %}

{% callout %}
이 문서는 Core Candy Machine으로 알려진 Candy Machine의 최신 버전을 다룹니다. 이는 [Core](/ko/smart-contracts/core) Asset 민팅을 지원합니다. Metaplex Token Metadata NFT를 민팅하려면 [Candy Machine V3를 참조하십시오](/ko/smart-contracts/candy-machine).
{% /callout %}

## Core Candy Machine 수명주기

Core Candy Machine은 생성, 로드, 민팅, 철회의 4단계 수명주기를 따릅니다. 창작자가 설정을 구성하고 아이템 메타데이터를 사전에 삽입하면, 구매자가 온디맨드로 Core Asset을 민팅합니다. 모든 아이템이 민팅되면 창작자가 머신을 삭제하여 임대료를 회수할 수 있습니다.

1. **[생성 및 구성](/ko/smart-contracts/core-candy-machine/create)** 컬렉션 수준 설정으로 Candy Machine 구성
2. **[아이템 삽입](/ko/smart-contracts/core-candy-machine/insert-items)** 각 자산에 대한 이름과 메타데이터 URI 제공
3. **[민팅](/ko/smart-contracts/core-candy-machine/mint)** -- 구매자가 가드 규칙에 따라 온디맨드 Core Asset 생성을 트리거
4. **[철회](/ko/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)** 런칭 후 Candy Machine을 삭제하여 온체인 임대료 회수

구매자가 민팅하기 전까지 온체인에 Core Asset은 존재하지 않습니다. Candy Machine은 민팅 시 각 자산을 생성하는 데 필요한 메타데이터 참조만 저장합니다.

## Candy Guard와 민팅 사용자 정의

[Candy Guard](/ko/smart-contracts/core-candy-machine/guards)는 민팅 프로세스를 보호하고 사용자 정의하는 모듈형 접근 제어 규칙입니다. Core Candy Guard 프로그램은 창작자가 독립적으로 활성화하고 구성하는 23개 이상의 기본 가드를 제공합니다.

각 가드는 단일 책임을 처리하므로 조합이 가능합니다. 일반적인 가드 조합은 다음과 같습니다:

- **[Sol Payment](/ko/smart-contracts/core-candy-machine/guards/sol-payment)** -- 민팅당 구성된 SOL 금액을 청구
- **[Start Date](/ko/smart-contracts/core-candy-machine/guards/start-date)** / **[End Date](/ko/smart-contracts/core-candy-machine/guards/end-date)** -- 특정 시간 범위로 민팅을 제한
- **[Mint Limit](/ko/smart-contracts/core-candy-machine/guards/mint-limit)** -- 지갑당 민팅 수를 제한
- **[Bot Tax](/ko/smart-contracts/core-candy-machine/guards/bot-tax)** -- 가드 검증에 실패한 민팅에 대해 페널티를 청구
- **[Allow List](/ko/smart-contracts/core-candy-machine/guards/allow-list)** -- 미리 정의된 지갑 세트로 민팅을 제한
- **[Token Gate](/ko/smart-contracts/core-candy-machine/guards/token-gate)** / **[NFT Gate](/ko/smart-contracts/core-candy-machine/guards/nft-gate)** -- 특정 토큰 또는 NFT 보유자로 민팅을 제한

가드는 Candy Machine의 민팅 권한이 되는 별도의 [Candy Guard 계정](/ko/smart-contracts/core-candy-machine/guards)을 통해 할당됩니다. 고급 개발자는 Candy Guard 프로그램을 포크하여 핵심 민팅 프로그램에 의존하면서 커스텀 가드를 구축할 수 있습니다. 또한 [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups)을 정의하여 다양한 청중에게 서로 다른 민팅 조건을 제공할 수 있습니다(예: 허용 목록 단계 후 퍼블릭 세일).

## 빠른 참조

| 항목 | 값 |
|------|-------|
| Core Candy Machine Program | `CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J` |
| Core Candy Guard Program | `CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ` |
| JS SDK | `@metaplex-foundation/mpl-core-candy-machine` |
| Rust Crate | `mpl-core-candy-machine-core` |
| 소스 | [GitHub](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| JS TypeDoc | [mpl-core-candy-machine.typedoc.metaplex.com](https://mpl-core-candy-machine.typedoc.metaplex.com/) |
| Rust Docs | [docs.rs/mpl-core-candy-machine-core](https://docs.rs/mpl-core-candy-machine-core/) |
| 기본 가드 | 23개 이상의 조합 가능한 가드 |

## 참고 사항

- Core Candy Machine은 [Metaplex Core](/ko/smart-contracts/core) Asset만 민팅합니다. 레거시 Token Metadata NFT를 민팅하려면 [Candy Machine V3](/ko/smart-contracts/candy-machine)를 사용하세요.
- 민팅 제한을 시행하려면 실질적으로 Candy Guard 계정이 필요합니다. 이것이 없으면 Candy Machine은 제한 없는 무료 민팅을 허용합니다.
- 민팅이 시작되기 전에 아이템을 삽입해야 합니다. 각 아이템에는 `name`과 사전 업로드된 JSON 메타데이터를 가리키는 `uri`가 필요합니다.
- 모든 아이템이 민팅된 후 Candy Machine을 철회하여 온체인 임대료를 회수하세요. 민팅된 자산은 영향을 받지 않습니다.
- Candy Guard 프로그램은 Core Candy Machine 프로그램과는 별도의 온체인 프로그램입니다. 트랜잭션 구성 시 둘 다 참조해야 합니다.
- 봇 보호 모범 사례는 [안티봇 보호 모범 사례](/ko/smart-contracts/core-candy-machine/anti-bot-protection-best-practices)를 참조하세요.


## FAQ

### Core Candy Machine과 Candy Machine V3의 차이점은 무엇인가요?
Core Candy Machine은 단일 계정 모델을 사용하여 비용이 낮고 내장 플러그인이 있는 [Metaplex Core](/ko/smart-contracts/core) Asset을 민팅합니다. [Candy Machine V3](/ko/smart-contracts/candy-machine)는 토큰당 여러 계정이 필요한 레거시 Token Metadata NFT를 민팅합니다. 새 프로젝트는 Core Candy Machine을 사용해야 합니다.

### Core Candy Machine을 생성하는 데 비용이 얼마나 드나요?
Core Candy Machine을 생성하려면 온체인 계정에 대한 임대료가 필요하며, 이는 로드된 아이템 수에 따라 달라집니다. 민팅 비용은 활성화된 [가드](/ko/smart-contracts/core-candy-machine/guards)에 따라 다릅니다 -- 예를 들어 [Sol Payment](/ko/smart-contracts/core-candy-machine/guards/sol-payment) 가드는 민팅당 창작자가 정의한 SOL 금액을 청구합니다. Solana 트랜잭션 수수료도 적용됩니다.

### Core Candy Machine에서 여러 가드를 동시에 활성화할 수 있나요?
네. 가드는 조합 가능합니다 -- 23개 이상의 기본 가드를 동시에 원하는 조합으로 활성화할 수 있습니다. 예를 들어 Sol Payment, Start Date, Mint Limit, Bot Tax를 결합하여 시간 제한, 수량 제한, 봇 보호가 적용된 유료 민팅을 만들 수 있습니다.

### 모든 아이템이 민팅된 후 Core Candy Machine은 어떻게 되나요?
모든 아이템이 민팅된 후 Candy Machine을 [삭제(철회)](/ko/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)하여 온체인 임대료를 회수할 수 있습니다. 민팅된 Core Asset은 온체인에 남아 있으며 삭제의 영향을 받지 않습니다.

### Core Candy Machine에 별도의 Candy Guard 계정이 필요한가요?
실질적으로 그렇습니다. [Candy Guard](/ko/smart-contracts/core-candy-machine/guards) 계정은 민팅 규칙(결제, 타이밍, 허용 목록, 봇 보호)을 시행하는 역할을 합니다. 이것이 없으면 누구나 언제든지 무료로 민팅할 수 있습니다. Candy Guard를 생성하고 민팅 권한으로 설정하는 것이 표준 워크플로우입니다.

### 개발자가 커스텀 가드를 만들 수 있나요?
네. Candy Guard 프로그램은 포크 가능하도록 설계되었습니다. 개발자는 메인 Core Candy Machine 프로그램의 민팅 기능에 의존하면서 커스텀 가드 로직을 작성할 수 있습니다. 23개 이상의 기본 가드가 대부분의 사용 사례를 커버하지만, 커스텀 가드를 통해 프로젝트별 요구사항을 충족할 수 있습니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Core Candy Machine** | 아이템 메타데이터를 저장하고 온디맨드로 Core Asset을 민팅하는 온체인 Metaplex 프로그램 |
| **Candy Guard** | 조합 가능한 접근 제어 규칙(가드)으로 Candy Machine을 래핑하는 별도의 온체인 프로그램 |
| **가드** | 민팅 프로세스를 제한하거나 수정하는 단일 모듈형 규칙 (예: 결제, 타이밍, 허용 목록) |
| **가드 그룹** | 다양한 청중에게 서로 다른 민팅 조건을 적용하는 명명된 가드 구성 세트 |
| **아이템** | 민팅 전 Candy Machine에 로드되는 이름과 메타데이터 URI 쌍 |
| **Core Asset** | Metaplex Core NFT -- 내장 플러그인 지원을 가진 단일 계정 디지털 자산 |
| **민팅 권한** | 민팅을 트리거할 수 있는 권한이 있는 계정; 일반적으로 Candy Guard 계정으로 설정됨 |
| **컬렉션** | Candy Machine에서 민팅된 모든 자산에 할당된 온체인 컬렉션 주소 |

## 다음 단계

1. **[SDK 설정](/ko/smart-contracts/core-candy-machine/sdk)** -- JavaScript 또는 Rust를 선택하고 SDK를 설치
2. **[Core Candy Machine 생성](/ko/smart-contracts/core-candy-machine/create)** -- 설정을 구성하고 배포
3. **[아이템 삽입](/ko/smart-contracts/core-candy-machine/insert-items)** -- 머신에 자산 메타데이터 로드
4. **[가드 구성](/ko/smart-contracts/core-candy-machine/guards)** -- 결제, 타이밍, 접근 규칙 설정
5. **[Core Asset 민팅](/ko/smart-contracts/core-candy-machine/mint)** -- 민팅 플로우 이해
