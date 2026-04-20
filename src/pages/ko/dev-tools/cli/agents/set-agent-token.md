---
title: 에이전트 토큰
metaTitle: 에이전트 토큰 | Metaplex CLI
description: Metaplex CLI를 사용하여 등록된 에이전트의 토큰을 생성하고 에이전트 ID에 연결합니다.
keywords:
  - agent token
  - agents set-agent-token
  - mplx agents set-agent-token
  - genesis launch agent
  - agent bonding curve
  - Metaplex CLI
about:
  - Agent token creation
  - Agent token linking
  - Genesis integration
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a token launch linked to the agent using genesis launch create with --agentMint and --agentSetToken to permanently link the token
  - Or create a launch without --agentSetToken, then link it manually with agents set-agent-token
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 에이전트 토큰을 설정한 후 변경할 수 있나요?
    a: 아니요. 각 에이전트 ID는 하나의 토큰만 가질 수 있으며, 한 번만 설정할 수 있습니다. 이 작업은 되돌릴 수 없습니다.
  - q: --agentSetToken과 set-agent-token의 차이점은 무엇인가요?
    a: 동일한 작업을 수행합니다. --agentSetToken은 런칭 생성 시 한 단계로 토큰을 연결합니다. set-agent-token은 런칭 후 별도로 연결하며, asset-signer 모드가 필요합니다.
  - q: set-agent-token에 asset-signer 모드가 필요한 이유는 무엇인가요?
    a: set-agent-token 명령어는 Asset Signer PDA를 권한으로 사용합니다. asset-signer 모드는 CLI가 이 PDA를 자동으로 파생하고 사용하도록 구성합니다.
---

{% callout title="수행할 작업" %}
등록된 에이전트의 토큰을 생성하고 에이전트 ID에 연결합니다:
- **단일 단계**: `--agentMint` 및 `--agentSetToken`을 사용하여 에이전트에 연결된 본딩 커브 런칭 생성
- **2단계**: 토큰 런칭을 별도로 생성한 후 `agents set-agent-token`으로 연결
{% /callout %}

## 요약

에이전트 토큰은 등록된 [에이전트 ID](/agents)에 영구적으로 연결된 [Genesis](/smart-contracts/genesis) 토큰입니다. 에이전트 토큰을 생성하고 연결하는 두 가지 방법이 있습니다 — 런칭 생성 시 단일 단계 흐름 또는 2단계 수동 흐름.

- **단일 단계** (권장): `genesis launch create --agentMint <ASSET> --agentSetToken`
- **2단계**: 런칭을 생성한 후 `agents set-agent-token`으로 연결
- **되돌릴 수 없음**: 각 에이전트 ID는 하나의 토큰만 가질 수 있으며, 한 번만 설정할 수 있습니다

## 빠른 시작

**바로 가기:** [단일 단계: 에이전트와 함께 런칭](#단일-단계-에이전트와-함께-런칭) · [2단계: 수동 연결](#2단계-수동-연결) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## 단일 단계: 에이전트와 함께 런칭

에이전트 토큰을 생성하는 가장 간단한 방법은 런칭 생성 시 `--agentMint`를 전달하는 것입니다. 이렇게 하면 에이전트의 [Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets)에서 창작자 수수료 지갑을 자동으로 파생하고, 선택적으로 동일한 트랜잭션에서 토큰을 연결합니다.

```bash {% title="에이전트 토큰이 포함된 본딩 커브 생성" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_MINT> \
  --agentSetToken
```

{% callout type="warning" title="--agentSetToken은 되돌릴 수 없음" %}
`--agentSetToken`은 런칭된 토큰을 에이전트에 영구적으로 연결합니다. 연결 없이 런칭하려면 이 플래그를 생략하고 나중에 `agents set-agent-token`으로 연결하세요.
{% /callout %}

런칭풀 런칭에서도 작동합니다:

```bash {% title="에이전트와 함께 런칭풀" %}
mplx genesis launch create \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_MINT> \
  --agentSetToken \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

전체 세부 사항은 [런칭 (API) — 에이전트 런칭](/dev-tools/cli/genesis/launch#agent-launches)을 참조하세요.

## 2단계: 수동 연결

`--agentSetToken` 없이 토큰 런칭을 생성한 경우, `agents set-agent-token`을 사용하여 나중에 연결할 수 있습니다. 이 방법은 [asset-signer 지갑 모드](/dev-tools/cli/config/asset-signer-wallets)가 필요합니다.

### 1단계: Asset-Signer 지갑 구성

```bash {% title="asset-signer 지갑 설정" %}
mplx config wallets add --name my-agent --agent <AGENT_MINT>
mplx config wallets set my-agent
```

### 2단계: 토큰 연결

```bash {% title="에이전트에 Genesis 토큰 연결" %}
mplx agents set-agent-token <AGENT_MINT> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="되돌릴 수 없음" %}
각 에이전트 ID는 하나의 토큰만 가질 수 있으며, 한 번만 설정할 수 있습니다. 이 명령어를 실행하기 전에 두 주소를 다시 확인하세요.
{% /callout %}

### 출력

```text {% title="예상 출력" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Genesis Account: <genesis_account_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 전체 예시

```bash {% title="에이전트 등록 및 토큰 런칭" %}
# 1. 새 에이전트 등록
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# 출력에서 에셋 주소를 기록하세요

# 2. 에이전트에 연결된 본딩 커브 토큰 런칭
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_MINT> --agentSetToken

# 3. 에이전트에 토큰이 연결되어 있는지 확인
mplx agents fetch <AGENT_MINT>
```

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Agent token already set | 토큰을 두 번째로 설정하려고 시도함 | 각 에이전트 ID는 하나의 토큰만 가질 수 있습니다 — 되돌릴 수 없습니다 |
| Agent is not owned by the connected wallet | API가 새로 등록된 에이전트를 아직 인덱싱하지 않음 | 약 30초 기다린 후 재시도하거나 `agents fetch`를 확인하세요 — 런칭은 성공했을 수 있습니다 |
| Not in asset-signer mode | asset-signer 지갑 구성 없이 `set-agent-token` 실행 | 먼저 asset-signer 지갑을 설정하세요 ([사전 요구 사항](#1단계-asset-signer-지갑-구성) 참조) |

## 참고 사항

- 단일 단계 흐름(`--agentMint --agentSetToken`)이 권장됩니다 — 단일 트랜잭션으로 모든 것을 처리합니다
- 2단계 흐름은 `set-agent-token` 명령어가 Asset Signer PDA를 권한으로 사용하기 때문에 asset-signer 모드가 필요합니다
- `set-agent-token`을 실행하기 전에 Genesis 계정이 이미 존재해야 합니다
- `--agentMint`를 사용할 때 창작자 수수료 지갑은 에이전트의 Asset Signer PDA에서 자동으로 파생됩니다

## FAQ

**에이전트 토큰을 설정한 후 변경할 수 있나요?**
아니요. 각 에이전트 ID는 하나의 토큰만 가질 수 있으며, 한 번만 설정할 수 있습니다. 이 작업은 되돌릴 수 없습니다.

**`--agentSetToken`과 `set-agent-token`의 차이점은 무엇인가요?**
동일한 작업을 수행합니다. `--agentSetToken`은 런칭 생성 시 한 단계로 토큰을 연결합니다. `set-agent-token`은 런칭 후 별도로 연결하며, asset-signer 모드가 필요합니다.

**`set-agent-token`에 asset-signer 모드가 필요한 이유는 무엇인가요?**
`set-agent-token` 명령어는 Asset Signer PDA를 권한으로 사용합니다. asset-signer 모드는 CLI가 이 PDA를 자동으로 파생하고 사용하도록 구성합니다.
