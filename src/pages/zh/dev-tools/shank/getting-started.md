---
title: Shank 入门
metaTitle: Shank 入门指南 | Metaplex 开发者工具
description: 学习如何安装和设置 Shank 从 Rust Solana 程序中提取 IDL
---

本指南将引导您设置 Shank 并从 Rust Solana 程序中提取您的第一个 IDL。

## 前提条件

在开始使用 Shank 之前，请确保您具备：

- 已安装 Rust 工具链（1.56.0 或更高版本）
- Cargo 包管理器
- 用 Rust 编写的 Solana 程序
- 对 Solana 程序开发有基本了解

## 安装

### 安装 Shank CLI

使用 Cargo 安装 Shank 命令行工具：

```bash
cargo install shank-cli
```

验证安装：

```bash
shank --version
```

### 将 Shank 添加到您的项目

在您的 `Cargo.toml` 中添加 Shank 作为依赖项：

```toml
[dependencies]
shank = "0.4"

[build-dependencies]
shank-cli = "0.4"
```

## 您的第一个 Shank 项目

### 1. 注解您的程序

首先将 Shank 派生宏添加到您现有的 Solana 程序：

```rust
use shank::ShankInstruction;

#[derive(ShankInstruction)]
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

### 2. 注解账户结构

将 `ShankAccount` 添加到您的账户结构体：

```rust
use shank::ShankAccount;

#[derive(ShankAccount)]
pub struct UserAccount {
    pub name: String,
    pub created_at: i64,
    pub authority: Pubkey,
}
```

### 3. 提取 IDL

运行 Shank CLI 提取 IDL：

```bash
shank idl --out-dir ./target/idl --crate-root ./
```

这将在 `./target/idl` 目录中生成 IDL 文件（例如 `my_program.json`）。

### 4. 验证输出

检查生成的 IDL 文件：

```bash
cat ./target/idl/my_program.json
```

您应该看到一个包含程序指令、账户和类型的 JSON 结构。

## 项目结构

典型的启用 Shank 的项目结构如下：

```
my-solana-program/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── instruction.rs    # 包含 ShankInstruction 枚举
│   ├── state.rs         # 包含 ShankAccount 结构体
│   └── processor.rs     # 程序逻辑
├── target/
│   └── idl/
│       └── my_program.json  # 生成的 IDL
└── sdk/                 # 生成的 TypeScript SDK（可选）
    └── ...
```

## 核心组件

Shank 由几个相互关联的 crate 组成：

- **shank**: 提供宏注解的顶级 crate
- **shank-cli**: 用于 IDL 提取的命令行工具
- **shank-macro**: 代码生成的派生宏
- **shank-idl**: 处理文件并将注解转换为 IDL
- **shank-render**: 生成 Rust 实现块

## 主要特性

### 派生宏

Shank 提供五个用于注解 Solana 程序代码的基本派生宏：

1. **`ShankAccount`**: 注解表示具有可序列化数据的账户的结构体
   - 支持用于类型覆盖的 `#[idl_type()]`
   - 支持用于填充字段的 `#[padding]`
   - 与 Borsh 序列化配合使用

2. **`ShankBuilder`**: 为每个注解的指令生成指令构建器
   - 创建构建器模式实现
   - 简化指令构造

3. **`ShankContext`**: 为指令创建账户结构体
   - 为程序指令生成上下文结构
   - 与 Anchor 框架模式集成

4. **`ShankInstruction`**: 注解程序的指令枚举
   - 使用 `#[account()]` 属性指定账户要求
   - 支持账户可变性、签名者要求和描述
   - 生成全面的指令元数据

5. **`ShankType`**: 标记具有可序列化数据的结构体或枚举
   - 用于账户或指令中引用的自定义类型
   - 确保复杂数据结构的正确 IDL 生成

### 与 Metaplex 生态系统集成

Shank 与其他 Metaplex 工具无缝集成：

- **[Kinobi](/zh/dev-tools/umi/kinobi)**: 使用 Shank JS 库进行 IDL 生成和客户端创建
- **[Solita](/zh/legacy-documentation/developer-tools/solita)**: 从 Shank 提取的 IDL 生成 TypeScript SDK

## CLI 使用

安装 Shank 并注解程序后，使用以下命令提取 IDL：

```bash
# 基本 IDL 提取
shank idl --out-dir ./target/idl --crate-root ./

# 为特定 crate 提取 IDL
shank idl --out-dir ./idl --crate-root ./my-program

# 使用自定义程序 ID 生成 IDL
shank idl --out-dir ./idl --crate-root ./ --program-id MyProgram111111111111111111111111111111
```

## 后续步骤

现在您已设置好 Shank 并生成 IDL 文件，您可以：

1. **[宏参考](/zh/dev-tools/shank/macros)**: 所有 Shank 宏和属性的完整参考
2. **[与 Kinobi 集成](/zh/dev-tools/umi/kinobi)**: 生成与 Umi 兼容的现代 TypeScript SDK（推荐）
3. **[Solita](https://github.com/metaplex-foundation/solita)**: 生成与 web3.js 兼容的传统 TypeScript SDK

## 故障排除

### 常见问题

**IDL 生成因解析错误失败：**

- 确保您的 Rust 代码编译成功
- 检查所有派生宏是否正确导入
- 验证账户注解格式正确

**生成的 IDL 中缺少账户：**

- 确保结构体使用 `#[derive(ShankAccount)]` 注解
- 检查结构体是否为公开且可访问

**构建脚本错误：**

- 确保 `shank-cli` 已安装并在 PATH 中可用
- 验证构建脚本权限和执行权限

如需更多帮助，请访问我们的 [GitHub 仓库](https://github.com/metaplex-foundation/shank) 或加入 [Metaplex Discord](https://discord.gg/metaplex)。
