---
title: MPL-3643 — RWA를 위한 허가형 토큰 표준
metaTitle: MPL-3643 — Solana의 RWA용 허가형 토큰 표준 | Metaplex
description: MPL-3643은 mpl-permission 온체인 프로그램 모음을 통해 구현된 Solana의 ERC-3643 대응 표준입니다. Token-2022, Token ACL(sRFC 37), Solana Attestation Service 위에 구축되어 허가형 토큰의 발행, 관리, 전송을 지원합니다.
created: '08-22-2026'
updated: '09-28-2026'
keywords:
  - MPL-3643
  - mpl-permission
  - tokenized securities
  - real world assets
  - RWA Solana
  - ERC-3643 Solana
  - T-REX Solana
  - compliance standard
  - permissioned token
  - Token-2022
  - Token ACL
  - sRFC 37
  - Solana Attestation Service
  - identity registry
  - KYC on-chain
  - security token
about:
  - Tokenized securities
  - On-chain compliance
  - MPL-3643
proficiencyLevel: Intermediate
faqs:
  - q: MPL-3643이란 무엇인가요?
    a: MPL-3643은 토큰화 증권과 같은 RWA를 위해 특별히 설계된 Solana의 허가형 토큰 온체인 표준으로, ERC-3643에 상응하는 프레임워크이며 mpl-permission 프로그램 모음을 통해 구현되었습니다. Token-2022, Token ACL(sRFC 37), Solana Attestation Service 위에 네 개의 Metaplex 프로그램(Identity Registry, Compliance Module, Gate, Lifecycle Manager)으로 구성됩니다.
  - q: MPL-3643은 새로운 토큰 프로그램인가요?
    a: 아닙니다. MPL-3643 토큰은 표준 Token-2022 민트이며, 컴플라이언스는 토큰을 대체하는 것이 아니라 그 위에 있는 계층입니다. 지갑, 익스플로러, DEX는 기존 Token-2022 지원을 통해 통합됩니다. 지원 수준은 transfer hook 등 민트가 사용하는 확장에 대한 각 플랫폼의 처리 방식과 허가형 자산에 대한 자체 정책에 따라 달라집니다.
  - q: MPL-3643은 ERC-3643과 어떤 관계인가요?
    a: MPL-3643은 ERC-3643의 Solana 대응 표준으로, 아이덴티티·컴플라이언스·토큰 계층을 분리하는 동일한 아키텍처를 유지하면서 각 계층을 Solana 프리미티브로 구축합니다. Token-2022가 토큰을 제공하고, Token ACL과 Gate Program이 ERC-3643의 컴플라이언스 콜백 역할을 수행하며, 지갑에 연결된 Claim 계정이 Ethereum에서 ONCHAINID가 하는 역할을 담당합니다. Claim은 Solana Attestation Service 어테스테이션으로 뒷받침되거나 신뢰된 어테스터가 직접 부여할 수 있습니다.
  - q: 사용자는 토큰마다 KYC를 완료해야 하나요?
    a: 각 오퍼링이 자체적으로 입장 결정을 내립니다. 발행사가 기반 KYC 데이터에 접근해야 하는 경우, MPL-3643은 재사용 가능한 KYC 제공자와 함께 사용하도록 설계되어 투자자의 동의 하에 기존 검증 결과가 새 발행사에 공유됩니다. 기반 데이터에 접근할 필요가 없는 발행의 경우, 공유된 온체인 어테스테이션에 의존하는 더 간단한 경로가 있으며, 이는 검증을 수행한 어테스테이션 제공자를 신뢰하는 것을 의미합니다.
  - q: 모든 MPL-3643 전송에 추가 컴퓨트 비용이 발생하나요?
    a: 발행사가 전송별 집행을 선택한 경우에만 발생합니다. 경계 전용(boundary-only) 토큰은 동결 해제 시점과 무허가 재동결을 통해 컴플라이언스를 집행하므로, 동결 해제 후의 전송은 추가 오버헤드가 없는 일반 Token-2022 전송입니다.
  - q: 발행사가 토큰을 압류하거나 회수할 수 있나요?
    a: 민트가 복구 기능을 선택한 경우에만 가능합니다. 복구가 활성화된 민트는 Token-2022의 permanent delegate를 Lifecycle Manager PDA로 설정하며, 이 PDA는 제안자와 승인자 역할 분리, 타임락, 제한된 실행 기간, 요청별 대상과 수량을 요구하는 가드레일이 적용된 명령을 통해서만 서명할 수 있습니다.
  - q: MPL-3643은 메인넷에서 사용할 수 있나요?
    a: 네. MPL-3643은 Solana 메인넷에서 얼리 액세스로 운영 중입니다. https://form.typeform.com/to/AgllGJaz 에서 알파 액세스를 신청하세요.
---

**MPL-3643**은 Solana에서 **허가형 토큰**의 발행, 관리, 전송을 지원하는 온체인 프로그램 모음입니다. Solana의 [ERC-3643](https://www.erc3643.org/) 대응 표준으로, **mpl-permission** 프로그램을 통해 구현되었습니다. 사전에 정의된 조건을 충족하는 사용자만 토큰 보유자가 될 수 있도록 보장하므로, 증권, 부동산, 사모 펀드 등 실물 가치를 나타내는 디지털 자산에 이상적입니다. 컴플라이언스는 표준 **Token-2022** 토큰 위의 계층이며, 새로운 토큰 유형이 아닙니다. {% .lead %}

MPL-3643은 Solana 메인넷에서 얼리 액세스로 운영 중입니다 — [알파 액세스를 신청](https://form.typeform.com/to/AgllGJaz)하여 개발을 시작하세요.

{% callout type="warning" title="감사 상태" %}
MPL-3643은 감사를 받지 않았습니다. Metaplex와 협의 없이 실물 자산을 수탁하지 마세요.
{% /callout %}

## 요약

MPL-3643은 Token-2022, Token ACL(sRFC 37), Solana Attestation Service 위에 구축된 네 개의 Metaplex 프로그램으로 구성되어, 발행사가 발행사별 커스텀 코드가 아닌 온체인 프로그램으로 적격성 규칙이 집행되는 허가형 토큰을 출시할 수 있게 합니다.

- **표준과 구현** — MPL-3643은 표준의 이름이고, **mpl-permission**은 코드의 이름입니다. 리포지토리, npm 패키지, Rust 크레이트는 모두 `mpl-permission` 접두사를 사용합니다.
- **표준 토큰 + 계층화된 컴플라이언스** — MPL-3643 토큰은 커스텀 토큰 프로그램이 아닌 Token-2022 민트이므로, 지갑, 익스플로러, DEX는 기존 Token-2022 지원을 통해 통합됩니다. 지원 수준은 transfer hook 등 민트가 사용하는 확장에 대한 각 플랫폼의 처리 방식과 허가형 자산에 대한 자체 정책에 따라 달라집니다.
- **네 개의 프로그램** — Identity Registry, Compliance Module, Gate, Lifecycle Manager. 각각 독립적으로 감사할 수 있습니다.
- **재사용 가능한 검증** — 이 표준은 재사용 가능한 KYC 제공자와 함께 사용하도록 설계되었습니다. 투자자의 동의 하에 기존 검증 결과가 오프체인으로 새 발행사에 공유되어, 투자자는 서류 제출을 반복하지 않아도 되고 각 발행사는 자체 데이터 관리, 규제 책임, 온체인 클레임을 유지합니다.
- **얼리 액세스** — 메인넷에서 운영 중입니다. [알파 액세스를 신청](https://form.typeform.com/to/AgllGJaz)하여 개발을 시작하세요. [상태 및 제공 현황](#상태-및-제공-현황)을 참조하세요.

## MPL-3643의 대상 사용자

MPL-3643은 네 부류의 사용자를 지원하며, 각각 진입점이 다릅니다. [시작하기](/ko/smart-contracts/mpl-3643/getting-started)부터 시작하세요.

| 대상 | 하는 일 |
|---|---|
| **RWA 발행사** | 허가형 토큰 출시 및 관리 — 관할권, 락업 등의 사전 조건 |
| **통합 개발자** | MPL-3643 토큰을 다루는 지갑, 거래소, 앱 구축 |
| **KYC 제공자** | 투자자를 적격하게 만드는 어테스테이션 발급 |
| **지갑·거래소 통합자** | 동결된 계정, 동결 해제 흐름, 거부 사유를 사용자에게 표시 |

## MPL-3643이 해결하는 문제

Token-2022, Token ACL, Solana Attestation Service는 이미 허가형 토큰을 위한 프리미티브를 제공하지만, 이를 컴플라이언스 우선 시스템으로 조립하는 것은 없습니다. 오늘날 Solana에서 규제 대상 토큰을 발행하는 모든 발행사는 그 조립을 처음부터 직접 작성합니다.

MPL-3643은 빠져 있던 조각들을 제공합니다:

- 아이덴티티와 컴플라이언스 상태를 확인하여 sRFC 37 게이트 인터페이스를 구현하는 **Gate 프로그램**.
- 어테스테이션을 토큰별 요구 사항에 매핑하는 **레지스트리** — "이 토큰에는 신뢰할 수 있는 제공자의 KYC와 적격 투자자 인증이 필요하다"는 식의 정의.
- **구성 가능한 규칙 엔진** — 보유자 수 상한, 관할권 목록, 락업, 거래량 제한 — 발행사별 커스텀 코드 없이 온체인에서 집행.
- **라이프사이클 인프라** — 베스팅, 기업 행위(corporate action), 가드레일이 적용된 복구 — 컴플라이언스 상태와 연동.

## MPL-3643 아키텍처

MPL-3643은 기존 Solana 컴포넌트 세 개 위에 계층화된 네 개의 Metaplex 프로그램입니다. 아이덴티티, 컴플라이언스 규칙, 동결 권한은 별도 프로그램의 별도 관심사이므로 각각 독립적으로 감사하고 업그레이드할 수 있습니다.

{% diagram height="h-[620px]" %}

{% node %}
{% node #sdk label="mpl-permission TypeScript SDK" theme="blue" /%}
{% node label="토큰 프로필, 원콜 토큰 출시" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="-320" %}
{% node #identity label="Identity Registry" theme="blue" /%}
{% node label="Claim, TrustedAttestor, TokenTrustScope" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="0" %}
{% node #compliance label="Compliance Module" theme="blue" /%}
{% node label="경계 및 전송별 규칙 모듈" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="320" %}
{% node #lifecycle label="Lifecycle Manager" theme="blue" /%}
{% node label="수익, 베스팅, 기업 행위, 복구" theme="dimmed" /%}
{% /node %}

{% node parent="compliance" y="150" x="-160" %}
{% node #gate label="Gate Program" theme="crimson" /%}
{% node label="sRFC 37 게이트 인터페이스 구현" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="-180" %}
{% node #tokenacl label="Token ACL (sRFC 37)" theme="slate" /%}
{% node label="민트의 동결 권한 보유" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="200" %}
{% node #sas label="Solana Attestation Service" theme="slate" /%}
{% node label="실시간 KYC 어테스테이션" theme="dimmed" /%}
{% /node %}

{% node parent="tokenacl" y="140" x="140" %}
{% node #t22 label="Token-2022 Mint" theme="slate" /%}
{% node label="DefaultAccountState = Frozen" theme="dimmed" /%}
{% /node %}

{% edge from="sdk" to="identity" /%}
{% edge from="sdk" to="compliance" /%}
{% edge from="sdk" to="lifecycle" /%}
{% edge from="gate" to="identity" label="아이덴티티 확인" /%}
{% edge from="gate" to="compliance" label="적격성/재동결 확인" /%}
{% edge from="tokenacl" to="gate" label="CPI" /%}
{% edge from="identity" to="sas" label="실시간 어테스테이션 조회" /%}
{% edge from="tokenacl" to="t22" label="동결/동결 해제" /%}

{% /diagram %}

**다이어그램 설명:** mpl-permission TypeScript SDK는 Identity Registry, Compliance Module, Lifecycle Manager 세 프로그램 위에 위치합니다. Gate Program은 Compliance Module 아래에 위치하며 Identity Registry(아이덴티티 검증)와 Compliance Module(보유 적격성 및 재동결 확인)을 모두 호출합니다. Token ACL은 민트의 동결 권한을 보유하고 모든 동결·동결 해제 결정을 위해 Gate Program을 크로스 프로그램 호출합니다. Identity Registry는 Solana Attestation Service에서 실시간 어테스테이션을 읽습니다. 민트에 대해 Token-2022의 동결·동결 해제 명령을 호출하는 것은 Token ACL뿐이며, 해당 계정들은 `DefaultAccountState`에 의해 생성 시 동결됩니다.

### 프로그램별 책임

각 MPL-3643 프로그램은 정확히 하나의 관심사만 담당합니다.

| 프로그램 | 담당 영역 |
|---|---|
| **Identity Registry** | 클레임, 신뢰된 어테스터, 토큰별 트러스트 스코프 |
| **Compliance Module** | 오퍼링 규칙 — 보유자 수 상한, 국가, 락업, 거래량, 블랙아웃 |
| **Gate Program** | 아이덴티티 + 컴플라이언스를 두 개의 sRFC 37 진입점으로 조합 |
| **Lifecycle Manager** | 수익, 베스팅, 기업 행위, 가드레일이 적용된 복구 |

### 컴플라이언스 모듈

발행사는 컴플라이언스 모듈 메뉴에서 토큰별 정책을 구성하며, 각 모듈을 독립적으로 활성화하고 설정합니다. MPL-3643은 활발히 개발 중이므로 모듈 구성은 출시 전에 변경될 수 있습니다.

| 모듈 | 집행하는 규칙 |
|---|---|
| **Country** | 거주지 클레임의 국가를 기준으로 보유자를 허용 또는 거부 목록으로 관리 |
| **Holder cap** | 총 보유자 수 제한 |
| **Investor cap** | 연결된 지갑들을 한 명의 투자자로 계산하여 고유 투자자 수 제한 |
| **Lockup** | 새로 취득한 토큰을 전송 가능해지기 전까지 시간 잠금 |
| **Affiliate volume** | 지정된 보유자의 전송량 제한 |
| **Blackout** | 예정된 기간 동안 전송 중단 |
| **Jurisdiction pair** | 특정 국가 쌍 간의 전송 제한 |
| **Venue** | 승인된 거래소로 거래 제한 |

### 클레임 토픽

아이덴티티 클레임은 **토픽**별로 구성됩니다. 토픽은 신뢰된 어테스터가 지갑에 대해 주장할 수 있는 사실의 어휘입니다. 현재 정의된 토픽에는 KYC, AML, 거주지, 적격 투자자 인증, 제재 스크리닝과 함께 특정 모듈이 내부적으로 사용하는 분류 토픽이 있습니다. 각 토큰의 트러스트 정책은 요구하는 토픽을 지정하고, 각 신뢰된 어테스터는 토픽별로 승인됩니다. 토픽 공간은 확장 가능합니다. 새로운 합격/불합격 적격성 라벨은 프로그램 변경이 아닌 설정 변경으로 추가할 수 있습니다. 모듈 구성과 마찬가지로 현재 정의된 토픽은 출시 전에 다듬어질 수 있습니다.

### Metaplex와 발행사의 역할

Metaplex는 인프라를 제공하고, 발행사는 자신의 토큰에 대한 정책을 설정합니다.

- **Metaplex는 온체인 인프라를 제공합니다.** Metaplex는 MPL-3643을 구동하는 네 개의 프로그램을 배포·유지하고 글로벌 신뢰된 어테스터 목록을 관리합니다. MPL-3643은 사용자가 토큰을 보유하기 위한 발행사의 사전 조건을 집행합니다.
- **발행사는 정책 운영자입니다.** 각 발행사는 자체 `ComplianceConfig`를 생성하고, 활성화할 모듈을 선택하고, 모듈 매개변수를 설정하고, 토큰별 트러스트 스코프를 통해 수용할 KYC 제공자를 선택하고, 소유자 키를 관리합니다. 토큰 자체와 그 컴플라이언스 태세에 대한 책임은 발행사에 있습니다.

{% callout type="note" title="MPL-3643은 설정을 집행할 뿐, 컴플라이언스를 보장하지 않습니다" %}
이 페이지들은 프로그램이 집행하는 내용을 설명합니다. 특정 설정이 적용 규제를 충족하는지는 발행사와 그 법률 자문이 판단할 문제입니다.
{% /callout %}

## ERC-3643에서 MPL-3643으로의 구성 요소 매핑

MPL-3643은 ERC-3643의 관심사 분리를 유지하면서 각 Ethereum 컨트랙트를 Solana 프리미티브로 대체합니다.

| ERC-3643 구성 요소 | MPL-3643 대응물 |
|---|---|
| 토큰 컨트랙트(ERC-20) | Token ACL(sRFC 37)에 연결된 Token-2022 민트 |
| Identity Registry | Identity Registry 프로그램 |
| Identity Registry Storage | Identity Registry의 지갑에 연결된 `Claim` 계정 |
| ONCHAINID | 지갑에 연결된 `Claim` 계정. Solana Attestation Service 어테스테이션으로 뒷받침되거나 신뢰된 어테스터가 직접 부여 |
| Trusted Issuers Registry | Identity Registry의 `TrustedAttestor` 계정 |
| Claim Topics Registry | 토큰별로 설정되는 토큰 트러스트 스코프의 필수 토픽 |
| Compliance Module | Compliance Module 프로그램 + sRFC 37 Gate Program |
| Agent 역할 | 프로그램별 `RoleGrant` PDA를 통한 `owner` / `operator` / `agent` 역할 |

구조상 유일한 차이점: ERC-3643은 토큰의 `transfer()` 내부에서 컴플라이언스를 확인합니다. Solana에는 일반 전송에 대한 동등한 훅이 없으므로, MPL-3643은 **동결과 동결 해제** 시점에 적격성을 집행합니다 — 계정은 생성 시 동결되며 컴플라이언스를 충족하는 지갑만 동결을 해제할 수 있습니다. 락업이나 거래량 제한처럼 모든 전송마다 평가해야 하는 일부 컴플라이언스 모듈은 전송별 확인이 필요하며, 이는 Token-2022 transfer hook을 통해 집행됩니다.

## 일반 Token-2022 민트와의 차이점

MPL-3643이 바꾸는 것은 토큰을 보유할 수 있는 사람이지, 토큰 자체의 이동 방식이 아닙니다.

| | 일반 Token-2022 민트 | MPL-3643 토큰 |
|---|---|---|
| 토큰 계정 초기 상태 | 동결 해제됨 | 동결됨(`DefaultAccountState = Frozen`) |
| 동결 권한 | 발행사 키 | Token ACL `MintConfig` PDA |
| 민트 권한 | 발행사 키 | 컴플라이언스 초기화 후 `ComplianceConfig` PDA |
| 동결 해제 가능자 | 동결 권한자 | 누구나 무허가로 — Gate Program이 결정 |
| 보유 가능자 | 누구나 | 아이덴티티 및 보유 적격성 확인을 통과한 지갑 |
| 전송별 비용 | 없음 | 경계 전용 토큰은 없음. 선택 시 transfer hook |

## 프로토콜 수수료

MPL-3643은 자산 구성, 보유자 계정 활성화, 분배 실행 시점에 SOL로 지급되는 고정 프로토콜 수수료를 부과합니다. 이체되는 가치, 조달 자본, 운용 자산에 대한 비율 수수료는 전혀 없습니다.

{% protocol-fees program="mpl-3643" showTitle=false /%}

모든 Metaplex 프로토콜 수수료의 최신 정보는 [프로토콜 수수료](/ko/protocol-fees) 페이지를 참조하세요.

## 빠른 참조

### 프로그램

| 프로그램 | 프로그램 이름 | 목적 |
|---|---|---|
| Identity Registry | `mpl-permission-identity-registry` | 클레임, 신뢰된 어테스터, 트러스트 스코프 |
| Compliance Module | `mpl-permission-compliance` | 경계 및 전송별 규칙 집행 |
| Gate Program | `mpl-permission-gate` | 동결 해제·동결 결정을 위한 sRFC 37 게이트 |
| Lifecycle Manager | `mpl-permission-lifecycle` | 수익, 베스팅, 기업 행위, 복구 |

### SDK

MPL-3643은 통합 TypeScript SDK(`@metaplex-foundation/mpl-permission`)와 Rust SDK(`mpl-permission`)를 제공하며, 각각 네 개의 프로그램을 위해 생성된 저수준 클라이언트로 뒷받침됩니다. SDK가 기본 인터페이스이며 출시 부트스트랩 순서를 자동으로 처리합니다. SDK는 [알파 온보딩](https://form.typeform.com/to/AgllGJaz)을 통해 제공됩니다.

### 외부 의존성

| 의존성 | MPL-3643에서의 역할 | 상태 |
|---|---|---|
| [Token-2022](https://spl.solana.com/token-2022) | 민트와 토큰 계정 | 메인넷 운영 중 |
| [Token ACL (sRFC 37)](https://solana.com/developers/guides/advanced/acl) | 민트의 동결 권한을 보유하고 Gate Program을 호출 | 메인넷·데브넷 운영 중, 소스 코드 감사 완료 |
| [Solana Attestation Service](https://attest.solana.com/) | 실시간 KYC 및 적격 투자자 인증 어테스테이션 | 메인넷 운영 중 |

## 상태 및 제공 현황

MPL-3643은 메인넷에서 얼리 액세스로 운영 중이며, 감사 전 단계입니다.

- **메인넷 얼리 액세스.** 네 개의 프로그램이 메인넷에 배포되어 알파 파트너와 함께 운영되고 있습니다([알파 액세스 신청](https://form.typeform.com/to/AgllGJaz)).
- **감사.** MPL-3643은 보안 감사를 받을 예정입니다. Metaplex의 프로그램 감사 방식과 취약점 보고 방법은 [보안](/ko/security)을 참조하세요.
- **Token ACL 의존성.** Token ACL(sRFC 37)은 운영 중이며 소스 코드가 감사되었습니다. MPL-3643은 출시 실사의 일환으로 바인딩하는 Token ACL 배포를 검증합니다.
- **안정성 수준.** MPL-3643은 [안정성 인덱스](/ko/stability-index)에 Experimental로 등재되어 있습니다.

## 참고 사항

- MPL-3643 토큰은 **Token-2022** 민트이며, 레거시 SPL Token 민트가 아닙니다. 통합 시 Token-2022 프로그램 ID를 사용해야 합니다.
- 경계 전용 토큰에는 transfer hook이 없으므로 동결 해제 후 전송에 MPL-3643 컴퓨트 비용이 발생하지 않습니다. 전송별 모듈을 사용하려면 Compliance Module의 Token-2022 transfer hook을 선택해야 하며, 기존 민트에 나중에 추가할 수 없습니다.
- 온체인 집행은 소수의 고정된 사실을 공개적으로 읽을 수 있게 만들지만, 그 어느 것도 직접 식별자를 포함하지 않습니다. 관할권 규칙의 적용을 받는 지갑은 ISO-3166 국가 코드를 기록한 거주지 클레임을 보유합니다 — 이는 해당 규칙을 자율적으로 집행하기 위한 트레이드오프이며 ERC-3643의 ONCHAINID와 동일한 선택입니다. 클레임은 토픽, 어테스터, 만료일을 공개하고, 투자자 수 상한을 선택한 토큰은 동일 투자자가 관리하는 지갑들을 연결합니다. 이름, 서류, 상세 KYC 결과는 오프체인에 남지만, 지갑에 연결된 레코드 자체는 공개되어 있어 다른 공개 체인 데이터와 마찬가지로 지갑과 소유자를 연결할 수 있는 관찰자에게는 개인 데이터가 될 수 있습니다.
- 컴플라이언스 초기화는 민트의 `MintTokens` 권한을 `ComplianceConfig` PDA로 되돌릴 수 없게 이전합니다. 원시 민트 권한이 필요한 모든 명령은 그 전에 실행되어야 합니다.
- Metaplex Foundation이 유지 관리합니다. 최종 확인 2026-09-28.

## FAQ

### MPL-3643이란 무엇인가요?

MPL-3643은 토큰화 증권과 같은 RWA를 위해 특별히 설계된 Solana의 허가형 토큰 온체인 표준으로, ERC-3643에 상응하는 프레임워크이며 **mpl-permission** 프로그램 모음을 통해 구현되었습니다. Token-2022, Token ACL(sRFC 37), Solana Attestation Service 위에 네 개의 Metaplex 프로그램 — Identity Registry, Compliance Module, Gate, Lifecycle Manager — 으로 구성됩니다. 개발자 산출물 — 리포지토리, npm 패키지, Rust 크레이트 — 은 `mpl-permission` 접두사를 사용합니다.

### MPL-3643은 새로운 토큰 프로그램인가요?

아닙니다. MPL-3643 토큰은 표준 Token-2022 민트이며, 컴플라이언스는 토큰을 대체하는 것이 아니라 그 위에 있는 계층입니다. 지갑, 익스플로러, DEX는 기존 Token-2022 지원을 통해 통합됩니다. 지원 수준은 transfer hook 등 민트가 사용하는 확장에 대한 각 플랫폼의 처리 방식과 허가형 자산에 대한 자체 정책에 따라 달라집니다.

### MPL-3643은 ERC-3643과 어떤 관계인가요?

MPL-3643은 ERC-3643의 Solana 대응 표준으로, 아이덴티티·컴플라이언스·토큰 계층을 분리하는 동일한 아키텍처를 유지하면서 각 계층을 Solana 프리미티브로 구축합니다. Token-2022가 토큰을 제공하고, Token ACL과 Gate Program이 ERC-3643의 컴플라이언스 콜백 역할을 수행하며, 지갑에 연결된 `Claim` 계정이 Ethereum에서 ONCHAINID가 하는 역할을 담당합니다. Claim은 Solana Attestation Service 어테스테이션으로 뒷받침되거나 신뢰된 어테스터가 직접 부여할 수 있습니다. [구성 요소 매핑](#erc-3643에서-mpl-3643으로의-구성-요소-매핑)을 참조하세요.

### 사용자는 토큰마다 KYC를 완료해야 하나요?

각 오퍼링이 자체적으로 입장 결정을 내립니다. 발행사가 기반 KYC 데이터에 접근해야 하는 경우, MPL-3643은 재사용 가능한 KYC 제공자와 함께 사용하도록 설계되어 있습니다. 투자자의 동의 하에 원래 검증 결과가 오프체인으로 새 발행사에 공유되므로 투자자는 서류를 다시 업로드하지 않아도 되고, 각 발행사는 자체 데이터 관리와 규제 책임을 유지합니다. 기반 데이터에 접근할 필요가 없는 발행의 경우, 공유된 온체인 어테스테이션에 의존하는 더 간단한 경로가 있으며, 이는 검증을 수행한 어테스테이션 제공자를 신뢰하는 것을 의미합니다. 어느 경로에서든 이름, 서류, 상세 KYC 결과는 오프체인에 남습니다. 공유되는 온체인 어테스테이션은 검증 통과 결과만을 기록하고, MPL-3643은 지갑, 클레임 토픽, 어테스터, 만료일과 같은 집행 메타데이터를 기록합니다. 다만 이 메타데이터는 지갑에 연결된 공개 정보이므로, 지갑과 소유자를 연결할 수 있는 사람에게는 여전히 개인 데이터가 될 수 있습니다.

### 모든 MPL-3643 전송에 추가 컴퓨트 비용이 발생하나요?

발행사가 전송별 집행을 선택한 경우에만 발생합니다. 경계 전용 토큰은 동결 해제 시점에, 그리고 무허가 재동결을 통해 지속적으로 컴플라이언스를 집행하므로, 동결 해제 후의 전송은 일반 Token-2022 전송입니다. Compliance Module의 transfer hook을 활성화한 토큰은 모든 전송마다 컴플라이언스 평가 비용을 지불합니다.

### 발행사가 토큰을 압류하거나 회수할 수 있나요?

민트가 복구 기능을 선택한 경우에만 가능합니다. 복구가 활성화된 민트는 Token-2022의 permanent delegate를, 개인 키가 없고 가드레일이 적용된 복구 명령을 통해서만 서명할 수 있는 Lifecycle Manager 프로그램 주소로 설정합니다 — 제안자와 승인자 역할 분리, 타임락, 제한된 실행 기간, 온체인 감사 추적, 요청별 대상 계정과 수량이 필수입니다. permanent delegate가 없는 민트는 전혀 회수할 수 없습니다.

### MPL-3643은 메인넷에서 사용할 수 있나요?

네. MPL-3643은 Solana 메인넷에서 얼리 액세스로 운영 중입니다. [알파 액세스를 신청](https://form.typeform.com/to/AgllGJaz)하여 시작하세요.

## 용어집

| 용어 | 정의 |
|---|---|
| **Attestation(어테스테이션)** | KYC 제공자가 Solana Attestation Service를 통해 발급하는 서명된 온체인 자격 증명. |
| **Boundary module(경계 모듈)** | 각 전송 시가 아니라 지갑이 적격성에 진입하거나 벗어나는 시점(동결 해제, 재동결, 민트, 소각)에 평가되는 컴플라이언스 규칙. |
| **Claim(클레임)** | 특정 지갑이 특정 신뢰된 어테스터로부터 특정 클레임 토픽을 보유하고 있음을 기록하는, 지갑에 연결된 Identity Registry 계정. |
| **Claim topic(클레임 토픽)** | KYC, 적격 투자자 인증, 보유자 역할 등 클레임의 종류를 나타내는 숫자 식별자. |
| **Cranker(크랭커)** | 컴플라이언스를 벗어난 계정을 재동결하거나 수익 인덱스를 진행시키는 무허가 호출자. |
| **Gate Program(게이트 프로그램)** | sRFC 37 게이트 인터페이스를 구현하고 모든 동결 해제·동결 결정에 응답하는 MPL-3643 프로그램. |
| **Per-transfer module(전송별 모듈)** | 모든 전송마다 Token-2022 transfer hook 내부에서 평가되는 컴플라이언스 규칙. |
| **Re-freeze(재동결)** | 이전에 동결 해제된 후 컴플라이언스를 벗어난 계정을 무허가로 동결하는 것. |
| **sRFC 37** | Token ACL과 무허가 동결·동결 해제를 위한 게이트 프로그램 인터페이스를 정의하는 Solana 표준. |
| **Token ACL** | 민트의 동결 권한을 보유하고 동결 또는 동결 해제 전에 게이트 프로그램에 문의하는 운영 중인 Solana 프로그램. |
| **Transfer envelope(전송 엔벨로프)** | MPL-3643 토큰을 이동하기 위해 통합자가 따라야 하는 준비, 전송, 마무리 시퀀스. |
| **Trust scope(트러스트 스코프)** | 토큰이 수용하는 신뢰된 어테스터와 요구하는 클레임 토픽을 지정하는 토큰별 계정. |
| **Trusted attestor(신뢰된 어테스터)** | 온체인에서 클레임을 부여하는 키의 소유자 — 일반적으로 토큰 발행사 — 로, Identity Registry에 전역적으로 등록되고 특정 클레임 토픽에 대해 승인됩니다. 검증을 수행하는 오프체인 KYC 제공자와는 구별됩니다. |
