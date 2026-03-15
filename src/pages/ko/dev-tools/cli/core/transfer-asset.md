---
title: 에셋 전송
metaTitle: 에셋 전송 | Metaplex CLI
description: Metaplex CLI의 mplx core asset transfer 명령어를 사용하여 MPL Core 에셋의 소유권을 새 지갑으로 전송합니다.
keywords:
  - mplx cli
  - core asset transfer
  - MPL Core
  - transfer NFT
  - metaplex cli transfer
  - core transfer
about:
  - MPL Core Asset transfer
  - Metaplex CLI
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '03-15-2026'
---

## 요약

`mplx core asset transfer` 명령어는 [MPL Core 에셋](/core)의 소유권을 새 지갑으로 전송합니다. 에셋이 컬렉션에 속하면 컬렉션 계정이 자동으로 감지됩니다 — 추가 플래그가 필요하지 않습니다.

- 단일 Core 에셋을 지정된 공개 키로 전송
- 에셋이 컬렉션에 속하면 자동으로 감지하여 포함
- 호출자가 현재 소유자 또는 승인된 전송 위임자여야 함
- 동결된 에셋은 전송 전에 동결을 해제해야 함

## 기본 사용법

```bash {% title="에셋 전송" %}
mplx core asset transfer <assetId> <newOwner>
```

## 인수

| 인수 | 설명 |
|----------|-------------|
| `ASSET_ID` | 전송할 에셋의 주소 |
| `NEW_OWNER` | 새 소유자 지갑의 공개 키 |

## 글로벌 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 Ledger 경로 (예: `usb://ledger?key=0`) |
| `-p, --payer <value>` | 지불자 키페어 파일 또는 Ledger 경로 |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--commitment <option>` | 커밋 수준: `processed`, `confirmed`, 또는 `finalized` |
| `--json` | 출력을 JSON 형식으로 포맷 |
| `--log-level <option>` | 로그 수준: `debug`, `warn`, `error`, `info`, 또는 `trace` (기본값: `info`) |

## 예시

### 독립 에셋 전송

```bash {% title="독립 에셋 전송" %}
mplx core asset transfer 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### 컬렉션에 속한 에셋 전송

컬렉션 계정은 에셋에서 자동으로 감지됩니다 — `--collection` 플래그가 필요하지 않습니다.

```bash {% title="컬렉션 에셋 전송" %}
mplx core asset transfer BXBJbGGjMPBNKmRoUVGpMKFNMmvzfJTvEUqY1bBXqzNd \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### 구조화된 JSON 출력 가져오기

```bash {% title="JSON 출력으로 전송" %}
mplx core asset transfer <assetId> <newOwner> --json
```

반환값:

```json {% title="JSON 응답" %}
{
  "asset": "<assetId>",
  "newOwner": "<newOwner>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx core asset transfer` |
| 적용 대상 | [MPL Core 에셋](/core)만 해당 — Token Metadata NFT는 미지원 |
| 소스 | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 참고 사항

- 이 명령어를 실행하려면 에셋의 현재 소유자 또는 승인된 [전송 위임자](/core/plugins)여야 합니다
- 동결된 에셋은 전송할 수 없습니다 — 먼저 동결/해제 [플러그인](/core/plugins)을 사용하여 동결을 해제해야 합니다
- 컬렉션 내 에셋의 경우 컬렉션 계정이 자동으로 가져와집니다 — `--collection` 플래그가 필요하지 않습니다
- 이 명령어는 [MPL Core 에셋](/core)에만 적용됩니다 — Token Metadata NFT는 다른 전송 명령어를 사용하세요

*Metaplex Foundation 관리 · 2026년 3월 최종 확인 · MPLX CLI 0.x 적용*
