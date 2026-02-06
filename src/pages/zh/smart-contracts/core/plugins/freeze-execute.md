---
title: Freeze Execute
metaTitle: Freeze Execute 插件 | Core
description: 了解 MPL Core Asset Freeze Execute 插件。'Freeze Execute' 插件可以冻结 Execute 生命周期事件，阻止资产执行任意指令。
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
## 概述

Freeze Execute 插件是一个`所有者管理`的插件，允许冻结 Asset 上的 Execute 生命周期事件。当冻结时，资产无法通过其 Asset Signer PDA 执行任意指令，有效阻止任何执行操作直到解冻。
{% callout type="warning" %}
**重要**：由于这是一个所有者管理的插件，资产转移到新所有者后权限不会保留。如果新所有者希望之前的权限方能够更改插件的 `freeze` 状态，需要重新添加权限。
{% /callout %}
Freeze Execute 插件特别适用于以下场景：

- **担保 NFT**：锁定代表基础资产（SOL、代币）所有权的 NFT，防止未经授权的提取
- **无托管资产管理**：在不转移所有权的情况下冻结参与金融操作的资产
- **质押协议**：在保持所有权的同时防止质押期间的资产执行
- **智能合约安全**：为可执行复杂操作的资产添加保护层
- **治理控制**：为参与治理或投票的资产实施冻结机制
- **资产租赁**：在资产被租出期间防止执行
- **抵押品管理**：锁定在 DeFi 协议中用作抵押品的资产

## 兼容性

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 参数

| 参数   | 值    |
| ------ | ----- |
| frozen | bool  |

## 函数

### 向 Asset 添加 Freeze Execute 插件

`addPlugin` 命令将 Freeze Execute 插件添加到 Asset。此插件允许冻结 Asset 的 Execute 功能，防止执行任意指令。
{% dialect-switcher title="向 MPL Core Asset 添加 Freeze Execute 插件" %}
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

### 创建带有 Freeze Execute 插件的 Asset

您也可以在资产创建时添加 Freeze Execute 插件：
{% dialect-switcher title="创建带有 Freeze Execute 插件的 Asset" %}
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

### 创建带有 Freeze Execute 插件的 Collection

Freeze Execute 插件也可以应用于 Collection：
{% dialect-switcher title="创建带有 Freeze Execute 插件的 Collection" %}
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

### 冻结 Execute 操作

`updatePlugin` 命令可用于冻结 Asset 的 Execute 功能，防止其执行任意指令直到解冻。
{% dialect-switcher title="冻结 MPL Core Asset 的 Execute 操作" %}
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
    // 将 FreezeExecute 插件设置为 `frozen: true`
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
        // 如果 Asset 是 Collection 的一部分，需要传入 Collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // 将 FreezeExecute 插件设置为 `frozen: true`
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

### 解冻 Execute 操作

`updatePlugin` 命令也可用于解冻 Asset 的 Execute 功能，恢复其执行任意指令的能力。
{% dialect-switcher title="解冻 MPL Core Asset 的 Execute 操作" %}
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
    // 将 FreezeExecute 插件设置为 `frozen: false`
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
        // 如果 Asset 是 Collection 的一部分，需要传入 Collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // 将 FreezeExecute 插件设置为 `frozen: false`
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

## 插件权限

Freeze Execute 插件支持不同的权限类型来控制谁可以冻结/解冻执行操作：

- **所有者权限**（默认）：只有资产所有者可以冻结/解冻
- **委托权限**：可以将特定地址委托来控制冻结
- **更新权限**：资产的更新权限可以控制冻结，但仅在明确委托的情况下
{% dialect-switcher title="设置插件权限" %}
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

## 重要说明

- 当 `frozen` 字段设置为 `true` 时，任何执行操作都将被阻止
- **默认权限**：资产所有者默认控制插件
- **权限委托**：只有当前权限方可以冻结/解冻执行功能
- **权限限制**：如果权限已委托给其他人，原所有者在权限撤销之前无法解冻
- 冻结状态下无法移除插件
- 冻结状态下无法重新分配权限
- 此插件与 [Execute 指令](/smart-contracts/core/execute-asset-signing) 系统配合使用

## 使用案例示例：担保 NFT

Freeze Execute 插件的一个常见用例是创建"担保 NFT"，其中 NFT 代表可通过执行指令提取的基础资产（如 SOL 或代币）的所有权。该插件允许您临时冻结这些执行操作。
{% dialect-switcher title="担保 NFT 示例" %}
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
  // 使用您的钱包替代
  const wallet = generateSigner(umi);
  umi.use(keypairIdentity(wallet));
  // 1. 创建具有冻结执行功能的 Asset
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    name: "Backed NFT",
    uri: "https://example.com/backed-nft.json",
    plugins: [{ type: "FreezeExecute", frozen: true }],
  }).sendAndConfirm(umi);
  // 2. 找到 Asset Signer PDA
  const [assetSignerPda] = findAssetSignerPda(umi, {
    asset: assetSigner.publicKey,
  });
  // 3. 存入 SOL 来"担保" NFT
  await transferSol(umi, {
    source: umi.identity,
    destination: publicKey(assetSignerPda),
    amount: sol(0.01), // 0.01 SOL 担保
  }).sendAndConfirm(umi);
  // 4. 冻结期间执行操作被阻止
  // 此交易将失败：
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
    console.log("执行按预期失败", e);
  }
  // 5. 解冻以允许提取
  await updatePlugin(umi, {
    asset: assetSigner.publicKey,
    plugin: { type: "FreezeExecute", data: { frozen: false } },
  }).sendAndConfirm(umi);
  // 6. 现在执行操作被允许
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
