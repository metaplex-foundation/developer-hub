---
title: FAQ
metaTitle: FAQ | Inscription
description: Metaplex Inscription에 대한 자주 묻는 질문
---

## Inscription의 의미는 무엇인가요?

일반적인 믿음과는 달리, Inscription은 검증자를 울게 만드는 것보다 훨씬 더 많은 용도로 사용될 수 있습니다. 온체인에 임의 데이터를 작성하는 능력은 Solana 프로그램 통합에 엄청난 이점을 제공합니다. 처음에는 이것의 주요 사용 사례가 NFT가 될 것이며, 모든 NFT 데이터를 Solana에 저장하는 방법을 제공합니다. 이를 통해 프로그램의 온체인 특성 기반 게이팅, 커스텀 프로그램을 작성하지 않고 추가 NFT 메타데이터를 저장하는 방법(예: 게임 스탯 블록, NFT 히스토리, 추가 정보 등), 그리고 Solana 프로그램에서 직접적인 동적 이미지 생성과 같은 많은 사용 사례가 가능해집니다.

## 어디서 inscription을 할 수 있나요?

- [Metaplex Inscription UI](https://inscriptions.metaplex.com)는 Solana의 기존 NFT를 새기기 위한 노코드 참조 구현입니다. 이 UI를 통해 제작자들은 업데이트 권한을 가진 모든 NFT를 볼 수 있고 NFT JSON과 이미지를 Solana에 저장하는 Inscription 플로우를 안내받을 수 있습니다.

  {% callout type="note" %}

  브라우저 지갑의 제한으로 인해 대량 Inscription에는 UI 사용을 권장하지 않습니다. 수백 번의 트랜잭션 승인을 절약하려면 대신 CLI를 사용해 주세요.

  {% /callout %}

- [Inscription CLI](https://github.com/metaplex-foundation/mpl-inscription/tree/main/clients/cli)는 NFT의 대량 Inscription을 처리하는 명령줄 도구입니다.

## 비용은 얼마나 드나요?

Inscription 비용은 기본적으로 계정 임대료에 대한 0.003306 SOL 오버헤드와 새겨지는 실제 데이터의 0.00000696 SOL / 바이트 공간 비용으로 구성됩니다. 이 비용 계산을 쉽게 하는 여러 도구가 있습니다:

- 이미지와 JSON 크기를 입력하여 총 비용을 계산할 수 있는 [Inscription 계산기](https://www.sackerberg.dev/tools/inscriptionCalculator).
- Inscription UI에는 고급 압축 도구가 포함되어 있어 각 NFT를 동적으로 크기 조정하고 압축하여 품질 x 비용 트레이드오프를 측정할 수 있습니다.
- Inscription CLI에는 대량 Inscription의 총 비용을 측정하는 도구가 포함되어 있습니다.

## 새로운 NFT는 어떻게 inscription하나요?

새로운 NFT는 먼저 생성 도구를 통해 민팅한 후 inscription할 수 있습니다(권장 도구는 [Truffle](https://truffle.wtf/)과 [Sol Tools](https://sol-tools.io/)입니다). 민팅 후, 이러한 새로운 NFT는 Inscription UI와 CLI 도구에 나열됩니다.