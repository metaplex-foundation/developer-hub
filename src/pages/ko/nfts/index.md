---
title: NFT
metaTitle: NFT | Metaplex
description: Metaplex Core를 사용하여 Solana에서 NFT를 생성하고 관리하는 방법을 알아보세요.
---

Metaplex Core를 사용하여 Solana에서 NFT(대체 불가능 토큰)를 생성하고 관리합니다. {% .lead %}

## 개요

대체 불가능 토큰(NFT)은 예술품, 수집품, 게임 내 아이템 등의 소유권을 나타내는 고유한 디지털 자산입니다. Metaplex Core는 단일 계정 설계로 비용을 절감하고 성능을 향상시킨, Solana에서 NFT를 생성하고 관리하는 현대적이고 효율적인 방법을 제공합니다.

## 할 수 있는 것

이 섹션에서는 일반적인 NFT 작업에 대한 초보자 친화적인 가이드를 제공합니다:

- **[NFT 생성하기](/ko/nfts/create-nft)** - 커스텀 메타데이터로 새 NFT 생성
- **[NFT 가져오기](/ko/nfts/fetch-nft)** - 블록체인에서 NFT 데이터 조회
- **[NFT 업데이트하기](/ko/nfts/update-nft)** - NFT 이름 또는 메타데이터 업데이트
- **[NFT 전송하기](/ko/nfts/transfer-nft)** - 지갑 간 NFT 소유권 전송
- **[NFT 소각하기](/ko/nfts/burn-nft)** - NFT 영구 삭제

## 사전 요구 사항

시작하기 전에 다음을 확인하세요:

- Node.js 16 이상 설치
- 트랜잭션 수수료를 위한 SOL이 있는 Solana 지갑
- JavaScript/TypeScript 기본 지식

## 빠른 시작

필요한 패키지를 설치합니다:

```bash
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

그런 다음 [NFT 생성하기](/ko/nfts/create-nft) 가이드를 따라 Metaplex Core로 첫 번째 NFT를 생성하세요.

## 더 알아보기

더 고급 NFT 기능에 대해서는 다음을 확인하세요:

- [Core 문서](/ko/smart-contracts/core) - Metaplex Core 전체 문서
- [Core 플러그인](/ko/smart-contracts/core/plugins) - 플러그인으로 NFT 기능 확장
- [Core 컬렉션](/ko/smart-contracts/core/collections) - NFT를 컬렉션으로 정리
