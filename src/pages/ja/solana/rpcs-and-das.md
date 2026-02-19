---
# remember to update dates also in /components/products/guides/index.js
title: RPC、DAS、RPCプロバイダー
metaTitle: SolanaブロックチェーンのRPC、DAS、RPCプロバイダー | ガイド
description: SolanaブロックチェーンのRPC、MetaplexのDASによるデータ保存と読み取りの支援、プロジェクトに適したRPCプロバイダーの選択について学習します。
created: '06-16-2024'
updated: '02-13-2026'
keywords:
  - Solana RPC
  - DAS
  - Digital Asset Standard
  - Metaplex DAS
  - RPC endpoints
  - digital asset indexing
  - RPC providers
about:
  - Remote Procedure Calls
  - Metaplex DAS
  - digital asset indexing
  - Solana infrastructure
  - RPC providers
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
faqs:
  - q: What is an RPC on Solana?
    a: RPCs (Remote Procedure Calls) are servers that act as a bridge between applications and the Solana blockchain, handling requests for submitting transactions, retrieving data, and monitoring network status.
  - q: What is Metaplex DAS?
    a: Metaplex DAS (Digital Asset Standard) is a protocol that standardizes the read layer for NFTs and tokens on Solana by indexing digital assets into an optimized database for faster data retrieval.
  - q: Which Metaplex programs are indexed by DAS?
    a: Core, Token Metadata, and Bubblegum are all currently indexed by DAS, providing fast access to digital asset data for these standards.
  - q: How do RPCs and DAS work together?
    a: RPCs provide direct access to on-chain data while DAS offers an optimized indexed layer for digital assets. Developers use RPCs for general blockchain data and DAS for efficient digital asset queries.
---

SolanaのRPC、Metaplex DASによるデジタル資産読み取りの標準化、プロジェクトに適したRPCプロバイダーの選択について学習します。 {% .lead %}

## SolanaブロックチェーンでのRPCの役割

リモートプロシージャコール（RPC）は、Solanaブロックチェーンインフラストラクチャの重要な部分です。これらは、ユーザー（またはアプリケーション）とブロックチェーンの間の橋渡しとして機能し、相互作用とデータ取得を促進します。

Solanaは、クラスター（Devnet、Testnet、Mainnet Beta）全体でプログラムと出力を確認する独立したノードを使用しています。すべてのノードがブロックに投票できるわけではなく、投票できないノードは主にリクエストへの応答に使用されます。これらがRPCノードで、ブロックチェーンを通じてトランザクションを送信するために使用されます。

Solanaは3つのパブリックAPIノード（クラスターごとに1つ）を維持しています。例えば、Devnetのエンドポイントは：

```
https://api.devnet.solana.com
```

これらのパブリックエンドポイントはレート制限があります。Mainnet Betaでは、多くの開発者がより高いレート制限のためにプライベートRPCプロバイダーを使用しています。

#### RPCの主な役割

1. **ネットワーク通信の促進**:
RPCサーバーは、クライアントからの要求を処理し、ブロックチェーンと相互作用してそれらの要求を満たします。フルノードを実行する必要なくブロックチェーンと通信するための標準化された方法を提供します。

2. **トランザクションの送信**:
RPCにより、クライアントはSolanaブロックチェーンにトランザクションを送信できます。トークンの転送やスマートコントラクトの呼び出しなどのアクションを実行したい場合、トランザクションはRPCサーバーに送信され、ネットワークに伝播されます。

3. **ブロックチェーンデータの取得**:
RPCサーバーにより、クライアントはブロックチェーンに様々な種類のデータを要求できます：
- **アカウント情報**: 残高、トークン保有量、その他のメタデータ。
- **トランザクション履歴**: アカウントまたはトランザクション署名に関連する履歴。
- **ブロック情報**: ブロック高、ブロックハッシュ、含まれるトランザクション。
- **プログラムログ**: 実行されたプログラムからのログと出力。

4. **ネットワーク状態の監視**:
RPCは、ノード健全性、ネットワーク待機時間、同期状態をチェックするエンドポイントを提供します。

5. **開発とデバッグのサポート**:
RPCエンドポイントにより、開発者はトランザクションのシミュレーション、プログラムアカウントの取得、デバッグ用の詳細ログの取得が可能です。

### 一般的なRPCメソッド

| メソッド | 説明 |
|--------|-------------|
| `getBalance` | 指定されたアカウントの残高を取得 |
| `sendTransaction` | ネットワークにトランザクションを送信 |
| `getTransaction` | 署名によるトランザクション詳細を取得 |
| `getBlock` | スロット番号によるブロック情報を取得 |
| `simulateTransaction` | 実行せずにトランザクションをシミュレート |

### 使用例

```bash
# アカウントの残高を取得
curl https://api.mainnet-beta.solana.com -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getBalance","params":["7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp"]}'

# トランザクションをシミュレート
curl https://api.mainnet-beta.solana.com -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"simulateTransaction","params":["<base64-encoded-tx>"]}'
```

---

## Metaplex DAS

Metaplex DAS（Digital Asset Standard）は、SolanaでのNFTとトークンの読み取り層を標準化するために設計されたプロトコルです。開発者が異なる標準とデジタル資産のレイアウトを取得する際に一貫したインターフェースを使用できます。

### デジタル資産のインデックス化

すべてのデジタル資産（NFTとトークン）をインデックス化することで、情報がブロックチェーンから直接取得するのではなく最適化されたデータベースに保存されるため、DASはより高速なデータ読み取りを提供します。

### 同期

DASは、ブロックチェーンに送信されるライフサイクル命令（作成、更新、焼却、転送）を監視することで同期します。これにより、インデックス化されたデータが常に最新であることが保証されます。

現在、**Core**、**Token Metadata**、**Bubblegum**はすべてDASによってインデックス化されています。

### DASとRPC

RPCとDASは互いを補完します。標準RPCがオンチェーンデータへの直接アクセスを提供する一方で、DASはデジタル資産専用の最適化されたインデックス化層を提供します。開発者にとって、DAS APIは圧縮NFT（cNFT）との相互作用に必要であり、Token Metadataアセットとの作業もより簡単で高速になります。最高のユーザーエクスペリエンスのために、DASサポート付きRPCノードの使用を強くお勧めします。

詳細情報：

- [Metaplex DAS API](/ja/dev-tools/das-api)
- [Metaplex DAS API GitHub](https://github.com/metaplex-foundation/digital-asset-standard-api)
- [Metaplex Digital Asset RPC Infrastructure GitHub](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

---

## アーカイブと非アーカイブノード

**アーカイブノード**は、すべての以前のブロックの完全な履歴を保存します。これにより、アドレスの残高履歴を表示し、履歴内の任意の状態を検査できます。高いシステム要件のため、プライベートアーカイブノードへのアクセスは非常に有益です。

**非アーカイブノード**（通常のノード）は、約直近100ブロックのみを保持します。非アーカイブノードでさえリソースを大量に消費する可能性があるため、多くの開発者はプライベートRPCプロバイダーを選択します。特に実際のSOLが関与し、レート制限がより厳しいMainnet Betaでは顕著です。

---

## RPCプロバイダー

{% callout type="note" %}
これらのリストはアルファベット順です。プロジェクトのニーズに最も適したRPCプロバイダーを選択してください。不足しているプロバイダーがあれば、[Discord](https://discord.gg/metaplex)で知らせるか、PRを提出してください。
{% /callout %}

### DASサポート付きRPC

- [Extrnode](https://docs.extrnode.com/das_api/)
- [Helius](https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api)
- [Hello Moon](https://docs.hellomoon.io/reference/rpc-endpoint-for-digital-asset-standard)
- [QuickNode](https://quicknode.com/)
- [Shyft](https://docs.shyft.to/solana-rpcs-das-api/compression-das-api)
- [Triton](https://docs.triton.one/rpc-pool/metaplex-digital-assets-api)

### DASサポートなしRPC

- [Alchemy](https://alchemy.com/?a=metaplex)
- [Ankr](https://www.ankr.com/protocol/public/solana/)
- [Blockdaemon](https://blockdaemon.com/marketplace/solana/)
- [Chainstack](https://chainstack.com/build-better-with-solana/)
- [Figment](https://figment.io/)
- [GetBlock](https://getblock.io/)
- [NOWNodes](https://nownodes.io/)
- [Syndica](https://syndica.io/)
