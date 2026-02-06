---
title: NFTデータの保存とインデックス化
metaTitle: NFTデータの保存とインデックス化 | Bubblegum V2
description: BubblegumでNFTデータがどのように保存されるかについて詳しく学びます。
---

[概要](/ja/smart-contracts/bubblegum#read-api)で述べたように、圧縮NFT（cNFT）が作成または変更されるたびに、対応するトランザクションが台帳にオンチェーンで記録されますが、cNFTの状態データはアカウントスペースに保存されません。これがcNFTの大幅なコスト削減の理由ですが、利便性と使いやすさのために、cNFTの状態データはRPCプロバイダーによってインデックス化され、**Metaplex DAS API**を通じて利用できます。

Metaplexは、DAS APIの[参考実装](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)を作成しており、一部のRPCプロバイダーは特定の実装にこのコードの一部またはすべてを使用していますが、他のRPCプロバイダーは独自のものを作成しています。Metaplex DAS APIをサポートする他のRPCプロバイダーのリストについては、["Metaplex DAS API RPC"](/ja/rpc-providers)ページを参照してください。

Metaplexのリファレンス実装であるDAS APIには、以下の主要な項目が含まれています：

* Solanaノーヴォートバリデーター - このバリデーターは、コンセンサスの下でバリデーター台帳とアカウントデータへの安全なアクセスのみを持つように構成されています。
* Geyserプラグイン - プラグインは「Plerkle」と呼ばれ、バリデーター上で実行されます。プラグインは、アカウントの更新、スロットステータスの更新、トランザクション、またはブロックメタデータの更新があるたびに通知されます。cNFTインデックス化の目的では、プラグインの`notify_transaction`メソッドは、BubblegumまたはSPLアカウント圧縮トランザクションがバリデーター上で確認されるたびにトランザクションデータを提供するために使用されます。実際には、これらのトランザクションはSPLノープ（「ノー・オペレーション」）プログラムから来ており、これはSPLアカウント圧縮とBubblegumによって、イベントをSPLノープ命令データに変換することでログの切り捨てを回避するために使用されます。
* Redisクラスター - Redisストリームは、各タイプの更新（アカウント、トランザクションなど）のキューとして使用されます。Geyserプラグインは、これらのストリームに入るデータの生産者です。Geyserプラグインは、Flatbuffersプロトコルを使用するPlerkleシリアル化フォーマットにデータを変換し、シリアル化されたレコードを適切なRedisデータストリームに配置します。
* インジェスタープロセス - これは、Redisストリームからのデータのコンシューマーです。インジェスターは、シリアル化されたデータを解析し、それをPostgresデータベースに保存されるSeaORMデータオブジェクトに変換します。
* Postgresデータベース - アセットを表すいくつかのデータベーステーブル、および確認したマークルツリーの状態を保存するための変更ログテーブルがあります。後者は、Bubblegum命令で使用されるアセット証明を要求する際に使用されます。マークルツリーの変更のためのシーケンス番号も、DAS APIがトランザクションを順不同で処理できるようにするために使用されます。
* APIプロセス - エンドユーザーがRPCプロバイダーからアセットデータを要求する際、APIプロセスはデータベースからアセットデータを取得し、リクエストのためにそれを提供できます。

{% diagram %}
{% node %}
{% node #validator label="バリデーター" theme="indigo" /%}
{% node theme="dimmed" %}
Geyserプラグインを実行し \
トランザクション、アカウント \
更新などで通知される。
{% /node %}
{% /node %}

{% node x="200" parent="validator" %}
{% node #messenger label="メッセージバス" theme="blue" /%}
{% node theme="dimmed" %}
各種更新のキューとしての \
Redisストリーム。
{% /node %}
{% /node %}

{% node x="200" parent="messenger" %}
{% node #ingester label="インジェスタープロセス" theme="indigo" /%}
{% node theme="dimmed" %}
データを解析し \
データベースに保存
{% /node %}
{% /node %}

{% node x="28" y="150" parent="ingester" %}
{% node #database label="データベース" theme="blue" /%}
{% node theme="dimmed" %}
Postgres \
データベース
