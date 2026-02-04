---
title: 토큰에 메타데이터 추가
metaTitle: 토큰에 메타데이터 추가 | Metaplex CLI
description: 메타데이터 계정이 없는 기존 토큰에 메타데이터 추가
---

`mplx toolbox token add-metadata` 명령은 메타데이터 계정 없이 생성된 기존 토큰에 메타데이터를 추가합니다. 이는 `spl-token` CLI나 Token Metadata 계정을 자동으로 생성하지 않는 다른 도구로 생성된 토큰에 유용합니다.

## 기본 사용법

```bash
mplx toolbox token add-metadata <mint> --name "My Token" --symbol "MTK"
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `MINT` | 토큰의 민트 주소 |

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--name <value>` | 토큰 이름 (필수) |
| `--symbol <value>` | 토큰 심볼, 2-6자 (필수) |
| `--uri <value>` | 메타데이터 JSON을 가리키는 URI (--image, --description과 배타적) |
| `--description <value>` | 토큰 설명 (메타데이터 업로드 시 사용) |
| `--image <value>` | 토큰 이미지 파일 경로 (메타데이터 업로드 시 사용) |
| `--is-mutable` | 메타데이터를 나중에 업데이트할 수 있는지 여부 (기본값: true) |
| `--no-is-mutable` | 메타데이터를 불변으로 설정 |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-r, --rpc <value>` | 클러스터의 RPC URL |

## 예시

1. 기본 메타데이터 추가:
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK"
```

2. 기존 URI로 메타데이터 추가:
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --uri "https://example.com/metadata.json"
```

3. 이미지와 설명으로 메타데이터 추가 (자동 업로드):
```bash
mplx toolbox token add-metadata <mintAddress> \
  --name "My Token" \
  --symbol "MTK" \
  --description "훌륭한 토큰" \
  --image ./logo.png
```

4. 불변 메타데이터 추가. 주의: 이 작업은 되돌릴 수 없습니다!
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --no-is-mutable
```

## 출력

```
--------------------------------

    Add Token Metadata

--------------------------------
Checking for existing metadata... ✓
No existing metadata found
Verifying mint authority... ✓
Mint authority verified
Uploading image... ✓
Uploading metadata JSON... ✓
Creating metadata account... ✓

--------------------------------
Metadata created successfully!

Token Details:
Name: My Token
Symbol: MTK

Mint Address: <mintAddress>
Explorer: https://solscan.io/account/<mintAddress>

Transaction Signature: <signature>
Explorer: https://solscan.io/tx/<signature>
--------------------------------
```

## 요구 사항

- **민트 권한 필요**: 메타데이터를 추가하려면 토큰의 민트 권한이 있어야 합니다
- **기존 메타데이터 없음**: 토큰에 이미 메타데이터 계정이 없어야 합니다. 기존 메타데이터를 수정하려면 `mplx toolbox token update`를 사용하세요

## 참고 사항

- 토큰에 이미 메타데이터가 있는 경우 명령은 기존 메타데이터를 표시하고 update 명령 사용을 제안합니다
- 민트 권한이 취소된 경우 메타데이터를 추가할 수 없습니다
- `--uri` 없이 `--image` 및/또는 `--description`을 제공하면 CLI가 자동으로 메타데이터를 스토리지에 업로드합니다
- `--uri` 플래그는 `--image` 및 `--description`과 배타적입니다
- `--no-is-mutable` 플래그 사용 시 주의하세요. 되돌릴 수 없습니다
