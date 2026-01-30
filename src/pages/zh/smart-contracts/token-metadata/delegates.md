---
title: 委托权限
metaTitle: 委托权限 | Token Metadata
description: 了解如何为您在 Token Metadata 上的资产批准委托权限
---

对我们的资产只有单一权限并不总是理想的。有时我们希望将其中一些职责委托给其他钱包或程序，以便它们可以代表我们做事。这就是为什么 Token Metadata 提供了一整套具有不同作用域的委托。{% .lead %}

## 元数据委托与代币委托

Token Metadata 提供的委托可以分为两类：**元数据委托**和**代币委托**。我们将在下面详细介绍它们，但让我们先快速了解一下它们的区别。

- **元数据委托**与资产的铸造账户相关联，并允许委托权限对元数据账户执行更新。它们由资产的更新权限批准，并且可以根据需要有任意多个。
- **代币委托**与资产的代币账户相关联，并允许委托权限转移、销毁和/或锁定代币。它们由资产的所有者批准，每个代币账户一次只能有一个。

## 元数据委托

元数据委托是在元数据级别操作的委托。这些委托使用**元数据委托记录** PDA 存储——其种子为 `["metadata", program id, mint id, delegate role, update authority id, delegate id]`。

该账户跟踪**委托**权限以及批准它的**更新权限**。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-15" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-delegate-pda parent="mint" x="-15" y="-260" label="PDA" theme="crimson" /%}

{% node parent="metadata-delegate-pda" x="-283" %}
{% node #metadata-delegate label="Metadata Delegate Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataDelegate" /%}
{% node label="Bump" /%}
{% node label="Mint" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Update Authority" theme="orange" z=1 /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="metadata-delegate-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="metadata-delegate-pda" to="metadata-delegate" path="straight" /%}
{% /diagram %}

以下是元数据委托的一些关键属性：

- 给定资产可以有任意多个元数据委托。
- 元数据委托从铸造账户派生，这意味着它们的存在与资产的所有者无关。因此，转移资产不会影响元数据委托。
- 元数据委托也从资产的当前更新权限派生。这意味着，每当资产上的更新权限被更新时，所有元数据委托都会失效，新的更新权限无法使用。但是，如果更新权限被转移回来，所有与之关联的元数据委托将自动重新激活。
- 元数据委托可以由批准它们的更新权限撤销。
- 元数据委托也可以自行撤销。

存在 7 种不同类型的元数据委托，每种都有不同的操作范围。以下是总结不同类型元数据委托的表格：

| 委托                  | 自我更新 | 更新集合中的项目 | 更新范围                                                              |
| ------------------------- | ------------ | -------------------------- | ------------------------------------------------------------------------- |
| Authority Item            | ✅           | ❌                         | `newUpdateAuthority` ,`primarySaleHappened` ,`isMutable` ,`tokenStandard` |
| Collection                | ✅           | ✅                         | `collection` + 验证/取消验证项目上的集合                        |
| Collection Item           | ✅           | ❌                         | `collection`                                                              |
| Data                      | ✅           | ✅                         | `data`                                                                    |
| Data Item                 | ✅           | ❌                         | `data`                                                                    |
| Programmable Configs      | ✅           | ✅                         | `programmableConfigs`                                                     |
| Programmable Configs Item | ✅           | ❌                         | `programmableConfigs`                                                     |

请注意，名称以 `Item` 结尾的元数据委托只能对自己进行操作，而其他委托还可以对委托资产的集合项目进行操作。例如，假设我们有一个包含 NFT B 和 C 的集合 NFT A。当我们在 A 上批准**数据**委托时，我们可以更新 NFT A、B 和 C 的 `data` 对象。但是，当我们在 A 上批准**数据项**委托时，我们只能更新 NFT A 的 `data` 对象。

此外，**集合**委托有点特殊，因为它还允许我们在集合的项目上验证/取消验证委托的 NFT。在上面的例子中，当我们在 A 上批准**集合**委托时，我们可以在 NFT B 和 C 上验证/取消验证该集合。

让我们更详细地介绍每个元数据委托，并提供批准、撤销和使用它们的代码示例。

### Authority Item 委托

- 委托权限可以更新资产的一个子集。它可以更新元数据账户的以下属性：
  - `newUpdateAuthority`：将更新权限转移到另一个账户。
  - `primarySaleHappened`：在资产的主要销售发生时切换为 `true`。
  - `isMutable`：切换为 `false` 使资产不可变。
  - `tokenStandard`：如果资产是在强制设置之前创建的，可以设置代币标准。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-authority-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-authority-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-authority-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Collection 委托

- 委托权限可以更新资产的一个子集。它可以设置元数据账户的 `collection` 属性。
- 当应用于集合 NFT 时，委托权限可以对该集合中的项目执行以下操作：
  - 它可以在项目上验证和取消验证该集合 NFT。只有当集合 NFT 已经在项目上设置时才能执行此操作。否则，无法知道该项目是否属于委托的集合 NFT。
  - 它可以从项目中清除集合 NFT。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="更新委托资产上的集合" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="清除项目上的集合" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-clear" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="验证项目上的集合" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-verify" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取消验证项目上的集合" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-unverify" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Collection Item 委托

- 委托权限可以更新资产的一个子集。它可以设置元数据账户的 `collection` 属性。
- 即使资产是集合 NFT，与集合委托相反，集合项委托也不能影响该集合的项目。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Data 委托

- 委托权限可以更新资产的一个子集。它可以更新元数据账户的整个 `data` 对象，但不能更新其他内容。这意味着它可以更新资产的 `creators`。
- 请注意，当更新 `data` 对象中的 `creators` 数组时，它只能添加和/或删除未验证的创作者。
- 当应用于集合 NFT 时，委托权限可以对该集合中的项目执行相同的更新。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="对项目执行委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-update-item" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Data Item 委托

- 委托权限可以更新资产的一个子集。它可以更新元数据账户的整个 `data` 对象，但不能更新其他内容。这意味着它可以更新资产的 `creators`。
- 请注意，当更新 `data` 对象中的 `creators` 数组时，它只能添加和/或删除未验证的创作者。
- 即使资产是集合 NFT，与数据委托相反，数据项委托也不能影响该集合的项目。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Programmable Config 委托

- 可编程配置委托仅适用于[可编程非同质化代币](/zh/smart-contracts/token-metadata/pnfts)。
- 委托权限可以更新元数据账户的 `programmableConfigs` 属性，但不能更新其他内容。这意味着它可以更新 PNFT 的 `ruleSet`。
- 当应用于集合 NFT 时，委托权限可以对该集合中的项目执行相同的更新。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="对项目执行委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-update-item" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Programmable Config Item 委托

- 可编程配置委托仅适用于[可编程非同质化代币](/zh/smart-contracts/token-metadata/pnfts)。
- 委托权限可以更新元数据账户的 `programmableConfigs` 属性，但不能更新其他内容。这意味着它可以更新 PNFT 的 `ruleSet`。
- 即使资产是集合 NFT，与可编程配置委托相反，可编程配置项委托也不能影响该集合的项目。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

## 代币委托

代币委托是在代币级别操作的委托。这意味着它们是直接存储在 SPL Token 程序的代币账户上的 spl-token 委托。因此，代币委托允许委托代表所有者**转移和销毁代币**，但也可以**锁定和解锁代币**以防止所有者转移、销毁甚至撤销委托。这些委托对于无托管市场、质押、资产贷款等应用程序至关重要。

虽然 SPL Token 程序只提供一种类型的委托，但[可编程 NFT](/zh/smart-contracts/token-metadata/pnfts)（PNFT）允许 Token Metadata 程序提供更细粒度的委托，可以根据具体情况进行选择。这是因为 PNFT 在 SPL Token 程序上始终被冻结，这意味着我们可以在其上构建委托系统。

我们将该委托系统存储在 PNFT 特定账户上，称为**代币记录** PDA——其种子为 `["metadata", program id, mint id, "token_record", token account id]`。我们也在 SPL Token 程序上同步委托权限，但代币始终被冻结。代币记录账户负责跟踪资产是否真的被锁定。

{% diagram height="h-64 md:h-[600px]" %}
{% node %}
{% node #wallet-1 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" x=-10 y=-25 label="Non-Fungibles and Semi-Fungibles" theme="transparent" /%}

{% node x="200" parent="wallet-1" %}
{% node #token-1 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount" theme="orange" z=1 /%}
{% /node %}

{% node x="200" parent="token-1" %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" y=150 %}
{% node #wallet-2 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-2" x=-10 y=-25 label="Programmable Non-Fungibles" theme="transparent" /%}

{% node #token-2-wrapper x="200" parent="wallet-2" %}
{% node #token-2 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount = 1" /%}
{% node label="Token State = Frozen" theme="orange" z=1 /%}
{% /node %}

{% node #mint-2-wrapper x="200" parent="token-2" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint-2" x="-158" y="150" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State = Locked, Unlocked, Listed" theme="orange" z=1 /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" theme="orange" z=1 /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet-1" to="token-1" /%}
{% edge from="mint-1" to="token-1" /%}

{% edge from="wallet-2" to="token-2" /%}
{% edge from="mint-2" to="token-2" /%}
{% edge from="token-2-wrapper" to="token-record-pda" fromPosition="bottom" path="straight" /%}
{% edge from="mint-2-wrapper" to="token-record-pda" fromPosition="bottom" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

以下是代币委托的一些关键属性：

- 每个代币账户只能有一个代币委托。在同一个代币账户上设置新的代币委托将覆盖现有的委托。
- 只要资产未被锁定，资产所有者就可以撤销代币委托。
- 代币委托不能自行撤销，因为它们也在代币程序上设置，而代币程序不允许委托自行撤销。
- 代币委托在转移时重置。在处理同质化资产时，当所有委托的代币都被转移时，委托权限将重置。
- 标准委托可以被除可编程非同质化代币之外的所有资产使用。所有其他代币委托只能被可编程非同质化代币使用。
- 所有可以被可编程非同质化代币使用的代币委托都会在 PNFT 的代币记录账户上存储当前的委托权限、其角色及其状态——锁定或解锁。

存在 6 种不同类型的代币委托，每种都有不同的操作范围。以下是总结不同类型代币委托的表格：

| 委托        | 锁定/解锁 | 转移 | 销毁 | 适用于              | 注意                                                      |
| --------------- | ----------- | -------- | ---- | ---------------- | --------------------------------------------------------- |
| Standard        | ✅          | ✅       | ✅   | 除 PNFT 外的所有资产 |                                                           |
| Sale            | ❌          | ✅       | ❌   | 仅限 PNFT       | 在撤销委托之前，所有者无法转移/销毁 |
| Transfer        | ❌          | ✅       | ❌   | 仅限 PNFT       | 即使设置了委托，所有者也可以转移/销毁       |
| Locked Transfer | ✅          | ✅       | ❌   | 仅限 PNFT       |                                                           |
| Utility         | ✅          | ❌       | ✅   | 仅限 PNFT       |                                                           |
| Staking         | ✅          | ❌       | ❌   | 仅限 PNFT       |                                                           |

请注意，**标准**委托比其他 PNFT 特定委托拥有更多权力，因为我们必须简单地遵从 spl-token 委托。但是，其他委托更细粒度，可以在更具体的用例中使用。例如，**销售**委托非常适合在市场上列出资产，因为只要设置了委托，它们就会禁止所有者销毁或转移。

让我们更详细地介绍每个代币委托，并提供批准、撤销和使用它们的代码示例。

### Standard 委托

如上所述，标准委托是 spl-token 委托的包装器。虽然我们可以直接向 Token 程序发送指令，但此委托旨在在 Token Metadata 上提供相同的 API，无论代币标准如何。此外，标准委托能够锁定/解锁资产，这在原生 spl-token 委托中是不可能的。

以下是标准委托的一些关键属性：

- 此委托不适用于可编程非同质化代币。
- 委托权限可以将资产转移到任何地址。这样做将撤销委托权限。
- 委托权限可以销毁资产。
- 委托权限可以锁定资产——也称为在 Token 程序上"冻结"资产。在委托权限解锁（或"解冻"）资产之前，所有者无法转移它、销毁它或撤销委托权限。这是标准委托特有的，在原生 spl-token 委托中无法完成。
- 当与同质化资产一起使用时，可以提供大于 1 的金额来指定要委托给委托权限的代币数量。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托转移" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托销毁" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-burn" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="锁定（冻结）" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="解锁（解冻）" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Sale 委托（仅限 PNFT）

- 此委托仅适用于可编程非同质化代币。
- 委托权限可以将 PNFT 转移到任何地址。这样做将撤销委托权限。
- 只要在 PNFT 上设置了销售委托，PNFT 就会进入称为 `Listed` 的特殊代币状态。`Listed` 代币状态是 `Locked` 代币状态的较软变体。在此期间，所有者无法转移或销毁 PNFT。但是，所有者可以随时撤销销售委托，这将删除 `Listed` 代币状态，并使 PNFT 再次可转移和可销毁。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-sale-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-sale-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托转移" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-sale-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Transfer 委托（仅限 PNFT）

- 此委托仅适用于可编程非同质化代币。
- 委托权限可以将 PNFT 转移到任何地址。这样做将撤销委托权限。
- 与销售委托相反，当设置了转移委托时，所有者仍然可以转移和销毁 PNFT。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-transfer-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-transfer-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托转移" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-transfer-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Locked Transfer 委托（仅限 PNFT）

- 此委托仅适用于可编程非同质化代币。
- 委托权限可以锁定 PNFT。在委托权限解锁 PNFT 之前，所有者无法转移它、销毁它或撤销委托权限。
- 委托权限可以将 PNFT 转移到任何地址。这样做将撤销委托权限，如果它被锁定，还会解锁 PNFT。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托转移" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="锁定" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="解锁" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Utility 委托（仅限 PNFT）

- 此委托仅适用于可编程非同质化代币。
- 委托权限可以锁定 PNFT。在委托权限解锁 PNFT 之前，所有者无法转移它、销毁它或撤销委托权限。
- 委托权限可以销毁 PNFT。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委托销毁" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-burn" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="锁定" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="解锁" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Staking 委托（仅限 PNFT）

- 此委托仅适用于可编程非同质化代币。
- 委托权限可以锁定 PNFT。在委托权限解锁 PNFT 之前，所有者无法转移它、销毁它或撤销委托权限。

{% totem %}

{% totem-accordion title="批准" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="撤销" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="锁定" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="解锁" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

## 旧版委托

最后，值得注意的是——在这个委托系统之前——集合委托曾经存储在特定的**集合权限记录** PDA 上。该 PDA 类似于**元数据委托记录**，不同之处在于它只支持一个角色：**集合**。这个旧版集合委托现已弃用，我们建议改用新的委托系统。

话虽如此，Token Metadata 程序仍然接受这些旧版集合委托，无论在哪里需要新的集合委托。这样做是为了确保与仍然委托给这些旧版委托的资产向后兼容。

您可以直接在 [Token Metadata 程序](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/programs/token-metadata/program/src/instruction/collection.rs)中了解更多关于它们的信息。
