---
title: Freeze Execute
metaTitle: Freeze Executeプラグイン | Core
description: MPL Core Asset Freeze Executeプラグインについて学びます。'Freeze Execute'プラグインは、Executeライフサイクルイベントをフリーズし、アセットが任意の命令を実行することを防ぎます。
updated: '01-31-2026'
keywords:
  - freeze execute
  - block execute
  - backed NFT
  - escrowless staking
about:
  - Execute freezing
  - Asset execution
  - Backed NFTs
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---
## 概要

Freeze Executeプラグインは、Assetの Executeライフサイクルイベントをフリーズできる`Owner Managed`プラグインです。フリーズされると、AssetはそのAsset Signer PDAを通じて任意の命令を実行できなくなり、フリーズが解除されるまですべてのexecute操作を効果的にブロックします。
{% callout type="warning" %}
**重要**: これはOwner Managedプラグインであるため、Assetが新しいオーナーに転送された後、authorityは保持されません。新しいオーナーが以前のauthorityにプラグインの`freeze`ステータスを変更できるようにしたい場合は、authorityを再追加する必要があります。
{% /callout %}
Freeze Executeプラグインは、以下のようなシナリオで特に有用です：

- **Backed NFT**: 基礎資産（SOL、トークン）の所有権を表すNFTをロックし、不正な引き出しを防止
- **エスクローレスアセット管理**: 所有権を移転せずに金融操作に関与している間アセットをフリーズ
- **ステーキングプロトコル**: 所有権を維持しながらステーキング期間中のアセット実行を防止
- **スマートコントラクトセキュリティ**: 複雑な操作を実行できるアセットに保護レイヤーを追加
- **ガバナンス制御**: ガバナンスや投票に関与するアセットにフリーズメカニズムを実装
- **アセットレンタル**: レンタル中のアセットの実行を防止
- **担保管理**: DeFiプロトコルで担保として使用されるアセットをロック

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

| 引数    | 値 |
| ------ | ----- |
| frozen | bool  |

## 関数

### AssetへのFreeze Executeプラグインの追加

`addPlugin`コマンドは、AssetにFreeze Executeプラグインを追加します。このプラグインにより、AssetのExecute機能をフリーズし、任意の命令の実行を防ぐことができます。
{% dialect-switcher title="MPL Core AssetへのFreeze Executeプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, mplCore } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
;(async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
  const assetAddress = publicKey('11111111111111111111111111111111')
  await addPlugin(umi, {
    asset: assetAddress,
    plugin: { type: 'FreezeExecute', data: { frozen: false } },
  }).sendAndConfirm(umi)
})()
```

{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}

```rust
AddPluginV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin(Plugin::FreezeExecute(FreezeExecute { frozen: false }))
    .invoke();
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeExecute, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_freeze_execute_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_freeze_execute_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeExecute(FreezeExecute {frozen: false}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_freeze_execute_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_freeze_execute_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_freeze_execute_plugin_ix_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Freeze Executeプラグインを持つAssetの作成

Asset作成時にFreeze Executeプラグインを追加することもできます：
{% dialect-switcher title="Freeze Executeプラグインを持つAssetの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, mplCore } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
;(async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
  const assetSigner = generateSigner(umi)
  const delegateAddress = generateSigner(umi)
  await create(umi, {
    asset: assetSigner,
    name: 'My Asset',
    uri: 'https://example.com/my-asset.json',
    plugins: [
      {
        type: 'FreezeExecute',
        data: { frozen: false },
        authority: { type: 'Address', address: delegateAddress.publicKey },
      },
    ],
  }).sendAndConfirm(umi)
})()
```

{% /dialect %}
{% /dialect-switcher %}

### Freeze Executeプラグインを持つCollectionの作成

Freeze ExecuteプラグインはCollectionにも適用できます：
{% dialect-switcher title="Freeze Executeプラグインを持つCollectionの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection, mplCore } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
;(async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
  const collectionSigner = generateSigner(umi)
  await createCollection(umi, {
    collection: collectionSigner,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
    plugins: [{ type: 'FreezeExecute', frozen: false }],
  }).sendAndConfirm(umi)
})()
```

{% /dialect %}
{% /dialect-switcher %}

### Execute操作のフリーズ

`updatePlugin`コマンドを使用して、AssetのExecute機能をフリーズし、フリーズ解除されるまで任意の命令の実行を防ぐことができます。
{% dialect-switcher title="MPL Core AssetのExecute操作のフリーズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi, publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, mplCore } from '@metaplex-foundation/mpl-core'
;(async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
  const assetAddress = publicKey('11111111111111111111111111111111')
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: { type: 'FreezeExecute', data: { frozen: true } },
  }).sendAndConfirm(umi)
})()
```

{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // FreezeExecuteプラグインを`frozen: true`に設定
    .plugin(Plugin::FreezeExecute(FreezeExecute { frozen: true }))
    .invoke()?;
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeExecute, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn freeze_execute_operations() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let freeze_execute_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Assetがコレクションの一部である場合はCollectionを渡す
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeExecuteプラグインを`frozen: true`に設定
        .plugin(Plugin::FreezeExecute(FreezeExecute { frozen: true }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let freeze_execute_plugin_tx = Transaction::new_signed_with_payer(
        &[freeze_execute_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&freeze_execute_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

### Execute操作のフリーズ解除

`updatePlugin`コマンドを使用して、AssetのExecute機能のフリーズを解除し、任意の命令を実行する能力を復元することもできます。
{% dialect-switcher title="MPL Core AssetのExecute操作のフリーズ解除" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi, publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, mplCore } from '@metaplex-foundation/mpl-core'
;(async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
  const assetAddress = publicKey('11111111111111111111111111111111')
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: { type: 'FreezeExecute', data: { frozen: false } },
  }).sendAndConfirm(umi)
})()
```

{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // FreezeExecuteプラグインを`frozen: false`に設定
    .plugin(Plugin::FreezeExecute(FreezeExecute { frozen: false }))
    .invoke()?;
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeExecute, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn unfreeze_execute_operations() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let unfreeze_execute_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Assetがコレクションの一部である場合はCollectionを渡す
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeExecuteプラグインを`frozen: false`に設定
        .plugin(Plugin::FreezeExecute(FreezeExecute { frozen: false }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let unfreeze_execute_plugin_tx = Transaction::new_signed_with_payer(
        &[unfreeze_execute_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&unfreeze_execute_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

## プラグインAuthority

Freeze Executeプラグインは、execute操作のフリーズ/フリーズ解除を制御できる人を決定するために、さまざまなauthorityタイプをサポートしています：

- **Owner Authority**（デフォルト）: アセットオーナーのみがフリーズ/フリーズ解除可能
- **Delegate Authority**: 特定のアドレスにフリーズを制御する権限をデリゲート可能
- **Update Authority**: アセットのupdate authorityがフリーズを制御可能（ただし明示的にデリゲートされた場合のみ）
{% dialect-switcher title="プラグインAuthorityの設定" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from "@metaplex-foundation/umi";
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
(async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplCore());
  const assetSigner = generateSigner(umi);
  const delegateAddress = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    name: "My Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: "FreezeExecute",
        data: { frozen: false },
        authority: { type: "Address", address: delegateAddress.publicKey },
      },
    ],
  }).sendAndConfirm(umi);
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 重要な注意事項

- `frozen`フィールドが`true`に設定されると、すべてのexecute操作がブロックされます
- **デフォルトauthority**: アセットオーナーがデフォルトでプラグインを制御します
- **Authorityデリゲーション**: 現在のauthorityのみがexecute機能をフリーズ/フリーズ解除できます
- **Authority制約**: authorityが他の人にデリゲートされている場合、元のオーナーはauthorityが取り消されるまでフリーズを解除できません
- フリーズ中はプラグインを削除できません
- フリーズ中はauthorityを再割り当てできません
- プラグインは[Execute命令](/smart-contracts/core/execute-asset-signing)システムと連携します

## ユースケース例: Backed NFT

Freeze Executeプラグインの一般的なユースケースは、NFTが基礎資産（SOLやトークンなど）の所有権を表し、execute命令を通じて引き出し可能な「backed NFT」を作成することです。プラグインにより、これらのexecute操作を一時的にフリーズできます。
{% dialect-switcher title="Backed NFTの例" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  generateSigner,
  publicKey,
  sol,
  createNoopSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import {
  create,
  execute,
  findAssetSignerPda,
  updatePlugin,
  fetchAsset,
  mplCore,
} from "@metaplex-foundation/mpl-core";
import { transferSol } from "@metaplex-foundation/mpl-toolbox";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
(async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplCore());
  // 代わりにあなたのウォレットを使用
  const wallet = generateSigner(umi);
  umi.use(keypairIdentity(wallet));
  // 1. フリーズされたexecute機能を持つアセットを作成
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    name: "Backed NFT",
    uri: "https://example.com/backed-nft.json",
    plugins: [{ type: "FreezeExecute", frozen: true }],
  }).sendAndConfirm(umi);
  // 2. Asset Signer PDAを見つける
  const [assetSignerPda] = findAssetSignerPda(umi, {
    asset: assetSigner.publicKey,
  });
  // 3. NFTを「裏付ける」ためにSOLを入金
  await transferSol(umi, {
    source: umi.identity,
    destination: publicKey(assetSignerPda),
    amount: sol(0.01), // 0.01 SOLの裏付け
  }).sendAndConfirm(umi);
  // 4. フリーズ中はexecute操作がブロックされる
  // このトランザクションは失敗します：
  try {
    await execute(umi, {
      asset: await fetchAsset(umi, assetSigner.publicKey),
      instructions: transferSol(umi, {
        source: createNoopSigner(publicKey(assetSignerPda)),
        destination: generateSigner(umi).publicKey,
        amount: sol(0.001),
      }),
    }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  } catch (e) {
    console.log("予想通りexecuteが失敗", e);
  }
  // 5. 引き出しを許可するためにフリーズ解除
  await updatePlugin(umi, {
    asset: assetSigner.publicKey,
    plugin: { type: "FreezeExecute", data: { frozen: false } },
  }).sendAndConfirm(umi);
  // 6. これでexecute操作が許可される
  const recipient = generateSigner(umi);
  await execute(umi, {
    asset: await fetchAsset(umi, assetSigner.publicKey),
    instructions: transferSol(umi, {
      source: createNoopSigner(publicKey(assetSignerPda)),
      destination: recipient.publicKey,
      amount: sol(0.001),
    }),
  }).sendAndConfirm(umi);
})();
```

{% /dialect %}
{% /dialect-switcher %}
