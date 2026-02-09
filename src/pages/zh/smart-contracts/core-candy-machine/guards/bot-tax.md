---
title: "机器人税守卫"
metaTitle: "机器人税守卫 | Core Candy Machine"
description: "Core Candy Machine 的 'Bot Tax' 守卫允许您设置可配置的税费来对用户的无效交易收费。这可以阻止垃圾邮件和机器人。"
---

{% callout type="warning" %}
一些钱包（如 Solflare、Phantom 和可能的其他钱包）目前会自动向交易注入 Lighthouse 指令。当 `lastInstruction` 设置为 `true` 时，这会导致 Bot Tax 守卫被触发。

由于钱包选择取决于用户，**您无法阻止某人使用 Solflare 或类似钱包进行铸造**。如果您预期用户会使用这些钱包铸造，请考虑将 `lastInstruction` 设置为 `false` 以避免误报。

请谨慎使用 Bot Tax 守卫。
{% /callout %}

## 概述

**Bot Tax** 守卫对无效交易收取惩罚费用，以阻止机器人尝试铸造 NFT。这个金额通常很小，足以伤害机器人而不影响真实用户的真正错误。所有机器人税将转移到 Candy Machine 账户，这样一旦铸造结束，您可以通过删除 Candy Machine 账户来访问这些资金。

这个守卫有点特殊，会影响所有其他守卫的铸造行为。当 Bot Tax 被激活且任何其他守卫未能验证铸造时，**交易将假装成功**。这意味着程序不会返回任何错误，但也不会铸造任何 NFT。这是因为交易必须成功才能将资金从机器人转移到 Candy Machine 账户。

此外，Bot Tax 守卫使我们能够确保铸造指令是交易的最后一条指令。这可以防止机器人在铸造后添加恶意指令，并返回错误以避免支付税款。

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
  访问控制
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-8" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="73" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="lamports" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node parent="lamports" y="-30" x="200" theme="transparent" %}
如果任何其他守卫验证失败

收取此金额的 SOL
{% /node %}
{% edge from="lastInstruction" to="mint-candy-guard" arrow="none" dashed=true %}

{% /edge %}
{% node parent="lastInstruction" y="15" x="200" theme="transparent" %}
如果铸造指令不是交易的

最后一条指令，铸造将失败
{% /node %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Bot Tax 守卫包含以下设置：

- **Lamports**：对无效交易收取的 SOL（或 lamports）金额。我们建议设置一个相当小的金额，以避免影响犯了真正错误的真实用户。客户端验证也可以帮助减少对真实用户的影响。
- **Last Instruction**：当铸造指令不是交易的最后一条指令时，是否应该禁止铸造并收取机器人税。我们建议将此设置为 `true` 以更好地防范机器人。

{% dialect-switcher title="使用 Bot Tax 守卫设置 Candy Machine" %}
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

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[BotTax](https://mpl-core-candy-machine.typedoc.metaplex.com/types/BotTax.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的守卫部分：

```json
"botTax" : {
    "value": SOL value,
    "lastInstruction": boolean
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_Bot Tax 守卫不需要铸造设置。_

## Route 指令

_Bot Tax 守卫不支持 route 指令。_
