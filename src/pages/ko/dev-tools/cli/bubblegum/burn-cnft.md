---
title: 압축 NFT 소각
metaTitle: 압축 NFT 소각 | Metaplex CLI
description: 압축 NFT를 영구적으로 삭제
---

`mplx bg nft burn` 명령은 압축 NFT를 영구적으로 삭제합니다. 이 작업은 **되돌릴 수 없습니다**.

## 기본 사용법

```bash
mplx bg nft burn <assetId>
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `ASSET_ID` | 소각할 압축 NFT 자산 ID |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--json` | JSON 형식으로 출력 |

## 예시

1. 압축 NFT 소각:
```bash
mplx bg nft burn CNFTAssetIdHere
```

2. JSON 출력으로 소각:
```bash
mplx bg nft burn CNFTAssetIdHere --json
```

## 출력

```
Fetching asset and proof data... ✓
Verifying ownership... ✓
Burning compressed NFT... ✓
Compressed NFT burned successfully!

--------------------------------
Compressed NFT Burned!

Asset ID: CNFTAssetIdHere
Owner: YourWalletAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 권한 요구 사항

압축 NFT를 소각하려면 다음 중 하나여야 합니다:
- **현재 소유자** - NFT를 현재 소유하고 있는 지갑
- **위임자** - NFT에 대한 권한을 위임받은 지갑

## 참고 사항

- **경고**: 소각은 영구적이며 되돌릴 수 없습니다
- RPC는 DAS API를 지원해야 합니다
- 소각해도 머클 트리에서 렌트가 회수되지 않습니다
- 트리의 용량은 해제되지 않습니다 - 슬롯은 점유된 상태로 유지됩니다 (소각됨으로 표시)
- 관련 메타데이터는 스토리지에 남아 있지만 더 이상 연결되지 않습니다
