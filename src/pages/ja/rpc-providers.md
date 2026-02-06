---
title: RPCプロバイダー
metaTitle: RPCプロバイダー | Developer Hub
description: Solanaで利用可能なRPCのリスト。
---

## イントロダクション

Solanaは、Devnet、Testnet、Mainnet Betaの3つのSolanaクラスターのいずれかで、プログラムとプログラムの出力を確認する責任を持つ独立したノードを使用しています。クラスターは、トランザクションを確認するために働く一連のバリデーターで構成されています。これらは個人によって所有・運営されています。これらのノードは、データとトランザクション履歴を保存し、ノード間で共有する責任もあります。ノードが有効なブロックに投票するために使用されており、SOLがバリデーターアイデンティティに委任されている場合、リーダーノードになることができます。[これ](https://solana.com/validators)がバリデーターになる方法に関する情報へのリンクです。

すべてのノードがリーダーノードになったり、ブロックを確認するために投票できるわけではありません。それらはバリデーターノードの他の機能は提供しますが、投票できないため、主にブロックチェーンへのリクエストに応答するために使用されます。これらがRPCノードです。RPCはリモートプロシージャーコールの略で、これらのRPCノードはブロックチェーンを通じてトランザクションを送信するために使用されます。

Solanaは3つのパブリックAPIノード（Devnet、Mainnet Beta、Testnetの各クラスター用に1つずつ）を維持しています。これらのAPIノードは、ユーザーがクラスターに接続することを可能にするものです。Devnetに接続するには、ユーザーは以下を見ることができます：

```
https://api.devnet.solana.com
```

これはDevnet用のノードで、レート制限があります。

Mainnet Betaクラスターでは、多くの開発者は、SolanaのパブリックAPIノードでは利用できない高いレート制限を活用するために、自分のプライベートRPCノードを使用することを選択しています。

![](https://i.imgur.com/1GmCbcu.png#radius")

上記の[Solana Docs](https://docs.solana.com/cluster/rpc-endpoints)からの写真では、Mainnet Beta用に、mainnet apiノードを使用することによるレート制限を確認できます。Mainnetノードは現在[Metaplex DAS API](#metaplex-das-api)をサポートしていません。

RPCノードの機能をいくつか定義し、次にいくつかのオプションを提示します。プロジェクトのニーズに基づいて1つを選択することをお勧めします。

## Metaplex DAS API

RPCのもう一つの区別する特徴は、[Metaplex DAS API](/ja/dev-tools/das-api)をサポートしているかどうかです。Metaplex Digital Asset Standard (DAS) APIは、Solana上のデジタル資産と相互作用するための統一されたインターフェースを表し、標準（Token Metadata）と圧縮（Bubblegum）の両方の資産をサポートしています。APIは、RPCが資産データを提供するために実装する一連のメソッドを定義しています。

開発者にとって、DAS APIはcNFTと相互作用するために必要ですが、TMアセットとの作業をより簡単で高速にすることもできます。チェーンから読み取る際には、ユーザーエクスペリエンスを可能な限り高速にするために、DASサポートを持つRPCノードを使用することを強くお勧めします。

DAS APIの詳細については、[専用セクション](/ja/dev-tools/das-api)で詳しく知ることができます。

## アーカイブと非アーカイブノード

ノードを2つの異なるカテゴリーに分けることができます。最初に見るのはアーカイブノードです。これらは以前のブロックの情報を保存できます。これらのアーカイブノードの場合、すべての以前のブロックにアクセスできることをいくつかの方法で活用できます。利点の一部には、アドレスの残高履歴を表示できることや、履歴内の任意の状態を表示できることが含まれます。完全な履歴ノードを実行することの高いシステム要件のため、この機能を持つプライベートノードが利用可能であることは非常に有益です。

アーカイブノードとは異なり、非アーカイブノード、または通常のノードは、以前のブロックの一部（100ブロック以上）にのみアクセスできます。アーカイブノードの実行には集約的な要件があることを以前に言及しましたが、非アーカイブノードでさえ管理が困難になる可能性があります。このため、ユーザーはしばしばプライベートRPCプロバイダーを選択します。Solanaでのプライベートrpcの使用に関する多くの用途は、実際のSOLトークンが関与し、レート制限される可能性が高いため、通常Mainnet-betaの使用に関わっています。

## 利用可能なRPC

以下のセクションには複数のRPCプロバイダーが含まれています。

{% callout type="note" %}
これらのリストはアルファベット順です。プロジェクトのニーズに最も適したRPCプロバイダーを選択してください。不足しているプロバイダーがあれば、Discordで知らせるか、PRを提出してください。
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

### さらに詳しい情報

このトピックについて質問がある場合や、さらに理解を深めたい場合は、[Metaplex Discord](https://discord.gg/metaplex)サーバーに参加してお気軽にお尋ねください。
