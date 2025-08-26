---
title: Shankマクロリファレンス
metaTitle: Shankマクロリファレンス | Metaplex Developer Hub
description: Solanaプログラムで使用されるShank派生マクロと属性の完全なリファレンス
---

Shankは、IDL抽出のためにSolana Rustプログラムに注釈を付けるために使用される複数のマクロを提供します：

## ShankAccount

shankがデ/シリアライゼーション可能なデータを含むアカウントとみなす*構造体*に注釈を付けます。

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct Metadata {
    pub update_authority: Pubkey,
    pub mint: Pubkey,
    pub primary_sale_happened: bool,
}
```

### フィールド属性

#### `#[idl_type(...)]`属性

この属性により、IDL生成時にShankがフィールドの型をどう解釈するかをオーバーライドできます。以下の場合に便利です：

1. 内部型として扱われるべきラッパー型を持つフィールド
2. プリミティブとして列挙値を格納するフィールド
3. より単純な表現が必要な複雑な型を持つフィールド

2つのフォーマットをサポートします：
- 文字列リテラル：`#[idl_type("TypeName")]`
- 直接型：`#[idl_type(TypeName)]`

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct MyAccount {
    // 列挙型を表すu8として格納されるフィールド
    #[idl_type("MyEnum")]
    pub enum_as_byte: u8,

    // より単純な型として扱われるラッパー型を持つフィールド
    #[idl_type("u64")]
    pub wrapped_u64: CustomU64Wrapper,
}
```

#### `#[padding]`属性

フィールドがパディングに使用され、IDLでそのようにマークされるべきことを示します。

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct PaddedAccount {
    pub active_field: u64,
    
    #[padding]
    pub unused_space: [u8; 32],
    
    pub another_field: String,
}
```

**注意**: *ShankAccount*構造体のフィールドは、`BorshSerialize`、`BorshDeserialize`、または`ShankType`で注釈されている限り、他の型を参照できます。

## ShankInstruction

プログラムの*Instruction* `Enum`に注釈を付けて`#[account]`属性を含めます。

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
#[rustfmt::skip]
pub enum MyProgramInstruction {
    /// 指定された名前で新しいアカウントを作成
    #[account(0, writable, signer, name="user", desc="ユーザーアカウント")]
    #[account(1, writable, name="account", desc="作成するアカウント")]
    #[account(2, name="system_program", desc="システムプログラム")]
    CreateAccount {
        name: String,
        space: u64,
    },
    
    /// 既存のアカウントを更新
    #[account(0, writable, signer, name="authority", desc="アカウント権限")]
    #[account(1, writable, name="account", desc="更新するアカウント")]
    UpdateAccount {
        new_name: String,
    },
}
```

### `#[account]`属性

各インストラクションバリアントのアカウントを設定します。属性は次の形式に従います：

```rust
#[account(index, mutability?, signer?, name="account_name", desc="Account description")]
```

ここで：
- `index`: アカウント配列内のアカウントの位置（0ベース）
- `mutability?`: オプション。アカウントが変更される場合は`writable`を使用
- `signer?`: オプション。アカウントがトランザクションに署名する必要がある場合は`signer`を使用
- `name="account_name"`: 必須。アカウントの名前
- `desc="Account description"`: オプション。アカウントの目的の説明

### アカウント属性の例

```rust
// 読み取り専用アカウント
#[account(0, name="mint", desc="ミントアカウント")]

// 書き込み可能アカウント
#[account(1, writable, name="token_account", desc="変更するトークンアカウント")]

// 署名者アカウント
#[account(2, signer, name="owner", desc="アカウント所有者")]

// 書き込み可能署名者アカウント
#[account(3, writable, signer, name="authority", desc="プログラム権限")]

// オプションアカウント
#[account(4, optional, name="delegate", desc="オプション委任アカウント")]
```

## ShankType

アカウントやインストラクションでカスタム型として使用されるシリアライゼーション可能なデータを持つ構造体や列挙型をマークします。

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub enum TokenState {
    Uninitialized,
    Initialized,
    Frozen,
}

#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    pub share: u8,
}
```

## ShankBuilder

各注釈付きインストラクション用のインストラクションビルダーを生成し、インストラクション構築を簡素化するビルダーパターン実装を作成します。

```rust
#[derive(Debug, Clone, ShankInstruction, ShankBuilder, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    CreateAccount { name: String, space: u64 },
}
```

これにより、流暢なインストラクション作成を可能にするビルダーメソッドが生成されます。

## ShankContext

インストラクション用のアカウント構造体を作成し、Anchorフレームワークパターンと統合するプログラムインストラクション用のコンテキスト構造を生成します。

```rust
#[derive(Debug, Clone, ShankInstruction, ShankContext, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    #[account(0, writable, signer, name="payer")]
    #[account(1, writable, name="account")]
    CreateAccount { name: String },
}
```

これにより、インストラクションで定義されたアカウント要件に一致するコンテキスト構造体が生成されます。

## ベストプラクティス

1. **`#[account]`属性では常に説明的な名前を使用**
2. **より良いドキュメンテーションのため説明を含める**
3. **`#[idl_type()]`は慎重に使用** - 型オーバーライドが必要な場合のみ
4. **パディングフィールドを適切にマーク** `#[padding]`で
5. **参照されるすべての型が適切に注釈されている**ことをBorsh traitで確認
6. **関連するマクロをグループ化** 一緒に動作する場合（例：`ShankInstruction` + `ShankBuilder`）

## 一般的なパターン

### カスタム型を持つアカウント

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct TokenAccount {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub state: TokenState, // ShankTypeを参照
}

#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub enum TokenState {
    Uninitialized,
    Initialized,
    Frozen,
}
```

### 完全なインストラクション定義

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
#[rustfmt::skip]
pub enum TokenInstruction {
    /// アカウント間でトークンを転送
    #[account(0, writable, name="source", desc="送信元トークンアカウント")]
    #[account(1, writable, name="destination", desc="送信先トークンアカウント")]
    #[account(2, signer, name="owner", desc="送信元アカウントの所有者")]
    Transfer {
        amount: u64,
    },
}
```

このリファレンスは、Solanaプログラムから効果的にIDLを生成するためのすべての重要なShankマクロと使用パターンをカバーしています。