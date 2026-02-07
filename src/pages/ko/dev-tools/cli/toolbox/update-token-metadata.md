---
title: 토큰 메타데이터 업데이트
metaTitle: 토큰 메타데이터 업데이트 | Metaplex CLI
description: 기존 토큰의 메타데이터 업데이트
---

`mplx toolbox token update` 명령은 기존 토큰의 메타데이터를 업데이트합니다. 개별 필드를 업데이트하거나 대화형 편집기를 사용하여 전체 메타데이터 JSON을 수정할 수 있습니다.

## 기본 사용법

### 개별 필드 업데이트
```bash
mplx toolbox token update <mint> --name "New Name"
```

### 여러 필드 업데이트
```bash
mplx toolbox token update <mint> --name "New Name" --description "New Description" --image ./new-image.png
```

### 대화형 편집기
```bash
mplx toolbox token update <mint> --editor
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `MINT` | 업데이트할 토큰의 민트 주소 |

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--name <value>` | 토큰의 새 이름 |
| `--symbol <value>` | 토큰의 새 심볼 |
| `--description <value>` | 토큰의 새 설명 |
| `--image <value>` | 새 이미지 파일 경로 |
| `-e, --editor` | 기본 편집기에서 메타데이터 JSON 열기 |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-r, --rpc <value>` | 클러스터의 RPC URL |

## 예시

1. 이름 업데이트:
```bash
mplx toolbox token update <mintAddress> --name "Updated Token Name"
```

2. 이름과 설명 업데이트:
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --description "이 토큰이 업데이트되었습니다"
```

3. 새 이미지로 업데이트:
```bash
mplx toolbox token update <mintAddress> \
  --name "Refreshed Token" \
  --image ./new-logo.png
```

4. 모든 필드 업데이트:
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --symbol "NEW" \
  --description "업데이트된 설명" \
  --image ./new-image.png
```

5. 대화형 편집기 사용:
```bash
mplx toolbox token update <mintAddress> --editor
```

## 출력

```
--------------------------------

    Token Update

--------------------------------
Fetching token data... ✓
Token data fetched: My Token
Uploading Image... ✓
Uploading JSON file... ✓
Updating Token... ✓
Update transaction sent and confirmed.
Token successfully updated!
```

## 대화형 편집기 모드

`--editor`를 사용하면 CLI는 다음을 수행합니다:
1. 토큰의 URI에서 현재 메타데이터 JSON 가져오기
2. 임시 파일에 쓰기
3. 기본 편집기에서 파일 열기 (`$EDITOR` 환경 변수 또는 대체로 `nano`/`notepad`)
4. 저장하고 편집기를 닫을 때까지 대기
5. 수정된 JSON 파싱 및 업로드
6. 온체인 메타데이터 업데이트

이는 메타데이터 구조나 속성에 복잡한 변경을 가할 때 유용합니다.

## 참고 사항

- 최소 하나의 업데이트 플래그(`--name`, `--description`, `--symbol`, `--image` 또는 `--editor`)를 제공해야 합니다
- `--editor` 플래그는 다른 모든 업데이트 플래그와 배타적입니다
- 필드를 업데이트할 때(편집기를 사용하지 않을 때) 기존 메타데이터를 가져와 변경 사항과 병합합니다
- 메타데이터 가져오기에 실패하면 새 메타데이터를 생성하기 위해 모든 필드를 제공해야 합니다
- 편집기는 `$EDITOR` 환경 변수를 사용하거나 기본적으로 `nano`(Linux/macOS) 또는 `notepad`(Windows)를 사용합니다
- 토큰의 메타데이터를 업데이트하려면 업데이트 권한이 있어야 합니다
