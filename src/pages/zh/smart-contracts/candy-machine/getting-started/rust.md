---
title: 使用 Rust 快速入门
metaTitle: Candy Machine - 快速入门 - Rust SDK | Candy Machine
description: 使用 Rust 开始使用 Candy Machine
---

如果您是 Rust 开发者，您也可以使用 Rust crate 与 Candy Machine 程序进行交互。由于程序是用 Rust 编写的，这个 crate 包含所有程序的逻辑，包括为我们准备指令的辅助方法。

如果您正在开发 Rust 客户端，或者想要在程序中对 Candy Machine 程序进行 [CPI 调用](https://solanacookbook.com/references/programs.html#how-to-do-cross-program-invocation)，这会很有帮助。

由于 candy machine 由两个程序组成，您需要安装两个库。

- **Candy Machine Core**
  - [GitHub 仓库](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core)
  - [Crate 页面](https://crates.io/crates/mpl-candy-machine-core)
  - [API 参考](https://docs.rs/mpl-candy-machine-core/0.1.0/mpl_candy_machine_core/)
- **Candy Guard**
  - [GitHub 仓库](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard)
  - [Crate 页面](https://crates.io/crates/mpl-candy-guard)
  - [API 参考](https://docs.rs/mpl-candy-guard/0.1.0/mpl_candy_guard/)
