---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Delegate | Metaplex Core
description: 使用Permanent Freeze Delegate plugin创建灵魂绑定NFT并冻结整个Collection。永久有效的不可撤销freeze权限。
updated: '01-31-2026'
keywords:
  - soulbound NFT
  - permanent freeze
  - non-transferable NFT
  - collection freeze
about:
  - Soulbound tokens
  - Permanent plugins
  - Collection freezing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 如何创建灵魂绑定（不可转让）代币？
    a: 使用PermanentFreezeDelegate创建Asset，将frozen设置为true，将authority设置为None。该Asset将永远无法解冻或转移。
  - q: Freeze Delegate和Permanent Freeze Delegate有什么区别？
    a: 普通Freeze Delegate authority在转移时会被撤销，只适用于Asset。Permanent Freeze Delegate永久有效，适用于Collection，并使用forceApprove。
  - q: 我可以冻结Collection中的单个Asset吗？
    a: 不可以。当Permanent Freeze Delegate在Collection上时，冻结会一次性影响所有Asset。使用Asset级别的Permanent Freeze Delegate进行单独控制。
  - q: 永久冻结的Asset可以被burn吗？
    a: 只有在同时存在Permanent Burn Delegate的情况下才可以。普通Burn Delegate无法burn冻结的Asset，但Permanent Burn Delegate使用forceApprove。
---
**Permanent Freeze Delegate Plugin**提供在转移后仍然有效的不可撤销freeze权限。用于灵魂绑定代币、Collection范围冻结和永久锁定机制。 {% .lead %}
{% callout title="学习内容" %}
- 创建具有永久freeze功能的Asset
- 一次性冻结整个Collection
- 实现灵魂绑定（不可转让）代币
- 理解permanent vs 普通freeze delegate
{% /callout %}
## 概述
**Permanent Freeze Delegate**是一个只能在创建时添加的permanent plugin。与普通Freeze Delegate不同，此权限永久有效，即使在转移后也可以冻结/解冻。
- 只能在Asset/Collection创建时添加
- 权限在转移后保留（永不撤销）
- 使用`forceApprove` - 即使有其他阻止plugin也可以冻结
- Collection级别冻结影响Collection中的所有Asset
## 范围外
普通freeze delegate（参见[Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)）、临时冻结和Token Metadata freeze权限。
## 快速开始
**跳转到:** [创建Asset](#creating-an-asset-with-a-permanent-freeze-plugin) · [创建Collection](#creating-a-collection-with-a-permanent-freeze-plugin) · [更新（解冻）](#updating-the-permanent-freeze-delegate-plugin-on-an-asset)
1. 在Asset/Collection创建时添加`PermanentFreezeDelegate` plugin
2. 立即冻结设置`frozen: true`，稍后冻结设置`false`
3. delegate可以在任何时候冻结/解冻，即使在转移后
{% callout type="note" title="Permanent vs 普通Freeze Delegate" %}
| 功能 | Freeze Delegate | Permanent Freeze Delegate |
|---------|-----------------|---------------------------|
| 创建后添加 | ✅ 可以 | ❌ 仅限创建时 |
| 转移后权限保留 | ❌ 撤销 | ✅ 保留 |
| 适用于Collection | ❌ 不可以 | ✅ 可以 |
| forceApprove | ❌ 没有 | ✅ 有 |
| 灵魂绑定代币 | ❌ 有限 | ✅ 最佳选择 |
**选择[Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)**：用于临时、可撤销的冻结。
**选择Permanent Freeze Delegate**：用于永久权限或Collection范围冻结。
{% /callout %}
## 常见用例
- **灵魂绑定代币**：创建不可转让的凭证、成就或会员资格
- **Collection范围冻结**：使用一个plugin冻结Collection中的所有Asset
- **永久抵押品**：作为即使所有权变更后仍然存在的抵押品锁定Asset
- **游戏物品永久性**：无论交易如何都保持锁定的物品
- **合规要求**：因监管原因必须保持冻结的Asset
## 兼容性
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
### 行为
- **Asset**：允许delegated地址随时冻结和解冻NFT。
- **Collection**：允许collection authority一次性冻结和解冻整个Collection。使用此delegate**无法**冻结Collection中的单个asset。
## 参数
| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |
## 创建带有Permanent Freeze plugin的Asset
以下示例展示如何创建带有Permanent Freeze plugin的Asset。
{% dialect-switcher title="创建带有Permanent Freeze plugin的Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')
await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 更新Asset上的Permanent Freeze Delegate plugin
以下示例展示如何更新Asset上的Permanent Freeze Delegate plugin。将`frozen`参数设置为`true`或`false`以冻结或解冻。假设签名钱包是plugin authority。
{% dialect-switcher title="更新Asset上的Permanent Freeze Delegate plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## 创建带有Permanent Freeze plugin的Collection
以下示例展示如何创建带有Permanent Freeze plugin的Collection。
{% dialect-switcher title="创建带有Permanent Freeze plugin的Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // The update authority can unfreeze it
      },
    ],
  }).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## 更新带有Permanent Freeze plugin的Collection
以下示例展示如何更新Collection上的Permanent Freeze Delegate plugin。将`frozen`参数设置为`true`或`false`以冻结或解冻。假设签名钱包是plugin authority。
{% dialect-switcher title="更新带有Permanent Freeze plugin的Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'
const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Cannot add permanent plugin after creation`
Permanent plugin只能在Asset/Collection创建时添加。您无法将Permanent Freeze Delegate添加到现有Asset。
### `Authority mismatch`
只有plugin authority可以冻结/解冻。请验证您是否使用正确的密钥对签名。
## 注意事项
- **仅限创建时**：Asset/Collection存在后无法添加
- **Force approve**：即使有冲突的plugin也可以冻结
- **Collection行为**：一次性冻结所有Asset，不是单独冻结
- **永久有效**：权限即使在转移后也永不撤销
- 使用`frozen: true`和authority `None`来创建灵魂绑定代币
## FAQ
### 如何创建灵魂绑定（不可转让）代币？
使用`PermanentFreezeDelegate`创建Asset，将`frozen`设置为`true`，将authority设置为`None`。该Asset将永远无法解冻或转移。
### Freeze Delegate和Permanent Freeze Delegate有什么区别？
普通Freeze Delegate authority在转移时会被撤销，只适用于Asset。Permanent Freeze Delegate永久有效，适用于Collection，并使用`forceApprove`。
### 我可以冻结Collection中的单个Asset吗？
不可以。当Permanent Freeze Delegate在Collection上时，冻结会一次性影响所有Asset。使用Asset级别的Permanent Freeze Delegate进行单独控制。
### 永久冻结的Asset可以被burn吗？
只有在同时存在Permanent Burn Delegate的情况下才可以。普通Burn Delegate无法burn冻结的Asset，但Permanent Burn Delegate使用`forceApprove`。
## 相关Plugin
- [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) - 用于临时锁定的可撤销freeze
- [Permanent Transfer Delegate](/zh/smart-contracts/core/plugins/permanent-transfer-delegate) - 永久transfer权限
- [Permanent Burn Delegate](/zh/smart-contracts/core/plugins/permanent-burn-delegate) - 即使冻结也能burn Asset
## 术语表
| 术语 | 定义 |
|------|------------|
| **Permanent Plugin** | 只能在创建时添加且永久有效的Plugin |
| **forceApprove** | 覆盖其他plugin拒绝的验证 |
| **Soulbound** | 永久冻结到钱包的不可转让代币 |
| **Collection Freeze** | 一次性冻结Collection中的所有Asset |
