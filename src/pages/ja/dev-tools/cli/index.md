---
title: はじめに
description: Metaplex CLIへようこそ
---

# Metaplex CLI

Metaplex CLIは、SolanaにおけるMetaplexプロトコルとやり取りするための包括的なユーティリティスイートを提供する強力なコマンドラインツールです。NFTアプリケーションを構築する開発者であっても、デジタルアセットを管理するクリエイターであっても、CLIはワークフローを効率化する堅牢な機能セットを提供します。

## 主要な機能

### コア機能
- MPLコアアセットとコレクションの作成と管理
- アセットメタデータのアップロードと更新
- アセットとコレクション情報の取得
- アセットのプロパティと属性の管理

### ツールボックスユーティリティ
- 代替可能トークンの作成と管理
- アドレス間でのSOLの転送
- SOL残高の確認
- テスト目的でのSOLエアドロップ

### 設定管理
- 複数のウォレットの管理
- RPCエンドポイントの設定
- 推奨ブロックチェーンエクスプローラーの設定
- CLIの動作のカスタマイズ

## CLIを使用する理由

1. **開発者に優しい**: 開発者を念頭に設計され、シンプルなコマンドと高度なオプションの両方を提供
2. **インタラクティブモード**: 複雑な操作のためのユーザーフレンドリーなウィザード
3. **柔軟な設定**: 複数のウォレットとRPCエンドポイントで環境をカスタマイズ
4. **包括的なツール**: NFTとトークン管理に必要なすべてが一箇所に
5. **クロスプラットフォーム**: Windows、macOS、Linuxで動作

## 始める前に

1. [CLIをインストール](/ja/dev-tools/cli/installation)
2. 環境を設定する：
   - [ウォレットを設定](/ja/dev-tools/cli/config/wallets)
   - [RPCエンドポイントを設定](/ja/dev-tools/cli/config/rpcs)
   - [推奨エクスプローラーを選択](/ja/dev-tools/cli/config/explorer)
3. コアコマンドの使用を開始：
   - [アセットを作成](/ja/dev-tools/cli/core/create-asset)
   - [コレクションを作成](/ja/dev-tools/cli/core/create-collection)
   - [アセットを更新](/ja/dev-tools/cli/core/update-asset)
   - [アセットを取得](/ja/dev-tools/cli/core/fetch)

## コマンド構造

CLIは階層的なコマンド構造に従います：

```bash
mplx <カテゴリ> <コマンド> [オプション]
```

カテゴリには以下が含まれます：
- `core`: MPLコアアセット管理
- `toolbox`: ユーティリティコマンド
- `config`: 設定管理

## ベストプラクティス

1. **設定を使用**: スムーズな体験のためにウォレットとRPCエンドポイントを設定
2. **インタラクティブモード**: ガイド付き操作のために`--wizard`フラグを使用
3. **残高を確認**: トランザクションの前に常にSOL残高を確認
4. **まずテスト**: メインネットでの展開前にdevnetでテスト
5. **バックアップ**: ウォレットファイルと設定を安全に保持

## サポートとリソース

- [GitHubリポジトリ](https://github.com/metaplex-foundation/cli)
- [ドキュメント](https://developers.metaplex.com)
- [Discordコミュニティ](https://discord.gg/metaplex)

## 次のステップ

始める準備はできましたか？システムにCLIを設定するために[インストールガイド](/ja/dev-tools/cli/installation)に向かいましょう。