---
title: 更新
metaTitle: MPL-Distro 配布を更新する
description: 配布 PDA を作り直さずに MPL-Distro 設定、権限者、permissioned distributor を変更します。
keywords:
  - update MPL-Distro
  - change distribution authority
  - change Merkle root
  - permissioned distributor
about:
  - MPL-Distro
  - Distribution Updates
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
faqs:
  - q: 権限者はアクティブ期間中に Merkle ルートを変更できますか？
    a: いいえ。ルート、ツリー高、開始時刻、claimant 数はアクティブ期間中ロックされますが、開始前または終了後は変更できます。
  - q: アクティブな配布中にクレーム終了時刻を延長できますか？
    a: はい。権限者は配布がアクティブな間に endTime を更新できます。
  - q: 新しい権限者は権限変更に署名する必要がありますか？
    a: いいえ。現在の権限者だけが updateDistribution に署名します。送信前に宛先鍵を確認してください。
---

現在の [MPL-Distro](/ja/smart-contracts/mpl-distro) 権限者は、新しい PDA を作らず既存のクレームレシートを無効化せずに、選択した配布フィールドを変更できます。 {% .lead %}

## 概要

`updateDistribution` は既存配布に対して権限者が承認した設定変更を適用します。

- 完全な割り当て設定はアクティブなクレーム期間外でのみ変更します。
- 権限者や permissioned distributor などの運用フィールドはクレーム中に変更できます。
- 権限者変更は即時かつセキュリティ上重要として扱います。
- ルート更新と同時に、置き換え Merkle 証明をアトミックに公開します。

## クイックスタート

MPL-Distro 配布の更新は、既存アカウントへの署名付き設定変更です。

1. クラスタ時刻が包含的な `startTime`–`endTime` の間にあるかを確認します。
2. 変更すべきフィールドだけを `updateDistribution` に渡します。
3. Merkle ルートが変わる場合は、すべてのオフチェーン証明を同時に置き換えます。
4. 確認後に保存済み権限者と permissioned distributor を検証します。

## MPL-Distro の更新権限

現在の権限者がすべての配布更新に署名する必要があります。

| フィールド | 開始前 | アクティブ期間中 | 終了後 |
|---|---:|---:|---:|
| `merkleRoot` | Yes | No | Yes |
| `treeHeight` | Yes | No | Yes |
| `startTime` | Yes | No | Yes |
| `endTime` | Yes | Yes | Yes |
| `totalClaimants` | Yes | No | Yes |
| `newAuthority` | Yes | Yes | Yes |
| `name` | Yes | Yes | Yes |
| `newPermissionedDistributor` | Yes | Yes | Yes |

アクティブ期間は両方の境界タイムスタンプを含みます。保護された割り当てフィールドは `startTime <= clusterTime <= endTime` のときロックされます。

{% callout title="ルート更新には一致する証明が必要" type="warning" %}
Merkle ルートを変えると、以前のルート用に生成したすべての証明が無効になります。置き換え割り当てファイルをオンチェーン更新とアトミックに公開して保存してください。
{% /callout %}

## MPL-Distro 設定を更新する

変更すべきフィールドだけを `updateDistribution` に渡します。

{% code-tabs-imported from="mpl-distro/update_distribution" frameworks="umi" filename="updateDistribution" /%}

`totalClaimants` を明示的な `treeHeight` なしで変えると、プログラムは最小高を推論します。新しく準備したツリーが返す `treeHeight` を渡す方が明確で、claimant 数推論への結合を避けられます。

## 配布権限者を変更する

`updateDistribution` は、更新、入金、トークン出金、補助金出金ができる署名者を置き換えます。

{% code-tabs-imported from="mpl-distro/change_distribution_authority" frameworks="umi" filename="changeDistributionAuthority" /%}

新しい権限者は更新に署名する必要はありません。変更を送信する前に宛先公開鍵を確認し、その署名インフラが稼働していることを確かめてください。

## Permissioned Distributor を変更する

`updateDistribution` は `AllowedDistributor.Permissioned` で設定された配布が受け付ける署名者を変更します。`updateDistribution` に `newPermissionedDistributor` を渡します。

この変更は Merkle ツリーや既存レシートを変えません。以前の distributor が署名した進行中トランザクションは、更新が着地した後に失敗します。

## 更新エラー

更新エラーは権限者とタイミング制約を保護します。

| エラー | 意味 | 対処 |
|---|---|---|
| `DistributionStarted` | 保護された割り当てフィールドがアクティブ期間中に変更された | 配布終了まで待つか、フィールドを変えない |
| `InvalidDistributionAuthority` | 渡された署名者が保存済み権限者ではない | 現在の権限者を使う |
| `InvalidTreeHeight` | ツリー高が最大を超える | 64 以下の値を使う |
| `NameTooLong` | UTF-8 名が 32 バイトを超える | 配布名を短くする |

## 注意事項

設定変更は確認後すぐに証明の有効性と運用権限に影響します。

- アクティブ期間中の `endTime` 変更はクレーム期間を延長または短縮できます。
- 期間後のルート更新は既存クレームレシートを削除しません。
- 既存レシートは更新後も配布 PDA にキーされたままです。

## FAQ

### 権限者はアクティブ期間中に Merkle ルートを変更できますか？

いいえ。ルート、ツリー高、開始時刻、claimant 数はアクティブ期間中ロックされますが、開始前または終了後は変更できます。

### アクティブな配布中にクレーム終了時刻を延長できますか？

はい。権限者は配布がアクティブな間に `endTime` を更新できます。

### 新しい権限者は権限変更に署名する必要がありますか？

いいえ。現在の権限者だけが `updateDistribution` に署名します。送信前に宛先鍵を確認してください。
