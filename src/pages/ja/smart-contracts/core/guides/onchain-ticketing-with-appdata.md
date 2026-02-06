---
title: Appdataプラグインを活用したイベントチケットプラットフォームの作成
metaTitle: Core - Appdataプラグイン例
description: このガイドでは、Appdataプラグインを活用してチケットプラットフォームを作成する方法を示します。
updated: '01-31-2026'
keywords:
  - NFT ticketing
  - event tickets
  - AppData plugin
  - digital tickets
about:
  - Ticketing platforms
  - AppData implementation
  - Event management
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
howToSteps:
  - Manager、Event、Ticket命令を持つSolanaプログラムを作成
  - 会場検証用にEventコレクションにLinkedAppDataをセットアップ
  - チケットステータス追跡用AppDataを持つチケットAssetsを作成
  - チケットステータスを読み取り更新する検証システムを構築
howToTools:
  - Anchorフレームワーク
  - mpl-core SDK
  - Solana CLI
---
この開発者ガイドでは、新しいAppdataプラグインを活用して、**発行者以外の外部の信頼できるソース（例えば会場マネージャー）によって検証できるデジタルアセットとしてチケットを生成するチケットソリューションを作成**します。

## はじめに

### 外部プラグイン

**外部プラグイン**は、動作が*外部*ソースによって制御されるプラグインです。coreプログラムはこれらのプラグインのアダプターを提供しますが、開発者はこのアダプターを外部データソースに向けることで動作を決定します。
各外部アダプターは、ライフサイクルイベントにライフサイクルチェックを割り当てる機能を持ち、発生するライフサイクルイベントの動作に影響を与えます。これは、create、transfer、update、burnなどのライフサイクルイベントに以下のチェックを割り当てることができることを意味します：

- **Listen**：ライフサイクルイベントが発生したときにプラグインに通知する「web3」webhook。これはデータの追跡やアクションの実行に特に便利です。
- **Reject**：プラグインはライフサイクルイベントを拒否できます。
- **Approve**：プラグインはライフサイクルイベントを承認できます。
外部プラグインについて詳しく知りたい場合は、[こちら](/smart-contracts/core/external-plugins/overview)で詳細をお読みください。

### Appdataプラグイン

**AppDataプラグイン**により、アセット/コレクションのauthorityが`data_authority`（外部の信頼できるソースで、アセット/コレクションのauthorityが決定した誰にでも割り当てることができます）によって書き込みおよび変更できる任意のデータを保存できます。AppDataプラグインを使用すると、コレクション/アセットのauthorityは、信頼できるサードパーティにアセットへのデータ追加タスクを委任できます。
新しいAppdataプラグインに慣れていない場合は、[こちら](/smart-contracts/core/external-plugins/app-data)で詳細をお読みください。

## 概要：プログラム設計

この例では、4つの基本操作を持つチケットソリューションを開発します：

- **Managerのセットアップ**：チケットの作成と発行を担当するauthorityを確立します。
- **Eventの作成**：コレクションアセットとしてイベントを生成します。
- **個別チケットの作成**：イベントコレクションの一部である個別チケットを作成します。
- **会場操作の処理**：チケットが使用されたときのスキャンなど、会場オペレーターの操作を管理します。
**注意**：これらの操作はチケットソリューションの基礎的な開始点を提供しますが、本格的な実装にはイベントコレクションのインデックス作成用の外部データベースなどの追加機能が必要です。ただし、この例はチケットソリューションの開発に興味がある方にとって良い出発点となります。

### チケットスキャンを処理する外部の信頼できるソースを持つことの重要性

**AppDataプラグイン**と**Core標準**の導入まで、オフチェーンストレージの制約により、アセットのattribute変更の管理は限られていました。また、アセットの特定の部分に対するauthorityを委任することも不可能でした。
この進歩は、チケットシステムなどの規制されたユースケースにとって画期的です。会場のauthorityが**attribute変更やその他のデータ側面に対する完全な制御を与えることなく、アセットにデータを追加**できるようになります。
このセットアップにより、不正行為のリスクが軽減され、エラーの責任が会場から発行会社に移ります。発行会社はアセットの不変記録を保持し、チケットを使用済みとしてマークするなどの特定のデータ更新は`AppDataプラグイン`を通じて安全に管理されます。

### PDAの代わりにデジタルアセットを使用してデータを保存

イベント関連データに汎用的な外部Program Derived Addresses（[PDA](/guides/understanding-pdas)）に依存するのではなく、**イベント自体をコレクションアセットとして作成**できます。このアプローチにより、イベントのすべてのチケットが「イベント」コレクションに含まれ、一般的なイベントデータに簡単にアクセスでき、イベントの詳細をチケットアセット自体と簡単にリンクできます。個別のチケット関連データ（チケット番号、ホール、セクション、列、座席、価格など）にも同じ方法をAssetに直接適用できます。
デジタルアセットを扱う際に、外部PDAに依存するのではなく、`Collection`や`Asset`アカウントなどのCoreアカウントを使用して関連データを保存することで、チケット購入者はデータをデシリアライズすることなく、ウォレットから直接すべての関連イベント情報を表示できます。さらに、アセット自体にデータを直接保存することで、Digital Asset Standard（DAS）を活用して、以下のように単一の命令でWebサイトにデータを取得・表示できます：

```typescript
const ticketData = await fetchAsset(umi, ticket);
console.log("\nThis are all the ticket-related data: ", ticketData.attributes);
```

## 実践：プログラム

### 前提条件とセットアップ

簡単にするため、必要なすべてのマクロが`lib.rs`ファイルにあるモノファイルアプローチでAnchorを使用します：

- `declare_id`：プログラムのオンチェーンアドレスを指定します。
- `#[program]`：プログラムの命令ロジックを含むモジュールを指定します。
- `#[derive(Accounts)]`：構造体に適用して、命令に必要なアカウントのリストを示します。
- `#[account]`：構造体に適用して、プログラム固有のカスタムアカウントタイプを作成します。
**注意**：Solana Playground（Solanaプログラムを構築・デプロイするためのオンラインツール）で以下の例を開いてフォローできます：[Solana Playground](https://beta.solpg.io/669fef20cffcf4b13384d277)。
スタイルの選択として、すべての命令のアカウント構造体で`Signer`と`Payer`を分離します。同じアカウントが両方に使用されることが多いですが、`Signer`がPDAの場合はアカウント作成の支払いができないため、2つの異なるフィールドが必要な標準的な手順です。この分離は私たちの命令に厳密には必要ありませんが、良いプラクティスと見なされています。
**注意**：SignerとPayerの両方がトランザクションの署名者である必要があります。

### 依存関係とインポート

この例では、主にanchor機能を有効にした`mpl_core`クレートを使用します：

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

使用される依存関係は以下の通りです：

```rust
use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_ID,
    fetch_external_plugin_adapter_data_info,
    fetch_plugin,
    instructions::{
        CreateCollectionV2CpiBuilder,
        CreateV2CpiBuilder,
        WriteExternalPluginAdapterDataV1CpiBuilder,
        UpdatePluginV1CpiBuilder
    },
    accounts::{BaseAssetV1, BaseCollectionV1},
    types::{
        AppDataInitInfo, Attribute, Attributes,
        ExternalPluginAdapterInitInfo, ExternalPluginAdapterKey,
        ExternalPluginAdapterSchema, PermanentBurnDelegate, UpdateAuthority,
        PermanentFreezeDelegate, PermanentTransferDelegate, Plugin,
        PluginAuthority, PluginAuthorityPair, PluginType
    },
};
```

### Setup Manager命令

setup manager命令は、`manager` PDAを初期化し、managerアカウント内にbumpsを保存するために必要な一度きりのプロセスです。
ほとんどのアクションは`Account`構造体で発生します：

```rust
#[derive(Accounts)]
pub struct SetupManager<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       init,
       payer = payer,
       space = Manager::INIT_SPACE,
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump,
   )]
   pub manager: Account<'info, Manager>,
   pub system_program: Program<'info, System>,
}
```

ここでは、`init`マクロを使用して`Manager`アカウントを初期化し、payerがレント用に十分なlamportsを転送し、`INIT_SPACE`変数で適切なバイト数を予約します。

```rust
#[account]
pub struct Manager {
    pub bump: u8,
}
impl Space for Manager {
    const INIT_SPACE: usize = 8 + 1;
}
```

命令自体では、managerアカウントを使用するときにsigner seedsで将来参照するためにbumpsを宣言して保存するだけです。これにより、managerアカウントを使用するたびに再検索するコンピュートユニットの無駄を避けられます。

```rust
pub fn setup_manager(ctx: Context<SetupManager>) -> Result<()> {
    ctx.accounts.manager.bump = ctx.bumps.manager;
    Ok(())
}
```

### Create Event命令

Create Event命令は、コレクションアセットの形式でデジタルアセットとしてイベントをセットアップし、関連するすべてのチケットとイベントデータをシームレスかつ整理された方法で含めることができます。
この命令のアカウント構造体は、Setup Manager命令に非常に似ています：

```rust
#[derive(Accounts)]
pub struct CreateEvent<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(mut)]
   pub event: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

主な違いは以下です：

- `Manager`アカウントはすでに初期化されており、イベントアカウントのupdate authorityとして使用されます。
- イベントアカウントはmutableとsignerに設定され、この命令中にCore Collectionアカウントに変換されます。
コレクションアカウント内に多くのデータを保存する必要があるため、関数に多数のパラメータを散らかすことを避けるために、すべての入力を構造化された形式で渡します。

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateEventArgs {
   pub name: String,
   pub uri: String,
   pub city: String,
   pub venue: String,
   pub artist: String,
   pub date: String,
   pub time: String,
   pub capacity: u64,
}
```

メイン関数`create_event`は、上記の入力を使用してイベントコレクションを作成し、すべてのイベント詳細を含むattributesを追加します。

```rust
pub fn create_event(ctx: Context<CreateEvent>, args: CreateEventArgs) -> Result<()> {
    // イベント詳細を保持するAttributeプラグインを追加
    let mut collection_plugin: Vec<PluginAuthorityPair> = vec![];
    let attribute_list: Vec<Attribute> = vec![
        Attribute {
            key: "City".to_string(),
            value: args.city
        },
        Attribute {
            key: "Venue".to_string(),
            value: args.venue
        },
        Attribute {
            key: "Artist".to_string(),
            value: args.artist
        },
        Attribute {
            key: "Date".to_string(),
            value: args.date
        },
        Attribute {
            key: "Time".to_string(),
            value: args.time
        },
        Attribute {
            key: "Capacity".to_string(),
            value: args.capacity.to_string()
        }
    ];

    collection_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    // チケットを保持するCollectionを作成
    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .collection(&ctx.accounts.event.to_account_info())
    .update_authority(Some(&ctx.accounts.manager.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(collection_plugin)
    .invoke()?;
    Ok(())
}
```

### Create Ticket命令

Create Ticket命令は、コレクションアセットの形式でデジタルアセットとしてイベントをセットアップし、関連するすべてのチケットとイベントデータをシームレスかつ整理された方法で含めることができます。
命令全体は`create_event`と非常に似ていますが、今回はイベントアセットを作成するのではなく、`イベントコレクション`内に含まれるチケットアセットを作成します。

```rust
#[derive(Accounts)]
pub struct CreateTicket<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   #[account(mut)]
   pub ticket: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

アカウント構造体の主な違いは以下です：

- イベントアカウントはすでに初期化されているため、`BaseCollectionV1`アセットとしてデシリアライズでき、`update_authority`がmanager PDAであることを確認できます。
- チケットアカウントはmutableとsignerに設定され、この命令中にCore Collectionアカウントに変換されます。
この関数でも多くのデータを保存する必要があるため、`create_event`命令と同様に構造化された形式でこれらの入力を渡します。

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateTicketArgs {
   pub name: String,
   pub uri: String,
   pub hall: String,
   pub section: String,
   pub row: String,
   pub seat: String,
   pub price: u64,
   pub venue_authority: Pubkey,
}
```

命令について話すとき、主な違いは以下です：

- 何か問題が発生した場合のセキュリティレイヤーを追加するために、`PermanentFreeze`、`PermanentBurn`、`PermanentTransfer`などの追加プラグインを組み込みます。
- 命令の入力として渡す`venue_authority`によって管理されるバイナリデータを保存するために、新しい`AppData`外部プラグインを使用します。
- 発行されたチケットの総数がキャパシティ制限を超えないかどうかを確認するサニティチェックが最初にあります。

```rust
pub fn create_ticket(ctx: Context<CreateTicket>, args: CreateTicketArgs) -> Result<()> {
    // チケットの最大数に達していないかチェック
    let (_, collection_attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(
            &ctx.accounts.event.to_account_info(),
            PluginType::Attributes
        )?;
    // Capacity attributeを検索
    let capacity_attribute = collection_attribute_list
        .attribute_list
        .iter()
        .find(|attr| attr.key == "Capacity")
        .ok_or(TicketError::MissingAttribute)?;
    // Capacity attributeの値をアンラップ
    let capacity = capacity_attribute
        .value
        .parse::<u32>()
        .map_err(|_| TicketError::NumericalOverflow)?;
    require!(
        ctx.accounts.event.num_minted < capacity,
        TicketError::MaximumTicketsReached
    );
    // チケット詳細を保持するAttributeプラグインを追加
    let mut ticket_plugin: Vec<PluginAuthorityPair> = vec![];

    let attribute_list: Vec<Attribute> = vec![
    Attribute {
        key: "Ticket Number".to_string(),
        value: ctx.accounts.event.num_minted.checked_add(1).ok_or(TicketError::NumericalOverflow)?.to_string()
    },
    Attribute {
        key: "Hall".to_string(),
        value: args.hall
    },
    Attribute {
        key: "Section".to_string(),
        value: args.section
    },
    Attribute {
        key: "Row".to_string(),
        value: args.row
    },
    Attribute {
        key: "Seat".to_string(),
        value: args.seat
    },
    Attribute {
        key: "Price".to_string(),
        value: args.price.to_string()
    }
    ];

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: false }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentTransferDelegate(PermanentTransferDelegate {}),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );
    let mut ticket_external_plugin: Vec<ExternalPluginAdapterInitInfo> = vec![];

    ticket_external_plugin.push(ExternalPluginAdapterInitInfo::AppData(
        AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address{ address: args.venue_authority },
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }
    ));
    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];
    // チケットを作成
    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .owner(Some(&ctx.accounts.signer.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(ticket_plugin)
    .external_plugin_adapters(ticket_external_plugin)
    .invoke_signed(&[signer_seeds])?;
    Ok(())
}
```

**注意**：外部プラグインを使用するには、.external_plugin_adapter入力を設定できるcreate関数のV2を使用する必要があります。

### Scan Ticket命令

Scan Ticket命令は、チケットがスキャンされたときにチケットのステータスを検証および更新してプロセスを完了します。

```rust
#[derive(Accounts)]
pub struct ScanTicket<'info> {
   pub owner: Signer<'info>,
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = ticket.owner == owner.key(),
       constraint = ticket.update_authority == UpdateAuthority::Collection(event.key()),
   )]
   pub ticket: Account<'info, BaseAssetV1>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>,
}
```

アカウント構造体の主な違いは以下です：

- チケットアカウントはすでに初期化されているため、`BaseAssetV1`アセットとしてデシリアライズでき、`update_authority`がイベントコレクションであること、およびアセットの所有者が`owner`アカウントであることを確認できます。
- スキャンが両者によって認証され、エラーがないことを確認するために、`owner`と`venue_authority`の両方がsignerである必要があります。アプリケーションは`venue_authority`によって部分的に署名されたトランザクションを作成してブロードキャストし、チケットの`owner`が署名して送信できるようにします。
命令では、Appdataプラグイン内にデータがあるかどうかを確認するサニティチェックから始めます。データがある場合、チケットはすでにスキャンされています。
その後、「Scanned」というu8のベクターで構成される`data`変数を作成し、後でAppdataプラグイン内に書き込みます。
命令の最後に、デジタルアセットをソウルバウンドにして、検証後に取引または転送できないようにします。イベントの記念品にするだけです。

```rust
pub fn scan_ticket(ctx: Context<ScanTicket>) -> Result<()> {
    let (_, app_data_length) = fetch_external_plugin_adapter_data_info::<BaseAssetV1>(
            &ctx.accounts.ticket.to_account_info(),
            None,
            &ExternalPluginAdapterKey::AppData(
                PluginAuthority::Address { address: ctx.accounts.signer.key() }
            )
        )?;
    require!(app_data_length == 0, TicketError::AlreadyScanned);
    let data: Vec<u8> = "Scanned".as_bytes().to_vec();
    WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.signer.key() }))
    .data(data)
    .invoke()?;
    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];
    UpdatePluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }))
    .invoke_signed(&[signer_seeds])?;
    Ok(())
}
```

## 結論

おめでとうございます！これでAppdataプラグインを使用したチケットソリューションを作成する準備が整いました。CoreとMetaplexについてさらに学びたい場合は、[開発者ハブ](/smart-contracts/core/getting-started)をご覧ください。
