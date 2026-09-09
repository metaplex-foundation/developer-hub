---
title: 作成
metaTitle: MPL-Distro 配布の作成 | Metaplex CLI
description: mplx distro create でウォレットまたはレガシー NFT の MPL-Distro 配布を作成します。
keywords:
  - mplx distro create
  - MPL-Distro CLI
  - Merkle airdrop create
  - Metaplex CLI
about:
  - MPL-Distro
  - Metaplex CLI
  - token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - prepareDistribution で base58 Merkle ルートを生成する
  - name、mint、claimant 数、ISO 期間、ルートを指定して mplx distro create を実行する
  - 出力された配布公開鍵を保存する
howToTools:
  - Metaplex CLI (mplx)
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: distro create は Merkle 証明を生成しますか？
    a: いいえ。prepareDistribution ですでに構築した 32 バイトのルートを渡します。証明はオフチェーンに保存する必要があります。
  - q: merkleRoot フラグの形式は何ですか？
    a: ちょうど 32 バイトの base58 エンコードです。16 進文字列は拒否されます。
  - q: CLI で permissioned distributor を作成できますか？
    a: いいえ。--allowedDistributor が受け付けるのは permissionless または recipient のみです。
---

{% callout title="実行内容" %}
ターミナルから [MPL-Distro](/ja/smart-contracts/mpl-distro) アカウントを作成します。
- Merkle ルート、クレーム期間、mint、アクセスモードをオンチェーンにコミット
- ウォレットまたはレガシー NFT の割り当てモデルを選択
- 入金、取得、出金用に配布 PDA を保存
{% /callout %}

## 概要

`mplx distro create` コマンドは、既存のオリジナル SPL Token mint に対して [MPL-Distro](/ja/smart-contracts/mpl-distro) PDA を初期化します。

- **必須**（`--wizard` または `--distroConfig` 以外）: `--name`、`--mint`、`--totalClaimants`、`--startTime`、`--endTime`、`--merkleRoot`
- **デフォルト**: `--distributionType wallet`、`--allowedDistributor permissionless`、`--subsidizeReceipts` オフ
- **出力**: 配布 PDA（base58 公開鍵）、mint、claimant 数、タイプ、タイムスタンプ、トランザクション署名

公開済みの `@metaplex-foundation/cli` 0.4.3 はまだ mpl-distro 0.3.x に依存します。0.4.x クライアントを使用してください。[CLI 概要](/ja/dev-tools/cli/distro) を参照してください。

**ジャンプ先:** [基本的な使用法](#基本的な使用法) · [オプション](#オプション) · [JSON 設定ファイル](#json-設定ファイル) · [例](#例) · [出力](#出力) · [一般的なエラー](#一般的なエラー) · [FAQ](#faq)

## 基本的な使用法

必須フラグをすべて渡すか、ウィザードまたは JSON ファイルを使います。

```bash {% title="ウォレット配布の作成" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 1000 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-30T23:59:59Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>
```

```bash {% title="ウィザードモード" %}
mplx distro create --wizard
```

## オプション

create はフラグ、JSON ファイル、対話型ウィザードを受け付けます。`--wizard` と `--distroConfig` は個別の必須フラグと同時に使えません。

| フラグ | 短縮 | 説明 | 必須 | デフォルト |
|------|-------|-------------|----------|---------|
| `--name <string>` | `-n` | 表示名、最大 32 バイト | Yes* | |
| `--mint <string>` | `-m` | 既存のオリジナル SPL Token mint | Yes* | |
| `--totalClaimants <integer>` | `-t` | ツリー高の計算に使う割り当て数 | Yes* | |
| `--startTime <ISO-8601>` | | クレーム期間の開始（UTC 推奨） | Yes* | |
| `--endTime <ISO-8601>` | | クレーム期間の終了。開始より後であること | Yes* | |
| `--merkleRoot <string>` | | 32 バイト Merkle ルート、base58 エンコード | Yes* | |
| `--distributionType <wallet\|legacy-nft>` | | 割り当ての identity モデル | No | `wallet` |
| `--allowedDistributor <permissionless\|recipient>` | | 有効な証明を送信できる主体 | No | `permissionless` |
| `--subsidizeReceipts` | | PDA 上の余剰 SOL でクレームレシート家賃を支払う | No | `false` |
| `--distroConfig <path>` | | 同じフィールドを持つ JSON ファイル | No | |
| `--wizard` | | 対話型プロンプト | No | |

\*`--wizard` または `--distroConfig` が値を供給する場合を除き必須。

`--merkleRoot` は 32 バイトの base58（約 43–44 文字）です。[Merkle ルートのエンコード](/ja/dev-tools/cli/distro#merkle-ルートのエンコード) のとおり `prepareDistribution` でエンコードします。

CLI は `computeTreeHeight(totalClaimants)` で `treeHeight` を計算し、ランダムな seed 署名者を生成します。seed は出力しません。`totalClaimants` はメタデータであり、成功する証明数の上限ではありません。

## JSON 設定ファイル

`--distroConfig` はフラグと同じフィールドを読みます。

```json {% title="distribution-config.json" %}
{
  "name": "Community Airdrop",
  "mint": "TokenMint111111111111111111111111111111111",
  "totalClaimants": 1000,
  "startTime": "2026-09-01T00:00:00Z",
  "endTime": "2026-09-30T23:59:59Z",
  "merkleRoot": "base58Encoded32ByteRoot",
  "distributionType": "wallet",
  "subsidizeReceipts": false,
  "allowedDistributor": "permissionless"
}
```

```bash {% title="JSON からの作成" %}
mplx distro create --distroConfig ./distribution-config.json
```

フラグ名は `--distroConfig` であり、`--config` ではありません。

## 例

NFT 所有者だけが送信できるレガシー NFT 配布を作成します。

```bash {% title="レガシー NFT、recipient のみ" %}
mplx distro create \
  --name "Holder Rewards" \
  --mint <REWARD_MINT> \
  --totalClaimants 500 \
  --startTime "2026-09-01T12:00:00Z" \
  --endTime "2026-09-15T12:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT> \
  --distributionType legacy-nft \
  --allowedDistributor recipient
```

## 出力

成功時、コマンドは新しい PDA とトランザクションを出力します。

```text {% title="期待される出力" %}
Distribution created: <DISTRIBUTION_ADDRESS>
Name: Community Airdrop
Mint: <TOKEN_MINT>
Total Claimants: 1000
Distribution Type: Wallet
Start Time: 2026-09-01T00:00:00.000Z
End Time: 2026-09-30T23:59:59.000Z

Transaction: <SIGNATURE>
```

`--json` も同じ PDA 文字列を使います。

```json {% title="JSON の distribution フィールド" %}
{
  "distribution": "<DISTRIBUTION_ADDRESS>"
}
```

そのアドレスを `deposit`、`fetch`、`withdraw` に渡します。

## 一般的なエラー

作成時に起きる失敗です。

| エラー | 原因 | 対処 |
|-------|-------|-----|
| `BorshIoError` | CLI Distro クライアントが 0.3.x（公開済み 0.4.3） | `@metaplex-foundation/mpl-distro@^0.4.0` に依存する |
| Missing required flag: `--merkleRoot` | フラグが不完全で JSON/ウィザードもない | 残りの必須フラグを渡す |
| Invalid mint owner | Token-2022 または mint 以外のアカウント | オリジナル SPL Token mint を使う |
| Name too long | 名前が 32 バイトを超える | `--name` を短くする |
| Invalid distribution time range | `endTime` が `startTime` より後ではない | より遅い終了時刻を使う |

## 注意事項

create はトークンを入金せず、証明も保存しません。

- 作成後に [`distro deposit`](/ja/dev-tools/cli/distro/deposit) でボールトに資金を入れます。
- `--subsidizeReceipts` 自体は SOL を送金しません。追加 lamports はすでに配布アカウント上にある必要があります。CLI に補助金入金コマンドはありません。
- `Permissioned` distributor モードは SDK のみです。[ウォレット配布](/ja/smart-contracts/mpl-distro/wallet-distribution) を参照してください。

## FAQ

**distro create は Merkle 証明を生成しますか？**
いいえ。`prepareDistribution` ですでに構築した 32 バイトのルートを渡します。証明はオフチェーンに保存する必要があります。[本番デリバリー](/ja/smart-contracts/mpl-distro/production-delivery) を参照してください。

**merkleRoot フラグの形式は何ですか？**
ちょうど 32 バイトの base58 エンコードです。16 進文字列は拒否されます。

**CLI で permissioned distributor を作成できますか？**
いいえ。`--allowedDistributor` が受け付けるのは `permissionless` または `recipient` のみです。
