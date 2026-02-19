---
title: 允许列表守卫
metaTitle: 允许列表守卫 | Core Candy Machine
description: "Core Candy Machine 的 'Allowlist' 守卫允许您设置预定义的钱包列表，这些钱包可以从您的 Core Candy Machine 铸造"
---

## 概述

**Allow List** 守卫根据预定义的钱包列表验证铸造钱包。如果铸造钱包不在此列表中，铸造将失败。

在此守卫的设置中提供大量钱包列表将需要在区块链上存储大量数据，并且可能需要多个交易来插入它们。因此，Allow List 守卫使用 [**Merkle Trees**](https://en.m.wikipedia.org/wiki/Merkle_tree) 来验证铸造钱包是否属于预配置的钱包列表。

这通过创建一个哈希二叉树来工作，其中所有叶子两两哈希直到我们到达称为 **Merkle Root** 的最终哈希。这意味着如果任何叶子发生变化，最终的 Merkle Root 将被破坏。

{% diagram %}
{% node #hash-7 label="Hash 7" theme="brown" /%}
{% node #merkle-root label="Merkle Root" theme="transparent" parent="hash-7" x="-90" y="8" /%}
{% node #hash-5 label="Hash 5" parent="hash-7" y="100" x="-200" theme="orange" /%}
{% node #hash-6 label="Hash 6" parent="hash-7" y="100" x="200" theme="orange" /%}

{% node #leaves label="叶子" parent="hash-5" y="105" x="-170" theme="transparent" /%}
{% node #hash-1 label="Hash 1" parent="hash-5" y="100" x="-100" theme="orange" /%}
{% node #hash-2 label="Hash 2" parent="hash-5" y="100" x="100" theme="orange" /%}
{% node #hash-3 label="Hash 3" parent="hash-6" y="100" x="-100" theme="orange" /%}
{% node #hash-4 label="Hash 4" parent="hash-6" y="100" x="100" theme="orange" /%}

{% node #data label="数据" parent="hash-1" y="105" x="-80" theme="transparent" /%}
{% node #Ur1C label="Ur1C...bWSG" parent="hash-1" y="100" x="-23" /%}
{% node #sXCd label="sXCd...edkn" parent="hash-2" y="100" x="-20" /%}
{% node #RbJs label="RbJs...Ek7u" parent="hash-3" y="100" x="-17" /%}
{% node #rwAv label="rwAv...u1ud" parent="hash-4" y="100" x="-16" /%}

{% edge from="hash-5" to="hash-7" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-6" to="hash-7" fromPosition="top" toPosition="bottom" /%}

{% edge from="hash-1" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-2" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-3" to="hash-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-4" to="hash-6" fromPosition="top" toPosition="bottom" /%}

{% edge from="Ur1C" to="hash-1" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="sXCd" to="hash-2" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="RbJs" to="hash-3" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="rwAv" to="hash-4" fromPosition="top" toPosition="bottom" path="straight" /%}

{% /diagram %}

要验证叶子是否属于树的一部分，我们只需要一个所有中间哈希的列表，使我们能够沿着树向上走并重新计算 Merkle Root。我们称这个中间哈希列表为 **Merkle Proof**。如果计算的 Merkle Root 与存储的 Merkle Root 匹配，我们可以确定该叶子是树的一部分，因此是原始列表的一部分。

{% diagram %}
{% node #hash-7 label="Hash 7" theme="brown" /%}
{% node #merkle-root label="Merkle Root" theme="transparent" parent="hash-7" x="-90" y="8" /%}
{% node #hash-5 label="Hash 5" parent="hash-7" y="100" x="-200" theme="mint" /%}
{% node #hash-6 label="Hash 6" parent="hash-7" y="100" x="200" theme="blue" /%}

{% node #legend-merkle-proof label="Merkle Proof =" theme="transparent" parent="hash-7" x="200" y="10" /%}
{% node #legend-hash-4 label="Hash 4" parent="legend-merkle-proof" x="100" y="-7" theme="mint" /%}
{% node #plus label="+" parent="legend-hash-4" theme="transparent" x="81" y="8" /%}
{% node #legend-hash-5 label="Hash 5" parent="legend-hash-4" x="100" theme="mint" /%}

{% node #leaves label="叶子" parent="hash-5" y="105" x="-170" theme="transparent" /%}
{% node #hash-1 label="Hash 1" parent="hash-5" y="100" x="-100" theme="orange" /%}
{% node #hash-2 label="Hash 2" parent="hash-5" y="100" x="100" theme="orange" /%}
{% node #hash-3 label="Hash 3" parent="hash-6" y="100" x="-100" theme="blue" /%}
{% node #hash-4 label="Hash 4" parent="hash-6" y="100" x="100" theme="mint" /%}

{% node #data label="数据" parent="hash-1" y="105" x="-80" theme="transparent" /%}
{% node #Ur1C label="Ur1C...bWSG" parent="hash-1" y="100" x="-23" /%}
{% node #sXCd label="sXCd...edkn" parent="hash-2" y="100" x="-20" /%}
{% node #RbJs label="RbJs...Ek7u" parent="hash-3" y="100" x="-17" theme="blue" /%}
{% node #rwAv label="rwAv...u1ud" parent="hash-4" y="100" x="-16" /%}

{% edge from="hash-5" to="hash-7" fromPosition="top" toPosition="bottom" theme="mint" /%}
{% edge from="hash-6" to="hash-7" fromPosition="top" toPosition="bottom" theme="blue" /%}

{% edge from="hash-1" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-2" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-3" to="hash-6" fromPosition="top" toPosition="bottom" theme="blue" /%}
{% edge from="hash-4" to="hash-6" fromPosition="top" toPosition="bottom" theme="mint" /%}

{% edge from="Ur1C" to="hash-1" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="sXCd" to="hash-2" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="RbJs" to="hash-3" fromPosition="top" toPosition="bottom" path="straight" theme="blue" /%}
{% edge from="rwAv" to="hash-4" fromPosition="top" toPosition="bottom" path="straight" /%}

{% /diagram %}

因此，Allow List 守卫的设置需要一个 Merkle Root，它作为预配置的允许钱包列表的真实来源。要让钱包证明它在允许列表中，它必须提供有效的 Merkle Proof，允许程序重新计算 Merkle Root 并确保它与守卫的设置匹配。

注意我们的 SDK 提供辅助函数，使为给定的钱包列表创建 Merkle Root 和 Merkle Proof 变得容易。

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
{% node #candy-guard-guards label="Guards" theme="mint" z=1 /%}
{% node #allowList label="AllowList" /%}
{% node #guardMerkleRoot label="- Merkle Root" /%}
{% node label="..." /%}
{% /node %}

{% node parent="allowList" x="250" y="10" %}
{% node #merkleRoot theme="slate" %}
Merkle Root {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="merkleRoot" x="170" %}
{% node #merkleProof theme="slate" %}
Merkle Proof {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="merkleRoot" y="100" x="-12" %}
{% node #walletList  %}
允许铸造的

钱包列表
{%/node %}
{% /node %}
{% edge from="merkleProof" to="walletList" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" /%}
{% edge from="merkleRoot" to="walletList" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" /%}

{% node parent="merkleProof" y="100" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node theme="dimmed"%}
Owner: Any Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="merkleProof" to="payer" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" path="straight" /%}

{% node parent="candy-machine" x="740" %}
  {% node #route-validation theme="pink" %}
    Route from the

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="route-validation" y="-20" x="100" theme="transparent" %}
  验证 Merkle Proof
{% /node %}

{% node parent="route-validation" #allowList-pda y="130" x="32" %}
{% node theme="slate" %}
Allowlist PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="allowList-pda" #mint-candy-guard y="90" x="-31" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="110" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="110" x="70" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="guardMerkleRoot" to="merkleRoot" arrow="start" path="straight" /%}
{% edge from="merkleRoot" to="route-validation" arrow="none" fromPosition="top" dashed=true /%}
{% edge from="merkleProof" to="route-validation" arrow="none" fromPosition="top" dashed=true  %}
如果付款人的 Merkle Proof 与守卫的

Merkle Root 不匹配，验证将失败
{% /edge %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="route-validation" to="allowList-pda" path="straight" /%}
{% edge from="allowList-pda" to="mint-candy-guard" path="straight" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Allow List 守卫包含以下设置：

- **Merkle Root**：代表允许列表的 Merkle Tree 的根。

{% dialect-switcher title="使用 Allowlist 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

为了帮助我们管理 Merkle Trees，Umi 库提供了两个辅助方法 `getMerkleRoot` 和 `getMerkleProof`，您可以这样使用。

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

const merkleRoot = getMerkleRoot(allowList);
const validMerkleProof = getMerkleProof(
  allowList,
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB"
);
const invalidMerkleProof = getMerkleProof(allowList, "invalid-address");
```

一旦我们计算出允许列表的 Merkle Root，我们就可以用它在 Candy Machine 上设置 Allow List 守卫。

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-core-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[AllowList](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllowList.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Sugar 不包含创建管理 merkle root 的函数。使用 sugar 的允许列表时，您必须预先计算它，例如使用前面描述的 JavaScript 函数或 [sol-tools](https://sol-tools.tonyboyle.io/cmv3/allow-list)，然后像这样将 merkle root 哈希添加到您的配置中：

```json
"allowList" : {
    "merkleRoot": "<HASH>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Allow List 守卫包含以下铸造设置：

- **Merkle Root**：代表允许列表的 Merkle Tree 的根。

注意，在能够铸造之前，**我们必须通过提供 Merkle Proof 来验证铸造钱包**。详情请参阅下面的[验证 Merkle Proof](#validate-a-merkle-proof)。

另外注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将 Allow List Proof PDA 添加到铸造指令的剩余账户中。详情请参阅 [Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#allowlist)。

{% dialect-switcher title="使用 Allow List 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Allow List 守卫的铸造设置，如下所示。

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-core-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

mintV1(umi, {
  // ...
  mintArgs: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html)、[AllowListMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllowListMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_一旦分配了守卫，您就不能使用 sugar 铸造 - 因此没有特定的铸造设置。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

Allow List 的 route 指令支持以下功能。

### 验证 Merkle Proof

_路径：`proof`_

铸造钱包必须使用 Allow List 守卫的 route 指令执行[预验证](/zh/smart-contracts/core-candy-machine/mint#minting-with-pre-validation)，而不是直接将 Merkle Proof 传递给铸造指令。

此 route 指令将从提供的 Merkle Proof 计算 Merkle Root，如果有效，将创建一个新的 PDA 账户作为铸造钱包属于允许列表的证明。因此，在铸造时，Allow List 守卫只需要检查此 PDA 账户的存在即可授权或拒绝钱包铸造。

那么为什么我们不能直接在铸造指令中验证 Merkle Proof 呢？这仅仅是因为，对于大型允许列表，Merkle Proof 可能会变得相当长。超过一定大小后，就不可能将其包含在已经包含相当数量指令的铸造交易中。通过将验证过程与铸造过程分离，我们使允许列表可以根据需要变大。

此 route 指令路径接受以下参数：

- **Path** = `proof`：选择在 route 指令中执行的路径。
- **Merkle Root**：代表允许列表的 Merkle Tree 的根。
- **Merkle Proof**：应用于计算 Merkle Root 并验证它与守卫设置中存储的 Merkle Root 匹配的中间哈希列表。
- **Minter**（可选）：如果铸造者与付款人不同，则作为签名者的铸造者账户。提供时，此账户必须属于允许列表，证明才有效。

{% dialect-switcher title="预验证钱包" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `routeArgs` 参数传递 Allow List 守卫的 "Proof" Route 设置，如下所示。

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

await route(umi, {
  // ...
  guard: "allowList",
  routeArgs: {
    path: "proof",
    merkleRoot: getMerkleRoot(allowList),
    merkleProof: getMerkleProof(allowList, publicKey(umi.identity)),
  },
}).sendAndConfirm(umi);
```

`umi.identity` 钱包现在被允许从 Candy Machine 铸造。

API 参考：[route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html)、[AllowListRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllowListRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugar 不能用于调用 "Proof" Route。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 允许列表账户
当使用 `Allowlist` 守卫时，在运行 route 指令后会创建一个 `AllowListProof` 账户。当可以获取它时，用户在允许列表上且 route 已运行。出于验证目的，可以这样获取它：

```js
import {
  safeFetchAllowListProofFromSeeds,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allowlist = [
  "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy"
];

const allowListProof = await safeFetchAllowListProofFromSeeds(umi, {
  candyMachine: candyMachine.publicKey,
  // 或者使用您的 CM 地址 candyMachine: publicKey("Address")
  candyGuard: candyMachine.mintAuthority,
  // 或者使用您的 candyGuard 地址 candyGuard: publicKey("Address")
  merkleRoot: getMerkleRoot(allowlist),
  user: umi.identity.publicKey,
  // 或者 "铸造" 账户的 publicKey
});
```
