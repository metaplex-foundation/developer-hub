---
title: エージェントファイナンス - AIエージェントの資金調達とガバナンス
metaTitle: エージェントファイナンス - Solana上のAIエージェントの資金調達とガバナンス | Metaplex
description: 独自のオンチェーントークンを通じてAIエージェントを資金調達およびガバナンスします。Genesisボンディングカーブでエージェントトークンを発行し、setAgentTokenV1で永続的にエージェントにバインドし、Asset Signer PDAに収益をルーティング — すべてMetaplex上で。
keywords:
  - agent finance
  - agent token
  - AI agent capitalization
  - AI agent governance
  - raise funds for agent
  - agent bonding curve
  - agent token launch
  - AI agent token
  - Solana agent token
  - agent fundraising
  - autonomous agent economy
  - setAgentTokenV1
  - AgentIdentityV2
about:
  - Agent Finance
  - Agent Tokens
  - Genesis bonding curve
  - Solana
proficiencyLevel: Beginner
created: '04-13-2026'
updated: '05-06-2026'
faqs:
  - q: エージェントファイナンスとは何ですか？
    a: エージェントファイナンスは、独自のオンチェーントークンを通じて自律型AIエージェントを資金調達およびガバナンスする実践です。Metaplexでは、エージェントはGenesisボンディングカーブを通じてトークンを発行し、setAgentTokenV1で永続的にエージェントにバインドします。これにより、収益とクリエイター手数料はオフチェーンの取り決めではなくオンチェーンプリミティブを通じてルーティングされます。
  - q: エージェントファイナンスはエージェントコマースとどう違いますか？
    a: エージェントファイナンスは、エージェントがトークンを通じてどのように資金調達およびガバナンスされるか — 資本化、トレジャリー、ホルダーの整合 — をカバーします。エージェントコマースは、エージェントがどのように収益を得て経済活動を生み出すかをカバーします。両者は同じエージェントID、PDAウォレット、EIP-8004メタデータを共有します。
  - q: エージェントのウォレットはどのように派生しますか？
    a: エージェントの運用ウォレットはAsset Signerです — シード ["mpl-core-execute", asset] から派生したMPL Core PDAです。秘密鍵はありません。ウォレットはSOL、SPLトークン、その他のアセットを保持でき、CoreのExecuteライフサイクルフックを通じてのみ制御されます。
  - q: エージェントトークンはどのようにエージェントにバインドされますか？
    a: setAgentTokenV1命令は、AgentIdentityV2 PDAのagentTokenフィールドにトークンミントを書き込みます。バインドは永続的であり、一度設定されると、エージェントは取り消し不能にそのトークンミントにリンクされます。同じフィールドはエージェントのEIP-8004メタデータでも公開されているため、相手側はエージェントの登録から正規のトークンを解決できます。
  - q: なぜプレセールやフェアローンチではなくボンディングカーブを使用するのですか？
    a: ボンディングカーブはデポジットウィンドウなしですぐに取引を開始し、コンスタントプロダクトカーブによる継続的な価格発見を提供し、満杯になると自動的にRaydium CPMMプールにグラデュエートします。これによりエージェントトークンに即時の流動性とオープンマーケットでの取引への明確な道筋が提供されます。
  - q: 調達した資金はどうなりますか？
    a: クリエイター手数料は取引中ボンディングカーブのバケットに蓄積され、クリエイターウォレットによって請求可能です。Raydiumへのグラデュエーション後、クリエイターはCPMMプールからのグラデュエーション後クリエイター手数料を引き続き獲得します。エージェントがクリエイターとして設定されている場合、手数料はエージェントのPDAウォレットに直接ルーティングされます。
---

Metaplex上のエージェントファイナンスとは、自律型AIエージェントを独自のオンチェーントークンを通じて資金調達およびガバナンスする方法です。エージェントは検証可能なIDを登録し、[Genesisボンディングカーブ](/smart-contracts/genesis)を通じてトークンを発行し、`setAgentTokenV1`命令を介してそのトークンを自分自身に永続的にバインドします — エージェントにトレジャリーを与え、ホルダーコミュニティをそのミッションに整合させ、誰がリスクを負っているかの透明な記録を作成します。{% .lead %}

## 概要

エージェントファイナンスは、AIエージェントがどのように資金調達およびガバナンスされるかをカバーします。Metaplexスタックは、エンドツーエンドのすべてのプリミティブを出荷します: エージェントID、Coreアセットから派生したAsset Signer PDA、エージェントのウォレットからのGenesisボンディングカーブ、そして`setAgentTokenV1`を通じた永続的なトークン-エージェントバインディング。

- **エージェントID**: [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity)を介してオンチェーンに登録し、Coreアセットにバインドされた[`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDAとEIP-8004メタデータドキュメントを作成
- **Asset Signer PDA**: エージェントのウォレットは[MPL Core](/smart-contracts/core)によってシード `["mpl-core-execute", asset]` から派生 — 秘密鍵なし、CoreのExecuteライフサイクルフックを通じてのみ制御
- **トークン発行**: `agent`パラメータを指定して[`createAndRegisterLaunch`](/smart-contracts/genesis)を呼び出し、エージェントのウォレットから[Genesisボンディングカーブ](/dev-tools/cli/genesis/bonding-curve)を立ち上げ、クリエイター手数料をエージェントにルーティング
- **永続的バインディング**: [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)が`AgentIdentityV2`の`agentToken: Option<Pubkey>`フィールドにトークンミントを書き込み — 取り消し不能、公開、エージェントのEIP-8004メタデータの一部
- **オープンマーケットへのグラデュエーション**: カーブが満杯になると、流動性は[Raydium](https://raydium.io) CPMMプールに自動的に移行して取引を継続

{% callout type="note" title="エージェントファイナンス vs. エージェントコマース" %}
**エージェントファイナンス**は、エージェントがどのように*資本化およびガバナンス*されるか — エージェントのトークンを通じた資金調達、トレジャリー、ホルダーの整合 — に関するものです。**[エージェントコマース](/agents/agent-commerce)**は、エージェントがどのように*経済活動*を生み出すか — サービスの支払い、他エージェントとの取引、生産的な作業からの収益獲得 — に関するものです。このページではエージェントファイナンスを扱います。
{% /callout %}

## Metaplexエージェントファイナンスのプリミティブ

エージェントファイナンスフローのすべてのレイヤーは、Metaplexプリミティブとして出荷されます — オンチェーンID、Asset Signerウォレット、ローンチプログラム、取り消し不能なトークン-エージェントバインディング:

| プリミティブ | 場所 | 提供する機能 |
|-----------|----------------|-----------------|
| **オンチェーンID** | シード `["agent_identity", asset]` の[`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA | 発行されたトークンと特定の登録済みエージェント間の検証可能なバインディング |
| **EIP-8004メタデータ** | `agentMetadataUri`にあるオフチェーンJSON、`AgentIdentity`プラグインでオンチェーンに記録 | トークンホルダーと相手側が単一のドキュメントからエージェントのID、サービス、バインドされたトークンを解決 |
| **Asset Signer (PDAウォレット)** | [MPL Core](/smart-contracts/core)によって派生されたシード `["mpl-core-execute", asset]` | SOL、エージェントのトークン、クリエイター手数料収益、任意のSPLトークンを保持; 秘密鍵なし |
| **トークンバインディング** | `AgentIdentityV2`上の[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) | 永続的なオンチェーンリンク — `agentToken`フィールドは再割り当て不可 |
| **トークン発行** | [Genesis](/smart-contracts/genesis)の`createAndRegisterLaunch`に`agent: { mint, setToken }`を指定 | 1つのトランザクションでボンディングカーブを作成し、サプライをミントし、(オプションで)トークンをエージェントにバインド |
| **エグゼクティブ委任** | [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)の`ExecutionDelegateRecordV1` | オフチェーンオペレーターがエージェントに代わってクリエイター手数料の請求とトレジャリー操作に署名; アセットごとに取り消し可能 |
| **グラデュエーション** | ボンディングカーブが満杯になったときの自動Raydium CPMM移行 | 手動の流動性供給なしでオープンマーケット取引と継続的なクリエイター手数料の蓄積 |

## なぜエージェントトークンを発行するのか？

エージェントトークンは、AIエージェントを投資可能な自律的経済主体に変えます。ホルダーはエージェントのミッション — 取引、コンテンツ作成、データ分析、その他オンチェーンサービス — を支援し、トークンの価値はエージェントのパフォーマンスと採用を反映します。

**エージェントビルダー向け:**
- エージェント自体の所有権を放棄せずに資金を調達
- ボンディングカーブ取引とグラデュエーション後のRaydium取引の両方からクリエイター手数料を獲得
- エージェントの成功と整合したトークンホルダーのコミュニティを構築
- エージェントが自律的に管理するトレジャリー (Asset Signer PDA) を提供

**トークンホルダー向け:**
- パフォーマンスを発揮すると信じる特定のAIエージェントを支援
- 即時の流動性を備えたボンディングカーブを通じて売買
- エージェントの[EIP-8004登録](/agents/agent-commerce)から正規のトークンミントを解決 — オフチェーンの信頼は不要

## Metaplexでのエージェントトークンライフサイクル

Metaplexスタックは、エージェント作成からトークン取引までの完全なライフサイクルを処理します:

1. **エージェントを作成**: [`mintAndSubmitAgent`](/agents/mint-agent)への単一の呼び出しで、MPL Coreアセットを作成し`AgentIdentityV2`を1つのトランザクションで登録し、CoreプラグインとしてEIP-8004メタデータURIを添付
2. **実行をセットアップ**: `mpl-agent-tools`を介して[エグゼクティブプロファイルを登録](/agents/run-an-agent)し、`ExecutionDelegateRecordV1`を作成して、エージェントが自律的に署名できるようにします
3. **トークンを発行**: Genesisで`agent`パラメータを指定して[`createAndRegisterLaunch`](/smart-contracts/genesis)を呼び出します — `agent: { mint: agentAssetAddress, setToken: true }`はエージェントのPDAウォレットからボンディングカーブを作成し、同じトランザクション内で`setAgentTokenV1`命令を発行します
4. **グラデュエーション**: ボンディングカーブが100%充填されると、流動性はRaydium CPMMプールに移行し、トークンはオープンマーケットで取引され、クリエイター手数料が引き続き蓄積されます

{% callout type="note" title="エージェントごとに1つのトークン" %}
`AgentIdentityV2`の`agentToken`フィールドは一度しか設定できません — [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)は取り消し不能です。同じフィールドはエージェントのEIP-8004メタデータにも読み込まれるため、相手側は常に正規のトークンミントを参照できます。
{% /callout %}

## エージェント資金調達方法の比較

すべてのトークン発行方法がAIエージェントに対して同等というわけではありません。以下の表では、Metaplexエージェントトークンを一般的な代替手段と比較しています。

| 機能 | Metaplexエージェントトークン | 一般的なローンチパッド | 手動トークン + DEX上場 | オフチェーン資金調達 |
|---------|---------------------|-------------------|---------------------------|----------------------|
| **オンチェーンエージェントID** | `AgentIdentityV2` PDA + EIP-8004メタデータ | なし | なし | なし |
| **エージェント所有ウォレット** | Asset Signer PDA、秘密鍵なし | 人間が制御するウォレット | 人間が制御するウォレット | ウォレットなし |
| **トークン-エージェントバインディング** | `setAgentTokenV1`、取り消し不能 | なし | なし | なし |
| **即時取引** | ボンディングカーブがすぐに開始 | プラットフォームに依存 | 手動LPセットアップが必要 | N/A |
| **価格発見** | コンスタントプロダクトカーブ | 様々 | 手動価格設定 | N/A |
| **流動性グラデュエーション** | Raydium CPMMに自動移行 | プラットフォーム依存 | 手動LP管理 | N/A |
| **クリエイター手数料** | 内蔵、設定可能、エージェントPDAにルーティング | 固定、プラットフォームが決定 | 内蔵メカニズムなし | プラットフォームが決定 |
| **自律運用** | `mpl-agent-tools`を介した`ExecutionDelegateRecordV1` | サポートされていない | サポートされていない | サポートされていない |

### Metaplexの優位性

**検証可能なエージェントID**。[`mpl-agent-identity`](/smart-contracts/mpl-agent/identity)は`AgentIdentityV2` PDAを特定のMPL Coreアセットにバインドし、`AgentIdentity`外部プラグインをアセットに添付します。誰もがトークンが特定の登録済みエージェントによって発行されたことをオンチェーンで検証でき、エージェントの`agentToken`フィールドから正規のトークンミントを解決できます。

**秘密鍵の露出なし**。Asset Signer PDAは`["mpl-core-execute", asset]`から派生されます。漏洩、紛失、盗難される秘密鍵はありません。ウォレットはCoreの[Executeライフサイクルフック](/smart-contracts/core/execute-asset-signing)を通じてのみ制御され、アセット所有者はいつでもエグゼクティブの委任を取り消すことができます。

**永続的なトークン-エージェントバインディング**。`setAgentTokenV1`は`AgentIdentityV2`の一回限りのフィールドに書き込みます — 一度設定されると、バインディングは変更できません。これにより、正規のトークンが密かに置き換えられるラグプルシナリオが排除され、EIP-8004コンシューマーは単一の信頼できる情報源からバインドされたトークンを解決できます。

**グラデュエーションを伴う即時流動性**。Genesisボンディングカーブはローンチの瞬間から即時取引を提供します — デポジットウィンドウや待機期間はありません。カーブが100%充填されると、手動の流動性供給を必要とせずRaydium CPMMプールに自動的にグラデュエートします。

**フルスタック統合**。Metaplexはあらゆるレイヤーを提供します: アイデンティティ ([`mpl-agent-identity`](/smart-contracts/mpl-agent))、アセット管理 ([Core](/smart-contracts/core))、トークン発行 ([Genesis](/smart-contracts/genesis))、実行委任 ([`mpl-agent-tools`](/smart-contracts/mpl-agent/tools))、開発者ツール ([CLI](/dev-tools/cli/agents)、[Skill](/agents/skill))。サードパーティのサービスを組み合わせる必要はありません。

## エージェントトークンを発行する

Metaplexでのエージェントトークン発行は、ノーコード、CLI、SDKのワークフローで利用可能です。

### metaplex.comでエージェントトークンを発行

[metaplex.com](https://www.metaplex.com)は、ボンディングカーブでエージェントトークンを発行するノーコードインターフェースを提供します。ウォレットを接続し、エージェントを登録し、トークンを設定して、発行します — コーディングは不要です。

### CLIでエージェントトークンを発行

[Metaplex CLI](/dev-tools/cli)は、単一のコマンドでエージェントトークンを発行します。`--agentAsset`フラグはローンチをCore Execute命令でラップし、エージェントのPDAをクリエイターにします。`--agentSetToken`は同じトランザクション内で`setAgentTokenV1`を発行します。

```bash {% title="ボンディングカーブ経由でエージェントトークンを発行" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Agent Token" \
  --symbol "MAT" \
  --image "https://gateway.irys.xyz/your-image-hash" \
  --agentAsset <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

これにより、ボンディングカーブが作成され、トークンサプライがエージェントのPDAからミントされ、`setAgentTokenV1`を介してエージェントに永続的にリンクされます — すべて1つのトランザクションで。

スワップコマンド、ステータスチェック、ライフサイクル管理の詳細については、[ボンディングカーブCLIガイド](/dev-tools/cli/genesis/bonding-curve)を参照してください。

### SDKでエージェントトークンを発行

プログラムによる発行については、[Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript)を使用し、`createAndRegisterLaunch`に`agent`パラメータを渡します:

```ts
await createAndRegisterLaunch(umi, {
  // ...launch params
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
}).sendAndConfirm(umi);
```

`setToken: true`を指定すると、ローンチとバインディングがアトミックになるよう、同じトランザクション内で`setAgentTokenV1`命令がトリガーされます。

## エージェントトークンエコノミクス

エージェントトークンエコノミクスは、ボンディングカーブ取引中のクリエイター手数料の蓄積と、グラデュエーション後の自動流動性移行を組み合わせています。

### クリエイター手数料

すべてのボンディングカーブ発行は、設定可能なクリエイター手数料をサポートします。各スワップの一定割合は、ボンディングカーブフェーズ中、クリエイターウォレットに振り分けられます。エージェントがクリエイターとして設定されている場合、手数料はAsset Signer PDAに流れます:

- 手数料はボンディングカーブのバケットに蓄積され、クリエイターによって請求可能です
- 手数料率は発行時に設定され、オンチェーンで可視化されます
- グラデュエーション後のRaydium取引から引き続きクリエイター手数料が蓄積されます
- クリエイターウォレットは任意のアドレスに設定できるため、エージェントは手数料を自身のPDA、マルチシグ、または別のトレジャリーにルーティングできます

### グラデュエーション

ボンディングカーブのすべてのトークンが購入されると、カーブは自動的にグラデュエートします:

1. 流動性がRaydium CPMMプールに移行
2. オープンマーケットで取引が継続
3. トークンは任意のSolana DEXアグリゲーターで完全に取引可能
4. クリエイターウォレットはグラデュエーション後の取引から引き続きクリエイター手数料を獲得

### エージェントトレジャリー

Asset Signer PDAは、SOL、エージェント自身のトークン、ステーブルコイン、NFT、その他のSPLトークンを保持できます。`ExecutionDelegateRecordV1`を介して、エージェントのエグゼクティブはトレジャリー資金を自律的に展開できます: コンピュートの支払い、リソースの取得、または他のプロトコルとの相互作用 — すべてCoreのExecuteフックを通じて、アセットごとに取り消し可能な権限で署名されます。

## Metaplexエージェントスタックで構築する

Metaplexエージェントスタックは、自律的なエージェントトークン運用のためのアイデンティティ、実行、発行、ツーリングコンポーネントを組み合わせます。

| ツール | 目的 | リンク |
|------|---------|------|
| **`mpl-agent-identity`** | `AgentIdentityV2` PDA、EIP-8004メタデータ、`setAgentTokenV1` | [ドキュメント](/smart-contracts/mpl-agent/identity) |
| **`mpl-agent-tools`** | エグゼクティブプロファイルと実行委任レコード | [ドキュメント](/smart-contracts/mpl-agent/tools) |
| **MPL Core** | Asset Signer PDAとExecuteライフサイクルフック | [ドキュメント](/smart-contracts/core) |
| **Genesis** | `agent`パラメータを持つボンディングカーブとローンチプール | [ドキュメント](/smart-contracts/genesis) |
| **CLI** | コマンドラインエージェントとトークン管理 | [Agents CLI](/dev-tools/cli/agents) · [Genesis CLI](/dev-tools/cli/genesis) |
| **Skill** | AIコーディングエージェントナレッジベース | [ドキュメント](/agents/skill) |
| **Metaplex Launchpad** | ノーコードトークン発行インターフェース | [metaplex.com](https://www.metaplex.com) |

## 注意事項

これらの注意事項は、Metaplex上のエージェントトークン発行の重要な制約とライフサイクルの詳細をカバーしています。

- エンドツーエンドのエージェント-トークンバインディングフローは[Genesis](/smart-contracts/genesis)ボンディングカーブを中心に構築されています。Genesisローンチプールもサポートされていますが、アトミックなローンチ + `setAgentTokenV1`フローはボンディングカーブで最も一般的に使用されます
- `AgentIdentityV2`の`agentToken`フィールドは`Option<Pubkey>`です。`setAgentTokenV1`が呼び出されるまで`None`であり、その後永続的に`Some(mint)`になります — クリアまたは再割り当てする命令はありません
- ボンディングカーブはコンスタントプロダクト式を使用します。トークンが購入されると価格は上昇し、売却されると下降します
- グラデュエーション後、Metaplexはトークンに対する制御権を持ちません — RaydiumとDEXアグリゲーターで自由に取引されます
- クリエイター手数料は発行時に設定され、ボンディングカーブが作成された後は変更できません。受取人は任意のウォレット (エージェントのPDAを含む) に設定できます
- Asset Signerには秘密鍵がありません — `ExecutionDelegateRecordV1`を介して付与されたエグゼクティブ権限で、CoreのExecuteライフサイクルフックを通じてのみ制御でき、アセット所有者によって取り消し可能です

## FAQ

Metaplexのエージェントファイナンスに関する一般的な実装と設計の質問。

### エージェントファイナンスとは何ですか？
エージェントファイナンスは、独自のオンチェーントークンを通じて自律型AIエージェントを資金調達およびガバナンスする実践です。Metaplexでは、エージェントはGenesisボンディングカーブを通じてトークンを発行し、`setAgentTokenV1`でバインドします。これにより、収益とクリエイター手数料はオンチェーンプリミティブを通じてルーティングされます。

### エージェントファイナンスはエージェントコマースとどう違いますか？
エージェントファイナンスは、エージェントがトークンを通じてどのように**資金調達およびガバナンス**されるか — 資本化、トレジャリー、ホルダーの整合 — をカバーします。[エージェントコマース](/agents/agent-commerce)は、エージェントがどのように**収益を得て経済活動を生み出すか** — サービス料金の支払い、他エージェントとの取引、オンチェーン市場への参加 — をカバーします。両者は同じエージェントID、PDAウォレット、EIP-8004メタデータを共有します。ファイナンスはエージェントが運営するためのリソースを提供し、コマースはエージェントがそれらで何を行うかです。

### エージェントのウォレットはどのように派生しますか？
エージェントの運用ウォレットはAsset Signerです — シード `["mpl-core-execute", asset]` から派生したMPL Core PDAです。秘密鍵はありません。ウォレットはCoreの[Executeライフサイクルフック](/smart-contracts/core/execute-asset-signing)を通じてのみ制御され、エグゼクティブ権限は[`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)を介して委任されます。

### エージェントトークンはどのようにエージェントにバインドされますか？
[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)命令は、[`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDAの`agentToken`フィールドにトークンミントを書き込みます。バインドは永続的であり、エージェントのEIP-8004メタデータで公開されているため、相手側は単一の信頼できる情報源から正規のトークンを解決できます。

### なぜプレセールやフェアローンチではなくボンディングカーブを使用するのですか？
ボンディングカーブはデポジットウィンドウなしですぐに取引を開始し、コンスタントプロダクトカーブによる継続的な価格発見を提供し、満杯になると自動的にRaydium CPMMプールにグラデュエートします。これによりエージェントトークンに即時の流動性とオープンマーケットでの取引への明確な道筋が提供されます。

### 調達した資金はどうなりますか？
クリエイター手数料は取引中ボンディングカーブのバケットに蓄積され、クリエイターウォレットによって請求可能です。Raydiumへのグラデュエーション後、クリエイターはCPMMプールからのグラデュエーション後クリエイター手数料を引き続き獲得します。エージェントがクリエイターとして設定されている場合、手数料はAsset Signer PDAに直接ルーティングされます。

### 任意のAIエージェントがMetaplexでトークンを発行できますか？
はい。[`mpl-agent-identity`](/smart-contracts/mpl-agent/identity)を介して登録されたエージェントなら誰でもトークンを発行できます。エージェントには`AgentIdentityV2`が登録されたMPL Coreアセットと、自律運用のための`ExecutionDelegateRecordV1`が必要です。

### これはpump.funや他のローンチパッドでの発行とどう違いますか？
Metaplexエージェントトークンは、`AgentIdentityV2`を通じて検証可能なオンチェーンIDにバインドされます。エージェントのウォレットは秘密鍵のないPDAであり、`setAgentTokenV1`バインディングは永続的かつ監査可能です。一般的なローンチパッドにはエージェントID、エージェント所有ウォレット、または実行委任の概念がありません。

## 用語集

Metaplexエージェントファイナンスワークフローで使用される主要な用語。

| 用語 | 定義 |
|------|------------|
| **Agent Finance（エージェントファイナンス）** | 独自のオンチェーントークンを通じて自律型AIエージェントを資金調達およびガバナンスする実践 — 資金調達、トレジャリー、ホルダーの整合 |
| **Agent Commerce（エージェントコマース）** | エージェントが生み出す経済活動 — サービス料金の支払い、他エージェントとの取引、生産的な作業からの収益獲得（[エージェントコマース](/agents/agent-commerce)ページで扱われます） |
| **Agent Token（エージェントトークン）** | Genesisボンディングカーブを介してエージェントのPDAウォレットから発行され、`setAgentTokenV1`を介してエージェントに永続的にリンクされたトークン |
| **`AgentIdentityV2`** | MPL CoreアセットにバインドされたMetaplex Agent Registry PDA。`setAgentTokenV1`によって設定される`agentToken: Option<Pubkey>`フィールドを持つ |
| **Asset Signer (PDAウォレット)** | `["mpl-core-execute", asset]`から派生したMPL Core PDA — エージェントのオンチェーンウォレット、CoreのExecuteフックを通じてのみ制御 |
| **`setAgentTokenV1`** | `AgentIdentityV2`の`agentToken`フィールドにトークンミントを書き込む`mpl-agent-identity`命令。一回限りで取り消し不能 |
| **`createAndRegisterLaunch`** | ボンディングカーブを作成し、(`agent.setToken: true`の場合) アトミックに`setAgentTokenV1`を発行するGenesis SDK呼び出し |
| **EIP-8004メタデータ** | エージェントを記述するオフチェーンJSONドキュメント (services、x402サポート、registrations、supportedTrust); バインドされた`agentToken`は`AgentIdentityV2` PDAを介してこのドキュメントの一部 |
| **Bonding Curve（ボンディングカーブ）** | サプライに基づいてトークンの価格を設定するコンスタントプロダクトAMM。完全に充填されるとRaydiumに自動グラデュエート |
| **Graduation（グラデュエーション）** | カーブのすべてのトークンが売却されると、流動性が自動的にRaydium CPMMプールに移行 |
| **Executive Profile（エグゼクティブプロファイル）** | `mpl-agent-tools`を介して登録された、エージェントに代わってトランザクションに署名する権限を持つオフチェーンオペレーターのオンチェーンID |
| **`ExecutionDelegateRecordV1`** | エグゼクティブにエージェントに代わって行動する権限を付与する`mpl-agent-tools`のアセットごとのPDA; アセット所有者によって取り消し可能 |
| **Creator Fee（クリエイター手数料）** | クリエイターウォレット (多くの場合エージェントのPDA) に振り分けられる各ボンディングカーブスワップの設定可能な割合 |
