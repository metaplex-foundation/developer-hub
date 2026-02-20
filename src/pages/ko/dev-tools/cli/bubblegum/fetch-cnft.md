---
title: 압축 NFT 조회
metaTitle: 압축 NFT 조회 | Metaplex CLI
description: 압축 NFT 데이터 및 머클 증명 조회
---

`mplx bg nft fetch` 명령은 DAS (Digital Asset Standard) API를 사용하여 압축 NFT의 자산 데이터와 머클 증명을 조회합니다.

## 기본 사용법

```bash
mplx bg nft fetch <assetId>
```

### 파일로 다운로드

```bash
mplx bg nft fetch <assetId> --download --output ./nfts
```

### 증명만 조회

```bash
mplx bg nft fetch <assetId> --proof-only
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `ASSET_ID` | 압축 NFT 자산 ID (리프 자산 ID) |

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--download` | 자산 데이터와 증명을 파일로 다운로드 |
| `--output <value>` | 다운로드 파일의 디렉토리 경로 (`--download` 필요) |
| `--proof-only` | 머클 증명만 조회하고 표시 |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--json` | JSON 형식으로 출력 |

## 예시

1. NFT 정보 조회 및 표시:

```bash
mplx bg nft fetch CNFTAssetIdHere
```

1. 자산 데이터를 파일로 다운로드:

```bash
mplx bg nft fetch CNFTAssetIdHere --download
```

1. 특정 디렉토리에 다운로드:

```bash
mplx bg nft fetch CNFTAssetIdHere --download --output ./nft-data
```

1. 머클 증명만 조회:

```bash
mplx bg nft fetch CNFTAssetIdHere --proof-only
```

1. JSON 형식으로 출력:

```bash
mplx bg nft fetch CNFTAssetIdHere --json
```

## 출력

```text
--------------------------------
Compressed NFT Details

Asset ID: CNFTAssetIdHere
Name: My Compressed NFT
Symbol: CNFT
Description: A beautiful compressed NFT

Compressed: true
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Leaf ID: 42
Owner: OwnerWalletAddressHere
Collection: CollectionAddressHere

Metadata URI: https://arweave.net/xxx
Image: https://arweave.net/yyy

Mutable: true
Burnt: false

Merkle Proof:
  Root: RootHashHere
  Node Index: 42
  Proof Length: 6 nodes
  Tree ID: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Royalty:
  Basis Points: 500 (5%)
  Primary Sale: No

Creators:
  CreatorAddress1 (100%) ✓

--------------------------------
```

## 다운로드되는 파일

`--download`를 사용하면 두 개의 파일이 생성됩니다:

- `<assetId>-asset.json` - 메타데이터, 소유권, 압축 정보를 포함한 전체 자산 데이터
- `<assetId>-proof.json` - 쓰기 작업 (전송, 소각, 업데이트)에 필요한 머클 증명

## 참고 사항

- RPC는 DAS API를 지원해야 합니다
- 표준 Solana RPC 엔드포인트는 "Asset not found or RPC does not support DAS API"로 실패합니다
- 머클 증명은 전송, 소각, 업데이트 작업에 필수적입니다
- `--json` 플래그는 스크립팅을 위한 기계 판독 가능한 JSON을 출력합니다
