---
title: 概要
metaTitle: 概要 | キャンディマシン
description: キャンディマシンの高レベルな概要を提供します。
---

MetaplexプロトコルのキャンディマシンはSolanaでの公平なNFTコレクション発売のための主要なミントおよび配布プログラムです。その名前が示すように、キャンディマシンは一時的な構造体として考えることができ、まずクリエイターによって読み込まれ、その後購入者によって空になります。これによりクリエイターは、安全でカスタマイズ可能な方法でデジタル資産をオンチェーン化できます。 {% .lead %}

この名前は、機械的なクランクでコインと引き換えにキャンディを分配する自動販売機を指しています。この場合、キャンディはNFTであり、支払いはSOLまたはSPLトークンです。

{% figure src="/assets/candy-machine/candy-machine-photo.png" alt="典型的なキャンディマシンのAI生成写真" caption="典型的なキャンディマシン" /%}

{% quick-links %}

{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/smart-contracts/candy-machine/getting-started" description="お好みの言語またはライブラリを見つけて、キャンディマシンを始めましょう。" /%}
{% quick-link title="APIリファレンス" icon="CodeBracketSquare" href="https://mpl-candy-machine.typedoc.metaplex.com/" target="_blank" description="何か特定のものをお探しですか？私たちがサポートします。" /%}
{% /quick-links %}

{% callout %}
このドキュメントはキャンディマシンV3を参照しており、MetaplexトークンメタデータNFTをミントするために使用できます。代わりにコアアセットを作成したい場合は、[コアキャンディマシン](/ja/smart-contracts/core-candy-machine)をご覧ください。
{% /callout %}

## はじめに

2022年9月までに、SolanaのすべてのNFTの78%がMetaplexのキャンディマシンを通じてミントされました。これには、Solanaエコシステムのよく知られたNFTプロジェクトのほとんどが含まれています。

以下は提供される機能の一部です。

- SOL、NFT、またはSolanaトークンでの支払いを受け入れ。
- 開始/終了日、ミント制限、サードパーティ署名者などによる発売の制限。
- 設定可能なボット税やCaptchaなどのゲートキーパーによるボットからの発売保護。
- 特定のNFT/トークン保有者または選定されたウォレットのリストへのミント制限。
- 異なるルールセットを持つ複数のミントグループの作成。
- ユーザーが情報を検証できるようにしながら、発売後のNFT公開。
- その他多数！

興味をお持ちですか？キャンディマシンの仕組みについて少しツアーをしましょう！

## キャンディマシンのライフサイクル

最初のステップは、クリエイターが新しいキャンディマシンを作成し、好みに合わせて設定することです。

{% diagram %}
{% node #action label="1. 作成・設定" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="キャンディマシン" theme="blue" /%}
{% node label="設定" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

作成されたキャンディマシンは独自の設定を追跡し、すべてのNFTがどのようにミントされるべきかを理解するのに役立ちます。例えば、このキャンディマシンからミントされたすべてのNFTに割り当てられる`creators`パラメーターがあります。次のページでキャンディマシンの作成と設定について、コード例を含めてさらに詳しく見ていきます：[キャンディマシン設定](/ja/smart-contracts/candy-machine/settings)と[キャンディマシン管理](/ja/smart-contracts/candy-machine/manage)。

しかし、どのNFTがそのキャンディマシンからミントされるべきかはまだ分かりません。言い換えると、キャンディマシンがまだ読み込まれていません。したがって、次のステップはキャンディマシンにアイテムを挿入することです。

{% diagram %}
{% node #action-1 label="1. 作成・設定" theme="pink" /%}
{% node #action-2 label="2. アイテム挿入" parent="action-1" y="50" theme="pink" /%}
{% node parent="action-1" x="250" %}
{% node #candy-machine label="キャンディマシン" theme="blue" /%}
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

各アイテムは2つのパラメーターで構成されています：

- `name`: NFTの名前。
- `uri`: NFTの[JSONメタデータ](https://metaplex.com/docs/token-metadata/token-standard#the-non-fungible-standard)を指すURI。これは、JSONメタデータがオンチェーン（例：Arweave、IPFS）またはオフチェーン（例：AWS、独自サーバー）のストレージプロバイダーを通じて既にアップロードされていることを意味します。

その他のすべてのパラメーターはすべてのNFT間で共有され、重複を避けるためにキャンディマシンの設定に直接保持されます。詳細は[アイテム挿入](/ja/smart-contracts/candy-machine/insert-items)をご覧ください。

この時点では、まだ実際のNFTは作成されていないことに注目してください。私たちは単に、ミント時に**オンデマンドでNFTを作成**するために必要なすべてのデータでキャンディマシンを読み込んでいるだけです。これが次のステップにつながります。

{% diagram %}
{% node #action-1 label="1. 作成・設定" theme="pink" /%}
{% node #action-2 label="2. アイテム挿入" parent="action-1" y="50" theme="pink" /%}

{% node parent="action-1" x="250" %}
{% node #candy-machine label="キャンディマシン" theme="blue" /%}
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

{% node #nft-1 parent="mint" x="120" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}

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

キャンディマシンが読み込まれ、すべての事前設定された条件が満たされると、ユーザーはそこからNFTをミントし始めることができます。この時点でのみ、NFTがSolanaブロックチェーン上で作成されます。ミントする前に、一部のユーザーはCaptchaの実行やMerkle Proofの送信などの追加の検証ステップを実行する必要がある場合があることに注意してください。詳細は[ミント](/ja/smart-contracts/candy-machine/mint)をご覧ください。

すべてのNFTがキャンディマシンからミントされると、その目的を果たし、ブロックチェーン上の一部のストレージスペースを解放し、一部のレントを取り戻すために安全に削除することができます。詳細は[キャンディマシン管理](/ja/smart-contracts/candy-machine/manage)をご覧ください。

{% diagram %}
{% node #action-1 label="4. 削除" theme="pink" /%}
{% node parent="action-1" x="150" %}
{% node #candy-machine label="キャンディマシン" theme="blue" /%}
{% node label="設定" /%}
{% node #item-1 label="アイテム 1" /%}
{% node #item-2 label="アイテム 2" /%}
{% node #item-3 label="アイテム 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% node #nft-1 parent="candy-machine" x="200" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

## キャンディガード

キャンディマシンの仕組みを理解したところで、クリエイターがキャンディマシンのミントプロセスを保護しカスタマイズする様々な方法を掘り下げてみましょう。

クリエイターは「ガード」と呼ばれるものを使用してキャンディマシンにさまざまな機能を追加できます。Metaplexキャンディマシンには、[合計21のデフォルトガード](/ja/smart-contracts/candy-machine/guards)を含む**キャンディガード**と呼ばれる追加のSolanaプログラムが付属しています。追加プログラムを使用することで、高度な開発者は主要なキャンディマシンプログラムに依存しながら、独自のカスタムガードを作成するためにデフォルトのキャンディガードプログラムをフォークできます。

各ガードは自由に有効化および設定できるため、クリエイターは必要な機能を選択できます。すべてのガードを無効にすることは、誰でもいつでも無料でNFTをミントできるようにすることと同等であり、これはおそらく私たちが望むものではありません。したがって、より現実的な例を作成するためにいくつかのガードを見てみましょう。

キャンディマシンに次のガードがあるとします：

- **SOL支払い**: このガードは、ミントウォレットが設定されたSOL量を設定された宛先ウォレットに支払う必要があることを保証します。
- **開始日**: このガードは、設定された時間後にのみミントが開始できることを保証します。
- **ミント制限**: このガードは、各ウォレットが設定された数以上ミントできないことを保証します。
- **ボット税**: このガードは少し特別です。何も保護しませんが、ボットがキャンディマシンをミントすることを防ぐために失敗したミントの動作を変更します。このガードが有効化されると、他の有効化されたガードがミントの検証に失敗した場合、ミントを試みたウォレットから小額の設定されたSOLを請求します。

最終的に得られるのは、SOLを請求し、特定の時間に開始され、ウォレットごとに限られた量のミントのみを許可するボット保護されたキャンディマシンです。これが具体的な例です。

{% diagram %}
{% node %}
{% node #candy-machine label="キャンディマシン" theme="blue" /%}
{% node label="設定" /%}
{% node #items label="アイテム" /%}
{% node #guards %}
ガード:

- SOL支払い (0.1 SOL)
- 開始日 (1月6日)
- ミント制限 (1)
- ボット税 (0.01 SOL)

{% /node %}
{% /node %}

{% node parent="candy-machine" x="250" %}
{% node #mints label="ミント" theme="pink" /%}
{% node #mint-1 label="#1: ウォレットA (1 SOL) 1月5日" theme="pink" /%}
{% node #mint-2 label="#2: ウォレットB (3 SOL) 1月6日" theme="pink" /%}
{% node #mint-3 label="#3: ウォレットB (2 SOL) 1月6日" theme="pink" /%}
{% node #mint-4 label="#4: ウォレットC (0.5 SOL) 1月6日" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
早すぎます {% .text-xs %} \
ボット税が請求されました
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="NFT" theme="blue" /%}
{% node #fail-3 parent="nft-2" y="50" theme="red" %}
すでに1つミント済み {% .text-xs %} \
ボット税が請求されました
{% /node %}
{% node #fail-4 parent="fail-3" y="50" theme="red" %}
SOLが不足 {% .text-xs %} \
ボット税が請求されました
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

ご覧のように、21を超えるデフォルトガードとカスタムガードを作成する機能により、クリエイターは自分にとって重要な機能を厳選し、完璧なキャンディマシンを構成できます。これは非常に強力な機能であるため、多くのページを割いています。ガードについて詳しく知るための最適な場所は[キャンディガード](/ja/smart-contracts/candy-machine/guards)ページです。

## 次のステップ

これはキャンディマシンの良い概要を提供しますが、発見し学ぶことがまだたくさんあります。このキャンディマシンドキュメントの他のページで期待できる内容は以下の通りです。

- [はじめに](/ja/smart-contracts/candy-machine/getting-started)。キャンディマシンを管理するために使用できるさまざまなライブラリとSDKをリストします。
- [キャンディマシン設定](/ja/smart-contracts/candy-machine/settings)。キャンディマシン設定を非常に詳細に説明します。
- [キャンディマシン管理](/ja/smart-contracts/candy-machine/manage)。キャンディマシンの管理方法を説明します。
- [アイテム挿入](/ja/smart-contracts/candy-machine/insert-items)。キャンディマシンにアイテムを読み込む方法を説明します。
- [キャンディガード](/ja/smart-contracts/candy-machine/guards)。ガードの動作と有効化方法を説明します。
- [ガードグループ](/ja/smart-contracts/candy-machine/guard-groups)。複数のガードグループの設定方法を説明します。
- [特別なガード命令](/ja/smart-contracts/candy-machine/guard-route)。ガード固有の命令の実行方法を説明します。
- [ミント](/ja/smart-contracts/candy-machine/mint)。キャンディマシンからのミント方法とミント前要件の処理方法を説明します。
- [リファレンス](/ja/smart-contracts/candy-machine/references)。キャンディマシンに関連するAPIリファレンスをリストします。
