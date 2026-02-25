---
title: Bubblegum 概要
metaTitle: Bubblegum V2（圧縮NFT）| Metaplex CLI
description: Bubblegum V2プログラムを使用して圧縮NFTを作成・管理する
---

# Bubblegum（圧縮NFT）

{% callout type="note" %}
これらのCLIコマンドは**Bubblegum V2**専用です。Bubblegum V2は[Metaplex Coreコレクション](/smart-contracts/core/collections)を使用し、Bubblegum V1ツリーやToken Metadataコレクションとは互換性がありません。
{% /callout %}

Bubblegumは、従来のNFTよりもはるかに低コストでNFTを作成できるMetaplexの圧縮NFT（cNFT）プログラムです。状態圧縮のための並行マークルツリーを使用することで、初期ツリー作成コスト後はトランザクションコストのみで圧縮NFTをミントできます。

## 主要な概念

### マークルツリー
圧縮NFTは、個別のオンチェーンアカウントではなくマークルツリーに保存されます。圧縮NFTをミントする前にツリーを作成する必要があります。ツリーサイズは以下を決定します：
- 保存できるNFTの最大数
- 前払いのレント費用（ツリー作成時に一度だけ支払う）
- 操作に必要なプルーフサイズ

### コレクション
Bubblegum V2は[Metaplex Coreコレクション](/smart-contracts/core/collections)を使用します（Token Metadataコレクションではありません）。まずCoreコレクションを作成してください：

```bash
mplx core collection create --wizard
```

### RPC要件

圧縮NFT操作には、[DAS（Digital Asset Standard）API](/solana/rpcs-and-das#metaplex-das-api)をサポートするRPCエンドポイントが必要です。標準のSolana RPCエンドポイントはDASをサポートしておらず、圧縮NFTの取得、更新、転送、バーンには機能しません。

DASをサポートするプロバイダーのリストは[RPCプロバイダー](/solana/rpcs-and-das)ページをご覧ください。

## コマンド構造

すべてのBubblegumコマンドは以下のパターンに従います：

```bash
mplx bg <resource> <command> [options]
```

### 利用可能なコマンド

**ツリー管理**
- `mplx bg tree create` - 新しいマークルツリーを作成
- `mplx bg tree list` - 保存されたすべてのツリーを一覧表示

**NFT操作**
- `mplx bg nft create` - 圧縮NFTをミント
- `mplx bg nft fetch` - NFTデータとマークルプルーフを取得
- `mplx bg nft update` - NFTメタデータを更新
- `mplx bg nft transfer` - NFTを新しいオーナーに転送
- `mplx bg nft burn` - NFTを完全に破棄

## クイックスタート

1. DAS対応RPCを設定：

   ```bash
   mplx config rpcs add <name> <url>
   ```

1. マークルツリーを作成：

   ```bash
   mplx bg tree create --wizard
   ```

1. コレクションを作成（オプションですが推奨）：

   ```bash
   mplx core collection create --wizard
   ```

1. 圧縮NFTをミント：

   ```bash
   mplx bg nft create my-tree --wizard
   ```

## 権限モデル

| 操作 | 必要な権限 |
|-----------|-------------------|
| NFT作成 | ツリー権限（またはツリーがパブリックの場合は誰でも） |
| NFT更新 | ツリー権限またはコレクション更新権限 |
| NFT転送 | 現在のオーナーまたはデリゲート |
| NFTバーン | 現在のオーナーまたはデリゲート |

## 次のステップ

- [マークルツリーを作成](/dev-tools/cli/bubblegum/create-tree)
- [圧縮NFTを作成](/dev-tools/cli/bubblegum/create-cnft)
- [圧縮NFTを取得](/dev-tools/cli/bubblegum/fetch-cnft)
