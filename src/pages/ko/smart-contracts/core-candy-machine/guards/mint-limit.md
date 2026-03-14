---
title: Mint Limit Guard
metaTitle: "Mint Limit 가드 - 지갑별 민팅 수량 제한 | 코어 캔디 머신"
description: "Mint Limit 가드는 코어 캔디 머신에서 각 지갑이 민팅할 수 있는 Asset 수를 제한합니다. 제한은 지갑별, 캔디 머신별, 식별자별로 추적됩니다."
keywords:
  - mint limit
  - Core Candy Machine
  - candy guard
  - per-wallet limit
  - mint counter
  - minting cap
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - per-wallet minting limits
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Mint Limit** 가드는 코어 캔디 머신에서 각 지갑이 민팅할 수 있는 Asset 수를 제한하며, 지갑별, 캔디 머신별, 구성 가능한 식별자별로 추적됩니다. {% .lead %}

## 개요

**Mint Limit** 가드는 각 지갑이 민팅할 수 있는 Asset 수에 제한을 지정할 수 있습니다.

제한은 지갑별, 캔디 머신별, 그리고 설정에서 제공된 식별자별로 설정되어 동일한 Core Candy Machine 내에서 여러 개의 민트 제한을 허용합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #mintLimit label="MintLimit" /%}
{% node #limit label="- Limit" /%}
{% node #id label="- ID" /%}
{% node label="..." /%}
{% /node %}

{% node parent="id" x="270" y="-9"  %}
{% node #mintCounterPda %}
Mint Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="payer" to="mintCounterPda" path="straight" /%}
{% edge from="id" to="mintCounterPda" /%}

{% node parent="mintCounterPda" x="18" y="100" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node label="Owner: Any Program" theme="dimmed" /%}
{% /node %}

{% edge from="mintLimit" to="mint-candy-guard" theme="indigo" dashed=true/%}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-30" %}
  {% node  theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="90" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 가드 설정

Mint Limit 가드에는 다음 설정이 포함됩니다:

- **ID**: 이 가드의 고유 식별자입니다. 서로 다른 식별자는 해당 지갑이 얼마나 많은 아이템을 민팅했는지 추적하기 위해 서로 다른 카운터를 사용합니다. 이는 각 가드 그룹이 서로 다른 민팅 제한을 가지길 원할 때 특히 유용합니다.
- **Limit**: 해당 식별자에 대한 지갑당 허용되는 최대 민팅 수량입니다.

{% dialect-switcher title="Mint Limit 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    mintLimit: some({ id: 1, limit: 5 }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [MintLimit](https://mpl-core-candy-machine.typedoc.metaplex.com/types/MintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

Mint Limit 가드에는 다음 민팅 설정이 포함됩니다:

- **ID**: 이 가드의 고유 식별자입니다.

참고로, SDK의 도움 없이 직접 지시문을 구성할 계획이라면, 이러한 민팅 설정과 추가 항목들을 지시문 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Core Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#mintlimit)를 참조하세요.

{% dialect-switcher title="Mint Limit 가드로 민팅하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Mint Limit 가드의 민팅 설정을 전달할 수 있습니다.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    mintLimit: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_Mint Limit 가드는 route instruction을 지원하지 않습니다._

## MintLimit Accounts
`MintLimit` 가드가 사용되면 각 지갑, CandyMachine, `id` 조합에 대해 `MintCounter` 계정이 생성됩니다. 검증 목적으로 다음과 같이 가져올 수 있습니다:

```js
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";
import { umi } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // 가드 설정에서 설정한 mintLimit id
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  // 또는 candyMachine: publicKey("Address") CM 주소 사용
  candyGuard: candyMachine.mintAuthority,
  // 또는 candyGuard: publicKey("Address") candyGuard 주소 사용
});

// 이미 민팅된 수량
console.log(mintCounter.count)
```

## Notes

- Mint Limit 카운터는 지갑 주소, Candy Machine 주소, 가드 `id`에서 파생된 `MintCounter` PDA를 통해 온체인에서 추적됩니다. 각 고유한 조합은 별도의 카운터 계정을 생성합니다.
- 별도의 [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups)에서 서로 다른 `id` 값을 사용하면 각 그룹이 같은 지갑에 대해 독립적인 민트 제한을 적용할 수 있습니다.
- `MintCounter` 계정은 Candy Machine이 완전히 민팅된 후에도 온체인에 유지됩니다. `safeFetchMintCounterFromSeeds`를 사용하여 특정 지갑이 민팅한 Asset 수를 확인할 수 있습니다.

