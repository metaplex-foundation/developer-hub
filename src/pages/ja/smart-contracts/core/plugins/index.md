---
title: プラグイン概要
metaTitle: アセットプラグイン概要 | Core
description: 新しいMetaplex Coreデジタルアセット標準は、プラグインを通じてアセットとやり取りする新しい方法を提供します。プラグインをアセットに追加して動作を変更したりデータを保存したりして、SolanaブロックチェーンのNFTおよびデジタルアセットをさらに強化できます。
---

## ライフサイクル

Core Assetのライフサイクル中に、以下のようなイベントがトリガーされる可能性があります：

- 作成
- 転送
- 更新
- バーン
- プラグインの追加
- 権限プラグインの承認
- 権限プラグインの削除

ライフサイクルイベントは、作成からウォレット間の転送、アセットの破壊まで、さまざまな方法でアセットに影響を与えます。アセットレベルまたはコレクションレベルに付加されたプラグインは、これらのライフサイクルイベント中に検証プロセスを実行し、イベントの実行を`承認`、`拒否`、または`強制承認`します。

## プラグインとは？

プラグインは、データを保存したりアセットに追加機能を提供したりできるNFT用のオンチェーンアプリのようなものです。

## プラグインの種類

### 所有者管理プラグイン

所有者管理プラグインは、トランザクションにアセット所有者の署名が存在する場合にのみCore Assetに追加できるプラグインです。

所有者管理プラグインには以下が含まれますが、これらに限定されません：

- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)（マーケットプレース、ゲーム）
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)（マーケットプレース、ステーキング、ゲーム）
- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)（ゲーム）

権限が設定されていない状態で所有者管理プラグインがアセット/コレクションに追加された場合、権限タイプは`owner`タイプにデフォルト設定されます。

所有者管理プラグインの権限は、転送時に自動的に取り消されます。

### 権限管理プラグイン

権限管理プラグインは、MPL Core AssetまたはCore Collectionの権限がいつでも追加および更新できるプラグインです。

権限管理プラグインには以下が含まれますが、これらに限定されません：

- [Royalties](/ja/smart-contracts/core/plugins/royalties)
- [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate)
- [Attribute](/ja/smart-contracts/core/plugins/attribute)

権限引数が存在しない状態で権限管理プラグインがアセット/コレクションに追加された場合、プラグインは権限タイプ`update authority`にデフォルト設定されます。

### 永続プラグイン

**永続プラグインは、作成時にのみCore Assetに追加できるプラグインです。** アセットが既に存在する場合、永続プラグインを追加することはできません。

永続プラグインには以下が含まれますが、これらに限定されません：

- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate)

権限が設定されていない状態で永続プラグインがアセット/コレクションに追加された場合、権限タイプは`update authority`タイプにデフォルト設定されます。

## コレクションプラグイン

コレクションプラグインは、コレクションレベルで追加されるプラグインで、コレクション全体に影響を与えることができます。これは特にロイヤリティに有用で、[ロイヤリティプラグイン](/ja/smart-contracts/core/plugins/royalties)をコレクションアセットに割り当てると、そのコレクション内のすべてのアセットがそのプラグインを参照するようになります。

コレクションは`永続プラグイン`と`権限管理プラグイン`のみにアクセスできます。

## プラグイン優先度

MPL Core AssetとMPL Core Collection Assetの両方が同じプラグインタイプを共有する場合、アセットレベルのプラグインとそのデータがコレクションレベルのプラグインよりも優先されます。

これは、アセットコレクションの異なるレベルでロイヤリティを設定するなど、創造的な方法で使用できます。

- コレクションアセットには2%のロイヤリティプラグインが割り当てられています
- コレクション内のスーパーレアなMPL Core Assetには5%のロイヤリティプラグインが割り当てられています

上記の場合、コレクションからの通常のMPL Core Asset販売では2%のロイヤリティが保持されますが、スーパーレアなMPL Core Assetは、コレクションアセットロイヤリティプラグインよりも優先される独自のロイヤリティプラグインを持っているため、販売時に5%のロイヤリティが保持されます。

## プラグイン表

| プラグイン                                                                   | 所有者管理 | 権限管理 | 永続 |
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

## プラグインとライフサイクルイベント

MPL Coreのプラグインは、作成、転送、バーン、更新などの特定のライフサイクルアクションの結果に影響を与える能力を持っています。

各プラグインは、アクションを`拒否`、`承認`、または`強制承認`して望ましい結果にする能力を持っています。

ライフサイクルイベント中、アクションは事前定義されたプラグインのリストを下って、それらに対してチェックと検証を行います。
プラグインの条件が検証されると、ライフサイクルは通過してアクションを続行します。

プラグインの検証が失敗すると、ライフサイクルは停止し、拒否されます。

プラグイン検証の規則は、以下の条件の階層に従います：

- 強制承認がある場合、常に承認
- そうでなければ、拒否がある場合は拒否
- そうでなければ、承認がある場合は承認
- そうでなければ拒否

`強制承認`検証は、1stパーティプラグインと`Permanent Delegate`プラグインでのみ利用可能です。

### 強制承認

強制承認は、プラグインの検証をチェックする際に最初に行われるチェックです。現在、検証を強制承認するプラグインは以下のとおりです：

- **Permanent Transfer**
- **Permanent Burn**
- **Permanent Freeze**

これらのプラグインは、永続的でない対応プラグインや他のプラグインよりもアクションで優先されます。

#### 例
アセットレベルでFreezeプラグインによってアセットが凍結されている間に、同時にアセットに**Permanent Burn**プラグインがある場合、アセットが凍結されていても、永続プラグインの`forceApprove`性質により、**Permanent Burn**プラグイン経由で呼び出されたバーン手順は実行されます。

### 作成

{% totem %}

| プラグイン | アクション | 条件     |
| --------- | ---------- | -------- |
| Royalties | 拒否可能   | ルールセット |

{% /totem %}

### 更新

{% totem %}
更新には現在プラグイン条件や検証はありません。
{% /totem %}

### 転送

{% totem %}

| プラグイン                      | アクション | 条件        |
| --------------------------- | ---------- | ----------- |
| Royalties                   | 拒否可能   | ルールセット   |
| Freeze Delegate             | 拒否可能   | isFrozen    |
| Transfer Delegate           | 承認可能   | isAuthority |
| Permanent Freeze Delegate   | 拒否可能   | isFrozen    |
| Permanent Transfer Delegate | 承認可能   | isAuthority |

{% /totem %}

### バーン

{% totem %}

| プラグイン                    | アクション | 条件        |
| ------------------------- | ---------- | ----------- |
| Freeze Delegate           | 拒否可能   | isFrozen    |
| Burn Delegate             | 拒否可能   | isAuthority |
| Permanent Freeze Delegate | 拒否可能   | isFrozen    |
| Permanent Burn Delegate   | 承認可能   | isAuthority |

{% /totem %}

### プラグイン追加

{% totem %}

| プラグイン        | アクション | 条件        |
| --------------- | ---------- | ----------- |
| Royalties       | 拒否可能   | ルールセット   |
| Update Delegate | 承認可能   | isAuthority |

{% /totem %}

### プラグイン削除

{% totem %}

| プラグイン        | アクション | 条件        |
| --------------- | ---------- | ----------- |
| Royalties       | 拒否可能   | ルールセット   |
| Update Delegate | 承認可能   | isAuthority |

{% /totem %}

### プラグイン権限承認

{% totem %}
承認には現在プラグイン条件や検証はありません。
{% /totem %}

### 権限プラグイン取り消し

{% totem %}
取り消しには現在プラグイン条件や検証はありません。
{% /totem %}