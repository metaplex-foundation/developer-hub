---
title: 플러그인 위임 및 해제
metaTitle: 플러그인 위임 및 해제 | Core
description: MPL Core 애셋 및 컬렉션에 플러그인 권한을 위임하고 해제하는 방법을 알아보세요.
---

## 권한 위임

플러그인은 Delegate Authority 명령어 업데이트로 다른 주소에 위임될 수 있습니다. 위임된 플러그인을 통해 주 권한 이외의 주소가 해당 플러그인의 기능을 제어할 수 있습니다.

{% dialect-switcher title="플러그인 권한 위임" %}
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
        .new_authority(PluginAuthority::Address {
            address: delegate_authority,
        })
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

## 권한 해제

플러그인에서 권한을 해제하면 해제되는 플러그인 타입에 따라 다른 동작이 발생합니다.

- **소유자 관리 플러그인:** `소유자 관리 플러그인`에서 주소가 해제되면 플러그인이 `Owner` 권한 타입으로 기본 복원됩니다.

- **권한 관리 플러그인:** `권한 관리 플러그인`에서 주소가 해제되면 플러그인이 `UpdateAuthority` 권한 타입으로 기본 복원됩니다.

### 누가 플러그인을 해제할 수 있나요?

#### 소유자 관리 플러그인

- 소유자 관리 플러그인은 소유자가 해제할 수 있으며, 이는 위임자를 해제하고 pluginAuthority 타입을 `Owner`로 설정합니다.
- 플러그인의 위임된 권한은 스스로를 해제할 수 있으며, 그러면 플러그인 권한 타입이 `Owner`로 설정됩니다.
- 전송 시, 소유자 관리 플러그인의 위임된 권한은 자동으로 `Owner Authority` 타입으로 해제됩니다.

#### 권한 관리 플러그인

- 애셋의 업데이트 권한은 위임자를 해제할 수 있으며, 그러면 pluginAuthority 타입이 `UpdateAuthority`로 설정됩니다.
- 플러그인의 위임된 권한은 스스로를 해제할 수 있으며, 그러면 플러그인 권한 타입이 `UpdateAuthority`로 설정됩니다.

플러그인 목록과 해당 타입은 [플러그인 개요](/ko/smart-contracts/core/plugins) 페이지에서 볼 수 있습니다.

{% dialect-switcher title="플러그인 권한 해제" %}
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

### 애셋 전송 시 위임 재설정

모든 소유자 관리 플러그인은 애셋 전송 시 위임된 권한이 해제되고 `Owner`의 권한 타입으로 다시 설정됩니다.

여기에는 다음이 포함됩니다:

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## 플러그인 데이터를 불변으로 만들기

플러그인의 권한을 `None` 값으로 업데이트하면 플러그인의 데이터가 효과적으로 불변이 됩니다.

{% callout type="warning" %}

**경고** - 이렇게 하면 플러그인 데이터가 불변이 됩니다. 주의해서 진행하세요!

{% /callout %}

{% dialect-switcher title="플러그인을 불변으로 만들기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  approvePluginAuthority
} from '@metaplex-foundation/mpl-core'

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