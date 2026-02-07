---
title: 토큰 생성
metaTitle: 토큰 생성 | Metaplex CLI
description: Solana에서 새 대체 가능 토큰 생성
---

`mplx toolbox token create` 명령어를 사용하면 Solana에서 새로운 대체 가능 토큰을 생성할 수 있습니다. 대화형 마법사를 사용하거나 필요한 모든 정보를 직접 제공하는 두 가지 방법으로 토큰을 생성할 수 있습니다.

## 기본 사용법

### 대화형 마법사
```bash
mplx toolbox token create --wizard
```

### 직접 생성
```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

## 옵션

### 필수 옵션 (마법사를 사용하지 않을 때)
- `--name <string>`: 토큰 이름 (예: "My Awesome Token")
- `--symbol <string>`: 토큰 심볼 (2-6자, 예: "MAT")
- `--mint-amount <number>`: 발행할 토큰의 초기 양 (0보다 커야 함)

### 선택적 옵션
- `--decimals <number>`: 소수점 자릿수 (0-9, 기본값: 0)
- `--description <string>`: 토큰과 그 목적에 대한 설명
- `--image <path>`: 토큰 이미지 파일 경로 (PNG, JPG 또는 GIF)
- `--speed-run`: 실행 시간을 측정하기 위한 스피드런 모드 활성화

## 예시

### 기본 정보로 토큰 생성
```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

### 모든 옵션으로 토큰 생성
```bash
mplx toolbox token create \
  --name "My Awesome Token" \
  --symbol "MAT" \
  --description "A token for awesome things" \
  --image ./token-image.png \
  --decimals 2 \
  --mint-amount 1000000
```

### 마법사를 사용하여 토큰 생성
```bash
mplx toolbox token create --wizard
```

## 출력

토큰 생성이 성공하면 명령어가 다음을 표시합니다:
```
--------------------------------
Token created successfully!

Token Details:
Name: <name>
Symbol: <symbol>
Decimals: <decimals>
Initial Supply: <formattedAmount>

Mint Address: <mintAddress>
Explorer: <explorerUrl>

Transaction Signature: <signature>
Explorer: <transactionExplorerUrl>
Execution Time: <time> seconds
--------------------------------
```

## 참고사항

- 토큰 심볼은 2-6자 길이여야 합니다
- 발행 양은 0보다 커야 합니다
- 소수점은 토큰의 최소 단위를 결정합니다 (예: 소수점 2자리는 100 토큰 = 100_00을 의미)
- 이미지 파일은 PNG, JPG 또는 GIF 형식이어야 합니다
- 마법사는 필요한 모든 필드를 대화형으로 안내합니다
- 명령어는 자동으로 다음을 처리합니다:
  - 토큰 이미지 업로드 (제공된 경우)
  - 토큰 메타데이터 생성 및 업로드
  - 블록체인에서 토큰 생성
  - 초기 공급량 발행
- 거래 서명과 발행 주소는 확인을 위해 제공됩니다
- 스피드런 모드는 실행 시간을 측정하는 데 사용할 수 있습니다
