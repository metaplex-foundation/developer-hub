---
title: プラグインの委任と取り消し
metaTitle: プラグインの委任と取り消し | Core
description: MPL Coreアセットとコレクションに対して、プラグイン権限を委任・取り消しする方法を学びます。
---

## 権限の委任（Delegating）

プラグインは「委任権限（Delegate Authority）」の更新命令で他アドレスへ委任できます。委任されたプラグインは、メインの権限者以外のアドレスにも、そのプラグイン機能の制御を許可します。

{% dialect-switcher title="プラグイン権限の委任" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('33333333333333333333333333333')

await approvePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'Attributes' },
  newAuthority: { type: 'Address', address: delegate },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn delegate_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let delegate_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let delegate_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address { address: delegate_authority })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let delegate_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[delegate_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&delegate_plugin_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 権限の取り消し（Revoking）

プラグインの権限を取り消した際の動作は、プラグインの種類によって異なります。

- **オーナー管理型プラグイン:** `Owner Managed`プラグインでアドレスを取り消した場合、権限タイプは`Owner`に戻ります。
- **権限管理型プラグイン:** `Authority Managed`プラグインでアドレスを取り消した場合、権限タイプは`UpdateAuthority`に戻ります。

### 誰が取り消せるか

#### オーナー管理型プラグイン

- オーナーは、委任を取り消してプラグイン権限タイプを`Owner`へ戻せます。
- 委任されたアドレス自身も、自分の委任を取り消して`Owner`へ戻せます。
- アセットのTransfer時、オーナー管理型プラグインの委任は自動的に`Owner`へ戻されます。

#### 権限管理型プラグイン

- アセットのアップデート権限者は、委任を取り消してプラグイン権限タイプを`UpdateAuthority`へ戻せます。
- 委任されたアドレス自身も、自分の委任を取り消して`UpdateAuthority`へ戻せます。

各プラグインの種類は[Plugins概要](/ja/smart-contracts/core/plugins)で確認できます。

{% dialect-switcher title="プラグイン権限の取り消し" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'

await revokePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::RevokePluginAuthorityV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn revoke_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let revoke_plugin_authority_ix = RevokePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let revoke_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[revoke_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&revoke_plugin_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### アセット移転時の委任リセット

すべてのオーナー管理型プラグインは、アセットのTransfer時に委任が取り消され、権限タイプが`Owner`へ戻ります。

対象プラグイン:

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## プラグインデータを不変化（Immutable）にする

プラグインの権限を`None`へ更新すると、そのプラグインのデータは実質的に不変になります。

{% callout type="warning" %}
警告: これを行うと、そのプラグインのデータは更新不能になります。用途をよく検討した上で実施してください。
{% /callout %}

{% dialect-switcher title="プラグインを不変化する" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'None' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn make_plugin_data_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let make_plugin_data_immutable_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::None)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let make_plugin_data_immutable_tx = Transaction::new_signed_with_payer(
        &[make_plugin_data_immutable_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&make_plugin_data_immutable_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

