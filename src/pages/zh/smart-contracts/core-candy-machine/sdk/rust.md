---
title: Core Candy Machine Rust SDK
metaTitle: Core Candy Machine Rust SDK | Core Candy Machine
description: 开始使用 mpl-core-candy-machine-core 和 mpl-core-candy-guard Rust crate，在 Solana 上构建和管理 Core Candy Machine。
keywords:
  - core candy machine
  - rust sdk
  - mpl-core-candy-machine-core
  - mpl-core-candy-guard
  - solana programs
  - rust crate
  - candy machine rust
  - onchain programs
  - metaplex rust
  - cargo
  - solana nft
about:
  - Rust SDK
  - Solana programs
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
created: '03-10-2026'
updated: '03-10-2026'
---

## 概要

Core Candy Machine Rust SDK 提供两个 crate 用于在 Solana 上与 Candy Machine 交互：`mpl-core-candy-machine-core` 用于机器初始化和管理，`mpl-core-candy-guard` 用于创建和配置守卫。 {% .lead %}

- 通过 Cargo 安装：`cargo add mpl-core-candy-machine-core` 和 `cargo add mpl-core-candy-guard`
- 可用于脚本、桌面应用程序、移动应用程序和 Solana 链上程序
- Core crate 处理 Candy Machine 的创建、配置和资产加载
- Guard crate 处理守卫的创建以及将守卫包装到 Candy Machine 上

## Core Candy Machine Rust Crate

`mpl-core-candy-machine-core` crate 是 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 程序的核心组件，提供在 Solana 上初始化和管理 Candy Machine 的功能。

### 安装

`mpl-core-candy-machine-core` Rust crate 可用于脚本/桌面/移动应用程序以及 Solana 链上程序。

```rust
cargo add mpl-core-candy-machine-core
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-machine-core" description="开始使用我们的 MPL Core Candy Machine Rust SDK。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" description="Core Candy Machine crate 的 Rust SDK typedoc 平台。" /%}

{% /quick-links %}

## Core Candy Guard Rust Crate

`mpl-core-candy-guard` crate 用于创建和管理可以包装在 Core Candy Machine 上的 [Core Candy Guard](/zh/smart-contracts/core-candy-machine/guards)，以强制执行铸造条件。

### 安装

`mpl-core-candy-guard` Rust crate 可用于脚本/桌面/移动应用程序以及 Solana 链上程序。

```rust
cargo add mpl-core-candy-guard
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-guard" description="开始使用我们的 Core Candy Guards Rust SDK。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-guard" description="Core Candy Guards crate 的 Rust SDK typedoc 平台。" /%}

{% /quick-links %}

## 注意事项

- 两个 crate 均可用于链上程序开发（CPI 调用）和链下客户端脚本。
- `mpl-core-candy-machine-core` 和 `mpl-core-candy-guard` crate 是独立的包。如果需要完整的 Candy Machine 和守卫功能，请安装两者。
- 请参阅 [docs.rs 文档](https://docs.rs/mpl-core-candy-machine-core/)了解详细的类型和函数签名。

*由 [Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine) 维护 · 最后验证于 2026 年 3 月*
