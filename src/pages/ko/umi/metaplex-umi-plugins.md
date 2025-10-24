---
title: Metaplex Umi 플러그인
metaTitle: Metaplex Umi 플러그인 | Umi
description: Metaplex가 구축한 Umi 플러그인 개요
---

Metaplex 프로그램들은 Kinobi를 통해 생성되어 Umi를 통한 플러그인으로 작동하고 실행됩니다. Metaplex 라이브러리의 각 프로그램은 Solana 생태계에서 다른 용도와 목적을 가지고 있습니다. Umi와 함께 사용할 수 있는 더 많은 플러그인은 [인터페이스 구현 페이지](/umi/implementations)에서 찾을 수 있습니다!

## [Bubblegum (cNFT)](/bubblegum)

Bubblegum은 Solana 블록체인에서 cNFT(압축 NFT) 생성 및 관리를 다루는 Metaplex 프로그램입니다. cNFT는 Token Metadata의 전통적인 NFT 및 pNFT 대응물보다 생성과 민팅 비용이 저렴합니다.

프로그램 기능 세트에는 다음이 포함됩니다:

- 민팅
- 업데이트
- 전송
- 소각
- 위임
- 컬렉션 관리

## [Candy Machine](/candy-machine)

Candy Machine은 '판매용' NFT 및 pNFT 드롭을 설정할 수 있게 해주는 Metaplex 프로그램입니다. 사용자는 캔디머신에서 구매하여 그 안에 있는 무작위 NFT/pNFT를 받을 수 있습니다.

프로그램 기능 세트에는 다음이 포함됩니다:

- NFT 민팅
- NFT 판매

## [Core](/core)

Core는 단일 계정 설계를 사용하는 차세대 Solana NFT 표준으로, 민팅 비용을 줄이고 대안과 비교하여 Solana 네트워크 부하를 개선합니다. 또한 개발자가 자산의 동작과 기능을 수정할 수 있는 유연한 플러그인 시스템을 가지고 있습니다.

프로그램 기능 세트에는 다음이 포함됩니다:

- 민팅
- 업데이트
- 전송
- 소각
- 위임
- 내부 및 외부 플러그인 관리
- 역직렬화
- 컬렉션 관리

## [DAS API](/das-api)

압축되지 않은 NFT의 상태 데이터는 모두 온체인 계정에 저장됩니다. 이는 대규모에서 비용이 많이 듭니다. 압축 NFT는 상태 데이터를 온체인 머클 트리로 인코딩하여 공간을 절약합니다. 자세한 계정 데이터는 온체인에 저장되지 않고 RPC 제공자가 관리하는 데이터 저장소에 저장됩니다. Metaplex DAS(Digital Asset Standard) API는 표준(Token Metadata) 및 압축(Bubblegum) 자산을 모두 지원하는 Solana의 디지털 자산과 상호작용하기 위한 통합 인터페이스를 나타냅니다.

프로그램 기능 세트에는 다음이 포함됩니다:

- 압축 NFT를 포함한 빠른 데이터 가져오기

## [Inscriptions](/inscription)

Metaplex Inscription 프로그램을 사용하면 블록체인을 데이터 저장 방법으로 사용하여 Solana에 직접 데이터를 쓸 수 있습니다. Inscription 프로그램은 또한 이 데이터 저장을 NFT에 선택적으로 연결할 수 있게 해줍니다. 이 개요에서는 이 프로그램이 어떻게 작동하는지 그리고 고급 수준에서 다양한 기능을 어떻게 활용할 수 있는지 설명합니다.

프로그램 기능 세트에는 다음이 포함됩니다:

- Solana 블록체인에 직접 데이터 쓰기
- Solana 블록체인에서 인스크립션 데이터 읽기

## [Token Metadata (NFT, pNFT)](/token-metadata)

Token Metadata는 NFT와 pNFT의 생성 및 관리를 다루는 Metaplex 프로그램입니다. Token Metadata NFT는 Solana의 첫 번째 NFT 표준이었고, pNFT는 나중에 로열티 강제 기능을 포함하여 생성되었습니다.

프로그램 기능 세트에는 다음이 포함됩니다:

- 데이터 가져오기
- 민팅
- 업데이트
- 전송
- 소각
- 위임
- 컬렉션 관리


## [Toolbox](/toolbox)

Mpl Toolbox에는 탈중앙화 애플리케이션을 시작하고 실행하는 데 필요한 필수 Solana 및 Metaplex 프로그램이 포함되어 있습니다.

- SOL 전송
- SPL 토큰 생성/관리
- LUT 생성/관리 (주소 조회 테이블)
- 컴퓨트 유닛 및 가격 설정/수정