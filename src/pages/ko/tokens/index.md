---
title: 대체 가능 토큰
metaTitle: 대체 가능 토큰 | Metaplex
description: Metaplex SDK를 사용하여 Solana에서 대체 가능 토큰을 생성하고 관리하는 방법을 알아보세요.
---

Metaplex SDK를 사용하여 Solana에서 대체 가능 토큰(SPL 토큰)을 생성하고 관리합니다. {% .lead %}

## 개요

대체 가능 토큰은 각 단위가 다른 단위와 동일한 교환 가능한 디지털 자산입니다. 일반적인 예로는 암호화폐, 로열티 포인트, 게임 내 화폐 등이 있습니다. Solana에서 대체 가능 토큰은 SPL Token 프로그램을 사용하여 생성되며, 메타데이터는 Token Metadata 프로그램에서 관리됩니다.

## 할 수 있는 것

이 섹션에서는 일반적인 토큰 작업에 대한 초보자 친화적인 가이드를 제공합니다:

- **[토큰 생성하기](/tokens/create-a-token)** - 커스텀 메타데이터로 새 대체 가능 토큰 생성
- **[토큰 데이터 읽기](/tokens/read-token)** - 블록체인 또는 DAS API에서 토큰 정보 조회
- **[토큰 발행하기](/tokens/mint-tokens)** - 추가 토큰을 발행하여 공급량 증가
- **[토큰 전송하기](/tokens/transfer-a-token)** - 지갑 간 토큰 전송
- **[토큰 메타데이터 업데이트하기](/tokens/update-token)** - 토큰 이름, 심볼 또는 이미지 업데이트
- **[토큰 소각하기](/tokens/burn-tokens)** - 유통에서 토큰을 영구 삭제

## 사전 요구 사항

시작하기 전에 다음을 확인하세요:

- Node.js 16 이상 설치
- 트랜잭션 수수료를 위한 SOL이 있는 Solana 지갑
- JavaScript/TypeScript 기본 지식

## 빠른 시작

필요한 패키지를 설치합니다:

```bash
npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

그런 다음 [토큰 생성하기](/tokens/create-a-token) 가이드를 따라 첫 번째 대체 가능 토큰을 생성하세요.

## 더 알아보기

더 고급 토큰 기능에 대해서는 다음을 확인하세요:

- [Token Metadata 프로그램](/token-metadata) - Token Metadata 프로그램 전체 문서
- [MPL Toolbox](https://github.com/metaplex-foundation/mpl-toolbox) - 저수준 토큰 작업
