---
title: Core Candy Machineプログラム概要
metaTitle: プログラム概要 | Core Candy Machine
description: Solana上でMPL Core Assetコレクションをローンチするための、Core Candy Machineプログラムのアーキテクチャ、ライフサイクル、アカウント構造、ガードシステムの包括的な概要。
keywords:
  - core candy machine
  - candy machine overview
  - solana nft launch
  - mpl core candy machine
  - candy guard
  - nft minting
  - core assets
  - metaplex candy machine
  - candy machine lifecycle
  - candy machine account structure
  - guard system
  - config line settings
  - hidden settings
  - mint authority
  - candy machine architecture
  - solana nft distribution
  - bot protection
  - guard groups
about:
  - Core Candy Machine
  - Candy Guard
  - MPL Core
  - Solana NFT Launch
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machineとは何ですか？Candy Machine V3とどう違いますか？
    a: Core Candy MachineはMPL Core Assets専用に設計された最新のMetaplexミントプログラムです。Candy Machine V3は旧標準のToken Metadata NFTをミントします。Core Candy MachineはMPL Coreの単一アカウントモデルを使用するため、より軽量でコスト効率の高いアセットを生成します。
  - q: Core Candy Machineで利用可能なガードはいくつありますか？
    a: Core Candy MachineはコンパニオンであるCandy Guardプログラムを通じて23以上のデフォルトガードを提供します。これらのガードは支払い（SOL、SPLトークン、NFT）、アクセス制御（許可リスト、トークンゲート、NFTゲート）、スケジューリング（開始日・終了日）、ボット保護（ボット税、ゲートキーパー）をカバーします。
  - q: Core Candy Machineでカスタムガードを使用できますか？
    a: はい。ガードシステムは別のCandy Guardプログラムとして実装されており、フォーク可能です。開発者はメインのCandy Machineプログラムのミントロジックに依存しながら、カスタムガードを作成できます。
  - q: すべてのアイテムがミントされた後、Core Candy Machineはどうなりますか？
    a: すべてのアイテムがミントされた後、Candy Machineを削除（引き出し）してオンチェーンストレージのレントを回収できます。この操作は不可逆で、レントに使用されたSOLが権限ウォレットに返還されます。
  - q: Core Candy Machineにロードする前にNFTを作成する必要がありますか？
    a: いいえ。Candy Machineにロードするのはアイテムメタデータ（名前とURIのペア）であり、実際のオンチェーンアセットではありません。Core Assetsはユーザーがミントする瞬間にのみオンチェーンに作成されます。
  - q: Candy Machine権限とミント権限の違いは何ですか？
    a: 権限（authority）はCandy Machineの設定管理（設定の更新、アイテムの挿入、引き出し）を制御します。ミント権限はミントをトリガーできる人を制御します。通常、ミント前にガード検証が強制されるよう、Candy Guardアカウントがミント権限として設定されます。
---

## 概要

Core Candy Machineは、Solana上で[MPL Core](/ja/smart-contracts/core) Assetコレクションをローンチするために特化したMetaplexのミント・配布プログラムです。アイテムメタデータのロードからガード付きミント、ローンチ後のクリーンアップまで、NFTドロップの完全なライフサイクルを管理します。

- 支払い、アクセス制御、スケジューリング、ボット保護のための23以上のコンポーザブルな[ガード](/ja/smart-contracts/core-candy-machine/guards)をサポート
- [MPL Core Assets](/ja/smart-contracts/core)（単一アカウントNFT）をミント。レガシーToken Metadata NFTではありません
- アイテムはメタデータ参照としてロードされ、オンチェーンアセットはミント時にのみ作成
- 別の[Candy Guard](/ja/smart-contracts/core-candy-machine/guards)プログラムが、カスタムミントワークフロー用のフォーク可能なアクセス制御レイヤーを提供

## はじめに

2022年9月までに、Solana上のすべてのNFTの78%がMetaplexのCandy Machineを通してミントされました。これには、Solanaエコシステムで最もよく知られたNFTプロジェクトの大部分が含まれます。2024年にMetaplexは、SolanaでNFTを再定義する[Core](/ja/smart-contracts/core)プロトコルを導入し、それに伴いCore標準に対応する同じミント機能を提供する新しいCandy Machineが登場しました。

以下にその機能をいくつか紹介します。

- SOL、NFT、またはあらゆるSolanaトークンでの支払いを受け入れ。
- 開始/終了日、ミント制限、サードパーティ署名者などによるローンチ制限。
- 設定可能なボット税やCaptchaなどのゲートキーパーによるボット保護。
- 特定のアセット/NFT/トークンホルダーまたは厳選されたウォレットリストへのミント制限。
- 異なるルールセットを持つ複数のミントグループの作成。
- ローンチ後にアセットを公開しつつ、ユーザーがその情報を検証できる機能。
- その他多数の機能！

{% callout type="note" %}
このページはCore Candy Machineについて説明しています。Core Candy Machineは[MPL Core](/ja/smart-contracts/core) Assetsをミントします。Token Metadata NFTをミントする必要がある場合は、代わりに[Candy Machine V3](/ja/smart-contracts/candy-machine)を参照してください。
{% /callout %}

## Core Candy Machineのライフサイクル

Core Candy Machineのライフサイクルは、作成、アイテムロード、ミント、オプションの引き出しの4つの連続フェーズで構成されます。各フェーズは次のフェーズが開始される前に完了する必要があります。

### フェーズ1 — Candy Machineの作成と設定

最初のステップは、クリエイターが新しいCore Candy Machineを作成し、[コレクション](/ja/smart-contracts/core/collections)アドレス、アイテム数、オプションの[Config Line Settings](/ja/smart-contracts/core-candy-machine/create)または[Hidden Settings](/ja/smart-contracts/core-candy-machine/guides/create-a-core-candy-machine-with-hidden-settings)を含む設定を構成することです。

{% diagram %}
{% node #action label="1. 作成・設定" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="設定" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

作成されたCore Candy Machineは独自の設定を追跡し、すべてのアセットがどのように作成されるべきかを決定します。例えば、このCore Candy Machineから作成されるすべてのアセットに割り当てられる`collection`パラメータがあります。Core Candy Machineの作成と設定の詳細については、[Core Candy Machineの作成](/ja/smart-contracts/core-candy-machine/create)を参照してください。

### フェーズ2 — Candy Machineへのアイテム挿入

作成後、ミントされる各アイテムのメタデータをCandy Machineにロードする必要があります。各アイテムは`name`と、事前にアップロードされたJSONメタデータを指す`uri`で構成されます。

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
- `uri`: アセットの[JSONメタデータ](/ja/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)を指すURI。これは、JSONメタデータが既にオンチェーン（例：Arweave、IPFS）またはオフチェーン（例：AWS、独自サーバー）ストレージプロバイダーを介してアップロードされていることを意味します。Candy Machine作成ツール（[CLI](/ja/dev-tools/cli/cm)やJS SDKなど）は、これを支援するヘルパーを提供します。

その他のパラメータはアセット間で共有されるため、繰り返しを避けるためにCandy Machineの設定に直接保持されます。詳細は[アイテムの挿入](/ja/smart-contracts/core-candy-machine/insert-items)を参照してください。

{% callout type="note" %}
この時点では、実際のオンチェーンアセットは存在しません。Candy Machineはメタデータ参照のみを保存します。アセットはミントの瞬間にSolanaブロックチェーン上に作成されます。
{% /callout %}

### フェーズ3 — Candy Machineからのアセットミント

Candy Machineが完全にロードされ、設定されたすべての[ガード](/ja/smart-contracts/core-candy-machine/guards)条件が満たされると、ユーザーはCore Assetsのミントを開始できます。各ミントはCandy Machineから1つのアイテムを消費し、新しいオンチェーンアセットを作成します。

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

ミント前に、一部のユーザーはCaptchaの実行やMerkle Proofの送信など、追加の検証手順を実行する必要がある場合があります。詳細は[ミント](/ja/smart-contracts/core-candy-machine/mint)を参照してください。

### フェーズ4 — Candy Machineの引き出し

すべてのアセットがミントされた後、Candy Machineはその目的を果たし、削除してオンチェーンストレージのレントを回収できます。権限が回収されたSOLを受け取ります。

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

{% callout type="warning" %}
Candy Machineの引き出しは不可逆です。ミントプロセスが完了したことが確実な場合にのみ引き出しを行ってください。詳細は[Candy Machineの引き出し](/ja/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)を参照してください。
{% /callout %}

## Core Candy Machineアカウント構造

Core Candy Machineアカウントは、ミントプロセスを管理するために必要なすべての設定と状態データを保存します。オンチェーンデータ構造は、マシンバージョン、有効な機能、権限キー、コレクションバインディング、引き換え数を追跡します。

{% totem %}
{% totem-accordion title="オンチェーンCore Candy Machineデータ構造" %}

Core Candy Machineのオンチェーンアカウント構造。[GitHubで表示](https://github.com/metaplex-foundation/mpl-core-candy-machine)

| 名前           | タイプ    | サイズ | 説明                                              |
| -------------- | ------- | ---- | -------------------------------------------------------- |
| version        | u8      | 1    | Candy Machineアカウントのバージョン                     |
| features       | [u8; 6] | 6    | Candy Machineで有効になっている機能フラグ              |
| authority      | Pubkey  | 32   | Candy Machineを管理する権限ウォレット      |
| mint_authority | Pubkey  | 32   | ミント権限 — 通常はCandy Guardアカウント   |
| collection     | Pubkey  | 32   | 作成時に割り当てられたMPL Coreコレクションアドレス     |
| items_redeemed | u64     | 8    | このマシンからミントされたアイテムの数   |

{% /totem-accordion %}
{% /totem %}

**authority**は、設定の更新、アイテムの挿入、レントの引き出しなどの管理操作を制御します。**mint_authority**はミント命令をトリガーできる人を制御します。[Candy Guard](/ja/smart-contracts/core-candy-machine/guards)がアタッチされると、ミント権限となり、ミントが進行する前にすべてのガード検証が通過する必要があります。

## Candy Guardシステム

Candy Guardプログラムは、Core Candy Machineのミントにコンポーザブルで設定可能なアクセス制御を提供するコンパニオンSolanaプログラムです。ガードはミントプロセスを制限または変更するモジュラールールです。

クリエイターは「**ガード**」と呼ばれるものを使用して、Core Candy Machineにさまざまな機能を追加できます。Metaplex Core Candy Machineには、**Candy Guard**と呼ばれる追加のSolanaプログラムが付属しており、[**合計23以上のデフォルトガード**](/ja/smart-contracts/core-candy-machine/guards)が含まれています。追加プログラムを使用することで、高度な開発者はデフォルトのCandy Guardプログラムをフォークして独自の[カスタムガード](/ja/smart-contracts/core-candy-machine/custom-guards/generating-client)を作成しながら、メインのCandy Machineプログラムに依存し続けることができます。

各ガードは自由に有効化・設定できるため、クリエイターは必要な機能を選択できます。すべてのガードを無効にすることは、誰でもいつでも無料でアセットをミントできるようにすることに相当しますが、これはおそらく望ましいことではありません。

### Candy Guardの組み合わせ例

ガードは組み合わせることで完全なミントポリシーを形成します。以下の例は、4つのガードを組み合わせてボット保護、時間制限、レート制限、有料ミントを作成する方法を示しています。

Core Candy Machineに以下のガードがあるとします：

- **[Sol Payment](/ja/smart-contracts/core-candy-machine/guards/sol-payment)**: ミントウォレットが設定された宛先ウォレットに設定された量のSOLを支払うことを確保します。
- **[Start Date](/ja/smart-contracts/core-candy-machine/guards/start-date)**: 設定された時刻以降にのみミントが開始できることを確保します。
- **[Mint Limit](/ja/smart-contracts/core-candy-machine/guards/mint-limit)**: 各ウォレットが設定された量を超えてミントできないことを確保します。
- **[Bot Tax](/ja/smart-contracts/core-candy-machine/guards/bot-tax)**: ミントのガード検証に失敗した場合、ミントを試行したウォレットに少額の設定されたSOL量を請求し、ボットを抑止します。

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

23以上のデフォルトガードとカスタムガードを作成する能力により、クリエイターは重要な機能を厳選し、完璧なCandy Machineを構成できます。ガードは[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)に整理して、異なるルールを持つ複数のミントフェーズを定義することもできます（例：許可リストウォレット向けのアーリーアクセスフェーズの後にパブリックミント）。ガードについて詳しく知るための最適な出発点は、[Candy Guards](/ja/smart-contracts/core-candy-machine/guards)ページです。

## 注意事項

- Core Candy Machineは[MPL Core](/ja/smart-contracts/core) Assetsのみをミントします。Token Metadata NFTをミントするには、代わりに[Candy Machine V3](/ja/smart-contracts/candy-machine)を使用してください。
- Config Line Settingsを使用する場合、ミントが開始される前にすべてのアイテムを挿入する必要があります。
- 各アイテムのJSONメタデータは、Candy Machineにアイテムを挿入する前にストレージプロバイダー（Arweave、IPFS、AWSなど）にアップロードする必要があります。
- Candy Machineの[引き出し](/ja/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)は不可逆で、そのマシンのすべてのオンチェーンデータが削除されます。
- Candy GuardプログラムはCandy Machine Coreプログラムとは別のものです。カスタムロジック用にガードプログラムをフォークしても、コアミントプログラムを変更する必要はありません。
- [Bot Tax](/ja/smart-contracts/core-candy-machine/guards/bot-tax)が有効な場合、ガード検証の失敗はトランザクションを単純に拒否するのではなく、失敗したミンターに課金します。

*[Metaplex Foundation](https://github.com/metaplex-foundation)によるメンテナンス · 最終確認 2026年3月 · [GitHubでソースを表示](https://github.com/metaplex-foundation/mpl-core-candy-machine)*

## FAQ

### Core Candy Machineとは何ですか？Candy Machine V3とどう違いますか？

Core Candy Machineは[MPL Core](/ja/smart-contracts/core) Assets専用に設計された最新のMetaplexミントプログラムです。[Candy Machine V3](/ja/smart-contracts/candy-machine)は旧標準のToken Metadata NFTをミントします。Core Candy MachineはMPL Coreの単一アカウントモデルを使用するため、より軽量でコスト効率の高いアセットを生成します。

### Core Candy Machineで利用可能なガードはいくつありますか？

Core Candy MachineはコンパニオンであるCandy Guardプログラムを通じて23以上のデフォルト[ガード](/ja/smart-contracts/core-candy-machine/guards)を提供します。これらのガードは支払い（SOL、SPLトークン、NFT）、アクセス制御（許可リスト、トークンゲート、NFTゲート）、スケジューリング（開始日・終了日）、ボット保護（ボット税、ゲートキーパー）をカバーします。

### 開発者はCore Candy Machine用のカスタムガードを作成できますか？

はい。ガードシステムは別のCandy Guardプログラムとして実装されており、フォーク可能です。開発者はメインのCandy Machineプログラムのミントロジックに依存しながら、[カスタムガード](/ja/smart-contracts/core-candy-machine/custom-guards/generating-client)を作成できます。

### すべてのアイテムがミントされた後、Core Candy Machineはどうなりますか？

すべてのアイテムがミントされた後、Candy Machineを[引き出し](/ja/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)てオンチェーンストレージのレントを回収できます。この操作は不可逆で、レントに使用されたSOLが権限ウォレットに返還されます。

### Core Candy Machineにロードする前にアイテムをオンチェーンアセットとして存在させる必要がありますか？

いいえ。Candy Machineにロードするのはアイテムメタデータ（名前とURIのペア）であり、実際のオンチェーンアセットではありません。Core Assetsはユーザーがミントする瞬間にのみSolanaブロックチェーン上に作成されます。詳細は[アイテムの挿入](/ja/smart-contracts/core-candy-machine/insert-items)を参照してください。

### Candy Machine権限とミント権限の違いは何ですか？

**authority**はCandy Machineの設定管理（設定の更新、アイテムの挿入、引き出し）を制御します。**mint authority**はミントをトリガーできる人を制御します。通常、ミント前にガード検証が強制されるよう、[Candy Guard](/ja/smart-contracts/core-candy-machine/guards)アカウントがミント権限として設定されます。

## 用語集

| 用語 | 定義 |
|------|------------|
| Candy Machine | NFTローンチのためのアイテムメタデータと設定を保存する一時的なオンチェーンアカウント。枯渇するまで1つずつアイテムがミントされます。 |
| Candy Guard | Candy Machineにコンポーザブルなアクセス制御ルール（ガード）を提供するコンパニオンSolanaプログラム。ミント権限として機能し、Candy Machineプログラムに委譲する前に条件を検証します。 |
| ガード | Candy Guardプログラム内の単一のモジュラールール。ミントプロセスを制限または変更します。例：SOL支払いの要求や開始日の強制。 |
| ガードグループ | 異なるミントフェーズまたはティアを定義するガードの名前付きセット。複数のガードグループにより、異なるオーディエンスに異なるルールを適用できます（例：許可リスト vs パブリック）。 |
| Config Line Settings | 各アイテムの名前とURIを設定可能な長さ制約で個別にオンチェーンに保存するCandy Machine設定モード。 |
| Hidden Settings | ミントされたすべてのアセットが同じ初期メタデータを共有するCandy Machine設定モード。通常、ミント後のリビールメカニズムに使用されます。 |
| アイテム | Candy Machineにロードされる名前とURIのペアで、将来のアセット1つ分のメタデータを表します。ミントされるまでオンチェーンアセットではありません。 |
| 権限（Authority） | Candy Machineを所有・管理するウォレット — 設定の更新、アイテムの挿入、レントの引き出しが可能。 |
| ミント権限（Mint Authority） | Candy Machineのミント命令を呼び出す権限を持つアカウント。通常、ガード検証を強制するためにCandy Guardアカウントに設定されます。 |
| コレクション | 作成時にCandy Machineに割り当てられた[MPL Coreコレクション](/ja/smart-contracts/core/collections)アドレス。ミントされたすべてのアセットはこのコレクションに自動的に追加されます。 |
