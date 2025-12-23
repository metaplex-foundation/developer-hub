---
title: 概述
metaTitle: 概述 | Core
description: 提供由 Metaplex 创建的新 Solana NFT 资产标准 Core 的高级概述。
---

Metaplex Core（"Core"）摒弃了以往标准的复杂性和技术债务，为数字资产提供了一个简洁明了的核心规范。这个下一代 Solana NFT 标准使用单账户设计，与其他方案相比，降低了铸造成本并改善了 Solana 网络负载。它还具有灵活的插件系统，允许开发者修改资产的行为和功能。{% .lead %}

{% callout %}
请注意，某些 Core 指令将需要支付协议费用。请查看[协议费用](/protocol-fees)页面以获取最新信息。
{% /callout %}

来 [https://core.metaplex.com/](https://core.metaplex.com/) 试用 Core 的功能，亲自铸造一个资产吧！

{% quick-links %}

{% quick-link title="入门指南" icon="InboxArrowDown" href="/core/getting-started" description="选择您喜欢的语言或库，开始在 Solana 上使用数字资产。" /%}

{% quick-link title="API 参考" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="在寻找特定内容？查看我们的 API 参考文档找到答案。" /%}

{% quick-link title="与 MPL Token Metadata 的差异概述" icon="AcademicCap" href="/zh/smart-contracts/core/tm-differences" description="熟悉 Token Metadata 并想了解新功能或行为变化的概述？" /%}

{% quick-link title="在用户界面中亲自尝试！" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="使用易于使用的网站亲自试用 Core！" /%}

{% /quick-links %}

## 介绍

Metaplex Core 是 Metaplex 协议中的新 NFT 标准。与其他标准（包括 Metaplex Token Metadata 程序）相比，它具有以下优势：

- **前所未有的成本效率**：与现有的替代方案相比，Metaplex Core 提供了最低的铸造成本。例如，使用 Token Metadata 铸造一个 NFT 需要 .022 SOL，使用 Token Extensions 需要 .0046 SOL，而使用 Core 仅需 .0029 SOL。
- **低计算成本**：Core 操作具有较小的计算单元占用。这使得更多交易可以包含在一个区块中，而不是 Token Metadata 的 205000 CU，Core 铸造仅需 17000 CU。
- **单账户设计**：Core 不依赖于像 SPL Token 或 Token Extensions（又名 Token22）这样的同质化代币标准，而是专注于 NFT 标准的需求。这使得 Core 只需使用一个账户，该账户还跟踪所有者。
- **强制版税**：Core 默认允许[版税强制执行](/zh/smart-contracts/core/plugins/royalties)。
- **一流的集合支持**：资产可以组合成[集合](/zh/smart-contracts/core/collections)。虽然 Token Metadata 也可以实现这一点，但在 Core 中，集合是独立的资产类别，现在允许以下附加功能：
- **集合级操作**：Core 允许用户在集合级别对所有资产进行更改。例如，所有集合资产可以通过单个交易同时被冻结或更改其版税详情！
- **高级插件支持**：从内置质押到基于资产的积分系统，Metaplex Core 的插件架构开辟了广阔的实用性和定制化前景。插件允许开发者通过挂钩到任何资产生命周期事件（如创建、转移和销毁）来添加自定义行为。您可以向资产添加插件，例如委托权限或添加由 DAS 自动索引的链上属性：
- **开箱即用的索引**：许多[支持 DAS 的 RPC 提供商](/rpc-providers)已经支持 Core。

## 后续步骤

既然我们已经在高层次上介绍了 Metaplex Core 是什么，我们建议查看我们的[入门指南](/core/getting-started)页面，该页面列举了可以用来与 Core 资产交互的各种语言/框架。您可能还想查看[与 MPL Token Metadata 的差异](/zh/smart-contracts/core/tm-differences)页面。之后，可以使用各种功能页面来了解有关可以对 cNFT 执行的特定操作的更多信息。
