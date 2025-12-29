---
title: 概要
metaTitle: 概要 | Core
description: Metaplexが作成した「Core」と呼ばれる新しいSolana NFTアセット標準の概要を提供します。
---

Metaplex Core（「Core」）は、従来の標準の複雑さと技術的負債を取り除き、デジタルアセットのためのクリーンでシンプルなコア仕様を提供します。この次世代Solana NFT標準は単一アカウント設計を使用し、代替品と比較してミントコストを削減し、Solanaネットワークの負荷を改善します。また、開発者がアセットの動作と機能を変更できる柔軟なプラグインシステムも備えています。 {% .lead %}

{% callout %}
Please note that certain Core instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

{% protocol-fees program="core" /%}

[https://core.metaplex.com/](https://core.metaplex.com/)でCoreの機能を試して、自分でアセットをミントしてみてください！

{% quick-links %}

{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/smart-contracts/core/getting-started" description="お好みの言語またはライブラリを選択し、Solanaでデジタルアセットをはじめましょう。" /%}

{% quick-link title="APIリファレンス" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="何か特定のものをお探しですか？APIリファレンスをご覧いただき、答えを見つけてください。" /%}

{% quick-link title="MPL Token Metadataとの違いの概要" icon="AcademicCap" href="/ja/smart-contracts/core/tm-differences" description="Token Metadataに慣れていて、新機能や動作の変更の概要を見たいですか？" /%}

{% quick-link title="UIで自分で試してみよう！" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="使いやすいWebサイトを使ってCore自分で試してみてください！" /%}

{% /quick-links %}

## 紹介

Metaplex CoreはMetaplexプロトコルの新しいNFT標準です。Metaplex Token Metadataプログラムを含む他の標準と比較して、以下の利点があります：

- **前例のないコスト効率**: Metaplex Coreは利用可能な代替品と比較して最低のミントコストを提供します。例えば、Token Metadataで.022 SOL、Token Extensionsで.0046 SOLかかるNFTが、Coreでは.0029 SOLでミントできます。
- **低コンピュート**: Core操作は小さなコンピュートユニット（CU）フットプリントを持ちます。これにより、1つのブロックにより多くのトランザクションを含めることができます。Token Metadataのミントが205000 CUを必要とするのに対し、Coreはわずか17000 CUで済みます。
- **単一アカウント設計**: SPL TokenやToken extensions（Token22とも呼ばれる）のようなファンジブルトークン標準に依存する代わりに、CoreはNFT標準のニーズに焦点を当てています。これによりCoreは所有者も追跡する単一アカウントを使用できます。
- **強制ロイヤリティ**: Coreはデフォルトで[ロイヤリティの強制](/ja/smart-contracts/core/plugins/royalties)を可能にします。
- **ファーストクラスコレクションサポート**: アセットは[コレクション](/ja/smart-contracts/core/collections)にグループ化できます。これはToken Metadataでも可能ですが、Coreではコレクションは独自のアセットクラスであり、以下のような追加機能が利用できます：
- **コレクションレベル操作**: Coreはユーザーがコレクションレベルですべてのアセットに変更を加えることを可能にします。例えば、すべてのコレクションアセットを凍結したり、ロイヤリティの詳細を単一のトランザクションで同時に変更したりできます！
- **高度なプラグインサポート**: 組み込みステーキングからアセットベースのポイントシステムまで、Metaplex Coreのプラグインアーキテクチャは広大なユーティリティとカスタマイゼーションの景観を開きます。プラグインは開発者が作成、転送、バーンなどのアセットライフサイクルイベントにフックすることで、カスタム動作を追加できます。アセットにプラグインを追加できます。例：権限の委任やDASによって自動的にインデックス化されるオンチェーン属性の追加：
- **すぐに使えるインデックス化**: [DASをサポートする多くのRPCプロバイダー](/ja/rpc-providers)は既にCoreをサポートしています。

## 次のステップ

Metaplex Coreが何であるかを高レベルで説明したので、Coreアセットとやり取りするために使用できる様々な言語/フレームワークを列挙した[はじめに](/ja/smart-contracts/core/getting-started)ページをチェックすることをお勧めします。また、[MPL Token Metadataとの違い](/ja/smart-contracts/core/tm-differences)ページも見てみたいと思うかもしれません。その後、様々な機能ページを使用してcNFTで実行できる特定の操作について詳しく学ぶことができます。