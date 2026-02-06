---
title: Shank 宏参考
metaTitle: Shank 宏参考 | Metaplex 开发者中心
description: Solana 程序中使用的 Shank 派生宏和属性的完整参考
---

Shank 提供了几个用于注解 Solana Rust 程序以进行 IDL 提取的宏：

## ShankAccount

注解一个 Shank 将视为包含可反/序列化数据的账户的*结构体*。

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct Metadata {
    pub update_authority: Pubkey,
    pub mint: Pubkey,
    pub primary_sale_happened: bool,
}
```

### 字段属性

#### `#[idl_type(...)]` 属性

此属性允许在生成 IDL 时覆盖 Shank 解释字段类型的方式。适用于：

1. 具有应被视为其内部类型的包装类型的字段
2. 将枚举值存储为原始类型的字段
3. 需要更简单表示的复杂类型字段

支持两种格式：

- 字符串字面量：`#[idl_type("TypeName")]`
- 直接类型：`#[idl_type(TypeName)]`

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct MyAccount {
    // 存储为 u8 但表示枚举的字段
    #[idl_type("MyEnum")]
    pub enum_as_byte: u8,

    // 具有包装类型但被视为更简单类型的字段
    #[idl_type("u64")]
    pub wrapped_u64: CustomU64Wrapper,
}
```

#### `#[padding]` 属性

表示字段用于填充，应在 IDL 中标记为此类。

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct PaddedAccount {
    pub active_field: u64,

    #[padding]
    pub unused_space: [u8; 32],

    pub another_field: String,
}
```

**注意**：*ShankAccount* 结构体的字段可以引用其他类型，只要它们使用 `BorshSerialize`、`BorshDeserialize` 或 `ShankType` 注解即可。

## ShankInstruction

注解程序的*指令*枚举以包含 `#[account]` 属性。

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
#[rustfmt::skip]
pub enum MyProgramInstruction {
    /// 使用给定名称创建新账户
    #[account(0, writable, signer, name="user", desc="User account")]
    #[account(1, writable, name="account", desc="Account to create")]
    #[account(2, name="system_program", desc="System program")]
    CreateAccount {
        name: String,
        space: u64,
    },

    /// 更新现有账户
    #[account(0, writable, signer, name="authority", desc="Account authority")]
    #[account(1, writable, name="account", desc="Account to update")]
    UpdateAccount {
        new_name: String,
    },
}
```

### `#[account]` 属性

为每个指令变体配置账户。属性遵循以下格式：

```rust
#[account(index, mutability?, signer?, name="account_name", desc="Account description")]
```

其中：

- `index`: 账户在账户数组中的位置（从 0 开始）
- `mutability?`: 可选。如果账户将被修改，使用 `writable`
- `signer?`: 可选。如果账户必须签署交易，使用 `signer`
- `name="account_name"`: 必需。账户的名称
- `desc="Account description"`: 可选。账户用途的描述

### 账户属性示例

```rust
// 只读账户
#[account(0, name="mint", desc="Mint account")]

// 可写账户
#[account(1, writable, name="token_account", desc="Token account to modify")]

// 签名者账户
#[account(2, signer, name="owner", desc="Account owner")]

// 可写签名者账户
#[account(3, writable, signer, name="authority", desc="Program authority")]

// 可选账户
#[account(4, optional, name="delegate", desc="Optional delegate account")]
```

## ShankType

标记在账户或指令中用作自定义类型的具有可序列化数据的结构体或枚举。

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

为每个注解的指令生成指令构建器，创建简化指令构造的构建器模式实现。

```rust
#[derive(Debug, Clone, ShankInstruction, ShankBuilder, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    CreateAccount { name: String, space: u64 },
}
```

这会生成允许流畅指令创建的构建器方法。

## ShankContext

为指令创建账户结构体，生成与 Anchor 框架模式集成的程序指令上下文结构。

```rust
#[derive(Debug, Clone, ShankInstruction, ShankContext, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    #[account(0, writable, signer, name="payer")]
    #[account(1, writable, name="account")]
    CreateAccount { name: String },
}
```

这会生成与指令中定义的账户要求匹配的上下文结构体。

## 最佳实践

1. **始终在 `#[account]` 属性中使用描述性名称**
2. **包含描述** 以获得更好的文档
3. **谨慎使用 `#[idl_type()]`** - 仅在需要类型覆盖时使用
4. **适当标记填充字段** 使用 `#[padding]`
5. **确保所有引用的类型** 都使用 Borsh 特征正确注解
6. **分组相关宏** 当它们一起工作时（例如 `ShankInstruction` + `ShankBuilder`）

## 常见模式

### 带自定义类型的账户

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct TokenAccount {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub state: TokenState, // 引用 ShankType
}

#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub enum TokenState {
    Uninitialized,
    Initialized,
    Frozen,
}
```

### 完整指令定义

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
#[rustfmt::skip]
pub enum TokenInstruction {
    /// 在账户之间转移代币
    #[account(0, writable, name="source", desc="Source token account")]
    #[account(1, writable, name="destination", desc="Destination token account")]
    #[account(2, signer, name="owner", desc="Owner of source account")]
    Transfer {
        amount: u64,
    },
}
```

此参考涵盖了所有必要的 Shank 宏及其使用模式，以便从 Solana 程序有效生成 IDL。
