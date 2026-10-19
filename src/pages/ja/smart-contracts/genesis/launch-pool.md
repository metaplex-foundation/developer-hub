---
title: Launch Pool
metaTitle: Genesis Launch Pool | Solanaでのフェアローンチとトークン配布 | Metaplex
description: Solanaでのフェアローンチによるトークン配布。ユーザーがSOLを預け入れ、比例配分でSPLトークンを受け取ります。自然な価格発見を実現するオンチェーンクラウドセールです。
created: '01-15-2025'
updated: '09-18-2026'
keywords:
  - launch pool
  - token distribution
  - fair launch
  - fair launch crypto
  - proportional distribution
  - deposit window
  - price discovery
  - token launchpad
  - crowdsale
  - token sale alternative
  - SPL token launch
  - on-chain token launch
  - soft cap
  - oversubscription
  - pro-rata refund
  - minimum quote token threshold
about:
  - Launch pools
  - Price discovery
  - Token distribution
  - Soft caps
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - トークンを使用して Genesis Account を初期化する
  - 入金ウィンドウ設定を持つ Launch Pool bucket を追加する
  - 集めた資金を受け取る Unlocked bucket を追加する
  - ファイナライズし、ユーザーがウィンドウ期間中に入金できるようにする
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Launch Pool でトークン価格はどのように決まりますか？
    a: 価格は総入金額に基づいて自然に発見されます。最終価格は、入金された SOL の総額を割り当てられたトークン数で割った値になります。入金が多いほど、トークンあたりの暗黙の価格が高くなります。
  - q: ユーザーは入金を引き出せますか？
    a: はい、入金期間中に引き出すことができます。システムの悪用を防ぐため、{% fee product="genesis" config="launchPool" fee="withdraw" /%} の引き出し手数料が適用されます。
  - q: 複数回入金するとどうなりますか？
    a: 同じウォレットからの複数の入金は、単一の入金アカウントに蓄積されます。あなたの合計シェアは、合算された入金額に基づきます。
  - q: ユーザーはいつトークンを請求できますか？
    a: 入金期間が終了し、請求ウィンドウが開いた後（claimStartCondition で定義）に請求できます。End Behavior を処理するために、先に triggerBehaviorsV2 を実行する必要があります。
  - q: Launch Pool と Presale の違いは何ですか？
    a: Launch Pool は入金に基づいて自然に価格を発見し、比例配分で配布します。Presale は事前に固定価格が設定され、上限に達するまで先着順で割り当てられます。
  - q: Launch Pool のソフトキャップとは何ですか？
    a: ソフトキャップは、Launch Pool が保持する Quote Token の上限であり、softCap 拡張で設定します。上限を超える入金も受け付けられ、ローンチは成功し、超過分は入金ウィンドウ終了後に比例配分で返金されます。
  - q: ソフトキャップと最小 Quote Token しきい値の違いは何ですか？
    a: ソフトキャップは調達額の上限であり、ローンチを失敗させることはありません。最小 Quote Token しきい値（minimumQuoteTokenThreshold）は下限で、総入金額がこれを下回るとローンチは失敗し、すべての入金者が全額返金を受けられます。これらは別々の拡張であり、併用できます。
  - q: Launch Pool が申込超過（オーバーサブスクライブ）になると、入金者の受け取るトークンは減りますか？
    a: いいえ。Base Token の割り当て全体は、引き続きすべての入金に比例して配布されます。申込超過の場合はトークン割り当てを減らす代わりに超過分の Quote Token が返金されるため、実効価格は softCap / baseTokenAllocation で上限が決まります。
  - q: ソフトキャップは Raydium グラデュエーションの開始価格に影響しますか？
    a: はい。Launch Pool が申込超過の場合、グラデュエーションの開始価格は生の入金総額ではなく上限適用後の調達額から算出されるため、SendQuoteTokenPercentage によって実際に転送される額と一致します。
---

**Launch Pool** は Solana 上でのフェアトークンローンチのための自然な価格発見メカニズムを提供します。ユーザーはウィンドウ期間中に SOL を入金し、総入金額に対するシェアに比例して SPL トークンを受け取ります。スナイピングなし、フロントランニングなし、全員にとって公平な配布です。 {% .lead %}

{% callout title="学べること" %}
このガイドでは以下を説明します：
- Launch Pool の価格設定と配布の仕組み
- 入金ウィンドウと請求ウィンドウの設定方法
- 資金回収のための End Behavior の設定
- ユーザー操作：入金、引き出し、請求
{% /callout %}

## 概要

Launch Pool は、定義されたウィンドウ期間中に入金を受け付け、トークンを比例配分で配布するクラウドセール型のトークンローンチメカニズムです。最終的なトークン価格は、総入金額をトークン割り当て量で割って決定され、トークン生成イベント（TGE）のための透明なオンチェーン価格発見を実現します。

- ユーザーは入金ウィンドウ期間中に SOL を入金します（{% fee product="genesis" config="launchPool" fee="deposit" /%} の手数料が適用）
- 入金期間中は引き出しが可能です（{% fee product="genesis" config="launchPool" fee="withdraw" /%} の手数料）
- トークン配布は入金シェアに比例します
- 任意の[ソフトキャップ](#launch-pool-soft-cap)により、ローンチが保持する額に上限を設け、超過分を比例配分で返金できます
- End Behavior が集められた SOL をトレジャリー bucket にルーティングします

{% callout type="note" %}
Launch Pool は入金に基づいて価格を発見します。事前に設定された固定価格には [Presale](/smart-contracts/genesis/presale) を、入札ベースのクリアリングには [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) を使用してください。流動性プールの作成は、Launch Pool bucket 自体ではなく Raydium グラデュエーション bucket が担当します。
{% /callout %}

## クイックスタート

{% totem %}
{% totem-accordion title="完全なセットアップスクリプトを表示" %}

これは入金ウィンドウと請求ウィンドウを持つ Launch Pool のセットアップ方法を示しています。ユーザー向けアプリの構築については、[ユーザー操作](#ユーザー操作)を参照してください。

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

async function setupLaunchPool() {
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1 million tokens (9 decimals)

  // 1. Initialize
  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: 'My Token',
    symbol: 'MTK',
    uri: 'https://example.com/metadata.json',
  }).sendAndConfirm(umi);

  // 2. Define timing
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now + 60n;
  const depositEnd = now + 86400n; // 24 hours
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n; // 1 week

  // 3. Derive bucket PDAs
  const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. Add Launch Pool bucket
  await addLaunchPoolBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    depositStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositStart,
      triggeredTimestamp: null,
    },
    depositEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositEnd,
      triggeredTimestamp: null,
    },
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
    minimumDepositAmount: null,
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000, // 100%
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  // 5. Add Unlocked bucket (receives SOL after transition)
  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
    recipient: umi.identity.publicKey,
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
  }).sendAndConfirm(umi);

  // 6. Finalize
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Launch Pool active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupLaunchPool().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## 仕組み

1. 特定量のトークンが Launch Pool bucket に割り当てられます
2. ユーザーは入金ウィンドウ期間中に SOL を入金します（手数料付きで引き出し可能）
3. ウィンドウが閉じると、入金シェアに基づいてトークンが比例配分されます

### 価格発見

トークン価格は総入金額から決まります：

```
tokenPrice = totalDeposits / tokenAllocation
userTokens = (userDeposit / totalDeposits) * tokenAllocation
```

**例：** 1,000,000 トークンが割り当てられ、総入金額が 100 SOL の場合 = 1トークンあたり 0.0001 SOL

価格発見はデフォルトでは上限がなく、申込が増えるほど暗黙の価格は上昇します。[ソフトキャップ](#launch-pool-soft-cap)を設定すると、その上限を設けられます。

### ライフサイクル

1. **入金期間** - ユーザーは定義されたウィンドウ期間中に SOL を入金します
2. **`triggerBehaviorsV2`** - End Behavior が実行されます（例：集められた SOL を別の bucket に送信）
3. **請求期間** - ユーザーは入金の重みに比例してトークンを請求します
4. **返金期間**（条件付き） - [ソフトキャップ](#launch-pool-soft-cap)を超過した場合、または[最小 Quote Token しきい値](#soft-cap-and-minimum-quote-token-threshold-together)に届かなかった場合、入金者は `refundLaunchPoolV2` を呼び出します

## Launch Pool のソフトキャップ {% #launch-pool-soft-cap %}

**ソフトキャップ**は、Launch Pool が保持する Quote Token の上限であり、`addLaunchPoolBucketV2` の `softCap` 拡張で設定します。上限を超える入金も入金ウィンドウ期間中は受け付けられ、ローンチは成功し、超過分の Quote Token はウィンドウ終了後に比例配分で返金されます。

ソフトキャップがない場合、価格発見には上限がありません。すべての入金が保持され、申込が増えるほどトークンの暗黙の価格が上昇します。ソフトキャップはローンチの最大調達額を固定するため、入金がどれだけ上限を超えても、実効価格は `softCap / baseTokenAllocation` になります。

| プロパティ | ソフトキャップ設定時の動作 |
|----------|------------------------------------------|
| 上限を超える入金 | 入金ウィンドウ期間中は受け付けられ、上限で入金が拒否されることはありません |
| ローンチの結果 | 成功します。ソフトキャップは上限であり、失敗条件ではありません |
| Base Token の配布 | `baseTokenAllocation` 全体がすべての入金に比例して配布されます |
| 超過分の Quote Token | 入金ウィンドウ終了後、`refundLaunchPoolV2` により比例配分で返金されます |
| End Behavior から見える調達額 | ソフトキャップに制限されるため、`SendQuoteTokenPercentage` が転送するのは最大でも `softCap` です |
| Raydium グラデュエーションの開始価格 | 生の入金総額ではなく、上限適用後の調達額から算出されます |

{% callout type="note" %}
ソフトキャップは調達額の上限であり、下限ではありません。下限は別の拡張である `minimumQuoteTokenThreshold` です。詳しくは[ソフトキャップと最小 Quote Token しきい値の併用](#soft-cap-and-minimum-quote-token-threshold-together)を参照してください。
{% /callout %}

### Launch Pool Bucket にソフトキャップを設定する {% #configuring-a-soft-cap-on-a-launch-pool-bucket %}

bucket を追加する際に、`addLaunchPoolBucketV2` に `softCap` の値を渡します。金額は Quote Token の最小単位（wSOL の場合は lamports）で指定します。

{% totem %}

```typescript {% title="100 SOL のソフトキャップを持つ Launch Pool bucket を追加する" %}
import { sol } from '@metaplex-foundation/umi';

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  // ...time conditions and end behaviors...

  // Floor: the launch fails below this and everyone can take a full refund.
  minimumQuoteTokenThreshold: { amount: sol(10).basisPoints },

  // Ceiling: the launch keeps at most this much; the rest is refunded pro-rata.
  softCap: { amount: sol(100).basisPoints },
}).sendAndConfirm(umi);
```

{% /totem %}

{% callout type="warning" %}
`softCap` は `@metaplex-foundation/genesis` 0.42.0 の `addLaunchPoolBucketV2` における**必須**引数です。他の Launch Pool 拡張とは異なりデフォルト値がないため、上限を設けない場合は明示的に `softCap: null` を渡してください。
{% /callout %}

ソフトキャップは、拡張を設定する際と `finalizeV2` の際に検証されます：

| ルール | 違反時のエラー |
|------|-------------------|
| `softCap.amount` は 0 より大きい必要があります | `InvalidSoftCap` (221) |
| `softCap.amount` は `minimumQuoteTokenThreshold.amount` 以上である必要があります | `SoftCapBelowThreshold` (222) |
| 拡張の追加・削除は `finalizeV2` の前にのみ可能です | アカウントはファイナライズ済みとして拒否されます |

既存の bucket に対しても、`LaunchPoolV2ExtensionType` の `SoftCap` メンバーを使って `addLaunchPoolBucketV2Extensions` と `removeLaunchPoolBucketV2Extensions` でソフトキャップを設定または解除できます。ただし、Genesis Account がファイナライズされる前に限ります。

### 申込超過と比例配分返金の計算 {% #oversubscription-and-pro-rata-refund-math %}

`quoteTokenDepositTotal` が `softCap.amount` を厳密に上回る場合、Launch Pool は**申込超過（オーバーサブスクライブ）**の状態です。このとき各入金は、上限にカウントされる*充当分（filled）*と、返金対象の*超過分（excess）*に分割されます：

{% totem %}

```text {% title="申込超過の Launch Pool における入金者ごとの分割" %}
filled_i = ceil(deposit_i * softCap / totalDeposits)
excess_i = deposit_i - filled_i
tokens_i = (weighted_i / weightedQuoteTokenTotal) * baseTokenAllocation
```

{% /totem %}

`filled` は**切り上げ**で計算されるため、すべての充当分の合計は常にソフトキャップ以上になります。これにより、返金とグラデュエーションのどちらを先に実行しても、上限適用後のグラデュエーション転送に対して bucket の残高が不足することはありません。各入金者の端数の切り上げは 1 最小単位未満であるため、bucket に残る端数（ダスト）は合計で最大 `depositCount - 1` 最小単位です。

トークン割り当ては上限の影響を受けません。超過分を返金しても入金者の重み付き貢献分は削除されないため、全員が**入金全額**に比例してトークンを受け取ります。

**具体例** — 1,000,000 トークンが割り当てられ、ソフトキャップが 100 SOL、入金額が 150 SOL の場合：

| 入金者 | 入金額 | 充当分（保持） | 返金額 | 受け取るトークン |
|-----------|-----------|---------------|----------|-----------------|
| Alice | 50 SOL | 約 33.33 SOL | 約 16.67 SOL | 333,333（1/3） |
| Bob | 100 SOL | 約 66.67 SOL | 約 33.33 SOL | 666,667（2/3） |
| **合計** | **150 SOL** | **100 SOL** | **50 SOL** | **1,000,000** |

実効価格は 1トークンあたり 0.0001 SOL（100 SOL / 1,000,000）であり、上限なしの入金総額から導かれる 1トークンあたり 0.00015 SOL ではありません。オンチェーンの値は `filled` を切り上げた lamports 単位で計算されるため、実際の数値は上記の丸めた SOL 額と数 lamports 異なります。

### refundLaunchPoolV2 で超過入金を返金する {% #refunding-excess-deposits-with-refund-launch-pool-v2 %}

`refundLaunchPoolV2` は、申込超過の入金ウィンドウ終了後に、入金者の超過分の Quote Token を返金します。金額の引数はなく、プログラムが入金額、ソフトキャップ、bucket の入金総額から返金額を計算します。

{% code-tabs-imported from="genesis/refund_launch_pool_v2" frameworks="umi" filename="refundLaunchPool" /%}

返金パスの主な特性：

- **クランクは誰でも実行できます。** 署名が必要なのは `payer` のみです。入金者も署名した場合、入金者の空の Base Token アカウントがクローズされます。
- 返金には**手数料もペナルティも適用されません**。入金・引き出しのペナルティスケジュールは返金に影響しません。
- **請求の順序は問いません。** 超過分の返金は `claimLaunchPoolV2` の前でも後でも可能で、どちらの順序でも同じ最終状態になります。
- **1 つの入金につき返金は 1 回です。** 2 回目の呼び出しは `DepositAlreadyRefunded` を返します。
- **返金は入金ウィンドウの終了後に限られます。** それより前に呼び出すと `LaunchPoolNotEnded` を返します。
- **返金には、下限未達または上限超過が必要です。** どちらにも該当しない場合、呼び出しは `LaunchPoolThresholdMet` を返します。

### ソフトキャップと最小 Quote Token しきい値の併用 {% #soft-cap-and-minimum-quote-token-threshold-together %}

`softCap` と `minimumQuoteTokenThreshold` は、Launch Pool を反対方向から制限する独立した拡張であり、`refundLaunchPoolV2` は両方に対応します。下限に達しなかった場合はそちらが優先され、返金は全額返金になります。

| 構成 | 入金が下限未満 | 入金が下限と上限の間 | 入金が上限超過 |
|---------------|--------------------------|--------------------------------|------------------------|
| いずれも未設定 | ローンチ成功、返金なし | ローンチ成功、返金なし | ローンチ成功、返金なし |
| 下限のみ | ローンチ失敗、全額返金 | ローンチ成功、返金なし | ローンチ成功、返金なし |
| 上限のみ | ローンチ成功、返金なし | ローンチ成功、返金なし | ローンチ成功、超過分を比例配分で返金 |
| 下限と上限 | ローンチ失敗、全額返金 | ローンチ成功、返金なし | ローンチ成功、超過分を比例配分で返金 |

{% callout type="note" %}
全額返金は入金者の重み付き貢献分を bucket から削除するため、請求の後に行うことはできません。下限未達の場合は請求自体が不可能です。超過分の返金は重み付き貢献分をそのまま残すため、比例配分の請求計算式は正しいままです。
{% /callout %}

## 手数料

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

各入金では、{% fee product="genesis" config="launchPool" fee="deposit" /%} のユーザー入金手数料を差し引いた後の SOL が入金アカウントの残高に反映されます。

## セットアップガイド

### 前提条件

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. Genesis Account の初期化

Genesis Account はトークンを作成し、すべての配布 bucket を調整します。

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

{% callout type="note" %}
`totalSupplyBaseToken` は、すべての bucket 割り当ての合計と等しくなるようにしてください。
{% /callout %}

### 2. Launch Pool Bucket の追加

Launch Pool bucket は入金を収集し、トークンを比例配分で配布します。ここでタイミングを設定します。

{% code-tabs-imported from="genesis/add_launch_pool_bucket_v2" frameworks="umi" filename="addLaunchPoolBucket" /%}

### 3. Unlocked Bucket の追加

Unlocked bucket は `triggerBehaviorsV2` 実行後に Launch Pool から SOL を受け取ります。

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### 4. ファイナライズ

すべての bucket が設定されたら、ファイナライズしてローンチを有効化します。この操作は取り消せません。

{% code-tabs-imported from="genesis/finalize_v2" frameworks="umi" filename="finalize" /%}

## ユーザー操作

### SOL のラッピング

ユーザーは入金前に SOL を wSOL にラップする必要があります。

{% code-tabs-imported from="genesis/wrap_sol" frameworks="umi" filename="wrapSol" /%}

### 入金

{% code-tabs-imported from="genesis/deposit_launch_pool_v2" frameworks="umi" filename="depositLaunchPool" /%}

同じユーザーからの複数の入金は、単一の入金アカウントに蓄積されます。

### 引き出し

ユーザーは入金期間中に引き出すことができます。{% fee product="genesis" config="launchPool" fee="withdraw" /%} の手数料が適用されます。

{% code-tabs-imported from="genesis/withdraw_launch_pool_v2" frameworks="umi" filename="withdrawLaunchPool" /%}

ユーザーが残高全額を引き出すと、入金 PDA はクローズされます。

### トークンの請求

入金期間が終了し、請求が開始された後：

{% code-tabs-imported from="genesis/claim_launch_pool_v2" frameworks="umi" filename="claimLaunchPool" /%}

トークン割り当て：`userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation`

### 入金の返金

返金が可能なのは 2 つの場合です。ローンチが `minimumQuoteTokenThreshold` に届かなかった場合（全額返金）、または `softCap` を超過した場合（超過分のみ返金）です。どちらも同じインストラクションを使用します。詳しくは [refundLaunchPoolV2 で超過入金を返金する](#refunding-excess-deposits-with-refund-launch-pool-v2)を参照してください。

## 管理者操作

### `triggerBehaviorsV2` の実行

入金が終了した後、`triggerBehaviorsV2` を実行して収集した SOL を Unlocked bucket に移動します。

{% code-tabs-imported from="genesis/trigger_launch_pool_v2" frameworks="umi" filename="triggerBehaviors" /%}

**これが重要な理由：** `triggerBehaviorsV2` を実行しないと、集められた SOL は Launch Pool bucket にロックされたままになります。ユーザーはトークンを請求できますが、チームは調達した資金にアクセスできません。

## リファレンス

### Time Condition

4つの条件が Launch Pool のタイミングを制御します：

| 条件 | 目的 |
|------|------|
| `depositStartCondition` | 入金の開始タイミング |
| `depositEndCondition` | 入金の終了タイミング |
| `claimStartCondition` | 請求の開始タイミング |
| `claimEndCondition` | 請求の終了タイミング |

`TimeAbsolute` をUnixタイムスタンプと共に使用します：

{% totem %}

```typescript
const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: null,
};
```

{% /totem %}

### End Behavior

入金期間後に集められた SOL の処理方法を定義します：

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 basis points
    processed: false,
  },
]
```

{% /totem %}

資金を複数の bucket に分割することもできます：

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(treasuryBucket),
    percentageBps: 2000, // 20%
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(liquidityBucket),
    percentageBps: 8000, // 80%
    processed: false,
  },
]
```

{% /totem %}

### Launch Pool 拡張

拡張は、Launch Pool bucket に設定する任意のガードです。すべて `addLaunchPoolBucketV2` で設定するか、`finalizeV2` の前に `addLaunchPoolBucketV2Extensions` と `removeLaunchPoolBucketV2Extensions` で個別に追加・削除できます。

| 拡張 | 型 | 目的 |
|-----------|------|---------|
| `softCap` | `{ amount: bigint }` | 保持する Quote Token の上限。超過分は比例配分で返金 |
| `minimumQuoteTokenThreshold` | `{ amount: bigint }` | これを下回るとローンチが失敗し、全額返金が可能になる下限 |
| `minimumDepositAmount` | `{ amount: bigint }` | 1 回の入金あたりの最小 Quote Token 量 |
| `depositLimit` | `{ limit: bigint }` | アカウントあたりの最大 Quote Token 量 |
| `allowlist` | `Allowlist` | 入金を許可リストのウォレットに限定 |
| `claimSchedule` | `ClaimSchedule` | 請求した Base Token を時間をかけてベスティング |
| `bonusSchedule` | `LinearBpsScheduleV2` | 時間に応じた入金ボーナス |
| `depositPenalty` | `LinearBpsScheduleV2` | 時間に応じた入金ペナルティ |
| `withdrawPenalty` | `LinearBpsScheduleV2` | 時間に応じた引き出しペナルティ |
| `backendSigner` | `BackendSigner` | ユーザー操作にバックエンドの共同署名を要求 |

### よくあるエラー {% #common-errors %}

以下のエラーは、無効なソフトキャップ設定と、`refundLaunchPoolV2` が返金リクエストを拒否する Launch Pool の状態を示します。

| エラー | コード | 原因 |
|-------|------|-------|
| `InvalidSoftCap` | 221 | `softCap.amount` が 0 です。`0` に設定せず、拡張自体を省略してください |
| `SoftCapBelowThreshold` | 222 | `softCap.amount` が `minimumQuoteTokenThreshold.amount` を下回っています |
| `LaunchPoolNotEnded` | — | 入金ウィンドウが閉じる前に `refundLaunchPoolV2` が呼び出されました |
| `LaunchPoolThresholdMet` | 173 | 下限に達し、上限も超過していない状態で返金がリクエストされました |
| `DepositAlreadyRefunded` | — | 同じ入金に対して `refundLaunchPoolV2` が 2 回呼び出されました |
| `DepositAlreadyClaimed` | — | 入金者がすでにトークンを請求した後に全額返金がリクエストされました |

### 状態の取得

**Bucket の状態：**

{% totem %}

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);

// Soft cap state (Option<SoftCap>)
console.log('Soft cap:', bucket.extensions.softCap);
console.log('Floor:', bucket.extensions.minimumQuoteTokenThreshold);
```

{% /totem %}

**入金の状態：**

{% totem %}

```typescript
import { fetchLaunchPoolDepositV2, safeFetchLaunchPoolDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda); // throws if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // returns null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
  console.log('Refunded:', deposit.refunded);
}
```

{% /totem %}

## 注意事項

- Launch Pool のユーザー入金・出金手数料は上記の [手数料](#手数料) を参照してください。
- 同じユーザーからの複数の入金は1つの入金アカウントに蓄積されます
- ユーザーが残高全額を引き出すと、入金 PDA はクローズされます
- End Behavior を処理するには、入金終了後に `triggerBehaviorsV2` を実行する必要があります
- ユーザーは入金するために wSOL（ラップされた SOL）を保持している必要があります
- `softCap` は `@metaplex-foundation/genesis` 0.42.0 の `addLaunchPoolBucketV2` における必須引数です。上限が不要な場合は `softCap: null` を渡してください
- `softCap` を含む Launch Pool 拡張は、`finalizeV2` の前にのみ追加・削除できます
- ソフトキャップは Genesis プログラムと JavaScript SDK でサポートされています。[`mplx` CLI](/dev-tools/cli/genesis/launch-pool) にはまだソフトキャップのフラグがありません
- 申込超過の Launch Pool では、各入金者の充当分が切り上げられるため、bucket に最大 `depositCount - 1` 最小単位の端数（ダスト）が残ります
- `quoteTokenDepositTotal` と `depositCount` は返金後も履歴として保持され、処理済みの返金数は `refundCount` で追跡されます

## FAQ

### Launch Pool でトークン価格はどのように決まりますか？
価格は総入金額に基づいて自然に発見されます。最終価格は、入金された SOL の総額を割り当てられたトークン数で割った値になります。入金が多いほど、トークンあたりの暗黙の価格が高くなります。

### ユーザーは入金を引き出せますか？
はい、入金期間中に引き出すことができます。システムの悪用を防ぐため、{% fee product="genesis" config="launchPool" fee="withdraw" /%} の引き出し手数料が適用されます。

### 複数回入金するとどうなりますか？
同じウォレットからの複数の入金は、単一の入金アカウントに蓄積されます。あなたの合計シェアは、合算された入金額に基づきます。

### ユーザーはいつトークンを請求できますか？
入金期間が終了し、請求ウィンドウが開いた後（`claimStartCondition` で定義）に請求できます。End Behavior を処理するために、先に `triggerBehaviorsV2` を実行する必要があります。

### Launch Pool と Presale の違いは何ですか？
Launch Pool は入金に基づいて自然に価格を発見し、比例配分で配布します。Presale は事前に固定価格が設定され、先着順で上限まで割り当てられます。

### Launch Pool のソフトキャップとは何ですか？
ソフトキャップは、Launch Pool が保持する Quote Token の上限であり、`softCap` 拡張で設定します。上限を超える入金も受け付けられ、ローンチは成功し、超過分は入金ウィンドウ終了後に比例配分で返金されます。

### ソフトキャップと最小 Quote Token しきい値の違いは何ですか？
ソフトキャップは調達額の上限であり、ローンチを失敗させることはありません。`minimumQuoteTokenThreshold` は下限で、総入金額がこれを下回るとローンチは失敗し、すべての入金者が全額返金を受けられます。これらは別々の拡張であり、併用できます。

### Launch Pool が申込超過（オーバーサブスクライブ）になると、入金者の受け取るトークンは減りますか？
いいえ。Base Token の割り当て全体は、引き続きすべての入金に比例して配布されます。申込超過の場合はトークン割り当てを減らす代わりに超過分の Quote Token が返金されるため、実効価格は `softCap / baseTokenAllocation` で上限が決まります。

### ソフトキャップは Raydium グラデュエーションの開始価格に影響しますか？
はい。Launch Pool が申込超過の場合、グラデュエーションの開始価格は生の入金総額ではなく上限適用後の調達額から算出されるため、`SendQuoteTokenPercentage` によって実際に転送される額と一致します。

## 用語集

| 用語 | 定義 |
|------|------|
| **Launch Pool** | 入金ベースの配布方式で、終了時に価格が発見される |
| **入金ウィンドウ** | ユーザーが SOL を入金・引き出しできる期間 |
| **請求ウィンドウ** | ユーザーが比例配分されたトークンを請求できる期間 |
| **End Behavior** | 入金期間終了後に実行される自動アクション |
| **`triggerBehaviorsV2`** | End Behavior を処理し資金をルーティングするインストラクション |
| **比例配分** | 総入金額に対するユーザーのシェアに基づくトークン割り当て |
| **Quote Token** | ユーザーが入金するトークン（通常は wSOL） |
| **Base Token** | 配布されるトークン |
| **ソフトキャップ** | Launch Pool が保持する Quote Token の上限。超過分は比例配分で返金される |
| **最小 Quote Token しきい値** | これを下回ると Launch Pool が失敗し、全額返金が可能になる下限 |
| **申込超過（オーバーサブスクリプション）** | 総入金額が設定されたソフトキャップを超えている状態 |
| **充当分（Filled Portion）** | 入金のうちソフトキャップにカウントされ、ローンチが保持する部分 |
| **超過分の返金（Excess Refund）** | 入金のうちソフトキャップを超える部分の返却。トークン割り当ては維持される |

## 次のステップ

- [Presale](/ja/smart-contracts/genesis/presale) - 固定価格トークン販売
- [Uniform Price Auction](/ja/smart-contracts/genesis/uniform-price-auction) - 入札ベースのトークンオファリング
- [トークンをローンチする](/ja/tokens/launch-token) - エンドツーエンドのトークンローンチガイド
- [Metaplex API](/ja/api) - API 経由でローンチとトークンセールデータを照会
