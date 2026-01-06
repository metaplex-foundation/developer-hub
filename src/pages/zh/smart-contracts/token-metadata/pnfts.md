---
title: 可编程 NFT (pNFTs)
metaTitle: 可编程 NFT (pNFTs) | Token Metadata
description: 了解更多关于 Token Metadata 上的可编程 NFT（即 pNFTs）
---

如[概述页面](/zh/smart-contracts/token-metadata#pnfts)所述，可编程 NFT (pNFTs) 是一种新的资产标准，允许创作者在特定操作上定义自定义规则，并更精细地委托给第三方权限。{% .lead %}

## 不再绕过 Token Metadata

由于 Token Metadata 程序构建在 SPL Token 程序之上，任何所有者或 spl-token 委托都可以直接与 SPL Token 程序交互，并在转移和销毁等关键操作上绕过 Token Metadata 程序。虽然这在程序之间创建了良好的可组合性模式，但这也意味着 Token Metadata 程序无法代表创作者强制执行任何规则。

为什么这可能是问题的一个很好的例子是 Token Metadata 无法强制执行二次销售版税。尽管版税百分比存储在 **Metadata** 账户上，但执行转移的用户或程序可以决定是否要遵守它。我们在[下面的部分](#用例版税强制执行)中详细讨论了这一点以及 pNFTs 如何解决这个问题。

可编程 NFT 的引入是为了以灵活的方式解决这个问题，**允许创作者自定义其资产的授权层**。

可编程 NFT 的工作方式如下：

- **pNFT 的 Token 账户在 SPL Token 程序上始终是冻结的**，无论 pNFT 是否被委托。这确保没有人可以通过直接与 SPL Token 程序交互来绕过 Token Metadata 程序。
- 每当在 pNFT 的 Token 账户上执行操作时，Token Metadata 程序会**解冻账户、执行操作，然后再次冻结账户**。所有这些都在同一指令中**原子性地**发生。这样，所有可以在 SPL Token 程序上进行的操作对 pNFTs 仍然可用，但它们始终通过 Token Metadata 程序执行。
- 当在 pNFT 上设置 [Token 委托](/zh/smart-contracts/token-metadata/delegates#token-delegates) 时，信息存储在 **Token Record** 账户中。由于 pNFTs 在 SPL Token 程序上始终是冻结的，Token Record 账户负责跟踪 pNFT 是否真正被锁定。
- 因为每个影响 pNFT 的操作都必须通过 Token Metadata 程序，我们创建了一个瓶颈，允许我们为这些操作强制执行授权规则。这些规则在由 **Token Auth Rules** 程序管理的 **Rule Set** 账户中定义。

本质上，这赋予了 pNFTs 以下能力：

1. 拥有更精细的委托。
2. 在任何操作上强制执行规则。

让我们更详细地深入了解这两种能力。

## 更精细的委托

由于所有 pNFTs 操作都必须通过 Token Metadata 程序，它可以在 spl-token 委托之上创建一个新的委托系统。一个更精细的系统，允许 pNFT 所有者选择他们想要委托给第三方的操作。

这个新委托系统的信息存储在一个特殊的 **Token Record** PDA 上，该 PDA 从 pNFT 的 Mint 和 Token 账户派生。当新的委托权限被分配给 pNFT 时，Token Metadata 程序会在 Token 账户和 Token Record 账户上同步该信息。

我们在[委托权限页面的"Token 委托"部分](/zh/smart-contracts/token-metadata/delegates#token-delegates)中更详细地讨论这些委托。

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token 账户" theme="blue" /%}
{% node label="所有者: Token Program" theme="dimmed" /%}
{% node label="委托权限" theme="orange" z=1 /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint 账户" theme="blue" /%}
{% node label="所有者: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="0" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record 账户" theme="crimson" /%}
{% node label="所有者: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State" /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

## 附加账户

pNFTs 在大多数操作中需要附加账户，包括 `tokenRecord`、`authorizationRules`、`authorizationRulesProgram`。

### Token Record

`tokenRecord` 账户负责保存关于代币及其状态的详细信息，例如 `delegates`、它的 `lock` 状态。

有几种方法可以访问 `tokenRecord` 账户，一种是通过 `fetchDigitalAssetWithAssociatedToken`，它返回所有需要的账户，包括 metadata、token account 和 token record。
另一种方法是使用 mint ID 和 token account 地址通过 `findTokenRecordPda` 函数生成 token record PDA 地址。

#### 带 Token 的资产

您可以使用 `fetchDigitalAssetWithAssociatedToken` 函数获取所有需要的账户，它返回 pNFT metadata 账户、token 账户和 token record 账户等数据。

```ts
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
    // Umi 实例
    umi,
    // Mint ID
    publicKey("11111111111111111111111111111111"),
    // 所有者
    publicKey("22222222222222222222222222222222")
);
```

#### Token Record PDA

使用 `mintId` 和存储 pNFT 资产的钱包的 `tokenAccount` 生成 `tokenRecord` 账户的 PDA 地址。

```ts
const tokenRecordPda = findTokenRecordPda(umi, {
    // pNFT mint ID
    mint: publicKey("11111111111111111111111111111111")s,
    // Token 账户
    token: publicKey("22222222222222222222222222222222"),
});
```

### RuleSet

如果您有可用的 `metadata` 账户数据，您可以使用 `unwrap` 来检查 metadata 账户上的 `programableConfig` 字段。

```ts
const ruleSet = unwrapOptionRecursively(assetWithToken.metadata.programmableConfig)?.ruleSet
```

### Authorization Rules 程序

如果您的 pNFT 资产上设置了 `ruleSet`，您需要传入 **Authorization Rules Program ID** 以便验证 `ruleSet`。有两种方法可以获取此 ID，一种是从 `mpl-token-auth-rules` npm 包获取，另一种是手动粘贴 ID。

#### mpl-token-auth-rules

```ts
const authorizationRulesProgram = getMplTokenAuthRulesProgramId(umi)
```
或

#### 程序地址
```ts
const authorizationRulesProgram = pubicKey("auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg")
```

### Authorization Data

如果您的 pNFT 资产上有需要额外数据进行验证的 `ruleSet`，您需要在此处传入。

```ts
const = authorizationData: { payload: ... },
```

## 在任何操作上强制执行规则

可编程 NFT 最重要的功能之一是它们能够在任何影响它们的操作上强制执行一组规则。整个授权层由另一个名为 [Token Auth Rules](/zh/smart-contracts/token-auth-rules) 的 Metaplex 程序提供。虽然该程序用于使 pNFTs 可编程，但它是一个通用程序，可用于为任何用例创建和验证授权规则。

对于 pNFTs，支持以下操作：

| 操作                          | 描述                                                                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Transfer:Owner`              | 由 pNFT 所有者发起的转移                                                                                                                                                                |
| `Transfer:SaleDelegate`       | 由[销售委托](/zh/smart-contracts/token-metadata/delegates#sale-delegate-pnft-only)发起的转移                                                                                                               |
| `Transfer:TransferDelegate`   | 由[转移](/zh/smart-contracts/token-metadata/delegates#transfer-delegate-pnft-only)或[锁定转移](/zh/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only)委托发起的转移                                 |
| `Transfer:MigrationDelegate`  | 由迁移委托（pNFT 迁移期间使用的旧委托）发起的转移                                                                                                                                        |
| `Transfer:WalletToWallet`     | 钱包之间的转移（目前未使用）                                                                                                                                                            |
| `Delegate:Sale`               | 批准[销售委托](/zh/smart-contracts/token-metadata/delegates#sale-delegate-pnft-only)                                                                                                                       |
| `Delegate:Transfer`           | 批准[转移委托](/zh/smart-contracts/token-metadata/delegates#transfer-delegate-pnft-only)                                                                                                                   |
| `Delegate:LockedTransfer`     | 批准[锁定转移委托](/zh/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only)                                                                                                        |
| `Delegate:Utility`            | 批准[实用委托](/zh/smart-contracts/token-metadata/delegates#utility-delegate-pnft-only)                                                                                                                    |
| `Delegate:Staking`            | 批准[质押委托](/zh/smart-contracts/token-metadata/delegates#staking-delegate-pnft-only)                                                                                                                    |

创作者可以为任何这些操作分配自定义**规则**。当执行该操作时，Token Metadata 程序将在允许操作执行之前确保规则有效。可用规则由 Token Auth Rules 程序直接记录，但值得注意的是有两种类型的规则：

- **原始规则**：这些规则明确告诉我们操作是否被允许。例如：`PubkeyMatch` 规则仅当给定字段的公钥与给定公钥匹配时才会通过；`ProgramOwnedList` 仅当拥有给定字段账户的程序是给定程序列表的一部分时才会通过；`Pass` 规则始终通过；等等。
- **复合规则**：这些规则将多个规则聚合在一起以创建更复杂的授权逻辑。例如：`All` 规则仅当它包含的所有规则都通过时才会通过；`Any` 规则仅当它包含的至少一个规则通过时才会通过；`Not` 规则仅当它包含的规则不通过时才会通过；等等。

一旦我们为操作定义了所有规则，我们就可以将它们存储在 Token Auth Rules 程序的 **Rule Set** 账户中。每当我们需要更改此 Rule Set 时，新的 **Rule Set Revision** 会被附加到 Rule Set 账户。这确保任何当前锁定在特定修订版中的 pNFT 可以在移动到最新修订版之前解锁。

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token 账户" theme="blue" /%}
{% node label="所有者: Token Program" theme="dimmed" /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint 账户" theme="blue" /%}
{% node label="所有者: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="41" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record 账户" theme="crimson" /%}
{% node label="所有者: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #ruleset-revision label="Rule Set Revision" theme="orange" z=1 /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-80" %}
{% node #metadata label="Metadata 账户" theme="crimson" /%}
{% node label="所有者: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #programmable-configs label="Programmable Configs" theme="orange" z=1 /%}
{% /node %}

{% node parent="metadata" x="-260" %}
{% node #ruleset label="Rule Set 账户" theme="crimson" /%}
{% node label="所有者: Token Auth Rules Program" theme="dimmed" /%}
{% node label="Header" /%}
{% node label="Rule Set Revision 0" /%}
{% node #ruleset-revision-1 label="Rule Set Revision 1" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" fromPosition="top" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" path="straight" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% edge from="programmable-configs" to="ruleset" dashed=true arrow="none" animated=true /%}
{% edge from="ruleset-revision" to="ruleset-revision-1" dashed=true arrow="none" animated=true toPosition="left" /%}
{% /diagram %}

## 用例：版税强制执行

现在我们对 pNFTs 有了更好的理解，让我们看一个可以用 PNFTs 解决的具体用例：版税强制执行。

如上所述，没有 pNFTs，任何人都可以通过直接与 SPL Token 程序交互来绕过存储在 **Metadata** 账户上的版税百分比。这意味着创作者必须依赖与其资产交互的用户和程序的善意。

然而，使用 pNFTs，创作者可以设计一个 **Rule Set**，确保**不强制执行版税的程序被禁止在其资产上执行转移**。他们可以使用规则组合来创建允许列表或拒绝列表，具体取决于他们的需求。

此外，由于 Rule Sets 可以在多个 pNFTs 之间共享和重用，创作者可以创建和共享**社区 Rule Sets**，以确保任何停止支持版税的程序立即被禁止与使用此类社区 Rule Set 的任何 pNFTs 交互。这为程序支持版税创造了强大的激励，否则它们将被禁止与大量资产交互。
