---
title: 개요
metaTitle: 에이전트 명령어 개요 | Metaplex CLI
description: Metaplex CLI(mplx)를 사용하여 온체인 에이전트 ID를 등록하고 관리하는 agents CLI 명령어 개요입니다.
keywords:
  - agents CLI
  - mplx agents
  - agent identity
  - agent registration
  - executive delegation
  - Metaplex CLI
  - Solana agents
about:
  - Agent identity registration
  - Executive delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
faqs:
  - q: mplx agents 명령어란 무엇인가요?
    a: mplx agents 명령어 그룹을 사용하면 MPL Core 에셋에 에이전트 ID를 등록하고, Genesis 토큰을 에이전트에 연결하며, 실행 위임을 관리할 수 있습니다 — 모두 터미널에서 가능합니다.
  - q: 실행자 프로필이란 무엇인가요?
    a: 실행자 프로필은 지갑이 등록된 에이전트로부터 실행 위임을 받을 수 있도록 하는 일회성 온체인 PDA입니다. 등록이 완료되면 실행자는 위임된 에이전트를 대신하여 트랜잭션에 서명할 수 있습니다.
  - q: Irys에 업로드하지 않고도 에이전트를 등록할 수 있나요?
    a: 네. 기본적으로 register 명령어는 스토리지를 자동으로 처리하는 Metaplex Agent API를 사용합니다. Irys는 온체인 직접 등록을 위해 --use-ix 플래그를 사용할 때만 필요합니다.
  - q: 에이전트 토큰을 설정한 후 변경할 수 있나요?
    a: 아니요. 에이전트 토큰은 set-agent-token 명령어를 사용하여 ID당 한 번만 설정할 수 있습니다. 이 작업은 되돌릴 수 없습니다.
---

{% callout title="다루는 내용" %}
에이전트 ID 관리를 위한 전체 CLI 참조:
- **등록**: MPL Core 에셋에 에이전트 ID 생성 및 등록
- **토큰 연결**: Genesis 토큰 런칭과 에이전트 ID 연결
- **실행 위임**: 등록된 에이전트를 대신하여 지갑이 행동하도록 권한 부여
{% /callout %}

## 요약

`mplx agents` 명령어를 사용하면 [MPL Core](/core) 에셋에 에이전트 ID를 등록하고, [Genesis](/smart-contracts/genesis) 토큰을 연결하며, 실행 위임을 관리할 수 있습니다 — 모두 터미널에서 가능합니다.

- **도구**: `agents` 명령어 그룹이 포함된 Metaplex CLI (`mplx`)
- **ID**: 각 에이전트 ID는 MPL Core 에셋으로부터 파생된 PDA로 저장됩니다
- **위임**: 실행자는 에이전트를 대신하여 트랜잭션에 서명하도록 권한을 부여받을 수 있습니다
- **토큰 연결**: Genesis 토큰을 에이전트 ID에 영구적으로 연결할 수 있습니다

**바로 가기:** [사전 요구 사항](#사전-요구-사항) · [일반 흐름](#일반-흐름) · [명령어 참조](#명령어-참조) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq) · [용어 설명](#용어-설명)

## 사전 요구 사항

- Metaplex CLI가 설치되어 `PATH`에 등록되어 있어야 합니다
- Solana 키페어 파일 (예: `~/.config/solana/id.json`)
- 트랜잭션 수수료를 위한 SOL
- `mplx config rpcs add`로 구성하거나 `-r`로 전달한 RPC 엔드포인트

설정 확인:

```bash {% title="CLI 확인" %}
mplx agents --help
```

## 일반 흐름

### 에이전트 ID 등록

`agents register`를 사용하여 단일 명령어로 MPL Core 에셋을 생성하고 에이전트 ID를 등록합니다. 기본적으로 Metaplex Agent API를 사용하므로 Irys 업로드가 필요하지 않습니다.

```bash {% title="에이전트 등록 (API 모드)" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

고급 워크플로우(기존 에셋, 커스텀 문서, 인터랙티브 위저드)의 경우, `--use-ix` 플래그를 사용하여 `registerIdentityV1` 명령어를 온체인에 직접 전송하세요. 전체 세부 사항은 [에이전트 등록](/dev-tools/cli/agents/register)을 참조하세요.

### Genesis 토큰 연결

에이전트를 등록하고 Genesis 토큰 런칭을 생성한 후, `set-agent-token`으로 연결하세요. 이렇게 하면 토큰과 에이전트 ID가 영구적으로 연결됩니다.

```bash {% title="에이전트에 Genesis 토큰 연결" %}
mplx agents set-agent-token <AGENT_MINT> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="되돌릴 수 없음" %}
각 에이전트 ID는 하나의 토큰만 가질 수 있으며, 에이전트 토큰은 한 번만 설정할 수 있습니다. 이 작업은 취소할 수 없습니다.
{% /callout %}

### 실행 위임 설정

실행 위임을 통해 지갑이 등록된 에이전트를 대신하여 트랜잭션에 서명할 수 있습니다:

1. **실행자 프로필 등록** (지갑당 일회성):
```bash {% title="실행자 프로필 등록" %}
mplx agents executive register
```

2. **에이전트를 실행자에게 위임** (에셋 소유자가 실행):
```bash {% title="실행 위임" %}
mplx agents executive delegate <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

3. **위임 철회** (소유자 또는 실행자가 실행):
```bash {% title="위임 철회" %}
mplx agents executive revoke <AGENT_MINT>
```

전체 세부 사항은 [실행 위임](/dev-tools/cli/agents/executive)을 참조하세요.

## 명령어 참조

| 명령어 | 설명 |
|--------|------|
| [`agents register`](/dev-tools/cli/agents/register) | MPL Core 에셋에 에이전트 ID 등록 |
| [`agents fetch`](/dev-tools/cli/agents/fetch) | 에이전트 ID 데이터 조회 및 표시 |
| [`agents set-agent-token`](/dev-tools/cli/agents/set-agent-token) | 등록된 에이전트에 Genesis 토큰 연결 |
| [`agents executive register`](/dev-tools/cli/agents/executive) | 현재 지갑의 실행자 프로필 생성 |
| [`agents executive delegate`](/dev-tools/cli/agents/executive) | 에이전트를 대신하여 실행자에게 권한 부여 |
| [`agents executive revoke`](/dev-tools/cli/agents/executive) | 실행 위임 제거 |

## 참고 사항

- 에이전트 ID는 [Agent Registry](/agents) 프로그램을 통해 MPL Core 에셋으로부터 파생된 PDA로 저장됩니다
- 기본 등록 흐름은 Metaplex Agent API를 사용합니다 — 온체인 직접 등록에는 `--use-ix`를 사용하세요
- `set-agent-token`은 지갑이 asset-signer 모드에 있어야 합니다 — [Asset-Signer 지갑](/dev-tools/cli/config/asset-signer-wallets)을 참조하세요
- 각 명령어의 전체 플래그 문서를 보려면 `mplx agents <command> --help`를 실행하세요
- 개념, 아키텍처, SDK 가이드는 [Agent Kit 문서](/agents)를 참조하세요

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| No agent identity found | 에셋이 에이전트로 등록되어 있지 않음 | 먼저 `agents register`로 에셋을 등록하세요 |
| Agent token already set | 토큰을 두 번째로 설정하려고 시도함 | 에이전트 토큰은 ID당 한 번만 설정 가능 — 되돌릴 수 없습니다 |
| Executive profile already exists | 동일한 지갑에서 `executive register`를 두 번 호출함 | 각 지갑은 하나의 실행자 프로필만 가질 수 있습니다 — 이미 설정되어 있습니다 |
| Not the asset owner | 소유자가 아닌 지갑에서 위임을 시도함 | 에셋 소유자만 실행을 위임할 수 있습니다 |
| Delegation not found | 존재하지 않는 위임을 철회하려고 시도함 | 에이전트와 실행자 주소가 올바른지 확인하세요 |

## FAQ

**mplx agents 명령어란 무엇인가요?**
`mplx agents` 명령어 그룹을 사용하면 MPL Core 에셋에 에이전트 ID를 등록하고, Genesis 토큰을 에이전트에 연결하며, 실행 위임을 관리할 수 있습니다 — 모두 터미널에서 가능합니다.

**실행자 프로필이란 무엇인가요?**
실행자 프로필은 지갑이 등록된 에이전트로부터 실행 위임을 받을 수 있도록 하는 일회성 온체인 PDA입니다. 등록이 완료되면 실행자는 위임된 에이전트를 대신하여 트랜잭션에 서명할 수 있습니다.

**Irys에 업로드하지 않고도 에이전트를 등록할 수 있나요?**
네. 기본적으로 `register` 명령어는 스토리지를 자동으로 처리하는 Metaplex Agent API를 사용합니다. Irys는 온체인 직접 등록을 위해 `--use-ix` 플래그를 사용할 때만 필요합니다.

**에이전트 토큰을 설정한 후 변경할 수 있나요?**
아니요. 에이전트 토큰은 `set-agent-token` 명령어를 사용하여 ID당 한 번만 설정할 수 있습니다. 이 작업은 되돌릴 수 없습니다.

**API와 직접 IX 등록 경로의 차이점은 무엇인가요?**
API 경로(기본값)는 단일 API 호출로 Core 에셋을 생성하고 ID를 등록하며 Irys 업로드가 필요하지 않습니다. 직접 IX 경로(`--use-ix`)는 `registerIdentityV1` 명령어를 온체인에 직접 전송하며, 기존 에셋, 커스텀 문서 워크플로우, 또는 인터랙티브 위저드에 필요합니다.

## 용어 설명

| 용어 | 정의 |
|------|------|
| **에이전트 ID (Agent Identity)** | MPL Core 에셋으로부터 파생된 온체인 PDA로, 에이전트의 등록 데이터, 라이프사이클 훅, 토큰 연결을 저장합니다 |
| **실행자 프로필 (Executive Profile)** | 지갑을 위한 일회성 온체인 PDA로, 실행 위임을 받기 전에 필요합니다 |
| **실행 위임 (Execution Delegation)** | 등록된 에이전트와 실행자 프로필 간의 에셋별 연결로, 실행자가 에이전트를 대신하여 트랜잭션에 서명할 수 있게 합니다 |
| **Asset Signer PDA** | Core 에셋으로부터 파생된 PDA로 에이전트의 내장 지갑 역할을 합니다 — `set-agent-token`에 사용됩니다 |
| **등록 문서 (Registration Document)** | 에이전트의 이름, 설명, 이미지, 서비스, 신뢰 모델이 포함된 JSON 문서 — 업로드되어 ID URI로 저장됩니다 |
