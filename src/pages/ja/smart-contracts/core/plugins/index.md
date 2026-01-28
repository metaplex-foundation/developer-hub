---
title: Plugin概要
metaTitle: Core Plugin概要 | Metaplex Core
description: Metaplex Core Pluginについて学びます。ロイヤリティ、フリーズ、バーン、オンチェーン属性などの動作をNFT AssetやCollectionに追加するモジュラー拡張機能です。
---

このページでは**Core Pluginシステム**について説明します。Core AssetやCollectionに動作やデータストレージを追加するモジュラー拡張機能です。Pluginはライフサイクルイベントにフックしてルールを強制したり、オンチェーンデータを保存したりします。 {% .lead %}

{% callout title="学習内容" %}

- Pluginとは何か、どのように機能するか
- Pluginの種類：所有者管理、権限管理、永続
- Pluginがライフサイクルイベント（作成、転送、バーン）にどのように影響するか
- AssetとCollection間のPlugin優先度

{% /callout %}

## 概要

**Plugin**は、Core AssetまたはCollectionに機能を追加するオンチェーン拡張機能です。データを保存したり（属性など）、ルールを強制したり（ロイヤリティなど）、権限を委任したり（フリーズ/転送権限など）できます。

- **所有者管理**：追加には所有者の署名が必要（Transfer、Freeze、Burn Delegate）
- **権限管理**：更新権限によって追加可能（Royalties、Attributes、Update Delegate）
- **永続**：作成時にのみ追加可能（Permanent Transfer/Freeze/Burn Delegate）

## 対象外

カスタムPluginの作成（組み込みPluginのみサポート）、Token Metadata Plugin（別システム）、オフチェーンPluginデータストレージは対象外です。

## クイックスタート

**ジャンプ：** [Pluginの種類](#pluginの種類) · [Plugin表](#plugin表) · [ライフサイクルイベント](#pluginとライフサイクルイベント) · [Pluginの追加](/ja/smart-contracts/core/plugins/adding-plugins)

1. ユースケースに基づいてPluginを選択（ロイヤリティ、フリーズ、属性など）
2. `addPlugin()`を使用するか、Asset/Collection作成時にPluginを追加
3. Pluginは自動的にライフサイクルイベントにフック
4. DASまたはオンチェーンフェッチでPluginデータをクエリ

## ライフサイクル

Core Assetのライフサイクル中に、以下のようなイベントがトリガーされる可能性があります：

- 作成
- 転送
- 更新
- バーン
- Plugin追加
- 権限Plugin承認
- 権限Plugin削除

ライフサイクルイベントは、作成からウォレット間の転送、Assetの破壊まで、さまざまな方法でAssetに影響を与えます。AssetレベルまたはCollectionレベルに付加されたPluginは、これらのライフサイクルイベント中に検証プロセスを実行し、イベントの実行を`承認`、`拒否`、または`強制承認`します。

## Pluginとは？

Pluginは、データを保存したりAssetに追加機能を提供したりできるNFT用のオンチェーンアプリのようなものです。

## Pluginの種類

### 所有者管理Plugin

所有者管理Pluginは、トランザクションにAsset所有者の署名が存在する場合にのみCore Assetに追加できるPluginです。

所有者管理Pluginには以下が含まれますが、これらに限定されません：

- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)（マーケットプレース、ゲーム）
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)（マーケットプレース、ステーキング、ゲーム）
- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)（ゲーム）

権限が設定されていない状態で所有者管理PluginがAsset/Collectionに追加された場合、権限タイプは`owner`タイプにデフォルト設定されます。

所有者管理Pluginの権限は、転送時に自動的に取り消されます。

### 権限管理Plugin

権限管理Pluginは、MPL Core AssetまたはCore Collectionの権限がいつでも追加および更新できるPluginです。

権限管理Pluginには以下が含まれますが、これらに限定されません：

- [Royalties](/ja/smart-contracts/core/plugins/royalties)
- [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate)
- [Attribute](/ja/smart-contracts/core/plugins/attribute)

権限引数が存在しない状態で権限管理PluginがAsset/Collectionに追加された場合、Pluginは権限タイプ`update authority`にデフォルト設定されます。

### 永続Plugin

**永続Pluginは、作成時にのみCore Assetに追加できるPluginです。** Assetが既に存在する場合、永続Pluginを追加することはできません。

永続Pluginには以下が含まれますが、これらに限定されません：

- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate)

権限が設定されていない状態で永続PluginがAsset/Collectionに追加された場合、権限タイプは`update authority`タイプにデフォルト設定されます。

## Collection Plugin

Collection Pluginは、Collectionレベルで追加されるPluginで、Collection全体に影響を与えることができます。これは特にロイヤリティに有用で、[royalties plugin](/ja/smart-contracts/core/plugins/royalties)をCollection Assetに割り当てると、そのCollection内のすべてのAssetがそのPluginを参照するようになります。

Collectionは`永続Plugin`と`権限管理Plugin`のみにアクセスできます。

## Plugin優先度

MPL Core AssetとMPL Core Collection Assetの両方が同じPluginタイプを共有する場合、AssetレベルのPluginとそのデータがCollectionレベルのPluginよりも優先されます。

これは、Assetコレクションの異なるレベルでロイヤリティを設定するなど、創造的な方法で使用できます。

- Collection Assetには2%のRoyalties Pluginが割り当てられています
- Collection内のスーパーレアなMPL Core Assetには5%のRoyalty Pluginが割り当てられています

上記の場合、Collectionからの通常のMPL Core Asset販売では2%のロイヤリティが保持されますが、スーパーレアなMPL Core Assetは、Collection Asset Royalties Pluginよりも優先される独自のRoyalties Pluginを持っているため、販売時に5%のロイヤリティが保持されます。

## Plugin表

| Plugin                                                                   | 所有者管理 | 権限管理 | 永続 |
| ------------------------------------------------------------------------ | ---------- | -------- | ---- |
| [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)                  | ✅         |          |      |
| [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)                      | ✅         |          |      |
| [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)                          | ✅         |          |      |
| [Royalties](/ja/smart-contracts/core/plugins/royalties)                                  |            | ✅       |      |
| [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate)                      |            | ✅       |      |
| [Attribute](/ja/smart-contracts/core/plugins/attribute)                                  |            | ✅       |      |
| [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate) |            |          | ✅   |
| [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)  |            |          | ✅   |
| [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate)      |            |          | ✅   |

## Pluginとライフサイクルイベント

MPL CoreのPluginは、作成、転送、バーン、更新などの特定のライフサイクルアクションの結果に影響を与える能力を持っています。

各Pluginは、アクションを`拒否`、`承認`、または`強制承認`して望ましい結果にする能力を持っています。

ライフサイクルイベント中、アクションは事前定義されたPluginのリストを下って、それらに対してチェックと検証を行います。
Pluginの条件が検証されると、ライフサイクルは通過してアクションを続行します。

Pluginの検証が失敗すると、ライフサイクルは停止し、拒否されます。

Plugin検証の規則は、以下の条件の階層に従います：

- 強制承認がある場合、常に承認
- そうでなければ、拒否がある場合は拒否
- そうでなければ、承認がある場合は承認
- そうでなければ拒否

`強制承認`検証は、1stパーティPluginと`Permanent Delegate`Pluginでのみ利用可能です。

### 強制承認

強制承認は、Pluginの検証をチェックする際に最初に行われるチェックです。現在、検証を強制承認するPluginは以下のとおりです：

- **Permanent Transfer**
- **Permanent Burn**
- **Permanent Freeze**

これらのPluginは、永続的でない対応Pluginや他のPluginよりもアクションで優先されます。

#### 例
AssetレベルでFreeze PluginによってAssetが凍結されている間に、同時にAssetに**Permanent Burn** Pluginがある場合、Assetが凍結されていても、永続Pluginの`forceApprove`性質により、**Permanent Burn** Plugin経由で呼び出されたバーン手順は実行されます。

### 作成

{% totem %}

| Plugin    | アクション | 条件     |
| --------- | ---------- | -------- |
| Royalties | 拒否可能   | Ruleset |

{% /totem %}

### 更新

{% totem %}
更新には現在Plugin条件や検証はありません。
{% /totem %}

### 転送

{% totem %}

| Plugin                      | アクション | 条件        |
| --------------------------- | ---------- | ----------- |
| Royalties                   | 拒否可能   | Ruleset     |
| Freeze Delegate             | 拒否可能   | isFrozen    |
| Transfer Delegate           | 承認可能   | isAuthority |
| Permanent Freeze Delegate   | 拒否可能   | isFrozen    |
| Permanent Transfer Delegate | 承認可能   | isAuthority |

{% /totem %}

### バーン

{% totem %}

| Plugin                    | アクション | 条件        |
| ------------------------- | ---------- | ----------- |
| Freeze Delegate           | 拒否可能   | isFrozen    |
| Burn Delegate             | 拒否可能   | isAuthority |
| Permanent Freeze Delegate | 拒否可能   | isFrozen    |
| Permanent Burn Delegate   | 承認可能   | isAuthority |

{% /totem %}

### Plugin追加

{% totem %}

| Plugin          | アクション | 条件        |
| --------------- | ---------- | ----------- |
| Royalties       | 拒否可能   | Ruleset     |
| Update Delegate | 承認可能   | isAuthority |

{% /totem %}

### Plugin削除

{% totem %}

| Plugin          | アクション | 条件        |
| --------------- | ---------- | ----------- |
| Royalties       | 拒否可能   | Ruleset     |
| Update Delegate | 承認可能   | isAuthority |

{% /totem %}

### Plugin権限承認

{% totem %}
承認には現在Plugin条件や検証はありません。
{% /totem %}

### 権限Plugin取り消し

{% totem %}
取り消しには現在Plugin条件や検証はありません。
{% /totem %}

## 一般的なユースケース

| ユースケース | 推奨Plugin |
|----------|-------------------|
| クリエイターロイヤリティの強制 | [Royalties](/ja/smart-contracts/core/plugins/royalties) |
| エスクローレスステーキング | [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) |
| マーケットプレースリスティング | [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) + [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) |
| オンチェーンゲームステータス | [Attributes](/ja/smart-contracts/core/plugins/attribute) |
| サードパーティバーンの許可 | [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) |
| 永続ステーキングプログラム | [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate) |

## FAQ

### Asset作成後にPluginを追加できますか？

はい、永続Plugin以外は可能です。所有者管理Pluginには所有者の署名が必要です。権限管理Pluginには更新権限の署名が必要です。

### Assetが転送されるとPluginはどうなりますか？

所有者管理Plugin（Transfer、Freeze、Burn Delegate）は転送時に権限が自動的に取り消されます。権限管理Pluginと永続Pluginは維持されます。

### AssetはそのCollectionと同じPluginを持つことができますか？

はい。両方が同じPluginタイプを持つ場合、AssetレベルのPluginがCollectionレベルのPluginよりも優先されます。

### Pluginを削除するにはどうすればよいですか？

`removePlugin`命令を使用します。Plugin権限のみが削除できます。[Pluginの削除](/ja/smart-contracts/core/plugins/removing-plugins)を参照してください。

### カスタムPluginを作成できますか？

いいえ。組み込みPluginのみがサポートされています。Pluginシステムはサードパーティによる拡張はできません。

### Pluginには追加のSOLがかかりますか？

Pluginを追加するとアカウントサイズが増加し、レントが増加します。コストはデータサイズに応じてPluginごとに約0.001 SOLと最小限です。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Plugin** | Asset/Collectionに動作やデータを追加するモジュラー拡張機能 |
| **所有者管理** | 追加に所有者の署名が必要なPluginタイプ |
| **権限管理** | 更新権限が追加できるPluginタイプ |
| **永続** | 作成時にのみ追加できるPluginタイプ |
| **ライフサイクルイベント** | Pluginが検証できるアクション（作成、転送、バーン） |
| **強制承認** | 他の拒否を上書きする永続Plugin検証 |
| **Plugin権限** | Pluginを更新または削除する権限を持つアカウント |

---

*Metaplex Foundationによって管理 · 最終確認2026年1月 · @metaplex-foundation/mpl-coreに適用*
