---
title: エージェントトークンの作成
metaTitle: Solanaでエージェントトークンを作成 | Metaplex Agent Kit
description: Metaplex Genesisを使用して、エージェントのオンチェーンウォレットからトークンを発行します。Solanaでエージェントを登録し、Genesisプロトコルでトークンを作成・配布します。
keywords:
  - agent token
  - token launch
  - Genesis
  - agent wallet
  - Solana agents
  - Metaplex
about:
  - Agent Tokens
  - Genesis
  - Solana
proficiencyLevel: Beginner
created: '04-05-2026'
updated: '04-05-2026'
---

Metaplex Genesisプロトコルを使用して、エージェントのオンチェーンウォレットからトークンを作成します。 {% .lead %}

## 概要

エージェントトークンは、エージェントのオンチェーンウォレットから直接発行されるトークンです。エージェントはSolanaでIDを登録した後、[Metaplex Genesis](/smart-contracts/genesis)プロトコルを使用してトークンを作成・配布します。

- **登録** — [Metaplex Agent Registry](/agents/register-agent)でSolana上にエージェントIDを登録
- **発行** — Metaplex API、SDK、またはCLIを通じて[Genesis](/smart-contracts/genesis)プロトコルでトークンを発行
- **前提条件** — トークン作成前にオンチェーンウォレットを持つ登録済みエージェントが必要
- **対応** — ローンチプール、プレセール、オークションなど、すべてのGenesis発行タイプをサポート

## エージェントトークン作成の仕組み

エージェントトークンの作成は、エージェントID登録とGenesisトークン発行プロトコルを組み合わせた2段階のプロセスです。

### ステップ1：Solanaでエージェントを登録

エージェントはまず[Solana上でMetaplexに登録](/agents/register-agent)する必要があります。これにより、公開IDとオンチェーンウォレットが作成されます。登録によりIDレコードがMPL Coreアセットにバインドされ、エージェントがオンチェーンで発見可能になります。詳細な手順は[エージェントの登録](/agents/register-agent)ガイドをご覧ください。

### ステップ2：Genesisでトークンを発行

登録後、エージェントは[Metaplex Genesis](/smart-contracts/genesis)プロトコルを使用してトークンを発行します。Genesisはローンチプール、プレセール、均一価格オークションなど、複数の発行メカニズムをサポートしています。エージェントは以下の方法でGenesisとやり取りできます：

- **[Metaplex API](/smart-contracts/genesis/integration-apis)** — RESTエンドポイントによるプログラマティックなトークン作成
- **[Metaplex SDK](/smart-contracts/genesis/sdk/javascript)** — JavaScript/TypeScript SDKの統合
- **[Metaplex CLI](/dev-tools/cli/genesis)** — コマンドラインによるトークン発行ワークフロー

Genesisの完全なドキュメントは[Genesis概要](/smart-contracts/genesis)をご覧ください。

{% callout type="note" %}
エージェントトークン作成のエンドツーエンドの完全なドキュメントは近日公開予定です。このページは完全なコード例とステップバイステップの手順で更新される予定です。
{% /callout %}

## 注意事項

- エージェントはトークンを発行する前に[登録](/agents/register-agent)が必要です。登録によりトークン作成に使用されるオンチェーンウォレットが作成されます。
- エージェントトークンは[Genesis](/smart-contracts/genesis)を通じて発行される標準的なSPLトークンです。Solanaトークンエコシステムと完全に互換性があります。
- Genesisプロトコルは、発行者がエージェントであるか人間のウォレットであるかに関係なく、すべてのトークン配布メカニズム（ローンチプール、プレセール、オークション）を処理します。

*Metaplexが管理 · 2026年4月検証済み · [Genesis](https://github.com/metaplex-foundation/mpl-genesis)*
