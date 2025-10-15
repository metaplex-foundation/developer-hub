---
title: Solana에서 NFT를 생성하는 방법
metaTitle: Solana에서 NFT를 생성하는 방법 | 가이드
description: Metaplex 패키지를 사용하여 Solana 블록체인에서 NFT를 생성하는 방법을 알아보세요.
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

Metaplex는 **Core**, **Token Metadata**, **Bubblegum**을 포함하여 Solana 블록체인에서 NFT를 생성하기 위한 3가지 다른 표준을 제공합니다. 각 표준과 프로토콜은 프로젝트에 고유한 장점을 제공하며 프로젝트의 민팅 및 NFT 요구사항의 넓은 스펙트럼에 걸쳐 분산되어 있습니다.

## Core Asset (권장)

Core는 Metaplex가 개발한 가장 새롭고 진보된 디지털 자산 표준입니다. 이 표준은 최적화된 계정 구조와 강력한 플러그인 시스템을 통한 향상된 기능을 제공합니다.

#### Core를 사용하는 이유:

- 최신 표준: Core는 현재까지 Metaplex가 개발한 가장 새롭고 강력한 디지털 자산 표준입니다.
- 단순성: Core는 **단순성 우선 접근법**으로 처음부터 설계되었습니다.
- 플러그인: Core는 Core Assets과 Collections이 추가 상태를 저장하고, 라이프사이클 검증을 제공하며, 향상된 동적 경험을 제공할 수 있게 하는 고급 플러그인 시스템을 제공합니다. 여기서 가능성은 무한합니다!
- 비용: Bubblegum만큼 저렴하지는 않지만, Core는 최적화된 계정 구조로 인해 Token Metadata에 비해 생성과 민팅이 **훨씬 저렴**합니다.

[Core로 NFT 생성하기](/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)

## Token Metadata NFT/pNFT

Token Metadata는 모든 것을 시작한 Solana NFT 표준입니다. 2021년에 생성된 Token Metadata는 첫 시작 이후 무려 5억 1,200만 개의 NFT가 민팅되면서 Solana 블록체인에서 NFT의 길을 열었습니다.

#### Token Metadata를 사용하는 이유:

- 검증되고 신뢰할 수 있음: Token Metadata는 Solana Monkey Business, DeGods, Claynosaurus 등의 프로젝트에서 지난 4년간 Solana의 주요 NFT 토큰 표준으로 사용되었습니다.
- 생태계 지원: NFT와 pNFT는 MagicEden, Tensor, Phantom, Solflare 등과 같은 마켓플레이스와 지갑에서 Solana 전체적으로 지원됩니다.
- SPL 토큰 기반: Token Metadata NFT/pNFT는 Solana의 SPL 토큰 프로그램을 기반으로 합니다.

[Token Metadata로 NFT/pNFT 생성하기](/token-metadata/guides/javascript/create-an-nft)

## Bubblegum cNFT

대량으로 저렴하게 NFT를 생성하는 경우 Bubblegum이 선택할 프로토콜입니다. Bubblegum은 개별 NFT마다 계정을 생성하는 대신 머클 트리 접근법을 적용하여 **압축된 NFT(cNFT)**의 기술을 사용합니다.

#### Bubblegum을 사용하는 이유:

- 저렴한 배포: 머클 트리 기반 제품인 트리는 필요시 수백만 개의 NFT를 저장할 수 있으면서도 배포가 저렴합니다.
- 대량 에어드롭: 트리가 생성되면 트리의 저장소에 대한 비용이 이미 지불되었으므로 cNFT 에어드롭 비용은 거의 존재하지 않습니다.

[Bubblegum으로 Solana에서 1,000,000개의 NFT 생성하기](/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana)