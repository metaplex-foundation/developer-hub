---
title: プラグイン概要
metaTitle: Core プラグイン概要 | Metaplex Core
description: Metaplex Core プラグインについて学びます。ロイヤリティ、凍結、バーン、オンチェーン属性などの動作をNFT AssetとCollectionに追加するモジュール式拡張機能です。
updated: '01-31-2026'
keywords:
  - Core plugins
  - NFT plugins
  - plugin system
  - royalties plugin
  - freeze plugin
about:
  - Plugin architecture
  - NFT extensions
  - Lifecycle events
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Assetの作成後にプラグインを追加できますか？
    a: はい、Permanentプラグインを除いて可能です。Owner Managedプラグインはオーナーの署名が必要で、Authority Managedプラグインはupdate authorityの署名が必要です。
  - q: Assetが転送されるとプラグインはどうなりますか？
    a: Owner Managedプラグイン（Transfer、Freeze、Burn Delegate）は転送時に権限が自動的に取り消されます。Authority ManagedとPermanentプラグインは維持されます。
  - q: AssetはそのCollectionと同じプラグインを持てますか？
    a: はい。両方が同じプラグインタイプを持つ場合、Assetレベルのプラグインがコレクションレベルのプラグインより優先されます。
  - q: プラグインを削除するにはどうすればよいですか？
    a: removePlugin命令を使用します。プラグインの権限者のみが削除できます。
  - q: カスタムプラグインを作成できますか？
    a: いいえ。組み込みプラグインのみがサポートされています。プラグインシステムはサードパーティによる拡張ができません。
  - q: プラグインに追加のSOLがかかりますか？
    a: プラグインを追加するとアカウントサイズが増加し、rentが増加します。ほとんどのプラグインは約0.001 SOLですが、データストレージプラグイン（AppDataやAttributesなど）は保存するデータ量に応じてコストが高くなる可能性があります。
---
このページでは**Coreプラグインシステム**について説明します。Core AssetとCollectionに動作やデータストレージを追加するモジュール式拡張機能です。プラグインはライフサイクルイベントにフックしてルールを強制したり、オンチェーンデータを保存したりします。 {% .lead %}
{% callout title="学べること" %}
- プラグインとは何か、どのように機能するか
- プラグインの種類：Owner Managed、Authority Managed、Permanent
- プラグインがライフサイクルイベント（作成、転送、バーン）にどのように影響するか
- AssetとCollection間のプラグイン優先順位
{% /callout %}
## 概要
**プラグイン**は、Core AssetまたはCollectionに機能を追加するオンチェーン拡張機能です。データを保存したり（属性など）、ルールを強制したり（ロイヤリティなど）、権限を委任したり（凍結/転送権限など）できます。
- **Owner Managed**: 追加にオーナー署名が必要（Transfer、Freeze、Burn Delegate）
- **Authority Managed**: update authorityが追加可能（Royalties、Attributes、Update Delegate）
- **Permanent**: 作成時にのみ追加可能（Permanent Transfer/Freeze/Burn Delegate）
## 範囲外
カスタムプラグインの作成（組み込みプラグインのみサポート）、Token Metadataプラグイン（別システム）、オフチェーンプラグインデータストレージ。
## クイックスタート
**ジャンプ：** [プラグインタイプ](#プラグインの種類) · [プラグインテーブル](#プラグインテーブル) · [ライフサイクルイベント](#プラグインとライフサイクルイベント) · [プラグインの追加](/ja/smart-contracts/core/plugins/adding-plugins)
1. ユースケースに基づいてプラグインを選択（ロイヤリティ、凍結、属性など）
2. `addPlugin()`またはAsset/Collection作成時にプラグインを追加
3. プラグインは自動的にライフサイクルイベントにフック
4. DASまたはオンチェーンフェッチでプラグインデータをクエリ
## ライフサイクル
Core Assetのライフサイクル中、複数のイベントがトリガーされます：
- 作成
- 転送
- 更新
- バーン
- プラグイン追加
- 権限プラグインの承認
- 権限プラグインの削除
ライフサイクルイベントは、作成からウォレット間の転送、そしてAssetの破棄まで、様々な方法でAssetに影響を与えます。AssetレベルまたはCollectionレベルに添付されたプラグインは、これらのライフサイクルイベント中に検証プロセスを通じて、イベントの実行を`approve`、`reject`、または`force approve`します。
## プラグインとは？
プラグインは、NFTのためのオンチェーンアプリのようなもので、データを保存したり、Assetに追加機能を提供したりできます。
## プラグインの種類
### Owner Managedプラグイン
Owner Managedプラグインは、Assetオーナーの署名がトランザクションに存在する場合にのみCore Assetに追加できるプラグインです。
Owner Managedプラグインには以下が含まれますが、これらに限定されません：
- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)（マーケットプレイス、ゲーム）
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)（マーケットプレイス、ステーキング、ゲーム）
- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)（ゲーム）
Owner Managedプラグインが権限なしでAsset/Collectionに追加された場合、権限タイプはデフォルトで`owner`タイプになります。
Owner Managedプラグインの権限は、転送時に自動的に取り消されます。
### Authority Managedプラグイン
Authority Managedプラグインは、MPL Core AssetまたはCore Collectionの権限者がいつでも追加・更新できるプラグインです。
Authority Managedプラグインには以下が含まれますが、これらに限定されません：
- [Royalties](/ja/smart-contracts/core/plugins/royalties)
- [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate)
- [Attribute](/ja/smart-contracts/core/plugins/attribute)
Authority Managedプラグインが権限引数なしでAsset/Collectionに追加された場合、プラグインはデフォルトで`update authority`タイプの権限になります。
### Permanentプラグイン
**Permanentプラグインは、作成時にのみCore Assetに追加できるプラグインです。** Assetが既に存在する場合、Permanentプラグインは追加できません。
Permanentプラグインには以下が含まれますが、これらに限定されません：
- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate)
Permanentプラグインが権限なしでAsset/Collectionに追加された場合、権限タイプはデフォルトで`update authority`タイプになります。
## Collectionプラグイン
Collectionプラグインは、Collectionレベルで追加されるプラグインで、コレクション全体に効果を持つことができます。これは特にロイヤリティに便利で、Collection Assetに[Royaltiesプラグイン](/ja/smart-contracts/core/plugins/royalties)を割り当てると、そのCollection内のすべてのAssetがそのプラグインを参照するようになります。
Collectionは`Permanentプラグイン`と`Authority Managedプラグイン`にのみアクセスできます。
## プラグイン優先順位
MPL Core AssetとMPL Core Collection Assetの両方が同じプラグインタイプを共有している場合、Assetレベルのプラグインとそのデータがコレクションレベルのプラグインより優先されます。
これは、Assetのコレクションに異なるレベルでロイヤリティを設定するなど、クリエイティブな方法で使用できます。
- Collection Assetには2%でRoyaltiesプラグインが割り当てられている
- コレクション内のスーパーレアMPL Core Assetには5%でRoyaltyプラグインが割り当てられている
上記の場合、コレクションからの通常のMPL Core Asset販売は2%のロイヤリティを保持し、スーパーレアMPL Core Assetは販売時に5%のロイヤリティを保持します。これは、Collection Asset Royaltiesプラグインより優先される独自のRoyaltiesプラグインを持っているためです。
## プラグインテーブル
| プラグイン                                                                   | Owner Managed | Authority Managed | Permanent |
| ------------------------------------------------------------------------ | ------------- | ----------------- | --------- |
| [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [Royalties](/ja/smart-contracts/core/plugins/royalties)                                     |               | ✅                |           |
| [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate)                         |               | ✅                |           |
| [Attribute](/ja/smart-contracts/core/plugins/attribute)                                     |               | ✅                |           |
| [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |
## プラグインとライフサイクルイベント
MPL Coreのプラグインは、作成、転送、バーン、更新などの特定のライフサイクルアクションの結果に影響を与える能力を持っています。
各プラグインは、アクションを目的の結果に`reject`、`approve`、または`force approve`する能力を持っています。
ライフサイクルイベント中、アクションは定義済みプラグインのリストを順に確認・検証していきます。
プラグインの条件が検証されると、ライフサイクルはパスしてアクションを続行します。
プラグイン検証が失敗すると、ライフサイクルは停止され拒否されます。
プラグイン検証のルールは、以下の条件階層に従います：
- force approveがあれば、常にapprove
- そうでなければ、rejectがあればreject
- そうでなければ、approveがあればapprove
- そうでなければreject
`force approve`検証は、ファーストパーティプラグインと`Permanent Delegate`プラグインでのみ利用可能です。
### Force Approve
Force approveは、プラグインの検証を確認する際に最初に行われるチェックです。現在force approve検証を行うプラグインは：
- **Permanent Transfer**
- **Permanent Burn**
- **Permanent Freeze**
これらのプラグインは、非永続的な対応物や他のプラグインより優先してアクションを実行します。
#### 例
Freeze PluginでAssetレベルで凍結されたAssetがあり、同時にAssetに**Permanent Burn**プラグインがある場合、Assetが凍結されていても、永続プラグインの`forceApprove`の性質により、**Permanent Burn**プラグインを通じて呼び出されたバーン手続きは実行されます。
### 作成
{% totem %}
| プラグイン    | アクション     | 条件 |
| --------- | ---------- | ---------- |
| Royalties | 拒否可能 | Ruleset    |
{% /totem %}
### 更新
{% totem %}
更新には現在プラグイン条件や検証はありません。
{% /totem %}
### 転送
{% totem %}
| プラグイン                      | アクション      | 条件  |
| --------------------------- | ----------- | ----------- |
| Royalties                   | 拒否可能  | Ruleset     |
| Freeze Delegate             | 拒否可能  | isFrozen    |
| Transfer Delegate           | 承認可能 | isAuthority |
| Permanent Freeze Delegate   | 拒否可能  | isFrozen    |
| Permanent Transfer Delegate | 承認可能 | isAuthority |
{% /totem %}
### バーン
{% totem %}
| プラグイン                    | アクション      | 条件  |
| ------------------------- | ----------- | ----------- |
| Freeze Delegate           | 拒否可能  | isFrozen    |
| Burn Delegate             | 拒否可能  | isAuthority |
| Permanent Freeze Delegate | 拒否可能  | isFrozen    |
| Permanent Burn Delegate   | 承認可能 | isAuthority |
{% /totem %}
### プラグイン追加
{% totem %}
| プラグイン          | アクション      | 条件  |
| --------------- | ----------- | ----------- |
| Royalties       | 拒否可能  | Ruleset     |
| Update Delegate | 承認可能 | isAuthority |
{% /totem %}
### プラグイン削除
{% totem %}
| プラグイン          | アクション      | 条件  |
| --------------- | ----------- | ----------- |
| Royalties       | 拒否可能  | Ruleset     |
| Update Delegate | 承認可能 | isAuthority |
{% /totem %}
### プラグイン権限の承認
{% totem %}
承認には現在プラグイン条件や検証はありません。
{% /totem %}
### 権限プラグインの取り消し
{% totem %}
取り消しには現在プラグイン条件や検証はありません。
{% /totem %}
## 一般的なユースケース
| ユースケース | 推奨プラグイン |
|----------|-------------------|
| クリエイターロイヤリティの強制 | [Royalties](/ja/smart-contracts/core/plugins/royalties) |
| エスクローレスステーキング | [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) |
| マーケットプレイスリスティング | [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) + [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) |
| オンチェーンゲームステータス | [Attributes](/ja/smart-contracts/core/plugins/attribute) |
| サードパーティバーンの許可 | [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) |
| 永続ステーキングプログラム | [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate) |
## FAQ
### Assetの作成後にプラグインを追加できますか？
はい、Permanentプラグインを除いて可能です。Owner Managedプラグインはオーナーの署名が必要で、Authority Managedプラグインはupdate authorityの署名が必要です。
### Assetが転送されるとプラグインはどうなりますか？
Owner Managedプラグイン（Transfer、Freeze、Burn Delegate）は転送時に権限が自動的に取り消されます。Authority ManagedとPermanentプラグインは維持されます。
### AssetはそのCollectionと同じプラグインを持てますか？
はい。両方が同じプラグインタイプを持つ場合、Assetレベルのプラグインがコレクションレベルのプラグインより優先されます。
### プラグインを削除するにはどうすればよいですか？
`removePlugin`命令を使用します。プラグインの権限者のみが削除できます。[プラグインの削除](/ja/smart-contracts/core/plugins/removing-plugins)を参照してください。
### カスタムプラグインを作成できますか？
いいえ。組み込みプラグインのみがサポートされています。プラグインシステムはサードパーティによる拡張ができません。
### プラグインに追加のSOLがかかりますか？
プラグインを追加するとアカウントサイズが増加し、rentが増加します。ほとんどのプラグインは約0.001 SOLですが、データストレージプラグイン（AppDataやAttributesなど）は保存するデータ量に応じてコストが高くなる可能性があります。
## 用語集
| 用語 | 定義 |
|------|------------|
| **Plugin** | Asset/Collectionに動作やデータを追加するモジュール式拡張機能 |
| **Owner Managed** | 追加にオーナー署名が必要なプラグインタイプ |
| **Authority Managed** | update authorityが追加できるプラグインタイプ |
| **Permanent** | 作成時にのみ追加できるプラグインタイプ |
| **Lifecycle Event** | プラグインが検証できるアクション（作成、転送、バーン） |
| **Force Approve** | 他の拒否を上書きするPermanentプラグイン検証 |
| **Plugin Authority** | プラグインを更新または削除する権限を持つアカウント |
