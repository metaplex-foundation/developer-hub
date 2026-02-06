---
title: Shankを始める
metaTitle: はじめに | Shank
description: Rust SolanaプログラムからのIDL抽出のためのShankのインストールとセットアップ方法を学習
---

このガイドでは、Shankをセットアップし、Rust SolanaプログラムからIDLを初めて抽出する方法を説明します。

## 前提条件

Shankを開始する前に、以下を確保してください：

- Rustツールチェーンがインストールされている（1.56.0以降）
- Cargoパッケージマネージャー
- Rustで書かれたSolanaプログラム
- Solanaプログラム開発の基本的な知識

## インストール

### Shank CLIのインストール

Cargoを使用してShankコマンドラインツールをインストールします：

```bash
cargo install shank-cli
```

インストールを確認します：

```bash
shank --version
```

### プロジェクトにShankを追加

`Cargo.toml`でShankを依存関係として追加します：

```toml
[dependencies]
shank = "0.4"

[build-dependencies]
shank-cli = "0.4"
```

## 最初のShankプロジェクト

### 1. プログラムに注釈を付ける

既存のSolanaプログラムにShank派生マクロを追加することから始めます：

```rust
use shank::ShankInstruction;

#[derive(ShankInstruction)]
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

### 2. アカウント構造に注釈を付ける

アカウント構造体に`ShankAccount`を追加します：

```rust
use shank::ShankAccount;

#[derive(ShankAccount)]
pub struct UserAccount {
    pub name: String,
    pub created_at: i64,
    pub authority: Pubkey,
}
```

### 3. IDLを抽出

Shank CLIを実行してIDLを抽出します：

```bash
shank idl --out-dir ./target/idl --crate-root ./
```

これにより、`./target/idl`ディレクトリにIDLファイル（例：`my_program.json`）が生成されます。

### 4. 出力を確認

生成されたIDLファイルを確認します：

```bash
cat ./target/idl/my_program.json
```

プログラムのインストラクション、アカウント、型を含むJSON構造が表示されるはずです。

## プロジェクト構造

典型的なShank対応プロジェクト構造は次のようになります：

```
my-solana-program/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── instruction.rs    # ShankInstructionの列挙型を含む
│   ├── state.rs         # ShankAccountの構造体を含む
│   └── processor.rs     # プログラムロジック
├── target/
│   └── idl/
│       └── my_program.json  # 生成されたIDL
└── sdk/                 # 生成されたTypeScript SDK（オプション）
    └── ...
```

## 核となるコンポーネント

Shankは相互接続されたいくつかのクレートで構成されています：

- **shank**: マクロ注釈を提供するトップレベルクレート
- **shank-cli**: IDL抽出のためのコマンドラインツール
- **shank-macro**: コード生成のための派生マクロ
- **shank-idl**: ファイルを処理し注釈をIDLに変換
- **shank-render**: Rust実装ブロックを生成

## 主な機能

### 派生マクロ

ShankはSolanaプログラムコードに注釈を付けるための5つの重要な派生マクロを提供します：

1. **`ShankAccount`**: シリアライゼーション可能なデータを持つアカウントを表す構造体に注釈
   - 型オーバーライドのための`#[idl_type()]`をサポート
   - パディングフィールドのための`#[padding]`をサポート
   - Borshシリアライゼーションと連携

2. **`ShankBuilder`**: 各注釈付きインストラクションのインストラクションビルダーを生成
   - ビルダーパターン実装を作成
   - インストラクション構築を簡素化

3. **`ShankContext`**: インストラクション用のアカウント構造体を作成
   - プログラムインストラクション用のコンテキスト構造を生成
   - Anchorフレームワークパターンと統合

4. **`ShankInstruction`**: プログラムのインストラクション列挙型に注釈
   - `#[account()]`属性を使用してアカウント要件を指定
   - アカウント可変性、署名者要件、説明をサポート
   - 包括的なインストラクションメタデータを生成

5. **`ShankType`**: シリアライゼーション可能なデータを持つ構造体や列挙型をマーク
   - アカウントやインストラクションで参照されるカスタム型に使用
   - 複雑なデータ構造の適切なIDL生成を確保

### Metaplexエコシステムとの統合

Shankは他のMetaplexツールとシームレスに統合します：

- **[Kinobi](/ja/dev-tools/umi/kinobi)**: IDL生成とクライアント作成にShank JSライブラリを使用
- **[Solita](/ja/legacy-documentation/developer-tools/solita)**: Shankで抽出されたIDLからTypeScript SDKを生成

## CLI使用法

Shankがインストールされ、プログラムに注釈が付けられたら、以下でIDLを抽出します：

```bash
# 基本IDL抽出
shank idl --out-dir ./target/idl --crate-root ./

# 特定のクレート用のIDL抽出
shank idl --out-dir ./idl --crate-root ./my-program

# カスタムプログラムIDでIDLを生成
shank idl --out-dir ./idl --crate-root ./ --program-id MyProgram111111111111111111111111111111
```

## 次のステップ

ShankをセットアップしてIDLファイルを生成できるようになったので、次のことができます：

1. **[マクロリファレンス](/ja/dev-tools/shank/macros)**: すべてのShankマクロと属性の完全なリファレンス
2. **[Kinobiとの統合](/ja/dev-tools/umi/kinobi)**: Umiと互換性のあるモダンなTypeScript SDKを生成（推奨）
3. **[Solita](https://github.com/metaplex-foundation/solita)**: web3.jsと互換性のあるレガシーTypeScript SDKを生成

## トラブルシューティング

### 一般的な問題

**解析エラーでIDL生成が失敗する：**

- Rustコードが正常にコンパイルできることを確認
- すべての派生マクロが適切にインポートされていることを確認
- アカウント注釈が正しくフォーマットされていることを確認

**生成されたIDLにアカウントが欠けている：**

- 構造体が`#[derive(ShankAccount)]`で注釈されていることを確認
- 構造体が公開されてアクセス可能であることを確認

**ビルドスクリプトエラー：**

- `shank-cli`がインストールされてPATHで利用可能であることを確認
- ビルドスクリプトの権限と実行権限を確認

詳細なヘルプについては、[GitHubリポジトリ](https://github.com/metaplex-foundation/shank)を訪問するか、[Metaplex Discord](https://discord.gg/metaplex)に参加してください。
