---
title: "Bot Tax Guard"
metaTitle: "Bot Tax Guard | Core Candy Machine"
description: "Core Candy Machine의 'Bot Tax' 가드를 사용하면 사용자로부터의 잘못된 트랜잭션에 대해 청구할 구성 가능한 세금을 설정할 수 있습니다. 이는 스팸과 봇을 방지할 수 있습니다."
---

{% callout type="warning" %}
일부 지갑(예: Solflare, Phantom 및 기타 가능한 지갑)은 현재 트랜잭션에 Lighthouse 지시문을 자동 주입합니다. 이로 인해 `lastInstruction`이 `true`로 설정되어 있을 때 Bot Tax 가드가 트리거됩니다.

지갑 선택은 사용자에게 달려 있으므로, **Solflare나 유사한 지갑으로 민팅하는 사용자를 막을 수는 없습니다**. 사용자가 이러한 지갑을 사용하여 민팅할 것으로 예상되는 경우, 오탐지를 피하기 위해 `lastInstruction`을 `false`로 설정하는 것을 고려하세요.

Bot Tax 가드는 신중하게 사용하세요.
{% /callout %}


## 개요

**Bot Tax** 가드는 봇이 NFT 민팅을 시도하는 것을 방지하기 위해 잘못된 트랜잭션에 대한 벌금을 청구합니다. 이 금액은 보통 실제 사용자의 진정한 실수에 영향을 주지 않으면서 봇을 제재할 수 있도록 소액으로 설정됩니다. 모든 봇 세금은 Candy Machine 계정으로 전송되므로 민팅이 끝난 후 Candy Machine 계정을 삭제하여 이 자금에 접근할 수 있습니다.

이 가드는 다소 특별하며 다른 모든 가드의 민팅 동작에 영향을 줍니다. Bot Tax가 활성화되고 다른 가드가 민팅 검증에 실패하면, **트랜잭션은 성공한 것처럼 가장합니다**. 이는 프로그램에서 오류가 반환되지 않지만 NFT도 민팅되지 않음을 의미합니다. 이는 봇에서 Candy Machine 계정으로 자금을 전송하기 위해 트랜잭션이 성공해야 하기 때문입니다.

또한, Bot Tax 가드를 사용하면 민팅 지시문이 트랜잭션의 마지막 지시문인지 확인할 수 있습니다. 이는 봇이 민팅 후 악성 지시문을 추가하는 것을 방지하고 세금 지불을 피하기 위해 오류를 반환합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint" z=1 /%}
{% node #botTax label="botTax" /%}
{% node #lamports label="- Lamports" /%}
{% node #lastInstruction label="- Last Instruction" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="700" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-8" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="73" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="lamports" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node parent="lamports" y="-30" x="200" theme="transparent" %}
If any other guard fails to validate

charge this amount of SOL
{% /node %}
{% edge from="lastInstruction" to="mint-candy-guard" arrow="none" dashed=true %}

{% /edge %}
{% node parent="lastInstruction" y="15" x="200" theme="transparent" %}
If the mint instruction is not the last

Instruction of the transaction minting will fail
{% /node %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}


{% /diagram %}

## 가드 설정

Bot Tax 가드에는 다음 설정이 포함됩니다:

- **Lamports**: 잘못된 트랜잭션에 대해 청구할 SOL(또는 lamports) 금액입니다. 진정한 실수를 한 실제 사용자에게 영향을 주지 않도록 상당히 적은 금액을 설정하는 것을 권장합니다. 클라이언트 측 검증도 실제 사용자에게 미치는 영향을 줄이는 데 도움이 될 수 있습니다.
- **Last Instruction**: 민팅 지시문이 트랜잭션의 마지막 지시문이 아닐 때 민팅을 금지하고 봇 세금을 청구할지 여부입니다. 봇으로부터 더 나은 보호를 위해 이를 `true`로 설정하는 것을 권장합니다.

{% dialect-switcher title="Bot Tax 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    botTax: some({
      lamports: sol(0.01),
      lastInstruction: true,
    }),
  },
});
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [BotTax](https://mpl-core-candy-machine.typedoc.metaplex.com/types/BotTax.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 가드 섹션에 이 객체를 추가하세요:

```json
"botTax" : {
    "value": SOL value,
    "lastInstruction": boolean
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

_Bot Tax 가드는 민팅 설정이 필요하지 않습니다._

## Route Instruction

_Bot Tax 가드는 route instruction을 지원하지 않습니다._