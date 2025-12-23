---
title: 冻结执行
metaTitle: 冻结执行插件 | Core
description: 了解 MPL Core 资产冻结执行插件。"冻结执行"插件可以冻结执行生命周期事件，防止资产执行任意指令。
---

## 概述

冻结执行插件是一个`所有者管理`插件，允许冻结资产上的执行生命周期事件。当冻结时，资产无法通过其资产签名者 PDA 执行任意指令，有效地阻止任何执行操作直到解冻。

{% callout type="warning" %}
**重要**：由于这是一个所有者管理的插件，权限在资产转移给新所有者后将不会保留。如果新所有者希望之前的权限能够更改插件的 `freeze` 状态，则需要重新添加权限。
{% /callout %}

冻结执行插件特别适用于以下场景：

- **支持型 NFT**：锁定代表底层资产（SOL、代币）所有权的 NFT 以防止未经授权的提款
- **无托管资产管理**：在资产参与金融操作时冻结它们而不转移所有权
- **质押协议**：在质押期间防止资产执行同时保持所有权
- **智能合约安全**：为可以执行复杂操作的资产添加保护层
- **治理控制**：为参与治理或投票的资产实施冻结机制
- **资产租赁**：在资产被租出时防止执行
- **抵押品管理**：锁定在 DeFi 协议中用作抵押品的资产

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

## 参数

| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |

## 函数

### 向资产添加冻结执行插件

`addPlugin` 命令向资产添加冻结执行插件。此插件允许冻结资产的执行功能，防止执行任意指令。

{% dialect-switcher title="向 MPL Core 资产添加冻结执行插件" %}
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

### 创建带有冻结执行插件的资产

您也可以在创建资产时添加冻结执行插件：

{% dialect-switcher title="创建带有冻结执行插件的资产" %}
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

### 创建带有冻结执行插件的集合

冻结执行插件也可以应用于集合：

{% dialect-switcher title="创建带有冻结执行插件的集合" %}
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

### 冻结执行操作

`updatePlugin` 命令可用于冻结资产的执行功能，防止其执行任意指令直到解冻。

{% dialect-switcher title="冻结 MPL Core 资产的执行操作" %}
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
        // 如果资产是集合的一部分，传入集合
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

### 解冻执行操作

`updatePlugin` 命令也可用于解冻资产的执行功能，恢复其执行任意指令的能力。

{% dialect-switcher title="解冻 MPL Core 资产的执行操作" %}
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
        // 如果资产是集合的一部分，传入集合
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

冻结执行插件支持不同的权限类型来控制谁可以冻结/解冻执行操作：

- **所有者权限**（默认）：只有资产所有者可以冻结/解冻
- **委托权限**：可以委托特定地址来控制冻结
- **更新权限**：资产的更新权限可以控制冻结，但仅在明确委托时

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
- **权限委托**：只有当前权限可以冻结/解冻执行功能
- **权限约束**：如果权限委托给其他人，原始所有者在权限被撤销之前无法解冻
- 插件在冻结时无法移除
- 权限在冻结时无法重新分配
- 该插件与[执行指令](/zh/smart-contracts/core/execute-asset-signing)系统配合使用



## 示例用例：支持型 NFT

冻结执行插件的一个常见用例是创建"支持型 NFT"，其中 NFT 代表可以通过执行指令提取的底层资产（如 SOL 或代币）的所有权。该插件允许您临时冻结这些执行操作。

{% dialect-switcher title="支持型 NFT 示例" %}
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

  // 1. 创建带有冻结执行功能的资产
  const assetSigner = generateSigner(umi);

  await create(umi, {
    asset: assetSigner,
    name: "Backed NFT",
    uri: "https://example.com/backed-nft.json",
    plugins: [{ type: "FreezeExecute", frozen: true }],
  }).sendAndConfirm(umi);

  // 2. 查找资产签名者 PDA
  const [assetSignerPda] = findAssetSignerPda(umi, {
    asset: assetSigner.publicKey,
  });

  // 3. 存入 SOL 以"支持" NFT
  await transferSol(umi, {
    source: umi.identity,
    destination: publicKey(assetSignerPda),
    amount: sol(0.01), // 0.01 SOL 支持
  }).sendAndConfirm(umi);

  // 4. 冻结时执行操作被阻止
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
    console.log("execute failed as expected", e);
  }

  // 5. 解冻以允许提款
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
