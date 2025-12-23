---
title: 使用 Oracle 外部插件创建美国市场交易体验
metaTitle: 使用 Oracle 外部插件创建美国市场交易体验 | Core 指南
description: 本指南展示如何限制您的 Core Collection 在美国市场开放时间内进行交易和销售。
---

本开发者指南利用新的 Oracle 插件来**创建一个只能在美国市场开放时间内交易的 NFT 集合**。

## 简介

### 外部插件

**外部插件**是一种由*外部*来源控制行为的插件。Core 程序将为这些插件提供适配器，但开发者通过将此适配器指向外部数据源来决定行为。

每个外部适配器都能够将生命周期检查分配给生命周期事件，影响正在发生的生命周期事件的行为。这意味着我们可以将以下检查分配给创建、转移、更新和销毁等生命周期事件：
- **Listen**：一个"web3"webhook，在生命周期事件发生时提醒插件。这对于跟踪数据或执行操作特别有用。
- **Reject**：插件可以拒绝生命周期事件。
- **Approve**：插件可以批准生命周期事件。

如果您想了解更多关于外部插件的信息，请在[这里](/zh/smart-contracts/core/external-plugins/overview)阅读更多内容。

### Oracle 插件

**Oracle 插件**利用外部插件的能力来保存外部权限可以更新的数据，通过访问 Core 资产外部的**链上数据**账户，允许资产动态拒绝由资产权限设置的生命周期事件。外部 Oracle 账户也可以随时更新以更改生命周期事件的授权行为，提供灵活和动态的体验。

如果您想了解更多关于 Oracle 插件的信息，请在[这里](/zh/smart-contracts/core/external-plugins/oracle)阅读更多内容。

## 起步：理解想法背后的协议

要创建一个只能在美国市场开放时间内交易的 NFT 集合，我们需要一种可靠的方法来根据一天中的时间更新链上数据。以下是协议设计的样子：

### 程序概述

该程序将有两个主要指令（一个用于创建 Oracle，另一个用于更新其值）和两个辅助函数来简化实现。

**主要指令**
- **初始化 Oracle 指令**：此指令创建 oracle 账户，因此任何想要为其集合使用此时间门控功能的用户都可以将 NFT Oracle 插件重定向到此链上账户地址。
- **Crank Oracle 指令**：此指令更新 oracle 状态数据，以确保它始终具有正确和最新的数据。

**辅助函数**
- **isUsMarketOpen**：检查美国市场是否开放。
- **isWithin15mOfMarketOpenOrClose**：检查当前时间是否在市场开盘或收盘的 15 分钟内。

**注意**：`crank_oracle_instruction` 确保协议使用准确的数据进行更新，为维护最新信息的人提供激励。但我们将在下一节中讨论这个。

### 激励机制

使用此 oracle 作为信任来源的每个集合都应该运行自己的 crank 以确保 oracle 始终是最新的。然而，为了增强弹性，协议开发者应该考虑创建激励机制让多人来 crank 协议，确保在内部 crank 无法更新数据时有一个安全网来保持 oracle 数据的准确性。

当前的程序设计用 0.001 SOL 奖励 crankers 维护 oracle。这个金额是可管理的，同时仍然为 crankers 提供足够的激励来保持 oracle 状态账户的最新状态。

**注意**：这些激励仅在市场开盘或收盘后的前 15 分钟内执行 crank 时支付，资金来自智能合约中的金库。金库需要通过向 oracle 金库地址发送 SOL 来补充。

## 让我们开始：构建程序

现在我们协议背后的逻辑已经清晰，是时候深入代码并将一切整合在一起了！

### Anchor 概述

在本指南中，我们将使用 Anchor 框架，但您也可以使用原生程序来实现。在[这里](https://www.anchor-lang.com/)了解更多关于 Anchor 框架的信息。

为了简单起见，我们将使用单文件方法，将 helpers、state、accounts 和 instructions 都放在 lib.rs 中，而不是通常的分离方式。

*注意：您可以跟随并在 Metaplex Foundation Github 上打开示例：[Oracle Trading Example](https://github.com/metaplex-foundation/mpl-core-oracle-trading-example)*

### 辅助函数和常量

与其重复声明一些输入，不如创建我们可以在指令/函数中轻松引用的常量。

**以下是此 oracle 协议中使用的常量：**
```rust
// 常量
const SECONDS_IN_AN_HOUR: i64 = 3600;
const SECONDS_IN_A_MINUTE: i64 = 60;
const SECONDS_IN_A_DAY: i64 = 86400;

const MARKET_OPEN_TIME: i64 = 14 * SECONDS_IN_AN_HOUR + 30 * SECONDS_IN_A_MINUTE; // 14:30 UTC == 9:30 EST
const MARKET_CLOSE_TIME: i64 = 21 * SECONDS_IN_AN_HOUR; // 21:00 UTC == 16:00 EST
const MARKET_OPEN_CLOSE_MARGIN: i64 = 15 * SECONDS_IN_A_MINUTE; // 15 分钟（秒）
const REWARD_IN_LAMPORTS: u64 = 10000000; // 0.001 SOL
```

创建辅助函数来检查智能合约的一些逻辑是有意义的，例如检查美国市场是否开放以及是否在开盘或收盘的 15 分钟内。

**is_us_market_open 辅助函数：**
```rust
fn is_us_market_open(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;
    let weekday = (unix_timestamp / SECONDS_IN_A_DAY + 4) % 7;

    // 检查是否是工作日（周一 = 0，...，周五 = 4）
    if weekday >= 5 {
        return false;
    }

    // 检查当前时间是否在市场开放时间内
    seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_CLOSE_TIME
}
```
此辅助函数通过计算自午夜以来的秒数和星期几来检查美国市场是否根据给定的 Unix 时间戳开放。如果当前时间是工作日并且在市场开放时间内，则返回 true。

**注意**：这只是一个示例，特殊情况（如银行假日）将不会被考虑在内。

**is_within_15_minutes_of_market_open_or_close 辅助函数：**
```rust
fn is_within_15_minutes_of_market_open_or_close(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;

    // 检查当前时间是否在市场开盘后 15 分钟内或市场收盘后 15 分钟内
    (seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_OPEN_TIME + MARKET_OPEN_CLOSE_MARGIN) ||
    (seconds_since_midnight >= MARKET_CLOSE_TIME && seconds_since_midnight < MARKET_CLOSE_TIME + MARKET_OPEN_CLOSE_MARGIN)
}
```

此辅助函数通过计算自午夜以来的秒数并与市场开盘和收盘时间进行比较，添加 15 分钟的边际，来检查当前时间是否在市场开盘或收盘的 15 分钟内。

### 状态

在 Solana 上，要在链上存储数据，我们需要创建一个结构体来表示反序列化后的数据。

所以这是我们将用于 Oracle 账户的结构体。
```rust
#[account]
pub struct Oracle {
    pub validation: OracleValidation,
    pub bump: u8,
    pub vault_bump: u8,
}

impl Space for Oracle {
    const INIT_SPACE: usize = 8 + 5 + 1;
}
```
让我们讨论创建此结构体时做出的一些选择：
- 没有 admin 字段，因为一旦初始化，它将是无需许可的，允许任何人与之交互。
- validation 字段放在第一位，以利用原生方式设置 NFT 上搜索的偏移量，只需要判别器大小（8 字节），避免在 Oracle 插件配置上需要自定义偏移量。
- 我们为 Oracle PDA 和 Oracle Vault PDA 保存 bump，以避免每次在指令中包含这些账户时都要派生 bump。这是 Solana 开发的标准做法，有助于节省计算使用。在[这里](https://solana.stackexchange.com/questions/12200/why-do-i-need-to-store-the-bump-inside-the-pda)阅读更多相关信息。

关于空间计算，我们直接使用 Anchor 的 Space 实现，创建一个名为 `INIT_SPACE` 的常量，在创建 PDA 和存储足够的 SOL 用于租金豁免时引用。
唯一不寻常的方面是 mpl-core 的 OracleValidation 结构体需要 5 字节的大小。其余的空间计算是标准的。在[这里](https://book.anchor-lang.com/anchor_references/space.html)了解更多关于计算空间的信息。

### 账户

Anchor 中的账户是一个经过验证的账户结构，可以从 Solana 程序的输入中反序列化。

对于我们的程序，两个指令使用的账户结构非常相似。然而，在一个中我们初始化 Oracle 账户，在另一个中我们只是引用它。

让我们探索 `CreateOracle` 账户：
```rust
#[derive(Accounts)]
pub struct CreateOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = Oracle::INIT_SPACE,
        seeds = [b"oracle"],
        bump
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

该结构为此指令的签名者和付款者提供了两个独立的账户。这是大多数指令的标准做法，即使在这里不是严格必要的，因为它确保如果 PDA 签署交易，我们仍然有一个账户来支付费用。两者都需要是交易的签名者。

其他细节：
- Oracle 账户被初始化，并以 `[b"oracle"]` 作为 seeds 以确保不可能创建多个 oracle 账户。分配的空间由 `INIT_SPACE` 常量定义。
- `reward_vault` 账户包含在此指令中以保存 bumps 供下一个指令使用。
- System 程序是在 Solana 上创建新账户所必需的，因为 init 宏将使用 system 程序的 `create_account` 指令。

现在让我们看看 `CrankOracle` 账户：
```rust
#[derive(Accounts)]
pub struct CrankOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"oracle"],
        bump = oracle.bump,
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        mut,
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump = oracle.vault_bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```
此结构与 CreateOracle 账户类似，但 oracle 和 reward_vault 设置为可变。这是因为 oracle 需要更新其验证输入，而 reward_vault 需要调整 lamports 以支付 cranker。bump 字段从 oracle 账户明确定义，以避免每次都重新计算它们。

### 指令

最后，我们来到最重要的部分：指令，这是魔法发生的地方！

`Create Oracle` 指令：
```rust
pub fn create_oracle(ctx: Context<CreateOracle>) -> Result<()> {
    // 根据时间和美国市场是否开放设置 Oracle 验证
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Approved,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
        false => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Rejected,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
    }

    Ok(())
}
```
此指令使用 set_inner 初始化 oracle 账户以正确填充 Oracle State Struct。根据 is_us_market_open 函数的结果，它将批准或拒绝指向该账户的 NFT 的转移。此外，它使用 ctx.bumps 保存 bumps。

`Crank Oracle` 指令：
```rust
pub fn crank_oracle(ctx: Context<CrankOracle>) -> Result<()> {
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Rejected,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Approved,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
        false => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Approved,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Rejected,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
    }

    let reward_vault_lamports = ctx.accounts.reward_vault.lamports();
    let oracle_key = ctx.accounts.oracle.key().clone();
    let signer_seeds = &[b"reward_vault", oracle_key.as_ref(), &[ctx.accounts.oracle.bump]];

    if is_within_15_minutes_of_market_open_or_close(Clock::get()?.unix_timestamp) && reward_vault_lamports > REWARD_IN_LAMPORTS {
        // 奖励在市场开盘或收盘 15 分钟内更新 Oracle 的 cranker
        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.reward_vault.to_account_info(),
                    to: ctx.accounts.signer.to_account_info(),
                },
                &[signer_seeds]
            ),
            REWARD_IN_LAMPORTS
        )?
    }

    Ok(())
}
```

此指令的功能与 create_oracle 指令类似，但增加了检查。根据 is_us_market_open 函数的响应，它会验证状态是否已经更新。如果没有，它会更新状态。

指令的第二部分检查 is_within_15_minutes_of_market_open_or_close 是否为 true，以及 reward vault 中是否有足够的 lamports 来支付 cranker。如果两个条件都满足，它会将奖励转移给 cranker；否则，它什么都不做。

### 创建 NFT

这个旅程的最后一部分将是创建一个集合并将其指向 Oracle 账户，这样我们包含在该集合中的每个资产都将遵循自定义 Oracle 规则！

让我们首先设置您的环境以使用 Umi。（Umi 是一个用于构建和使用 Solana 程序 JavaScript 客户端的模块化框架。在[这里](/zh/dev-tools/umi/getting-started)了解更多）

```ts
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// 您要使用的钱包的 SecretKey
import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));
```

接下来，我们使用 `CreateCollection` 指令创建包含 Oracle 插件的集合：

```ts
// 生成 Collection PublicKey
const collection = generateSigner(umi)
console.log("Collection Address: \n", collection.publicKey.toString())

const oracleAccount = publicKey("...")

// 生成集合
const collectionTx = await createCollection(umi, {
    collection: collection,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
    plugins: [
        {
            type: "Oracle",
            resultsOffset: {
                type: 'Anchor',
            },
            baseAddress: oracleAccount,
            authority: {
                type: 'UpdateAuthority',
            },
            lifecycleChecks: {
                transfer: [CheckResult.CAN_REJECT],
            },
            baseAddressConfig: undefined,
        }
    ]
}).sendAndConfirm(umi)

// 从交易中反序列化签名
let signature = base58.deserialize(collectinTx.signature)[0];
console.log(signature);
```

## 结论

恭喜！您现在已经具备使用 Oracle 插件创建只能在美国市场开放时间内交易的 NFT 集合的能力。如果您想了解更多关于 Core 和 Metaplex 的信息，请查看[开发者中心](/zh/smart-contracts/core/getting-started)。
