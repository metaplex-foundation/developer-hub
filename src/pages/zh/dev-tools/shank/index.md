---
title: Shank
metaTitle: Shank | Metaplex 开发者中心
description: 使用属性宏从 Rust Solana 程序代码中提取 IDL
---

Shank 是一组 Rust crate，旨在从使用 Shank 属性宏注解的 Solana 程序代码中提取接口定义语言（IDL）。提取的 IDL 随后可用于生成 TypeScript SDK 并促进与 Solana 程序的交互。

Shank 通过自动化生成 IDL 文件来简化 Solana 程序的开发工作流，这些文件作为您的 Rust 程序代码和客户端 SDK 之间的桥梁。

## 快速入门

1. 安装 Shank CLI：`cargo install shank-cli`
2. 将 Shank 添加到您的项目：`shank = "0.4"`
3. 使用 `ShankAccount` 和 `ShankInstruction` 宏注解您的程序
4. 提取 IDL：`shank idl --out-dir ./target/idl --crate-root ./`

## 主要特性

- **五个派生宏** 用于注解 Solana 程序（`ShankAccount`、`ShankInstruction`、`ShankBuilder`、`ShankContext`、`ShankType`）
- **自动 IDL 生成** 从注解的 Rust 代码生成
- **TypeScript SDK 生成** 通过与 Solita 和 Kinobi 集成
- **Borsh 序列化支持** 支持类型覆盖和填充字段
- **全面的账户元数据** 包括可变性、签名者要求和描述

## 文档

- **[快速入门](/zh/dev-tools/shank/getting-started)** - 安装、设置、详细使用指南和全面示例

## 集成

Shank 与其他 Metaplex 工具无缝集成：
- **[Kinobi](/zh/dev-tools/umi/kinobi)** - 现代 IDL 生成和客户端创建
- **[Solita](/zh/legacy-documentation/developer-tools/solita)** - TypeScript SDK 生成

## 资源

- [GitHub 仓库](https://github.com/metaplex-foundation/shank)
- [Rust Crate](https://docs.rs/shank)
- [CLI Crate](https://docs.rs/shank-cli)
- [Discord 社区](https://discord.gg/metaplex)
