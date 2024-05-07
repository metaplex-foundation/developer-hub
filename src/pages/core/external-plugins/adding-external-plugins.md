---
title: Adding External Plugins
metaTitle: Core - Adding Plugins
description: Learn how to add plugins to MPL Core Assets and Collections
---

## Assets

### Creating a Core Asset with an External Plugin

```
///
///
/// Redo Rust I think with smaller examples
///
///
```

{% dialect-switcher title="Creating a Core Asset with an External Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, CheckResult } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: account.publicKey,
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginInitInfo, HookableLifecycleEvent, OracleInitInfo,
        PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let onchain_oracle_account = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV2Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins(vec![ExternalPluginInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_account,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            pda: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a External Plugin to a Core Asset

{% dialect-switcher title="Adding a Plugin with an assigned authority" %}
{% dialect title="Rust" id="rust" %}

```rust
// making smaller
```

{% /dialect %}

{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPluginV1,
  createPlugin,
  pluginAuthority,
  addressPluginAuthority,
} from '@metaplex-foundation/mpl-core'

const delegate = publicKey('222222222222222222222222222222')

await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({ type: 'FreezeDelegate', data: { frozen: true } }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Collections

Adding a Plugin to a Core Collection is similar to that of adding to a Core Asset. You can add plugins during creation and also using the `addCollectionV1` instruction. Collections only have access to `Authority Plugins` and `Permanent Plugins`.

### Creating a Core Collection with an External Plugin

{% dialect-switcher title="Adding a External Plugin to a Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollectionV1,
  pluginAuthorityPair,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: account.publicKey,
    },
    ,
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// making smaller
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a External Plugin to a Collection

{% dialect-switcher title="Burning an Assets" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPluginV1,
  createPlugin,
  ruleSet,
  pluginAuthority,
  addressPluginAuthority,
} from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')

const delegate = publicKey('22222222222222222222222222222222')

await addCollectionPluginV1(umi, {
  collection: collection,
  plugin: createPlugin({
     {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: account.publicKey,
    },
  }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// making smaller
```

{% /dialect %}
{% /dialect-switcher %}
