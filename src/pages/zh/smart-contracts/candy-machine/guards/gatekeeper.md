---
title: "Gatekeeper 守卫"
metaTitle: Gatekeeper 守卫 | Candy Machine
description: "Gatekeeper 守卫检查铸造钱包是否具有来自指定 Gatekeeper Network 的有效 Gateway Token。"
---

## 概述

**Gatekeeper** 守卫检查铸造钱包是否具有来自指定 **Gatekeeper Network** 的有效 **Gateway Token**。

在大多数情况下，此代币将在完成验证码挑战后获得，但可以使用任何 Gatekeeper Network。

在 Candy Machine 端没有太多要设置的，但根据所选的 Gatekeeper Network，您可能需要要求铸造钱包执行一些预验证检查以授予它们所需的 Gateway Token。

以下是一些在设置 Gatekeeper Network 时可能有用的额外推荐材料。

- [CIVIC 文档](https://docs.civic.com/civic-pass/overview)
- [Gateway JS 库](https://www.npmjs.com/package/@identity.com/solana-gateway-ts)
- [Gateway React 组件](https://www.npmjs.com/package/@civic/solana-gateway-react)

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #gatekeeper label="Gatekeeper" /%}
{% node #gatekeeper-network label="- Gatekeeper Network" /%}
{% node #expire label="- Expire on use" /%}
{% node label="..." /%}
{% /node %}

{% node parent="gatekeeper" x="250" y="-17" %}
{% node #request-token theme="indigo" %}
从 Gatekeeper

Network 请求 Gateway Token

例如验证码
{% /node %}
{% /node %}

{% node parent="request-token" y="140" x="34" %}
{% node #gateway-token theme="indigo" label="Gateway Token" /%}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-9" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="78" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="gatekeeper-network" to="request-token" /%}
{% edge from="request-token" to="gateway-token" /%}

{% edge from="gateway-token" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node theme="transparent" parent="mint-candy-guard" x="-210" %}
如果给定 Network 和付款人

不存在有效代币

铸造将失败
{% /node %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Gatekeeper 守卫包含以下设置：

- **Gatekeeper Network**：将用于检查铸造钱包有效性的 Gatekeeper Network 的公钥。例如，您可以使用"**Civic Captcha Pass**"Network——它确保铸造钱包已通过验证码——使用以下地址：`ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6`。
- **Expire On Use（使用后过期）**：是否在 NFT 铸造后将铸造钱包的 Gateway Token 标记为已过期。
  - 当设置为 `true` 时，他们需要再次通过 Gatekeeper Network 才能铸造另一个 NFT。
  - 当设置为 `false` 时，他们将能够铸造另一个 NFT，直到 Gateway Token 自然过期。

{% dialect-switcher title="使用 Gatekeeper 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
  },
});
```

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)、[Gatekeeper](https://mpl-candy-machine.typedoc.metaplex.com/types/Gatekeeper.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的 guard 部分：

```json
"gatekeeper" : {
    "gatekeeperNetwork": "<PUBKEY>",
    "expireOnUse": boolean
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Gatekeeper 守卫接受以下铸造设置：

- **Gatekeeper Network**：将用于检查铸造钱包有效性的 Gatekeeper Network 的公钥。
- **Expire On Use（使用后过期）**：是否在 NFT 铸造后将铸造钱包的 Gateway Token 标记为已过期。
- **Token Account（代币账户）**（可选）：小提示，您很少需要提供此设置，但如果需要它就在这里。这指的是从付款人和 Gatekeeper Network 派生的 Gateway Token PDA，用于验证付款人是否有资格铸造。此 PDA 地址可以由我们的 SDK 推断，这就是为什么您不需要提供它。但是，某些 Gatekeeper Network 可能会向同一钱包颁发多个 Gateway Token。为了区分它们的 PDA 地址，它使用默认为 `[0, 0, 0, 0, 0, 0, 0, 0]` 的 **Seeds** 数组。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要提供这些铸造设置以及更多作为指令参数和剩余账户的组合。有关更多详细信息，请参阅 [Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#gatekeeper)。

{% dialect-switcher title="使用 Gatekeeper 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Gatekeeper 守卫的铸造设置，如下所示。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_一旦分配了守卫，您就无法使用 sugar 进行铸造——因此没有特定的铸造设置。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Gatekeeper 守卫不支持 route 指令。_
