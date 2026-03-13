---
title: Bubblegum 개요
metaTitle: Bubblegum V2 (압축 NFT) | Metaplex CLI
description: Bubblegum V2 프로그램을 사용하여 압축 NFT 생성 및 관리
---

# Bubblegum (압축 NFT)

{% callout type="note" %}
이 CLI 명령은 **Bubblegum V2** 전용입니다. Bubblegum V2는 [Metaplex Core 컬렉션](/smart-contracts/core/collections)을 사용하며 Bubblegum V1 트리 또는 Token Metadata 컬렉션과 호환되지 않습니다.
{% /callout %}

Bubblegum은 기존 NFT보다 훨씬 저렴한 비용으로 NFT를 생성할 수 있는 Metaplex의 압축 NFT(cNFT) 프로그램입니다. 상태 압축을 위한 동시 머클 트리를 사용하여 초기 트리 생성 비용 이후에는 트랜잭션 비용만으로 압축 NFT를 민트할 수 있습니다.

## 핵심 개념

### 머클 트리
압축 NFT는 개별 온체인 계정이 아닌 머클 트리에 저장됩니다. 압축 NFT를 민트하기 전에 트리를 생성해야 합니다. 트리 크기는 다음을 결정합니다:
- 저장할 수 있는 최대 NFT 수
- 선불 렌트 비용 (트리 생성 시 한 번만 지불)
- 작업에 필요한 증명 크기

### 컬렉션
Bubblegum V2는 [Metaplex Core 컬렉션](/smart-contracts/core/collections)을 사용합니다 (Token Metadata 컬렉션이 아님). 먼저 Core 컬렉션을 생성하세요:

```bash
mplx core collection create --wizard
```

### RPC 요구 사항

압축 NFT 작업에는 [DAS (Digital Asset Standard) API](/solana/rpcs-and-das#metaplex-das-api)를 지원하는 RPC 엔드포인트가 필요합니다. 표준 Solana RPC 엔드포인트는 DAS를 지원하지 않으며 압축 NFT의 조회, 업데이트, 전송 또는 소각에 작동하지 않습니다.

DAS를 지원하는 프로바이더 목록은 [RPC 프로바이더](/solana/rpcs-and-das) 페이지를 참조하세요.

## 명령 구조

모든 Bubblegum 명령은 다음 패턴을 따릅니다:

```bash
mplx bg <resource> <command> [options]
```

### 사용 가능한 명령

**트리 관리**
- `mplx bg tree create` - 새 머클 트리 생성
- `mplx bg tree list` - 저장된 모든 트리 나열

**NFT 작업**
- `mplx bg nft create` - 압축 NFT 민트
- `mplx bg nft fetch` - NFT 데이터 및 머클 증명 조회
- `mplx bg nft update` - NFT 메타데이터 업데이트
- `mplx bg nft transfer` - NFT를 새 소유자에게 전송
- `mplx bg nft burn` - NFT 영구 삭제

## 빠른 시작

1. DAS 지원 RPC 구성:

```bash
mplx config rpcs add <name> <url>
```

1. 머클 트리 생성:

```bash
mplx bg tree create --wizard
```

1. 컬렉션 생성 (선택 사항이지만 권장):

```bash
mplx core collection create --wizard
```

1. 압축 NFT 민트:

```bash
mplx bg nft create my-tree --wizard
```

## 권한 모델

| 작업 | 필요한 권한 |
|-----------|-------------------|
| NFT 생성 | 트리 권한 (또는 트리가 공개인 경우 누구나) |
| NFT 업데이트 | 트리 권한 또는 컬렉션 업데이트 권한 |
| NFT 전송 | 현재 소유자 또는 위임자 |
| NFT 소각 | 현재 소유자 또는 위임자 |

## 다음 단계

- [머클 트리 생성](/dev-tools/cli/bubblegum/create-tree)
- [압축 NFT 생성](/dev-tools/cli/bubblegum/create-cnft)
- [압축 NFT 조회](/dev-tools/cli/bubblegum/fetch-cnft)
