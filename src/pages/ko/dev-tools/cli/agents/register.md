---
title: 에이전트 등록
metaTitle: 에이전트 등록 | Metaplex CLI
description: Metaplex CLI를 사용하여 MPL Core 에셋에 에이전트 ID를 등록합니다.
keywords:
  - agents register
  - agent identity
  - mplx agents register
  - agent registration
  - Metaplex CLI
about:
  - Agent identity registration
  - MPL Core assets
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents register with --name, --description, and --image to register via the API
  - Optionally use --use-ix for direct on-chain registration or --wizard for interactive mode
  - Save the Asset address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: mplx agents register는 무엇을 하나요?
    a: MPL Core 에셋을 생성하고 에이전트 ID를 등록합니다. ID는 에셋 주소로부터 파생된 PDA로 저장됩니다.
  - q: API와 직접 IX 등록의 차이점은 무엇인가요?
    a: API 경로(기본값)는 단일 API 호출로 에셋 생성과 ID 등록을 처리하며 Irys 업로드가 필요하지 않습니다. 직접 IX 경로(--use-ix)는 registerIdentityV1 명령어를 직접 전송하며, 기존 에셋, 커스텀 문서, 위저드에 필요합니다.
  - q: 기존 Core 에셋에 에이전트를 등록할 수 있나요?
    a: 네. 에셋 주소를 첫 번째 인수로 전달하고 --use-ix를 사용하세요. 에셋에 이미 에이전트 ID가 등록되어 있으면 안 됩니다.
---

{% callout title="수행할 작업" %}
MPL Core 에셋에 에이전트 ID를 등록합니다:
- 에이전트 ID가 포함된 새 Core 에셋 생성 (또는 기존 에셋에 등록)
- 에이전트 이름, 설명, 이미지, 서비스, 신뢰 모델 구성
- API 모드(기본값) 또는 온체인 직접 등록 중 선택
{% /callout %}

## 요약

`mplx agents register` 명령어는 [MPL Core](/core) 에셋을 생성하고 [에이전트 ID](/agents)를 등록합니다. 기본적으로 Metaplex Agent API를 사용하여 Irys 업로드 없이 단일 단계 흐름으로 처리합니다.

- **기본 모드**: API — 단일 호출로 에셋 생성 + ID 등록
- **직접 IX 모드**: `--use-ix` — `registerIdentityV1`을 온체인에 전송 (기존 에셋, 위저드, 커스텀 문서에 필요)
- **출력**: 이후 모든 에이전트 명령어에 사용할 에셋 주소 (예: [`agents fetch`](/dev-tools/cli/agents/fetch), [`set-agent-token`](/dev-tools/cli/agents/set-agent-token))

**바로 가기:** [기본 사용법](#기본-사용법) · [옵션](#옵션) · [등록 워크플로우](#등록-워크플로우) · [예시](#예시) · [출력](#출력) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## 기본 사용법

기본 API 모드는 최소한의 필수 플래그로 에이전트를 등록합니다:

```bash {% title="에이전트 등록 (API 모드)" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

## 옵션

| 플래그 | 단축 | 설명 | 필수 여부 | 기본값 |
|--------|------|------|-----------|--------|
| `--name <string>` | | 에이전트 이름 | 예 (`--wizard` 또는 `--from-file`이 없는 경우) | |
| `--description <string>` | | 에이전트 설명 | 아니요 | |
| `--image <string>` | | 에이전트 이미지 파일 경로 (업로드) 또는 기존 URI | 아니요 | |
| `--use-ix` | | API 대신 `registerIdentityV1` 명령어를 직접 전송 | 아니요 | `false` |
| `--new` | | 새 Core 에셋을 생성하고 등록 (`--use-ix`와 함께만 사용) | 아니요 | `false` |
| `--owner <string>` | | 새 에셋의 소유자 공개 키 (`--new`와 함께만 사용) | 아니요 | 서명자 |
| `--collection <string>` | | 에셋이 속하는 컬렉션 주소 | 아니요 | |
| `--wizard` | | 등록 문서를 빌드하는 단계별 가이드 위저드 (`--use-ix` 포함) | 아니요 | |
| `--from-file <path>` | | 업로드할 로컬 에이전트 등록 JSON 파일 경로 (`--use-ix` 포함) | 아니요 | |
| `--active` | | 등록 문서에서 에이전트를 활성 상태로 설정 | 아니요 | `true` |
| `--services <json>` | | JSON 배열 형식의 서비스 엔드포인트 | 아니요 | |
| `--supported-trust <json>` | | JSON 배열 형식의 지원되는 신뢰 모델 | 아니요 | |
| `--save-document <path>` | | 생성된 문서 JSON을 로컬 파일에 저장 | 아니요 | |

{% callout type="note" title="상호 배타적 플래그" %}
`--wizard`, `--from-file`, `--name`은 상호 배타적입니다 — 등록 문서 소스를 지정하려면 정확히 하나를 사용하세요.
{% /callout %}

## 등록 워크플로우

### API 모드 (기본값)

가장 간단한 방법 — 단일 API 호출로 Core 에셋을 생성하고 ID를 등록합니다. Irys 업로드나 `--use-ix` 플래그가 필요하지 않습니다.

```bash {% title="API 등록" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

### 직접 IX — 새 에셋

`--new` 및 `--use-ix` 플래그를 사용하면 새 Core 에셋을 생성하고 `registerIdentityV1` 명령어를 직접 전송합니다. 등록 문서는 Irys에 업로드됩니다.

```bash {% title="직접 IX — 새 에셋" %}
mplx agents register --new --use-ix \
  --name "My Agent" \
  --description "An AI agent" \
  --image "./avatar.png"
```

### 직접 IX — 기존 에셋

첫 번째 인수로 전달된 에셋 주소에 기존 Core 에셋에 ID를 등록합니다.

```bash {% title="직접 IX — 기존 에셋" %}
mplx agents register <ASSET_ADDRESS> --use-ix \
  --from-file "./agent-doc.json"
```

### 인터랙티브 위저드

`--wizard` 플래그는 단계별 가이드 등록을 제공하며 `--use-ix`를 자동으로 활성화합니다.

```bash {% title="위저드 모드" %}
mplx agents register --new --wizard
```

## 예시

서비스 엔드포인트와 함께 등록:

```bash {% title="MCP 서비스 엔드포인트 포함" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent with MCP" \
  --image "./avatar.png" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp"}]'
```

신뢰 모델과 함께 등록:

```bash {% title="신뢰 모델 포함" %}
mplx agents register \
  --name "My Agent" \
  --description "A trusted agent" \
  --image "./avatar.png" \
  --supported-trust '["reputation","tee-attestation"]'
```

등록하지 않고 등록 문서를 로컬에 저장:

```bash {% title="문서를 파일에 저장" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent" \
  --save-document "./my-agent-doc.json"
```

## 출력

```text {% title="예상 출력" %}
--------------------------------
  Asset: <asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

`Asset` 주소를 저장하세요 — `agents fetch`, `agents set-agent-token`, `agents executive delegate`에서 사용됩니다.

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Provide --wizard, --from-file, or --name | 문서 소스가 지정되지 않음 | `--name`, `--wizard`, `--from-file` 중 하나를 추가하세요 |
| --services must be a valid JSON array | `--services`에 잘못된 JSON | `'[{"name":"MCP","endpoint":"https://..."}]'` 형식을 사용하세요 |
| --supported-trust must be a valid JSON array | 잘못된 JSON | `'["reputation","tee-attestation"]'` 형식을 사용하세요 |
| API does not support localnet | 로컬 검증자에서 실행 중 | 로컬넷 등록에는 `--use-ix`를 사용하세요 |
| Validation error on field | API가 필드 값을 거부함 | 오류 메시지에서 필드 이름을 확인하고 값을 수정하세요 |

## 참고 사항

- API 경로는 Irys가 필요하지 않습니다 — API가 문서 스토리지를 자동으로 처리합니다
- 직접 IX 경로(`--use-ix`)는 온체인 명령어를 전송하기 전에 문서를 Irys에 업로드합니다
- `--wizard`와 `--from-file`은 모두 `--use-ix`를 포함합니다 — 항상 온체인 직접 경로를 사용합니다
- `--use-ix`를 `--name`, `--from-file`, `--wizard`와 함께 사용하면 문서가 Irys에 업로드되고 URI가 온체인에 저장됩니다
- `--services`와 `--supported-trust`는 `--name`이 필요합니다 — `--wizard` 또는 `--from-file`과 함께 사용할 수 없습니다

## FAQ

**mplx agents register는 무엇을 하나요?**
MPL Core 에셋을 생성하고 에이전트 ID를 등록합니다. ID는 에셋 주소로부터 파생된 PDA로 저장됩니다.

**API와 직접 IX 등록의 차이점은 무엇인가요?**
API 경로(기본값)는 단일 API 호출로 에셋 생성과 ID 등록을 처리하며 Irys 업로드가 필요하지 않습니다. 직접 IX 경로(`--use-ix`)는 `registerIdentityV1` 명령어를 직접 전송하며, 기존 에셋, 커스텀 문서, 위저드에 필요합니다.

**기존 Core 에셋에 에이전트를 등록할 수 있나요?**
네. 에셋 주소를 첫 번째 인수로 전달하고 `--use-ix`를 사용하세요. 에셋에 이미 에이전트 ID가 등록되어 있으면 안 됩니다.
