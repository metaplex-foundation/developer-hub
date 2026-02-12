---
# remember to update dates also in /components/guides/index.js
title: RPCとDAS
metaTitle: SolanaブロックチェーンのRPCとDAS | ガイド
description: SolanaブロックチェーンのRPCと、MetaplexのDASがSolanaでのデータ保存と読み取りをどのように支援するかについて学習します。
created: '06-16-2024'
updated: '04-19-2025'
keywords:
  - Solana RPC
  - DAS
  - Digital Asset Standard
  - Metaplex DAS
  - RPC endpoints
  - digital asset indexing
about:
  - Remote Procedure Calls
  - Metaplex DAS
  - digital asset indexing
  - Solana infrastructure
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

## SolanaブロックチェーンでのRPCの役割
リモートプロシージャコール（RPC）は、Solanaブロックチェーンインフラストラクチャの重要な部分です。これらは、ユーザー（またはアプリケーション）とブロックチェーンの間の橋渡しとして機能し、相互作用とデータ取得を促進します。

#### RPCの主な役割
1. **ネットワーク通信の促進**:
RPCサーバーは、クライアント（ユーザーまたはアプリケーション）からの要求を処理し、ブロックチェーンと相互作用してそれらの要求を満たします。外部エンティティがフルノードを実行する必要なくブロックチェーンと通信するための標準化された方法を提供します。

2. **トランザクションの送信**:
RPCにより、クライアントはSolanaブロックチェーンにトランザクションを送信できます。ユーザーがトークンの転送やスマートコントラクトの呼び出しなど、ブロックチェーンでアクションを実行したい場合、トランザクションはRPCサーバーに送信され、処理とブロックへの含有のためにネットワークに伝播されます。

3. **ブロックチェーンデータの取得**:
RPCサーバーにより、クライアントはブロックチェーンに以下を含む様々な種類のデータを要求できます：
- **アカウント情報**: 残高、トークン保有量、その他のメタデータなど、特定のアカウントに関する詳細。
- **トランザクション履歴**: アカウントまたは特定のトランザクション署名に関連する履歴トランザクション。
- **ブロック情報**: ブロック高、ブロックハッシュ、ブロックに含まれるトランザクションを含む、特定のブロックに関する詳細。
- **プログラムログ**: 実行されたプログラム（スマートコントラクト）からのログと出力へのアクセス。

4. **ネットワーク状態の監視**:
RPCは、以下のようなネットワークとノードの状態をチェックするエンドポイントを提供します：
- **ノード健全性**: ノードがオンラインで正しく機能しているかを判断。
- **ネットワーク待機時間**: 要求が処理され、レスポンスが受信されるまでの時間を測定。
- **同期状態**: ノードがネットワークの残りの部分と同期しているかをチェック。

5. **開発とデバッグのサポート**:
RPCエンドポイントは、Solanaで開発する開発者にとって不可欠なツールです。以下の機能を提供します：
- **トランザクションのシミュレーション**: ネットワークに送信する前にトランザクションをシミュレートして、潜在的な影響を確認。
- **プログラムアカウントの取得**: プログラム状態の管理に役立つ、特定のプログラムに関連するすべてのアカウントを取得。
- **ログの取得**: アプリケーションのデバッグと最適化のための、トランザクションとプログラムからの詳細ログ。

### RPCエンドポイントの例
以下は、一般的なRPCエンドポイントとその機能です：
- **getBalance**: 指定されたアカウントの残高を取得。
- **sendTransaction**: ネットワークにトランザクションを送信。
- **getTransaction**: 署名を使用して特定のトランザクションの詳細を取得。
- **getBlock**: スロット番号による特定のブロックに関する情報を取得。
- **simulateTransaction**: チェーン上で実行することなく、トランザクションをシミュレートして結果を予測。

### 使用例
SolanaのRPCエンドポイントと相互作用するJavaScriptを使用した簡単な例：

```javascript
const solanaWeb3 = require('@solana/web3.js');

// Solanaクラスターに接続
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

// アカウントの残高を取得
async function getBalance(publicKey) {
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance: ${balance} lamports`);
}

// トランザクションを送信
async function sendTransaction(transaction, payer) {
  const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(`Transaction signature: ${signature}`);
}

// 公開鍵の例（実際のSolanaアドレス形式）
const publicKey = new solanaWeb3.PublicKey('7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp');

// 残高を取得
getBalance(publicKey);
```

## Metaplex DAS

Metaplex DAS（Digital Asset Standard）は、SolanaブロックチェーンでのNFTとトークンの読み取り層を標準化するように設計されたプロトコルまたはフレームワークで、開発者が複数の異なる標準とデジタルアセットのレイアウトを取得する際にコードを標準化することを可能にします。

### デジタル資産のインデックス化
すべてのデジタル資産（NFTとトークン）をインデックス化することで、ユーザーは情報がブロックチェーンから直接取得するのではなく最適化されたデータベースに保存されるため、これらの資産のデータをより高速に読み取ることができます。

### 同期
DASには、ブロックチェーンに送信される特定のライフサイクル命令中にデータの再インデックス化を同期する機能があります。作成、更新、焼却、転送などのこれらの命令を監視することで、DASのインデックス化されたデータが常に最新であることを保証できます。

現在、Core、Token Metadata、BubblegumはすべてDASによってインデックス化されています。

Metaplex DASの詳細については、以下のページを参照してください：

- [Metaplex DAS API](/ja/dev-tools/das-api)
- [Metaplex DAS API Github](https://github.com/metaplex-foundation/digital-asset-standard-api)
- [Metaplex Digital Asset RPC Infrastructure Github](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

## RPCとDASの統合

RPCとDASは、Solanaエコシステムで互いを補完します。標準RPCがオンチェーンデータへの直接アクセスを提供する一方で、Metaplex DASはデジタル資産専用の最適化されたインデックス化層を提供します。両方のサービスを適切に活用することで、開発者はRPCを通じて一般的なブロックチェーンデータを取得し、DASを通じてデジタル資産情報にアクセスする、より効率的なアプリケーションを構築でき、より良いパフォーマンスとユーザーエクスペリエンスをもたらします。
