---
title: 使用 Rust 入门
metaTitle: Rust SDK | Token Metadata
description: 使用 Token Metadata Rust SDK 开始使用 NFT
---

如果您是 Rust 开发人员,您也可以使用 Rust 客户端 SDK 与 Token Metadata 程序交互。Metaplex 提供了一个专用的 Rust 客户端 crate,这是一个依赖项最少的轻量级 crate。

首先,您需要将 `mpl-token-metadata` 依赖项添加到您的项目中。在项目根文件夹的终端中:

```
cargo add mpl-token-metadata
```

这将在您项目的依赖项列表中添加该 crate 的最新版本。

{% callout %}

如果您使用的 solana-program 版本早于 1.16,请首先将 `solana-program` 依赖项添加到您的项目中,然后再添加 `mpl-token-metadata`。这将确保您只有一个 `borsh` crate 的副本。

{% /callout %}

## 🧱 结构

客户端 SDK 分为几个模块:

- `accounts`:表示程序账户的结构体
- `errors`:表示程序错误的枚举
- `instructions`:用于从客户端(链外)和程序(链上)创建指令的结构体以及指令参数
- `types`:表示程序使用的类型的结构体

一个很好的起点是 `instructions` 模块,它包含创建与 Token Metadata 交互的指令的辅助函数。这些设计得灵活且易于使用。如果指令需要额外的类型,这些将从 `types` 模块引用。如果您想反序列化 Token Metadata 账户的内容,`accounts` 模块有一个表示每个账户的结构体,其中包含反序列化其内容的辅助方法。

## 🏗️ 指令构建器

客户端 SDK 的主要功能之一是方便指令的创建。根据您是编写链外还是链上代码,有两种_类型_的指令构建器,并且两者都支持按名称传递账户和可选的位置账户。

### 客户端(链外)

这些旨在由链外客户端代码使用。每个指令都由一个结构体表示,其字段是所需账户的 `Pubkey`。

{% totem %}
{% totem-prose %}

`CreateV1` 指令结构体:

{% /totem-prose %}

```rust
pub struct CreateV1 {
    /// Unallocated metadata account with address as pda
    /// of ['metadata', program id, mint id]
    pub metadata: Pubkey,

    /// Unallocated edition account with address as pda
    /// of ['metadata', program id, mint, 'edition']
    pub master_edition: Option<Pubkey>,

    /// Mint of token asset
    pub mint: (Pubkey, bool),

    /// Mint authority
    pub authority: Pubkey,

    /// Payer
    pub payer: Pubkey,

    /// Update authority for the metadata account
    pub update_authority: (Pubkey, bool),

    /// System program
    pub system_program: Pubkey,

    /// Instructions sysvar account
    pub sysvar_instructions: Pubkey,

    /// SPL Token program
    pub spl_token_program: Pubkey,
}
```

{% /totem %}

填写指令账户字段后,您可以使用 `instruction(...)` 方法生成相应的 Solana `Instruction`:

{% totem %}
{% totem-prose %}

为 `CreateV1` 创建 `Instruction`:

{% /totem-prose %}

```rust
// instruction args
let args = CreateV1InstructionArgs {
    name: String::from("My pNFT"),
    symbol: String::from("MY"),
    uri: String::from("https://my.pnft"),
    seller_fee_basis_points: 500,
    primary_sale_happened: false,
    is_mutable: true,
    token_standard: TokenStandard::ProgrammableNonFungible,
    collection: None,
    uses: None,
    collection_details: None,
    creators: None,
    rule_set: None,
    decimals: Some(0),
    print_supply: Some(PrintSupply::Zero),
};

// instruction accounts
let create_ix = CreateV1 {
    metadata,
    master_edition: Some(master_edition),
    mint: (mint_pubkey, true),
    authority: payer_pubkey,
    payer: payer_pubkey,
    update_authority: (payer_pubkey, true),
    system_program: system_program::ID,
    sysvar_instructions: solana_program::sysvar::instructions::ID,
    spl_token_program: spl_token::ID,
};

// creates the instruction
let create_ix = create_ix.instruction(args);
```

{% /totem %}

此时,`create_ix` 是一个准备好添加到交易并发送处理的 `Instruction`。

在上面的示例中,您可能注意到,即使我们不需要为可选参数提供值,我们仍然需要指定 `None`。为了进一步简化指令的创建,您可以使用 `*Builder` _配套_结构体。

{% totem %}
{% totem-prose %}

使用 `CreateV1Builder` 创建 `Instruction`:

{% /totem-prose %}

```rust
let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint_pubkey, true)
    .authority(payer_pubkey)
    .payer(payer_pubkey)
    .update_authority(payer_pubkey, true)
    .is_mutable(true)
    .primary_sale_happened(false)
    .name(String::from("My pNFT"))
    .uri(String::from("https://my.pnft"))
    .seller_fee_basis_points(500)
    .token_standard(TokenStandard::ProgrammableNonFungible)
    .print_supply(PrintSupply::Zero)
    .instruction();
```

{% /totem %}

最终结果是相同的 `create_ix` 指令,准备添加到交易并发送处理。

### 跨程序调用(链上)

当您编写需要与 Token Metadata 交互的程序时,可以使用链上跨程序调用(CPI)构建器。它们的工作方式与链外构建器类似,主要区别在于它们需要 `AccountInfo` 引用而不是 `Pubkey`。

{% totem %}
{% totem-prose %}

`TransferV1Cpi` 指令结构体:

{% /totem-prose %}

```rust
pub struct TransferV1Cpi<'a> {
    /// The program to invoke.
    pub __program: &'a AccountInfo<'a>,

    /// Token account
    pub token: &'a AccountInfo<'a>,

    /// Token account owner
    pub token_owner: &'a AccountInfo<'a>,

    /// Destination token account
    pub destination_token: &'a AccountInfo<'a>,

    /// Destination token account owner
    pub destination_owner: &'a AccountInfo<'a>,

    /// Mint of token asset
    pub mint: &'a AccountInfo<'a>,

    /// Metadata (pda of ['metadata', program id, mint id])
    pub metadata: &'a AccountInfo<'a>,

    /// Edition of token asset
    pub edition: Option<&'a AccountInfo<'a>>,

    /// Owner token record account
    pub token_record: Option<&'a AccountInfo<'a>>,

    /// Destination token record account
    pub destination_token_record: Option<&'a AccountInfo<'a>>,

    /// Transfer authority (token owner or delegate)
    pub authority: &'a AccountInfo<'a>,

    /// Payer
    pub payer: &'a AccountInfo<'a>,

    /// System Program
    pub system_program: &'a AccountInfo<'a>,

    /// Instructions sysvar account
    pub sysvar_instructions: &'a AccountInfo<'a>,

    /// SPL Token Program
    pub spl_token_program: &'a AccountInfo<'a>,

    /// SPL Associated Token Account program
    pub spl_ata_program: &'a AccountInfo<'a>,

    /// Token Authorization Rules Program
    pub authorization_rules_program: Option<&'a AccountInfo<'a>>,

    /// Token Authorization Rules account
    pub authorization_rules: Option<&'a AccountInfo<'a>>,

    /// The arguments for the instruction.
    pub __args: TransferV1InstructionArgs,
}
```

{% /totem %}

指令结构体需要三种不同的信息:(1)要调用的程序——`__program` 字段;(2)由 `AccountInfo` 引用表示的账户的可变列表;(3)指令参数——`__args` 字段。为了简化结构体的创建,有一个 `new(...)` 工厂方法。填写程序、指令账户和参数字段后,您可以使用 `invoke()` 或 `invoke_signed(...)` 方法执行 CPI。

{% totem %}
{% totem-prose %}

调用 `TransferV1Cpi` 指令:

{% /totem-prose %}

```rust
// creates the instruction
let cpi_transfer = TransferV1Cpi::new(
    metadata_program_info,
    TransferV1CpiAccounts {
        token: owner_token_info,
        token_owner: owner_info,
        destination_token: destination_token_info,
        destination_owner: destination_info,
        mint: mint_info,
        metadata: metadata_info,
        authority: vault_info,
        payer: payer_info,
        system_program: system_program_info,
        sysvar_instructions: sysvar_instructions_info,
        spl_token_program: spl_token_program_info,
        spl_ata_program: spl_ata_program_info,
        edition: edition_info,
        token_record: None,
        destination_token_record: None,
        authorization_rules: None,
        authorization_rules_program: None,
    },
    TransferV1InstructionArgs {
        amount,
        authorization_data: None,
    },
);

// performs the CPI
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

您可能已经(再次)注意到,对于我们不传递值的每个可选账户/参数,我们仍然需要将其设置为 `None`。与链外指令类似,CPI 指令有一个_配套_ `*Builder` 结构体。

{% totem %}
{% totem-prose %}

使用 `TransferV1CpiBuilder` 调用 `TransferV1Cpi` 指令:

{% /totem-prose %}

```rust
// creates the instruction
let cpi_transfer = TransferV1CpiBuilder::new(metadata_program_info)
    .token(owner_token_info)
    .token_owner(owner_info)
    .destination_token(destination_token_info)
    .destination_owner(destination_info)
    .mint(mint_info)
    .metadata(metadata_info)
    .edition(edition_info)
    .authority(vault_info)
    .payer(payer_info)
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .spl_ata_program(spl_ata_program_info)
    .amount(amount);

// performs the CPI
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

## 🔎 PDA 辅助函数

SDK 的另一组有用的辅助函数是 PDA 查找。表示 PDA 的账户类型(例如 `Metadata`)具有用于查找/创建 PDA `Pubkey` 的关联函数。

{% totem %}
{% totem-prose %}

`find_pda` 和 `create_pda` 辅助方法的实现:

{% /totem-prose %}

```rust
impl Metadata {
    pub fn find_pda(mint: Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(
            &[
                "metadata".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                mint.as_ref(),
            ],
            &crate::MPL_TOKEN_METADATA_ID,
        )
    }

    pub fn create_pda(
        mint: Pubkey,
        bump: u8,
    ) -> Result<Pubkey, PubkeyError> {
        Pubkey::create_program_address(
            &[
                "metadata".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                mint.as_ref(),
                &[bump],
            ],
            &crate::MPL_TOKEN_METADATA_ID,
        )
    }
}
```

{% totem-prose %}

`find_pda` 方法通常用于链外客户端:

```rust
let (metadata_pubkey, _) = Metadata::find_pda(mint);
```

{% /totem-prose %}
{% totem-prose %}

建议在链上使用 `create_pda` 方法,因为与 `find_pda` 相比,它可以节省计算单元,但它确实需要存储用于生成 PDA 派生的 `bump`:

```rust
let metadata_pubkey = Metadata::create_pda(mint, bump)?;
```

{% /totem-prose %}
{% /totem %}

## 🔗 有用的链接

- [GitHub 仓库](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/clients/rust)
- [Crate 页面](https://crates.io/crates/mpl-token-metadata)
- [API 参考](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/index.html)
