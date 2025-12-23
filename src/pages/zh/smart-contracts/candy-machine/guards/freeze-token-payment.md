---
title: 'Freeze Token Payment 守卫'
metaTitle: Freeze Token Payment 守卫 | Candy Machine
description: '使用冻结期设置代币数量铸造价格。'
---

## 概述

**Freeze Token Payment** 守卫允许通过向付款人收取来自特定铸币账户的特定数量代币来铸造冻结的 NFT。冻结的 NFT 在解冻之前无法转移或在任何市场上架。

冻结的 NFT 可以被任何人解冻，只要满足以下条件之一：

- Candy Machine 已售罄。
- Candy Machine 已被删除。
- 配置的冻结期——最长可达 30 天——已过。

代币会转移到一个"冻结托管"账户，该账户必须在铸造开始之前由 Candy Guard 权限初始化。一旦所有冻结的 NFT 都被解冻，Candy Guard 权限可以解锁资金并将其转移到配置的目标账户。

您可以通过此守卫的 [route 指令](#route-指令)初始化冻结托管账户、解冻 NFT 和解锁资金。

{% diagram  %}

{% node #initialize label="初始化冻结托管" theme="indigo" /%}
{% node parent="initialize"  theme="transparent" x="-8" y="-1" %}
①
{% /node %}
{% edge from="initialize" to="freezeEscrow-pda" path="straight" /%}
{% node #freezeEscrow-pda label="Freeze Escrow PDA" theme="slate" parent="initialize" x="15" y="70" /%}
{% node theme="transparent" parent="freezeEscrow-pda" x="178" y="-15"%}
资金被转移到

托管账户
{% /node %}
{% node #mintFrozen label="铸造冻结 NFT" theme="indigo" parent="initialize" x="250" /%}
{% node parent="mintFrozen"  theme="transparent" x="-8" y="-1" %}
②
{% /node %}
{% edge from="mintFrozen" to="frozen-NFT-bg2" path="straight" /%}
{% edge from="mintFrozen" to="freezeEscrow-pda" toPosition="right" fromPosition="bottom" /%}
{% node #frozen-NFT-bg2 label="Frozen NFT" theme="slate" parent="frozen-NFT" x="-10" y="-10" /%}
{% node #frozen-NFT-bg1 label="Frozen NFT" theme="slate" parent="frozen-NFT" x="-5" y="-5" /%}
{% node #frozen-NFT label="Frozen NFT" theme="slate" parent="mintFrozen" x="33" y="120" /%}

{% node #clock label="🕑" theme="transparent" parent="mintFrozen" x="165" y="-30" /%}
{% edge from="clock" to="clockDesc" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc  theme="transparent" parent="clock" y="220" x="-91" %}
_当所有 NFT 已铸造_

_或冻结期结束时。_
{% /node %}

{% edge from="frozen-NFT" to="thawed-NFT-bg2" path="straight" /%}

{% node #thaw label="解冻 NFT" theme="indigo" parent="mintFrozen" x="200" /%}
{% node parent="thaw"  theme="transparent" x="-8" y="-1" %}
③
{% /node %}
{% edge from="thaw" to="thawed-NFT-bg2" path="straight" /%}
{% node #thawed-NFT-bg2 label="Thawed NFT" theme="slate" parent="thawed-NFT" x="-10" y="-10" /%}
{% node #thawed-NFT-bg1 label="Thawed NFT" theme="slate" parent="thawed-NFT" x="-5" y="-5" /%}
{% node #thawed-NFT label="Thawed NFT" theme="slate" parent="thaw" y="130" x="3" /%}


{% node #clock2 label="🕑" theme="transparent" parent="thaw" x="130" y="-30" /%}
{% edge from="clock2" to="clockDesc2" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc2  theme="transparent" parent="clock2" y="260" x="-91" %}
_当所有 NFT 已解冻时。_
{% /node %}

{% node #unlock label="解锁资金" theme="indigo" parent="thaw" x="180" /%}
{% node parent="unlock"  theme="transparent" x="-8" y="-1"%}
④
{% /node %}
{% node #freezeEscrow-pda2 label="Freeze Escrow PDA" theme="slate" parent="unlock" x="-20" y="70" /%}
{% edge from="freezeEscrow-pda2" to="treasury" theme="dimmed" path="straight" /%}
{% node #treasury label="Treasury" theme="slate" parent="freezeEscrow-pda2" y="70" x="40" /%}

{% /diagram %}
## 守卫设置

Freeze Token Payment 守卫包含以下设置：

- **Amount（数量）**：向付款人收取的代币数量。
- **Mint（铸币账户）**：定义我们要用于支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address（目标关联代币地址，ATA）**：最终将代币发送到的关联代币账户地址。我们可以使用 **Mint** 属性和应该接收这些代币的任何钱包地址来查找关联代币地址 PDA 来获取此地址。

{% dialect-switcher title="使用 Freeze Token Payment 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下是我们如何使用 Freeze Token Payment 守卫创建 Candy Machine。请注意，在此示例中，我们使用 Umi 的身份作为目标钱包。

```tsx
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

create(umi, {
  // ...
  guards: {
    freezeTokenPayment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      }),
    }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
将此对象添加到您的 config.json 文件的 guard 部分：

```json
"freezeTokenPayment" : {
    "amount": number in basis points (e.g. 1000 for 1 Token that has 3 decimals),
    "mint": "<PUBKEY>",
    "destinationAta": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Freeze Token Payment 守卫包含以下铸造设置：

- **Mint（铸币账户）**：定义我们要用于支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address（目标关联代币地址，ATA）**：最终将代币发送到的关联代币账户地址。
- **NFT Rule Set**（可选）：铸造的 NFT 的规则集，如果我们正在铸造带有规则集的可编程 NFT。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要提供这些铸造设置以及更多作为指令参数和剩余账户的组合。有关更多详细信息，请参阅 [Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#freezetokenpayment)。

{% dialect-switcher title="使用 Freeze Token Payment 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Freeze Token Payment 守卫的铸造设置，如下所示。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    freezeTokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
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

Freeze Token Payment route 指令支持以下功能。

- [概述](#概述)
- [守卫设置](#守卫设置)
- [铸造设置](#铸造设置)
- [Route 指令](#route-指令)
  - [初始化冻结托管](#初始化冻结托管)
  - [解冻冻结的 NFT](#解冻冻结的-nft)
  - [解锁资金](#解锁资金)
- [停止冻结 NFT](#停止冻结-nft)
- [冻结托管和守卫组](#冻结托管和守卫组)

### 初始化冻结托管

_路径：`initialize`_

使用 Freeze Token Payment 守卫时，我们必须在铸造开始之前初始化冻结托管账户。这将创建一个从守卫设置的 Destination ATA 属性派生的 PDA 账户。

冻结托管 PDA 账户将跟踪几个参数，例如：

- 通过此守卫铸造了多少冻结的 NFT。
- 第一个冻结的 NFT 是何时通过此守卫铸造的，因为冻结期从那时开始计算。

初始化此冻结托管账户时，我们必须向守卫的 route 指令提供以下参数：

- **Path** = `initialize`：选择要在 route 指令中执行的路径。
- **Mint（铸币账户）**：定义我们要用于支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address（目标关联代币地址，ATA）**：最终将代币发送到的关联代币账户地址。
- **Period（期限）**：冻结期应持续的时间（以秒为单位）。这最多可以是 30 天（2,592,000 秒），它将从通过此守卫铸造的第一个冻结 NFT 开始计算。冻结期提供了一种安全机制，确保即使 Candy Machine 永远不会售罄，冻结的 NFT 最终也可以被解冻。
- **Candy Guard Authority**：作为签名者的 Candy Guard 账户权限。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}

Owner: Candy Machine Core Program {% .whitespace-nowrap %}

{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300"  /%}
{% node #mint label="Mint"  /%}
{% node #destination-ata label="Destination ATA" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="415" %}
  {% node #candy-guard-route theme="pink" %}
    Route with Path {% .whitespace-nowrap %}

    = *Initialize*
  {% /node %}
  {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="-4" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="14" label="Freeze Period" theme="slate" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}


{% edge from="candy-guard-route" to="freezeEscrow-PDA3" theme="pink" path="straight" y="-10" /%}

{% node #freezeEscrow-PDA3 parent="destination-ata" x="397" y="-10" %}
  Freeze Escrow PDA
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="destination-ata" to="freezeEscrow-PDA3" arrow="none" dashed=true path="straight" /%}

{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

最后但同样重要的是，冻结托管 PDA 账户将接收通过此守卫铸造的所有冻结 NFT 的资金。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300"  /%}
{% node #mint label="Mint"  /%}
{% node #destination-ata label="Destination ATA" /%}
{% node label="..." /%}
{% /node %}

{% node #freezeEscrow-PDA4 parent="destination-ata" x="300" y="-8" theme="slate" %}
  Freeze Escrow PDA
{% /node %}
{% edge from="destination-ata" to="freezeEscrow-PDA4" arrow="none" dashed=true path="straight" /%}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
    {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}
{% edge from="mint-candy-guard" to="freezeEscrow-PDA4" theme="pink" toPosition="top"/%}
{% node parent="freezeEscrow-PDA4" y="-250" x="90" theme="transparent" %}
  转移 300 代币

  到冻结托管的

  关联代币地址
{% /node %}

{% node parent="mint-candy-guard" y="150" x="2" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="120" theme="transparent" %}
  Mint Logic
{% /node %}


{% edge from="mint-candy-machine" to="frozen-NFT" path="straight" /%}
{% node #frozen-NFT parent="mint-candy-machine" y="120" x="31" theme="slate" %}
  Frozen NFT
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

‎

{% dialect-switcher title="初始化冻结托管" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

在下面的示例中，我们使用最长 15 天的冻结期初始化冻结托管账户，并使用当前身份作为 Candy Guard 权限。

```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "initialize",
    mint: tokenMint.publicKey,
    destinationAta,
    period: 15 * 24 * 60 * 60, // 15 天。
    candyGuardAuthority: umi.identity,
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

运行以下命令初始化冻结托管账户

```sh
sugar freeze initialize
```

您可以使用以下参数

```
    -c, --config <CONFIG>
            配置文件路径 [默认: config.json]

        --cache <CACHE>
            缓存文件路径，默认为 "cache.json" [默认: cache.json]

        --candy-guard <CANDY_GUARD>
            要更新的 candy guard 地址 [默认为缓存值]

        --candy-machine <CANDY_MACHINE>
            要更新的 candy machine 地址 [默认为缓存值]

        --destination <DESTINATION>
            目标（国库）账户地址

    -h, --help
            打印帮助信息

    -k, --keypair <KEYPAIR>
            密钥对文件路径，使用 Sol 配置或默认为 "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            日志级别：trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard 组标签

    -r, --rpc-url <RPC_URL>
            RPC URL
```

使用带有守卫组的 candy machine 时，您需要使用 `--label` 参数。
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 解冻冻结的 NFT

_路径：`thaw`_

冻结的 NFT 可以被任何人解冻，只要满足以下条件之一：

- Candy Machine 已售罄。
- Candy Machine 已被删除。
- 配置的冻结期——最长可达 30 天——已过。

请注意，由于冻结托管中的代币在所有 NFT 解冻之前无法转移，这激励国库尽快解冻所有 NFT。

要解冻冻结的 NFT，我们必须向守卫的 route 指令提供以下参数：

- **Path** = `thaw`：选择要在 route 指令中执行的路径。
- **Mint（铸币账户）**：定义我们要用于支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address（目标关联代币地址，ATA）**：最终将代币发送到的关联代币账户地址。
- **NFT Mint**：要解冻的冻结 NFT 的铸币地址。
- **NFT Owner**：要解冻的冻结 NFT 所有者的地址。
- **NFT Token Standard**：要解冻的冻结 NFT 的代币标准。
- **NFT Rule Set**（可选）：要解冻的冻结 NFT 的规则集，如果我们正在解冻带有规则集的可编程 NFT。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
  Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="-3" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300"  /%}
{% node #mint label="Mint"  /%}
{% node #destination-ata label="Destination ATA" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="427" y="-14" %}
  {% node #candy-guard-route theme="pink" %}
    Route with

    Path = *thaw*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="80" theme="transparent" %}
  Thaw a Frozen NFT
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="218" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="candy-machine" to="candy-guard-route" theme="pink" /%}
{% edge from="candy-guard" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}


{% edge from="candy-guard-route" to="freezeEscrow-PDA5" theme="pink" path="straight" /%}

{% node #frozen-NFT parent="candy-guard-route" y="-100" x="29" label="Frozen NFT" /%}
{% edge from="frozen-NFT" to="candy-guard-route" path="straight" /%}

{% node #freezeEscrow-PDA5 parent="candy-guard-route" x="25" y="150" label="Thawed NFT" /%}
{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

‎

{% dialect-switcher title="使用 Freeze Token Payment 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

在下面的示例中，我们解冻属于当前身份的冻结 NFT。

```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "thaw",
    mint: tokenMint.publicKey,
    destinationAta,
    nftMint: nftMint.publicKey,
    nftOwner: umi.identity.publicKey,
    nftTokenStandard: candyMachine.tokenStandard,
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

运行以下命令解冻 NFT：

```sh
sugar freeze thaw
```

您可以使用以下参数

```
ARGS:
    <NFT_MINT>    要解冻的 NFT 地址

OPTIONS:
        --all
            解冻 candy machine 中的所有 NFT

    -c, --config <CONFIG>
            配置文件路径 [默认: config.json]

        --cache <CACHE>
            缓存文件路径，默认为 "cache.json" [默认: cache.json]

        --candy-guard <CANDY_GUARD>
            要更新的 candy guard 地址 [默认为缓存值]

        --candy-machine <CANDY_MACHINE>
            要更新的 candy machine 地址 [默认为缓存值]

        --destination <DESTINATION>
            目标（国库）账户地址

    -h, --help
            打印帮助信息

    -k, --keypair <KEYPAIR>
            密钥对文件路径，使用 Sol 配置或默认为 "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            日志级别：trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard 组标签

    -r, --rpc-url <RPC_URL>
            RPC URL

    -t, --timeout <TIMEOUT>
            获取铸币列表的 RPC 超时时间（秒）

        --use-cache
            指示创建/使用铸币列表的缓存文件
```

使用带有守卫组的 candy machine 时，您需要使用 `--label` 参数。
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 解锁资金

_路径：`unlockFunds`_

一旦所有冻结的 NFT 都被解冻，国库可以从冻结托管账户解锁资金。这将把代币转移到配置的目标 ATA 地址。

要解锁资金，我们必须向守卫的 route 指令提供以下参数：

- **Path** = `unlockFunds`：选择要在 route 指令中执行的路径。
- **Mint（铸币账户）**：定义我们要用于支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address（目标关联代币地址，ATA）**：最终将代币发送到的关联代币账户地址。
- **Candy Guard Authority**：作为签名者的 Candy Guard 账户权限。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="19" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="- Amount"  /%}
{% node #mint label="- Mint" /%}
{% node #destination-ata label="- Destination ATA" /%}
{% node label="..." /%}
{% /node %}
{% edge from="destination-ata" to="token-account" arrow="none" dashed=true arrow="none" /%}

{% node parent="candy-machine" x="600" %}
  {% node #candy-guard-route theme="pink" %}
    Route with

    Path = *unlockFunds*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}

{% node parent="candy-guard-route" y="-32" x="95" theme="transparent" %}
  从托管解锁资金
{% /node %}

{% node #freeze-escrow parent="candy-guard-route" y="100" x="2" label="Freeze Escrow PDA" /%}
{% edge from="freeze-escrow" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="guards" to="candy-guard-route" theme="pink" toPosition="top" /%}

{% node parent="candy-guard" x="300" y="29" %}
{% node #mint-account label="Mint Account" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="mint" to="mint-account" arrow="none" dashed=true arrow="none" /%}
{% edge from="mint-account" to="token-account" /%}

{% node parent="mint-account" y="100" %}
{% node #token-account theme="blue" %}
Token Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="token-account" y="90" x="-40" %}
{% node #destination-wallet label="Destination Wallet" theme="indigo" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program  {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="token-account" to="destination-wallet" arrow="none" /%}
{% edge from="candy-guard-route" to="token-account" theme="pink" /%}
{% node parent="token-account" theme="transparent" x="210" y="-20" %}
从冻结托管账户

转移所有资金
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}

{% /diagram %}

‎

{% dialect-switcher title="使用 Freeze Token Payment 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

在下面的示例中，我们使用当前身份作为 Candy Guard 权限从冻结托管账户解锁资金。

```ts
route(umi, {
  // ...
  guard: 'freezeTokenPayment',
  routeArgs: {
    path: 'unlockFunds',
    destination,
    candyGuardAuthority: umi.identity,
  },
})
```

API 参考：[route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html)、[freezeTokenPaymentRouteArgsUnlockFunds](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeTokenPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

运行以下命令从冻结托管账户解锁资金

```sh
sugar freeze unlock-funds
```

您可以使用以下参数

```
    -c, --config <CONFIG>
            配置文件路径 [默认: config.json]

        --cache <CACHE>
            缓存文件路径，默认为 "cache.json" [默认: cache.json]

        --candy-guard <CANDY_GUARD>
            要更新的 candy guard 地址 [默认为缓存值]

        --candy-machine <CANDY_MACHINE>
            要更新的 candy machine 地址 [默认为缓存值]

        --destination <DESTINATION>
            目标（国库）账户地址

    -h, --help
            打印帮助信息

    -k, --keypair <KEYPAIR>
            密钥对文件路径，使用 Sol 配置或默认为 "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            日志级别：trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard 组标签

    -r, --rpc-url <RPC_URL>
            RPC URL
```

使用带有守卫组的 candy machine 时，您需要使用 `--label` 参数。
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 停止冻结 NFT

可以停止 Freeze Token Payment 守卫内的 NFT 冻结。换句话说，新铸造的 NFT 将不再被冻结，但**现有的冻结 NFT 将保持冻结状态**。

有几种方法可以实现这一点，可以分为两类：

- ☀️ **可解冻**：现有的冻结 NFT 可以被任何人使用 route 指令的 `thaw` 路径解冻。
- ❄️ **不可解冻**：现有的冻结 NFT 尚无法解冻，我们必须等待满足"可解冻"条件。

考虑到这一点，以下是停止冻结 NFT 的详尽方法列表，以及每种方法是否允许解冻现有的冻结 NFT：

- Candy Machine 已售罄 → ☀️ **可解冻**。
- 配置的冻结期——最长可达 30 天——已过 → ☀️ **可解冻**。
- Candy Machine 账户已删除 → ☀️ **可解冻**。
- Candy Guard 账户已删除 → ❄️ **不可解冻**。
- Freeze Token Payment 守卫已从设置中移除 → ❄️ **不可解冻**。

## 冻结托管和守卫组

在各种[守卫组](/zh/smart-contracts/candy-machine/guard-groups)中使用多个 Freeze Token Payment 守卫时，了解 Freeze Token Payment 守卫和冻结托管账户之间的关系非常重要。

冻结托管账户是从目标地址派生的 PDA。这意味着如果**多个 Freeze Token Payment 守卫**配置为使用**相同的目标地址**，它们都将**共享相同的冻结托管账户**。

因此，它们也将共享相同的冻结期，所有资金将由同一个托管账户收集。这也意味着，我们只需要为每个配置的目标地址调用一次 `initialize` route 指令。这意味着每个配置的目标地址只需要一次 route 指令。`unlockFunds` 也是如此。要 `thaw`，您可以使用任何标签，只要这些标签共享相同的托管账户。

也可以使用具有不同目标地址的多个 Freeze Token Payment 守卫。在这种情况下，每个 Freeze Token Payment 守卫将拥有自己的冻结托管账户和自己的冻结期。

下面的示例说明了一个 Candy Machine，它在三个组中有三个 Freeze Token Payment 守卫，使得：

- 组 1 和组 2 共享相同的目标地址，因此共享相同的冻结托管账户。
- 组 3 有自己的目标地址，因此有自己的冻结托管账户。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guard Group 1" theme="mint" /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300" /%}
{% node #mint label="Mint" /%}
{% node #destination-ata label="Destination ATA A" /%}
{% node label="..." /%}
{% node #guards-2 label="Guard Group 2" theme="mint" /%}
{% node #freezeTokenPayment-2 label="Freeze Token Payment" /%}
{% node #amount-2 label="Amount = 300" /%}
{% node #mint-2 label="Mint" /%}
{% node #destination-2 label="Destination ATA A" /%}
{% node label="..." /%}
{% node #guards-3 label="Guard Group 3" theme="mint" /%}
{% node #freezeTokenPayment-3 label="Freeze Token Payment" /%}
{% node #amount-3 label="Amount = 300" /%}
{% node #mint-3 label="Mint" /%}
{% node #destination-3 label="Destination ATA B" /%}
{% node label="..." /%}
{% /node %}
{% /node %}

{% node #freezeEscrow-PDA-A parent="destination-ata" x="213" y="-23" %}
  Freeze Escrow PDA

  For Destination A
{% /node %}
{% edge from="destination-ata" to="freezeEscrow-PDA-A" arrow="none" dashed=true path="straight" /%}
{% edge from="destination-2" to="freezeEscrow-PDA-A" arrow="none" dashed=true toPosition="bottom" /%}

{% node parent="freezeEscrow-PDA-A" y="-125" x="-4" %}
  {% node #route-init-a theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-a" y="-20" x="50" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-a" to="freezeEscrow-PDA-A" theme="pink" path="straight" /%}

{% node #freeze-period-a parent="route-init-a" x="240" y="15" theme="slate" %}
  Freeze Period A
{% /node %}
{% edge from="freeze-period-a" to="route-init-a" theme="pink" path="straight" /%}

{% node #freezeEscrow-PDA-B parent="destination-3" x="420" y="-22" %}
  Freeze Escrow PDA

  For Destination B
{% /node %}
{% edge from="destination-3" to="freezeEscrow-PDA-B" arrow="none" dashed=true path="straight" /%}

{% node parent="freezeEscrow-PDA-B" y="-125" x="-4" %}
  {% node #route-init-b theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-b" y="-20" x="50" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-b" to="freezeEscrow-PDA-B" theme="pink" path="straight" /%}

{% node #freeze-period-b parent="route-init-b" x="240" y="15" theme="slate" %}
  Freeze Period B
{% /node %}
{% edge from="freeze-period-b" to="route-init-b" theme="pink" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}

{% /diagram %}
