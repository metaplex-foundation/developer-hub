---
title: Core Candy Machine Rust SDK
metaTitle: Core Candy Machine Rust SDK | Core Candy Machine
description: Solana上でCore Candy Machineを構築・管理するためのmpl-core-candy-machine-coreおよびmpl-core-candy-guard Rustクレートの使い方を学びます。
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

## Summary

Core Candy Machine Rust SDKは、Solana上でCandy Machineと対話するための2つのクレートを提供します。マシンの初期化と管理を行う`mpl-core-candy-machine-core`と、ガードの作成と設定を行う`mpl-core-candy-guard`です。 {% .lead %}

- `cargo add mpl-core-candy-machine-core`および`cargo add mpl-core-candy-guard`でCargoを使用してインストール
- スクリプト、デスクトップアプリケーション、モバイルアプリケーション、およびSolanaオンチェーンプログラムで使用可能
- Coreクレートは、Candy Machineの作成、設定、アセットの読み込みを処理
- Guardクレートは、ガードの作成とCandy Machineへのガードのラッピングを処理

## Core Candy Machine Rustクレート

`mpl-core-candy-machine-core`クレートは、[Core Candy Machine](/ja/smart-contracts/core-candy-machine)プログラムのコアコンポーネントであり、Solana上でのCandy Machineの初期化と管理を提供します。

### インストール

`mpl-core-candy-machine-core` Rustクレートは、スクリプト/デスクトップ/モバイルアプリケーションだけでなく、Solanaオンチェーンプログラムでも使用できます。

```rust
cargo add mpl-core-candy-machine-core
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-machine-core" description="MPL Core Candy Machine用Rust SDKを始めましょう。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" description="Core Candy Machineクレート用のRust SDK typedocプラットフォーム。" /%}

{% /quick-links %}

## Core Candy Guard Rustクレート

`mpl-core-candy-guard`クレートは、Core Candy Machineにラップしてミント条件を適用する[Core Candy Guard](/ja/smart-contracts/core-candy-machine/guards)の作成と管理を可能にします。

### インストール

`mpl-core-candy-guard` Rustクレートは、スクリプト/デスクトップ/モバイルアプリケーションだけでなく、Solanaオンチェーンプログラムでも使用できます。

```rust
cargo add mpl-core-candy-guard
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-guard" description="Core Candy Guards用Rust SDKを始めましょう。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-guard" description="Core Candy Guardsクレート用のRust SDK typedocプラットフォーム。" /%}

{% /quick-links %}

## Notes

- 両方のクレートは、オンチェーンプログラム開発（CPIコール）およびオフチェーンクライアントスクリプトに使用できます。
- `mpl-core-candy-machine-core`と`mpl-core-candy-guard`クレートは別々のパッケージです。完全なCandy Machineおよびガード機能が必要な場合は、両方をインストールしてください。
- 詳細な型と関数シグネチャについては、[docs.rsドキュメント](https://docs.rs/mpl-core-candy-machine-core/)を参照してください。

*[Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine)によりメンテナンス · 最終確認 2026年3月*
