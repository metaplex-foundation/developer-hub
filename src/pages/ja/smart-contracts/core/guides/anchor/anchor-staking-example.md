---
title: Anchorでステーキングプログラムを作成する
metaTitle: Anchorでステーキングプログラムを作成する | Core ガイド
description: このガイドでは、Metaplex Coreデジタルアセット標準を使用して、FreezeDelegate PluginとAttribute Pluginを活用したステーキングプログラムの作成方法を説明します！
updated: '01-31-2026'
keywords:
  - NFT staking
  - Anchor staking
  - staking smart contract
  - freeze delegate staking
about:
  - Staking programs
  - Anchor development
  - On-chain staking
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
howToSteps:
  - mpl-core依存関係を含むAnchorプロジェクトをセットアップする
  - FreezeとAttribute Pluginを追加するstake命令を作成する
  - 解凍とステーキング期間を計算するunstake命令を作成する
  - devnetにステーキングプログラムをデプロイしてテストする
howToTools:
  - Anchor framework
  - mpl-core Rust crate
  - Solana CLI
---
この開発者ガイドでは、`Attribute`と`Freeze Delegate` Pluginを活用して、Anchorを使用したコレクション向けのステーキングプログラムの作成方法を説明します。このアプローチでは、時間計算やAssetの状態管理（ステーキング/アンステーキング）などのステーキングに関するすべてのロジックにスマートコントラクトを使用しますが、Core以前の標準のようにPDAにデータを保存するのではなく、Asset自体にデータを保存します。 {% .lead %}

## はじめに：プログラムのロジックを理解する

このプログラムは、lib.rsファイルに必要なすべてのマクロが含まれるモノファイルアプローチを採用した標準的なAnchorで動作します：

- declare_id：プログラムのオンチェーンアドレスを指定します。
- #[program]：プログラムの命令ロジックを含むモジュールを指定します。
- #[derive(Accounts)]：命令に必要なアカウントのリストを示すために構造体に適用されます。
- #[account]：プログラム固有のカスタムアカウント型を作成するために構造体に適用されます
**この例を実装するには、以下のコンポーネントが必要です：**
- **Asset**
- **Collection**（オプションですが、この例では関連性があります）
- **FreezeDelegate Plugin**
- **Attribute Plugin**

### Freeze Delegate Plugin

**Freeze Delegate Plugin**は**所有者管理Plugin**であり、Assetに適用するには所有者の署名が必要です。
このPluginは**delegateがAssetをフリーズおよび解凍し、転送を防止することを可能にします**。Asset所有者またはPlugin権限者はいつでもこのPluginを取り消すことができますが、Assetがフリーズされている場合は取り消し前に解凍する必要があります。
**このPluginの使用は軽量です**。Assetのフリーズ/解凍はPluginデータのブール値を変更するだけで済みます（唯一の引数はFrozen: boolです）。
_詳細は[こちら](/ja/smart-contracts/core/plugins/freeze-delegate)をご覧ください_

### Attribute Plugin

**Attribute Plugin**は**権限者管理Plugin**であり、Assetに適用するには権限者の署名が必要です。Collectionに含まれるAssetの場合、Assetの権限者フィールドはCollectionアドレスによって占有されているため、Collection権限者が権限者として機能します。
このPluginは**Asset上に直接データを保存し、オンチェーンの属性やトレイトとして機能します**。これらのトレイトはmpl-token-metadataプログラムのようにオフチェーンに保存されるのではなく、オンチェーンプログラムから直接アクセスできます。
**このPluginはAttributeListフィールドを受け入れます**。これはキーと値のペアの配列で構成され、両方とも文字列です。
_詳細は[こちら](/ja/smart-contracts/core/plugins/attribute)をご覧ください_

### スマートコントラクトのロジック

簡潔にするため、この例ではステーキングプログラムが意図通りに動作するために必要な**stake**と**unstake**関数の2つの命令のみを含んでいます。蓄積されたポイントを利用する**spendPoint**命令などの追加命令も追加できますが、これは読者の実装に委ねます。
_StakeとUnstake関数の両方は、前述のPluginを異なる方法で利用します_。
命令の詳細に入る前に、使用する属性である`staked`と`staked_time`キーについて説明しましょう。`staked`キーはAssetがステーキングされているかどうか、およびステーキングされた場合はいつステーキングされたかを示します（unstaked = 0、staked = ステーキング時刻）。`staked_time`キーはAssetの合計ステーキング期間を追跡し、Assetがアンステーキングされた後にのみ更新されます。
**命令**：

- **Stake**：この命令はFreeze Delegate Pluginを適用し、フラグをtrueに設定してAssetをフリーズします。さらに、Attribute Pluginの`staked`キーを0から現在時刻に更新します。
- **Unstake**：この命令はFreeze Delegate Pluginのフラグを変更し、悪意のあるエンティティがAssetを制御して解凍のための身代金を要求することを防ぐためにPluginを取り消します。また、`staked`キーを0に更新し、`staked_time`を現在時刻からステーキングタイムスタンプを引いた値に設定します。

## スマートコントラクトの構築：ステップバイステップガイド

スマートコントラクトの背後にあるロジックを理解したので、**コードに飛び込んですべてをまとめる時です**！

### 依存関係とインポート

スマートコントラクトを書く前に、スマートコントラクトが動作するために必要なcrateとそれらの関数を見てみましょう！
この例では、主に[anchor](/ja/smart-contracts/core/using-core-in-anchor)機能を有効にしたmpl_core crateを使用します：

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

そのcrateからの異なる関数は以下の通りです：

```rust
use mpl_core::{
    ID as CORE_PROGRAM_ID,
    fetch_plugin,
    accounts::{BaseAssetV1, BaseCollectionV1},
    instructions::{AddPluginV1CpiBuilder, RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder},
    types::{Attribute, Attributes, FreezeDelegate, Plugin, PluginAuthority, PluginType, UpdateAuthority},
};
```

### Anchorの概要

このガイドではAnchorフレームワークを使用しますが、ネイティブプログラムを使用して実装することもできます。Anchorフレームワークの詳細はこちら：[Anchor Framework](https://book.anchor-lang.com/introduction/what_is_anchor.html)。
簡潔さとこの演習のために、通常の分離ではなく、アカウントと命令をすべてlib.rsに含むモノファイルアプローチを使用します。
**注意**：Solana Playgroundでこの例を開いてフォローすることができます。Solana PlaygroundはSolanaプログラムを構築およびデプロイするためのオンラインツールです：Solana Playground。
すべての命令のアカウント構造体では、SignerとPayerを分離します。これは標準的な手順であり、PDAはアカウント作成の支払いができないため、ユーザーがPDAを命令の権限者にしたい場合、2つの異なるフィールドが必要になるからです。この分離は私たちの命令では厳密には必要ありませんが、良い慣行とされています。

### アカウント構造体

この例では、mpl-core crateのanchorフラグを使用して、アカウント構造体からAssetとCollectionアカウントを直接デシリアライズし、いくつかの制約を設定します。
_詳細は[こちら](/ja/smart-contracts/core/using-core-in-anchor)をご覧ください_
`stake`と`unstake`命令の両方で同じアカウントと同じ制約を使用するため、単一のアカウント構造体`Stake`を使用します。

```rust
#[derive(Accounts)]
pub struct Stake<'info> {
    pub owner: Signer<'info>,
    pub update_authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        has_one = owner,
        constraint = asset.update_authority == UpdateAuthority::Collection(collection.key()),
    )]
    pub asset: Account<'info, BaseAssetV1>,
    #[account(
        mut,
        has_one = update_authority,
    )]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: this will be checked by core
    pub core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

制約として以下を確認しました：

- Assetの`owner`がアカウント構造体の`owner`と同じであること。
- Assetの`update_authority`がCollectionであり、そのCollectionのアドレスがアカウント構造体の`collection`と同じであること。
- Collectionの`update_authority`がアカウント構造体の`update_authority`と同じであること。これがAssetに対する`update_authority`になります。
- `core_program`が`mpl_core` crateに存在する`ID`（`CORE_PROGRAM_ID`にリネーム）と同じであること。

### ステーキング命令

まず、mpl-core crateの`fetch_plugin`関数を使用して、Assetのattribute pluginに関する情報を取得します。

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(
    &ctx.accounts.asset.to_account_info(),
    mpl_core::types::PluginType::Attributes
)
```

1. **Attribute Pluginのチェック**
`fetch_plugin`関数には2つの異なるレスポンスがあります：

- Assetにattribute pluginが関連付けられている場合は`(_, fetched_attribute_list, _)`
- Assetにattribute pluginが関連付けられていない場合は`Err`
そのため、Pluginからのレスポンスに対応するために`match`を使用しました。
Assetにattribute pluginがない場合は、それを追加し、`staked`と`stakedTime`キーで埋める必要があります。

```rust
Err(_) => {
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(
        Attributes{
            attribute_list: vec![
                Attribute {
                    key: "staked".to_string(),
                    value: Clock::get()?.unix_timestamp.to_string()
                },
                Attribute {
                    key: "staked_time".to_string(),
                    value: 0.to_string()
                },
            ]
        }
    ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
}
```
1. **ステーキング属性のチェック**：
Assetにすでにattribute pluginがある場合は、ステーキング命令に必要なステーキング属性が含まれていることを確認します。
含まれている場合は、Assetがすでにステーキングされているかどうかをチェックし、`staked`キーを文字列として現在のタイムスタンプで更新します：

```rust
Ok((_, fetched_attribute_list, _)) => {
    // If yes, check if the asset is already staked, and if the staking attribute are already initialized
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;
    for attribute in fetched_attribute_list.attribute_list {
        if attribute.key == "staked" {
            require!(attribute.value == "0", StakingError::AlreadyStaked);
            attribute_list.push(Attribute {
                key: "staked".to_string(),
                value: Clock::get()?.unix_timestamp.to_string()
            });
            is_initialized = true;
        } else {
            attribute_list.push(attribute);
        }
    }
```

含まれていない場合は、既存の属性リストに追加します。

```rust
if !is_initialized {
    attribute_list.push(Attribute {
        key: "staked".to_string(),
        value: Clock::get()?.unix_timestamp.to_string()
    });
    attribute_list.push(Attribute {
        key: "staked_time".to_string(),
        value: 0.to_string()
    });
}
```
1. **Attribute Pluginの更新**：
新規または変更された属性でattribute pluginを更新します。

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(Attributes{ attribute_list }))
    .invoke()?;
}
```
1. **Assetのフリーズ**
Assetにすでにattribute pluginがあったかどうかに関係なく、取引できないようにAssetをフリーズします。

```rust
AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.owner.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
.init_authority(PluginAuthority::UpdateAuthority)
.invoke()?;
```

**完全な命令はこちらです**：

```rust
pub fn stake(ctx: Context<Stake>) -> Result<()> {
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            // If yes, check if the asset is already staked, and if the staking attribute are already initialized
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;
            for attribute in fetched_attribute_list.attribute_list {
                if attribute.key == "staked" {
                    require!(attribute.value == "0", StakingError::AlreadyStaked);
                    attribute_list.push(Attribute {
                        key: "staked".to_string(),
                        value: Clock::get()?.unix_timestamp.to_string()
                    });
                    is_initialized = true;
                } else {
                    attribute_list.push(attribute);
                }
            }
            if !is_initialized {
                attribute_list.push(Attribute {
                    key: "staked".to_string(),
                    value: Clock::get()?.unix_timestamp.to_string()
                });
                attribute_list.push(Attribute {
                    key: "staked_time".to_string(),
                    value: 0.to_string()
                });
            }
            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;
        }
        Err(_) => {
            // If not, add the attribute plugin to the asset
            AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(
                Attributes{
                    attribute_list: vec![
                        Attribute {
                            key: "staked".to_string(),
                            value: Clock::get()?.unix_timestamp.to_string()
                        },
                        Attribute {
                            key: "staked_time".to_string(),
                            value: 0.to_string()
                        },
                    ]
                }
            ))
            .init_authority(PluginAuthority::UpdateAuthority)
            .invoke()?;
        }
    }
    // Freeze the asset
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.owner.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
    Ok(())
}
```

### アンステーキング命令

アンステーキング命令は、ステーキング命令の後にのみ呼び出すことができるため、さらにシンプルになります。多くのチェックはステーキング命令自体によって本質的にカバーされています。
まず、mpl-core crateの`fetch_plugin`関数を使用して、Assetのattribute pluginに関する情報を取得します。

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)
```

ただし、今回はAttribute pluginが見つからない場合はハードエラーをスローします。

```rust
Err(_) => {
    return Err(StakingError::AttributesNotInitialized.into());
}
```

1. **attribute pluginのすべてのチェックを実行**
Assetがすでにステーキング命令を通過したかどうかを確認するために、**命令はattribute pluginで以下をチェックします**：

- **AssetにStakedキーがあるか？**
- **Assetは現在ステーキングされているか？**
これらのチェックのいずれかが欠けている場合、Assetはステーキング命令を通過していません。

```rust
for attribute in fetched_attribute_list.attribute_list.iter() {
    if attribute.key == "staked" {
        require!(attribute.value != "0", StakingError::NotStaked);
        [...]
        is_initialized = true;
    } else {
        [...]
    }
}
[...]
require!(is_initialized, StakingError::StakingNotInitialized);
```

Assetにステーキング属性があり、現在ステーキングされていることを確認したら、ステーキング属性を以下のように更新します：

- `Staked`フィールドをゼロに設定
- `stakedTime`を`stakedTime` + (currentTimestamp - stakedTimestamp)に更新

```rust
Ok((_, fetched_attribute_list, _)) => {
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;
    let mut staked_time: i64 = 0;
    for attribute in fetched_attribute_list.attribute_list.iter() {
        if attribute.key == "staked" {
            require!(attribute.value != "0", StakingError::NotStaked);
            attribute_list.push(Attribute {
                key: "staked".to_string(),
                value: 0.to_string()
            });
            staked_time = staked_time
                .checked_add(Clock::get()?.unix_timestamp
                .checked_sub(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Underflow)?)
                .ok_or(StakingError::Overflow)?;
            is_initialized = true;
        } else if attribute.key == "staked_time" {
            staked_time = staked_time
                .checked_add(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Overflow)?;
        } else {
            attribute_list.push(attribute.clone());
        }
    }
    attribute_list.push(Attribute {
        key: "staked_time".to_string(),
        value: staked_time.to_string()
    });
    require!(is_initialized, StakingError::StakingNotInitialized);
```
1. **Attribute Pluginの更新**
新規または変更された属性でattribute pluginを更新します。

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::Attributes(Attributes{ attribute_list }))
.invoke()?;
```
1. **FreezeDelegate Pluginの解凍と削除**
命令の最後で、Assetを解凍し、FreezeDelegate Pluginを削除して、Assetが「自由」になり`update_authority`によって制御されないようにします。

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
.invoke()?;
RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer)
.authority(Some(&ctx.accounts.owner))
.system_program(&ctx.accounts.system_program)
.plugin_type(PluginType::FreezeDelegate)
.invoke()?;
```

**完全な命令はこちらです**：

```rust
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;
            let mut staked_time: i64 = 0;
            for attribute in fetched_attribute_list.attribute_list.iter() {
                if attribute.key == "staked" {
                    require!(attribute.value != "0", StakingError::NotStaked);
                    attribute_list.push(Attribute {
                        key: "staked".to_string(),
                        value: 0.to_string()
                    });
                    staked_time = staked_time
                        .checked_add(Clock::get()?.unix_timestamp
                        .checked_sub(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Underflow)?)
                        .ok_or(StakingError::Overflow)?;
                    is_initialized = true;
                } else if attribute.key == "staked_time" {
                    staked_time = staked_time
                        .checked_add(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Overflow)?;
                } else {
                    attribute_list.push(attribute.clone());
                }
            }
            attribute_list.push(Attribute {
                key: "staked_time".to_string(),
                value: staked_time.to_string()
            });
            require!(is_initialized, StakingError::StakingNotInitialized);
            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;
        }
        Err(_) => {
            return Err(StakingError::AttributesNotInitialized.into());
        }
    }
    // Thaw the asset
    UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
    .invoke()?;
    // Remove the FreezeDelegate Plugin
    RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer)
    .authority(Some(&ctx.accounts.owner))
    .system_program(&ctx.accounts.system_program)
    .plugin_type(PluginType::FreezeDelegate)
    .invoke()?;

    Ok(())
}
```

## まとめ

おめでとうございます！これでNFTコレクション向けのステーキングソリューションを作成する準備が整いました！CoreとMetaplexについてさらに学びたい場合は、[開発者ハブ](/ja/smart-contracts/core/getting-started)をご覧ください。
