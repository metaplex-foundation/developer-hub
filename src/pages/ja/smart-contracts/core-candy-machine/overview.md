---
title: プログラム概要
metaTitle: プログラム概要 | Core Candy Machine
description: Core Candy Machineプログラムとその機能セットの概要。ミント体験の作成に役立ちます。
---

## はじめに

2022年9月までに、Solana上のすべてのNFTの78%がMetaplexのCandy Machineを通してミントされました。これには、Solanaエコシステムで最もよく知られたNFTプロジェクトの大部分が含まれます。2024年にMetaplexは、SolanaでNFTを再定義する`Core`プロトコルを導入し、それに伴い`Core`標準に対応する同じミント機能を提供する新しいCandy Machineが登場しました。

以下にその機能をいくつか紹介します。

- SOL、NFT、またはあらゆるSolanaトークンでの支払いを受け入れ。
- 開始/終了日、ミント制限、サードパーティ署名者などによるローンチ制限。
- 設定可能なボット税やCaptchaなどのゲートキーパーによるボット保護。
- 特定のアセット/NFT/トークンホルダーまたは厳選されたウォレットリストへのミント制限。
- 異なるルールセットを持つ複数のミントグループの作成。
- ローンチ後にアセットを公開しつつ、ユーザーがその情報を検証できる機能。
- その他多数の機能！

興味を持たれましたか？`Core Candy Machines`がどのように機能するかご案内しましょう！

## Core Candy Machineのライフサイクル

最初のステップは、クリエイターが新しいCore Candy Machineを作成し、希望通りに設定することです。

{% diagram %}
{% node #action label="1. 作成・設定" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="設定" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

作成されたCore Candy Machineは独自の設定を追跡し、すべてのNFTがどのように作成されるべきかを理解する助けとなります。例えば、このCore Candy Machineから作成されるすべてのアセットに割り当てられる`collection`パラメータがあります。Core Candy Machineの作成と設定の詳細については、メニューの**機能**セクションで見ていきます。

しかし、まだどのアセットがそのCore Candy Machineからミントされるべきかはわかりません。つまり、Core Candy Machineは現在ロードされていません。次のステップは、アイテムを挿入することです。

{% diagram %}
{% node #action-1 label="1. 作成・設定" theme="pink" /%}
{% node #action-2 label="2. アイテム挿入" parent="action-1" y="50" theme="pink" /%}
{% node parent="action-1" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="設定" /%}
{% node #item-1 label="アイテム 1" /%}
{% node #item-2 label="アイテム 2" /%}
{% node #item-3 label="アイテム 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% /diagram %}

各アイテムは2つのパラメータで構成されます：

- `name`: アセットの名前。
- `uri`: アセットの[JSONメタデータ](https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard)を指すURI。これは、JSONメタデータが既にオンチェーン（例：Arweave、IPFS）またはオフチェーン（例：AWS、独自サーバー）ストレージプロバイダーを介してアップロードされていることを意味します。SugarやJS SDKなどのCandy Machine作成ツールは、これを支援するヘルパーを提供します。

その他のパラメータはアセット間で共有されるため、繰り返しを避けるためにCandy Machineの設定に直接保持されます。詳細は[アイテムの挿入](/ja/core-candy-machine/insert-items)を参照してください。

この時点では、実際のアセットはまだ作成されていないことに注意してください。我々は単に、ミント時に**オンデマンドでアセットを作成する**ために必要なすべてのデータをCandy Machineに読み込んでいるだけです。これが次のステップにつながります。

{% diagram %}
{% node #action-1 label="1. 作成・設定" theme="pink" /%}
{% node #action-2 label="2. アイテム挿入" parent="action-1" y="50" theme="pink" /%}

{% node parent="action-1" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="設定" /%}
{% node #item-1 label="アイテム 1" /%}
{% node #item-2 label="アイテム 2" /%}
{% node #item-3 label="アイテム 3" /%}
{% node #item-rest label="..." /%}
{% /node %}

{% node parent="candy-machine" x="180" y="20" %}
{% node #mint label="3. ミント" theme="pink" /%}
{% node #mint-1 label="ミント #1" theme="pink" /%}
{% node #mint-2 label="ミント #2" theme="pink" /%}
{% node #mint-3 label="ミント #3" theme="pink" /%}
{% /node %}

{% node #nft-1 parent="mint" x="120" label="アセット" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="アセット" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="アセット" theme="blue" /%}

{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% edge from="item-1" to="mint-1" /%}
{% edge from="item-2" to="mint-2" /%}
{% edge from="item-3" to="mint-3" /%}
{% edge from="mint-1" to="nft-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="nft-3" path="bezier" /%}
{% /diagram %}

Candy Machineがロードされ、事前設定されたすべての条件が満たされると、ユーザーはそこからアセットをミントできるようになります。アセットがSolanaブロックチェーン上に作成されるのはこの時点のみです。なお、ミント前に一部のユーザーはCaptchaの実行やMerkle Proofの送信など、追加の検証手順を実行する必要がある場合があります。詳細は[ミント](/ja/core-candy-machine/mint)を参照してください。

Candy Machineからすべてのアセットがミントされると、その目的を果たし、安全に削除してブロックチェーン上のストレージスペースを解放し、レントを回収できます。詳細は[Candy Machineの引き出し](/ja/core-candy-machine/withdrawing-a-candy-machine)を参照してください。

{% diagram %}
{% node #action-1 label="4. 削除" theme="pink" /%}
{% node parent="action-1" x="150" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="設定" /%}
{% node #item-1 label="アイテム 1" /%}
{% node #item-2 label="アイテム 2" /%}
{% node #item-3 label="アイテム 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% node #nft-1 parent="candy-machine" x="200" label="アセット" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="アセット" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="アセット" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

## Core Candy Machineアカウント構造

保存されるデータとそのデータがユーザーにとって果たす役割について説明します。

{% totem %}
{% totem-accordion title="オンチェーンCore Candy Machineデータ構造" %}

MPL Core Assetのオンチェーンアカウント構造。[リンク](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 名前           | タイプ    | サイズ | 説明                                              |     |
| -------------- | ------- | ---- | -------------------------------------------------------- | --- |
| version        | u8      | 1    | Candy Machineのバージョン                              |     |
| features       | [u8; 6] | 6    | Candy Machineで有効になっている機能フラグ     |     |
| authority      | Pubkey  | 32   | Candy Machineの管理者                       |     |
| mint_authority | Pubkey  | 32   | Candy Machineのミント管理者                  |     |
| collection     | Pubkey  | 32   | Candy Machineに割り当てられたコレクションアドレス     |     |
| items_redeemed | u64     |      | Candy Machineから引き出されたアイテム数 |     |

{% /totem-accordion %}
{% /totem %}

## Candy Guards

Core Candy Machineがどのように機能するかを理解したところで、クリエイターがCore Candy Machineのミントプロセスを保護・カスタマイズするさまざまな方法について掘り下げてみましょう。

クリエイターは「**ガード**」と呼ばれるものを使用して、Core Candy Machineにさまざまな機能を追加できます。Metaplex Core Candy Machineには、**Candy Guard**と呼ばれる追加のSolanaプログラムが付属しており、[**合計23のデフォルトガード**](/ja/core-candy-machine/guards)が含まれています。追加プログラムを使用することで、高度な開発者はデフォルトのCandy Guardプログラムをフォークして独自のカスタムガードを作成しながら、メインのCandy Machineプログラムに依存し続けることができます。

各ガードは自由に有効化・設定できるため、クリエイターは必要な機能を選択できます。すべてのガードを無効にすることは、誰でもいつでも無料でNFTをミントできるようにすることに相当しますが、これはおそらく望ましいことではありません。より現実的な例を作成するために、いくつかのガードを見てみましょう。

Core Candy Machineに以下のガードがあるとします：

- **Sol Payment**: このガードは、ミントウォレットが設定された宛先ウォレットに設定された量のSOLを支払うことを確保します。
- **Start Date**: このガードは、設定された時刻以降にのみミントが開始できることを確保します。
- **Mint Limit**: このガードは、各ウォレットが設定された量を超えてミントできないことを確保します。
- **Bot Tax**: このガードは少し特殊です。何かをガードするものではありませんが、失敗したミントの動作を変更してボットがCandy Machineをミントするのを防ぎます。このガードが有効化されている場合、他の有効化されたガードがミントの検証に失敗すると、ミントを試行したウォレットに少額の設定されたSOL量を請求します。

最終的に、ボット保護され、SOLを請求し、特定の時刻にローンチし、ウォレットあたりの制限されたミント量のみを許可するCandy Machineが完成します。具体的な例を以下に示します。

{% diagram %}
{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="設定" /%}
{% node #items label="アイテム" /%}
{% node #guards %}
ガード:

- Sol Payment (0.1 SOL)
- Start Date (1月6日)
- Mint Limit (1)
- Bot Tax (0.01 SOL)

{% /node %}
{% /node %}

{% node parent="candy-machine" x="250" %}
{% node #mints label="アセット" theme="pink" /%}
{% node #mint-1 label="#1: ウォレット A (1 SOL) 1月5日" theme="pink" /%}
{% node #mint-2 label="#2: ウォレット B (3 SOL) 1月6日" theme="pink" /%}
{% node #mint-3 label="#3: ウォレット B (2 SOL) 1月6日" theme="pink" /%}
{% node #mint-4 label="#4: ウォレット C (0.5 SOL) 1月6日" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
早すぎます {% .text-xs %} \
ボット税が請求されます
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="アセット" theme="blue" /%}
{% node #fail-3 parent="nft-2" y="50" theme="red" %}
既に1つミント済み {% .text-xs %} \
ボット税が請求されます
{% /node %}
{% node #fail-4 parent="fail-3" y="50" theme="red" %}
SOLが不足 {% .text-xs %} \
ボット税が請求されます
{% /node %}

{% edge from="candy-machine" to="mint-1" /%}
{% edge from="candy-machine" to="mint-2" /%}
{% edge from="candy-machine" to="mint-3" /%}
{% edge from="candy-machine" to="mint-4" /%}
{% edge from="mint-1" to="fail-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="fail-3" path="bezier" /%}
{% edge from="mint-4" to="fail-4" path="bezier" /%}
{% /diagram %}

ご覧のように、23以上のデフォルトガードとカスタムガードを作成する能力により、クリエイターは重要な機能を厳選し、完璧なCandy Machineを構成できます。これは非常に強力な機能であり、多くのページを割いて説明しています。ガードについて詳しく知るための最適な出発点は、[Candy Guards](/ja/core-candy-machine/guards)ページです。
最新の変更を文書化します。