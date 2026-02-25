---
title: 使用Rust和Anchor创建代币
metaTitle: 使用Anchor创建代币 | Solana代币
description: 学习如何使用Rust、Anchor框架和Metaplex Token Metadata在Solana上创建带元数据的SPL代币。
created: '01-18-2026'
updated: null
---

本指南演示如何使用**Rust**、**Anchor**框架和**Metaplex Token Metadata**程序通过CPI在Solana上创建带元数据的同质化代币。 {% .lead %}

{% callout title="你将构建的内容" %}

一个Anchor指令，可以：
- 创建新的SPL代币铸币账户
- 为付款方创建关联代币账户
- 创建包含名称、符号和URI的元数据账户
- 向付款方铸造初始代币供应量

{% /callout %}

## 概要

使用**Anchor (Rust)**在Solana上创建**同质化SPL代币**，铸造初始供应量，并通过CPI附加**Metaplex Token Metadata**（名称、符号、URI）。

- 一个指令：初始化**铸币账户 + ATA + 元数据**，然后铸造供应量
- 使用：SPL Token + Metaplex Token Metadata CPI
- 已测试：Anchor 0.32.1, Solana Agave 3.1.6
- 仅限同质化代币；NFT需要Master Edition + `decimals=0` + `supply=1`

## 不在本指南范围内

Token-2022扩展、机密转账、权限撤销、元数据更新、完整NFT流程、主网部署。

## 快速开始

**跳转至：** [程序](#the-program) · [测试客户端](#the-client) · [常见错误](#common-errors)

1. `anchor init anchor-spl-token`
2. 在`Cargo.toml`中添加带有`metadata`特性的`anchor-spl`
3. 在`Anchor.toml`中为localnet克隆Token Metadata程序
4. 粘贴程序代码并运行`anchor test`

## 前置要求

- 已安装**Rust**（[rustup.rs](https://rustup.rs)）
- 已安装**Solana CLI**（[docs.solana.com](https://docs.solana.com/cli/install-solana-cli-tools)）
- 已安装**Anchor CLI**（`cargo install --git https://github.com/coral-xyz/anchor anchor-cli`）
- **Node.js**和**Yarn**用于运行测试
- 一个有SOL余额的Solana钱包用于支付交易费用

## 已测试配置

本指南使用以下版本进行了测试：

| 工具 | 版本 |
|------|---------|
| Anchor CLI | 0.32.1 |
| Solana CLI | 3.1.6 (Agave) |
| Rust | 1.92.0 |
| Node.js | 22.15.1 |
| Yarn | 1.22.x |

## 初始设置

首先初始化一个新的Anchor项目：

```bash
anchor init anchor-spl-token
cd anchor-spl-token
```

### 配置Cargo.toml

更新`programs/anchor-spl-token/Cargo.toml`：

```toml {% title="programs/anchor-spl-token/Cargo.toml" showLineNumbers=true highlightLines="22,24-26" %}
[package]
name = "anchor-spl-token"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "anchor_spl_token"

[lints.rust]
unexpected_cfgs = { level = "warn", check-cfg = [
    'cfg(feature, values("custom-heap", "custom-panic", "anchor-debug"))'
] }

[features]
default = []
cpi = ["no-entrypoint"]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

[dependencies]
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token", "metadata", "associated_token"] }
```

{% callout title="重要" %}

`idl-build`特性**必须**包含`anchor-spl/idl-build`，否则会出现类似`no function or associated item named 'create_type' found for struct 'anchor_spl::token::Mint'`的错误。

{% /callout %}

### 配置Anchor.toml

更新`Anchor.toml`以克隆Token Metadata程序用于本地测试：

```toml {% title="Anchor.toml" showLineNumbers=true highlightLines="23,25-26" %}
[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.localnet]
anchor_spl_token = "YOUR_PROGRAM_ID_HERE"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"

[test.validator]
url = "https://api.mainnet-beta.solana.com"
bind_address = "127.0.0.1"

[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
```

{% callout %}

- `bind_address = "127.0.0.1"` 是Agave 3.x验证器所必需的（0.0.0.0会导致panic）
- `[[test.validator.clone]]`部分从主网克隆Metaplex Token Metadata程序

{% /callout %}

### 配置package.json

```json {% title="package.json" showLineNumbers=true %}
{
  "license": "ISC",
  "scripts": {
    "lint:fix": "prettier */*.js \"*/**/*{.js,.ts}\" -w",
    "lint": "prettier */*.js \"*/**/*{.js,.ts}\" --check"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.32.1",
    "@metaplex-foundation/mpl-token-metadata": "^3.4.0",
    "@solana/spl-token": "^0.4.9"
  },
  "devDependencies": {
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "ts-mocha": "^10.0.0",
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "typescript": "^5.7.3",
    "prettier": "^2.6.2"
  }
}
```

## 程序

### 导入和模板

这里我们定义所有导入并在`programs/anchor-spl-token/src/lib.rs`中创建Account结构体和指令的模板：

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="1-10" %}
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

declare_id!("YOUR_PROGRAM_ID_HERE");

#[program]
pub mod anchor_spl_token {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
        amount: u64,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateToken<'info> {

}
```

### 创建Account结构体

`CreateToken`结构体定义了指令所需的所有账户并应用必要的约束：

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="2,6-14,16-22,26-34" %}
#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The mint account to be created
    #[account(
        init,
        payer = payer,
        mint::decimals = decimals,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
    )]
    pub mint: Account<'info, Mint>,

    /// The associated token account to receive minted tokens
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// The metadata account to be created
    /// CHECK: Validated by seeds constraint to be the correct PDA
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint.key().as_ref(),
        ],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

**账户类型说明：**
- `#[instruction(...)]`属性允许在账户约束中使用指令参数（如`decimals`）
- `mint`使用Anchor的`init`约束和`mint::decimals = decimals`来创建具有指定小数位数的代币铸币账户
- `token_account`使用`associated_token::`辅助宏初始化为关联代币账户
- `metadata_account`使用`seeds::program`验证PDA属于Token Metadata程序

### 创建指令

`create_token`函数通过CPI创建元数据账户并铸造初始代币供应量：

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="14-40,43-54" %}
pub fn create_token(
    ctx: Context<CreateToken>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
    amount: u64,
) -> Result<()> {
    msg!("Creating token mint...");
    msg!("Mint: {}", ctx.accounts.mint.key());
    msg!("Creating metadata account...");
    msg!("Metadata account address: {}", ctx.accounts.metadata_account.key());

    // Cross Program Invocation (CPI) to token metadata program
    create_metadata_accounts_v3(
        CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        DataV2 {
            name,
            symbol,
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        },
        true,  // is_mutable
        true,  // update_authority_is_signer
        None,  // collection_details
    )?;

    // Mint tokens to the payer's associated token account
    msg!("Minting {} tokens to {}", amount, ctx.accounts.token_account.key());

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        amount,
    )?;

    msg!("Token created and {} tokens minted successfully.", amount);
    Ok(())
}
```

该函数执行两次跨程序调用（CPI）：
1. `create_metadata_accounts_v3`（第14-40行）- 创建并初始化包含名称、符号和URI的元数据账户
2. `mint_to`（第43-54行）- 将指定数量的代币铸造到付款方的代币账户

## 测试客户端

在测试之前，先构建程序：

```bash
anchor build
```

获取您的程序ID并在`lib.rs`和`Anchor.toml`中更新：

```bash
solana address -k target/deploy/anchor_spl_token-keypair.json
```

然后重新构建并部署：

```bash
anchor build
anchor deploy
```

### 创建测试

在`tests/anchor-spl-token.ts`创建测试文件：

```typescript {% title="tests/anchor-spl-token.ts" showLineNumbers=true highlightLines="17-27,39-53" %}
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorSplToken } from "../target/types/anchor_spl_token";
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { BN } from "bn.js";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("anchor-spl-token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorSplToken as Program<AnchorSplToken>;
  const payer = provider.wallet;

  it("Creates a token with metadata and mints initial supply", async () => {
    const mintKeypair = Keypair.generate();

    const tokenName = "My Token";
    const tokenSymbol = "MYTKN";
    const tokenUri = "https://example.com/token-metadata.json";
    const tokenDecimals = 9;
    const mintAmount = new BN(1_000_000).mul(new BN(10).pow(new BN(tokenDecimals)));

    // Derive the metadata account PDA
    const [metadataAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Derive the associated token account
    const tokenAccount = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      payer.publicKey
    );

    console.log("Mint address:", mintKeypair.publicKey.toBase58());
    console.log("Metadata address:", metadataAccount.toBase58());
    console.log("Token account:", tokenAccount.toBase58());

    const tx = await program.methods
      .createToken(tokenName, tokenSymbol, tokenUri, tokenDecimals, mintAmount)
      .accountsPartial({
        payer: payer.publicKey,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAccount,
        metadataAccount: metadataAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    console.log("Transaction signature:", tx);
    console.log("Token created and minted successfully!");
  });
});
```

**关键要点：**
- 元数据账户PDA使用以下种子派生：`["metadata", TOKEN_METADATA_PROGRAM_ID, mint_pubkey]`（第29-36行）
- 关联代币账户使用`getAssociatedTokenAddressSync`派生（第39-42行）
- 铸币密钥对必须作为签名者传入，因为它正在被初始化
- 使用`accountsPartial`指定账户（Anchor 0.32+语法）
- 使用`BN`处理大数字（带小数位的代币数量）
- `tokenDecimals`传入指令并用于计算铸造数量

### 运行测试

```bash
yarn install
anchor test
```

预期输出：

```
  anchor-spl-token
Mint address: GpPyH2FuMcS5PcrKWtrmEkBmW8h8gSwUaxNCQkFXwifV
Metadata address: 6jskfrDAmH9d67iL37CLNBK7Hf6FRwNZbq34q4vGucDq
Token account: J3KCxCfmnK9RJ3onmiUsfBDjvKyuVsAXgWvuypsaFQ2i
Transaction signature: 36v63t5cCsXYM8ny4pgahh...
Token created and minted successfully!
    ✔ Creates a token with metadata and mints initial supply (243ms)

  1 passing (245ms)
```

## 元数据JSON格式

`uri`字段应指向包含代币链下元数据的JSON文件：

```json {% title="token-metadata.json" %}
{
  "name": "My Token",
  "symbol": "MYTKN",
  "description": "A description of my token",
  "image": "https://example.com/token-image.png"
}
```

将此JSON文件托管在永久存储解决方案上，如Arweave或IPFS。

## 常见错误

### `no function or associated item named 'create_type' found`

在Cargo.toml的`idl-build`特性中添加`"anchor-spl/idl-build"`：

```toml
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
```

### `Program account is not executable`

在Anchor.toml中克隆Token Metadata程序：

```toml
[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
```

### `UnspecifiedIpAddr(0.0.0.0)` / 验证器panic

在Anchor.toml的`[test.validator]`中添加`bind_address = "127.0.0.1"`。

## 注意事项

- `amount`参数以**基本单位**表示（包含小数位数）。对于100万个具有9位小数的代币，需传入`1_000_000 * 10^9`。
- 本示例将**铸币权限**和**冻结权限**保留在付款方上。生产环境中的代币通常在初始铸造后撤销或转移这些权限。
- 元数据账户是**可变的**（`is_mutable = true`）。如果您希望元数据不可变，请设置为`false`。

## 下一步

- **部署到Devnet：** 在Anchor.toml中将`cluster = "devnet"`并运行`anchor deploy`
- **创建NFT：** 设置`decimals = 0`和`supply = 1`以创建非同质化代币
- **添加代币扩展：** 探索[SPL Token 2022](https://spl.solana.com/token-2022)了解转账费用、计息代币等功能
- **了解更多Token Metadata：** 查看[Token Metadata文档](/smart-contracts/token-metadata)

## 快速参考

### 关键程序ID

| 程序 | 地址 |
|---------|---------|
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Associated Token Program | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` |
| Token Metadata Program | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| System Program | `11111111111111111111111111111111` |

### 元数据PDA种子

{% dialect-switcher title="派生元数据PDA" %}
{% dialect title="TypeScript" id="ts" %}

```typescript {% showLineNumbers=true %}
const [metadataAccount] = PublicKey.findProgramAddressSync(
  [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
  TOKEN_METADATA_PROGRAM_ID
);
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust {% showLineNumbers=true %}
seeds = [b"metadata", token_metadata_program.key().as_ref(), mint.key().as_ref()]
```

{% /dialect %}
{% /dialect-switcher %}

### 最低依赖

```toml {% title="Cargo.toml" %}
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token", "metadata", "associated_token"] }
```

## 常见问题

{% callout title="术语" %}
- **同质化代币：** `decimals >= 0`，供应量潜力无限
- **NFT：** `decimals = 0`，`supply = 1`，加上Master Edition账户
- **Token Metadata：** Metaplex程序，用于同质化代币和NFT
- **SPL：** Solana Program Library，标准代币接口
{% /callout %}

### 什么是SPL代币？

SPL代币是Solana上等同于以太坊ERC-20代币的标准。SPL代表Solana Program Library。SPL代币是同质化代币，可以代表货币、治理代币、稳定币或Solana上的任何其他同质化资产。

### 代币铸币账户和代币账户有什么区别？

- **代币铸币账户（Token Mint）：** 创建代币的工厂。它定义了代币的属性（小数位数、供应量、权限）。每种代币类型只有一个铸币账户。
- **代币账户（Token Account）：** 持有代币的钱包。每个用户需要为其想持有的每种代币类型创建自己的代币账户。

### 什么是关联代币账户（ATA）？

关联代币账户是为给定钱包和铸币账户确定性派生的代币账户。ATA不是创建随机的代币账户，而是使用标准派生方式，因此任何人都可以计算出任何钱包的代币账户地址。这是处理代币账户的推荐方式。

### 什么是Metaplex Token Metadata？

Metaplex Token Metadata是一个将元数据（名称、符号、图像URI）附加到SPL代币的程序。没有它，代币只是匿名的铸币账户。元数据存储在与铸币账户关联的程序派生地址（PDA）中。

### 为什么本地测试需要克隆Token Metadata程序？

本地Solana测试验证器从干净状态启动，除核心Solana程序外不包含任何程序。Metaplex Token Metadata是部署在主网上的独立程序，因此您需要克隆它才能在本地使用。

### 我可以使用此代码创建NFT吗？

可以，但需要修改：
- 设置`mint::decimals = 0`（NFT不可分割）
- 仅铸造1个代币
- 铸造后移除铸币权限（防止创建更多）
- 添加Master Edition账户（Metaplex NFT标准所需）

### 在Solana上创建代币需要多少费用？

创建代币需要为三个账户支付租金：
- 铸币账户：约0.00145 SOL
- 代币账户：约0.00203 SOL
- 元数据账户：约0.01 SOL

总计：大约0.015-0.02 SOL（随租金价格而变化）。

### Anchor和原生Solana Rust有什么区别？

Anchor是一个通过以下方式简化Solana开发的框架：
- 自动生成账户序列化/反序列化
- 通过宏提供声明式账户验证
- 自动生成TypeScript客户端
- 处理PDA和CPI等常见模式

原生Solana Rust需要手动处理所有这些问题。

## 术语表

| 术语 | 定义 |
|------|------------|
| **SPL Token** | Solana Program Library代币标准，等同于ERC-20 |
| **Mint** | 定义代币并可以创建新供应量的账户 |
| **Token Account** | 持有特定代币余额的账户 |
| **ATA** | 关联代币账户 - 钱包的确定性代币账户 |
| **PDA** | 程序派生地址 - 从种子派生的、由程序拥有的地址 |
| **CPI** | 跨程序调用 - 从一个Solana程序调用另一个程序 |
| **Anchor** | 用于构建Solana程序的Rust框架 |
| **Metaplex** | Solana上NFT和代币元数据的协议 |
| **IDL** | 接口定义语言 - 描述程序的接口 |
| **Rent** | 在Solana上保持账户存活所需的SOL |
