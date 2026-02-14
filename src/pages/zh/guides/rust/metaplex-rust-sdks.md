---
title: Metaplex Rust SDKs
metaTitle: Metaplex Rust SDKs | 指南
description: Metaplex Rust SDKs 快速概述。
keywords:
  - Metaplex Rust SDK
  - Rust crate modules
  - mpl-core crate
  - SDK accounts and types
  - Solana Rust crates
about:
  - Metaplex Rust SDKs
  - instruction builders
  - CPI builders
  - SDK modules
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
---

## 介绍

Metaplex 为我们的大多数程序提供 Rust SDK，这些程序具有一致且可预测的输出和功能，从而缩短了使用我们产品的开发人员的集成时间。

## 模块

Core Rust SDK 被组织成几个模块：

- `accounts`：表示程序的账户。
- `instructions`：促进指令、指令参数和 CPI 指令的创建。
- `errors`：列举程序的错误。
- `types`：表示程序使用的类型。

### 账户

**accounts** 模块是基于链上账户结构生成的。这些可以使用多种不同的方法进行反序列化，具体取决于您是使用 RAW 程序生成还是使用 Anchor 等框架。

这些可以从 `<crate_name>::accounts` 访问。在 `mpl-core` 的情况下，您可以如下访问账户：

```rust
mpl_core::accounts
```

### 指令

每个 SDK 都带有一个 **instructions** 模块，该模块带有来自给定程序的提供指令的多个版本，根据您的需求剥离了大量样板代码。

以下示例显示了来自 `mpl-core` crate 的所有 `CreateV1` 指令。

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

这些可以从 `<crate_name>::instructions` 访问。在 `mpl-core` 的情况下，您可以如下访问账户：

```rust
mpl_core::instructions
```

### 类型

每个 Metaplex Rust SDK 都带有一个 **types** 模块，该模块提供初始账户模块结构中可能没有的所有必要额外类型。

这些可以从 `<crate_name>::types` 访问。在 `mpl-core` 的情况下，您可以如下访问账户：

```rust
mpl_core::types
```

### 错误

虽然为每个 SDK 生成了 **errors** 模块，但这只保存该特定程序的错误列表，用户不需要与此模块交互。

## 指令构建器

Metaplex Rust SDK 目前还将附带每个指令的两个 **Builder** 版本，您可以导入它们。这为您抽象了大量代码，并将返回准备发送的指令。

这些包括：

- Builder
- CpiBuilder

在 [mpl-Core crate 文档](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)的 `CreateV1` 的情况下，这些指令目前可供我们使用。

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

### Builder

Builder 指令旨在在您需要为客户端交易创建指令时使用。

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

这些是需要传递到构建器中的公钥和数据参数。某些账户也可能是可选的。这些可选账户可能根本不需要程序，或者如果省略可能默认为另一个地址。此行为可能因指令而异。

如果您再次点击进入 `new()` 函数并这次向下滚动，您将看到带有额外注释的单个函数。在下面的情况下，您可以看到所有者将默认为付款人，因此如果付款人也将成为资产的所有者，我们就不需要传入所有者。

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
        .instruction();
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

### CpiBuilder

`CpiBuilder` 指令旨在当您希望从您自己的程序调用和执行来自 Metaplex 程序的指令时使用。

我们有一个单独的完整指南讨论 `CpiBuilders`，可以在这里查看：

[CPI 进入 Metaplex 程序](/zh/guides/rust/how-to-cpi-into-a-metaplex-program)
