---
title: Oracle外部プラグインを使用して米国市場取引体験を作成する
metaTitle: Oracle外部プラグインを使用して米国市場取引体験を作成する | Coreガイド
description: このガイドでは、米国市場営業時間中にCore Collectionの取引と販売を制限する方法を示します。
updated: '01-31-2026'
keywords:
  - Oracle plugin
  - trading restrictions
  - market hours
  - transfer validation
about:
  - Oracle implementation
  - Trading restrictions
  - Time-based rules
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
howToSteps:
  - Initialize OracleとCrank Oracle命令を持つSolanaプログラムを作成
  - Oracleプログラムをデプロイしてからアカウントを初期化
  - Oracleアカウントを指すOracleプラグインを持つCollectionを作成
  - 市場営業時間に基づいてOracleの状態を更新するcronジョブをセットアップ
howToTools:
  - Anchorフレームワーク
  - mpl-core SDK
  - Solana CLI
  - Cronスケジューラー
---
この開発者ガイドでは、新しいOracleプラグインを活用して、**米国市場営業時間中のみ取引できるNFTコレクションを作成**します。
## はじめに
### 外部プラグイン
**外部プラグイン**は、動作が*外部*ソースによって制御されるプラグインです。coreプログラムはこれらのプラグインのアダプターを提供しますが、開発者はこのアダプターを外部データソースに向けることで動作を決定します。
各外部アダプターは、ライフサイクルイベントにライフサイクルチェックを割り当てる機能を持ち、発生するライフサイクルイベントの動作に影響を与えます。これは、create、transfer、update、burnなどのライフサイクルイベントに以下のチェックを割り当てることができることを意味します：
- **Listen**：ライフサイクルイベントが発生したときにプラグインに通知する「web3」webhook。これはデータの追跡やアクションの実行に特に便利です。
- **Reject**：プラグインはライフサイクルイベントを拒否できます。
- **Approve**：プラグインはライフサイクルイベントを承認できます。
外部プラグインについて詳しく知りたい場合は、[外部プラグイン概要ページ](/smart-contracts/core/external-plugins/overview)で詳細をお読みください。
### Oracleプラグイン
**Oracleプラグイン**は、外部プラグインの機能を活用して、外部authorityが更新できるデータを保存します。Coreアセットの外部にある**オンチェーンデータ**アカウントにアクセスすることで、アセットのauthorityが設定したライフサイクルイベントを動的に拒否できます。外部Oracleアカウントは、ライフサイクルイベントの認可動作を変更するためにいつでも更新でき、柔軟で動的な体験を提供します。
Oracleプラグインについて詳しく知りたい場合は、[Oracleプラグインページ](/smart-contracts/core/external-plugins/oracle)で詳細をお読みください。
## はじめに：アイデアの背後にあるプロトコルを理解する
米国市場営業時間中のみ取引できるNFTコレクションを作成するには、時刻に基づいてオンチェーンデータを更新する信頼できる方法が必要です。プロトコル設計は以下のようになります：
### プログラム概要
プログラムには2つの主要な命令（Oracleを作成するものとその値を更新するもの）と、実装を容易にする2つのヘルパー関数があります。
**主要な命令**
- **Initialize Oracle命令**：この命令はoracleアカウントを作成し、コレクションにこの時間制限機能を採用したいユーザーは、NFT Oracleプラグインをこのオンチェーンアカウントアドレスにリダイレクトします。
- **Crank Oracle命令**：この命令はoracleの状態データを更新し、常に正確で最新のデータを持つようにします。
**ヘルパー関数**
- **isUsMarketOpen**：米国市場が開いているかどうかをチェックします。
- **isWithin15mOfMarketOpenOrClose**：現在の時刻が市場の開場または閉場から15分以内かどうかをチェックします。
**注意**：`crank_oracle_instruction`は、最新の情報を維持する人々にインセンティブを提供することで、プロトコルが正確なデータで更新されることを保証します。これについては次のセクションで説明します。
### インセンティブメカニズム
このoracleを信頼のソースとして使用するすべてのコレクションは、oracleが常に最新であることを確認するために独自のcrankを実行する必要があります。ただし、回復力を高めるために、プロトコル開発者は複数の人がプロトコルをcrankするインセンティブを作成し、社内crankがデータの更新に失敗した場合にoracleデータの正確性を保つセーフティネットを確保することを検討する必要があります。
現在のプログラム設計では、oracleを維持するcrankerに0.001 SOLを報酬として与えます。この金額は管理可能でありながら、crankerがoracleの状態アカウントを最新に保つのに十分なインセンティブを提供します。
**注意**：これらのインセンティブは、crankが市場の開場または閉場の最初の15分以内に実行された場合にのみ支払われ、スマートコントラクトに存在するvaultから資金が提供されます。vaultはoracleのvaultアドレスにSOLを送信することで補充する必要があります。
## 実践：プログラムの構築
プロトコルの背後にあるロジックが明確になったので、コードに飛び込んですべてをまとめましょう！
### Anchor概要
このガイドでは、Anchorフレームワークを使用しますが、ネイティブプログラムを使用して実装することもできます。Anchorフレームワークの詳細は[Anchorのウェブサイト](https://www.anchor-lang.com/)をご覧ください。
簡単にするため、通常の分離ではなく、ヘルパー、状態、アカウント、命令がすべてlib.rsにあるモノファイルアプローチを使用します。
*注意：Metaplex Foundation Githubで例をフォローして開くことができます：[Oracle Trading Example](https://github.com/metaplex-foundation/mpl-core-oracle-trading-example)*
### ヘルパーと定数
一部の入力を繰り返し宣言するのではなく、命令/関数で簡単に参照できる定数を作成することをお勧めします。
**このoracleプロトコルで使用される定数は以下の通りです：**
```rust
// 定数
const SECONDS_IN_AN_HOUR: i64 = 3600;
const SECONDS_IN_A_MINUTE: i64 = 60;
const SECONDS_IN_A_DAY: i64 = 86400;
const MARKET_OPEN_TIME: i64 = 14 * SECONDS_IN_AN_HOUR + 30 * SECONDS_IN_A_MINUTE; // 14:30 UTC == 9:30 EST
const MARKET_CLOSE_TIME: i64 = 21 * SECONDS_IN_AN_HOUR; // 21:00 UTC == 16:00 EST
const MARKET_OPEN_CLOSE_MARGIN: i64 = 15 * SECONDS_IN_A_MINUTE; // 15分（秒）
const REWARD_IN_LAMPORTS: u64 = 10000000; // 0.001 SOL
```
スマートコントラクトのロジックの一部をチェックするヘルパーを作成することは理にかなっています。例えば、米国市場が開いているかどうか、開場または閉場から15分以内かどうかをチェックするなどです。
**is_us_market_openヘルパー：**
```rust
fn is_us_market_open(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;
    let weekday = (unix_timestamp / SECONDS_IN_A_DAY + 4) % 7;
    // 平日かどうかをチェック（月曜日 = 0、...、金曜日 = 4）
    if weekday >= 5 {
        return false;
    }
    // 現在の時刻が市場営業時間内かどうかをチェック
    seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_CLOSE_TIME
}
```
このヘルパーは、指定されたUnixタイムスタンプに基づいて米国市場が開いているかどうかをチェックします。真夜中からの秒数と曜日を計算します。現在の時刻が平日で市場営業時間内であればtrueを返します。
**注意**：これは単なる例であり、銀行休業日などの特定の場合は考慮されません。
**is_within_15_minutes_of_market_open_or_closeヘルパー：**
```rust
fn is_within_15_minutes_of_market_open_or_close(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;
    // 現在の時刻が市場開場後15分以内または市場閉場後15分以内かどうかをチェック
    (seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_OPEN_TIME + MARKET_OPEN_CLOSE_MARGIN) ||
    (seconds_since_midnight >= MARKET_CLOSE_TIME && seconds_since_midnight < MARKET_CLOSE_TIME + MARKET_OPEN_CLOSE_MARGIN)
}
```
このヘルパーは、真夜中からの秒数を計算し、市場の開場時間と閉場時間を比較して15分のマージンを追加することで、現在の時刻が市場の開場または閉場から15分以内かどうかをチェックします。
### 状態
Solanaでは、チェーン上にデータを保存するために、デシリアライズされたときにこのデータを表す構造体を作成する必要があります。
Oracleアカウントに使用する構造体は以下の通りです。
```rust
#[account]
pub struct Oracle {
    pub validation: OracleValidation,
    pub bump: u8,
    pub vault_bump: u8,
}
impl Space for Oracle {
    const INIT_SPACE: usize = 8 + 5 + 1;
}
```
この構造体を作成する際の選択について説明しましょう：
- adminフィールドがないのは、一度初期化されると、誰でも対話できるパーミッションレスになるからです。
- validationフィールドは最初に配置され、NFT上でOracleプラグイン設定でカスタムオフセットを必要とせずに、discriminatorサイズ（8バイト）だけで検索するオフセットを設定するネイティブな方法を活用するためです。
- Oracle PDAとOracle Vault PDAの両方のbumpを保存して、これらのアカウントを命令に含めるたびにbumpを導出することを避けます。これはSolana開発の標準であり、コンピュート使用量の節約に役立ちます。詳細は[Solana StackExchange](https://solana.stackexchange.com/questions/12200/why-do-i-need-to-store-the-bump-inside-the-pda)をお読みください。
スペース計算に関しては、AnchorのSpace実装を直接使用し、PDAを作成してレント免除のために十分なSOLを保存するときに参照する`INIT_SPACE`という定数を作成します。
唯一珍しい点は、mpl-coreのOracleValidation構造体のサイズが5バイトである必要があることです。残りのスペース計算は標準です。スペース計算の詳細は[Anchor Book](https://book.anchor-lang.com/anchor_references/space.html)をご覧ください。
### アカウント
Anchorのアカウントは、Solanaプログラムへの入力からデシリアライズできる検証済みアカウントの構造です。
プログラムの両方の命令で使用されるアカウント構造は非常に似ています。ただし、一方ではOracleアカウントを初期化し、もう一方では参照するだけです。
`CreateOracle`アカウントを見てみましょう：
```rust
#[derive(Accounts)]
pub struct CreateOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = Oracle::INIT_SPACE,
        seeds = [b"oracle"],
        bump
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```
この構造体は、この命令のsignerとpayerの2つの別々のアカウントを提示します。これはほとんどの命令で標準であり、PDAがトランザクションに署名する場合でも料金を支払うアカウントがあることを保証するため、ここでは厳密には必要ありませんが。両方ともトランザクションのsignerである必要があります。
その他の詳細：
- Oracleアカウントは初期化され、複数のoracleアカウントを作成する可能性がないことを保証するために`[b"oracle"]`をseedとして持ちます。割り当てられるスペースは`INIT_SPACE`定数によって定義されます。
- `reward_vault`アカウントは、次の命令で使用するbumpを保存するためにこの命令に含まれています。
- Systemプログラムは、initマクロがsystemプログラムの`create_account`命令を使用するため、Solana上で新しいアカウントを作成するために必要です。
次に`CrankOracle`アカウントを見てみましょう：
```rust
#[derive(Accounts)]
pub struct CrankOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"oracle"],
        bump = oracle.bump,
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        mut,
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump = oracle.vault_bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```
この構造はCreateOracleアカウントと似ていますが、oracleとreward_vaultがmutableに設定されています。これは、oracleがvalidation入力を更新する必要があり、reward_vaultがcrankerに支払うためにlamportsを調整する必要があるためです。bumpフィールドはoracleアカウントから明示的に定義され、毎回再計算することを避けます。
### 命令
最後に、魔法が起こる最も重要な部分、命令に到達しました！
`Create Oracle`命令：
```rust
pub fn create_oracle(ctx: Context<CreateOracle>) -> Result<()> {
    // 時刻と米国市場が開いているかどうかに基づいてOracle validationを設定
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Approved,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
        false => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Rejected,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
    }
    Ok(())
}
```
この命令は、set_innerを使用してOracle State Structを正しく設定してoracleアカウントを初期化します。is_us_market_open関数の結果に基づいて、そのアカウントを指すNFTの転送を承認または拒否します。さらに、ctx.bumpsを使用してbumpを保存します。
`Crank Oracle`命令：
```rust
pub fn crank_oracle(ctx: Context<CrankOracle>) -> Result<()> {
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Rejected,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Approved,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
        false => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Approved,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Rejected,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
    }
    let reward_vault_lamports = ctx.accounts.reward_vault.lamports();
    let oracle_key = ctx.accounts.oracle.key().clone();
    let signer_seeds = &[b"reward_vault", oracle_key.as_ref(), &[ctx.accounts.oracle.bump]];

    if is_within_15_minutes_of_market_open_or_close(Clock::get()?.unix_timestamp) && reward_vault_lamports > REWARD_IN_LAMPORTS {
        // 市場の開場または閉場から15分以内にOracleを更新したcrankerに報酬を与える
        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.reward_vault.to_account_info(),
                    to: ctx.accounts.signer.to_account_info(),
                },
                &[signer_seeds]
            ),
            REWARD_IN_LAMPORTS
        )?
    }
    Ok(())
}
```
この命令はcreate_oracle命令と同様に機能しますが、追加のチェックがあります。is_us_market_open関数からの応答に基づいて、状態がすでに更新されているかどうかを確認します。更新されていない場合は状態を更新します。
命令の2番目の部分は、is_within_15_minutes_of_market_open_or_closeがtrueで、reward vaultにcrankerに支払うのに十分なlamportsがあるかどうかをチェックします。両方の条件が満たされた場合、crankerに報酬を転送します。そうでなければ何もしません。
### NFTの作成
この旅の最後の部分は、コレクションを作成し、そのコレクションに含めるすべてのアセットがカスタムOracleルールに従うようにOracleアカウントを指すようにすることです！
Umiを使用するための環境をセットアップすることから始めましょう。（UmiはSolanaプログラム用のJavaScriptクライアントを構築および使用するためのモジュラーフレームワークです。詳細は[Umi入門ガイド](/dev-tools/umi/getting-started)をご覧ください）
```ts
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// 使用するウォレットのSecretKey
import wallet from "../wallet.json";
const umi = createUmi("https://api.devnet.solana.com", "finalized")
let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));
```
次に、`CreateCollection`命令を使用してOracleプラグインを含むコレクションを作成します：
```ts
// CollectionのPublicKeyを生成
const collection = generateSigner(umi)
console.log("Collection Address: \n", collection.publicKey.toString())
const oracleAccount = publicKey("...")
// コレクションを生成
const collectionTx = await createCollection(umi, {
    collection: collection,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
    plugins: [
        {
            type: "Oracle",
            resultsOffset: {
                type: 'Anchor',
            },
            baseAddress: oracleAccount,
            authority: {
                type: 'UpdateAuthority',
            },
            lifecycleChecks: {
                transfer: [CheckResult.CAN_REJECT],
            },
            baseAddressConfig: undefined,
        }
    ]
}).sendAndConfirm(umi)
// トランザクションから署名をデシリアライズ
let signature = base58.deserialize(collectinTx.signature)[0];
console.log(signature);
```
## 結論
おめでとうございます！これでOracleプラグインを使用して米国市場営業時間中のみ取引できるNFTコレクションを作成する準備が整いました。CoreとMetaplexについてさらに学びたい場合は、[開発者ハブ](/smart-contracts/core/getting-started)をご覧ください。
