---
title: 付款人-权限模式
metaTitle: 付款人-权限模式 | Metaplex Guides
description: Solana 指令使用单独的权限和付款人的常见编程模式。
# remember to update dates also in /components/guides/index.js
created: '12-30-2024'
updated: null
---

## P-A 模式概述

付款人-权限（P-A）模式是在支付存储或租金的一方（*付款人*）可以与拥有或控制账户的一方（*权限*）不同的场景中构建 Solana 程序指令的常见方法。在为最大可组合性设计协议时，它作为一种强大的默认行为，是 Metaplex 程序库中的主要内容。

通过分离这些角色，您的程序可以适应更灵活的资金机制（一个或多个付款人）和更清晰的所有权或控制语义。例如，在游戏中，您可能希望用户支付初始化账户的费用，但让您的程序或 PDA 作为后续操作的权限。

## 为什么您可能需要两个不同的签名者

1. **不同的责任**：
   分离责任允许一个签名者支付账户创建或租金，另一个签名者实际管理或拥有该账户。这是一种清晰的关注点分离，对于大型或更复杂的程序尤其重要。

2. **灵活性**：
   有时资助交易的一方与最终控制账户的一方不同。通过设置两个角色，您可以轻松适应赞助商支付链上存储但最终用户保留自主权和资产所有权的模式。

3. **PDA 签名者**：
   程序派生地址（PDA）不具有允许它们像常规密钥对那样签署交易的私钥，因此它们的所有交互都必须通过调用程序来管理。虽然 PDA 可以是账户的权限，但它不能直接用于支付租金或费用而不涉及复杂的资金转移。拥有一个单独的付款人账户代表 PDA 支付租金或小额存储调整，避免了仅为支付小额更改而将资金注入 PDA 的复杂性。

## Rust 示例

以下是如何在 Shank 和 Anchor 中实现 P-A 模式的示例。我们还讨论了如何验证这些签名者条件以及如何构建使用此模式的客户端。

{% dialect-switcher title="Rust 中的付款人-权限模式" %}
{% dialect title="Shank" id="shank" %}
{% totem %}

```rust
    /// Create a new account.
    #[account(0, writable, signer, name="account", desc = "The address of the new account")]
    #[account(1, writable, signer, name="payer", desc = "The account paying for the storage fees")]
    #[account(2, optional, signer, name="authority", desc = "The authority signing for account creation")]
    #[account(3, name="system_program", desc = "The system program")]
    CreateAccountV1(CreateAccountV1Args),
```

{% /totem %}
{% /dialect %}

{% dialect title="Anchor" id="anchor" %}
{% totem %}

```rust
    /// Create a new account.
    #[derive(Accounts)]
    pub struct CreateAccount<'info> {
        /// The address of the new account
        #[account(init, payer = payer, space = 8 + NewAccount::MAXIMUM_SIZE)]
        pub account: Account<'info, NewAccount>,

        /// The account paying for the storage fees
        #[account(mut)]
        pub payer: Signer<'info>,

        /// The authority signing for the account creation
        pub authority: Option<Signer<'info>>,

        // The system program
        pub system_program: Program<'info, System>
    }
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 约束检查

在原生 Solana 代码中，您需要确保每个指令都存在正确的签名者。这通常意味着：

```rust
    // Check that the payer has signed the transaction and consented to paying storage fees.
    assert_signer(ctx.accounts.payer)?;

    // If the authority is present, check that they're a signer. Otherwise treat
    // the payer as the one authorizing the transaction.
    let authority = match ctx.accounts.authority {
        Some(authority) => {
            assert_signer(authority)?;
            authority
        }
        None => ctx.accounts.payer,
    };
```

### 要点

* `assert_signer` 确保提供的账户密钥已签署交易。

* 我们设置了回退逻辑：如果没有提供权限，我们将付款人视为权限。这有效地捕获了 P-A 模式的本质：一个单独的可选权限可以管理账户创建或修改，但如果没有提供权限，付款人默认承担该角色。

## 客户端的样子

从客户端来看，您需要将付款人和权限（可选）传递给交易。以下是使用 Umi 的示例，展示了 CreateAccountV1 指令如何构建这些账户。

{% dialect-switcher title="付款人-权限模式客户端" %}
{% dialect title="Umi" id="umi" %}
{% totem %}

```ts
    // Accounts.
    export type CreateAccountV1InstructionAccounts = {
        /** The address of the new account */
        account: Signer;
        /** The account paying for the storage fees */
        payer: Signer;
        /** The authority of the new asset */
        authority?: Signer | Pda;
        /** The system program */
        systemProgram?: PublicKey | Pda;
    };
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 总结

付款人-权限模式是处理账户资助者（付款人）与账户所有者或管理者（权限）不同的情况的优雅方式。通过要求单独的签名者并在链上逻辑中验证它们，您可以在程序中维护清晰、健壮和灵活的所有权语义。Rust（Shank 和 Anchor）中的示例代码和 Umi 客户端示例说明了如何端到端实现此模式。

每当您预期需要一个可能与支付账户创建或交易费用的实体不同的专门账户权限，或者在您希望用户 CPI 进入您的程序的情况下，请使用此模式。这确保您可以轻松处理更复杂的场景，而不会使核心程序逻辑复杂化。
