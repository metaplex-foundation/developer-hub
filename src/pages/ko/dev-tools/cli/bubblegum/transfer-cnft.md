---
title: 압축 NFT 전송
metaTitle: 압축 NFT 전송 | Metaplex CLI
description: 압축 NFT를 새 소유자에게 전송
---

`mplx bg nft transfer` 명령은 압축 NFT의 소유권을 새 지갑 주소로 전송합니다.

## 기본 사용법

```bash
mplx bg nft transfer <assetId> <newOwner>
```

## 인자

| 인자 | 설명 |
|----------|-------------|
| `ASSET_ID` | 전송할 압축 NFT 자산 ID |
| `NEW_OWNER` | 새 소유자의 공개 키 |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--json` | JSON 형식으로 출력 |

## 예시

새 소유자에게 전송:
```bash
mplx bg nft transfer CNFTAssetIdHere RecipientWalletAddressHere
```


## 출력

```
Fetching asset and proof data... ✓
Verifying ownership... ✓
Executing transfer... ✓
Compressed NFT transferred successfully!

--------------------------------
Compressed NFT Transferred!

Asset ID: CNFTAssetIdHere
From: OriginalOwnerAddressHere
To: NewOwnerAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 권한 요구 사항

압축 NFT를 전송하려면 다음 중 하나여야 합니다:
- **현재 소유자** - NFT를 현재 소유하고 있는 지갑
- **위임자** - NFT에 대한 권한을 위임받은 지갑

## 참고 사항

- RPC는 DAS API를 지원해야 합니다
- 전송은 원자적입니다 - 완전히 완료되거나 완전히 실패합니다
- 새 소유자는 즉시 완전한 소유권을 얻습니다
- 기존 NFT와 달리 압축 NFT 전송은 새 토큰 계정을 생성하지 않습니다
- 자산 ID는 전송 후에도 동일하게 유지됩니다 (소유자만 변경됨)
