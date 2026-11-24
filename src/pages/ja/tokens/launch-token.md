---
title: Solanaでトークンをローンチする
metaTitle: Solanaでトークンをローンチする — Genesis フェアローンチガイド | Metaplex
description: Genesis Launch Pool を使って Solana 上で SPL トークンをローンチする TypeScript ステップバイステップガイド。透明な価格発見を伴う、公平なオンチェーントークン配布。
cli: /dev-tools/cli/genesis/launch
---

[Genesis](/ja/smart-contracts/genesis) Launch Pool を使用して Solana 上で SPL トークンをローンチします。このガイドでは、ユーザーが一定期間中に SOL を預け入れ、総預入額に対するシェアに比例してトークンを受け取るフェアローンチを、すべてオンチェーンで透明に行う手順を説明します。 {% .lead %}

{% callout type="note" title="ノーコードオプション" %}
コードを書きたくない場合は、[Metaplex トークンローンチパッド](https://www.metaplex.com)を使えば、コーディング不要でトークンをローンチできます。このガイドは、独自のトークンローンチ体験を構築したい開発者、または Genesis SDK を使って自社ウェブサイトでトークンセールを開催したい開発者向けです。
{% /callout %}

{% callout type="note" title="その他のローンチ方式" %}
このガイドでは **Launch Pool** 方式のフェアローンチを説明しますが、Genesis は固定価格でトークンを販売する **[プレセール](/ja/smart-contracts/genesis/presale)** もサポートしています。[Genesis 概要](/ja/smart-contracts/genesis)で各方式を比較し、プロジェクトに最適な方法を選択してください。
{% /callout %}

## 概要

Genesis は、公平なオンチェーンのトークンローンチ機構を提供する Solana のトークンローンチパッドです。固定価格でトークンを販売する中央集権型のトークンセールプラットフォームとは異なり、Launch Pool では市場がトークン配布を決定します。すべての参加者は預入額に比例してトークンを受け取るため、公平で透明なトークン生成イベント（TGE）が保証されます。SPL トークンの作成、資金調達、配布はすべて仲介者なしでオンチェーンで行われます。

Launch Pool によるトークンローンチには3つのフェーズがあります：

1. **セットアップ**（1回だけ実行）- トークンの作成、ローンチの設定、アクティベート
2. **入金期間**（ユーザーが操作）- 設定した期間中にユーザーが SOL を預け入れる
3. **ローンチ後**（あなたとユーザー）- ステートマシンを進行（crank）し、ユーザーがトークンを請求し、あなたが権限を取り消す

このガイドでは、段階ごとに実行する**4つの独立したスクリプト**を作成します：

| スクリプト | 実行タイミング | 目的 |
|--------|-------------|---------|
| `launch.ts` | 開始時に1回 | トークンを作成し、ローンチをアクティベートします |
| `crank.ts` | 入金終了後 | 条件とビヘイビアをトリガーして、SOL をアンロック済みバケットに移動します |
| `claim.ts` | crank 後 | ユーザーがトークンを請求するために実行します |
| `revoke.ts` | ローンチ完了時 | ミント/フリーズ権限を永久に削除します |

## 前提条件

新しいプロジェクトを作成し、依存関係をインストールします：

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## 完全なローンチスクリプト

以下は、完全で実行可能なスクリプトです。各セクションには動作を説明するコメントが付いています。このスクリプトは、ローンチのセットアップのために**1回だけ**実行します。

{% callout type="warning" title="キーペアが必要です" %}
トランザクションに署名するには、マシン上に Solana キーペアファイルが必要です。通常は `~/.config/solana/id.json` にある Solana CLI ウォレットです。スクリプト内の `walletFile` パスをキーペアファイルのパスに更新してください。このウォレットにトランザクション手数料用の SOL があることを確認してください。
{% /callout %}

`launch.ts` というファイルを作成します：

{% code-tabs-imported from="genesis/launch_token_launch" frameworks="umi" filename="launch" /%}

スクリプトを実行します：

```bash
npx ts-node launch.ts
```

**出力されたアドレスを保存してください！** 次のステップで必要になります。

## 次に何が起こるか

ローンチスクリプトを実行すると、ローンチが開始されます。各フェーズで起こることは次のとおりです：

### 入金期間中

ユーザーはフロントエンドまたは SDK を直接使って SOL を預け入れます。各入金には次の特徴があります：
- 手数料が適用されます
- 入金 PDA で追跡されます
- 一部または全額を引き出すことができます（手数料あり）

### 入金終了後

入金期間が終了したら、`triggerBehaviorsV2` を実行して、バケットに設定された終了時のビヘイビア（この場合は集まった SOL をアンロック済みバケットへ移動）を実行します。`crank.ts` というファイルを作成します：

{% code-tabs-imported from="genesis/launch_token_crank" frameworks="umi" filename="crank" /%}

入金期間の終了後に実行します：

```bash
npx ts-node crank.ts
```

### ユーザーがトークンを請求

crank の後、ユーザーはトークンを請求できます。各ユーザーは、総預入額に対するシェアに比例してトークンを受け取ります：

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

ユーザーはフロントエンド経由、またはこのスクリプト（`claim.ts` を作成）で請求できます：

{% code-tabs-imported from="genesis/launch_token_claim" frameworks="umi" filename="claim" /%}

### 最終化: 権限を取り消し

ローンチが完了したら、ミント権限とフリーズ権限を取り消します。これにより、追加のトークンが発行されることはないとホルダーに示せます。

{% callout type="warning" %}
**この操作は元に戻せません。** 一度取り消すと、追加のトークンのミントやアカウントのフリーズは二度とできません。ローンチが完了したと確信できる場合にのみ実行してください。
{% /callout %}

`revoke.ts` を作成します：

{% code-tabs-imported from="genesis/launch_token_revoke" frameworks="umi" filename="revoke" /%}

## 次のステップ

- [Genesis 概要](/ja/smart-contracts/genesis) - Solana トークンローンチパッドについて詳しく学ぶ
- [Launch Pool](/ja/smart-contracts/genesis/launch-pool) - フェアローンチの詳細ドキュメント
- [プレセール](/ja/smart-contracts/genesis/presale) - 固定価格でのトークンプレセールを実行
- [Metaplex API](/ja/api) - API でローンチおよびトークンセールのデータを照会
