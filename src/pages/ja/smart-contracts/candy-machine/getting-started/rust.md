---
title: Rustを使ったはじめに
metaTitle: キャンディマシン - はじめに - Rust SDK | キャンディマシン
description: Rustを使ってキャンディマシンを始めましょう
---

Rust開発者であれば、キャンディマシンプログラムとやり取りするためにRustクレートを使用することもできます。プログラムはRustで書かれているため、このクレートには、命令を準備するヘルパーメソッドを含む、プログラムのすべてのロジックが含まれています。

これは、Rustクライアントを開発している場合や、プログラム内でキャンディマシンプログラムへの[CPI呼び出し](https://solanacookbook.com/references/programs.html#how-to-do-cross-program-invocation)を行いたい場合に役立ちます。

キャンディマシンは2つのプログラムで構成されているため、2つのライブラリをインストールする必要があります。

- **キャンディマシンコア**
  - [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core)
  - [クレートページ](https://crates.io/crates/mpl-candy-machine-core)
  - [APIリファレンス](https://docs.rs/mpl-candy-machine-core/0.1.0/mpl_candy_machine_core/)
- **キャンディガード**
  - [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard)
  - [クレートページ](https://crates.io/crates/mpl-candy-guard)
  - [APIリファレンス](https://docs.rs/mpl-candy-guard/0.1.0/mpl_candy_guard/)
