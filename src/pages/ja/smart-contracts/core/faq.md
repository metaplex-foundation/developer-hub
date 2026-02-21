---
title: FAQ
metaTitle: FAQ | Core
description: Metaplex Coreプロトコルについてよくある質問です。
updated: '01-31-2026'
keywords:
  - Core FAQ
  - Metaplex Core questions
  - NFT FAQ
  - mpl-core help
about:
  - Metaplex Core
  - NFT development
proficiencyLevel: Beginner
faqs:
  - q: なぜCoreにはオンチェーンとオフチェーンの両方のデータがあるのですか？
    a: すべてをオンチェーンに保存すると高コスト（レント費用）で柔軟性に欠けます。データを分割することで、オンチェーンの保証とオフチェーンの柔軟なメタデータの両方を実現できます。完全にオンチェーンのデータにはInscriptionsを使用してください。
  - q: Coreの使用にコストはかかりますか？
    a: Coreは1 Assetミントあたり0.0015 SOLの手数料がかかります。詳細はProtocol Feesページをご覧ください。
  - q: Soulbound Assetを作成するには？
    a: Permanent Freeze DelegateプラグインまたはOracleプラグインを使用します。実装の詳細はSoulbound Assetsガイドをご覧ください。
  - q: Assetを不変にするには？
    a: Coreには複数レベルの不変性があります。ImmutableMetadataプラグインを使用するか、Update Authorityを削除します。詳細は不変性ガイドをご覧ください。
  - q: Token MetadataとCoreの違いは何ですか？
    a: Coreはより安価（約80%コスト削減）で、必要なアカウント数が少なく（1対3+）、Compute Unitの使用量が少なく、散在したデリゲートの代わりに柔軟なプラグインシステムを持っています。
  - q: CoreはEditionsをサポートしていますか？
    a: はい、EditionとMaster Editionプラグインを使用します。詳細はPrint Editionsガイドをご覧ください。
---
## なぜCore AssetとCollectionアカウントにはオンチェーンとオフチェーンの両方のデータがあるのですか？
Core AssetとCollectionアカウントは両方ともオンチェーンデータを含んでいますが、追加データを提供するオフチェーンJSONファイルを指す`URI`属性も含んでいます。なぜでしょうか？すべてをオンチェーンに保存できないのでしょうか？実は、データをオンチェーンに保存することにはいくつかの問題があります：
- オンチェーンへのデータ保存にはレントの支払いが必要です。Assetの説明のような長いテキストを含む可能性のあるすべてのデータをAssetまたはCollectionアカウント内に保存する必要がある場合、より多くのバイトが必要になり、より多くのバイトを保存するとより多くのレントを支払う必要があるため、Assetの作成が突然はるかに高価になります
- オンチェーンデータは柔軟性に欠けます。特定のバイト構造を使用してアカウント状態が作成されると、デシリアライゼーションの問題を引き起こす可能性があるため、簡単に変更できません。したがって、すべてをオンチェーンに保存する必要がある場合、標準はエコシステムの要求に応じて進化することがはるかに難しくなります。
したがって、データをオンチェーンとオフチェーンに分割することで、ユーザーは両方の長所を得ることができます。オンチェーンデータはプログラムが**ユーザーに対する保証と期待を作成する**ために使用でき、オフチェーンデータは**標準化されているが柔軟な情報を提供する**ために使用できます。しかし心配しないでください。完全にオンチェーンのデータが必要な場合、Metaplexはこの目的のために[Inscriptions](/ja/smart-contracts/inscription)も提供しています。
## Coreの使用にコストはかかりますか？
Coreは現在、呼び出し元に対してAssetミントあたり0.0015 SOLという非常に小さな手数料を請求しています。詳細は[Protocol Fees](/protocol-fees)ページで確認できます。
## Soulbound Assetを作成するには？
Core Standardでは、Soulbound Assetを作成できます。これを実現するには、[Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)プラグインまたは[Oracleプラグイン](/ja/smart-contracts/core/external-plugins/oracle)を使用できます。
詳しくは[Soulbound Assetsガイド](/ja/smart-contracts/core/guides/create-soulbound-nft-asset)をご覧ください！
## Assetを不変にするには？
Coreには複数レベルの「不変性」があります。詳細と実装方法は[このガイド](/ja/smart-contracts/core/guides/immutability)で確認できます。
## Metaplex Token MetadataとCoreの違いは何ですか？
Coreは特にNFT向けに設計された全く新しい標準であるため、いくつかの顕著な違いがあります。例えば、Coreはより安価で、必要なCompute Unitが少なく、開発者の視点から作業しやすいはずです。詳細は[違い](/ja/smart-contracts/core/tm-differences)ページをご覧ください。
## CoreはEditionsをサポートしていますか？
はい！[Edition](/ja/smart-contracts/core/plugins/edition)と[Master Edition](/ja/smart-contracts/core/plugins/master-edition)プラグインを使用します。詳細は[「Editionsを印刷する方法」ガイド](/ja/smart-contracts/core/guides/print-editions)で確認できます。
