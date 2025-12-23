---
title: 使用 Rust 工作
metaTitle: 使用 Rust 工作 | 指南
description: 关于使用 Rust 和 Metaplex 协议工作的快速概述。
---

## 介绍

毫无疑问，如果您在 Solana 上构建，您很可能遇到过 Rust 这个术语，它是在 Solana 生态系统中构建程序的最流行语言。

如果您是开发新手，Rust 可能是一项相当艰巨的任务，但这里有一些资源可以帮助您开始使用 Rust 和 Solana 生态系统。

**Rust 之书**

从这里开始学习 Rust。它从基础到使用该语言的高级编码。

[https://doc.rust-lang.org/stable/book/](https://doc.rust-lang.org/stable/book/)

**Anchor**

Anchor 是一个框架，通过为您剥离大量安全样板代码并为您处理它来帮助您构建 Solana 程序，从而加快开发过程。

[https://www.anchor-lang.com/](https://www.anchor-lang.com/)

## 本地使用 Rust 脚本

### 设置 Solana 客户端

为 Rust 脚本设置 Solana RPC 客户端相当简单。您只需要获取 `solana_client` crate。

```rust
use solana_client::rpc_client;

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
```

### 使用 Metaplex Rust 指令构建器

来自 Metaplex Rust crate 的每个指令目前也将附带该指令的 `Builder` 版本，您可以导入它。这为您抽象了大量代码，并将返回准备发送的指令。

让我们以 Core 中的 `CreateV1` 指令为例（这也适用于此 Crate 和所有其他 Metaplex crate 的所有其他指令）。

如果我们查看 [Mpl Core crate 类型文档](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)中的指令，我们可以看到我们有许多可用的指令。

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

我们这里感兴趣的是 `CreateV1Builder`。

要初始化构建器，我们可以调用 `new`。

```rust
CreateV1Builder::new();
```

从这一点开始，我们可以 `ctrl + click`（PC）或 `cmd + click`（Mac）进入从 `Builder::` 生成的 `new` 函数，这将我们定位到构建器的 `pub fn new()`。如果您稍微向上滚动，您将看到 `CreateV1Builder` 的 `pub struct`，如下所示。

```rust
pub struct CreateV1Builder {
    asset: Option<solana_program::pubkey::Pubkey>,
    collection: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    log_wrapper: Option<solana_program::pubkey::Pubkey>,
    data_state: Option<DataState>,
    name: Option<String>,
    uri: Option<String>,
    plugins: Option<Vec<PluginAuthorityPair>>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

```

这些是需要传递到构建器中的公钥和数据参数。某些账户也可能是可选的并默认为其他账户，这可能因指令而异。如果您再次点击进入 `new()` 函数并这次向下滚动，您将看到带有额外注释的单个函数。在下面的情况下，您可以看到所有者将默认为付款人，因此如果付款人也将成为资产的所有者，我们就不需要传入所有者。

```rust
/// `[optional account]`
    /// The owner of the new asset. Defaults to the authority if not present.
    #[inline(always)]
    pub fn owner(&mut self, owner: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.owner = owner;
        self
    }
```

以下是使用 `CreateV1Builder` 的示例，该示例使用 `.instruction()` 返回指令以关闭构建器。

```rust
let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
.       .instruction();
```

现在我们已经准备好了指令，我们需要创建一个正常的 Solana 交易发送到我们的 RPC。这包括区块哈希和签名者。

### 完整的 Builder 示例

这是使用 Metaplex `Builder` 函数创建指令并将该交易发送到链上的完整示例。

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)

```

## 使用程序工作

### CPI（跨程序调用）

您可能以前听说过"CPI 进入程序"或"在程序上调用 CPI"这些术语，并想"他们到底在说什么？"。

好吧，CPI 进入程序基本上是一个程序在交易期间调用另一个程序。

一个例子是我创建了一个程序，在此交易期间我需要在此交易期间转移 Nft 或资产。好吧，如果我给它所有正确的详细信息，我的程序可以 CPI 调用并要求 Token Metadata 或 Core 程序为我执行转移指令。

### 使用 Metaplex Rust 交易 CPI 构建器

来自 Metaplex Rust crate 的每个指令目前也将附带该指令的 `CpiBuilder` 版本，您可以导入它。这为您抽象了大量代码，并且可以直接从 CpiBuilder 本身调用。

让我们以 Core 中的 `Transfer` 指令为例（这也适用于此 Crate 和所有其他 Metaplex crate 的所有其他指令。）

如果我们查看 [Mpl Core crate 类型文档](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)中的指令，我们可以看到我们有许多可用的指令。

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

要初始化构建器，我们可以在 CpiBuilder 上调用 `new` 并传入进行 CPI 调用的程序地址的程序 `AccountInfo`。

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

某些账户在 CpiBuilder 中可能是可选的，因此您可能需要检查您的用例需要什么和不需要什么。

以下是 Transfer 和 Create 的两个 CpiBuilders 填写好的版本。

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

### 调用

调用是用于执行对其他程序的 CPI 调用的术语。如果您愿意，可以说是程序版本的"发送交易"。

在调用 CPI 调用时，我们有两个选项。`invoke()` 和 `invoke_signed()`

#### invoke()

当不需要将 PDA 签名者种子传递给被调用的指令以使交易成功时，使用 `invoke()`。
不过，已签署到您的原始指令中的账户将自动将签名者验证传递到 cpi 调用中。

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke()

```

#### invoke_signed()

当 PDA 是需要在 cpi 调用中成为签名者的账户之一时，使用 `invoke_signed()`。假设我们有一个程序占有了我们的资产，我们程序的一个 PDA 地址成为了它的另一个。为了转移它并将所有者更改为其他人，该 PDA 将必须签署交易。

您需要传入原始 PDA 种子和 bump，以便可以重新创建 PDA 并可以代表您的程序签署 cpi 调用。

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke_signed(signers)

```

### 完整的 CpiBuilder 示例

以下是使用 Core 程序中的 TransferV1 指令使用 CpiBuilder 的完整示例。

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
