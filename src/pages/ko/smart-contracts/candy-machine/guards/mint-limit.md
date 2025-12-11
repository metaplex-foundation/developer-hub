---
title: "민팅 제한 가드"
metaTitle: 민팅 제한 가드 | Candy Machine
description: "민팅 제한 가드는 각 지갑이 민팅할 수 있는 NFT 개수의 제한을 지정할 수 있게 합니다."
---

## 개요

**민팅 제한(Mint Limit)** 가드는 각 지갑이 민팅할 수 있는 NFT 개수의 제한을 지정할 수 있게 합니다.

제한은 지갑별, Candy Machine별, 그리고 식별자별로 설정되며 — 설정에서 제공 — 동일한 Candy Machine 내에서 여러 민팅 제한을 허용합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
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

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node  theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 가드 설정

민팅 제한 가드는 다음 설정을 포함합니다:

- **ID**: 이 가드의 고유 식별자입니다. 서로 다른 식별자는 특정 지갑에서 민팅한 항목 수를 추적하기 위해 서로 다른 카운터를 사용합니다. 이는 가드 그룹을 사용할 때 특히 유용하며, 각 그룹이 서로 다른 민팅 제한을 가질 수 있습니다.
- **Limit**: 해당 식별자에 대해 지갑당 허용되는 최대 민팅 개수입니다.

{% dialect-switcher title="민팅 제한 가드를 사용하여 Candy Machine 설정" %}
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

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [MintLimit](https://mpl-candy-machine.typedoc.metaplex.com/types/MintLimit.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

```json
"mintLimit" : {
    "id": number,
    "limit": number
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

민팅 제한 가드는 다음 민팅 설정을 포함합니다:

- **ID**: 이 가드의 고유 식별자입니다.

SDK의 도움 없이 명령어를 구성할 계획이라면, 이러한 민팅 설정 및 그 이상을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#mintlimit)를 참조하세요.

{% dialect-switcher title="민팅 제한 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 민팅 제한 가드의 민팅 설정을 전달할 수 있습니다.

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    mintLimit: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없으므로 특정 민팅 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 명령어

_민팅 제한 가드는 라우트 명령어를 지원하지 않습니다._
