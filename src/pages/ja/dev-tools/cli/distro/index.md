---
title: 概要
metaTitle: MPL-Distro CLI 概要 | Metaplex CLI
description: Metaplex CLI（mplx distro）で MPL-Distro トークン配布の作成、資金投入、確認、回収を行います。
keywords:
  - MPL-Distro CLI
  - mplx distro
  - Solana token airdrop CLI
  - Merkle distribution
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
faqs:
  - q: mplx distro は何をしますか？
    a: mplx distro コマンドグループは MPL-Distro アカウントの作成、SPL トークンの入金と出金、オンチェーン配布情報の取得を行います。Merkle 証明の生成やクレーム送信は行いません。
  - q: 現在の MPL-Distro プログラムに対応する CLI バージョンはどれですか？
    a: オンチェーンプログラムには @metaplex-foundation/mpl-distro 0.4.x クライアントが必要です。公開済みの @metaplex-foundation/cli 0.4.3 はまだ 0.3.x に依存しており、distro create は BorshIoError で失敗します。mpl-distro 0.4.0 以降に依存する CLI ビルドを使用してください。
  - q: CLI は受取人のクレームを送信しますか？
    a: いいえ。prepareDistribution で証明を生成し、JavaScript SDK またはクレームアプリから distribute または distributeToLegacyNft を送信してください。
  - q: 権限者はいつトークンを引き出せますか？
    a: 開始タイムスタンプの前、または終了タイムスタンプの後です。クレーム期間中の出金は拒否されます。
---

{% callout title="このページの内容" %}
[MPL-Distro](/ja/smart-contracts/mpl-distro) 権限者向けの完全な CLI リファレンスです。
- **作成**: フラグ、JSON、またはウィザードからウォレット配布またはレガシー NFT 配布を初期化
- **資金投入と回収**: トークンを入金し、クレーム期間外に余りを引き出す
- **確認**: オンチェーン設定、ステータス、Merkle ルートを取得
{% /callout %}

## 概要

`mplx distro` コマンドは、ターミナルから [MPL-Distro](/ja/smart-contracts/mpl-distro) 配布の作成、資金投入、確認、回収を行います。

- **ツール**: Metaplex CLI（`mplx`）の `distro` コマンドグループ
- **クライアント**: 現行プログラムに対して `@metaplex-foundation/mpl-distro` **0.4.x** が必要
- **オンチェーン作業**: 配布 PDA の作成、トークン入金、余り出金、アカウントデータの取得
- **オフチェーン作業**: Merkle ルート、証明、クレームは [JavaScript SDK](/ja/smart-contracts/mpl-distro/sdk/javascript) 側

{% callout title="公開済み CLI 0.4.3" type="warning" %}
このドキュメントの Distro コマンドには `@metaplex-foundation/mpl-distro` **0.4.x** が必要です。公開済みの `@metaplex-foundation/cli` **0.4.3** はまだ 0.3.x に依存するため、`mplx distro create` は `BorshIoError` で失敗します。`@metaplex-foundation/mpl-distro@^0.4.0` に依存する CLI ビルド（または公開後の新しい CLI リリース）を使用してください。
{% /callout %}

**ジャンプ先:** [前提条件](#前提条件) · [一般的なフロー](#一般的なフロー) · [コマンドリファレンス](#コマンドリファレンス) · [Merkle ルートのエンコード](#merkle-ルートのエンコード) · [一般的なエラー](#一般的なエラー) · [FAQ](#faq) · [用語集](#用語集)

## 前提条件

MPL-Distro CLI コマンドには、資金のある identity、既存のオリジナル SPL Token mint、32 バイトの Merkle ルートが必要です。

- `@metaplex-foundation/mpl-distro` 0.4.x 向けにビルドされ、`PATH` にある Metaplex CLI
- `mplx config` で設定した Solana キーペア（配布の権限者）
- 家賃とトランザクション手数料用の SOL
- 既存の [SPL トークン](/ja/solana/spl-tokens-and-token-programs) mint（Token-2022 ではない）と、入金用に資金のある associated token account
- `mplx config rpcs add` または `-r` による RPC エンドポイント

コマンドグループを確認します。

```bash {% title="CLI の確認" %}
mplx distro --help
```

## 一般的なフロー

権限者のセットアップは CLI で行います。受取人は証明を保存するアプリからクレームします。

1. **割り当て** — [JavaScript SDK](/ja/smart-contracts/mpl-distro/sdk/javascript) の `prepareDistribution` で受取人リストを構築し、Merkle ルートを生成します。すべてのアドレス、amount、nonce、証明を永続化します。
2. **作成** — `mplx distro create` がルート、クレーム期間、mint、アクセスモードをオンチェーンに書き込みます。
3. **入金** — `mplx distro deposit` がトークンを配布ボールトへ移します。入金はいつでも可能です。
4. **クレーム** — 受取人（またはリレイヤー）が保存済み証明付きで `distribute` / `distributeToLegacyNft` を送信します。CLI にクレームコマンドはありません。
5. **回収** — `endTime` の後（または `startTime` の前）に `mplx distro withdraw` が未クレームトークンを返します。

証明の保存とクレームページは [本番デリバリー](/ja/smart-contracts/mpl-distro/production-delivery) を参照してください。

```bash {% title="作成、資金投入、確認、回収" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 2 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-08T00:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>

mplx distro deposit <DISTRIBUTION> --amount 1.0
mplx distro fetch <DISTRIBUTION>
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

{% callout title="配布アドレスを保存" type="note" %}
`distro create` は配布 PDA を base58 公開鍵として出力します。そのアドレスを変更せず `deposit`、`fetch`、`withdraw` に渡してください。
{% /callout %}

## コマンドリファレンス

`mplx distro` は 4 つのコマンドを公開します。証明の生成もクレーム送信も行いません。

| コマンド | 説明 |
|---------|-------------|
| [`distro create`](/ja/dev-tools/cli/distro/create) | ウォレットまたはレガシー NFT 配布を作成 |
| [`distro deposit`](/ja/dev-tools/cli/distro/deposit) | SPL トークンを配布ボールトへ入金 |
| [`distro fetch`](/ja/dev-tools/cli/distro/fetch) | オンチェーンの配布詳細を取得 |
| [`distro withdraw`](/ja/dev-tools/cli/distro/withdraw) | 期間が非アクティブなときに未クレームトークンを出金 |

CLI は `AllowedDistributor.Permissioned`、`updateDistribution`、`withdrawSubsidy`、クレーム命令に対応しません。

## Merkle ルートのエンコード

`--merkleRoot` は 32 バイトの割り当てルートを base58 でエンコードしたものであり、16 進文字列ではありません。

`prepareDistribution` で生成し、`root` バイトをエンコードします。

```ts {% title="Distro Merkle ルートのエンコード" %}
import { prepareDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

const { root, proofs, treeHeight } = prepareDistribution([
  { address: publicKey('RecipientWallet111111111111111111111111111'), amount: 100_000n },
  { address: publicKey('RecipientWallet222222222222222222222222222'), amount: 250_000n },
])

const merkleRoot = base58.deserialize(root)[0]
console.log(merkleRoot)
```

`--totalClaimants` はそのリストの割り当て数に設定します。CLI は `computeTreeHeight(totalClaimants)` をオンチェーンに保存します。`prepareDistribution` の証明はその高さより長くてはいけません。

## 一般的なエラー

`mplx distro` でよく見られる失敗です。

| エラー | 原因 | 対処 |
|-------|-------|-----|
| `BorshIoError` / Failed to serialize or deserialize account data | CLI がまだ mpl-distro 0.3.x（公開済み 0.4.3）を使用している | `@metaplex-foundation/mpl-distro@^0.4.0` に依存する CLI ビルドを使う |
| `InvalidPublicKeyError` | 配布引数が base58 公開鍵ではない | `distro create` が出力した PDA を渡す |
| Missing required flag | フラグ、JSON、`--wizard` なしで create を実行した | `--name`、`--mint`、`--totalClaimants`、`--startTime`、`--endTime`、`--merkleRoot` を渡すか、`--distroConfig` / `--wizard` を使う |
| Insufficient balance | identity の ATA にトークンが足りない | ミントまたは送金してから入金を再試行 |
| Distribution not found | PDA またはクラスタが違う | 同じ RPC で `distro fetch` してアドレスを確認 |

## 注意事項

CLI は SDK で構築した Merkle 割り当てを扱う権限者向けツールです。

- mint はオリジナル SPL Token プログラム所有である必要があります。Token-2022 mint は拒否されます。
- `--amount` の数量は mint の decimals を使います。`--basisAmount` はトークンの最小単位です。
- 入金に時間制限はありません。`startTime <= clusterTime <= endTime` の間は出金が拒否されます。
- `--allowedDistributor` が受け付けるのは `permissionless` または `recipient` のみです。
- CLI はランダムな seed 署名者を生成し、seed は出力しません。create の出力から配布 PDA を保存してください。

## FAQ

### mplx distro は何をしますか？

`mplx distro` コマンドグループは MPL-Distro アカウントの作成、SPL トークンの入金と出金、オンチェーン配布情報の取得を行います。Merkle 証明の生成やクレーム送信は行いません。

### 現在の MPL-Distro プログラムに対応する CLI バージョンはどれですか？

オンチェーンプログラムには `@metaplex-foundation/mpl-distro` 0.4.x クライアントが必要です。公開済みの `@metaplex-foundation/cli` 0.4.3 はまだ 0.3.x に依存しており、`distro create` は `BorshIoError` で失敗します。mpl-distro 0.4.0 以降に依存する CLI ビルドを使用してください。

### CLI は受取人のクレームを送信しますか？

いいえ。`prepareDistribution` で証明を生成し、[JavaScript SDK](/ja/smart-contracts/mpl-distro/sdk/javascript) または [クレームページ](/ja/smart-contracts/mpl-distro/production-delivery) から `distribute` または `distributeToLegacyNft` を送信してください。

### 権限者はいつトークンを引き出せますか？

開始タイムスタンプの前、または終了タイムスタンプの後です。クレーム期間中の出金は拒否されます。

## 用語集

| 用語 | 定義 |
|------|------------|
| Distribution PDA | `["distribution", mint, seed]` から導出されるオンチェーンアカウント。CLI は seed を内部生成します。 |
| Merkle root | 割り当てツリーの 32 バイトハッシュ。create に base58 で渡します。 |
| Basis amount | トークンの最小単位（1.0 トークンあたり `10 ^ decimals`）。 |
| Claim window | `startTime` から `endTime` までの包含期間。この間はクレームが成功し、出金は失敗します。 |
| Allowed distributor | 有効な証明を送信できる主体。CLI では `permissionless` または `recipient`。 |
