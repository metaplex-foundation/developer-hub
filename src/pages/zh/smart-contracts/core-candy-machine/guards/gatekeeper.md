---
title: "门卫守卫"
metaTitle: "门卫守卫 | Core Candy Machine"
description: "Core Candy Machine 的 `Gatekeeper` 守卫检查铸造钱包是否拥有来自指定 Gatekeeper 网络的有效 Gateway Token。"
---

## 概述

**Gatekeeper** 守卫检查铸造钱包是否拥有来自指定 **Gatekeeper 网络** 的有效 **Gateway Token**。

在大多数情况下，此令牌将在完成验证码挑战后获得，但可以使用任何 Gatekeeper 网络。

Core Candy Machine 端没有太多需要设置的内容，但根据选择的 Gatekeeper 网络，您可能需要要求铸造钱包执行一些预验证检查以授予他们所需的 Gateway Token。

以下是设置 Gatekeeper 网络时可能有帮助的一些额外推荐材料。

- [CIVIC 文档](https://docs.civic.com/civic-pass/overview)
- [Gateway JS 库](https://www.npmjs.com/package/@identity.com/solana-gateway-ts)
- [Gateway React 组件](https://www.npmjs.com/package/@civic/solana-gateway-react)

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
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

网络请求 Gateway Token

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
  访问控制
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-30" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="92" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="gatekeeper-network" to="request-token" /%}
{% edge from="request-token" to="gateway-token" /%}

{% edge from="gateway-token" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node theme="transparent" parent="mint-candy-guard" x="-210" %}
如果给定网络和付款人

不存在有效令牌

铸造将失败
{% /node %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}


{% /diagram %}
## 守卫设置

Gatekeeper 守卫包含以下设置：

- **Gatekeeper Network**：用于检查铸造钱包有效性的 Gatekeeper 网络的公钥。例如，您可以使用 "**Civic Captcha Pass**" 网络——确保铸造钱包已通过验证码——使用以下地址：`ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6`。
- **Expire On Use**：铸造 NFT 后是否应将铸造钱包的 Gateway Token 标记为过期。
  - 设置为 `true` 时，他们需要再次通过 Gatekeeper 网络才能铸造另一个 NFT。
  - 设置为 `false` 时，他们可以继续铸造另一个 NFT 直到 Gateway Token 自然过期。

{% dialect-switcher title="使用 Gatekeeper 守卫设置 Core Candy Machine" %}
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

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[Gatekeeper](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Gatekeeper.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的守卫部分：

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

- **Gatekeeper Network**：用于检查铸造钱包有效性的 Gatekeeper 网络的公钥。
- **Expire On Use**：铸造 NFT 后是否应将铸造钱包的 Gateway Token 标记为过期。
- **Token Account**（可选）：作为一个小免责声明，您很少需要提供此设置，但如果需要可以使用。这指的是从付款人和 Gatekeeper 网络派生的 Gateway Token PDA，用于验证付款人是否有资格铸造。我们的 SDK 可以推断此 PDA 地址，因此您不需要提供它。但是，某些 Gatekeeper 网络可能会向同一钱包发放多个 Gateway Token。为了区分它们的 PDA 地址，它使用 **Seeds** 数组，默认为 `[0, 0, 0, 0, 0, 0, 0, 0]`。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#gatekeeper)。

{% dialect-switcher title="使用 Gatekeeper 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Gatekeeper 守卫的铸造设置，如下所示。

```ts
mintV1(umi, {
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
{% /dialect-switcher %}

## Route 指令

_Gatekeeper 守卫不支持 route 指令。_
