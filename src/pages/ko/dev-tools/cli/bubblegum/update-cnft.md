---
title: 압축 NFT 업데이트
metaTitle: 압축 NFT 업데이트 | Metaplex CLI
description: 압축 NFT의 메타데이터 업데이트
---

`mplx bg nft update` 명령은 압축 NFT의 오프체인 메타데이터를 업데이트합니다. 개별 필드를 업데이트하거나 대화형 편집기를 사용하여 전체 메타데이터 JSON을 수정할 수 있습니다.

## 기본 사용법

### 개별 필드 업데이트
```bash
mplx bg nft update <assetId> --name "New Name"
```

### 여러 필드 업데이트
```bash
mplx bg nft update <assetId> --name "New Name" --description "New Description" --image ./new-image.png
```

### 대화형 편집기
```bash
mplx bg nft update <assetId> --editor
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `ASSET_ID` | 업데이트할 압축 NFT 자산 ID |

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--name <value>` | NFT의 새 이름 |
| `--symbol <value>` | NFT의 새 심볼 |
| `--description <value>` | NFT의 새 설명 |
| `--image <value>` | 새 이미지 파일 경로 |
| `--uri <value>` | 새 메타데이터 URI (필드 업데이트의 대안) |
| `-e, --editor` | 기본 편집기에서 메타데이터 JSON 열기 |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--json` | JSON 형식으로 출력 |

## 예시

1. 이름 업데이트:
```bash
mplx bg nft update CNFTAssetIdHere --name "Updated NFT Name"
```

2. 이름과 설명 업데이트:
```bash
mplx bg nft update CNFTAssetIdHere \
  --name "New Name" \
  --description "이 NFT가 업데이트되었습니다"
```

3. 새 이미지로 업데이트:
```bash
mplx bg nft update CNFTAssetIdHere \
  --name "Refreshed NFT" \
  --image ./new-artwork.png
```

4. 전체 메타데이터 URI 교체:
```bash
mplx bg nft update CNFTAssetIdHere --uri "https://arweave.net/xxx"
```

5. 대화형 편집기 사용:
```bash
mplx bg nft update CNFTAssetIdHere --editor
```

## 출력

```
--------------------------------

  Compressed NFT Update

--------------------------------
Fetching asset and proof data... ✓
Uploading Image... ✓
Uploading JSON file... ✓
Updating compressed NFT... ✓

--------------------------------
  Compressed NFT: Updated NFT Name
  Asset ID: CNFTAssetIdHere
  Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 권한 요구 사항

압축 NFT를 업데이트하려면 다음 중 하나여야 합니다:
- **트리 권한** - NFT가 컬렉션에 속하지 않는 경우
- **컬렉션 업데이트 권한** - NFT가 [Metaplex Core 컬렉션](/smart-contracts/core/collections)에 속하는 경우

**참고**: NFT의 소유자는 업데이트할 수 없습니다 - 이것은 기존 NFT와 다릅니다.

## 참고 사항

- RPC는 DAS API를 지원해야 합니다
- 필드를 업데이트할 때 (URI가 아닌 경우) 기존 메타데이터를 가져와서 변경 사항과 병합합니다
- 메타데이터 가져오기에 실패하면 새 메타데이터를 생성하기 위해 모든 필드를 제공해야 합니다
- `--uri` 플래그는 `--image`, `--description`, `--editor`와 배타적입니다
- `--editor` 플래그는 다른 모든 업데이트 플래그와 배타적입니다
- 편집기는 `$EDITOR` 환경 변수를 사용하거나 기본적으로 nano/notepad를 사용합니다
