---
title: 概述
metaTitle: 概述 | Token Metadata
description: 提供 Solana NFT 标准的高层次概述。
---

Token Metadata 程序是在 Solana 区块链上处理 NFT 和同质化资产时的基础程序。在本概述中,我们将在高层次上解释该程序的功能以及如何利用其各种特性。 {% .lead %}

{% callout %}
请注意,某些 Token Metadata 指令将需要协议费用。请查看[协议费用](/zh/protocol-fees)页面以获取最新信息。
{% /callout %}

{% quick-links %}

{% quick-link title="入门指南" icon="InboxArrowDown" href="/zh/smart-contracts/token-metadata/getting-started" description="选择您喜欢的语言或库,开始在 Solana 上使用数字资产。" /%}

{% quick-link title="API 参考" icon="CodeBracketSquare" href="https://mpl-token-metadata.typedoc.metaplex.com/" target="_blank" description="正在寻找特定内容?查看我们的 API 参考文档并找到您的答案。" /%}

{% /quick-links %}

## 简介

Token Metadata 程序是在 Solana 区块链上处理 NFT 时最重要的程序之一。其主要目标是**为 Solana 上的[同质化](https://en.wikipedia.org/wiki/Fungibility)或非同质化[代币](https://spl.solana.com/token)附加额外数据**。

它使用从 Mint 账户地址_派生_的[程序派生地址](/zh/understanding-programs/#program-derived-addresses-pda)(PDA)来实现这一点。如果您不熟悉 [Solana 的 Token 程序](https://spl.solana.com/token),_Mint 账户_负责存储代币的全局信息,_Token 账户_存储钱包与 Mint 账户之间的关系。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="Someone's wallet." theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="token" theme="transparent" %}
Stores the number of \
tokens owned by the wallet, \
among other things.
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="mint" theme="transparent" %}
Stores information about the \
token itself. E.g. its current \
supply and its authorities.
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}

{% /diagram %}

虽然 Mint 账户包含一些数据属性(如当前供应量),但它不提供注入标准化数据的能力,而这些数据可以被应用程序和市场理解。

这就是为什么 Token Metadata 程序提供了一个**元数据账户**,通过 PDA 将自身附加到 Mint 账户上。

{% diagram height="h-64 md:h-[500px]" %}
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

{% node #metadata-pda parent="mint" x="41" y="-100" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-300" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataV1" /%}
{% node label="Update Authority" /%}
{% node label="Mint" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Creators" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Edition Nonce" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Uses" /%}
{% node label="Collection Details" /%}
{% node label="Programmable Configs" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" /%}

{% /diagram %}

元数据账户保存了许多可以在整个生态系统中使用的宝贵信息。例如,它维护了代币的创作者列表。每个创作者都有一个 `Verified` 属性,当为 `True` 时,保证该代币已由该创作者签名。每个创作者还有一个 `Share` 属性,市场可以使用它来分配版税。

通过向 Mint 账户附加更多数据,**Token Metadata 程序能够将常规链上代币转变为数字资产**。

## JSON 标准

元数据账户的一个重要属性是 `URI` 属性,它指向链外的 JSON 文件。这用于安全地提供额外数据,同时不受链上数据存储费用的限制。该 JSON 文件[遵循特定标准](/zh/smart-contracts/token-metadata/token-standard),任何人都可以使用它来查找代币的有用信息。

{% diagram height="h-64 md:h-[500px]" %}
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

{% node #metadata-pda parent="mint" x="41" y="-100" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-300" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataV1" /%}
{% node label="Update Authority" /%}
{% node label="Mint" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node #uri label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Creators" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Edition Nonce" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Uses" /%}
{% node label="Collection Details" /%}
{% node label="Programmable Configs" /%}
{% /node %}

{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
Off-chain \
JSON Metadata
{% /node %}
{% node label="Name" /%}
{% node label="Description" /%}
{% node label="Image" /%}
{% node label="Animated URL" /%}
{% node label="Attributes" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" /%}
{% edge from="uri" to="json" path="straight" /%}

{% /diagram %}

请注意,此 JSON 文件可以使用永久存储解决方案(如 Arweave)存储,以确保它无法被更新。此外,可以使用元数据账户的 `Is Mutable` 属性使其不可变,从而禁止 `URI` 属性以及其他属性(如 `Name` 和 `Creators`)被更改。使用这种组合,我们可以保证链外 JSON 文件的不可变性。

## NFT

您可能会想:这与 NFT 有什么关系?好吧,NFT 是非同质化的特殊代币。

更准确地说,Solana 中的 NFT 是具有以下特征的 Mint 账户:

- 它的**供应量为 1**,意味着只有一个代币在流通。
- 它有**零小数位**,意味着不可能有 0.5 个代币这样的东西。
- 它**没有铸造权限**,意味着没有人可以铸造额外的代币。

我们最终得到的是一个无法与同类物品交易的代币,这就是非同质化代币(NFT)的定义。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = None" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% /diagram %}

在这种特殊但流行的情况下,元数据账户的目标是提供该 NFT 的实际数据,使其成为有用的数字资产。

此外,Token Metadata 程序为 NFT 提供了另一个专门的账户,称为**主版本账户**。该账户也是从 Mint 账户派生的 PDA。

在创建此账户之前,Token Metadata 程序将确保满足上面列出的非同质化代币的特殊特征。但是,值得注意的是,它不会使铸造权限失效,而是将铸造权限和冻结权限都转移到主版本 PDA,以确保没有人可以在不通过 Token Metadata 程序的情况下铸造或冻结代币。您可以[在常见问题解答中阅读有关为何做出此决定的更多信息](/zh/smart-contracts/token-metadata/faq#why-are-the-mint-and-freeze-authorities-transferred-to-the-edition-pda)。

因此,**主版本账户的存在充当了该 Mint 账户的非同质化证明**。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-240" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" animated=true /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" animated=true /%}
{% /diagram %}

## 打印版本

除了作为非同质化的证明,主版本账户还允许用户打印 NFT 的一个或多个副本。

这个功能对于想要向观众提供其 1/1 NFT 多个副本的创作者特别有用。

主版本账户包含一个可选的 `Max Supply` 属性,它规定了可以这样打印的 NFT 的最大数量。如果设置为 `0`,则禁用打印。如果设置为 `None`,则可以打印无限数量的副本。

主版本 NFT(又称原始 NFT)充当主记录,可用于打印副本(又称打印 NFT)。

每个打印 NFT 都由自己的 Mint 账户和自己的元数据账户组成,其数据从原始 NFT 复制而来。但是,打印 NFT 不是将主版本账户附加到其 Mint 账户,而是使用另一个名为**版本账户**的 PDA 账户。该账户跟踪版本编号及其来源的父主版本。

请注意,主版本账户和版本账户为其 PDA 共享相同的种子。这意味着 NFT 可以是其中之一,但不能同时是两者。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-280" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-160" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% /node %}

{% node parent="master-edition" y="-140" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = EditionV1" /%}
{% node #edition-parent label="Parent" /%}
{% node label="Edition" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" fromPosition="left" label="OR" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="edition-parent" to="master-edition" dashed=true arrow="none" fromPosition="left" toPosition="left" /%}
{% /diagram %}

## 半同质化代币

虽然 NFT 是 Token Metadata 程序的最大用例,但重要的是要注意,该程序也适用于同质化代币以及我们所说的半同质化代币或同质化资产。

归根结底,元数据账户有助于将数据附加到代币,无论其同质化程度如何。但是,链外 JSON 文件的标准会略有不同以适应其需求。

为了安全地识别代币的同质化程度(因此我们应该使用的标准),元数据账户在其 `Token Standard` 属性中跟踪该信息。此属性由程序自动计算,无法手动更新。它可以采用以下值。

- `NonFungible`:Mint 账户与主版本账户关联,因此是非同质化的。这是您典型的 NFT 标准。
- `NonFungibleEdition`:这与 `NonFungible` 相同,但 NFT 是从原始 NFT 打印的,因此与版本账户而不是主版本账户关联。
- `FungibleAsset`:Mint 账户是同质化的,但小数位为零。小数位为零意味着我们可以将代币视为供应量不限于一个的资产。例如,同质化资产可以在游戏行业中用于存储资源,如"木材"或"铁"。
- `Fungible`:Mint 账户是同质化的,并且有多个小数位。这更有可能是用作去中心化货币的代币。
- `ProgrammableNonFungible`:一种特殊的 `NonFungible` 代币,始终处于冻结状态以强制执行自定义授权规则。有关更多信息,请参阅下一节。

您可以[在此处阅读有关这些标准的更多信息](/zh/smart-contracts/token-metadata/token-standard)。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node label="Freeze Authority = Edition" /%}
{% /node %}
{% node parent="mint-1" y="-20" x="-10" label="NonFungible" theme="transparent" /%}

{% node parent="mint-1" x="220" #metadata-1-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-1-pda" x="140" %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = NonFungible" /%}
{% /node %}

{% node parent="mint-1" x="220" y="100" #master-edition-pda label="PDA" theme="crimson" /%}
{% node parent="master-edition-pda" x="140" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}
{% node parent="master-edition" y="80" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="mint-1" y="260" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals = 0" /%}
{% /node %}
{% node parent="mint-2" y="-20" x="-10" label="FungibleAsset" theme="transparent" /%}

{% node parent="mint-2" x="220" #metadata-2-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-2-pda" x="140" %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = FungibleAsset" /%}
{% /node %}

{% node parent="mint-2" y="120" %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals > 0" /%}
{% /node %}
{% node parent="mint-3" y="-20" x="-10" label="Fungible" theme="transparent" /%}

{% node parent="mint-3" x="220" #metadata-3-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-3-pda" x="140" %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = Fungible" /%}
{% /node %}

{% edge from="mint-1" to="metadata-1-pda" path="straight" /%}
{% edge from="metadata-1-pda" to="metadata-1" path="straight" /%}
{% edge from="mint-1" to="master-edition-pda" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" label="OR" /%}

{% edge from="mint-2" to="metadata-2-pda" path="straight" /%}
{% edge from="metadata-2-pda" to="metadata-2" path="straight" /%}
{% edge from="mint-3" to="metadata-3-pda" path="straight" /%}
{% edge from="metadata-3-pda" to="metadata-3" path="straight" /%}
{% /diagram %}

## 可编程 NFT {% #pnfts %}

由于 Token Metadata 程序建立在 Solana Token 程序之上,任何人都可以在不通过 Token Metadata 程序的情况下转移代币(同质化或非同质化)。虽然这对于程序组合性很好,但这也意味着 Token Metadata 程序无法对其附加的代币强制执行任何规则。

一个很好的例子说明了为什么这可能有问题,那就是 Token Metadata 无法强制执行二次销售版税。虽然元数据账户上有**卖方费用基点**属性,但它纯粹是[指示性的](/zh/understanding-programs#indicative-fields),任何人都可以创建一个不尊重版税的市场——这正是发生的事情。

**可编程 NFT** 的引入是为了解决这个问题。它们是一种新的_可选_代币标准,**始终保持底层代币账户冻结**。这样,没有人可以在不通过 Token Metadata 程序的情况下转移、锁定或销毁可编程 NFT。

然后由创作者定义自定义的特定于操作的授权规则,这些规则将由 Token Metadata 程序强制执行。这些在特殊的 **RuleSet** 账户中定义,该账户附加到元数据账户。这样的 RuleSet 的一个例子可以是尊重版税的程序地址的允许列表。RuleSet 是名为 [Token Auth Rules](/zh/smart-contracts/token-auth-rules) 的新 Metaplex 程序的一部分。

您可以[在此处阅读有关可编程 NFT 的更多信息](/zh/smart-contracts/token-metadata/pnfts)。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="State = Frozen" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-120" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-230" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #programmable-configs label="Programmable Configs" /%}
{% /node %}

{% node parent="metadata" x="-260" y="0" %}
{% node #ruleset label="RuleSet Account" theme="crimson" /%}
{% node label="Owner: Token Auth Rules Program" theme="dimmed" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="programmable-configs" to="ruleset" arrow="none" dashed=true /%}
{% /diagram %}

## 以及更多

虽然这提供了 Token Metadata 程序及其所提供功能的良好概述,但仍有更多可以使用它完成的事情。

本文档的其他页面旨在进一步记录它,并在各自的页面中解释重要功能。

- [代币标准(资产)](/zh/smart-contracts/token-metadata/token-standard)
- [铸造资产](/zh/smart-contracts/token-metadata/mint)
- [更新资产](/zh/smart-contracts/token-metadata/update)
- [转移资产](/zh/smart-contracts/token-metadata/transfer)
- [销毁资产](/zh/smart-contracts/token-metadata/burn)
- [打印版本](/zh/smart-contracts/token-metadata/print)
- [已验证的集合](/zh/smart-contracts/token-metadata/collections)
- [已验证的创作者](/zh/smart-contracts/token-metadata/creators)
- [委托权限](/zh/smart-contracts/token-metadata/delegates)
- [锁定资产](/zh/smart-contracts/token-metadata/lock)
- [可编程 NFT](/zh/smart-contracts/token-metadata/pnfts)
- [NFT 托管](/zh/smart-contracts/token-metadata/escrow)
