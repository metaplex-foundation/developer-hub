---
title: エージェントトークンの作成
metaTitle: Metaplex GenesisでエージェントトークンをMetaplex Agentに作成する | Metaplex Agents
description: Genesis SDKを使用して、Metaplexエージェントの代わりにボンディングカーブトークンを発行する方法。クリエイター手数料の自動ルーティング、初回購入、devnetテスト、エラー処理を含む。
keywords:
  - agent token
  - token launch
  - Genesis
  - bonding curve
  - agent wallet
  - Solana agents
  - Metaplex
  - createAndRegisterLaunch
  - creator fee
  - first buy
about:
  - Agent Tokens
  - Genesis
  - Bonding Curve
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-05-2026'
updated: '04-07-2026'
howToSteps:
  - Register your agent on Solana to get its Core asset address
  - Install the Genesis SDK and configure a Umi instance
  - Call createAndRegisterLaunch with the agent field and your token metadata
  - Read mintAddress and launch.link from the result
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: エージェントトークンとは何ですか？
    a: エージェントトークンは、Metaplex Genesisプロトコルを使用してエージェントのオンチェーンウォレットから発行されるトークンです。createAndRegisterLaunchにagentフィールドを渡すと、SDKはクリエイター手数料をエージェントのCore assetシグナーPDAに自動的にルーティングし、エージェントがオンチェーンで実行できるようにlaunchトランザクションをCore executeインストラクションでラップします。
  - q: エージェントトークンを発行する際、クリエイター手数料はどこに送られますか？
    a: クリエイター手数料はエージェントのCore assetシグナーPDA（シード['mpl-core-execute', <agent_mint>]から導出）に自動的にルーティングされます。creatorFeeWalletを手動で設定する必要はなく、agentフィールドを渡すだけで十分です。launch.creatorFeeWalletを明示的に設定することで、手数料ウォレットを上書きすることもできます。
  - q: setTokenは取り消しできますか？
    a: いいえ。setTokenをtrueに設定すると、発行されたトークンがエージェントのプライマリトークンとして永久に関連付けられます。これはトランザクションが確認された後、元に戻したり再割り当てしたりすることはできません。このトークンをエージェントに恒久的にリンクしてよいと確信できる場合にのみ、setTokenをtrueに設定してください。
  - q: エージェントトークンの発行をdevnetで先にテストできますか？
    a: はい。launchの入力にnetwork 'solana-devnet'を渡し、UmiインスタンスをdevnetのRPCに向けてください。APIはリクエストをdevnetインフラにルーティングします。トランザクションを送信する前に、エージェントウォレットにdevnet SOLを補充してください。
  - q: エージェント発行で初回購入とクリエイター手数料を組み合わせることはできますか？
    a: はい。launchオブジェクトのagentフィールドと合わせてfirstBuyAmountを設定してください。初回購入自体は手数料無料で、その購入にはプロトコル手数料もクリエイター手数料も課されません。agentが指定されている場合、初回購入の購入者はデフォルトでエージェントPDAになります。
---

[Genesis](/smart-contracts/genesis)プロトコルとMetaplex APIを使用して、エージェントのオンチェーンウォレットからトークンを発行します。 {% .lead %}

{% callout title="このガイドで作成するもの" %}
このガイドを完了すると、以下のことができるようになります。
- Metaplexエージェントの代わりにボンディングカーブトークンを発行する
- クリエイター手数料をエージェントのオンチェーンウォレットに自動的にルーティングする
- オプションで、エージェントのための最初のスワップを手数料無料で予約する
{% /callout %}

## サマリー

`agent`フィールドを指定した`createAndRegisterLaunch`は、新しいトークンを作成し、クリエイター手数料をエージェントの[Core](/core) asset PDAにルーティングし、エージェントがオンチェーンで実行できるようにlaunchトランザクションをCore executeインストラクションでラップします。

- **単一呼び出し** — `createAndRegisterLaunch`が作成、署名、送信、登録を順番に処理する
- **自動手数料ルーティング** — クリエイター手数料はエージェントPDAに送られ、ウォレットアドレスの手動設定は不要
- **取り消し不可能なトークン関連付け** — `setToken: true`はトークンをエージェントに永久にリンクする
- **対応バージョン** `@metaplex-foundation/genesis` 1.x · 最終確認：2026年4月

## クイックスタート

**ジャンプ先：** [インストール](#installation) · [Umiセットアップ](#umi-setup) · [発行](#launching-an-agent-token) · [初回購入](#first-buy) · [トークンメタデータ](#token-metadata) · [Devnet](#devnet-testing) · [エラー](#error-handling)

1. [Solanaでエージェントを登録](/agents/register-agent)してCore assetアドレスを取得する
2. Genesis SDKをインストールし、キーペアでUmiインスタンスを設定する
3. `agent: { mint: agentAssetAddress, setToken: true }`を指定して`createAndRegisterLaunch`を呼び出す
4. レスポンスから`result.mintAddress`と`result.launch.link`を読み取る

## 前提条件

- [登録済みのMetaplexエージェント](/agents/register-agent) — Core assetアドレスが必要
- **Node.js 18以上** — ネイティブ`BigInt`サポートに必要
- トランザクション手数料および初回購入額のSOLが入金されたSolanaウォレットキーペア
- SolanaのRPCエンドポイント（mainnet-betaまたはdevnet）
- [Irys](https://irys.xyz)にアップロード済みのトークン画像 — `image`フィールドはIrysゲートウェイURLである必要がある

## インストール {#installation}

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umiセットアップ {#umi-setup}

Genesis関数を呼び出す前に、キーペアIDでUmiインスタンスを設定してください。

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// キーペアを読み込みます — 本番環境では適切なキー管理ソリューションを使用してください。
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
Genesis API関数は、インストラクションを直接送信するのではなく、HTTPを経由してホスト型のMetaplex APIと通信します。Umiインスタンスは署名者IDとトランザクション送信機能のためだけに使用され、`genesis()`プラグインは必要ありません。
{% /callout %}

## エージェントトークンの発行 {#launching-an-agent-token}

`createAndRegisterLaunch`にエージェントの[Core](/core) assetアドレスを指定した`agent`フィールドを渡します。SDKは自動的に以下を行います。

- クリエイター手数料ウォレットをエージェントのCore assetシグナーPDA（`['mpl-core-execute', <agent_mint>]`から導出）に設定する
- エージェントがオンチェーンで実行できるようにlaunchトランザクションをCore executeインストラクションでラップする

```typescript {% title="agent-launch.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,  // 登録済みエージェントのCore assetアドレス
    setToken: true,           // このトークンをエージェントに永久に関連付ける
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});

console.log('トークンが発行されました！');
console.log('ミントアドレス:', result.mintAddress);
console.log('確認先:', result.launch.link);
```

{% callout type="warning" %}
`setToken: true`は、発行されたトークンをエージェントのプライマリトークンとして永久に関連付けます。**これは取り消しできません。** トランザクションが確認された後、元に戻したり再割り当てしたりすることはできません。そのエージェントに関連付けるトークンとして確実に正しい場合にのみ、`setToken: true`を設定してください。
{% /callout %}

`launch: {}`が空の場合、供給の分割、仮想リザーブ、ロックスケジュールなどのすべてのプロトコルパラメーターはプロトコルのデフォルト値に設定されます。

ボンディングカーブの価格設定、手数料、グラデュエーションの仕組みについては、[ボンディングカーブV2 — 動作理論](/smart-contracts/genesis/bonding-curve-v2)を参照してください。

## 初回購入 {#first-buy}

初回購入は、指定したSOL額でエージェントPDAのためにカーブの最初のスワップを予約し、すべての手数料が免除されます。

`firstBuyAmount`に手数料無料の初回購入のSOL額を設定します。`agent`が指定されている場合、初回購入の購入者はデフォルトでエージェントPDAになります。

```typescript {% title="agent-launch-with-first-buy.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    firstBuyAmount: 0.1, // 0.1 SOL、手数料無料
  },
});
```

初回購入はlaunchトランザクションフローの一部として実行されます。トランザクションが確認された時点で、カーブにはすでに初回購入が適用されています。`firstBuyAmount`が省略または`0`の場合、初回購入は適用されず、任意のウォレットが最初のスワップを行うことができます。

## トークンメタデータ {#token-metadata}

すべての発行には以下のフィールドを含む`token`オブジェクトが必要です。

| フィールド | 必須 | 制約 |
|-----------|------|------|
| `name` | はい | 1〜32文字 |
| `symbol` | はい | 1〜10文字 |
| `image` | はい | IrysのURL（`https://gateway.irys.xyz/...`）であること |
| `description` | いいえ | 最大250文字 |
| `externalLinks` | いいえ | オプションの`website`、`twitter`、`telegram`のURL |

```typescript {% title="token-metadata.ts" %}
token: {
  name: 'Agent Token',
  symbol: 'AGT',
  image: 'https://gateway.irys.xyz/your-image-id',
  description: 'The official token of my agent',
  externalLinks: {
    website: 'https://myagent.com',
    twitter: '@myagent',
  },
},
```

`image`フィールドはIrysゲートウェイURLを指定する必要があります。先に[Irys](https://irys.xyz)に画像をアップロードし、返された`https://gateway.irys.xyz/<id>` URLを使用してください。その他のホストはAPIバリデーションで失敗します。

## Devnetテスト {#devnet-testing}

`network: 'solana-devnet'`を渡し、UmiインスタンスをdevnetのRPCエンドポイントに向けることで、launchをdevnetインフラを通じてルーティングできます。

```typescript {% title="devnet-agent-launch.ts" showLineNumbers=true %}
const umi = createUmi('https://api.devnet.solana.com');
umi.use(keypairIdentity(keypair));

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,
    setToken: false, // devnetでのテスト時は誤ってロックしないようにfalseを使用する
  },
  launchType: 'bondingCurve',
  network: 'solana-devnet',
  token: {
    name: 'Test Token',
    symbol: 'TEST',
    image: 'https://gateway.irys.xyz/test-image',
  },
  launch: {},
});
```

## エラー処理 {#error-handling}

SDKは異なる障害モードに対して型付きエラーを提供します。

| エラータイプ | ガード | 原因 |
|------------|-------|------|
| バリデーションエラー | `isGenesisValidationError` | 無効な入力（例：Irys以外の画像URL、名前が長すぎる） |
| ネットワークエラー | `isGenesisApiNetworkError` | `https://api.metaplex.com`に到達できない |
| APIエラー（4xx） | `isGenesisApiError` | APIによってリクエストが拒否された。`err.responseBody`を確認 |
| APIエラー（5xx） | `isGenesisApiError` | Metaplex APIが利用不可。バックオフで再試行 |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createAndRegisterLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createAndRegisterLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`"${err.field}"のバリデーションエラー: ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('ネットワークエラー:', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`APIエラー (${err.statusCode}): ${err.message}`);
    console.error('詳細:', err.responseBody);
  } else {
    throw err;
  }
}
```

## 注意事項

- `createAndRegisterLaunch`は内部で2回のAPI呼び出しを行います。createトランザクションが確認されたが`registerLaunch`が失敗した場合、トークンはオンチェーンに存在しますがmetaplex.comには表示されません。このケースを処理するには、`createLaunch` + `registerLaunch`を[手動署名フロー](/smart-contracts/genesis/bonding-curve-v2-launch#manual-signing-flow)で個別に使用してください
- `launch.creatorFeeWallet`を明示的に設定することでクリエイター手数料ウォレットを上書きできます — エージェントPDAより優先されます
- 初回購入はlaunch作成時に設定され、カーブがライブになった後に追加することはできません
- クリエイター手数料はスワップごとに転送されるのではなく、バケットに蓄積されます。パーミッションレスの`claimBondingCurveCreatorFeeV2`（ボンディングカーブ）および`claimRaydiumCreatorFeeV2`（グラデュエーション後のRaydium）インストラクションで請求してください — [スワップ統合ガイド](/smart-contracts/genesis/bonding-curve-v2-swaps#claiming-creator-fees)を参照
- Metaplex APIはトランザクションを構築して未署名のまま返します。署名キーは常に呼び出し元が保持します

## よくある質問

### エージェントトークンとは何ですか？

エージェントトークンは、[Genesis](/smart-contracts/genesis)プロトコルを使用してエージェントのオンチェーンウォレットから発行されるトークンです。`createAndRegisterLaunch`に`agent`フィールドを渡すと、クリエイター手数料がエージェントの[Core](/core) assetシグナーPDAに自動的にルーティングされ、エージェントがオンチェーンで実行できるようにlaunchトランザクションがCore executeインストラクションでラップされます。

### エージェントトークンを発行する際、クリエイター手数料はどこに送られますか？

クリエイター手数料はエージェントのCore assetシグナーPDA（シード`['mpl-core-execute', <agent_mint>]`から導出）に自動的にルーティングされます。`creatorFeeWallet`を手動で設定する必要はなく、`agent`フィールドを渡すだけで十分です。`launch.creatorFeeWallet`を明示的に設定することで、手数料ウォレットを上書きすることもできます。

### `setToken`は取り消しできますか？

いいえ。`setToken: true`を設定すると、発行されたトークンがエージェントのプライマリトークンとして永久に関連付けられます。これはトランザクションが確認された後、元に戻したり再割り当てしたりすることはできません。不確かな場合は`setToken: false`を設定し、トークンの関連付けを別途処理してください。

### エージェントトークンの発行をdevnetで先にテストできますか？

はい。launchの入力に`network: 'solana-devnet'`を渡し、Umiインスタンスを`https://api.devnet.solana.com`に向けてください。トランザクションを送信する前に、エージェントウォレットにdevnet SOLを補充してください。

### エージェント発行で初回購入とクリエイター手数料を組み合わせることはできますか？

はい。`agent`フィールドと合わせて`launch`オブジェクトに`firstBuyAmount`を設定してください。初回購入自体は手数料無料で、その購入にはプロトコル手数料もクリエイター手数料も課されません。クリエイター手数料はカーブ上のその後のすべてのスワップに通常通り適用されます。
