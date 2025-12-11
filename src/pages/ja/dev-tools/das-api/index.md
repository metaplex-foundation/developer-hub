---
title: DAS API
metaTitle: 概要 | DAS API
description: Metaplexデジタルアセットスタンダードにアクセスするために使用されるDAS APIクライアント。
---

Metaplex Digital Asset Standard (DAS) APIは、Solana上のデジタルアセットと相互作用するための統一インターフェースを表し、3つのMetaplexスタンダード（Core、Token Metadata、圧縮（Bubblegum）アセット）すべてをサポートします。これにより、アセットデータへの簡単なアクセスとフィルタリングが可能になります。これは特に以下の場合に有用です：
- **Coreアセット**：プラグインが自動的に派生され、コレクションのプラグインデータが含まれる場合
- **圧縮NFT**：詳細なアカウントデータがオンチェーンに保存されていないが、RPCプロバイダーが管理するデータストアに保存されている場合
- **少ないコールでのデータ取得**：オフチェーンメタデータもスタンダードを通じてインデックス化されるため

このAPIは、アセットデータを提供するためにRPCが実装する一連のメソッドを定義します。大部分の場合、データはMetaplex Digital Asset RPCインフラストラクチャを使用してインデックス化されます。

## Core拡張機能
一般的なDAS SDKに加えて、[MPL Core](/ja/core)用の拡張機能が作成されており、MPL Core SDKでさらに使用するための正しいタイプを直接返します。また、コレクションから継承されたアセット内のプラグインを自動的に派生し、[DAS-to-Core型変換](/ja/das-api/core-extension/convert-das-asset-to-core)のための機能を提供します。

{% quick-links %}

{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/das-api/getting-started" description="お好みの言語やライブラリを見つけて、基本的なプログラムの開始方法を学習します。" /%}

{% quick-link title="メソッド" icon="CodeBracketSquare" href="/ja/das-api/methods" description="データ取得のためのDAS APIメソッド。" /%}

{% quick-link title="MPL Core拡張機能" icon="CodeBracketSquare" href="/ja/das-api/core-extension" description="MPL Coreアセットを簡単に取得・解析する" /%}

{% /quick-links %}