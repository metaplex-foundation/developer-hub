---
title: Rustを使用したはじめに
metaTitle: Rust SDK | Token Metadata
description: Token Metadata Rust SDKを使用してNFTの開発を始めましょう
---

Rust開発者の場合、Token Metadataプログラムとやり取りするためにRustクライアントSDKも使用できます。MetaplexはRust専用のクライアントクレートを提供しており、これは依存関係が最小限の軽量なクレートです。

はじめるために、プロジェクトに`mpl-token-metadata`依存関係を追加する必要があります。プロジェクトのルートフォルダのターミナルから：
```
cargo add mpl-token-metadata
```
これにより、プロジェクトの依存関係リストにクレートの最新バージョンが追加されます。

{% callout %}

1.16より前のsolana-programバージョンを使用している場合、最初にプロジェクトに`solana-program`依存関係を追加してから`mpl-token-metadata`を追加してください。これにより、`borsh`クレートのコピーが1つだけ確実にあるようになります。

{% /callout %}

## 🧱 構造

クライアントSDKはいくつかのモジュールに分かれています：

- `accounts`: プログラムのアカウントを表す構造体
- `errors`: プログラムエラーを表す列挙型
- `instructions`: クライアント（オフチェーン）とプログラム（オンチェーン）からの命令作成を促進する構造体、および命令引数
- `types`: プログラムで使用されるタイプを表す構造体

探索を始める良い出発点は`instructions`モジュールで、Token Metadataとやり取りするための命令を作成するヘルパーが含まれています。これらは柔軟で使いやすいように設計されています。命令が追加のタイプを必要とする場合、これらは`types`モジュールから参照されます。Token Metadataアカウントの内容をデシリアライズしたい場合、`accounts`モジュールには、その内容をデシリアライズするヘルパーメソッドを持つ各アカウントを表す構造体があります。

## 🏗️ インストラクションビルダー

クライアントSDKの主な機能の1つは、命令の作成を促進することです。オフチェーンまたはオンチェーンコードを書いているかによって、2つの_タイプ_の命令ビルダーがあり、両方ともアカウントを名前で渡すことやオプションの位置引数をサポートしています。

### クライアント（オフチェーン）

これらはオフチェーンクライアントコードで使用することを意図しています。各命令は構造体で表され、そのフィールドは必要なアカウントの`Pubkey`です。

{% totem %}
{% totem-prose %}

`CreateV1`命令構造体：

{% /totem-prose %}

```rust
pub struct CreateV1 {
    /// ['metadata', program id, mint id]のpdaとしてのアドレスを持つ
    /// 未割り当てメタデータアカウント
    pub metadata: Pubkey,

    /// ['metadata', program id, mint, 'edition']のpdaとしてのアドレスを持つ
    /// 未割り当てエディションアカウント
    pub master_edition: Option<Pubkey>,

    /// トークンアセットのミント
    pub mint: (Pubkey, bool),

    /// ミント権限
    pub authority: Pubkey,

    /// 支払者
    pub payer: Pubkey,

    /// メタデータアカウントの更新権限
    pub update_authority: (Pubkey, bool),

    /// システムプログラム
    pub system_program: Pubkey,

    /// Instructions sysvarアカウント
    pub sysvar_instructions: Pubkey,

    /// SPL Tokenプログラム
    pub spl_token_program: Pubkey,
}
```

{% /totem %}

命令アカウントフィールドを入力した後、`instruction(...)`メソッドを使用して対応するSolana `Instruction`を生成できます：

{% totem %}
{% totem-prose %}

`CreateV1`用の`Instruction`を作成：

{% /totem-prose %}

```rust
// 命令引数
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

// 命令アカウント
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

// 命令を作成
let create_ix = create_ix.instruction(args);
```

{% /totem %}

この時点で、`create_ix`はトランザクションに追加して処理のために送信できる`Instruction`です。

上記の例では、オプションの引数に値を提供する必要がない場合でも、`None`を指定する必要があることに気付いたと思います。命令の作成をさらに促進するために、`*Builder` _コンパニオン_構造体を使用できます。

{% totem %}
{% totem-prose %}

`CreateV1Builder`を使用して`Instruction`を作成：

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

最終結果は、トランザクションに追加して処理のために送信される同じ`create_ix`命令です。

### クロスプログラム呼び出し（オンチェーン）

Token Metadataとやり取りする必要があるプログラムを書いている場合、オンチェーンクロスプログラム呼び出し（CPI）ビルダーを使用できます。これらはオフチェーンビルダーと同様に機能しますが、主な違いは`Pubkey`の代わりに`AccountInfo`参照を期待することです。

{% totem %}
{% totem-prose %}

`TransferV1Cpi`命令構造体：

{% /totem-prose %}

```rust
pub struct TransferV1Cpi<'a> {
    /// 呼び出すプログラム。
    pub __program: &'a AccountInfo<'a>,

    /// トークンアカウント
    pub token: &'a AccountInfo<'a>,

    /// トークンアカウントの所有者
    pub token_owner: &'a AccountInfo<'a>,

    /// 送り先トークンアカウント
    pub destination_token: &'a AccountInfo<'a>,

    /// 送り先トークンアカウントの所有者
    pub destination_owner: &'a AccountInfo<'a>,

    /// トークンアセットのミント
    pub mint: &'a AccountInfo<'a>,

    /// メタデータ（['metadata', program id, mint id]のpda）
    pub metadata: &'a AccountInfo<'a>,

    /// トークンアセットのエディション
    pub edition: Option<&'a AccountInfo<'a>>,

    /// 所有者トークンレコードアカウント
    pub token_record: Option<&'a AccountInfo<'a>>,

    /// 送り先トークンレコードアカウント
    pub destination_token_record: Option<&'a AccountInfo<'a>>,

    /// 転送権限（トークン所有者またはデリゲート）
    pub authority: &'a AccountInfo<'a>,

    /// 支払者
    pub payer: &'a AccountInfo<'a>,

    /// システムプログラム
    pub system_program: &'a AccountInfo<'a>,

    /// Instructions sysvarアカウント
    pub sysvar_instructions: &'a AccountInfo<'a>,

    /// SPL Tokenプログラム
    pub spl_token_program: &'a AccountInfo<'a>,

    /// SPL Associated Token Accountプログラム
    pub spl_ata_program: &'a AccountInfo<'a>,

    /// Token Authorization Rulesプログラム
    pub authorization_rules_program: Option<&'a AccountInfo<'a>>,

    /// Token Authorization Rulesアカウント
    pub authorization_rules: Option<&'a AccountInfo<'a>>,

    /// 命令の引数。
    pub __args: TransferV1InstructionArgs,
}
```

{% /totem %}

命令構造体は3つの異なる情報を必要とします：(1) CPIするプログラム – `__program`フィールド；(2) `AccountInfo`への参照で表されるアカウントの変数リスト；(3) 命令引数 – `__args`フィールド。構造体の作成を簡単にするために、`new(...)`ファクトリメソッドがあります。プログラム、命令アカウント、引数フィールドを入力した後、`invoke()`または`invoke_signed(...)`メソッドを使用してCPIを実行できます。

{% totem %}
{% totem-prose %}

`TransferV1Cpi`命令の呼び出し：

{% /totem-prose %}

```rust
// 命令を作成
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

// CPIを実行
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

値を渡さないオプションのアカウント/引数ごとに、それでも`None`に設定する必要があることに（再び）気付いたと思います。オフチェーン命令と同様に、CPI命令には_コンパニオン_ `*Builder`構造体があります。

{% totem %}
{% totem-prose %}

`TransferV1CpiBuilder`を使用した`TransferV1Cpi`命令の呼び出し：

{% /totem-prose %}

```rust
// 命令を作成
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

// CPIを実行
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

## 🔎 PDAヘルパー

SDKのもう1つの便利なヘルパーセットはPDAルックアップです。PDAを表すアカウントタイプ（例：`Metadata`）には、PDA `Pubkey`を見つける/作成するための関連関数があります。

{% totem %}
{% totem-prose %}

`find_pda`および`create_pda`ヘルパーメソッドの実装：

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

`find_pda`メソッドは通常、オフチェーンクライアントで使用されます：

```rust
let (metadata_pubkey, _) = Metadata::find_pda(mint);
```
{% /totem-prose %}
{% totem-prose %}

`create_pda`メソッドは`find_pda`と比較してコンピュートユニットを節約できるため、オンチェーンで使用することが推奨されますが、PDA派生の生成に使用された`bump`を保存する必要があります：

```rust
let metadata_pubkey = Metadata::create_pda(mint, bump)?;
```

{% /totem-prose %}
{% /totem %}

## 🔗 役立つリンク

- [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/clients/rust)
- [クレートページ](https://crates.io/crates/mpl-token-metadata)
- [APIリファレンス](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/index.html)