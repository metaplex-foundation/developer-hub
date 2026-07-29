---
title: Token Entangler
metaTitle: Token Entangler | 개발자 허브
description: Metaplex의 더 이상 사용되지 않는 Token Entangler 프로그램에 대한 문서입니다.
---

# 개요

{% callout type="warning" %}

이 프로그램은 더 이상 사용되지 않는 것으로 표시되어 있으며 Metaplex Foundation 팀에서 더 이상 적극적으로 유지 관리하지 않습니다. 새로운 기능, 보안 수정 및 하위 호환성이 보장되지 않습니다. 주의해서 사용하시기 바랍니다.

{% /callout %}

## 소개

Metaplex의 Token Entangler 프로그램은 양자 역학에서 바로 가져온 것입니다! 두 개의 NFT를 함께 얽히게 하여 한 번에 하나만 존재할 수 있도록 합니다(그리고 항상 얽힌 NFT와 교환할 수 있습니다). 이것은 러그풀된 모든 NFT를 새로운 비-러그 세트로 교체하여 프로젝트를 **'복구'**하는 데 유용할 수 있습니다. 이것이 Token Entangler 생성의 이유이기도 합니다: Degen Ape Academy의 잘못된 민트 이후 Exiled Apes 커뮤니티를 돕기 위해서입니다. Exiled Apes 웹사이트에서 백스토리에 대해 자세히 알아볼 수 있습니다.

프로그램 뒤의 아이디어는 손상된 메타데이터가 있는 초기에 민트된 NFT를 적절한 메타데이터가 포함된 새 NFT로 교환할 수 있다는 것이었습니다. 프로젝트를 복구하거나 더 창의적인 사용 사례에도 사용할 수 있습니다.

이러한 교환은 언제든지 앞뒤로 가능하며, 현재 에스크로에 없는 NFT가 다른 지갑에 판매되더라도 새 지갑은 다시 교환할 수 있습니다.

## 기회

Token Entangler 프로그램은 매우 간단합니다. NFT A를 가져와서 토큰 얽힘 생성 시 NFT A에 이미 할당된 NFT B를 반환합니다. 그럼에도 불구하고 여러분에게 흥미로울 수 있는 몇 가지 기회가 있습니다:

- **앞뒤로 교환**: 사용자가 NFT A를 NFT B로 교환하면 항상 해당 교환을 다시 되돌릴 수 있습니다.
- **교환 수수료**: 토큰이 교환될 때마다 또는 NFT 쌍당 한 번만 지불되는 교환 수수료를 도입할 수 있습니다.
- **SPL 토큰 수수료**: 교환 수수료는 SPL 토큰 또는 SOL로 지불할 수 있습니다.

## 작동 방식

사용자 대면 프로세스는 간단합니다. Token Entangler에 NFT A와 (구성된 경우 SOL 또는 SPL 토큰)을 지불하고 얽힌 민트 B를 받습니다:

![일반 Token Entangler 프로세스를 보여주는 이미지. 지갑과 Token Entangler 프로그램을 상자로 표시합니다. 상자는 두 개의 화살표로 연결됩니다. 하나는 지갑에서 Entangler로 "NFT A + SOL"이라는 주석이 있고, 다른 하나는 Entangler에서 지갑으로 "NFT B"라는 주석이 있습니다](https://github.com/metaplex-foundation/docs/blob/main/static/assets/programs/token-entangler/Token-Entangler-Overview-Process.png?raw=true)

이것은 사용자 대면 프로세스만 보여주는 매우 축소된 그림입니다. 이 이미지에 표시되지 않은 추가 계정 등이 있습니다.

## 직접 만들어보세요!

일반적인 관점에서 시작부터 끝까지의 과정은 다음과 같습니다:

1. 새 토큰 민트
2. 이전 및 새 NFT 얽히게 하기
3. 고객 대면 웹사이트 호스팅. [샘플 UI 구현](https://github.com/metaplex-foundation/token-entangler-ui)이 있습니다
4. 사용자가 NFT를 교환하도록 하세요!

## 추가 정보

Token Entangler 프로그램에 대한 일반 정보는 문서에서 찾을 수 있습니다:

- Getting Started
- Accounts
- Instructions
- CLI
- FAQ
- Changelog

Token Entangler를 사용하려면 다음을 사용할 수 있습니다

- [JS CLI](https://github.com/metaplex-foundation/deprecated-clis/blob/main/src/token-entangler-cli.ts)
- [Token Entangler UI](https://github.com/metaplex-foundation/token-entangler-ui)

Token Entangler 코드를 살펴보고 싶다면 [GitHub 저장소](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/token-entangler/)도 자유롭게 확인하세요.
