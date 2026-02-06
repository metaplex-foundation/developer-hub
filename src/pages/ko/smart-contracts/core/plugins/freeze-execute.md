---
title: Freeze Execute
metaTitle: Freeze Execute 플러그인 | Core
description: MPL Core Asset Freeze Execute 플러그인에 대해 알아보세요. 'Freeze Execute' 플러그인은 Execute 라이프사이클 이벤트를 동결하여 자산이 임의의 명령을 실행하지 못하도록 방지할 수 있습니다.
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
## 개요

Freeze Execute 플러그인은 Asset의 Execute 라이프사이클 이벤트를 동결할 수 있는 `소유자 관리` 플러그인입니다. 동결되면 자산은 Asset Signer PDA를 통해 임의의 명령을 실행할 수 없으며, 동결이 해제될 때까지 모든 실행 작업이 효과적으로 차단됩니다.
{% callout type="warning" %}
**중요**: 소유자 관리 플러그인이므로 자산이 새 소유자에게 전송된 후에는 권한이 유지되지 않습니다. 새 소유자가 이전 권한자가 플러그인의 `freeze` 상태를 변경할 수 있도록 하려면 권한을 다시 추가해야 합니다.
{% /callout %}
Freeze Execute 플러그인은 다음과 같은 시나리오에 특히 유용합니다:

- **담보 NFT**: 기초 자산(SOL, 토큰)의 소유권을 나타내는 NFT를 잠가 무단 인출 방지
- **에스크로 없는 자산 관리**: 소유권을 이전하지 않고 금융 작업에 관련된 자산 동결
- **스테이킹 프로토콜**: 소유권을 유지하면서 스테이킹 기간 동안 자산 실행 방지
- **스마트 컨트랙트 보안**: 복잡한 작업을 실행할 수 있는 자산에 보호 계층 추가
- **거버넌스 제어**: 거버넌스 또는 투표에 관련된 자산에 대한 동결 메커니즘 구현
- **자산 렌탈**: 자산이 대여되는 동안 실행 방지
- **담보 관리**: DeFi 프로토콜에서 담보로 사용되는 자산 잠금

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인수

| 인수   | 값    |
| ------ | ----- |
| frozen | bool  |

## 함수

### Asset에 Freeze Execute 플러그인 추가

`addPlugin` 명령은 Asset에 Freeze Execute 플러그인을 추가합니다. 이 플러그인을 통해 Asset의 Execute 기능을 동결하여 임의의 명령 실행을 방지할 수 있습니다.
{% dialect-switcher title="MPL Core Asset에 Freeze Execute 플러그인 추가" %}
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

### Freeze Execute 플러그인으로 Asset 생성

Asset 생성 시 Freeze Execute 플러그인을 추가할 수도 있습니다:
{% dialect-switcher title="Freeze Execute 플러그인으로 Asset 생성" %}
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

### Freeze Execute 플러그인으로 Collection 생성

Freeze Execute 플러그인은 Collection에도 적용할 수 있습니다:
{% dialect-switcher title="Freeze Execute 플러그인으로 Collection 생성" %}
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

### Execute 작업 동결

`updatePlugin` 명령을 사용하여 Asset의 Execute 기능을 동결하여 동결이 해제될 때까지 임의의 명령 실행을 방지할 수 있습니다.
{% dialect-switcher title="MPL Core Asset의 Execute 작업 동결" %}
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
    // FreezeExecute 플러그인을 `frozen: true`로 설정
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
        // Asset이 Collection의 일부인 경우 Collection을 전달
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeExecute 플러그인을 `frozen: true`로 설정
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

### Execute 작업 동결 해제

`updatePlugin` 명령을 사용하여 Asset의 Execute 기능 동결을 해제하여 임의의 명령을 실행할 수 있는 기능을 복원할 수 있습니다.
{% dialect-switcher title="MPL Core Asset의 Execute 작업 동결 해제" %}
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
    // FreezeExecute 플러그인을 `frozen: false`로 설정
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
        // Asset이 Collection의 일부인 경우 Collection을 전달
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeExecute 플러그인을 `frozen: false`로 설정
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

## 플러그인 권한

Freeze Execute 플러그인은 실행 작업을 동결/해제할 수 있는 사람을 제어하기 위해 다양한 권한 유형을 지원합니다:

- **소유자 권한** (기본값): 자산 소유자만 동결/해제 가능
- **위임 권한**: 특정 주소에 동결 제어를 위임할 수 있음
- **업데이트 권한**: 자산의 업데이트 권한자가 동결을 제어할 수 있지만, 명시적으로 위임된 경우에만 가능
{% dialect-switcher title="플러그인 권한 설정" %}
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

## 중요 사항

- `frozen` 필드가 `true`로 설정되면 모든 실행 작업이 차단됩니다
- **기본 권한**: 자산 소유자가 기본적으로 플러그인을 제어합니다
- **권한 위임**: 현재 권한자만 실행 기능을 동결/해제할 수 있습니다
- **권한 제약**: 권한이 다른 사람에게 위임된 경우 원래 소유자는 권한이 취소될 때까지 동결을 해제할 수 없습니다
- 동결된 상태에서는 플러그인을 제거할 수 없습니다
- 동결된 상태에서는 권한을 재할당할 수 없습니다
- 이 플러그인은 [Execute 명령](/smart-contracts/core/execute-asset-signing) 시스템과 함께 작동합니다

## 사용 사례 예시: 담보 NFT

Freeze Execute 플러그인의 일반적인 사용 사례는 Execute 명령을 통해 인출할 수 있는 기초 자산(SOL 또는 토큰)의 소유권을 나타내는 "담보 NFT"를 만드는 것입니다. 이 플러그인을 사용하면 이러한 실행 작업을 일시적으로 동결할 수 있습니다.
{% dialect-switcher title="담보 NFT 예시" %}
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
  // 실제 지갑을 사용하세요
  const wallet = generateSigner(umi);
  umi.use(keypairIdentity(wallet));
  // 1. 동결된 실행 기능으로 Asset 생성
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    name: "Backed NFT",
    uri: "https://example.com/backed-nft.json",
    plugins: [{ type: "FreezeExecute", frozen: true }],
  }).sendAndConfirm(umi);
  // 2. Asset Signer PDA 찾기
  const [assetSignerPda] = findAssetSignerPda(umi, {
    asset: assetSigner.publicKey,
  });
  // 3. NFT를 "담보"하기 위해 SOL 입금
  await transferSol(umi, {
    source: umi.identity,
    destination: publicKey(assetSignerPda),
    amount: sol(0.01), // 0.01 SOL 담보
  }).sendAndConfirm(umi);
  // 4. 동결된 동안 실행 작업이 차단됨
  // 이 트랜잭션은 실패합니다:
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
    console.log("예상대로 실행 실패", e);
  }
  // 5. 인출을 허용하기 위해 동결 해제
  await updatePlugin(umi, {
    asset: assetSigner.publicKey,
    plugin: { type: "FreezeExecute", data: { frozen: false } },
  }).sendAndConfirm(umi);
  // 6. 이제 실행 작업이 허용됨
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
