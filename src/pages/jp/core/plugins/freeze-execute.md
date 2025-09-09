---
title: Freeze Execute
metaTitle: Freeze Executeプラグイン | Core
description: MPL CoreのFreeze Executeプラグインについて学びます。'Freeze Execute'プラグインはExecuteライフサイクルイベントを凍結し、アセットが任意の命令を実行することを防ぎます。
---

## 概要

Freeze Executeプラグインは「オーナー管理型（Owner Managed）」で、アセット上のExecuteライフサイクルイベントを凍結できます。凍結中は、アセット署名者PDAを通じた任意の命令実行ができなくなり、凍結解除されるまで一切のexecute操作がブロックされます。

{% callout type="warning" %}
重要: 本プラグインはオーナー管理型のため、アセットが新しいオーナーへ移転されると、以前の権限設定は維持されません。以前と同じ権限者に`freeze`状態の変更を許可したい場合は、新しいオーナーが再度権限設定を行う必要があります。
{% /callout %}

有用なシナリオの例:

- バックドNFT: 基礎資産（SOLやトークン）の不正な引き出しを防ぐためにロック
- エスクロー不要の資産管理: 所有権を移さずに金融処理中は実行機能を凍結
- ステーキングプロトコル: ステーキング期間中は実行を防止
- スマートコントラクトの安全性: 複雑な操作を実行可能なアセットに保護層を追加
- ガバナンス制御: 投票等に関与するアセットの凍結メカニズムを実装
- レンタル: レンタル期間中の実行を防止
- 担保管理: DeFiの担保として使用中は実行をロック

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## 関数

### アセットへFreeze Executeを追加

`addPlugin`で、アセットのExecute機能を凍結可能にするFreeze Executeプラグインを追加します。

{% dialect-switcher title="MPL CoreアセットへFreeze Executeプラグインを追加" %}
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

### Freeze Execute付きでアセット作成

作成時にFreeze Executeプラグインを追加することもできます。

{% dialect-switcher title="Freeze Executeプラグイン付きでアセット作成" %}
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

### Freeze Execute付きでコレクション作成

Freeze Executeプラグインはコレクションにも適用できます。

{% dialect-switcher title="Freeze Executeプラグイン付きでコレクション作成" %}
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

### Execute操作を凍結

`updatePlugin`で、アセットのExecute機能を凍結できます。

{% dialect-switcher title="MPL CoreアセットのExecute操作を凍結" %}
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
    // Set the FreezeExecute plugin to `frozen: true`
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
        // アセットがコレクションの一部ならコレクションを渡す
        .collection(Some(collection))
        .payer(authority.pubkey())
        // `frozen: true`に設定
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

### Execute操作の凍結解除

`updatePlugin`で、凍結したExecute機能を解除できます。

{% dialect-switcher title="MPL CoreアセットのExecute操作を解凍" %}
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
    // Set the FreezeExecute plugin to `frozen: false`
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
        // アセットがコレクションの一部ならコレクションを渡す
        .collection(Some(collection))
        .payer(authority.pubkey())
        // `frozen: false`に設定
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

## プラグイン権限

Freeze Executeプラグインで凍結/解凍を制御できる権限タイプ:

- **Owner権限（既定）**: アセットのオーナーのみが操作可能
- **Delegate権限**: 特定アドレスを委任して凍結操作を許可
- **UpdateAuthority**: 明示的に委任された場合のみアップデート権限で操作可能

{% dialect-switcher title="プラグイン権限の設定" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, mplCore } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

(async () => {
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

## 注意事項

- `frozen: true`の間は、すべてのexecute操作がブロックされます
- 既定の権限はオーナーです
- 凍結/解凍は現在の権限者のみが可能です
- 権限を他者に委任中は、元のオーナーは権限が戻るまで解凍できません
- 凍結中はプラグインを削除できません
- 凍結中は権限の再割り当てはできません
- このプラグインは[Execute命令](/core/execute-asset-signing)と連携します

## ユースケース例: バックドNFT

Freeze Executeプラグインは、NFTが基礎資産（SOLやトークン）を保有し、execute命令で引き出せる「バックドNFT」でよく使われます。一時的にexecute操作を凍結できます。

{% dialect-switcher title="Backed NFTの例" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey, sol, createNoopSigner, keypairIdentity } from '@metaplex-foundation/umi'
import { create, execute, findAssetSignerPda, updatePlugin, fetchAsset, mplCore } from '@metaplex-foundation/mpl-core'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

(async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

  // 実運用では自分のウォレットを使う
  const wallet = generateSigner(umi)
  umi.use(keypairIdentity(wallet))

  // 1. 実行機能を凍結したアセットを作成
  const assetSigner = generateSigner(umi)

  await create(umi, {
    asset: assetSigner,
    name: 'Backed NFT',
    uri: 'https://example.com/backed-nft.json',
    plugins: [{ type: 'FreezeExecute', frozen: true }],
  }).sendAndConfirm(umi)

  // 2. アセット署名者PDAを取得
  const [assetSignerPda] = findAssetSignerPda(umi, { asset: assetSigner.publicKey })

  // 3. NFTを"裏付け"るためにSOLを預け入れ
  await transferSol(umi, {
    source: umi.identity,
    destination: publicKey(assetSignerPda),
    amount: sol(0.01),
  }).sendAndConfirm(umi)

  // 4. 引き出し前に凍結解除
  await updatePlugin(umi, {
    asset: assetSigner.publicKey,
    plugin: { type: 'FreezeExecute', data: { frozen: false } },
  }).sendAndConfirm(umi)

  // 5. アセット署名者からの送金（例）
  const destination = generateSigner(umi).publicKey
  const transferIx = transferSol(umi, {
    source: createNoopSigner(publicKey(assetSignerPda)),
    destination,
    amount: sol(0.005),
  })

  await execute(umi, {
    asset: await fetchAsset(umi, assetSigner.publicKey),
    instructions: transferIx,
  }).sendAndConfirm(umi)
})()
```

{% /dialect %}
{% /dialect-switcher %}

