---
title: 트리 목록
metaTitle: 머클 트리 목록 | Metaplex CLI
description: 저장된 모든 Bubblegum 머클 트리 보기
---

`mplx bg tree list` 명령은 생성하고 로컬에 저장한 모든 머클 트리를 표시합니다.

## 기본 사용법

```bash
mplx bg tree list
```

### 네트워크로 필터링

```bash
mplx bg tree list --network devnet
```

## 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--network <value>` | 네트워크로 트리 필터링 (mainnet, devnet, testnet, localnet) |

## 전역 플래그

| 플래그 | 설명 |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `--json` | JSON 형식으로 출력 |

## 예시

1. 모든 트리 나열:

```bash
mplx bg tree list
```

1. devnet 트리만 나열:

```bash
mplx bg tree list --network devnet
```

1. mainnet 트리만 나열:

```bash
mplx bg tree list --network mainnet
```

## 출력

```text
Saved Trees:
┌─────────┬────────────────────────────────────────────┬─────────┬───────────┬────────┬────────────┐
│ Name    │ Address                                    │ Network │ Max NFTs  │ Public │ Created    │
├─────────┼────────────────────────────────────────────┼─────────┼───────────┼────────┼────────────┤
│ my-tree │ 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ devnet  │ 16,384    │ No     │ 1/15/2025  │
│ prod    │ 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ mainnet │ 1,048,576 │ No     │ 1/10/2025  │
└─────────┴────────────────────────────────────────────┴─────────┴───────────┴────────┴────────────┘

Total: 2 trees
```

## 트리 이름 사용

이름으로 트리를 저장하면 다른 명령에서 이름으로 참조할 수 있습니다:

```bash
# 트리 이름 사용
mplx bg nft create my-tree --wizard

# 트리 주소 사용 (이것도 작동함)
mplx bg nft create 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --wizard
```

## 참고 사항

- 트리는 네트워크별로 저장되므로 동일한 이름이 다른 네트워크에 존재할 수 있습니다
- 트리 데이터는 `~/.config/mplx/trees.json`에 로컬로 저장됩니다
- 트리를 찾을 수 없는 경우 명령은 `mplx bg tree create --wizard`로 트리를 생성하도록 제안합니다
