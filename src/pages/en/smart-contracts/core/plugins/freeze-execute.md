---
title: Freeze Execute
metaTitle: Freeze Execute Plugin | Core
description: Learn about the MPL Core Asset Freeze Execute Plugin. The 'Freeze Execute' plugin can freeze the Execute lifecycle event, preventing the asset from executing arbitrary instructions.
---

## Overview

The Freeze Execute Plugin is an `Owner Managed` plugin that allows freezing the Execute lifecycle event on an Asset. When frozen, the asset cannot execute arbitrary instructions through its Asset Signer PDA, effectively blocking any execute operations until unfrozen.

{% callout type="warning" %}
**Important**: Since this is an Owner Managed plugin, the authority will not persist after the asset is transferred to a new owner. The new owner will need to re-add the authority if they want the previous authorities to be able to change the `freeze` status of the plugin.
{% /callout %}

The Freeze Execute Plugin is particularly useful for scenarios such as:

- **Backed NFTs**: Lock NFTs that represent ownership of underlying assets (SOL, tokens) to prevent unauthorized withdrawals
- **Escrowless asset management**: Freeze assets while they're involved in financial operations without transferring ownership
- **Staking protocols**: Prevent asset execution during staking periods while maintaining ownership
- **Smart contract security**: Add a layer of protection for assets that can execute complex operations
- **Governance controls**: Implement freezing mechanisms for assets involved in governance or voting
- **Asset rental**: Prevent execution while assets are being rented out
- **Collateral management**: Lock assets used as collateral in DeFi protocols

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Functions

### Add Freeze Execute Plugin to an Asset

The `addPlugin` command adds the Freeze Execute Plugin to an Asset. This plugin allows the Asset's Execute functionality to be frozen, preventing execution of arbitrary instructions.

{% dialect-switcher title="Adding a Freeze Execute Plugin to an MPL Core Asset" %}
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

### Creating an Asset with Freeze Execute Plugin

You can also add the Freeze Execute Plugin during asset creation:

{% dialect-switcher title="Creating an Asset with Freeze Execute Plugin" %}
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

### Creating a Collection with Freeze Execute Plugin

The Freeze Execute Plugin can also be applied to collections:

{% dialect-switcher title="Creating a Collection with Freeze Execute Plugin" %}
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

### Freezing Execute Operations

The `updatePlugin` command can be used to freeze the Asset's Execute functionality, preventing it from executing arbitrary instructions until unfrozen.

{% dialect-switcher title="Freeze Execute Operations on an MPL Core Asset" %}
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
        // Pass in Collection if Asset is part of collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // Set the FreezeExecute plugin to `frozen: true`
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

### Unfreezing Execute Operations

The `updatePlugin` command can also be used to unfreeze the Asset's Execute functionality, restoring its ability to execute arbitrary instructions.

{% dialect-switcher title="Unfreeze Execute Operations on an MPL Core Asset" %}
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
        // Pass in Collection if Asset is part of collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // Set the FreezeExecute plugin to `frozen: false`
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

## Plugin Authority

The Freeze Execute Plugin supports different authority types for controlling who can freeze/unfreeze execute operations:

- **Owner Authority** (default): Only the asset owner can freeze/unfreeze
- **Delegate Authority**: A specific address can be delegated to control freezing
- **Update Authority**: The asset's update authority can control freezing, but only if explicitly delegated

{% dialect-switcher title="Setting Plugin Authority" %}
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

## Important Notes

- When the `frozen` field is set to `true`, any execute operations will be blocked
- **Default authority**: The asset owner controls the plugin by default
- **Authority delegation**: Only the current authority can freeze/unfreeze the execute functionality
- **Authority constraints**: If authority is delegated to someone else, the original owner cannot unfreeze until authority is revoked
- The plugin cannot be removed when frozen
- Authority cannot be reassigned when frozen
- The plugin works with the [Execute instruction](/smart-contracts/core/execute-asset-signing) system



## Example Use Case: Backed NFT

A common use case for the Freeze Execute Plugin is creating "backed NFTs" where the NFT represents ownership of underlying assets (like SOL or tokens) that can be withdrawn via execute instructions. The plugin allows you to temporarily freeze these execute operations.

{% dialect-switcher title="Backed NFT Example" %}
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

  //use your wallet instead
  const wallet = generateSigner(umi);
  umi.use(keypairIdentity(wallet));

  // 1. Create asset with frozen execute functionality
  const assetSigner = generateSigner(umi);

  await create(umi, {
    asset: assetSigner,
    name: "Backed NFT",
    uri: "https://example.com/backed-nft.json",
    plugins: [{ type: "FreezeExecute", frozen: true }],
  }).sendAndConfirm(umi);

  // 2. Find the Asset Signer PDA
  const [assetSignerPda] = findAssetSignerPda(umi, {
    asset: assetSigner.publicKey,
  });

  // 3. Deposit SOL to "back" the NFT
  await transferSol(umi, {
    source: umi.identity,
    destination: publicKey(assetSignerPda),
    amount: sol(0.01), // 0.01 SOL backing
  }).sendAndConfirm(umi);

  // 4. Execute operations are blocked while frozen
  // This transaction will fail:
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

  // 5. Unfreeze to allow withdrawals
  await updatePlugin(umi, {
    asset: assetSigner.publicKey,
    plugin: { type: "FreezeExecute", data: { frozen: false } },
  }).sendAndConfirm(umi);

  // 6. Now execute operations are allowed
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
