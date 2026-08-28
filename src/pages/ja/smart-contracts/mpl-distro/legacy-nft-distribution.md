---
title: レガシー NFT 配布
metaTitle: MPL-Distro でレガシー NFT 保有者へトークンを配布する
description: レガシー NFT mint で MPL-Distro 割り当てを設定し、各 NFT の現在の所有者が SPL トークンをクレームできるようにします。
keywords:
  - legacy NFT holder rewards
  - Token Metadata NFT airdrop
  - MPL-Distro NFT distribution
  - NFT-gated token claim
about:
  - MPL-Distro
  - Legacy NFTs
  - Holder Rewards
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - レガシー NFT mint アドレスをキーにした割り当てを構築する
  - LegacyNft 配布を作成して資金投入する
  - 現在の NFT 所有者とトークンアカウントを解決する
  - distributeToLegacyNft クレームを送信する
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: NFT が転送された後、誰が割り当てを受け取りますか？
    a: クレーム実行時に NFT トークンアカウントを所有するウォレットが割り当てを受け取ります。
  - q: 後の NFT 所有者が再クレームできますか？
    a: いいえ。クレームレシートは NFT mint、amount、nonce でキーされるため、所有権移転ではリセットされません。
  - q: このフローで MPL Core アセット保有者へトークンを配布できますか？
    a: いいえ。LegacyNft は SPL トークンアカウントの所有権を検証します。Core アセットには Wallet 配布のアセットサイナーパターンが必要です。
  - q: LegacyNft は pNFT で動きますか？
    a: はい。pNFT トークンアカウントがオリジナル SPL Token プログラム所有で残高 1 のときです。Token-2022 pNFT は非対応です。
---

レガシー NFT 配布は NFT mint アドレスにトークン割り当てを付け、クレーム実行時に各 NFT を所有するウォレットへ支払います。 {% .lead %}

## 概要

`LegacyNft` 配布はレガシー NFT mint を Merkle リーフとして使い、`distributeToLegacyNft` 中に現在の SPL トークンアカウント所有者を検証します。

- 所有者ウォレットではなく NFT mint アドレスから割り当てツリーを構築します。
- `DistributionType.LegacyNft` で配布を作成します。
- 配布トークンを現在の所有者のトークンアカウントへ送ります。
- NFT mint に対してレシートを記録し、所有権移転で 2 回目のクレームができないようにします。

{% callout title="レガシー NFT のみ" type="warning" %}
このフローは残高 1 のオリジナル SPL Token アカウントを検証します。そのトークンプログラム上の Token Metadata NFT と pNFT が対象です。MPL Core アセットや Token-2022 NFT とは互換ではありません。
{% /callout %}

## レガシー NFT 割り当てモデル

各割り当てはレガシー NFT mint アドレス、トークン量、任意の nonce をコミットします。

{% code-tabs-imported from="mpl-distro/legacy_nft_allocations" frameworks="umi" filename="legacyNftAllocations" /%}

スナップショット所有者ウォレットからリーフを構築しないでください。NFT mint が安定した identity であり、クレーム前の所有権移転を許します。

## レガシー NFT の所有権検証

プログラムはクレーム時に NFT の SPL トークンアカウントから現在の所有権を検証します。

渡された NFT トークンアカウントは次を満たす必要があります。

- オリジナル SPL Token プログラム所有であること。
- Merkle リーフにコミットされた NFT mint を使うこと。
- ちょうど 1 トークンを保持すること。
- 渡された `nftOwner` が所有者であること。

プログラムは [Token Metadata](/ja/smart-contracts/token-metadata)、Token Record、Authorization Rules を呼びません。上記の SPL トークンアカウントだけを確認します。

## レガシー NFT クレームを送信する

`distributeToLegacyNft` 命令は mint 証明を検証し、現在の NFT 所有者の associated token account へトークンを送ります。

{% code-tabs-imported from="mpl-distro/claim_legacy_nft" frameworks="umi" filename="claimLegacyNft" /%}

`nftOwner` を省略すると、SDK はトランザクション支払者をデフォルトにし、その支払者の NFT トークンアカウントを導出します。Permissionless サービスが別の所有者の代わりに支払うときは `nftOwner` を明示してください。

{% code-tabs-imported from="mpl-distro/sponsored_legacy_nft_claim" frameworks="umi" filename="sponsoredLegacyNftClaim" /%}

## レガシー NFT クレームレシート

レガシー NFT レシートは NFT mint を受取人 identity として保存します。

| レシート要素 | 値 |
|---|---|
| Recipient seed | NFT mint（所有者ウォレットではない） |
| Destination | 配布 mint に対する現在の所有者の associated token account |
| Ownership transfer effect | 未クレーム割り当ての受取人を変える |
| Repeat claim after transfer | レシートが NFT mint に結びついたままなので拒否される |

## レガシー NFT 配布のアクセスモード

Allowed distributor モードは NFT mint ではなく NFT 所有者に適用されます。

| モード | クレーム署名者の要件 |
|---|---|
| `Permissionless` | 検証済みの現在の所有者のために任意の支払者が送信できる |
| `Recipient` | 現在の `nftOwner` が署名する必要がある |
| `Permissioned` | 設定された permissioned distributor が署名する必要がある |

現在の保有者がオプトインする必要があるときは `Recipient` を使います。検証済みの現在の所有者が署名せず、リレイヤーがクレームを支払えるときは `Permissionless` を使います。

## レガシー NFT スナップショットの考慮点

Merkle ツリーは対象 NFT mint を固定しますが、各 mint がクレームするまで所有権は動的です。

この区別からよくある 2 つのモデルが生まれます。

1. **Mint 適格モデル:** 後の転送に関係なく対象 NFT mint はクレームでき、クレーム時の所有者が報酬を受け取ります。
2. **所有者スナップショットモデル:** スナップショット後の転送で適格性を動かしたくないときは、スナップショット所有者ウォレットを使い [ウォレット配布](/ja/smart-contracts/mpl-distro/wallet-distribution) にします。

{% callout title="マーケットプレイスの驚きを防ぐ" type="note" %}
適格性が NFT mint に従うのかスナップショット所有者に従うのかを公開してください。買い手は未クレームの mint ベース割り当てを受け取れますが、所有権だけではクレーム状態を判断できません。アプリケーションがクレームレシートを確認すべきです。
{% /callout %}

## 注意事項

レガシー NFT 配布は完全な NFT メタデータ意味論ではなく、ファンジブルなトークンアカウントの事実を検証します。

- コレクション検証と NFT 適格性はルート生成前に行う必要があります。
- 凍結または委任された NFT トークンアカウントはアプリケーション層での確認が必要です。
- 報酬トークンは NFT 所有者の正規 associated token account へ行きます。
- 現行プログラムは償還後にクレームレシートをクローズしません。

## FAQ

### NFT が転送された後、誰が割り当てを受け取りますか？

クレーム実行時に NFT トークンアカウントを所有するウォレットが割り当てを受け取ります。

### 後の NFT 所有者が再クレームできますか？

いいえ。クレームレシートは NFT mint、amount、nonce でキーされるため、所有権移転ではリセットされません。

### このフローで MPL Core アセット保有者へトークンを配布できますか？

いいえ。`LegacyNft` は SPL トークンアカウントの所有権を検証します。Core アセットには `Wallet` 配布のアセットサイナーパターンが必要です。

### LegacyNft は pNFT で動きますか？

はい。pNFT トークンアカウントがオリジナル SPL Token プログラム所有で残高 1 のときです。プログラムは Token Metadata、Token Record、Authorization Rules を呼びません。Token-2022 pNFT は非対応です。
