---
title: Permanent Burn Delegate
metaTitle: Permanent Burn Delegate | Metaplex Core
description: 授予即使在冻结状态下也能销毁Asset的永久burn权限。用于游戏机制、订阅过期和自动化资产生命周期管理。
updated: '01-31-2026'
keywords:
  - permanent burn
  - irrevocable burn
  - subscription expiry
  - automated burn
about:
  - Permanent delegation
  - Asset lifecycle
  - Automated destruction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Burn Delegate和Permanent Burn Delegate有什么区别？
    a: 普通Burn Delegate无法burn冻结的Asset，且在转移时会被撤销。Permanent Burn Delegate可以burn冻结的Asset（forceApprove）并永久有效。
  - q: Permanent Burn Delegate能burn冻结的Asset吗？
    a: 是的。Permanent plugin使用forceApprove，可以覆盖冻结拒绝。这对于需要物品可销毁的游戏机制很有用。
  - q: 我可以将此添加到现有Asset吗？
    a: 不可以。Permanent plugin只能在Asset创建时添加。对于现有Asset，请使用普通Burn Delegate。
  - q: Collection级别的Permanent Burn Delegate如何工作？
    a: delegate可以burn Collection中的任何单个Asset，但不能一次性burn所有Asset。每次burn都是单独的交易。
  - q: 使用这个安全吗？
    a: 请谨慎使用。delegate可以在任何时候无需所有者批准就burn Asset。只分配给可信任的程序或地址。
---
**Permanent Burn Delegate Plugin**提供永久有效的不可撤销burn权限。delegate即使在冻结状态下也可以burn Asset，非常适合游戏和订阅服务。 {% .lead %}
{% callout title="学习内容" %}

- 创建具有永久burn功能的Asset
- 启用Collection范围的burn权限
- burn冻结的Asset（`forceApprove`行为）
- 用例：游戏、订阅、自动清理
{% /callout %}

## 概述

**Permanent Burn Delegate**是一个只能在创建时添加的permanent plugin。delegate可以在任何时候burn Asset，即使Asset处于冻结状态。

- 只能在Asset/Collection创建时添加
- 权限永久有效（永不撤销）
- 使用`forceApprove` - 即使冻结也可以burn
- Collection级别：允许burn Collection中的任何Asset

## 范围外

普通burn delegate（参见[Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate)）、条件burn和Token Metadata burn权限。

## 快速开始

**跳转到:** [创建Asset](#creating-an-asset-with-a-permanent-burn-plugin)

1. 在Asset/Collection创建时添加`PermanentBurnDelegate` plugin
2. 将authority设置为您的程序或delegate地址
3. delegate可以在任何时候burn Asset，即使冻结
{% callout type="note" title="Permanent vs 普通Burn Delegate" %}
| 功能 | Burn Delegate | Permanent Burn Delegate |
|---------|---------------|-------------------------|
| 创建后添加 | ✅ 可以 | ❌ 仅限创建时 |
| 转移后权限保留 | ❌ 撤销 | ✅ 永久保留 |
| 可以burn冻结的Asset | ❌ 不可以 | ✅ 可以（forceApprove） |
| 适用于Collection | ❌ 不可以 | ✅ 可以 |
| 紧急销毁 | ❌ 有限 | ✅ 最佳选择 |
**选择[Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate)**：用于用户可撤销的burn权限。
**选择Permanent Burn Delegate**：用于游戏、紧急销毁或自动清理。
{% /callout %}

## 常见用例

- **游戏机制**：当游戏中物品被消耗、丢失或销毁时销毁Asset
- **订阅过期**：即使冻结也自动burn过期的订阅代币
- **紧急销毁**：无论状态如何，删除受损或不需要的Asset
- **制作系统**：制作时burn原料NFT（即使锁定）
- **限时资产**：自动销毁过期内容
- **合规**：即使所有者尝试冻结，也删除违反条款的Asset

## 兼容性

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 行为

- **Asset**：允许使用delegated地址burn Asset。
- **Collection**：允许使用collection authority burn Collection中的任何Asset。不会一次性burn所有Asset。

## 参数

Permanent Burn Plugin没有需要传入的参数。

## 创建带有Permanent Burn Plugin的Asset

{% dialect-switcher title="创建带有Permanent Freeze plugin的Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentBurnDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Cannot add permanent plugin after creation`

Permanent plugin只能在Asset/Collection创建时添加。您无法将Permanent Burn Delegate添加到现有Asset。

### `Authority mismatch`

只有plugin authority可以burn。请验证您是否使用正确的密钥对签名。

## 注意事项

- **仅限创建时**：Asset/Collection存在后无法添加
- **Force approve**：即使冻结也可以burn
- **Collection行为**：可以单独burn Collection中的任何Asset
- **永久有效**：权限永不撤销
- **不可逆**：burn的Asset无法恢复

## FAQ

### Burn Delegate和Permanent Burn Delegate有什么区别？

普通Burn Delegate无法burn冻结的Asset，且在转移时会被撤销。Permanent Burn Delegate可以burn冻结的Asset（forceApprove）并永久有效。

### Permanent Burn Delegate能burn冻结的Asset吗？

是的。Permanent plugin使用`forceApprove`，可以覆盖冻结拒绝。这对于需要物品可销毁的游戏机制很有用。

### 我可以将此添加到现有Asset吗？

不可以。Permanent plugin只能在Asset创建时添加。对于现有Asset，请使用普通Burn Delegate。

### Collection级别的Permanent Burn Delegate如何工作？

delegate可以burn Collection中的任何单个Asset，但不能一次性burn所有Asset。每次burn都是单独的交易。

### 使用这个安全吗？

请谨慎使用。delegate可以在任何时候无需所有者批准就burn Asset。只分配给可信任的程序或地址。

## 相关Plugin

- [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate) - 可撤销的burn权限
- [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) - 永久freeze权限
- [Permanent Transfer Delegate](/zh/smart-contracts/core/plugins/permanent-transfer-delegate) - 永久transfer权限

## 术语表

| 术语 | 定义 |
|------|------------|
| **Permanent Plugin** | 只能在创建时添加且永久有效的Plugin |
| **forceApprove** | 覆盖其他plugin拒绝的验证 |
| **Collection Burn** | burn Collection中任何Asset的能力 |
