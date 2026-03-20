---
title: Execute
metaTitle: Execute | Metaplex CLI
description: Metaplex CLI를 사용하여 MPL Core 에셋의 서명자 PDA 주소와 SOL 잔액을 검사하고, execute의 트랜잭션 래핑 방식을 이해합니다.
keywords:
  - mplx cli
  - core execute
  - asset signer PDA
  - MPL Core execute
  - metaplex cli execute
  - PDA wallet
  - execute info
about:
  - MPL Core Execute instruction
  - Asset-signer PDA
  - Metaplex CLI
proficiencyLevel: Intermediate
created: '03-19-2026'
updated: '03-20-2026'
---

## 요약

`mplx core asset execute info` 명령어는 모든 [MPL Core 에셋](/core)의 서명자 PDA 주소와 현재 SOL 잔액을 표시합니다. 서명자 PDA는 에셋을 대신하여 SOL, 토큰을 보유하고 다른 에셋을 소유할 수 있는 결정론적 프로그램 파생 주소입니다.

- 모든 Core 에셋의 서명자 PDA 주소를 파생 및 표시
- 결과를 반환하기 전에 에셋이 온체인에 존재하는지 검증
- PDA의 현재 SOL 잔액 표시
- 전체 PDA 지갑 기능을 위해 [에셋 서명자 지갑](/dev-tools/cli/config/asset-signer-wallets)과 함께 사용

## 기본 사용법

```bash {% title="Get execute info for an asset" %}
mplx core asset execute info <assetId>
```

## 인수

| 인수 | 설명 |
|------|------|
| `ASSET_ID` | 서명자 PDA를 파생할 [MPL Core 에셋](/core)의 주소 |

## 글로벌 플래그

| 플래그 | 설명 |
|--------|------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 Ledger 경로 (예: `usb://ledger?key=0`) |
| `-p, --payer <value>` | 지불자 키페어 파일 또는 Ledger 경로 |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--commitment <option>` | 커밋먼트 레벨: `processed`, `confirmed`, 또는 `finalized` |
| `--json` | 출력을 JSON 형식으로 포맷 |
| `--log-level <option>` | 로그 레벨: `debug`, `warn`, `error`, `info`, 또는 `trace` (기본값: `info`) |

## 예제

### 에셋의 PDA 정보 표시

```bash {% title="Get signer PDA info" %}
mplx core asset execute info 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

출력:

``` {% title="execute info output" %}
--------------------------------
  Asset:         5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
  Signer PDA:    7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
  SOL Balance:   0.1 SOL
--------------------------------
```

### 구조화된 JSON 출력 가져오기

```bash {% title="Execute info with JSON output" %}
mplx core asset execute info <assetId> --json
```

반환값:

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signerPda": "<pdaAddress>",
  "balance": 0.1
}
```

### 검사 후 PDA에 자금 전송

PDA를 검사한 후 자금을 전송하는 일반적인 워크플로우:

```bash {% title="Inspect and fund the PDA" %}
# 1. PDA 주소 가져오기
mplx core asset execute info <assetId>

# 2. PDA에 SOL 전송
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 3. 잔액 확인
mplx core asset execute info <assetId>
```

## Execute 작동 방식

모든 [MPL Core](/core) 에셋에는 `findAssetSignerPda`를 사용하여 주소에서 파생되는 결정론적 서명자 PDA가 있습니다. 이 PDA는 지갑으로 작동하여 SOL 보유, 토큰 소유, 온체인 `execute` 인스트럭션을 통한 인스트럭션 서명이 가능합니다.

일반적인 워크플로우:

1. **PDA 파생** — `mplx core asset execute info <assetId>`로 PDA 주소 확인
2. **PDA에 자금 전송** — `mplx toolbox sol transfer`로 PDA 주소에 SOL 전송
3. **지갑으로 등록** — `mplx config wallets add <name> --asset <assetId>`로 에셋을 [에셋 서명자 지갑](/dev-tools/cli/config/asset-signer-wallets)으로 추가
4. **정상적으로 사용** — 에셋 서명자 지갑이 활성화되면 모든 CLI 명령어가 자동으로 `execute` 인스트럭션으로 래핑됩니다

{% callout type="note" %}
`info`는 유일한 execute 하위 명령어입니다. PDA로 작업을 수행하려면 에셋을 [에셋 서명자 지갑](/dev-tools/cli/config/asset-signer-wallets)으로 등록하세요. 모든 일반 CLI 명령어가 자동으로 `execute`로 래핑됩니다.
{% /callout %}

## 빠른 참조

| 항목 | 값 |
|------|-----|
| 명령어 | `mplx core asset execute info` |
| 대상 | [MPL Core 에셋](/core)만 해당 |
| 관련 | [에셋 서명자 지갑](/dev-tools/cli/config/asset-signer-wallets) |
| PDA 파생 | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| 소스 | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 참고 사항

- 서명자 PDA는 결정론적입니다 — 동일한 에셋은 항상 동일한 PDA 주소를 생성합니다
- PDA는 SOL, SPL 토큰을 보유하고 다른 [MPL Core 에셋](/core)을 소유할 수도 있습니다
- 에셋 소유자(또는 승인된 델리게이트)만 해당 에셋의 PDA에 대해 `execute` 인스트럭션을 호출할 수 있습니다
- 명령어는 PDA를 파생하기 전에 에셋이 온체인에 존재하는지 검증합니다. 존재하지 않는 에셋은 오류를 발생시킵니다
- 표시되는 잔액은 SOL 잔액만입니다 — 토큰 잔액을 확인하려면 [에셋 서명자 지갑](/dev-tools/cli/config/asset-signer-wallets)을 활성화하고 `mplx toolbox sol balance`를 사용하세요
- 이것은 읽기 전용 명령어입니다 — 온체인 상태를 생성하거나 수정하지 않습니다
- Solana CPI 제약으로 인해 일부 작업은 `execute`로 래핑할 수 없습니다 — [CPI 제한 사항](/dev-tools/cli/config/asset-signer-wallets#cpi-limitations) 참조
