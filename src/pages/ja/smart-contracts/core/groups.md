---
title: Core グループ
metaTitle: Core グループ概要 | Metaplex Core
description: mpl-core GroupV1 アカウントの概要 — コレクション、アセット、ネストされたグループをまとめる分類機能
updated: '07-02-2026'
keywords:
  - mpl-core groups
  - GroupV1
  - taxonomy
  - group collections
about:
  - NFT collections
  - Collection management
proficiencyLevel: Intermediate
faqs:
  - q: コレクションとグループの違いは何ですか？
    a: コレクションは共有メタデータとコレクションレベルのプラグインの下で Core Asset をまとめます。グループは、コレクション、スタンドアロンアセット、その他のグループを参照できる分類コンテナです。コレクションは「この NFT はどのシリーズに属するか？」に答え、グループは「このコレクションやアセットはどの上位セットに含まれるか？」に答えます。
  - q: コレクションは複数のグループに属せますか？
    a: はい。コレクションをグループに追加すると、mpl-core は親グループのアドレスをコレクションの Groups プラグインに書き込みます。コレクションはオンチェーンのベクトル上限まで複数の親グループを列挙できます。
  - q: グループはネストできますか？
    a: はい。グループは子グループを含み、親グループも列挙できます。親子リンクは両方のアカウントで同期されます。1 つのグループは最大 8 つの親グループに属せます。
  - q: グループ化されたコレクション内のアセットは自動的にグループに属しますか？
    a: いいえ。グループメンバーシップは直接メンバーのみに保存されます。コレクションをグループに追加すると、そのコレクションが `group.collections` に追加され、コレクションに Groups プラグインが書き込まれます。そのコレクションにミントされた NFT は自動的に `group.assets` には追加されません。
  - q: スタンドアロンアセットをグループの直接メンバーにできますか？
    a: はい。`addAssetsToGroup` を使って、コレクションなしでアセットを `group.assets` に直接追加できます。コレクション管理アセットも、適切な権限者が署名すれば明示的に追加できます。
  - q: 誰がグループメンバーシップを変更できますか？
    a: グループの update authority が追加・削除命令に署名します。コレクション管理アセットについては、コレクションの update authority（または認可されたデリゲート）がグループの代理としてそれらのアセットを追加・削除できます。
---

## 概要

**Core Groups**（`GroupV1`）は、[コレクション](/ja/smart-contracts/core/collections)、[アセット](/ja/smart-contracts/core/what-is-an-asset)、他のグループを上位のセットにまとめる分類アカウントです。例として、複数のコレクションを含むブランドの傘下や、スタンドアロンアセットのキュレーション用ディレクトリなどがあります。

- グループはコレクションと同様に独自の `name` と `uri` を保持します
- グループはベクトルごとに最大 **256** 件のコレクション、子グループ、親グループリンク、またはアセットを直接含めます
- グループに追加されたコレクションとアセットには、親グループのアドレスを列挙する **Groups プラグイン** が付与されます

**ジャンプ先：** [グループを作成](#グループの作成) · [メンバーシップを管理](#グループメンバーシップの管理) · [グループを取得](#グループの取得)

## コレクションとグループの違い

| | **コレクション** | **グループ** |
| --- | --- | --- |
| 目的 | シリーズ NFT の共有メタデータとプラグイン | コレクション・アセット・グループの分類／ディレクトリ |
| ユーザー NFT を所有 | はい — アセットはコレクションを参照 | いいえ — アセットは（あれば）元のコレクションに残る |
| 典型的な質問 | 「この NFT はどのシリーズ？」 | 「どのブランド・シーズン・ディレクトリにこのコレクションが含まれる？」 |
| オンチェーン | アセットの `updateAuthority` がコレクションを指す | `group.collections`、`group.assets`、`group.groups` に列挙 |

シリーズ単位のロイヤリティ、凍結ルール、共有アートワークが必要な場合は **コレクション** を使います。ミント方法を変えずに複数のコレクションやスタンドアロンアセットを 1 つのラベルで整理する場合は **グループ** を使います。

## GroupV1 アカウント

`GroupV1` アカウントには次が保存されます：

| フィールド | 説明 |
| --- | --- |
| `updateAuthority` | グループの更新とメンバーシップ変更ができる権限 |
| `name` | 表示名 |
| `uri` | オフチェーン JSON メタデータ URI |
| `collections` | このグループの**直接**の子コレクション |
| `groups` | このグループが含む子グループ |
| `parentGroups` | このグループを含む親グループ |
| `assets` | このグループの**直接**メンバーとなるアセット |

オンチェーン制限（mpl-core より）：

- ベクトル（`collections`、`groups`、`parentGroups`、`assets`）あたり最大 **256** エントリ
- グループあたり親グループは最大 **8** 件（`MAX_GROUP_NESTING_DEPTH`）

{% callout type="note" %}
グループはコレクションメンバーシップを自動的には辿りません。コレクションをグループに追加しても、そのコレクション内の NFT は `group.assets` に追加されません。グループ化されたコレクション内の NFT を扱う場合は、コレクションとそのアセットを個別に操作してください。
{% /callout %}

## Groups プラグイン

コレクションまたはアセットをグループに追加すると、mpl-core はそのメンバーに **Groups** 権限管理プラグインが存在することを保証します。プラグインには親グループの公開鍵が保存されます。

Groups プラグインは、少なくとも 1 つのグループに属している間、**グループメンバー自体**（コレクションアカウントまたは直接グループ化されたアセット）のバーンをブロックします。グループ化されたコレクション内のアセットをバーンしても、コレクションはグループから削除されません。

## グループの作成

`createGroup` / `createGroupV1` で新しいグループアカウントをデプロイします：

{% code-tabs-imported from="core/create-group" frameworks="umi" /%}

作成時に `relationships` を渡すと、1 トランザクションでコレクション、子グループ、親グループ、アセットをリンクできます。各 relationship エントリは `RelationshipKind` を使用します：`Collection`、`ChildGroup`、`ParentGroup`、`Asset`。

## グループメンバーシップの管理

特記がない限り、すべてのメンバーシップ変更は **グループの update authority** が署名します。

| 操作 | SDK ヘルパー | 更新内容 |
| --- | --- | --- |
| コレクション追加 | `addCollectionsToGroup` | グループ `collections` + コレクションの Groups プラグイン |
| コレクション削除 | `removeCollectionsFromGroup` | 両側 |
| アセット追加 | `addAssetsToGroup` | グループ `assets` + アセットの Groups プラグイン |
| アセット削除 | `removeAssetsFromGroup` | 両側 |
| 子グループ追加 | `addGroupsToGroup` | 親の `groups` + 子の `parentGroups` |
| 子グループ削除 | `removeGroupsFromGroup` | 両側 |
| メタデータ／権限更新 | `updateGroup` | グループ名、URI、update authority |
| 空のグループをクローズ | `closeGroup` | グループアカウントをクローズ |

### コレクションをグループに追加

{% code-tabs-imported from="core/add-collection-to-group" frameworks="umi" /%}

### スタンドアロンアセットをグループに追加

{% code-tabs-imported from="core/add-asset-to-group" frameworks="umi" /%}

### グループのネスト

{% code-tabs-imported from="core/nest-groups" frameworks="umi" /%}

親と子のベクトルは同期されます。親は `groups` に子を、子は `parentGroups` に親を記録します。

## グループの取得

mpl-core SDK でオンチェーン状態を読み取ります：

{% code-tabs-imported from="core/fetch-group" frameworks="umi" /%}

update authority 別にグループを一覧するには `getGroupV1GpaBuilder`（GPA クエリ）を使います。グループ数は通常少ないため問題になりにくいですが、大量の Asset を走査する場合は DAS を優先してください。

{% code-tabs-imported from="core/fetch-groups-by-authority" frameworks="umi" /%}

## クイックリファレンス

### プログラム ID

| ネットワーク | アドレス |
| --- | --- |
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### SDK ヘルパー

| タスク | 関数 |
| --- | --- |
| 作成 | `createGroup` |
| 取得 | `fetchGroupV1` |
| 権限別一覧 | `getGroupV1GpaBuilder` |
| 更新 | `updateGroup` |
| コレクション追加 | `addCollectionsToGroup` |
| アセット追加 | `addAssetsToGroup` |
| ネスト | `addGroupsToGroup` |
| クローズ | `closeGroup` |
