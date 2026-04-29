---
title: Core Collections
metaTitle: Core Collections 개요 | Metaplex Core
description: Solana의 Core Collections 개요 — Asset 그룹화, 공유 메타데이터 저장, 컬렉션 레벨 플러그인 적용에 대해 알아봅니다.
updated: '04-08-2026'
keywords:
  - NFT collection
  - Core Collection
  - mpl-core collection
  - group NFTs
  - collection metadata
about:
  - NFT collections
  - Collection management
proficiencyLevel: Beginner
faqs:
  - q: Collection과 Asset의 차이점은 무엇인가요?
    a: Collection은 Asset을 그룹화하는 컨테이너입니다. 자체 메타데이터를 가지지만 Asset처럼 소유하거나 전송할 수 없습니다. Asset은 사용자가 소유하는 실제 NFT입니다.
  - q: 기존 Asset을 Collection에 추가할 수 있나요?
    a: 네, newCollection 파라미터를 사용하여 update 명령어를 사용하면 됩니다. Asset의 Update Authority가 대상 Collection에 Asset을 추가할 권한을 가지고 있어야 합니다.
  - q: NFT에 Collection이 필요한가요?
    a: 아니요. Asset은 Collection 없이 독립적으로 존재할 수 있습니다. 하지만 Collection을 사용하면 컬렉션 레벨 로열티 설정, 더 쉬운 검색, 일괄 작업이 가능해집니다.
  - q: Collection에서 Asset을 제거할 수 있나요?
    a: 네, update 명령어를 사용하여 Asset의 컬렉션을 변경하면 됩니다. Asset과 Collection 모두에 대한 적절한 권한이 필요합니다.
  - q: Collection을 삭제하면 어떻게 되나요?
    a: Collection은 Asset이 포함되어 있는 동안 삭제할 수 없습니다. 먼저 모든 Asset을 제거한 후 Collection 계정을 닫을 수 있습니다.
---

## Summary

**Core Collection**은 관련 [Core Asset](/smart-contracts/core/what-is-an-asset)을 공유 메타데이터와 플러그인 아래에 그룹화하는 Solana 계정입니다.

- Collection은 이름, URI, 그리고 모든 멤버 Asset에 적용되는 선택적 플러그인을 저장합니다
- Asset은 생성 또는 업데이트 시 `collection` 필드를 통해 Collection을 참조합니다
- 컬렉션 레벨 플러그인(예: [Royalties](/smart-contracts/core/plugins/royalties))은 Asset 레벨에서 재정의되지 않는 한 모든 멤버 Asset에 적용됩니다
- Collection 생성에는 렌트로 약 0.0015 SOL이 필요합니다

**작업으로 이동:** [Collection 생성](/smart-contracts/core/collections/create) · [Collection 조회](/smart-contracts/core/collections/fetch) · [Collection 업데이트](/smart-contracts/core/collections/update)

## Collection이란?

Core Collection은 같은 시리즈나 세트에 속하는 Asset의 그룹입니다. Asset을 그룹화하려면 먼저 컬렉션 이름과 이미지 URI 등 공유 메타데이터를 저장하는 Collection 계정을 생성해야 합니다. Collection 계정은 컬렉션의 표지 역할을 하며 컬렉션 전체 플러그인도 보유할 수 있습니다.

Collection 계정에 저장되는 데이터는 다음과 같습니다:

| 필드 | 설명 |
| --- | --- |
| key | 계정 키 식별자 |
| updateAuthority | 컬렉션의 관리자 |
| name | 컬렉션 이름 |
| uri | 컬렉션의 오프체인 메타데이터 URI |
| numMinted | 컬렉션에서 생성된 총 Asset 수 |
| currentSize | 현재 컬렉션 내 Asset 수 |

{% callout type="note" %}
Core Collection은 Core Asset만 그룹화합니다. Token Metadata NFT에는 [mpl-token-metadata](https://developers.metaplex.com/token-metadata)를, 압축 NFT에는 [Bubblegum](/smart-contracts/bubblegum)을 사용하세요.
{% /callout %}

## 컬렉션 멤버십 관리

Asset은 생성 후 `update` 명령어를 사용해 Collection에 추가, 이동, 또는 제거할 수 있습니다. 이러한 작업은 Asset의 [update authority](/smart-contracts/core/update)를 변경합니다. 추가하면 Collection으로 설정되고, 제거하면 지갑 주소로 돌아옵니다.

| 작업 | 설명 | 가이드 |
|-----------|-------------|-------|
| Collection에 Asset 추가 | 독립 Asset을 Collection에 할당 | [SDK](/smart-contracts/core/update#add-an-asset-to-a-collection) · [CLI](/dev-tools/cli/core/update-asset#add-an-asset-to-a-collection) |
| Asset을 다른 Collection으로 이동 | Asset을 한 Collection에서 다른 Collection으로 이전 | [SDK](/smart-contracts/core/update#change-the-collection-of-a-core-asset) · [CLI](/dev-tools/cli/core/update-asset#move-an-asset-to-a-different-collection) |
| Collection에서 Asset 제거 | Asset을 분리하여 독립 상태로 복원 | [SDK](/smart-contracts/core/update#remove-an-asset-from-a-collection) · [CLI](/dev-tools/cli/core/update-asset#remove-an-asset-from-a-collection) |

{% callout type="note" %}
멤버십을 변경하려면 Collection의 update authority(독립 상태인 경우 Asset도 포함)여야 합니다. Collection 간 이동에는 소스와 대상 Collection 모두에 대한 권한이 필요합니다.

**Collection**에 등록된 [Update Delegate](/smart-contracts/core/plugins/update-delegate)도 루트 update authority의 서명 없이 이러한 작업을 수행할 수 있습니다. Collection에서 Asset 제거 및 권한을 가진 Asset 추가가 가능합니다.
{% /callout %}

## Notes

- Asset은 Collection 없이 독립적으로 존재할 수 있습니다 — Collection은 필수가 아닙니다
- 컬렉션 레벨 플러그인은 동일한 타입의 자체 플러그인을 가진 Asset을 제외한 멤버 Asset에 상속됩니다
- `numMinted`는 컬렉션에서 생성된 모든 Asset의 누적 수이고, `currentSize`는 실시간 카운트입니다
- Collection은 Asset이 포함된 동안 닫을 수 없습니다 — 먼저 모든 Asset을 제거하세요

## Quick Reference

### 프로그램 ID

| 네트워크 | 주소 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### Collection 작업

| 작업 | 페이지 | SDK 함수 |
|-----------|------|--------------|
| Collection 생성 | [Collection 생성](/smart-contracts/core/collections/create) | `createCollection` |
| Collection 조회 | [Collection 조회](/smart-contracts/core/collections/fetch) | `fetchCollection` |
| Collection 메타데이터 업데이트 | [Collection 업데이트](/smart-contracts/core/collections/update) | `updateCollection` |
| Collection 플러그인 업데이트 | [Collection 업데이트](/smart-contracts/core/collections/update) | `updateCollectionPlugin` |

### 비용 내역

| 항목 | 비용 |
|------|------|
| Collection 계정 렌트 | 약 0.0015 SOL |
| 트랜잭션 수수료 | 약 0.000005 SOL |
| **합계** | **약 0.002 SOL** |

## FAQ

### Collection과 Asset의 차이점은 무엇인가요?

Collection은 Asset을 그룹화하는 컨테이너입니다. 자체 메타데이터(이름, 이미지)를 가지지만 Asset처럼 소유하거나 전송할 수 없습니다. Asset은 사용자가 소유하는 실제 NFT입니다.

### 기존 Asset을 Collection에 추가할 수 있나요?

네, `newCollection` 파라미터를 사용하여 `update` 명령어를 사용하면 됩니다. Asset의 Update Authority가 대상 Collection에 Asset을 추가할 권한을 가지고 있어야 합니다.

### NFT에 Collection이 필요한가요?

아니요. Asset은 Collection 없이 독립적으로 존재할 수 있습니다. 하지만 Collection을 사용하면 컬렉션 레벨 로열티 설정, 더 쉬운 검색, 일괄 작업이 가능해집니다.

### Collection에서 Asset을 제거할 수 있나요?

네, `update` 명령어를 사용하여 Asset의 컬렉션을 변경하면 됩니다. Asset과 Collection 모두에 대한 적절한 권한이 필요합니다.

### Collection을 삭제하면 어떻게 되나요?

Collection은 Asset이 포함되어 있는 동안 삭제할 수 없습니다. 먼저 모든 Asset을 제거한 후 Collection 계정을 닫을 수 있습니다.

## Glossary

| 용어 | 정의 |
|------|------------|
| **Collection** | 관련 Asset을 공유 메타데이터 아래에 그룹화하는 Core 계정 |
| **Update Authority** | Collection 메타데이터와 플러그인을 수정할 수 있는 계정 |
| **numMinted** | 컬렉션에서 생성된 총 Asset 수를 추적하는 카운터 |
| **currentSize** | 현재 컬렉션 내 Asset 수 |
| **Collection Plugin** | 모든 멤버 Asset에 적용될 수 있는 Collection에 부착된 플러그인 |
| **URI** | Collection의 오프체인 JSON 메타데이터를 가리키는 URL |
