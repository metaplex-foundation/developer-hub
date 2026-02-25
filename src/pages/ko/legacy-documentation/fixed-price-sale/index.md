---
title: 개요
metaTitle: 개요 | Fixed Price Sale
description: 마스터 에디션 NFT에서 프린트 판매
---

{% callout type="warning" %}

이 프로그램은 더 이상 사용되지 않는 것으로 표시되어 있으며 Metaplex Foundation 팀에서 더 이상 적극적으로 유지 관리하지 않습니다. 새로운 기능, 보안 수정 및 하위 호환성이 보장되지 않습니다. 주의해서 사용하시기 바랍니다.

{% /callout %}

Metaplex의 Fixed-Price Sale 프로그램은 브랜드가 대규모 청중에게 배포할 수 있는 멤버십 NFT를 만들기 위한 Solana 프로그램입니다. 이 NFT는 향후 특정 항목(게임, 이벤트, 출시 등)에 대한 액세스를 제한하는 데 사용할 수 있습니다.
이름에서 알 수 있듯이 프로그램의 모든 NFT는 단일 마스터 에디션 NFT에서 [프린트 에디션](/ko/smart-contracts/token-metadata/print)을 발행하여 고정 가격으로 판매됩니다. 결과적으로 모든 NFT는 (에디션 번호를 제외하고) 동일한 메타데이터를 갖게 됩니다.

Fixed-Price Sale 프로그램은 컬렉션별 게이팅도 지원합니다. 따라서 크리에이터는 컬렉션 NFT로 판매를 게이팅할 수 있으며, 이는 온체인 컬렉션의 보유자만 NFT를 구매할 수 있음을 의미합니다. 또한 여러 판매 단계를 가질 수 있습니다: 게이팅 및 비게이팅. 예를 들어, 총 5시간 동안 지속되는 마켓을 만들 수 있으며 처음 3시간은 게이팅되어 보유자만 NFT를 구매할 수 있습니다.

🔗 **유용한 링크:**

- [GitHub 저장소](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/fixed-price-sale)
- [자동 생성 API](https://www.npmjs.com/package/@metaplex-foundation/mpl-fixed-price-sale)
- [Rust 크레이트](https://crates.io/crates/mpl-fixed-price-sale)
