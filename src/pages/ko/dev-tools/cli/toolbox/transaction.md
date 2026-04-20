---
# Remember to also update the date in src/components/products/guides/index.js
title: 트랜잭션 실행
metaTitle: 트랜잭션 실행 | Metaplex CLI
description: 활성 지갑을 사용하여 임의의 base64 인코딩된 Solana 명령을 서명하고 전송합니다.
keywords:
  - mplx CLI
  - execute transaction
  - base64 instruction
  - MPL Core execute
  - Solana
about:
  - Metaplex CLI
  - Solana Transactions
proficiencyLevel: Advanced
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox transaction` 명령어는 현재 지갑을 사용하여 임의의 base64 인코딩된 Solana 명령을 서명하고 전송합니다.

- `--instruction`을 통해 하나 이상의 base64 인코딩 명령을 받습니다(반복 가능).
- `--stdin`이 사용되면 stdin에서 명령을 한 줄씩 읽습니다.
- asset-signer 지갑이 활성화된 경우 명령을 MPL Core `execute` 호출로 자동 래핑합니다.
- `--instruction`과 `--stdin`은 상호 배타적입니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox transaction --instruction <b64>` |
| 플래그 | `-i, --instruction <b64>` (반복 가능), `--stdin` |
| 입력 | Base64 인코딩 Solana 명령 |
| Asset-signer 지갑 | 명령이 MPL Core `execute`로 래핑됨 |
| 상호 배타적 | `--instruction`과 `--stdin` |

## 기본 사용법

각 base64 인코딩 명령을 `--instruction`을 통해 전달하거나 stdin을 통해 파이프합니다.

```bash
# Pass one or more instructions via flag
mplx toolbox transaction --instruction <base64>

# Pipe base64 instructions via stdin (one per line)
echo "<base64>" | mplx toolbox transaction --stdin
```

## 플래그

이 명령어는 전적으로 플래그로 구동됩니다.

- `-i, --instruction <base64>`: Base64 인코딩 명령. 여러 명령을 포함하도록 반복할 수 있습니다.
- `--stdin`: stdin에서 base64 명령을 한 줄씩 읽습니다. `--instruction`과 상호 배타적입니다.

## 예시

다음 예시는 단일, 일괄, 파이프된 호출을 보여줍니다.

```bash
mplx toolbox transaction --instruction <base64EncodedInstruction>
mplx toolbox transaction --instruction <ix1> --instruction <ix2>
echo "<base64>" | mplx toolbox transaction --stdin
```

## 출력

성공하면 명령어는 서명자, 명령 수, 트랜잭션 서명을 출력합니다.

```
--------------------------------
  Signer:         <wallet_pubkey>
  Instructions:   <count>
  Signature:      <signature>
--------------------------------
<explorer_url>
```

## 참고사항

- 일괄 처리의 모든 명령은 현재 지갑의 identity로 서명됩니다.
- [asset-signer 지갑](/dev-tools/cli/config/asset-signer-wallets)이 활성화된 경우 명령은 자동으로 MPL Core `execute` 명령에 래핑됩니다.
- 이 명령어는 이스케이프 해치입니다 — 가능한 경우 전용 명령을 선호하세요.
