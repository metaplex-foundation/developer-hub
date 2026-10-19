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
| `--royalties <value>` | 명시적 리프 로열티 %(0–100, 소수 가능 예: `7.5`). 컬렉션 상속을 옵트아웃 |
| `--inherit-royalties` | 상속 센티널 `65535`와 빈 리프 크리에이터를 저장. Royalties 플러그인이 있는 `--collection` 필요. 컬렉션에 Royalties가 있고 `--royalties`, `--creator`, JSON `seller_fee_basis_points`를 생략하면 기본값 |
| `--creator <address>:<share>` | 리프 분배(반복 가능, 합계 100). 명시적 리프 민트에서 기본값은 지불자 100%. `--royalties`가 없어도 상속을 옵트아웃. `--inherit-royalties`와 함께 사용 불가 |
| `--collection <value>` | Core 컬렉션 주소(BubblegumV2 필수). [Metaplex Core 컬렉션](/smart-contracts/core/collections) |
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

1. 컬렉션에 생성 (Royalties 플러그인이 있으면 자동 상속):

```bash
mplx bg nft create my-tree \
  --name "Collection Item #1" \
  --image ./nft.png \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

1. 컬렉션 Royalties 플러그인에서 상속 강제:

```bash
mplx bg nft create my-tree \
  --name "Inherited cNFT" \
  --uri "https://arweave.net/xxx" \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --inherit-royalties
```

1. 명시적 리프 로열티와 크리에이터 분배 (상속 옵트아웃):

```bash
mplx bg nft create my-tree \
  --name "Split cNFT" \
  --uri "https://arweave.net/xxx" \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --royalties 7.5 \
  --creator Addr111111111111111111111111111111111111111:60 \
  --creator Addr222222222222222222222222222222222222222:40
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
Royalties: inherited (leaf sentinel 65535)

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

`seller_fee_basis_points`가 있으면 CLI는 이를 명시적 리프 비율로 취급하며 컬렉션에서 **상속하지 않습니다**.

## 상속 로열티 {% #inherited-royalties %}

[Royalties 플러그인](/smart-contracts/core/plugins/royalties)이 있는 Core 컬렉션에 민팅할 때 CLI는 컬렉션 비율을 각 cNFT에 복사하는 대신 상속 센티널(`65535`)과 빈 리프 크리에이터를 저장할 수 있습니다. DAS는 표시용으로 컬렉션 비율을 해석합니다. [상속 로열티 읽기](/smart-contracts/bubblegum-v2/reading-inherited-royalties)를 참조하세요.

```bash
mplx bg collection create \
  --name "My Compressed Collection" \
  --uri "https://example.com/collection.json" \
  --royalties 5
```

| 의도 | 플래그 |
|--------|--------|
| 자동 상속 | `--collection <COL>` 그리고 `--royalties`, `--creator`, JSON `seller_fee_basis_points` 생략 |
| 상속 강제 | `--collection <COL> --inherit-royalties` |
| 명시적 리프 비율 | `--royalties <0-100>` (소수 가능). 상속 옵트아웃 |
| 명시적 분배 | `--creator <ADDR>:<share>` (반복 가능, 합계 100). `--royalties`가 없어도 상속 옵트아웃 (리프 비율은 `0%`) |

`--inherit-royalties`는 Royalties 플러그인이 있는 `--collection`이 필요하며 `--royalties`, `--creator`, JSON `seller_fee_basis_points`와 함께 사용할 수 없습니다. `mplx core collection create`만으로는 부족합니다. 컬렉션에 `BubblegumV2`(상속하려면 Royalties)가 있어야 합니다.

## 참고 사항

- 트리 인자는 저장된 트리 이름 또는 공개 키 주소를 사용할 수 있습니다
- 트리가 비공개인 경우 민트하려면 트리 권한이 필요합니다
- 트리가 공개인 경우 누구나 NFT를 민트할 수 있습니다
- RPC는 DAS API를 지원해야 합니다
- **Bubblegum V2 전용** - 이 명령은 Bubblegum V2 트리에서 작동하며 [Metaplex Core 컬렉션](/smart-contracts/core/collections)을 사용합니다 (Token Metadata 컬렉션이 아님)
- 속성 형식: `"trait:value,trait:value"` - 콜론으로 trait와 value를 구분하고 쉼표로 쌍을 구분합니다
- 선택한 컬렉션에 Royalties 플러그인이 있으면 마법사에서 상속과 명시적 로열티를 고를 수 있습니다
