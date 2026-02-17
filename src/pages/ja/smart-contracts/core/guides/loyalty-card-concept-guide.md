---
title: ロイヤルティカードコンセプトガイド
metaTitle: ロイヤルティカードコンセプトガイド | Coreガイド
description: このガイドでは、MPL Core NFT AssetsとMPL Coreプラグインシステムを使用してSolana上でロイヤルティカードプログラムを構築する方法について説明します。
updated: '01-31-2026'
keywords:
  - loyalty card
  - NFT membership
  - rewards program
  - Core plugins
about:
  - Loyalty programs
  - Membership NFTs
  - Plugin architecture
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
howToSteps:
  - プログラムPDAを指すUpdate Delegateを持つロイヤルティカード用Collectionを作成
  - ポイント用AppDataとソウルバウンド動作用Freeze Delegateを持つロイヤルティカードAssetsをミント
  - カードのミント、ポイント追加、報酬交換のための命令を構築
  - CPIビルダーを使用してプログラムからCoreと対話
howToTools:
  - Anchorフレームワーク
  - mpl-core Rustクレート
  - Solana CLI
---
## コンセプトガイド：Metaplex Coreとプラグインでロイヤルティカードをセットアップする
{% callout %}
⚠️ これは**コンセプトガイド**であり、完全なエンドツーエンドのチュートリアルではありません。RustとSolana、特にAnchorフレームワークを使用した開発に精通した開発者向けです。主要なアーキテクチャの決定とコード例を説明しますが、プログラム構造、CPI、Solanaスマートコントラクトのデプロイに関する知識があることを前提としています。
{% /callout %}
>
このガイドは、AnchorでRustとSolanaの基本的な知識があることを前提としています。Metaplex Coreを活用して、Solana上のCore NFT Assetsを使用してロイヤルティカードシステムを実装する1つの方法を探ります。厳格なアプローチを規定するのではなく、自分のプロジェクトに適応できる柔軟なパターンを示すことを目的としています。
### Metaplex Coreとは？
Metaplex Coreは、プラグインベースのアーキテクチャを提供するSolana上の最新のNFT Asset標準です。レガシーのToken Metadataプログラムとは異なり、Coreは開発者がカスタムデータストレージ、所有権制御、ルール適用などのモジュラー機能をNFTにアタッチできます。
この例では、Metaplex Coreの3つのコンポーネントを使用します：
- **AppDataプラグイン**：カスタム構造化データ（ロイヤルティポイントなど）を保存するため。
- **Freeze Delegateプラグイン**：ユーザーが転送やバーンできないようにNFTをロック（ソウルバウンド動作）するため。
- **Update Delegate Authority（PDA経由）**：特定のコレクションでミントされた子NFTを更新する制御をプログラムに与えるため。
また、Metaplex Coreプログラムと対話するために**CPIビルダー**（例：`CreateV2CpiBuilder`）を使用します。これらのビルダーは命令の構築と呼び出し方法を簡素化し、コードを読みやすく保守しやすくします。
### クイックライフサイクル概要
```
[ユーザー] → ロイヤルティカードを要求
    ↓
[プログラム] → NFT + AppData + FreezeDelegate（ソウルバウンド）をミント
    ↓
[ユーザー] → コーヒーを購入またはポイントを交換
    ↓
[プログラム] → AppDataプラグインのロイヤルティデータを更新
```
セットアップの詳細については、[Metaplex Coreドキュメント](https://metaplex.com/docs/core)をご覧ください。
## ロイヤルティシステムアーキテクチャ
この例では、Solanaブロックチェーン上でMetaplex Coreを使用してロイヤルティカードシステムを作成するための1つの潜在的な構造を概説します。ロイヤルティカードはNFTであり、それぞれの動作とデータの保存方法を管理するプラグインに関連付けられています。
### なぜソウルバウンドNFT Assetsを使用するのか？
ロイヤルティカードをソウルバウンドにすることで、単一のユーザーに紐付けられ、転送や販売ができないようになります。これにより、ロイヤルティプログラムの整合性を保ち、報酬の取引や複製によるシステムの悪用を防ぐことができます。
### LoyaltyCardData構造
各ロイヤルティカードは、購入または交換したコーヒーの数など、ユーザー固有のデータを追跡する必要があります。Core NFTは軽量で拡張可能に設計されているため、AppDataプラグインを使用してこの構造化されたロイヤルティデータをバイナリ形式でNFTに直接保存します。
このプラグインはNFTにアタッチされ、ミント時に設定されたauthority（この場合、ロイヤルティカードごとに導出されるPDA、以下で説明）によってのみ書き込むことができます。Solanaプログラムは、スタンプが獲得または交換されるたびにこのプラグインに書き込みます。
保存可能なデータ構造の例は以下の通りです：
```rust
pub struct LoyaltyCardData {
    pub current_stamps: u8,
    pub lifetime_stamps: u64,
    pub last_used: u64,
    pub issue_date: u64,
}
impl LoyaltyCardData {
    pub fn new_card() -> Self {
        let timestamp = clock::Clock::get().unwrap().unix_timestamp as u64;
        LoyaltyCardData {
            current_stamps: 0,
            lifetime_stamps: 0,
            last_used: 0,
            issue_date: timestamp,
        }
    }
}
```
この構造は、ユーザーが持っているスタンプの数、全体で獲得したスタンプの数、カードが発行または最後に使用された日時を追跡します。異なる報酬ロジックに合わせてこの構造をカスタマイズできます。
### PDA Collection Delegate
PDA（Program Derived Addresses）に慣れていない場合、シードとプログラムIDを使用して生成される決定論的なプログラム所有アドレスと考えてください。これらのアドレスは秘密鍵で制御されませんが、`invoke_signed`を使用してプログラム自体でのみ署名できます。これにより、プログラムロジックでauthorityやロールを割り当てるのに理想的です。
この場合、**collection delegate**はシード`[b"collection_delegate"]`を使用して生成されるPDAです。プログラムがロイヤルティカードコレクション内のNFTを管理するために使用する信頼されたauthorityとして機能します。このauthorityは、例えばプラグインデータ（スタンプなど）の更新やNFTのフリーズ/解凍に必要です。
このアプローチにより、プログラムのみが（外部ウォレットではなく）ロイヤルティカードデータを更新できることが保証されます。
Collection Delegateは、コレクション内のすべてのアセットを更新する権限をプログラムに与えるProgram Derived Address（PDA）です。シード`[b"collection_delegate"]`を使用してこのPDAを生成できます。コレクションレベルの権限を管理する他の方法もありますが、これは一般的に使用されるパターンの1つです。
```rust
// PDAを生成するために使用されるシード
let seeds = &[b"collection_delegate"];
let (collection_delegate, bump) = Pubkey::find_program_address(seeds, &program_id);
```
### Loyalty Authority PDA（カードごとのAuthority）
collection delegateに加えて、このパターンではロイヤルティカードごとに固有のPDAをプラグインauthorityとして使用します。このPDAはカードの公開鍵をシードとして使用して導出されます：
```rust
// 各ロイヤルティカードNFTに基づいてPDAを導出するために使用されるシード
let seeds = &[loyalty_card.key().as_ref()];
let (loyalty_authority, bump) = Pubkey::find_program_address(seeds, &program_id);
```
このPDAはミント時にAppDataとFreezeDelegateプラグインのauthorityとして設定されます。正しいシードで`invoke_signed`を使用するプログラムのみが、その特定のカードのデータを変更したりフリーズ状態を管理できることが保証されます。
カードごとのauthorityを使用することは、すべてのNFTを単一の集中型authorityで管理するよりも、きめ細かいアセット固有の制御が必要な場合に特に便利です。
### ステップ1：ロイヤルティカードCollectionの作成
このステップは、Metaplex JS SDKやCLIなどのツールを使用してオフチェーンで処理できます。ロイヤルティプログラムを表すコレクションNFT（例：「Sol Coffee Loyalty Cards」）を作成できます。このコレクションは、個々のロイヤルティカードNFTの親として機能し、プログラムがそれらを効率的に管理する方法を提供します。
PDAをコレクションのupdate authorityとして割り当てることで、プログラムがプログラム的にカードを発行および変更できるようになります。これをSolanaプログラム命令として実装することは厳密には必要ありませんが、「マネージャー」アカウントのオンボーディング機能を構築したり、複数のビジネス向けのホワイトラベルロイヤルティプログラムをサポートしたりする場合に役立ちます。
PDAをコレクションのupdate authorityとして割り当てることで、プログラムがプログラム的にカードを発行および変更できるようになります。これは厳密には必要ありませんが、制御を効率化するのに役立ちます。
Core Collectionのミントについて詳しく理解するには、[Core Collectionの作成](https://metaplex.com/docs/core/collections#creating-a-collection)をご覧ください。
### ステップ2：ソウルバウンドロイヤルティカードのミント
ユーザーがプログラムに参加すると、以下の特性を持つロイヤルティカードNFTをミントできます：
- ロイヤルティコレクションに属する
- Freeze Delegateプラグインを使用してフリーズ（ソウルバウンド）
- AppDataプラグインに状態を保存
ミントロジックを構造化する1つの方法は以下の通りです：
```rust
CreateV2CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .name("Sol Coffee Loyalty Card".to_owned())
    .collection(Some(&ctx.accounts.loyalty_card_collection))
    .uri("https://arweave.net/...".to_owned())
    .external_plugin_adapters(vec![
        ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            data_authority: PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() },
            init_plugin_authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }),
    ])
    .plugins(vec![
        PluginAuthorityPair {
            authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
        },
    ])
    .owner(Some(&ctx.accounts.signer))
    .payer(&ctx.accounts.signer)
    .authority(Some(&ctx.accounts.collection_delegate))
    .invoke_signed(collection_delegate_seeds)?;
```
### ステップ3：購入時のロイヤルティカードデータの更新
顧客が購入したり報酬を交換したりするとき、ロイヤルティカードのデータを適宜更新する必要があります。この例では、その動作はフロントエンドまたはクライアントから命令への引数として渡される`redeem`フラグによって制御されます。このフラグは、ユーザーが無料アイテムのポイントを交換しているのか、通常の購入を行っているのかを決定します。その`redeem`フラグに基づく`match`ステートメントを使用した1つのアプローチは以下の通りです：
- `redeem = true`の場合、ユーザーに十分なポイントがあるかチェックし、控除します。
- `redeem = false`の場合、lamports（SOL）を転送し、スタンプを追加します。
どちらの場合も、`last_used`タイムスタンプを更新し、更新された構造体をAppDataプラグインに書き戻します。
```rust
match redeem {
    true => {
        if loyalty_card_data.current_stamps < COST_OF_COFFEE_IN_POINTS {
            return Err(LoyaltyProgramError::NotEnoughPoints.into());
        }
        loyalty_card_data.current_stamps -= COST_OF_COFFEE_IN_POINTS;
    }
    false => {
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.signer.key(),
                &ctx.accounts.destination_account.key(),
                COST_OF_COFFEE_IN_LAMPORTS,
            ),
            &[ctx.accounts.signer.to_account_info(), ctx.accounts.destination_account.to_account_info()],
        )?;
        if loyalty_card_data.current_stamps < MAX_POINTS {
            loyalty_card_data.current_stamps += 1;
        }
        loyalty_card_data.lifetime_stamps += 1;
    }
}
loyalty_card_data.last_used = clock::Clock::get().unwrap().unix_timestamp as u64;
let binary = bincode::serialize(&loyalty_card_data).unwrap();
WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }))
    .data(binary)
    .invoke_signed(seeds)?;
```
## まとめ
このガイドでは、Metaplex Coreを使用したロイヤルティカードシステムの概念的な実装を説明しました。以下を探りました：
- ロイヤルティカード用のコレクションNFTの作成
- AppDataやFreezeDelegateなどのプラグインを使用したデータの保存とNFTのソウルバウンド化
- プログラムがロイヤルティカードを制御できるようにするPDA authorityの割り当て
- ポイントの獲得と交換などのユーザーインタラクションの処理
この構造は、プログラムロジック、ユーザーインタラクション、各ロイヤルティカードの状態間のクリーンな関心の分離を提供します。
## 機能拡張のアイデア
基本を整えたら、ロイヤルティシステムをより強力で魅力的にするためのいくつかの方向性を探ることができます：
- **ティア報酬**：生涯スタンプに基づいて複数の報酬レベル（例：シルバー、ゴールド、プラチナ）を導入。
- **有効期限ロジック**：スタンプやカードの有効期限を追加し、継続的なエンゲージメントを促進。
- **クロスストア利用**：ブランド内の複数の店舗またはマーチャントでロイヤルティカードを使用可能に。
- **カスタムバッジまたはメタデータ**：進捗の視覚的表現を示すためにNFTメタデータを動的に更新。
- **通知またはフック**：獲得した報酬やロイヤルティマイルストーンをユーザーに通知するオフチェーンシステムを統合。
Metaplex Coreのプラグインシステムと独自の創造性を組み合わせることで、真にやりがいがあり、ユニークなロイヤルティプラットフォームを構築できます。
このパターンは、オンチェーンロイヤルティシステムを管理するための柔軟でモジュラーなアプローチを提供します。プログラムの特定の目標に合わせてこのアプローチをカスタマイズおよび拡張できます。
