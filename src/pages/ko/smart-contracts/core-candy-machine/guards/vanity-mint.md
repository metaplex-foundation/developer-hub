---
title: "Core Candy Machine - Vanity Mint Guard"
metaTitle: "Core Candy Machine - Guards - Vanity Mint"
description: "Core Candy Machine 'Vanity Mint' guard는 민터가 Asset Address로 특정 베니티 민트를 제공해야 합니다"
---

## 개요

**Vanity Mint** guard는 지정된 민트 주소가 특정 형식과 일치하는 경우 민팅을 허용합니다. 이 guard는 기본적으로 사용자가 패턴과 일치하는 공개 키를 위해 연산해야 하는 작업 증명(POW) 요구 사항을 추가합니다.

민터가 일치하는 민트 주소를 사용하지 않으면 민팅에 실패합니다.

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
{% node #vanityMint label="vanityMint" /%}
{% node #regEx label="- Regular Expression" /%}
{% node label="..." /%}
{% /node %}

{% node parent="regEx" x="270" y="-9"  %}
{% node #nftMint theme="blue" %}
Mint {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="regEx" to="nftMint" /%}

{% edge from="nftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
Check that the mint Address

matches the Regular Expression
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## Guard 설정

Vanity Mint guard는 다음 설정을 포함합니다:

- **Regular Expression**: 민트 주소가 일치해야 하는 정규식. 예를 들어, 모든 민트가 `mplx` 문자열로 시작하길 원한다면 이를 `regex` 매개변수로 사용할 수 있습니다.

사용할 수 있는 정규식 아이디어 예시:
- 특정 패턴으로 시작: `^mplx`
- 특정 패턴으로 끝남: `mplx$`
- 특정 패턴으로 시작하고 끝남: `^mplx*mplx$`
- 특정 패턴과 정확히 일치: `^mplx1111111111111111111111111111111111111mplx$`
`mplx` 문자열은 예상되는 문자로 대체해야 합니다.

{% dialect-switcher title="민트가 `mplx`로 시작하고 끝나는 Vanity Mint Guard를 사용하여 Candy Machine 설정하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    vanityMint: some({
      regex: "^mplx*mplx$",
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [VanityMint](https://mpl-core-candy-machine.typedoc.metaplex.com/types/VanityMint.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

_Vanity Mint guard는 민팅 설정을 필요로 하지 않습니다. 민트 주소가 일치하기를 기대합니다._

## Route Instruction

_Vanity Mint guard는 route instruction을 지원하지 않습니다._
