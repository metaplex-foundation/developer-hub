---
title: 技術的説明
metaTitle: 技術的説明 | Fixed Price Sale
description: Fixed Price Saleプログラムの技術的説明
---

## クリエーターが何かを販売するには：

1. ストアを作成

    - マーケットを何らかの方法でフィルタリングする必要があるため、これは必要です

    - 名前、管理者キー、説明が含まれます

2. 販売リソースを初期化します。作成されたものか、プラットフォームが作成します。

    - ユーザーが販売リソースを初期化すると、販売できるリソースを持つオブジェクトができます

3. マーケットを作成

    - 販売するアイテムに関する情報を含むオブジェクトを作成します。販売リソースで定義した最大供給量以外のすべて

## ユーザーがトークンを購入するには：

1. ストアに移動します。

2. トークンを選択して「購入」をクリック

    - 内部的に次のことが起こります：

        - TradeHistoryアカウントが作成され、このユーザーがすでに購入したトークンの数を追跡します

        - デビットとクレジット操作

        - 新しいNFTが作成されます（ミントの作成、トークンのミント、メタデータの作成、MasterEditionの作成）

3. トークンがウォレットに表示されます

## Store

| フィールド      | タイプ |説明|
| ----------- | ----------- | ------ |
| admin      | `Pubkey`       | 特定のストアで販売リソースとマーケットを作成できる管理者キー       |
|  name  |  `String`  |   |
|  description  |  `String`  |   |

## Selling resource

| フィールド      | タイプ |説明|
| ----------- | ----------- | ------ |
|  store  |  `Pubkey`  |    |
|  owner  |  `Pubkey`  |  リソースの所有者。このアカウントは、販売が終了したらリソースを取り戻すことができます  |
|  resource  |  `Pubkey`  |  メタデータが添付されているミントアカウント。ミントキーがわかればPDAを計算できるため、メタデータキーを保存する必要はありません  |
|  vault  |  `Pubkey`  |  MasterEditionを保持するトークンアカウント  |
|  vault_owner  |  `Pubkey`  |  シードが["mt_vault", resource.key(), store.key()]のPDA  |
|  supply  |  `u64`  |  すでに販売されたトークンの量  |
|  max_supply  |  `Option<u64>`  |  販売できるトークンの最大量  |
|  state  |  `Enum{Uninitialised, Created, InUse, Exhausted, Stoped,}`  |  リソースの状態  |

## Market

| フィールド      | タイプ |説明|
| ----------- | ----------- | ------ |
|  store  |  `Pubkey`  |    |
|  selling_resource  |  `Pubkey`  |    |
|  treasury_mint  |  `Pubkey`  |  マーケットが支払いとして受け入れるトークンのミントアカウント  |
|  treasury_holder  |  `Pubkey`  |  購入者がトークンを送信するトークンアカウント。マーケット所有者のみがアセットを引き出すことができます  |
|  treasury_owner  |  `Pubkey`  |  PDA["holder", treasury_mint.key(), selling_resource.key()]  |
|  owner  |  `Pubkey`  |  マーケット所有者  |
|  name  |  `String`  |    |
|  description  |  `String`  |    |
|  mutable  |  `bool`  |    |
|  price  |  `u64`  |    |
|  pieces_in_one_wallet  |  `Option<u64>`  |  1つのウォレットに販売できるトークンの数  |
|  start_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  state  |  `Enum {Uninitialised, Created, Active, Ended,}`  |    |
|  funds_collected  |  `u64`  |    |

## TradeHistory

### PDA ["history", wallet.key(), market.key()]

| フィールド      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  `Pubkey`  |    |
|  wallet  |  `Pubkey`  |    |
|  already_bought  |  `u64`  |  ユーザーが特定のマーケットからすでに購入したトークンの数  |

## PrimaryMetadataCreators

### PDA ["primary_creators", metadata.key()]

| フィールド      | タイプ |説明|
| ----------- | ----------- | ------ |
|  creators  |  `Vec<mpl_token_metadata::state::Creator>`  |  プライマリセールスロイヤリティを受け取るクリエーターのリスト  |

## CreateStore

新しいStoreアカウントを作成します。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signer, Writable  |    |
|  store  |  Key, Signer, Writable  |  初期化されていないアカウント  |
|  name  |  `String`  |    |
|  description  |  `String`  |    |

## InitSellingResource

マーケットで使用されるSellingResourceアカウントを初期化します。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  store  |  Key  |    |
|  store_admin  |  Key, Signer, Writable  |  resource_tokenを保持し、selling_resourceアカウント作成の支払いを行います  |
|  selling_resource  |  Key, Signer, Writable  |  初期化されていないアカウント  |
|  selling_resource_owner  |  Key  |  販売が終了したらMasterEditionを引き出すことができるキー  |
|  resource_mint  |  Key  |  メタデータが添付されているミントアカウント  |
|  master_edition  |  Key  |  シードが["metadata", tokenMetadataProgramID, resource_mint, "edition"]のPDA  |
|  metadata  |  Key  |  マスターエディションのメタデータ  |
|  vault  |  Key, Writable  |  リソースを保持するトークンアカウント  |
|  vault_owner  |  PDA ["mt_vault", resource_mint.key(), store.key()]  |  vaultトークンアカウントの所有者  |
|  resource_token  |  Key, Writable  |  resource_mintからのトークンを保持するユーザーのトークンアカウント  |
|  max_supply  |  `Option<u64>`  |  販売するトークンの最大量  |

## CreateMarket

Marketアカウントを初期化します。状態をCreatedに設定します。これは、所有者がアクティブ化される前にデータを変更できることを意味します。もちろん、Marketがmutableとマークされている場合。

:::warning

ユーザーが`treasury_mint`としてネイティブSOLでアートを販売したい場合、`11111111111111111111111111111111`を設定する必要があります。また、treasury_holderとtreasury_ownerは同じアカウントPDAである必要があります。これはセキュリティ上の理由から必要であり、プログラムのみがそのSOLを使用できるようにするためです。

:::

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key, Signer, Writable  |  初期化されていないアカウント  |
|  store  |  Key  |    |
|  selling_resource_owner  |  Key, Signer, Writable  |    |
|  selling_resource  |  Key, Writable  |    |
|  treasury_mint  |  Key  |  支払いとして受け取るアセットのミント  |
|  treasury_holder  |  Key  |  トークンアカウント  |
|  treasury_owner  |  PDA ["holder", treasury_mint.key(), selling_resource.key()]  |    |
|  name  |  `String`  |    |
|  description  |  `String`  |    |
|  mutable  |  `bool`  |    |
|  price  |  `u64`  |    |
|  pieces_in_one_wallet  |  `Option<u64>`  |    |
|  start_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  gating_config  |  `Option<GatingConfig{collection: Pubkey, expire_on_use: bool, gating_time: Option<u64>}>`  |  ゲーティングトークン。この値が設定されている場合、指定されたコレクションのNFTを持つユーザーのみがマーケットから新しいNFTを購入できます。  |

## ChangeMarket

Market::mutable == trueの場合にのみ利用可能。変更可能：name、description、mutable、price、pieces_in_one_wallet。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  new_name  |  `Option<String>`  |    |
|  new_description  |  `Option<String>`  |    |
|  mutable  |  `Option<bool>`  |    |
|  new_price  |  `Option<u64>`  |    |
|  new_pieces_in_one_wallet  |  `Option<u64>`  |    |

## Buy

現在の日付 > Market::start_dateの場合にのみユーザーが呼び出すことができます。

:::warning

ユーザーがネイティブSOLでアートを購入する場合、user_token_accとuser_walletアカウントは同じである必要があります。

:::

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  selling_resource  |  Key, Writable  |    |
|  user_token_acc  |  Key, Writable  |  メンバートークンの支払いに使用するトークンアカウント。このトークンaccのミントはtreasury_mintと同じである必要があります  |
|  user_wallet  |  Key, Signer, Writable  |    |
|  trade_history  |  Key, Writable  |  ユーザーがすでに購入したNFTの数を追跡するアカウント  |
|  treasury_holder  |  Key, Writable  |    |
|  new_metadata_acc  |  Key, Writable  |    |
|  new_edition_acc  |  Key, Writable  |    |
|  master_edition_acc  |  Key, Writable  |    |
|  new_mint  |  Key, Writable  |    |
|  edition_marker  |  Key, Writable  |  PDA、シードはtoken-metadataプログラムで見つけることができます  |
|  vault  |  Key  |    |
|  vault_owner  |  PDA ["mt_vault", resource.key(), store.key()]  |    |
|  master_edition_metadata  |  Key  |    |
|    |  以下のアカウントはオプションであり、ゲート機能が有効な場合にのみ渡す必要があります ↓  |    |
|  user_collection_token_account  |  Key, Writable  |  コレクションからのユーザーのトークンアカウント  |
|  token_account_mint  |  Key, Writable  |  トークンのミントアカウント  |
|  metadata_account  |  Key  |  上記のミントのメタデータアカウント  |

## SuspendMarket

誰もアイテムを購入できず、マーケット所有者がデータを変更できるようにマーケットを一時停止します。命令は、Market::mutable == trueの場合にのみ利用可能である必要があります。他の場合は、それを一時停止する理由がないためです。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## ResumeMarket

一時停止されたマーケットを再開する命令。マーケットが一時停止状態にある場合にのみ呼び出すことができます。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## CloseMarket

この命令は、マーケットが無制限の期間で作成された場合にのみ呼び出すことができます。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## Withdraw

マーケット所有者が収集された財務資金を引き出すために呼び出します。Market::state == Endedの場合にのみ利用可能。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key  |    |
|  selling_resource  |  Key  |    |
|  metadata  |  Key  |    |
|  treasury_holder  |  Key, Writable  |  Market::treasury_holder。販売中にユーザーから受け取ったすべてのトークンを保持するトークンアカウント  |
|  treasury_mint  |  Key  |    |
|  funder  |  Key  |    |
|  payer  |  Key, Signer  |    |
|  payout_ticket  |  Key, Writable  |  PDA["payout_ticket", market.key(), funder.key()]  |
|  treasury_owner  |  Key  |  PDA["holder", treasury_mint.key(), selling_resource.key()]  |
|  destination  |  Key, Writable  |  トークンを転送するトークンアカウント  |
|    |  以下のアカウントはオプションであり、プライマリセール中にのみ渡す必要があります ↓  |    |
|  primary_metadata_creators_data  |  Key  |  プライマリセールからロイヤリティを受け取るべきクリエーターのリスト  |

## ClaimResource

リソース所有者によって呼び出されます。SellingResource::state == ExhaustedまたはMarket::state == Endedの場合にのみ利用可能。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  market  |  Key  |    |
|  treasury_holder  |  Key  |    |
|  selling_resource  |  Key  |    |
|  selling_resource_owner  |  Key, Signer  |    |
|  source  |  Key, Writable  |  SellingResource::vault。マスターエディションを保持するトークンアカウント  |
|  metadata  |  Key  |  販売されたトークンのメタデータ  |
|  vault_owner  |  Key  |  シードが["mt_vault", resource.key(), store.key()]のPDA  |
|  secondary_metadata_creators  |  Key  |    |
|  destination  |  Key, Writable  |  マスターエディションを転送するトークンアカウント  |

## SavePrimaryMetadataCreators

マーケットが作成される前に呼び出されます。このクリエーターのリストは、ロイヤリティを配分するためにwithdraw命令で使用されます。`primary_sale_happen = true`のマスターエディションからNFTを販売する場合は、この命令を呼び出す必要がないことに注意してください。

| パラメータ      | タイプ |説明|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signer, Writable  |  メタデータの更新権限  |
|  metadata  |  Key, Writable  |    |
|  primary_metadata_creators  |  Key, Writable  |  シードが["primary_creators", metadata.key()]のPDA  |
|  system_program  |  Key  |    |
|  primary_metadata_creators  |  `u8`  |  primary_metadata_creatorsキーのバンプ  |
|  creators  |  `Vec<mpl_token_metadata::state::Creator>`  |  プライマリロイヤリティを受け取るクリエーターのリスト  |
