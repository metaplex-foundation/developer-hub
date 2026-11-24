---
title: 트리 생성
metaTitle: 머클 트리 생성 | Metaplex CLI
description: Metaplex CLI의 mplx bg tree create 명령으로 압축 NFT용 Bubblegum V2 머클 트리를 생성합니다. --canopyDepth 0 등 캐노피 깊이 옵션도 다룹니다.
keywords:
  - mplx cli
  - bg tree create
  - Bubblegum V2
  - merkle tree
  - canopy depth
  - compressed NFTs
  - cNFT tree
about:
  - Bubblegum V2 Merkle tree creation
  - Metaplex CLI
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '10-28-2026'
---

## 요약

`mplx bg tree create` 명령은 압축 NFT(cNFT)를 저장할 [Bubblegum V2](/smart-contracts/bubblegum-v2) [머클 트리](/smart-contracts/bubblegum-v2/concurrent-merkle-trees)를 생성합니다. 압축 NFT를 민트하기 전에 트리를 생성해야 합니다.

- `--wizard`로 대화형으로, 또는 `--maxDepth`, `--maxBufferSize`, `--canopyDepth`로 직접 트리 생성
- `--canopyDepth`에는 `0`(캐노피 없는 트리)을 포함한 모든 정수를 지정 가능 (CLI 0.4.5 이상)
- 플래그 조합이 권장 구성에 없으면 경고를 표시하지만 트리는 생성됨
- 트리 크기와 캐노피 깊이는 생성 시 고정되며 이후 변경할 수 없음

{% callout type="note" %}
이것은 **Bubblegum V2** 트리를 생성합니다. V2 트리는 V1과 호환되지 않으며 [Metaplex Core 컬렉션](/smart-contracts/core/collections)을 사용합니다.
{% /callout %}

## 기본 사용법

이 명령은 대화형 마법사로 실행하거나, 트리 크기 플래그 세 개를 모두 직접 지정하여 실행합니다.

### 대화형 마법사 (권장)

```bash {% title="마법사로 트리 생성" %}
mplx bg tree create --wizard
```

### 직접 생성

```bash {% title="플래그를 지정하여 트리 생성" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

직접 생성하려면 `--maxDepth`, `--maxBufferSize`, `--canopyDepth`가 모두 필요합니다. 하나라도 빠지면 명령은 `You must either use --wizard or provide all required flags: --maxDepth, --maxBufferSize, --canopyDepth` 메시지와 함께 종료됩니다.

## 옵션

트리 크기 플래그는 `--wizard`와 함께 사용할 수 없습니다.

| 옵션 | 설명 |
|--------|-------------|
| `--wizard` | 대화형 마법사를 사용하여 트리 생성 |
| `--maxDepth <value>` | 트리의 최대 깊이 (최대 NFT 수 결정) |
| `--maxBufferSize <value>` | 동시 변경을 위한 최대 버퍼 크기 |
| `--canopyDepth <value>` | 온체인에 캐시할 트리 상위 레벨 수. `0`도 유효하며 캐노피 없는 트리를 생성 |
| `--public` | 트리를 공개로 설정 (누구나 NFT 민트 가능) |
| `--name <value>` | 쉽게 참조할 수 있는 짧은 이름 |

## 전역 플래그

이 플래그는 모든 `mplx` 트랜잭션 명령에서 공통으로 사용되며, 사용할 설정, 서명자, 클러스터를 제어합니다.

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 레저 경로 (예: `usb://ledger?key=0`) |
| `-p, --payer <value>` | 지불자 키페어 파일 또는 레저 경로 |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--commitment <option>` | 커밋먼트 레벨: `processed`, `confirmed`, 또는 `finalized` |
| `--json` | JSON 형식으로 출력 |
| `--log-level <option>` | 로그 레벨: `debug`, `warn`, `error`, `info`, 또는 `trace` (기본값: `info`) |

## 권장 트리 구성

CLI에는 7가지 권장 구성이 포함되어 있으며, 마법사에서 이 구성들을 선택지로 제공합니다:

| 최대 NFT | 최대 깊이 | 버퍼 크기 | 캐노피 깊이 | Tx당 증명 바이트 | 예상 비용 |
|----------|-----------|-------------|--------------|--------------------|----------------|
| 16,384 | 14 | 64 | 8 | 192 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | 192 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | 192 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | 224 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | 288 | ~26.12 SOL |
| 67,108,864 | 26 | 2048 | 17 | 288 | ~70.82 SOL |
| 1,073,741,824 | 30 | 2048 | 17 | 416 | ~72.65 SOL |

다른 플래그 조합으로도 트리는 생성되지만, CLI가 먼저 `This configuration is not in our recommended list. Use --wizard to see recommended configurations.`를 출력합니다.

## 캐노피 없는 트리 (`--canopyDepth 0`)

`--canopyDepth 0`을 지정하면 증명 노드를 온체인에 전혀 캐시하지 않는 트리가 생성됩니다. 트리 계정이 가장 작아지고 렌트도 가장 저렴합니다. 대신 전송, 소각, 위임, 업데이트할 때마다 전체 증명(`maxDepth` × 32바이트)을 보내야 합니다. 따라서 트랜잭션 공간을 더 많이 사용하고, Bubblegum 명령을 다른 프로그램과 하나의 트랜잭션에서 조합하기 어려워집니다. 캐노피 깊이별 비용 비교는 [머클 트리 캐노피](/smart-contracts/bubblegum-v2/merkle-tree-canopy) 페이지를 참고하세요.

```bash {% title="캐노피 없는 트리 생성" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 0 --name "no-canopy-tree"
```

{% callout type="note" %}
`--canopyDepth 0`은 `@metaplex-foundation/cli` 0.4.5 이상이 필요합니다. 캐노피 없는 트리는 권장 구성에 포함되지 않으므로, CLI는 생성 전에 "not in our recommended list" 경고를 출력합니다.
{% /callout %}

## 예시

트리를 생성하는 가장 일반적인 방법은 다음과 같습니다:

1. 마법사를 사용하여 트리 생성:

```bash {% title="마법사" %}
mplx bg tree create --wizard
```

1. 테스트용 작은 트리 생성:

```bash {% title="작은 테스트 트리" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
```

1. 공개 트리 생성 (누구나 민트 가능):

```bash {% title="공개 트리" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
```

## 트리 생성 출력

성공하면 트리 주소, 파라미터, 익스플로러 링크가 출력됩니다:

```text {% title="출력 예시" %}
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

세 가지 파라미터가 트리의 용량, 동시에 처리할 수 있는 변경 수, 각 트랜잭션에 필요한 증명 데이터 양을 결정합니다:

- **최대 깊이**: NFT의 최대 수 결정: `2^maxDepth` (깊이 14 = 16,384 NFT)
- **최대 버퍼 크기**: 동시에 발생할 수 있는 수정 횟수 제어
- **캐노피 깊이**: 트리의 상위 레벨을 온체인에 저장하므로, 각 트랜잭션은 `maxDepth - canopyDepth`개의 증명 노드만 보내면 됩니다. `0`이면 아무것도 저장하지 않습니다

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령 | `mplx bg tree create` |
| 필수 (직접 모드) | `--maxDepth`, `--maxBufferSize`, `--canopyDepth` |
| `--canopyDepth` 최솟값 | `0` (CLI 0.4.5 이상) |
| 트리 버전 | [Bubblegum V2](/smart-contracts/bubblegum-v2) 전용 (Bubblegum V1 미지원) |
| 다음 단계 | [압축 NFT 생성](/dev-tools/cli/bubblegum/create-cnft) |
| 소스 | [GitHub: metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 참고 사항

- 트리 이름은 네트워크별로 고유해야 합니다 (devnet/mainnet)
- 트리 이름에는 문자, 숫자, 하이픈, 언더스코어, 공백을 포함할 수 있습니다 (1-50자)
- 렌트 비용은 트리 생성 시 한 번만 지불합니다
- 트리는 생성 후 크기를 조정할 수 없으며, 캐노피 깊이도 변경할 수 없습니다
- 0.4.5 이전 CLI는 `--canopyDepth 0`을 거부합니다. `mplx --version`으로 버전을 확인하세요
- **경고**: 공개 트리에서는 누구나 NFT를 민트할 수 있습니다 - 주의해서 사용하세요
