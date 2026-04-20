---
title: 실행 위임
metaTitle: 실행 위임 | Metaplex CLI
description: Metaplex CLI를 사용하여 실행자 프로필을 등록하고 에이전트의 실행 위임을 관리합니다.
keywords:
  - agents executive
  - executive delegation
  - mplx agents executive
  - execution delegate
  - agent execution
  - Metaplex CLI
about:
  - Executive profile registration
  - Execution delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Register an executive profile with mplx agents executive register
  - Delegate an agent to the executive with mplx agents executive delegate
  - Optionally revoke a delegation with mplx agents executive revoke
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 실행자 프로필이란 무엇인가요?
    a: 지갑이 등록된 에이전트로부터 실행 위임을 받을 수 있도록 하는 지갑당 일회성 온체인 PDA입니다.
  - q: 지갑이 여러 개의 실행자 프로필을 가질 수 있나요?
    a: 아니요. 각 지갑은 하나의 실행자 프로필만 가질 수 있습니다. 등록은 일회성 작업입니다.
  - q: 위임을 철회할 수 있는 사람은 누구인가요?
    a: 에셋 소유자 또는 실행자 권한을 가진 사람 모두 위임을 철회할 수 있습니다.
---

{% callout title="수행할 작업" %}
등록된 에이전트의 실행 위임을 관리합니다:
- 실행자 프로필 등록 (지갑당 일회성)
- 에이전트 실행을 실행자 지갑에 위임
- 필요하지 않을 때 위임 철회
{% /callout %}

## 요약

`mplx agents executive` 명령어는 실행 위임을 관리합니다 — 지갑이 등록된 [에이전트](/agents)를 대신하여 트랜잭션에 서명하도록 권한을 부여합니다. 실행자는 프로필을 한 번 등록해야 하며, 그런 다음 [MPL Core](/core) 에셋 소유자가 실행을 위임할 수 있습니다.

- **등록**: 지갑당 일회성 실행자 프로필 생성
- **위임**: 등록된 에이전트를 실행자에게 연결 (소유자만 가능)
- **철회**: 위임 제거 (소유자 또는 실행자가 철회 가능)

**바로 가기:** [실행자 프로필 등록](#실행자-프로필-등록) · [실행 위임](#실행-위임-1) · [위임 철회](#위임-철회) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## 실행자 프로필 등록

`agents executive register` 명령어는 현재 지갑에 대한 일회성 온체인 실행자 프로필 PDA를 생성합니다. 이 프로필은 에이전트가 이 지갑에 [위임](/dev-tools/cli/agents/executive#실행-위임-1)되기 전에 필요합니다.

```bash {% title="실행자 프로필 등록" %}
mplx agents executive register
```

플래그나 인수가 필요하지 않습니다 — 프로필은 현재 서명자의 지갑으로부터 파생됩니다.

### 출력

```text {% title="예상 출력" %}
--------------------------------
  Executive Profile: <profile_pda_address>
  Authority: <wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 실행 위임

`agents executive delegate` 명령어는 등록된 에이전트를 실행자 프로필에 연결하여, 실행자가 에이전트를 대신하여 트랜잭션에 서명할 수 있게 합니다. 에셋 소유자만 실행을 위임할 수 있습니다.

```bash {% title="실행 위임" %}
mplx agents executive delegate <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

### 옵션

| 플래그 | 설명 | 필수 여부 |
|--------|------|-----------|
| `--executive <string>` | 실행자의 지갑 주소 (프로필 PDA는 자동으로 파생됨) | 예 |

{% callout type="note" %}
위임 전에 실행자가 `mplx agents executive register`로 프로필을 미리 등록해야 합니다.
{% /callout %}

### 출력

```text {% title="예상 출력" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Profile: <profile_pda_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 위임 철회

`agents executive revoke` 명령어는 실행 위임을 제거하고, 위임 레코드를 닫아 렌트를 환불합니다. 에셋 소유자 또는 실행자 권한을 가진 사람 모두 철회할 수 있습니다.

```bash {% title="위임 철회 (소유자로서)" %}
mplx agents executive revoke <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

```bash {% title="자신의 위임 철회 (실행자로서)" %}
mplx agents executive revoke <AGENT_MINT>
```

### 옵션

| 플래그 | 설명 | 필수 여부 | 기본값 |
|--------|------|-----------|--------|
| `--executive <string>` | 실행자의 지갑 주소 | 아니요 | 현재 서명자 |
| `--destination <string>` | 환불된 렌트를 받을 지갑 | 아니요 | 현재 서명자 |

### 출력

```text {% title="예상 출력" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Wallet: <executive_wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Executive profile already exists | `register`를 두 번째로 호출함 | 각 지갑은 하나의 프로필만 가질 수 있습니다 — 이미 등록되어 있습니다 |
| Not the asset owner | 소유자가 아닌 지갑에서 위임을 시도함 | 에셋 소유자만 실행을 위임할 수 있습니다 |
| Executive profile not found | 등록하지 않은 지갑에 위임하려고 시도함 | 실행자가 먼저 `agents executive register`를 실행해야 합니다 |
| Delegation not found | 존재하지 않는 위임을 철회하려고 시도함 | 에이전트 에셋과 실행자 주소를 확인하세요 |

## 참고 사항

- 실행자 프로필은 지갑당 일회성입니다 — 다시 등록하면 실패합니다
- 각 위임은 에셋별입니다: 실행자는 여러 에이전트에 위임될 수 있지만 각각 별도의 `delegate` 호출이 필요합니다
- `--executive` 없이 철회하는 경우, 명령어는 현재 서명자를 기본값으로 사용합니다 (실행자가 자신의 위임을 철회하는 경우)
- 닫힌 위임 레코드의 렌트는 `--destination` 지갑으로 환불됩니다 (기본값: 서명자)

## FAQ

**실행자 프로필이란 무엇인가요?**
지갑이 등록된 에이전트로부터 실행 위임을 받을 수 있도록 하는 지갑당 일회성 온체인 PDA입니다.

**지갑이 여러 개의 실행자 프로필을 가질 수 있나요?**
아니요. 각 지갑은 하나의 실행자 프로필만 가질 수 있습니다. 등록은 일회성 작업입니다.

**위임을 철회할 수 있는 사람은 누구인가요?**
에셋 소유자 또는 실행자 권한을 가진 사람 모두 위임을 철회할 수 있습니다. 실행자가 철회하는 경우 `--executive`를 생략할 수 있습니다 (현재 서명자가 기본값).
