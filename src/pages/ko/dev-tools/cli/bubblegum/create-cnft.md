---
title: 압축 NFT 생성
metaTitle: 압축 NFT 생성 | Metaplex CLI
description: 머클 트리에 압축 NFT 민트
---

`mplx bg nft create` 명령은 기존 머클 트리에 압축 NFT를 민트합니다. 아직 머클 트리가 없다면 먼저 [생성](/dev-tools/cli/bubblegum/create-tree)하세요.

## 기본 사용법

### 대화형 마법사 (권장)

```bash
mplx bg nft create --wizard
```

### 특정 트리 지정

```bash
mplx bg nft create my-tree --wizard
```

### 파일 기반 생성

```bash
mplx bg nft create my-tree --image ./nft.png --json ./metadata.json
```

### URI 기반 생성

```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://example.com/metadata.json"
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `TREE` | 트리 이름 (저장됨) 또는 머클 트리 주소 (마법사 모드에서는 선택 사항) |

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--wizard` | 대화형 마법사 사용 |
| `--name <value>` | NFT 이름 |
| `--uri <value>` | 기존 메타데이터 URI |
| `--json <value>` | JSON 메타데이터 파일 경로 (`--image` 필요) |
| `--image <value>` | 이미지 파일 경로 |
| `--description <value>` | NFT 설명 |
| `--attributes <value>` | "trait:value,trait:value" 형식의 속성 |
| `--animation <value>` | 애니메이션/비디오 파일 경로 |
| `--project-url <value>` | 외부 프로젝트 URL |
| `--symbol <value>` | 온체인 심볼 |
| `--royalties <value>` | 로열티 퍼센트 (0-100) |
| `--collection <value>` | 컬렉션 민트 주소 ([Metaplex Core 컬렉션](/smart-contracts/core/collections)) |
| `--owner <value>` | 리프 소유자 공개 키 (기본값은 지불자) |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--json` | JSON 형식으로 출력 |

## 예시

1. 마법사를 사용하여 생성:

```bash
mplx bg nft create --wizard
```

1. 특정 트리로 마법사를 사용하여 생성:

```bash
mplx bg nft create my-tree --wizard
```

1. 기존 메타데이터 URI로 생성:

```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://arweave.net/xxx"
```

1. 로컬 파일로 생성:

```bash
mplx bg nft create my-tree --image ./artwork.png --json ./metadata.json
```

1. 메타데이터 플래그로 생성:

```bash
mplx bg nft create my-tree \
  --name "Cool NFT #1" \
  --image ./nft.png \
  --description "매우 멋진 압축 NFT" \
  --attributes "Background:Blue,Eyes:Laser,Hat:Crown" \
  --royalties 5
```

1. 컬렉션에 생성:

```bash
mplx bg nft create my-tree \
  --name "Collection Item #1" \
  --image ./nft.png \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 출력

```text
Uploading image... ✓
Uploading metadata... ✓
Creating compressed NFT... ✓

--------------------------------
Compressed NFT Created!

Tree: my-tree
Owner: YourWalletAddressHere
Asset ID: CNFTAssetIdHere

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 메타데이터 JSON 형식

`--json`을 사용할 때 메타데이터 파일은 다음 구조를 따라야 합니다:

```json
{
  "name": "My NFT",
  "symbol": "MNFT",
  "description": "NFT 설명",
  "seller_fee_basis_points": 500,
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Rarity", "value": "Rare" }
  ],
  "properties": {
    "files": [
      { "uri": "", "type": "image/png" }
    ]
  }
}
```

`image` 필드는 업로드된 이미지 URI로 자동으로 채워집니다.

## 참고 사항

- 트리 인자는 저장된 트리 이름 또는 공개 키 주소를 사용할 수 있습니다
- 트리가 비공개인 경우 민트하려면 트리 권한이 필요합니다
- 트리가 공개인 경우 누구나 NFT를 민트할 수 있습니다
- RPC는 DAS API를 지원해야 합니다
- **Bubblegum V2 전용** - 이 명령은 Bubblegum V2 트리에서 작동하며 [Metaplex Core 컬렉션](/smart-contracts/core/collections)을 사용합니다 (Token Metadata 컬렉션이 아님)
- 속성 형식: `"trait:value,trait:value"` - 콜론으로 trait와 value를 구분하고 쉼표로 쌍을 구분합니다
