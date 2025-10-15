---
title: Freeze Execute
metaTitle: Freeze Execute Plugin | Core
description: MPL Core Asset Freeze Execute Plugin에 대해 알아보세요. 'Freeze Execute' 플러그인은 Execute 라이프사이클 이벤트를 동결하여 에셋이 임의의 명령을 실행하는 것을 방지할 수 있습니다.
---

## 개요

Freeze Execute Plugin은 Asset에서 Execute 라이프사이클 이벤트를 동결할 수 있는 `Owner Managed` 플러그인입니다. 동결되면 에셋은 Asset Signer PDA를 통해 임의의 명령을 실행할 수 없으며, 동결이 해제될 때까지 모든 실행 작업이 차단됩니다.

{% callout type="warning" %}
**중요**: 이는 Owner Managed 플러그인이므로 에셋이 새 소유자에게 전송된 후에는 권한이 유지되지 않습니다. 이전 권한자들이 플러그인의 `freeze` 상태를 변경할 수 있도록 하려면 새 소유자가 권한을 다시 추가해야 합니다.
{% /callout %}

Freeze Execute Plugin은 특히 다음과 같은 시나리오에서 유용합니다:

- **Backed NFT**: 기본 에셋(SOL, 토큰)의 소유권을 나타내는 NFT를 잠가 무단 출금을 방지
- **에스크로 없는 에셋 관리**: 소유권을 이전하지 않고 금융 운영에 관련된 동안 에셋을 동결
- **스테이킹 프로토콜**: 소유권을 유지하면서 스테이킹 기간 동안 에셋 실행을 방지
- **스마트 컨트랙트 보안**: 복잡한 작업을 실행할 수 있는 에셋에 보호 계층 추가
- **거버넌스 제어**: 거버넌스나 투표에 관련된 에셋에 대한 동결 메커니즘 구현
- **에셋 렌탈**: 에셋이 임대되는 동안 실행을 방지
- **담보 관리**: DeFi 프로토콜에서 담보로 사용되는 에셋을 잠금

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

### Asset에 Freeze Execute Plugin 추가

`addPlugin` 명령은 Asset에 Freeze Execute Plugin을 추가합니다. 이 플러그인을 통해 Asset의 Execute 기능을 동결하여 임의의 명령 실행을 방지할 수 있습니다.

{% dialect-switcher title="MPL Core Asset에 Freeze Execute Plugin 추가" %}
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

### Freeze Execute Plugin과 함께 Asset 생성

에셋 생성 중에 Freeze Execute Plugin을 추가할 수도 있습니다:

{% dialect-switcher title="Freeze Execute Plugin과 함께 Asset 생성" %}
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

### Freeze Execute Plugin과 함께 Collection 생성

Freeze Execute Plugin은 컬렉션에도 적용할 수 있습니다:

{% dialect-switcher title="Freeze Execute Plugin과 함께 Collection 생성" %}
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

{% dialect-switcher title="MPL Core Asset에서 Execute 작업 동결" %}
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
        // Asset이 컬렉션의 일부인 경우 Collection을 전달
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

`updatePlugin` 명령을 사용하여 Asset의 Execute 기능 동결을 해제하여 임의의 명령을 실행할 수 있는 기능을 복원할 수도 있습니다.

{% dialect-switcher title="MPL Core Asset에서 Execute 작업 동결 해제" %}
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
        // Asset이 컬렉션의 일부인 경우 Collection을 전달
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

## Plugin 권한

Freeze Execute Plugin은 누가 execute 작업을 동결/해제할 수 있는지 제어하기 위해 다양한 권한 유형을 지원합니다:

- **Owner Authority** (기본값): 에셋 소유자만 동결/해제 가능
- **Delegate Authority**: 특정 주소가 동결 제어 권한을 위임받을 수 있음
- **Update Authority**: 에셋의 업데이트 권한이 동결을 제어할 수 있지만, 명시적으로 위임된 경우에만 가능

{% dialect-switcher title="Plugin 권한 설정" %}
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

- `frozen` 필드가 `true`로 설정되면 모든 execute 작업이 차단됩니다
- **기본 권한**: 에셋 소유자가 기본적으로 플러그인을 제어합니다
- **권한 위임**: 현재 권한자만 execute 기능을 동결/해제할 수 있습니다
- **권한 제약**: 권한이 다른 사람에게 위임된 경우, 원래 소유자는 권한이 철회될 때까지 동결을 해제할 수 없습니다
- 동결된 상태에서는 플러그인을 제거할 수 없습니다
- 동결된 상태에서는 권한을 재할당할 수 없습니다
- 이 플러그인은 [Execute instruction](/core/execute-asset-signing) 시스템과 함께 작동합니다



## 예시 사용 사례: Backed NFT

Freeze Execute Plugin의 일반적인 사용 사례는 NFT가 기본 에셋(SOL이나 토큰 등)의 소유권을 나타내고 execute 명령을 통해 출금할 수 있는 "backed NFT"를 만드는 것입니다. 플러그인을 통해 이러한 execute 작업을 일시적으로 동결할 수 있습니다.

{% dialect-switcher title="Backed NFT 예시" %}
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

  //사용자의 지갑을 대신 사용하세요
  const wallet = generateSigner(umi);
  umi.use(keypairIdentity(wallet));

  // 1. 동결된 execute 기능을 가진 에셋 생성
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

  // 3. NFT를 "백업"하기 위해 SOL 입금
  await transferSol(umi, {
    source: umi.identity,
    destination: publicKey(assetSignerPda),
    amount: sol(0.01), // 0.01 SOL 백업
  }).sendAndConfirm(umi);

  // 4. 동결된 동안 Execute 작업이 차단됨
  // 이 트랜잭션은 실패할 것입니다:
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

  // 5. 출금을 허용하기 위해 동결 해제
  await updatePlugin(umi, {
    asset: assetSigner.publicKey,
    plugin: { type: "FreezeExecute", data: { frozen: false } },
  }).sendAndConfirm(umi);

  // 6. 이제 execute 작업이 허용됨
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