---
title: MPL-3643 — 面向 RWA 的许可型代币标准
metaTitle: MPL-3643 — Solana 上面向 RWA 的许可型代币标准 | Metaplex
description: MPL-3643 是 Solana 上与 ERC-3643 对应的标准，通过 mpl-permission 链上程序套件实现。它基于 Token-2022、Token ACL（sRFC 37）和 Solana Attestation Service 构建，支持许可型代币的发行、管理和转移。
created: '08-22-2026'
updated: '09-28-2026'
keywords:
  - MPL-3643
  - mpl-permission
  - tokenized securities
  - real world assets
  - RWA Solana
  - ERC-3643 Solana
  - T-REX Solana
  - compliance standard
  - permissioned token
  - Token-2022
  - Token ACL
  - sRFC 37
  - Solana Attestation Service
  - identity registry
  - KYC on-chain
  - security token
about:
  - Tokenized securities
  - On-chain compliance
  - MPL-3643
proficiencyLevel: Intermediate
faqs:
  - q: 什么是 MPL-3643？
    a: MPL-3643 是 Solana 上面向许可型代币的链上标准，专为代币化证券等 RWA 打造 — 是与 ERC-3643 对应的框架，通过 mpl-permission 程序套件实现。它由四个 Metaplex 程序（Identity Registry、Compliance Module、Gate、Lifecycle Manager）组成，构建在 Token-2022、Token ACL（sRFC 37）和 Solana Attestation Service 之上。
  - q: MPL-3643 是新的代币程序吗？
    a: 不是。MPL-3643 代币是标准的 Token-2022 铸币，合规是代币之上的一个层，而不是对代币的替代。钱包、浏览器和 DEX 通过其现有的 Token-2022 支持进行集成；支持程度取决于各平台对铸币所用扩展（如 transfer hook）的处理方式，以及其自身对许可型资产的政策。
  - q: MPL-3643 与 ERC-3643 有什么关系？
    a: MPL-3643 是 ERC-3643 在 Solana 上的对应标准，保持了身份、合规、代币分层的相同架构，同时用 Solana 原语构建每一层。Token-2022 提供代币，Token ACL 和 Gate Program 承担 ERC-3643 合规回调的角色，与钱包绑定的 Claim 账户则扮演 ONCHAINID 在以太坊上的角色。Claim 可以由 Solana Attestation Service 认证背书，也可以由受信任的证明者直接附加。
  - q: 用户需要为每个代币单独完成 KYC 吗？
    a: 每次发行都会自行做出准入决定。当发行方需要访问底层 KYC 数据时，MPL-3643 的设计是与可复用 KYC 提供商配合使用，在投资者同意的情况下，将已有的验证结果共享给新发行方。对于不需要访问底层数据的发行，还有更简单的路径，即依赖共享的链上认证，这意味着信任执行验证的认证提供商。
  - q: 每笔 MPL-3643 转账都有额外的计算成本吗？
    a: 仅当发行方选择启用逐笔转账执行时才有。仅边界（boundary-only）代币在解冻时和通过无许可重新冻结来执行合规，因此解冻后的转账是没有额外开销的普通 Token-2022 转账。
  - q: 发行方可以没收或追回代币吗？
    a: 仅当铸币选择启用恢复功能时才可以。启用恢复的铸币会将 Token-2022 的 permanent delegate 设置为一个 Lifecycle Manager PDA，该 PDA 只能通过带护栏的指令签名，这些指令要求提案者与批准者角色分离、时间锁、有限的执行窗口以及每次请求指定的目标和数量。
  - q: MPL-3643 在主网上可用吗？
    a: 可用。MPL-3643 已在 Solana 主网上以抢先体验方式运行。请前往 https://form.typeform.com/to/AgllGJaz 申请 alpha 访问权限。
---

**MPL-3643** 是一套链上程序，支持在 Solana 上发行、管理和转移**许可型代币**。它是 Solana 上与 [ERC-3643](https://www.erc3643.org/) 对应的标准，通过 **mpl-permission** 程序实现。它确保只有满足预定义条件的用户才能成为代币持有者，因此非常适合代表现实世界价值的数字资产，如证券、房地产和私募基金。合规是标准 **Token-2022** 代币之上的一个层，而不是一种新的代币类型。 {% .lead %}

MPL-3643 已在 Solana 主网上以抢先体验方式运行 — [申请 alpha 访问权限](https://form.typeform.com/to/AgllGJaz)开始构建。

{% callout type="warning" title="审计状态" %}
MPL-3643 尚未经过审计。未与 Metaplex 协调前，请勿托管真实资产。
{% /callout %}

## 摘要

MPL-3643 由四个 Metaplex 程序组成，构建在 Token-2022、Token ACL（sRFC 37）和 Solana Attestation Service 之上，使发行方能够发行由链上程序（而非发行方各自的定制代码）执行资格规则的许可型代币。

- **标准与实现** — MPL-3643 是标准的名称，**mpl-permission** 是代码的名称。代码仓库、npm 包和 Rust crate 均使用 `mpl-permission` 前缀。
- **标准代币 + 分层合规** — MPL-3643 代币是 Token-2022 铸币而非定制代币程序，因此钱包、浏览器和 DEX 通过其现有的 Token-2022 支持进行集成。支持程度取决于各平台对铸币所用扩展（如 transfer hook）的处理方式，以及其自身对许可型资产的政策。
- **四个程序** — Identity Registry、Compliance Module、Gate 和 Lifecycle Manager，每个都可独立审计。
- **可复用的验证** — 该标准的设计是与可复用 KYC 提供商配合使用：在投资者同意的情况下，已有的验证结果在链下共享给新发行方，投资者无需重复提交文件，而每个发行方仍保留自己的数据保管、监管责任和链上声明。
- **抢先体验** — 已在主网运行；[申请 alpha 访问权限](https://form.typeform.com/to/AgllGJaz)开始构建。参见[状态与可用性](#状态与可用性)。

## MPL-3643 的适用对象

MPL-3643 服务于四类用户，每类都有不同的切入点。请从[快速入门](/zh/smart-contracts/mpl-3643/getting-started)开始。

| 用户 | 他们做什么 |
|---|---|
| **RWA 发行方** | 发行并管理许可型代币 — 司法辖区、锁仓等前置条件 |
| **集成开发者** | 构建可转移 MPL-3643 代币的钱包、交易场所或应用 |
| **KYC 提供商** | 签发使投资者获得资格的认证 |
| **钱包与交易场所集成方** | 向用户展示冻结账户、解冻流程和拒绝原因 |

## MPL-3643 解决的问题

Token-2022、Token ACL 和 Solana Attestation Service 已经提供了许可型代币所需的原语，但没有任何东西将它们组装成一个合规优先的系统。如今在 Solana 上发行受监管代币的每个发行方都在从零开始编写这套组装逻辑。

MPL-3643 补上了缺失的部分：

- 一个通过检查身份和合规状态来实现 sRFC 37 门控接口的 **Gate 程序**。
- 一个将认证映射到每个代币要求的**注册表** — 例如"此代币需要来自受信任提供商的 KYC 加合格投资者认定"。
- 一个**可配置的规则引擎** — 持有者数量上限、司法辖区列表、锁仓、交易量限制 — 无需发行方编写定制代码即可在链上执行。
- **生命周期基础设施** — 归属（vesting）、公司行为、带护栏的恢复 — 与合规状态联动。

## MPL-3643 架构

MPL-3643 是分层构建在三个现有 Solana 组件之上的四个 Metaplex 程序。身份、合规规则和冻结权限是不同程序中的不同关注点，因此每一项都可以独立审计和升级。

{% diagram height="h-[620px]" %}

{% node %}
{% node #sdk label="mpl-permission TypeScript SDK" theme="blue" /%}
{% node label="代币配置模板，一次调用完成代币发行" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="-320" %}
{% node #identity label="Identity Registry" theme="blue" /%}
{% node label="Claim, TrustedAttestor, TokenTrustScope" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="0" %}
{% node #compliance label="Compliance Module" theme="blue" /%}
{% node label="边界规则与逐笔转账规则模块" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="320" %}
{% node #lifecycle label="Lifecycle Manager" theme="blue" /%}
{% node label="收益、归属、公司行为、恢复" theme="dimmed" /%}
{% /node %}

{% node parent="compliance" y="150" x="-160" %}
{% node #gate label="Gate Program" theme="crimson" /%}
{% node label="实现 sRFC 37 门控接口" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="-180" %}
{% node #tokenacl label="Token ACL (sRFC 37)" theme="slate" /%}
{% node label="持有铸币的冻结权限" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="200" %}
{% node #sas label="Solana Attestation Service" theme="slate" /%}
{% node label="实时 KYC 认证" theme="dimmed" /%}
{% /node %}

{% node parent="tokenacl" y="140" x="140" %}
{% node #t22 label="Token-2022 Mint" theme="slate" /%}
{% node label="DefaultAccountState = Frozen" theme="dimmed" /%}
{% /node %}

{% edge from="sdk" to="identity" /%}
{% edge from="sdk" to="compliance" /%}
{% edge from="sdk" to="lifecycle" /%}
{% edge from="gate" to="identity" label="身份检查" /%}
{% edge from="gate" to="compliance" label="资格／重新冻结检查" /%}
{% edge from="tokenacl" to="gate" label="CPI" /%}
{% edge from="identity" to="sas" label="读取实时认证" /%}
{% edge from="tokenacl" to="t22" label="冻结／解冻" /%}

{% /diagram %}

**图示说明：** mpl-permission TypeScript SDK 位于三个程序之上 — Identity Registry、Compliance Module 和 Lifecycle Manager。Gate Program 位于 Compliance Module 之下，同时调用 Identity Registry（身份验证）和 Compliance Module（持有资格与重新冻结检查）。Token ACL 持有铸币的冻结权限，并通过跨程序调用 Gate Program 来决定每一次冻结和解冻；Identity Registry 从 Solana Attestation Service 读取实时认证。Token ACL 是唯一对铸币调用 Token-2022 冻结和解冻指令的组件，而铸币的账户通过 `DefaultAccountState` 在创建时即被冻结。

### 程序职责

每个 MPL-3643 程序恰好负责一个关注点。

| 程序 | 负责内容 |
|---|---|
| **Identity Registry** | 声明、受信任的证明者、每个代币的信任范围 |
| **Compliance Module** | 发行规则 — 持有者数量上限、国家、锁仓、交易量、暂停时段 |
| **Gate Program** | 将身份 + 合规组合为 sRFC 37 的两个入口点 |
| **Lifecycle Manager** | 收益、归属、公司行为、带护栏的恢复 |

### 合规模块

发行方从合规模块菜单中组合出每个代币的策略，独立启用和配置每个模块。MPL-3643 正在积极开发中，模块集合在正式发布前可能变化。

| 模块 | 执行的规则 |
|---|---|
| **Country** | 按居住地声明中的国家对持有者进行允许或拒绝列表管理 |
| **Holder cap** | 限制持有者总数 |
| **Investor cap** | 限制独立投资者数量，将关联钱包计为同一投资者 |
| **Lockup** | 对新获得的代币进行时间锁定，之后才能转移 |
| **Affiliate volume** | 限制指定持有者的转账量 |
| **Blackout** | 在预定时段内暂停转账 |
| **Jurisdiction pair** | 限制特定国家对之间的转账 |
| **Venue** | 将交易限制在经批准的交易场所 |

### 声明主题

身份声明按**主题**组织 — 主题是受信任的证明者可以就某个钱包断言的事实词汇表。目前定义的主题包括 KYC、AML、居住地、合格投资者认定和制裁筛查，以及特定模块内部使用的分类主题。每个代币的信任策略指定其要求的主题，每个受信任的证明者按主题获得授权。主题空间可扩展：新增一个通过/不通过形式的资格标签只是配置变更，而不是程序变更。与模块集合一样，目前定义的主题在正式发布前可能会进一步完善。

### Metaplex 与发行方的角色

Metaplex 提供基础设施，发行方为自己的代币设定策略。

- **Metaplex 提供链上基础设施。** Metaplex 部署并维护驱动 MPL-3643 的四个程序，并管理全局受信任证明者列表。MPL-3643 执行发行方为用户持有其代币所设定的前置条件。
- **发行方是策略运营者。** 每个发行方创建自己的 `ComplianceConfig`，选择启用哪些模块，配置模块参数，通过每个代币的信任范围选择接受哪些 KYC 提供商，并控制所有者密钥。发行方对代币本身及其合规状况负责。

{% callout type="note" title="MPL-3643 执行配置，但不保证合规" %}
这些页面描述的是程序执行的内容。特定配置是否满足适用法规，是发行方及其法律顾问需要判断的问题。
{% /callout %}

## ERC-3643 到 MPL-3643 的组件映射

MPL-3643 保持 ERC-3643 的关注点分离，并用 Solana 原语替代每个以太坊合约。

| ERC-3643 组件 | MPL-3643 对应物 |
|---|---|
| 代币合约（ERC-20） | 接入 Token ACL（sRFC 37）的 Token-2022 铸币 |
| Identity Registry | Identity Registry 程序 |
| Identity Registry Storage | Identity Registry 中与钱包绑定的 `Claim` 账户 |
| ONCHAINID | 与钱包绑定的 `Claim` 账户，由 Solana Attestation Service 认证背书或由受信任的证明者直接附加 |
| Trusted Issuers Registry | Identity Registry 中的 `TrustedAttestor` 账户 |
| Claim Topics Registry | 代币信任范围的必需主题，按代币设置 |
| Compliance Module | Compliance Module 程序加 sRFC 37 Gate Program |
| Agent 角色 | 通过每个程序的 `RoleGrant` PDA 实现的 `owner` / `operator` / `agent` 角色 |

唯一的结构性差异：ERC-3643 在代币的 `transfer()` 内部检查合规。Solana 的普通转账没有等效的钩子，因此 MPL-3643 在**冻结和解冻**时执行资格检查 — 账户创建即冻结，只有合规的钱包才能解冻。某些合规模块 — 必须在每笔转账时评估的规则，如锁仓或交易量限制 — 需要逐笔转账检查，这些通过 Token-2022 transfer hook 执行。

## 与普通 Token-2022 铸币的区别

MPL-3643 改变的是谁可以持有代币，而不是代币本身的转移方式。

| | 普通 Token-2022 铸币 | MPL-3643 代币 |
|---|---|---|
| 代币账户初始状态 | 已解冻 | 已冻结（`DefaultAccountState = Frozen`） |
| 冻结权限 | 发行方密钥 | Token ACL `MintConfig` PDA |
| 铸造权限 | 发行方密钥 | 合规初始化后为 `ComplianceConfig` PDA |
| 谁可以解冻 | 冻结权限持有者 | 任何人，无许可 — 由 Gate Program 决定 |
| 谁可以持有 | 任何人 | 通过身份和持有资格检查的钱包 |
| 每笔转账成本 | 无 | 仅边界代币无成本；选择启用后为 transfer hook |

## 协议费用

MPL-3643 在资产配置、持有者账户激活和分配执行时收取以 SOL 支付的固定协议费用。没有任何费用按转移价值、募集资本或管理资产的百分比计算。

{% protocol-fees program="mpl-3643" showTitle=false /%}

有关所有 Metaplex 协议费用的最新信息，请参见[协议费用](/zh/protocol-fees)页面。

## 快速参考

### 程序

| 程序 | 程序名称 | 用途 |
|---|---|---|
| Identity Registry | `mpl-permission-identity-registry` | 声明、受信任的证明者、信任范围 |
| Compliance Module | `mpl-permission-compliance` | 边界规则与逐笔转账规则执行 |
| Gate Program | `mpl-permission-gate` | 用于解冻和冻结决策的 sRFC 37 门控 |
| Lifecycle Manager | `mpl-permission-lifecycle` | 收益、归属、公司行为、恢复 |

### SDK

MPL-3643 提供统一的 TypeScript SDK（`@metaplex-foundation/mpl-permission`）和 Rust SDK（`mpl-permission`），各自由为四个程序生成的低层客户端支撑。SDK 是主要接口，会自动处理发行引导的顺序。SDK 通过 [alpha 入驻流程](https://form.typeform.com/to/AgllGJaz)提供。

### 外部依赖

| 依赖 | 在 MPL-3643 中的角色 | 状态 |
|---|---|---|
| [Token-2022](https://spl.solana.com/token-2022) | 铸币和代币账户 | 已在主网运行 |
| [Token ACL (sRFC 37)](https://solana.com/developers/guides/advanced/acl) | 持有铸币的冻结权限；调用 Gate Program | 已在主网和开发网运行；源代码已审计 |
| [Solana Attestation Service](https://attest.solana.com/) | 实时 KYC 和合格投资者认证 | 已在主网运行 |

## 状态与可用性

MPL-3643 已在主网上以抢先体验方式运行，处于审计前阶段。

- **主网抢先体验。** 四个程序已部署在主网上，并与 alpha 合作伙伴共同运营（[申请 alpha 访问权限](https://form.typeform.com/to/AgllGJaz)）。
- **审计。** MPL-3643 将接受安全审计。有关 Metaplex 如何审计程序以及如何报告漏洞，请参见[安全](/zh/security)。
- **Token ACL 依赖。** Token ACL（sRFC 37）已上线，其源代码已经过审计。MPL-3643 会在发布尽职调查中验证其绑定的 Token ACL 部署。
- **稳定性级别。** MPL-3643 在[稳定性指数](/zh/stability-index)中列为 Experimental。

## 注意事项

- MPL-3643 代币是 **Token-2022** 铸币，不是传统 SPL Token 铸币。集成必须使用 Token-2022 程序 ID。
- 仅边界代币没有 transfer hook，因此解冻后的转账不产生 MPL-3643 计算成本。逐笔转账模块需要选择启用 Compliance Module 的 Token-2022 transfer hook，且无法在现有铸币上追加。
- 链上执行会使一小组固定的事实可被公开读取，其中不含任何直接标识信息：受司法辖区规则约束的钱包持有记录其 ISO-3166 国家代码的居住地声明 — 这是自主执行这些规则的代价，也是 ERC-3643 的 ONCHAINID 所做的相同选择；声明会公开其主题、证明者和有效期；选择启用投资者数量上限的代币会关联同一投资者控制的多个钱包。姓名、文件和详细的 KYC 结果保留在链下，但这些与钱包绑定的记录本身是公开的，与任何公链数据一样，对于能够将钱包与其所有者关联起来的观察者而言，它们可能构成个人数据。
- 合规初始化会不可逆地将铸币的 `MintTokens` 权限转移给 `ComplianceConfig` PDA。所有需要原始铸造权限的指令都必须在此之前执行。
- 由 Metaplex Foundation 维护。最后核实于 2026-09-28。

## FAQ

### 什么是 MPL-3643？

MPL-3643 是 Solana 上面向许可型代币的链上标准，专为代币化证券等 RWA 打造 — 是与 ERC-3643 对应的框架，通过 **mpl-permission** 程序套件实现。它由四个 Metaplex 程序 — Identity Registry、Compliance Module、Gate 和 Lifecycle Manager — 组成，构建在 Token-2022、Token ACL（sRFC 37）和 Solana Attestation Service 之上。开发者产物 — 代码仓库、npm 包和 Rust crate — 均使用 `mpl-permission` 前缀。

### MPL-3643 是新的代币程序吗？

不是。MPL-3643 代币是标准的 Token-2022 铸币，合规是代币之上的一个层，而不是对代币的替代。钱包、浏览器和 DEX 通过其现有的 Token-2022 支持进行集成；支持程度取决于各平台对铸币所用扩展（如 transfer hook）的处理方式，以及其自身对许可型资产的政策。

### MPL-3643 与 ERC-3643 有什么关系？

MPL-3643 是 ERC-3643 在 Solana 上的对应标准，保持了身份、合规、代币分层的相同架构，同时用 Solana 原语构建每一层。Token-2022 提供代币，Token ACL 和 Gate Program 承担 ERC-3643 合规回调的角色，与钱包绑定的 `Claim` 账户则扮演 ONCHAINID 在以太坊上的角色。Claim 可以由 Solana Attestation Service 认证背书，也可以由受信任的证明者直接附加。参见[组件映射](#erc-3643-到-mpl-3643-的组件映射)。

### 用户需要为每个代币单独完成 KYC 吗？

每次发行都会自行做出准入决定。当发行方需要访问底层 KYC 数据时，MPL-3643 的设计是与可复用 KYC 提供商配合使用：在投资者同意的情况下，原始验证结果在链下共享给新发行方，投资者无需重新上传文件，而每个发行方仍保留自己的数据保管和监管责任。对于不需要访问底层数据的发行，还有更简单的路径，即依赖共享的链上认证，这意味着信任执行验证的认证提供商。无论哪条路径，姓名、文件和详细的 KYC 结果都保留在链下：共享的链上认证只记录验证通过的结果，而 MPL-3643 记录的是钱包、声明主题、证明者和有效期等执行元数据。不过，由于这些元数据与钱包绑定且公开，对于能够将钱包与其所有者关联起来的人而言，它们仍可能构成个人数据。

### 每笔 MPL-3643 转账都有额外的计算成本吗？

仅当发行方选择启用逐笔转账执行时才有。仅边界代币在解冻时执行合规，并通过无许可重新冻结持续执行，因此解冻后的转账是普通的 Token-2022 转账。启用 Compliance Module transfer hook 的代币则在每笔转账时支付合规评估成本。

### 发行方可以没收或追回代币吗？

仅当铸币选择启用恢复功能时才可以。启用恢复的铸币会将 Token-2022 的 permanent delegate 设置为一个没有私钥的 Lifecycle Manager 程序地址，该地址只能通过带护栏的恢复指令签名 — 提案者与批准者角色分离、时间锁、有限的执行窗口、链上审计记录，以及每次请求指定的目标账户和数量。没有设置 permanent delegate 的铸币完全无法被追回。

### MPL-3643 在主网上可用吗？

可用。MPL-3643 已在 Solana 主网上以抢先体验方式运行。[申请 alpha 访问权限](https://form.typeform.com/to/AgllGJaz)开始使用。

## 术语表

| 术语 | 定义 |
|---|---|
| **Attestation（认证）** | KYC 提供商通过 Solana Attestation Service 签发的带签名链上凭证。 |
| **Boundary module（边界模块）** | 在钱包进入或退出资格状态时（解冻、重新冻结、铸造、销毁）评估的合规规则，而不是在每笔转账时评估。 |
| **Claim（声明）** | 与钱包绑定的 Identity Registry 账户，记录某个钱包从特定受信任的证明者处持有特定声明主题。 |
| **Claim topic（声明主题）** | 表示声明种类的数字标识符，如 KYC、合格投资者认定或持有者角色。 |
| **Cranker** | 无许可的调用者，负责重新冻结已不合规的账户，或推进收益指数。 |
| **Gate Program（门控程序）** | 实现 sRFC 37 门控接口并响应每一次解冻和冻结决策的 MPL-3643 程序。 |
| **Per-transfer module（逐笔转账模块）** | 在每笔转账时于 Token-2022 transfer hook 内部评估的合规规则。 |
| **Re-freeze（重新冻结）** | 对先前已解冻但已不再合规的账户进行无许可冻结。 |
| **sRFC 37** | 定义 Token ACL 以及用于无许可冻结和解冻的门控程序接口的 Solana 标准。 |
| **Token ACL** | 持有铸币冻结权限、并在冻结或解冻前咨询门控程序的已上线 Solana 程序。 |
| **Transfer envelope（转账信封）** | 集成方转移 MPL-3643 代币时必须遵循的准备、转账、结算序列。 |
| **Trust scope（信任范围）** | 每个代币各自的账户，指定该代币接受哪些受信任的证明者以及要求哪些声明主题。 |
| **Trusted attestor（受信任的证明者）** | 用其密钥在链上附加声明的一方 — 通常是代币发行方 — 在 Identity Registry 中全局注册，并按特定声明主题获得授权。与执行验证的链下 KYC 提供商相区别。 |
