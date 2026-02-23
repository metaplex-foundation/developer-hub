---
title: RustとAnchorでトークンを作成する
metaTitle: Anchorでトークンを作成する | Solanaトークン
description: Rust、Anchorフレームワーク、およびMetaplex Token Metadataを使用して、Solana上でメタデータ付きのSPLトークンを作成する方法を学びます
created: '01-18-2026'
updated: null
---

このガイドでは、**Rust**、**Anchor**フレームワーク、および**Metaplex Token Metadata**プログラムへのCPIを使用して、Solana上でメタデータ付きのファンジブルトークンを作成する方法を説明します。 {% .lead %}

{% callout title="構築するもの" %}

以下を実行する単一のAnchor命令：
- 新しいSPLトークンミントを作成
- 支払者用のAssociated Token Accountを作成
- 名前、シンボル、URIを持つメタデータアカウントを作成
- 支払者に初期トークン供給量をミント

{% /callout %}

## 概要

**Anchor (Rust)** を使用してSolana上で**ファンジブルSPLトークン**を作成し、初期供給量をミントし、CPIを介して**Metaplex Token Metadata**（名前、シンボル、URI）を付与します。

- 1つの命令で：**mint + ATA + metadata**を初期化し、供給量をミント
- 使用ツール：SPL Token + Metaplex Token Metadata CPI
- テスト済み：Anchor 0.32.1、Solana Agave 3.1.6
- ファンジブルトークン専用。NFTにはMaster Edition + `decimals=0` + `supply=1`が必要

## 対象範囲外

Token-2022拡張機能、秘匿転送、権限の失効、メタデータの更新、完全なNFTフロー、メインネットデプロイ。

## クイックスタート

**目次：** [プログラム](#the-program) · [テストクライアント](#the-client) · [よくあるエラー](#common-errors)

1. `anchor init anchor-spl-token`
2. `Cargo.toml`に`metadata`フィーチャー付きの`anchor-spl`を追加
3. `Anchor.toml`でローカルネット用にToken Metadataプログラムをクローン
4. プログラムコードを貼り付けて`anchor test`を実行

## 前提条件

- **Rust** がインストール済み（[rustup.rs](https://rustup.rs)）
- **Solana CLI** がインストール済み（[docs.solana.com](https://docs.solana.com/cli/install-solana-cli-tools)）
- **Anchor CLI** がインストール済み（`cargo install --git https://github.com/coral-xyz/anchor anchor-cli`）
- テスト実行用の **Node.js** と **Yarn**
- トランザクション手数料用のSOLを持つSolanaウォレット

## テスト済み構成

このガイドは以下のバージョンでテストされています：

| ツール | バージョン |
|------|---------|
| Anchor CLI | 0.32.1 |
| Solana CLI | 3.1.6 (Agave) |
| Rust | 1.92.0 |
| Node.js | 22.15.1 |
| Yarn | 1.22.x |

## 初期セットアップ

新しいAnchorプロジェクトを初期化します：

```bash
anchor init anchor-spl-token
cd anchor-spl-token
```

### Cargo.tomlの設定

`programs/anchor-spl-token/Cargo.toml`を更新します：

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

`idl-build`フィーチャーには`anchor-spl/idl-build`を**必ず**含めてください。含めない場合、`no function or associated item named 'create_type' found for struct 'anchor_spl::token::Mint'`のようなエラーが発生します。

{% /callout %}

### Anchor.tomlの設定

ローカルテスト用にToken Metadataプログラムをクローンするために`Anchor.toml`を更新します：

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

- `bind_address = "127.0.0.1"`はAgave 3.xバリデータで必須です（0.0.0.0を使用するとパニックが発生します）
- `[[test.validator.clone]]`セクションはMetaplex Token Metadataプログラムをメインネットからクローンします

{% /callout %}

### package.jsonの設定

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

## プログラム

### インポートとテンプレート

ここでは、すべてのインポートを定義し、`programs/anchor-spl-token/src/lib.rs`にAccountの構造体と命令のテンプレートを作成します：

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

### アカウント構造体の作成

`CreateToken`構造体は、命令に必要なすべてのアカウントを定義し、必要な制約を適用します：

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

**アカウントの種類：**
- `#[instruction(...)]`属性により、アカウント制約内で命令の引数（`decimals`など）を使用できます
- `mint`はAnchorの`init`制約と`mint::decimals = decimals`を使用して、指定された小数点以下桁数でトークンミントを作成します
- `token_account`は`associated_token::`ヘルパーを使用してAssociated Token Accountとして初期化されます
- `metadata_account`は`seeds::program`を使用して、PDAがToken Metadataプログラムに属することを検証します

### 命令の作成

`create_token`関数は、CPIを介してメタデータアカウントを作成し、初期トークン供給量をミントします：

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

この関数は2つのCross-Program Invocation（CPI）を実行します：
1. `create_metadata_accounts_v3`（14〜40行目）- 名前、シンボル、URIを持つメタデータアカウントを作成・初期化
2. `mint_to`（43〜54行目）- 指定された量を支払者のトークンアカウントにミント

## テストクライアント

テストの前に、プログラムをビルドします：

```bash
anchor build
```

プログラムIDを取得し、`lib.rs`と`Anchor.toml`の両方で更新します：

```bash
solana address -k target/deploy/anchor_spl_token-keypair.json
```

次に再ビルドしてデプロイします：

```bash
anchor build
anchor deploy
```

### テストの作成

テストファイルを`tests/anchor-spl-token.ts`に作成します：

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

**要点：**
- メタデータアカウントのPDAはシード`["metadata", TOKEN_METADATA_PROGRAM_ID, mint_pubkey]`を使用して導出されます（29〜36行目）
- Associated Token Accountは`getAssociatedTokenAddressSync`を使用して導出されます（39〜42行目）
- ミントキーペアは初期化されるため、署名者として渡す必要があります
- `accountsPartial`を使用してアカウントを指定します（Anchor 0.32+の構文）
- 大きな数値（小数点以下桁数を含むトークン量）には`BN`を使用します
- `tokenDecimals`は命令に渡され、ミント量の計算に使用されます

### テストの実行

```bash
yarn install
anchor test
```

期待される出力：

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

## メタデータJSONフォーマット

`uri`フィールドには、トークンのオフチェーンメタデータを含むJSONファイルを指定する必要があります：

```json {% title="token-metadata.json" %}
{
  "name": "My Token",
  "symbol": "MYTKN",
  "description": "A description of my token",
  "image": "https://example.com/token-image.png"
}
```

このJSONファイルをArweaveやIPFSなどの永続ストレージソリューションにホストしてください。

## よくあるエラー

### `no function or associated item named 'create_type' found`

Cargo.tomlの`idl-build`フィーチャーに`"anchor-spl/idl-build"`を追加してください：

```toml
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
```

### `Program account is not executable`

Anchor.tomlでToken Metadataプログラムをクローンしてください：

```toml
[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
```

### `UnspecifiedIpAddr(0.0.0.0)` / バリデータパニック

Anchor.tomlの`[test.validator]`に`bind_address = "127.0.0.1"`を追加してください。

## 注意事項

- `amount`パラメータは**基本単位**（小数点以下桁数を含む）です。9桁の小数を持つ100万トークンの場合、`1_000_000 * 10^9`を渡してください。
- この例では**ミント権限**と**フリーズ権限**を支払者に保持しています。本番環境のトークンでは、初回ミント後にこれらの権限を失効または移転することが一般的です。
- メタデータアカウントは**変更可能**（`is_mutable = true`）です。不変のメタデータが必要な場合は`false`に設定してください。

## 次のステップ

- **Devnetにデプロイ：** Anchor.tomlで`cluster = "devnet"`に変更し、`anchor deploy`を実行
- **NFTを作成：** 非ファンジブルトークンには`decimals = 0`と`supply = 1`を設定
- **トークン拡張機能を追加：** 転送手数料、利息付きトークンなどについて[SPL Token 2022](https://spl.solana.com/token-2022)を参照
- **Token Metadataについて詳しく学ぶ：** [Token Metadataドキュメント](/smart-contracts/token-metadata)を参照

## クイックリファレンス

### 主要プログラムID

| プログラム | アドレス |
|---------|---------|
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Associated Token Program | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` |
| Token Metadata Program | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| System Program | `11111111111111111111111111111111` |

### メタデータPDAシード

{% dialect-switcher title="メタデータPDAの導出" %}
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

### 最小限の依存関係

```toml {% title="Cargo.toml" %}
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token", "metadata", "associated_token"] }
```

## FAQ

{% callout title="用語説明" %}
- **ファンジブルトークン：** `decimals >= 0`、供給量の上限なし
- **NFT：** `decimals = 0`、`supply = 1`、さらにMaster Editionアカウントが必要
- **Token Metadata：** ファンジブルトークンとNFTの両方に使用されるMetaplexプログラム
- **SPL：** Solana Program Library、標準トークンインターフェース
{% /callout %}

### SPLトークンとは何ですか？

SPLトークンは、EthereumにおけるERC-20トークンに相当するSolanaのトークンです。SPLはSolana Program Libraryの略です。SPLトークンは通貨、ガバナンストークン、ステーブルコイン、またはSolana上のその他のファンジブル資産を表現できるファンジブルトークンです。

### トークンミントとトークンアカウントの違いは何ですか？

- **トークンミント：** トークンを作成するファクトリーです。トークンのプロパティ（小数点以下桁数、供給量、権限）を定義します。トークンの種類ごとに1つのミントがあります。
- **トークンアカウント：** トークンを保持するウォレットです。各ユーザーは保持したいトークンの種類ごとに独自のトークンアカウントが必要です。

### Associated Token Account (ATA) とは何ですか？

Associated Token Accountは、特定のウォレットとミントに対して決定論的に導出されるトークンアカウントです。ランダムなトークンアカウントを作成する代わりに、ATAは標準的な導出方法を使用するため、誰でも任意のウォレットのトークンアカウントアドレスを計算できます。これがトークンアカウントを扱う推奨方法です。

### Metaplex Token Metadataとは何ですか？

Metaplex Token Metadataは、SPLトークンにメタデータ（名前、シンボル、画像URI）を付与するプログラムです。これがなければ、トークンは匿名のミントに過ぎません。メタデータはミントに関連付けられたProgram Derived Address (PDA) に保存されます。

### ローカルテストでToken Metadataプログラムをクローンする理由は？

ローカルのSolanaテストバリデータはクリーンな状態で起動し、コアSolanaプログラム以外のプログラムは含まれていません。Metaplex Token Metadataはメインネットにデプロイされた別のプログラムであるため、ローカルで使用するにはクローンする必要があります。

### このコードでNFTを作成できますか？

はい、以下の変更が必要です：
- `mint::decimals = 0`を設定（NFTは分割不可能）
- 正確に1トークンをミント
- ミント後にミント権限を削除（追加作成を防止）
- Master Editionアカウントを追加（Metaplex NFT標準用）

### Solanaでトークンを作成するのにいくらかかりますか？

トークンの作成には3つのアカウントのレント（賃料）が必要です：
- ミントアカウント：約0.00145 SOL
- トークンアカウント：約0.00203 SOL
- メタデータアカウント：約0.01 SOL

合計：約0.015〜0.02 SOL（レント価格により変動）。

### AnchorとネイティブSolana Rustの違いは何ですか？

Anchorは以下によりSolana開発を簡素化するフレームワークです：
- アカウントのシリアライゼーション/デシリアライゼーションの自動生成
- マクロによる宣言的なアカウントバリデーション
- TypeScriptクライアントの自動生成
- PDAやCPIなどの一般的なパターンの処理

ネイティブSolana Rustでは、これらすべてを手動で処理する必要があります。

## 用語集

| 用語 | 定義 |
|------|------------|
| **SPL Token** | Solana Program Libraryのトークン標準、ERC-20に相当 |
| **Mint** | トークンを定義し、新しい供給量を作成できるアカウント |
| **Token Account** | 特定のトークンの残高を保持するアカウント |
| **ATA** | Associated Token Account - ウォレット用の決定論的トークンアカウント |
| **PDA** | Program Derived Address - シードから導出される、プログラムが所有するアドレス |
| **CPI** | Cross-Program Invocation - あるSolanaプログラムから別のプログラムを呼び出すこと |
| **Anchor** | Solanaプログラムを構築するためのRustフレームワーク |
| **Metaplex** | Solana上のNFTとトークンメタデータのためのプロトコル |
| **IDL** | Interface Definition Language - プログラムのインターフェースを記述するもの |
| **Rent** | Solana上でアカウントを維持するために必要なSOL |
