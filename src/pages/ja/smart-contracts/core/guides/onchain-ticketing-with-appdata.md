---
title: AppDataプラグインでイベントチケット基盤を構築
metaTitle: Core - AppDataプラグイン例
description: AppDataプラグインを活用して、チケット発行と検証を行う基盤を設計・実装する方法を解説します。
---

このガイドでは、AppDataプラグインを使って、発行主体以外（例: 会場運営者）による検証が可能なチケット基盤を設計・実装する流れを示します。

## はじめに

### 外部プラグイン

外部プラグインは、挙動を外部要因で制御するプラグインです。Coreはアダプターを提供し、開発者は外部データソース（オンチェーン/オフチェーン）を指定します。ライフサイクルイベント（create/transfer/update/burn）に対して、Listen/Reject/Approveの各チェックを割り当てられます。概要は[こちら](/core/external-plugins/overview)。

### AppDataプラグイン

AppDataプラグインは、`data_authority`により任意データの書き込みを委譲できます。これにより、コレクション/アセット権限者は、信頼する第三者に対しデータ追加・更新を委任可能です。詳細は[こちら](/core/external-plugins/app-data)。

## 全体設計

この例では、以下の4操作を備えるチケット基盤を構築します。

- マネージャー初期化: チケット発行の権限管理主体を確立
- イベント作成: コレクション資産としてイベントを作成
- チケット発行: イベント配下に個票を生成
- 会場運用: 入場時のスキャン等、会場側の業務

外部の信頼主体（会場）がAppDataに書き込む設計により、発行企業は不変の台帳を保持しつつ、使用済みフラグ等の運用データは会場が安全に更新できます。

また、イベントやチケット情報をPDAではなくCoreのCollection/Assetに保存することで、ウォレットやDAS経由での取得が容易になります。

```ts
const ticketData = await fetchAsset(umi, ticket)
console.log("チケット属性: ", ticketData.attributes)
```

## プログラム実装（Anchor）

単一ファイル（lib.rs）にモジュールをまとめる簡易構成で示します。必要マクロ:
- declare_id / #[program] / #[derive(Accounts)] / #[account]

依存関係（例）:

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

主なインポート:

```rust
use mpl_core::{
    ID as MPL_CORE_ID,
    fetch_external_plugin_adapter_data_info,
    fetch_plugin,
    instructions::{
        CreateCollectionV2CpiBuilder, CreateV2CpiBuilder,
        WriteExternalPluginAdapterDataV1CpiBuilder, UpdatePluginV1CpiBuilder,
    },
    accounts::{BaseAssetV1, BaseCollectionV1},
    types::{
        AppDataInitInfo, Attribute, Attributes,
        ExternalPluginAdapterInitInfo, ExternalPluginAdapterKey,
        ExternalPluginAdapterSchema, PermanentBurnDelegate, UpdateAuthority,
        PermanentFreezeDelegate, PermanentTransferDelegate, Plugin,
        PluginAuthority, PluginAuthorityPair, PluginType,
    },
};
```

### Setup Manager命令

`manager` PDAを初期化し、bumpを保存します。

```rust
#[derive(Accounts)]
pub struct SetupManager<'info> { /* 省略（英語版同様） */ }

#[account]
pub struct Manager { pub bump: u8 }
impl Space for Manager { const INIT_SPACE: usize = 8 + 1; }

pub fn setup_manager(ctx: Context<SetupManager>) -> Result<()> {
    ctx.accounts.manager.bump = ctx.bumps.manager;
    Ok(())
}
```

### Create Event命令

イベントをコレクション資産として作成し、属性に会場・日時・キャパなどを保存します。

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateEventArgs { /* name/uri/city/venue/artist/date/time/capacity */ }

pub fn create_event(ctx: Context<CreateEvent>, args: CreateEventArgs) -> Result<()> {
    // Attributeプラグインでイベント情報を保持
    let mut collection_plugin: Vec<PluginAuthorityPair> = vec![];
    let attribute_list: Vec<Attribute> = vec![ /* 省略 */ ];
    // CreateCollectionV2CpiBuilderで作成 + Attributesを追加
    Ok(())
}
```

### チケット発行・会場運用

個票の発行では、イベントコレクション配下にアセットを作成し、AppDataやAttributesに必要情報（席・価格・QR/使用済みフラグなど）を保存します。入場処理では、`WriteExternalPluginAdapterDataV1CpiBuilder`でAppDataに「使用済み」等を記録します。

---

本稿は最小構成の概念実装です。実用には、外部DBでの索引・監査ログ・再発行/譲渡禁止の運用ルールなどを追加検討してください。

