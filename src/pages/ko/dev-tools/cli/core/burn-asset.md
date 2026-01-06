---
title: 에셋 소각
metaTitle: 에셋 소각 | Metaplex CLI
description: Metaplex CLI를 사용하여 MPL Core 에셋 소각하기
---

`mplx core asset burn` 명령을 사용하면 MPL Core 에셋을 영구적으로 삭제하고 렌트 비용을 회수할 수 있습니다. 단일 에셋을 소각하거나 JSON 리스트 파일을 사용하여 여러 에셋을 한 번에 소각할 수 있습니다.

## 기본 사용법

### 단일 에셋 소각
```bash
mplx core asset burn <assetId>
```

### 컬렉션에서 에셋 소각
```bash
mplx core asset burn <assetId> --collection <collectionId>
```

### 여러 에셋 소각
```bash
mplx core asset burn --list ./assets-to-burn.json
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `ASSET` | 소각할 에셋의 민트 주소 |

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--collection <value>` | 에셋을 소각할 컬렉션 ID |
| `--list <value>` | 소각할 에셋의 JSON 리스트 파일 경로 (예: `["asset1", "asset2"]`) |

## 글로벌 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 Ledger 경로 (예: `usb://ledger?key=0`) |
| `-p, --payer <value>` | 지불자 키페어 파일 또는 Ledger 경로 |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--commitment <option>` | 커밋먼트 레벨: `processed`, `confirmed`, 또는 `finalized` |
| `--json` | 출력을 JSON 형식으로 포맷 |
| `--log-level <option>` | 로그 레벨: `debug`, `warn`, `error`, `info`, 또는 `trace` (기본값: `info`) |

## 예제

### 단일 에셋 소각
```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

### 컬렉션에서 에셋 소각
```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

### 리스트에서 여러 에셋 소각
JSON 파일 `assets-to-burn.json` 생성:
```json
[
  "5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa",
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
]
```

그런 다음 실행:
```bash
mplx core asset burn --list ./assets-to-burn.json
```

## 참고 사항

- **경고**: 소각은 영구적이며 되돌릴 수 없습니다
- 에셋을 소각하려면 해당 에셋의 소유자여야 합니다
- 에셋을 소각하면 대부분의 렌트 SOL이 소유자에게 반환됩니다
- 계정 재사용을 방지하기 위해 소액(약 0.00089784 SOL)이 남습니다
- 컬렉션에 속한 에셋을 소각할 때는 `--collection` 플래그를 사용하세요
