---
title: 인터페이스 구현
metaTitle: 인터페이스 구현 | Umi
description: 공개 인터페이스 구현 개요
---
이 페이지는 [Umi에서 정의한 인터페이스](interfaces)의 사용 가능한 모든 구현을 나열하는 것을 목표로 합니다.

## 번들

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| Umi의 기본 번들 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-bundle-defaults) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-bundle-defaults) |
| Umi의 테스트 번들 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-bundle-tests) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-bundle-tests) |

## Signer

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| 내부 Signer 플러그인 | Metaplex | [Signers 문서](/ko/dev-tools/umi/public-keys-and-signers#signers) |
| Solana의 Wallet Adapters 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-signer-wallet-adapters) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-signer-wallet-adapters) |
| 메시지 서명에서 새 Signers 도출 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-signer-derived) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-signer-derived) |

## Eddsa Interface

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| Solana의 web3.js 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-eddsa-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-eddsa-web3js) |

## RPC Interface

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| Solana의 web3.js 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-rpc-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-rpc-web3js) |
| `getAccounts` 요청을 주어진 크기의 배치로 청크화하고 병렬로 실행하여 API 제한을 최종 사용자로부터 추상화하는 RPC 데코레이터 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-rpc-chunk-get-accounts) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-rpc-chunk-get-accounts) |

## Transaction Factory Interface

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| Solana의 web3.js 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-transaction-factory-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-transaction-factory-web3js) |

## Uploader Interface

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| AWS 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-aws) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-aws) |
| Irys.xyz 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-irys) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-irys) |
| 업로드 및 다운로드를 모의하기 위한 로컬 캐시 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-storage-mock) |
| 4EVERLAND 사용 | 4EVERLAND | [GitHub](https://github.com/4everland/umi-uploader-4everland) / [NPM](https://www.npmjs.com/package/@4everland/umi-uploader-4everland) |
| Bundlr.network 사용 (Deprecated - `umi-uploader-irys` 사용) | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-bundlr) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-bundlr) |

## Downloader Interface

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| Http 인터페이스 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-downloader-http) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-downloader-http) |
| 업로드 및 다운로드를 모의하기 위한 로컬 캐시 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-storage-mock) |

## Http Interface

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| `node-fetch` 라이브러리를 통한 fetch API 사용 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-http-fetch) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-http-fetch) |

## Program Repository Interface

| 설명 | 관리자 | 링크 |
| --- | --- | --- |
| 추가 의존성이 없는 기본 구현 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-program-repository) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-program-repository) |
