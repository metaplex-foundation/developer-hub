---
title: 캔디 가드
metaTitle: 캔디 가드 | 코어 캔디 머신
description: 코어 캔디 머신에 사용할 수 있는 다양한 유형의 가드와 그 기능에 대해 알아보세요.
---

## 가드란 무엇인가요?

가드는 코어 캔디 머신의 민팅에 대한 액세스를 제한하고 새로운 기능을 추가할 수 있는 모듈형 코드 조각입니다!

선택할 수 있는 가드 세트가 광범위하며, 각 가드는 필요에 따라 활성화하고 구성할 수 있습니다.

이 문서의 뒷부분에서 [사용 가능한 모든 가드](/ko/smart-contracts/core-candy-machine/guards)에 대해 다루겠지만, 먼저 몇 가지 예시를 통해 이를 설명해보겠습니다.

- **시작 날짜** 가드가 활성화되면 사전 구성된 날짜 이전에는 민팅이 금지됩니다. 특정 날짜 이후의 민팅을 금지하는 **종료 날짜** 가드도 있습니다.
- **SOL 결제** 가드가 활성화되면 민팅 지갑은 구성된 대상 지갑에 구성된 금액을 지불해야 합니다. 특정 컬렉션의 토큰이나 NFT로 지불하는 유사한 가드도 존재합니다.
- **토큰 게이트**와 **NFT 게이트** 가드는 각각 특정 토큰 보유자와 NFT 보유자에게만 민팅을 제한합니다.
- **허용 목록** 가드는 지갑이 미리 정의된 지갑 목록에 포함된 경우에만 민팅을 허용합니다. 민팅을 위한 게스트 목록과 같다고 할 수 있습니다.

보시다시피 각 가드는 하나의 책임만 맡고 있어 구성 가능합니다. 즉, 필요한 가드를 선택하여 완벽한 캔디 머신을 만들 수 있습니다.

## 코어 캔디 가드 계정

각 코어 캔디 머신 계정은 일반적으로 자체 코어 캔디 가드 계정과 연결되어 보호 계층을 추가합니다.

이는 코어 캔디 가드 계정을 생성하고 이를 코어 캔디 머신 계정의 **민트 권한**으로 설정함으로써 작동합니다. 이렇게 하면 더 이상 메인 코어 캔디 머신 프로그램에서 직접 민팅할 수 없습니다. 대신 코어 캔디 가드 프로그램을 통해 민팅해야 하며, 모든 가드가 성공적으로 해결되면 코어 캔디 머신 코어 프로그램에 민팅 프로세스를 완료하도록 위임합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
Anyone can mint as long \
as they comply with the \
activated guards.
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=215 y=-18 theme="transparent" %}
Only Alice \
can mint.
{% /node %}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

코어 캔디 머신과 코어 캔디 가드 계정이 함께 작동하므로, 우리의 SDK는 이들을 하나의 엔티티로 처리합니다. SDK로 코어 캔디 머신을 생성하면 연결된 코어 캔디 가드 계정도 기본적으로 함께 생성됩니다. 코어 캔디 머신을 업데이트할 때도 마찬가지로, 동시에 가드를 업데이트할 수 있습니다. 이 페이지에서 구체적인 예시를 보겠습니다.

## 왜 별도의 프로그램인가요?

가드가 메인 코어 캔디 머신 프로그램에 존재하지 않는 이유는 액세스 제어 로직을 NFT 민팅이라는 코어 캔디 머신의 주요 책임과 분리하기 위함입니다.

이를 통해 가드는 모듈형일 뿐만 아니라 확장 가능합니다. 누구나 자신만의 코어 캔디 가드 프로그램을 생성하고 배포하여 커스텀 가드를 만들 수 있으며, 나머지 모든 것은 코어 캔디 머신 코어 프로그램에 의존할 수 있습니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=300 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=180 %}
{% node #mint-1b label="Mint" theme="pink" /%}
{% node label="Custom Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1b" x=-80 y=-22 label="Different Access Control" theme="transparent" /%}

{% node parent="mint-1" x=70 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=110 y=-20 label="Same Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-1b" x=250 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-2" y=80 x=0 %}
{% node #candy-guard-2 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Custom Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node %}
My Custom Guard {% .font-semibold %}
{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="candy-guard-2" to="candy-machine-2" fromPosition="right" toPosition="right" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-1b" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-1b" theme="pink" /%}
{% edge from="candy-guard-2" to="mint-1b" theme="pink" /%}

{% /diagram %}

우리의 SDK는 또한 자신만의 코어 캔디 가드 프로그램과 커스텀 가드를 등록할 수 있는 방법을 제공하므로, 친숙한 API를 활용하고 다른 사람들과 가드를 쉽게 공유할 수 있습니다.

## 사용 가능한 모든 가드

이제 가드가 무엇인지 이해했으니, 기본적으로 사용할 수 있는 가드가 무엇인지 살펴보겠습니다.

다음 목록에서 각 가드에 대한 간단한 설명을 제공하며, 보다 자세한 내용을 위한 전용 페이지 링크를 포함합니다.

- [**Address Gate**](/ko/smart-contracts/core-candy-machine/guards/address-gate): 민팅을 단일 주소로 제한합니다.
- [**Allocation**](/ko/smart-contracts/core-candy-machine/guards/allocation): 각 가드 그룹이 민팅할 수 있는 NFT 수에 제한을 지정할 수 있습니다.
- [**Allow List**](/ko/smart-contracts/core-candy-machine/guards/allow-list): 지갑 주소 목록을 사용하여 누가 민팅할 수 있는지 결정합니다.
- [**Asset Burn Multi**](/ko/smart-contracts/core-candy-machine/guards/asset-burn-multi): 지정된 컬렉션의 보유자로 민팅을 제한하며, 하나 이상의 코어 자산을 소각해야 합니다.
- [**Asset Burn**](/ko/smart-contracts/core-candy-machine/guards/asset-burn): 지정된 컬렉션의 보유자로 민팅을 제한하며, 단일 코어 자산을 소각해야 합니다.
- [**Asset Gate**](/ko/smart-contracts/core-candy-machine/guards/asset-gate): 지정된 컬렉션의 보유자로 민팅을 제한합니다.
- [**Asset Mint Limit**](/ko/smart-contracts/core-candy-machine/guards/asset-mint-limit): 지정된 컬렉션의 보유자로 민팅을 제한하고, 제공된 코어 자산에 대해 실행할 수 있는 민팅 수를 제한합니다.
- [**Asset Payment Multi**](/ko/smart-contracts/core-candy-machine/guards/asset-payment-multi): 민팅 가격을 지정된 컬렉션의 여러 코어 자산으로 설정합니다.
- [**Asset Payment**](/ko/smart-contracts/core-candy-machine/guards/asset-payment): 민팅 가격을 지정된 컬렉션의 코어 자산으로 설정합니다.
- [**Bot Tax**](/ko/smart-contracts/core-candy-machine/guards/bot-tax): 유효하지 않은 트랜잭션에 부과할 구성 가능한 세금입니다.
- [**Edition**](/ko/smart-contracts/core-candy-machine/guards/edition): 민팅된 코어 자산에 에디션 플러그인을 추가합니다. 자세한 내용은 [프린트 에디션](/ko/smart-contracts/core/guides/print-editions) 가이드를 참조하세요.
- [**End Date**](/ko/smart-contracts/core-candy-machine/guards/end-date): 민팅 종료 날짜를 결정합니다.
- [**Freeze Sol Payment**](/ko/smart-contracts/core-candy-machine/guards/freeze-sol-payment): 동결 기간과 함께 SOL로 민팅 가격을 설정합니다.
- [**Freeze Token Payment**](/ko/smart-contracts/core-candy-machine/guards/freeze-token-payment): 동결 기간과 함께 토큰 금액으로 민팅 가격을 설정합니다.
- [**Gatekeeper**](/ko/smart-contracts/core-candy-machine/guards/gatekeeper): 게이트키퍼 네트워크(예: 캡차 통합)를 통해 민팅을 제한합니다.
- [**Mint Limit**](/ko/smart-contracts/core-candy-machine/guards/mint-limit): 지갑당 민팅 수에 제한을 지정합니다.
- [**Nft Burn**](/ko/smart-contracts/core-candy-machine/guards/nft-burn): 지정된 컬렉션의 보유자로 민팅을 제한하며, NFT를 소각해야 합니다.
- [**Nft Gate**](/ko/smart-contracts/core-candy-machine/guards/nft-gate): 지정된 컬렉션의 보유자로 민팅을 제한합니다.
- [**Nft Payment**](/ko/smart-contracts/core-candy-machine/guards/nft-payment): 민팅 가격을 지정된 컬렉션의 NFT로 설정합니다.
- [**Program Gate**](/ko/smart-contracts/core-candy-machine/guards/program-gate): 민팅 트랜잭션에 포함될 수 있는 프로그램을 제한합니다.
- [**Redeemed Amount**](/ko/smart-contracts/core-candy-machine/guards/redeemed-amount): 총 민팅된 수량에 따라 민팅 종료를 결정합니다.
- [**Sol Fixed fee**](/ko/smart-contracts/core-candy-machine/guards/sol-fixed-fee): 고정 가격으로 SOL로 민팅 가격을 설정합니다. [Sol Payment](/ko/smart-contracts/core-candy-machine/guards/sol-payment) 가드와 유사합니다.
- [**Sol Payment**](/ko/smart-contracts/core-candy-machine/guards/sol-payment): SOL로 민팅 가격을 설정합니다.
- [**Start Date**](/ko/smart-contracts/core-candy-machine/guards/start-date): 민팅 시작 날짜를 결정합니다.
- [**Third Party Signer**](/ko/smart-contracts/core-candy-machine/guards/third-party-signer): 트랜잭션에 추가 서명자가 필요합니다.
- [**Token Burn**](/ko/smart-contracts/core-candy-machine/guards/token-burn): 지정된 토큰의 보유자로 민팅을 제한하며, 토큰을 소각해야 합니다.
- [**Token Gate**](/ko/smart-contracts/core-candy-machine/guards/token-gate): 지정된 토큰의 보유자로 민팅을 제한합니다.
- [**Token Payment**](/ko/smart-contracts/core-candy-machine/guards/token-payment): 토큰 금액으로 민팅 가격을 설정합니다.
- [**Token22 Payment**](/ko/smart-contracts/core-candy-machine/guards/token2022-payment): 토큰22(토큰 확장) 금액으로 민팅 가격을 설정합니다.
- [**Vanity Mint**](/ko/smart-contracts/core-candy-machine/guards/vanity-mint): 새로운 민트 주소가 특정 패턴과 일치할 것을 기대하여 민팅을 제한합니다.

## 결론

가드는 코어 캔디 머신의 중요한 구성 요소입니다. 민팅 프로세스를 쉽게 구성할 수 있게 해주며, 누구든지 애플리케이션별 요구사항에 맞는 자신만의 가드를 만들 수 있게 해줍니다.
