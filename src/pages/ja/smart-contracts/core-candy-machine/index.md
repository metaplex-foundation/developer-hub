---
title: Core Candy Machine - SolanaでのNFTミントと配布
metaTitle: Core Candy Machine — NFTミントとフェアローンチ配布 | Metaplex
description: Core Candy Machineは、Solana上でCore Assetsをミント・配布するためのMetaplexプログラムです。ガードの設定、アイテムの挿入、カスタマイズ可能なミントルールでNFTコレクションをローンチできます。
created: '06-01-2024'
updated: '03-10-2026'
keywords:
  - core candy machine
  - candy machine
  - NFT minting
  - NFT launch
  - Solana NFT
  - Core Assets
  - minting program
  - candy guard
  - NFT distribution
  - fair mint
  - collection launch
  - Metaplex Core
  - SPL token payment
  - bot protection
  - mint guards
about:
  - Core Candy Machine minting program
  - NFT collection launches on Solana
  - Candy Guard access control
proficiencyLevel: Beginner
faqs:
  - q: Core Candy MachineとCandy Machine V3の違いは何ですか？
    a: Core Candy MachineはMetaplex Core Assetsをミントし、単一アカウントモデルで低コストかつビルトインプラグインを備えています。Candy Machine V3は複数のアカウントを必要とするレガシーToken Metadata NFTをミントします。新しいプロジェクトにはCore Candy Machineを使用してください。
  - q: Core Candy Machineの作成にはどれくらいのコストがかかりますか？
    a: Core Candy Machineの作成にはオンチェーンアカウントのレントが必要で、ロードするアイテム数によって異なります。ミントコストは有効化されたガードによって異なります。例えば、Sol Paymentガードはミントごとにクリエイターが定義したSOL額を請求します。Solanaトランザクション手数料も適用されます。
  - q: Core Candy Machineで複数のガードを同時に使用できますか？
    a: はい。ガードはコンポーザブル（組み合わせ可能）であり、23以上のデフォルトガードを任意に組み合わせて有効化できます。例えば、Sol Payment、Start Date、Mint Limit、Bot Taxを組み合わせて、時間制限付き、レート制限付き、ボット保護された有料ミントを作成できます。
  - q: すべてのアイテムがミントされた後、Core Candy Machineはどうなりますか？
    a: すべてのアイテムがミントされた後、Candy Machineを削除（引き出し）してオンチェーンレントを回収できます。ミントされたCore Assetsはオンチェーンに残り、削除による影響を受けません。
  - q: 別のCandy Guardアカウントは必要ですか？
    a: 実質的には必要です。Candy Guardアカウントがミントルール（支払い、タイミング、許可リスト、ボット保護）を強制します。Candy Guardがない場合、誰でもいつでも無料でミントできます。Candy Guardを作成し、ミント権限として設定するのが標準的なワークフローです。
---

Metaplexプロトコルの**Core Candy Machine**は、SolanaにおけるNFTコレクションのフェアローンチのための主要なミント・配布プログラムです。[Metaplex Core](/ja/smart-contracts/core)アセット標準向けに構築されたCore Candy Machineは、クリエイターがアイテムをロードし、バイヤーがミントする一時的なオンチェーン自動販売機として機能します。これにより、クリエイターは安全でカスタマイズ可能な方法でデジタル資産をオンチェーンに持ち込むことができます。 {% .lead %}

- [Core Assets](/ja/smart-contracts/core/what-is-an-asset)を単一アカウントモデルでミント -- レガシーToken Metadata NFTより低コストでシンプル
- [23以上のコンポーザブルなガード](/ja/smart-contracts/core-candy-machine/guards)で支払い、タイミング、許可リスト、ボット保護をカスタマイズ
- フルライフサイクルを管理: [作成](/ja/smart-contracts/core-candy-machine/create)、[アイテム挿入](/ja/smart-contracts/core-candy-machine/insert-items)、[ミント](/ja/smart-contracts/core-candy-machine/mint)、[引き出し](/ja/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)
- ガード設定によりSOL、SPLトークン、またはNFTでの支払いをサポート

この名前は、機械式クランクを使ってコインと引き換えにキャンディを配布する自動販売機に由来しています。この場合、キャンディはNFTであり、支払いはSOLまたはSPLトークンです。

{% quick-links %}
{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/smart-contracts/core-candy-machine/sdk" description="お好みの言語やライブラリを選択して、Candy Machinesを始めましょう。" /%}

{% quick-link title="CLIコマンド" icon="CommandLine" href="/ja/dev-tools/cli/cm" description="Metaplex CLIのインタラクティブウィザードを使用してCandy Machineを作成・管理します。" /%}

{% quick-link title="APIリファレンス" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" target="_blank" description="JavaScript APIドキュメントを確認してください。" /%}

{% quick-link title="APIリファレンス" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" target="_blank" description="Rust APIドキュメントを確認してください。" /%}
{% /quick-links %}

{% callout %}
このドキュメントは、Core Candy Machineとして知られるCandy Machineの最新バージョンについて説明しています。これは[Core](/ja/smart-contracts/core)アセットのミントを可能にします。Metaplex Token MetadataのNFTをミントしたい場合は、[代わりにCandy Machine V3を参照してください](/ja/smart-contracts/candy-machine)。
{% /callout %}

## Core Candy Machineのライフサイクル

Core Candy Machineは、作成、ロード、ミント、引き出しの4段階のライフサイクルに従います。クリエイターは設定とアイテムメタデータを事前に構成・挿入し、バイヤーがオンデマンドでCore Assetsをミントします。すべてのアイテムがミントされた後、クリエイターはマシンを削除してレントを回収できます。

1. **[作成と設定](/ja/smart-contracts/core-candy-machine/create)** コレクションレベルの設定でCandy Machineを作成
2. **[アイテムの挿入](/ja/smart-contracts/core-candy-machine/insert-items)** 各アセットの名前とメタデータURIを提供
3. **[ミント](/ja/smart-contracts/core-candy-machine/mint)** -- バイヤーがガードルールに従ってオンデマンドでCore Assetを作成
4. **[引き出し](/ja/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)** ローンチ後にCandy Machineを引き出してオンチェーンレントを回収

バイヤーがミントするまで、Core Assetsはオンチェーンに存在しません。Candy Machineは、ミント時に各アセットを作成するために必要なメタデータ参照のみを保存します。

## Candy Guardsとミントのカスタマイズ

[Candy Guards](/ja/smart-contracts/core-candy-machine/guards)は、ミントプロセスを保護・カスタマイズするモジュラーなアクセス制御ルールです。Core Candy Guardプログラムには、クリエイターが独立して有効化・設定できる23以上のデフォルトガードが付属しています。

各ガードは単一の責任を処理するため、コンポーザブル（組み合わせ可能）です。一般的なガードの組み合わせには以下が含まれます：

- **[Sol Payment](/ja/smart-contracts/core-candy-machine/guards/sol-payment)** -- ミントごとに設定されたSOL額を請求
- **[Start Date](/ja/smart-contracts/core-candy-machine/guards/start-date)** / **[End Date](/ja/smart-contracts/core-candy-machine/guards/end-date)** -- ミントを時間枠に制限
- **[Mint Limit](/ja/smart-contracts/core-candy-machine/guards/mint-limit)** -- ウォレットごとのミント数を制限
- **[Bot Tax](/ja/smart-contracts/core-candy-machine/guards/bot-tax)** -- ガード検証に失敗したミントにペナルティを請求
- **[Allow List](/ja/smart-contracts/core-candy-machine/guards/allow-list)** -- 事前定義されたウォレットセットにミントを制限
- **[Token Gate](/ja/smart-contracts/core-candy-machine/guards/token-gate)** / **[NFT Gate](/ja/smart-contracts/core-candy-machine/guards/nft-gate)** -- 特定のトークンまたはNFTの保有者にミントを制限

ガードは、Candy Machineのミント権限となる別の[Candy Guardアカウント](/ja/smart-contracts/core-candy-machine/guards)を介して割り当てられます。上級開発者はCandy Guardプログラムをフォークしてカスタムガードを構築でき、コアミントプログラムには引き続き依存できます。クリエイターは[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を定義して、異なるオーディエンスに異なるミント条件を提供することもできます（例：許可リストフェーズの後にパブリックセール）。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| Core Candy Machineプログラム | `CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J` |
| Core Candy Guardプログラム | `CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ` |
| JS SDK | `@metaplex-foundation/mpl-core-candy-machine` |
| Rust Crate | `mpl-core-candy-machine-core` |
| ソース | [GitHub](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| JS TypeDoc | [mpl-core-candy-machine.typedoc.metaplex.com](https://mpl-core-candy-machine.typedoc.metaplex.com/) |
| Rust Docs | [docs.rs/mpl-core-candy-machine-core](https://docs.rs/mpl-core-candy-machine-core/) |
| デフォルトガード | 23以上のコンポーザブルガード |

## 注意事項

- Core Candy Machineは[Metaplex Core](/ja/smart-contracts/core) Assetsのみをミントします。レガシーToken Metadata NFTをミントするには、[Candy Machine V3](/ja/smart-contracts/candy-machine)を使用してください。
- ミント制限を強制するには、実質的にCandy Guardアカウントが必要です。Candy Guardがない場合、Candy Machineは無制限の無料ミントを許可します。
- ミントを開始する前にアイテムを挿入する必要があります。各アイテムには`name`と、事前にアップロードされたJSONメタデータを指す`uri`が必要です。
- すべてのアイテムがミントされた後、Candy Machineを引き出してオンチェーンレントを回収してください。ミントされたアセットは影響を受けません。
- Candy GuardプログラムはCore Candy Machineプログラムとは別のオンチェーンプログラムです。トランザクションの構築時には両方を参照する必要があります。
- ボット保護のベストプラクティスについては、[ボット対策保護のベストプラクティス](/ja/smart-contracts/core-candy-machine/anti-bot-protection-best-practices)を参照してください。


## FAQ

### Core Candy MachineとCandy Machine V3の違いは何ですか？
Core Candy Machineは[Metaplex Core](/ja/smart-contracts/core) Assetsをミントし、単一アカウントモデルで低コストかつビルトインプラグインを備えています。[Candy Machine V3](/ja/smart-contracts/candy-machine)は複数のアカウントを必要とするレガシーToken Metadata NFTをミントします。新しいプロジェクトにはCore Candy Machineを使用してください。

### Core Candy Machineの作成にはどれくらいのコストがかかりますか？
Core Candy Machineの作成にはオンチェーンアカウントのレントが必要で、ロードするアイテム数によって異なります。ミントコストは有効化された[ガード](/ja/smart-contracts/core-candy-machine/guards)によって異なります。例えば、[Sol Payment](/ja/smart-contracts/core-candy-machine/guards/sol-payment)ガードはミントごとにクリエイターが定義したSOL額を請求します。Solanaトランザクション手数料も適用されます。

### Core Candy Machineで複数のガードを同時に有効化できますか？
はい。ガードはコンポーザブルです。23以上のデフォルトガードを任意に組み合わせて有効化できます。例えば、Sol Payment、Start Date、Mint Limit、Bot Taxを組み合わせて、時間制限付き、レート制限付き、ボット保護された有料ミントを作成できます。

### すべてのアイテムがミントされた後、Core Candy Machineはどうなりますか？
すべてのアイテムがミントされた後、Candy Machineを[削除（引き出し）](/ja/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)してオンチェーンレントを回収できます。ミントされたCore Assetsはオンチェーンに残り、削除による影響を受けません。

### Core Candy Machineには別のCandy Guardアカウントが必要ですか？
実質的には必要です。[Candy Guard](/ja/smart-contracts/core-candy-machine/guards)アカウントがミントルール（支払い、タイミング、許可リスト、ボット保護）を強制します。Candy Guardがない場合、誰でもいつでも無料でミントできます。Candy Guardを作成し、ミント権限として設定するのが標準的なワークフローです。

### 開発者はカスタムガードを作成できますか？
はい。Candy Guardプログラムはフォーク可能に設計されています。開発者はメインのCore Candy Machineプログラムのミントロジックに依存しながら、カスタムガードロジックを作成できます。23以上のデフォルトガードがほとんどのユースケースをカバーしますが、カスタムガードによりプロジェクト固有の要件に対応できます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Core Candy Machine** | アイテムメタデータを保存し、オンデマンドでCore Assetsをミントするオンチェーンのmetaplexプログラム |
| **Candy Guard** | Candy Machineにコンポーザブルなアクセス制御ルール（ガード）をラップする別のオンチェーンプログラム |
| **ガード** | ミントプロセスを制限または変更する単一のモジュラールール（例：支払い、タイミング、許可リスト） |
| **ガードグループ** | 異なるオーディエンスに異なるミント条件を適用するためのガード設定の名前付きセット |
| **アイテム** | ミント前にCandy Machineにロードされる名前とメタデータURIのペア |
| **Core Asset** | Metaplex Core NFT -- ビルトインプラグインサポートを持つ単一アカウントのデジタルアセット |
| **ミント権限** | ミントをトリガーする権限を持つアカウント。通常はCandy Guardアカウントに設定 |
| **コレクション** | Candy Machineからミントされるすべてのアセットに割り当てられるオンチェーンコレクションアドレス |

## 次のステップ

1. **[SDKセットアップ](/ja/smart-contracts/core-candy-machine/sdk)** -- JavaScriptまたはRustを選択してSDKをインストール
2. **[Core Candy Machineの作成](/ja/smart-contracts/core-candy-machine/create)** -- 設定を構成してデプロイ
3. **[アイテムの挿入](/ja/smart-contracts/core-candy-machine/insert-items)** -- アセットメタデータをマシンにロード
4. **[ガードの設定](/ja/smart-contracts/core-candy-machine/guards)** -- 支払い、タイミング、アクセスルールを設定
5. **[Core Assetsのミント](/ja/smart-contracts/core-candy-machine/mint)** -- ミントフローを理解する
