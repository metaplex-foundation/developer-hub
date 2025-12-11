---
title: Freeze Delegate
metaTitle: Freeze Delegate Plugin | Core
description: MPL Core Asset Freeze Delegate Plugin에 대해 알아보세요. 'Freeze Delegate'는 Core NFT Asset을 동결하여 전송 및 소각과 같은 라이프사이클 이벤트를 차단할 수 있습니다.
---

## 개요

Freeze Plugin은 Asset을 동결하여 전송을 차단하는 `Owner Managed` 플러그인입니다. 플러그인의 권한은 언제든지 스스로를 철회하거나 동결을 해제할 수 있습니다.

Freeze Plugin은 다음과 같은 영역에서 작동합니다:

- 에스크로 없는 스테이킹: 프로토콜에 스테이킹된 동안 에스크로 계정으로 전송할 필요 없이 NFT를 동결
- 마켓플레이스에서 NFT의 에스크로 없는 목록: 마켓플레이스의 에스크로로 전송하지 않고도 NFT를 판매 목록에 등록
- 게임 아이템 잠금: 게임플레이에서 사용되는 동안 게임 내 아이템을 일시적으로 잠금
- 렌탈 마켓플레이스: 사용자에게 임대되는 동안 NFT를 잠금
- 거버넌스 참여: 투표나 제안에 참여하는 동안 거버넌스 토큰을 잠금
- 담보 관리: 대출 프로토콜에서 담보로 사용되는 NFT를 잠금
- 토너먼트 참여: 토너먼트나 경쟁에서 사용되는 동안 NFT를 잠금

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Functions

### Asset에 Freeze Delegate Plugin 추가

`addPlugin` 명령은 Asset에 Freeze Delegate Plugin을 추가합니다. 이 플러그인을 통해 Asset을 동결하여 전송과 소각을 방지할 수 있습니다.

{% dialect-switcher title="MPL Core Asset에 Freeze Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: { type: 'FreezeDelegate', data: { frozen: true } },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
AddPluginV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke();
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_freeze_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate {frozen: true}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_freeze_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_freeze_delegate_plugin_ix_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Freeze 권한 위임

`approvePluginAuthority` 명령은 freeze 권한을 다른 주소에 위임합니다. 이를 통해 소유권을 유지하면서 다른 주소가 Asset을 동결하고 해제할 수 있습니다.

{% dialect-switcher title="Freeze 권한 위임" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegateAddress = publicKey('22222222222222222222222222222222')

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'Address', address: delegateAddress },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::FreezeDelegate)
    .new_authority(PluginAuthority::Address { address: ctx.accounts.new_authority.key() })
    .invoke()?;
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

pub async fn approve_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let new_authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let approve_plugin_authority_plugin_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // Asset이 컬렉션의 일부인 경우, 컬렉션을 전달해야 합니다
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

### Asset 동결

`freezeAsset` 명령은 Asset을 동결하여 전송이나 소각을 방지합니다. 이는 에스크로 없는 스테이킹이나 마켓플레이스 목록에 유용합니다.

{% dialect-switcher title="MPL Core Asset 동결" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { freezeAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await freezeAsset(umi, {
    asset: assetAccount,
    delegate: delegateSigner.publicKey,
    authority: delegateSigner,
  }).sendAndConfirm(umi)
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
    // FreezeDelegate 플러그인을 `frozen: true`로 설정
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Asset이 컬렉션의 일부인 경우 Collection을 전달
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeDelegate 플러그인을 `frozen: true`로 설정
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

### 동결된 Asset 해제

`thawAsset` 명령은 동결된 Asset을 해제하여 전송과 소각 기능을 복원합니다.

{% dialect-switcher title="MPL Core Asset 해제" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { thawAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await thawAsset(umi, {
  asset: assetAccount,
  delegate: delegateSigner,
}).sendAndConfirm(umi)
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
    // FreezeDelegate 플러그인을 `frozen: false`로 설정
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn thaw_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let thaw_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Asset이 컬렉션의 일부인 경우 Collection을 전달
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeDelegate 플러그인을 `frozen: false`로 설정
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let thaw_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[thaw_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&thaw_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}