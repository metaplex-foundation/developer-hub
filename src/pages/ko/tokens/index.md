---
title: Solana 토큰
metaTitle: Solana에서 토큰 생성 및 런칭 | 토큰 생성 이벤트 (TGE) | Metaplex
description: Solana에서 대체 가능 토큰을 생성, 런칭, 관리하세요. Metaplex Genesis와 SDK를 사용하여 토큰 생성 이벤트(TGE), 페어 런칭, 토큰 세일을 구축합니다.
tableOfContents: false
---

Metaplex SDK를 사용하여 Solana에서 대체 가능 토큰을 생성, 런칭, 관리합니다. {% .lead %}

{% product-card-grid category="Tokens" /%}

## Solana에서 토큰 런칭 및 생성

Metaplex는 Solana에서 토큰을 런칭하기 위한 완전한 인프라를 제공합니다. 간단한 SPL 토큰 생성부터 전체 토큰 생성 이벤트(TGE) 진행까지, 토큰 생성에서 페어 런칭 배포까지 모든 것을 처리합니다.

### 토큰 생성 이벤트 (TGE)

토큰 생성 이벤트는 새로운 암호화폐 토큰을 생성하고 배포하는 과정입니다. Solana에서 Metaplex Genesis는 여러 런칭 메커니즘으로 TGE를 실행할 수 있는 스마트 컨트랙트 인프라를 제공합니다:

- **런칭 풀** - 사용자가 일정 기간 동안 SOL을 예치하고, 예치 비율에 따라 토큰을 받습니다. 유기적인 가격 발견이 가능하고 스나이핑을 방지합니다.
- **프라이스드 세일** - 선택적 캡과 지갑 게이트가 있는 고정 가격 토큰 판매. 선착순 방식으로 예측 가능한 결과를 제공합니다.
- **균일 가격 경매** - 모든 낙찰자가 청산 가격으로 토큰을 받는 시간 기반 경매.

### Metaplex로 Solana에서 런칭해야 하는 이유

Solana의 높은 처리량과 낮은 트랜잭션 비용은 토큰 런칭에 이상적입니다. Metaplex Genesis와 함께하면:

- **온체인 투명성** - 모든 런칭 메커니즘이 온체인에서 검증 가능
- **공정한 배포** - 시간 기반 윈도우가 프론트러닝과 봇 조작 방지
- **유연한 구성** - 예치 기간, 클레임 윈도우, 배포 규칙 커스터마이징
- **내장 메타데이터** - 토큰이 첫날부터 풍부한 메타데이터(이름, 심볼, 이미지) 포함

### 시작하기

토큰 생성이 처음이신가요? 다음 가이드로 시작하세요:

1. **[토큰 생성하기](/ko/tokens/create-a-token)** - 메타데이터가 있는 기본 SPL 토큰 생성
2. **[토큰 런칭하기](/ko/tokens/launch-token)** - Genesis Launch Pools로 전체 토큰 런칭 실행
3. **[토큰 발행하기](/ko/tokens/mint-tokens)** - 토큰에 추가 공급량 발행

고급 런칭 구성은 [Genesis 스마트 컨트랙트 문서](/ko/smart-contracts/genesis)를 참조하세요.
