---
title: 트리 생성
metaTitle: 머클 트리 생성 | Metaplex CLI
description: 압축 NFT용 머클 트리 생성
---

`mplx bg tree create` 명령은 압축 NFT를 저장할 머클 트리를 생성합니다. 압축 NFT를 민트하기 전에 트리를 생성해야 합니다.

{% callout type="note" %}
이것은 **Bubblegum V2** 트리를 생성합니다. V2 트리는 V1과 호환되지 않으며 [Metaplex Core 컬렉션](/smart-contracts/core/collections)을 사용합니다.
{% /callout %}

## 기본 사용법

### 대화형 마법사 (권장)
```bash
mplx bg tree create --wizard
```

### 직접 생성
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--wizard` | 대화형 마법사를 사용하여 트리 생성 |
| `--maxDepth <value>` | 트리의 최대 깊이 (최대 NFT 수 결정) |
| `--maxBufferSize <value>` | 동시 변경을 위한 최대 버퍼 크기 |
| `--canopyDepth <value>` | 검증 최적화를 위한 캐노피 깊이 |
| `--public` | 트리를 공개로 설정 (누구나 NFT 민트 가능) |
| `--name <value>` | 쉽게 참조할 수 있는 짧은 이름 |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--json` | JSON 형식으로 출력 |

## 트리 구성

CLI는 다양한 컬렉션 크기에 최적화된 권장 구성을 제공합니다:

| 최대 NFT | 최대 깊이 | 버퍼 크기 | 캐노피 깊이 | 예상 비용 |
|----------|-----------|-------------|--------------|----------------|
| 16,384 | 14 | 64 | 8 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | ~26.12 SOL |

## 예시

1. 마법사를 사용하여 트리 생성:
```bash
mplx bg tree create --wizard
```

2. 테스트용 작은 트리 생성:
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
```

3. 공개 트리 생성 (누구나 민트 가능):
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
```

## 출력

```
--------------------------------
Tree Created Successfully!

Tree Name: my-collection-tree
Tree Address: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Max Depth: 14
Max Buffer Size: 64
Canopy Depth: 8
Public Tree: No
Max NFTs: 16,384

Transaction: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
Tree Explorer: https://solscan.io/account/9hRv...
--------------------------------
```

## 트리 파라미터 이해

- **최대 깊이**: NFT의 최대 수 결정: `2^maxDepth` (깊이 14 = 16,384 NFT)
- **최대 버퍼 크기**: 동시에 발생할 수 있는 수정 횟수 제어
- **캐노피 깊이**: 증명의 일부를 온체인에 저장하여 트랜잭션 크기 감소

## 참고 사항

- 트리 이름은 네트워크별로 고유해야 합니다 (devnet/mainnet)
- 트리 이름에는 문자, 숫자, 하이픈, 언더스코어, 공백을 포함할 수 있습니다 (1-50자)
- 렌트 비용은 트리 생성 시 한 번만 지불합니다
- 트리는 생성 후 크기를 조정할 수 없습니다
- **경고**: 공개 트리에서는 누구나 NFT를 민트할 수 있습니다 - 주의해서 사용하세요
