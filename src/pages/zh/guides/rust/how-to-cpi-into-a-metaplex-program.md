---
title: 如何 CPI 进入 Metaplex 程序
metaTitle: 如何 CPI 进入 Metaplex 程序 | 指南
description: 概述 Metaplex 如何在对每个 Metaplex 程序执行 CPI 时创建一致的体验。
keywords:
  - CPI
  - Cross Program Invocation
  - Solana CPI tutorial
  - Metaplex CpiBuilder
  - invoke_signed
about:
  - Cross Program Invocation
  - Metaplex CPI builders
  - Solana program interoperability
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
howToSteps:
  - Import the CpiBuilder for the desired Metaplex instruction
  - Initialize the CpiBuilder with the target program AccountInfo
  - Fill in the required accounts and data arguments
  - Choose between invoke() for regular calls or invoke_signed() for PDA signers
  - Execute the CPI call to the Metaplex program
howToTools:
  - Metaplex Rust SDK
  - mpl-core crate
---

## 介绍

您可能以前听说过"CPI 进入程序"或"在程序上调用 CPI"这些术语，并想"他们在说什么？"。

CPI（跨程序调用）是一个程序调用另一个程序上的指令的交互。

一个例子是我创建了一个程序，在此交易期间我需要在此交易期间转移 NFT 或资产。好吧，如果我给它所有正确的详细信息，我的程序可以 CPI 调用并要求 Token Metadata 或 Core 程序为我执行转移指令。

## 使用 Metaplex Rust 交易 CPI 构建器

来自 Metaplex Rust crate 的每个指令目前也将附带该指令的 `CpiBuilder` 版本，您可以导入它。这为您抽象了大量代码，并且可以直接从 `CpiBuilder` 本身调用。

让我们以 Core 中的 `Transfer` 指令为例（这也适用于此 Crate 和所有其他 Metaplex crate 的所有其他指令。）

如果我们查看 [MPL Core crate 类型文档](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)中的指令，我们可以看到我们有许多可用的指令。

```
TransferV1
TransferV1Builder
TransferV1Cpi
TransferV1CpiAccounts
TransferV1CpiBuilder
TransferV1InstructionArgs
TransferV1InstructionData
```

我们这里感兴趣的是 `TransferV1CpiBuilder`。

要初始化构建器，我们可以在 `CpiBuilder` 上调用 `new` 并传入进行 CPI 调用的程序地址的程序 `AccountInfo`。

```rust
TransferV1CpiBuilder::new(ctx.accounts.mpl_core_program);
```

从这一点开始，我们可以 `ctrl + click`（PC）或 `cmd + click`（Mac）进入从 `CpiBuilder::` 生成的 `new` 函数，这将向我们显示此特定 CPI 调用所需的所有 CPI 参数（账户和数据）。

```rust
//new() function for TransferV1CpiBuilder

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(TransferV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            payer: None,
            authority: None,
            new_owner: None,
            system_program: None,
            log_wrapper: None,
            compression_proof: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

正如我们所看到的，这个需要所有账户而没有数据，是一个相当容易填写的 CPI 调用。

如果我们查看第二个 CpiBuilder，但这次是 CreateV1，我们可以看到这里需要额外的数据，例如 `name` 和 `uri`，它们都是字符串。

```rust
//new() function for CreateV1CpiBuilder

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            authority: None,
            payer: None,
            owner: None,
            update_authority: None,
            system_program: None,
            log_wrapper: None,
            data_state: None,
            name: None,
            uri: None,
            plugins: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

某些账户在 `CpiBuilder` 中可能是可选的，因此您可能需要检查您的用例需要什么和不需要什么。

以下是 Transfer 和 Create 的两个 `CpiBuilder` 填写好的版本。

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
```

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        .collection(context.accounts.collection)
        .authority(context.accounts.authority)
        .payer(context.accounts.payer)
        .owner(context.accounts.owner)
        .update_authority(context.accounts.update_authority)
        .system_program(context.accounts.system_program)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(args.asset_name)
        .uri(args.asset_uri)
        .plugins(args.plugins)
```

## 调用

调用是用于执行对其他程序的 CPI 调用的术语，如果您愿意，可以说是程序版本的"发送交易"。

在调用 CPI 调用时，我们有两个选项。`invoke()` 和 `invoke_signed()`

### invoke()

当不需要将 PDA 签名者种子传递给被调用的指令以使交易成功时，使用 `invoke()`。
不过，已签署到您的原始指令中的账户将自动将签名者验证传递到 cpi 调用中。

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke()

```

### invoke_signed()

当 PDA 是需要在 cpi 调用中成为签名者的账户之一时，使用 `invoke_signed()`。假设我们有一个程序占有了我们的资产，我们程序的一个 PDA 地址成为了它的所有者。为了转移它并将所有者更改为其他人，该 PDA 将必须签署交易。

您需要传入原始 PDA 种子和 bump，以便可以重新创建 PDA 并可以代表您的程序签署 cpi 调用。

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke_signed(signers)
```

## 完整的 CpiBuilder 示例

以下是使用 Core 程序中的 TransferV1 指令使用 `CpiBuilder` 的完整示例。

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
        .invoke()

```
