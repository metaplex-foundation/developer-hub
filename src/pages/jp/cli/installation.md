---
title: インストール
description: Metaplex CLIのインストールとセットアップ
---

# インストールガイド

このガイドは、システムにMetaplex CLIをインストールしセットアップするのに役立ちます。

## 前提条件

CLIをインストールする前に、以下があることを確認してください：

- Node.js 16.x以上
- npm 7.x以上
- Solanaウォレット（オプション、ただし推奨）
- Git（オプション、開発用）

## インストール方法

### npmを使用（推奨）

```bash
npm install -g @metaplex-foundation/cli
```

### yarnを使用

```bash
yarn global add @metaplex-foundation/cli
```

### pnpmを使用

```bash
pnpm add -g @metaplex-foundation/cli
```

## インストールの確認

インストール後、CLIが正しくインストールされていることを確認します：

```bash
mplx --version
```

CLIの現在のバージョンが表示されるはずです。

## 初期セットアップ

### 1. 設定ディレクトリの作成

CLIは、最初に設定を行う際に`~/.config/mplx`に設定ファイルを自動的に作成します。この設定には以下が保存されます：
- ウォレット設定
- RPCエンドポイント設定
- エクスプローラー設定
- その他のCLI設定

### 2. 環境の設定

#### ウォレットの設定
```bash
# 新しいウォレットを作成
mplx config wallets new --name dev1

# または既存のウォレットを追加
mplx config wallets add <name> <path>
mplx config wallets add dev1 /path/to/keypair.json

# ウォレットを追加した後、それを設定する必要があります
mplx config wallets set
```

詳細については以下を参照してください

#### RPCエンドポイントの設定
```bash
mplx config set rpcUrl  https://api.mainnet-beta.solana.com
```

#### 推奨エクスプローラーの設定
```bash
mplx config explorer set
```

## 開発用インストール

CLIに貢献したい、またはソースから実行したい場合：

1. リポジトリをクローン：
```bash
git clone https://github.com/metaplex-foundation/cli.git
cd cli
```

2. 依存関係をインストール：
```bash
npm install
```

3. プロジェクトをビルド：
```bash
npm run build
```

4. CLIをリンク：
```bash
npm link
```

## トラブルシューティング

### よくある問題

1. **コマンドが見つからない**
   - グローバルnpmのbinディレクトリがPATHに含まれていることを確認
   - パッケージを再インストールしてみる

2. **権限エラー**
   - Unix系システムでグローバルインストール時に`sudo`を使用
   - またはsudo無しでグローバルパッケージをインストールするようにnpmを設定

3. **Nodeバージョンの問題**
   - Node.jsバージョンを管理するためにnvmを使用
   - 互換性のあるNode.jsバージョンを使用していることを確認

### ヘルプの取得

問題が発生した場合：

1. [ドキュメント](https://developers.metaplex.com)を確認
2. [GitHubの課題](https://github.com/metaplex-foundation/cli/issues)を検索
3. [Discordコミュニティ](https://discord.gg/metaplex)に参加

## 次のステップ

CLIがインストールされたので、以下のことができます：

1. [コアコマンドについて学ぶ](/jp/cli/core/create-asset)
2. [ツールボックスユーティリティを探索](/jp/cli/toolbox/token-create)
3. [環境を設定する](/jp/cli/config/wallets)

## 更新

CLIを最新バージョンに更新するには：

```bash
npm update -g @metaplex-foundation/cli
```

またはyarnでインストールした場合：

```bash
yarn global upgrade @metaplex-foundation/cli
```

## アンインストール

CLIを削除するには：

```bash
npm uninstall -g @metaplex-foundation/cli
```

またはyarnでインストールした場合：

```bash
yarn global remove @metaplex-foundation/cli
```