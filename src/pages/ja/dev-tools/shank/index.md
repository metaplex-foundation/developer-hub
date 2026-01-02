---
title: Shank
metaTitle: Shank | Metaplex Developer Hub
description: 属性マクロを使用してRust SolanaプログラムコードからIDLを抽出
---

Shankは、Shank属性マクロで注釈されたSolanaプログラムコードからインターフェース定義言語（IDL）を抽出するために設計されたRustクレートのコレクションです。抽出されたIDLは、TypeScript SDKの生成やSolanaプログラムとの相互作用を促進するために使用できます。

ShankはIDLファイルの生成を自動化することで、Solanaプログラムの開発ワークフローを簡素化し、RustプログラムコードとクライアントサイドSDK間の橋渡しとして機能します。

## クイックスタート

1. Shank CLIをインストール: `cargo install shank-cli`
2. プロジェクトにShankを追加: `shank = "0.4"`
3. `ShankAccount`と`ShankInstruction`マクロでプログラムに注釈を付ける
4. IDLを抽出: `shank idl --out-dir ./target/idl --crate-root ./`

## 主な機能

- **5つの派生マクロ** でSolanaプログラムに注釈（`ShankAccount`、`ShankInstruction`、`ShankBuilder`、`ShankContext`、`ShankType`）
- 注釈付きRustコードからの**自動IDL生成**
- SolitaとKinobiとの統合による**TypeScript SDK生成**
- 型オーバーライドとパディングフィールドを含む**Borshシリアライゼーションサポート**
- 可変性、署名者要件、説明を含む**包括的なアカウントメタデータ**

## ドキュメント

- **[はじめに](/ja/dev-tools/shank/getting-started)** - インストール、セットアップ、詳細な使用ガイド、包括的な例

## 統合

ShankはMetaplexの他のツールとシームレスに統合します：
- **[Kinobi](/ja/dev-tools/umi/kinobi)** - モダンなIDL生成とクライアント作成
- **[Solita](/ja/legacy-documentation/developer-tools/solita)** - TypeScript SDK生成

## リソース

- [GitHubリポジトリ](https://github.com/metaplex-foundation/shank)
- [Rustクレート](https://docs.rs/shank)
- [CLIクレート](https://docs.rs/shank-cli)
- [Discordコミュニティ](https://discord.gg/metaplex)