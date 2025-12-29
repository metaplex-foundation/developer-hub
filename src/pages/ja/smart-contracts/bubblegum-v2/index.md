---
title: 概要
metaTitle: 概要 | Bubblegum V2
description: Bubblegum V2と圧縮NFTの概要を説明します。
---

Bubblegum V2は、Solana上で圧縮NFT（cNFT）を作成し、操作するための最新のMetaplexプロトコルプログラムです。大規模運用向けに構築されたBubblegum V2は、オリジナルのBubblegumの利点をすべて保持しながら、新しい強力な機能を導入しています。圧縮NFTは、オンチェーンでのデータ保存方法を再考することで、NFT作成を新しい規模のレベルまでスケールさせることを可能にします。 {% .lead %}

{% callout %}
Please note that certain Bubblegum V2 instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

{% protocol-fees program="bubblegum-v2" /%}

{% quick-links %}

{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/bubblegum-v2/sdk" description="お好みの言語またはライブラリを見つけて、圧縮NFTを開始しましょう。" /%}

{% quick-link title="APIリファレンス" icon="CodeBracketSquare" href="https://mpl-bubblegum.typedoc.metaplex.com/" target="_blank" description="特定のものをお探しですか？APIリファレンスをご覧いただき、答えを見つけてください。" /%}

{% /quick-links %}

## Bubblegum V2の新機能

Bubblegum V2は、オリジナルのBubblegumプログラムの基盤の上に構築され、いくつかの強力な新機能を導入しています：

- **凍結・解凍機能**: 2種類の凍結/解凍が利用可能：1) cNFT所有者は、アセットレベルの制御のためにフリーズ権限をリーフデリゲートに委任でき、特定のイベント中の転送を防ぐことや権利確定メカニズムの実装など、さまざまなユースケースに柔軟性を提供します。2) コレクション作成時に`PermanentFreezeDelegate`プラグインが有効になっている場合、プロジェクト作成者は永続フリーズデリゲートを通じてcNFTを凍結・解凍でき、コレクション全体の制御が可能です
- **MPL-Coreコレクション統合**: Bubblegum V2 NFTは、トークンメタデータコレクションに限定されることなく、MPL-Coreコレクションに追加できるようになり、より大きなMetaplexエコシステムとの柔軟性と統合を可能にします。
- **ロイヤリティ強制**: Bubblegum V2は[MPL-Core](/ja/smart-contracts/core)コレクションを使用しているため、`ProgramDenyList`などを使用してcNFTにロイヤリティを強制することが可能です。
- **ソウルバウンドNFT**: cNFTをソウルバウンド（転送不可）にすることが可能になり、所有者のウォレットに永続的に紐づけられます。これは資格、出席証明、身元確認などに最適です。コレクション作成時に`PermanentFreezeDelegate`プラグインを有効にする必要があります。
- **永続転送の許可**: コレクションで`PermanentTransferDelegate`プラグインが有効になっている場合、永続転送デリゲートはリーフ所有者の相互作用なしにcNFTを新しい所有者に転送できます。
- **権限によるバーン**: コレクションに`PermanentBurnDelegate`プラグインが有効になっている場合、デリゲートはリーフ所有者の署名なしにNFTをバーンできます。
- **属性**: MPL-Coreの`attributes`プラグインを使用して、コレクションレベルでの属性データを追加できます。

上記の機能を動作させるために、Bubblegum V2は新しいリーフスキーマ（`LeafSchemaV2`）を導入しています。Bubblegum V2で使用されるリーフについて詳しく学ぶには、以下のセクションをご確認ください。

## LeafSchemaV2

Bubblegum V2は、後方互換性を維持しながら追加機能をサポートする新しいリーフスキーマ（LeafSchemaV2）を導入しています。この新しいスキーマは以下を可能にします：

- 従来のトークンメタデータではなく、MPL-Coreコレクションとの統合
- 凍結/解凍機能のサポート
- ソウルバウンド機能の有効化

プロジェクトは、要件に応じて、Legacy Bubblegumを使用したオリジナルのリーフスキーマまたはBubblegum V2を使用した新しいv2スキーマを選択できます。

新しい`LeafSchemaV2`を使用するには、[`createTreeV2`命令](/ja/smart-contracts/bubblegum-v2/create-trees)を使用して作成する必要があるV2マークルツリーを使用する必要があります。V1マークルツリーは新しいリーフスキーマをサポートせず、V2マークルツリーはV1リーフと互換性がありません。

## マークルツリー、リーフ、証明

圧縮NFTは、**マークルツリー**のコンテキストでのみ存在します。マークルツリーが何であるかは[専用の高度なガイド](/ja/smart-contracts/bubblegum-v2/concurrent-merkle-trees)で説明していますが、この概要では、マークルツリーを**リーフ**と呼ぶハッシュのコレクションと考えることができます。各リーフは、[圧縮NFTのデータをハッシュ化する](/ja/smart-contracts/bubblegum-v2/hashed-nft-data)ことで得られます。

マークルツリー内の各リーフに対して、**証明**と呼ばれるハッシュのリストを提供できます。これにより、誰でも与えられたリーフがそのツリーの一部であることを検証できます。圧縮NFTが更新または転送されるたびに、関連するリーフも変更され、その証明も変更されます。

{% diagram %}

{% node #root label="ルートノード" theme="slate" /%}
{% node #root-hash label="ハッシュ" parent="root" x="56" y="40" theme="transparent" /%}
{% node #node-1 label="ノード 1" parent="root" y="100" x="-200" theme="blue" /%}
{% node #node-1-hash label="ハッシュ" parent="node-1" x="42" y="40" theme="transparent" /%}
{% node #node-2 label="ノード 2" parent="root" y="100" x="200" theme="mint" /%}

{% node #node-3 label="ノード 3" parent="node-1" y="100" x="-100" theme="mint" /%}
{% node #node-4 label="ノード 4" parent="node-1" y="100" x="100" theme="blue" /%}
{% node #node-4-hash label="ハッシュ" parent="node-4" x="42" y="40" theme="transparent" /%}
{% node #node-5 label="ノード 5" parent="node-2" y="100" x="-100" /%}
{% node #node-6 label="ノード 6" parent="node-2" y="100" x="100" /%}

{% node #leaf-1 label="リーフ 1" parent="node-3" y="100" x="-45" /%}
{% node #leaf-2 label="リーフ 2" parent="node-3" y="100" x="55" /%}
{% node #leaf-3 label="リーフ 3" parent="node-4" y="100" x="-45" theme="blue" /%}
{% node #leaf-4 label="リーフ 4" parent="node-4" y="100" x="55" theme="mint" /%}
{% node #leaf-5 label="リーフ 5" parent="node-5" y="100" x="-45" /%}
{% node #leaf-6 label="リーフ 6" parent="node-5" y="100" x="55" /%}
{% node #leaf-7 label="リーフ 7" parent="node-6" y="100" x="-45" /%}
{% node #leaf-8 label="リーフ 8" parent="node-6" y="100" x="55" /%}
{% node #nft label="NFTデータ" parent="leaf-3" y="100" x="-12" theme="blue" /%}

{% node #proof-1 label="リーフ 4" parent="nft" x="200" theme="mint" /%}
{% node #proof-2 label="ノード 3" parent="proof-1" x="90" theme="mint" /%}
{% node #proof-3 label="ノード 2" parent="proof-2" x="97" theme="mint" /%}
{% node #proof-legend label="証明" parent="proof-1" x="-6" y="-20" theme="transparent" /%}

{% edge from="node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-2" to="root" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}

{% edge from="node-3" to="node-1" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="node-4" to="node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-6" to="node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="node-5" to="node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="node-4" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="leaf-3" to="node-4" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-5" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="nft" to="leaf-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true label="ハッシュ" /%}

{% /diagram %}

このように、マークルツリーは、与えられた圧縮NFTが存在することを誰でも検証できるオンチェーン構造として機能します。これらは、非常にスケーラブルにするNFTデータを保存せずにこれを行います。

これは重要な質問をもたらします：NFTデータはどこに保存されているのでしょうか？

## Metaplex DAS API

新しい圧縮NFTをミントすると、そのデータがハッシュ化され、マークルツリーに新しいリーフとして追加されます。しかし、それだけではありません。さらに、NFT全体のデータは圧縮NFTを作成したトランザクションに保存されます。同様に、圧縮NFTが更新されると、その更新されたデータは、再度、変更ログとしてトランザクションに保存されます。そのため、そのデータを追跡するアカウントはありませんが、台帳内のすべての以前のトランザクションを見て、その情報を見つけることができます。

{% diagram %}

{% node #tx-1 label="トランザクション 1" /%}
{% node #tx-2 label="トランザクション 2" parent="tx-1" y="50" /%}
{% node #tx-3 label="トランザクション 3" parent="tx-2" y="50" /%}
{% node #tx-4 label="トランザクション 4" parent="tx-3" y="50" /%}
{% node #tx-5 label="トランザクション 5" parent="tx-4" y="50" /%}
{% node #tx-rest label="..." parent="tx-5" y="50" /%}

{% node #nft-1 label="初期NFTデータ" parent="tx-2" x="300" theme="blue" /%}
{% node #nft-2 label="NFTデータ変更ログ" parent="tx-3" x="300" theme="blue" /%}
{% node #nft-3 label="NFTデータ変更ログ" parent="tx-5" x="300" theme="blue" /%}

{% edge from="nft-1" to="tx-2" label="保存先" /%}
{% edge from="nft-2" to="tx-3" label="保存先" /%}
{% edge from="nft-3" to="tx-5" label="保存先" /%}

{% /diagram %}

1つのNFTのデータを取得するためだけに、毎回何百万ものトランザクションをクロールすることは、確実に最良のユーザー体験ではありません。したがって、圧縮NFTは、この情報をリアルタイムでインデックス化し、エンドユーザーからこれを抽象化するために一部のRPCに依存しています。圧縮NFTの取得を可能にする結果のRPC APIを**Metaplex DAS API**と呼びます。

すべてのRPCがDAS APIをサポートしているわけではないことに注意してください。そのため、アプリケーションで圧縮NFTを使用する際に適切なRPCを選択するために、["Metaplex DAS API RPC"](/ja/rpc-providers)ページに興味があるかもしれません。

これについては、高度な["NFTデータの保存とインデックス化"](/ja/smart-contracts/bubblegum-v2/stored-nft-data)ガイドで詳しく説明しています。

## 機能

NFTデータがアカウント内に存在しないにもかかわらず、圧縮NFTに対してさまざまな操作を実行することは依然として可能です。これは、現在のNFTデータをリクエストし、そのハッシュ化されたリーフがマークルツリーで有効であることを確認することで可能になります。そのため、圧縮NFTで以下の操作を実行できます：

- 関連するコレクションを持つまたは持たない[cNFTのミント](/ja/smart-contracts/bubblegum-v2/mint-cnfts)。
- [cNFTの転送](/ja/smart-contracts/bubblegum-v2/transfer-cnfts)。
- [cNFTのデータまたはコレクションの更新](/ja/smart-contracts/bubblegum-v2/update-cnfts)。
- [cNFTのバーン](/ja/smart-contracts/bubblegum-v2/burn-cnfts)。
- [cNFTのデリゲート](/ja/smart-contracts/bubblegum-v2/delegate-cnfts)。
- [cNFTコレクションの検証と検証解除](/ja/smart-contracts/bubblegum-v2/verify-collections)。
- [cNFTの作成者の検証と検証解除](/ja/smart-contracts/bubblegum-v2/verify-creators)。
- [cNFTの凍結と解凍](/ja/smart-contracts/bubblegum-v2/freeze-cnfts)。
- [cNFTをソウルバウンドにする](/ja/smart-contracts/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft)。

## 次のステップ

圧縮NFTが高レベルでどのように機能し、Bubblegum V2の新機能について理解したので、圧縮NFTとの相互作用に使用できるさまざまな言語/フレームワークを列挙した[はじめに](/ja/smart-contracts/bubblegum-v2/sdk)ページをチェックすることをお勧めします。その後、さまざまな[機能ページ](/ja/smart-contracts/bubblegum-v2/create-trees)を使用して、cNFTで実行できる特定の操作について詳しく学ぶことができます。最後に、cNFTとマークルツリーの知識を深めるための[高度なガイド](/ja/smart-contracts/bubblegum-v2/concurrent-merkle-trees)も利用できます。