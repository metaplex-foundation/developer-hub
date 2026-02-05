---
title: Burn Delegate
metaTitle: Burn Delegate 插件 | Metaplex Core
description: 允许委托人代替所有者销毁 Core NFT Asset。使用 Burn Delegate 插件实现游戏机制、订阅过期和自动化资产销毁。
updated: '01-31-2026'
keywords:
  - burn delegate
  - delegate burn
  - automated burn
  - NFT lifecycle
about:
  - Burn delegation
  - Game mechanics
  - Asset lifecycle
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Burn Delegate 和 Permanent Burn Delegate 有什么区别？
    a: Burn Delegate 权限在转移时被撤销。Permanent Burn Delegate 权限永久保持，并使用 forceApprove，意味着即使 Asset 被冻结也可以销毁。
  - q: 如果有 Burn Delegate，所有者还能销毁吗？
    a: 可以。所有者始终可以销毁自己的 Asset，无论委托人如何。
  - q: Burn Delegate 对冻结的 Asset 有效吗？
    a: 无效。普通 Burn Delegate 无法销毁冻结的 Asset。如果需要销毁冻结的 Asset，请使用 Permanent Burn Delegate。
  - q: Burn Delegate 什么时候被撤销？
    a: 当 Asset 转移给新所有者时。新所有者需要添加新的 Burn Delegate。
---
**Burn Delegate 插件**允许指定的权限者代表所有者销毁 Core Asset。适用于游戏机制、订阅服务和自动化资产生命周期管理。{% .lead %}
{% callout title="学习内容" %}
- 向 Asset 添加 Burn Delegate 插件
- 将销毁权限委托给另一个地址
- 撤销销毁权限
- 用例：游戏、订阅、自动销毁
{% /callout %}
## 摘要
**Burn Delegate** 是一个所有者管理的插件，允许委托人销毁 Asset。一旦添加，委托人可以随时销毁 Asset，无需所有者批准。
- 将销毁权限委托给程序或钱包
- 权限在 Asset 转移时被撤销
- 使用 [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) 获得不可撤销的销毁权限
- 不需要额外参数
## 范围外
Collection 销毁（不同的流程）、永久销毁权限（见 Permanent Burn Delegate）和 Token Metadata 销毁权限（不同的系统）。
## 快速开始
**跳转至：** [添加插件](#向-asset-添加-burn-插件) · [委托权限](#委托销毁权限) · [撤销](#撤销销毁权限)
1. 添加 Burn Delegate 插件：`addPlugin(umi, { asset, plugin: { type: 'BurnDelegate' } })`
2. 可选地委托给另一个地址
3. 委托人现在可以随时销毁 Asset
{% callout type="note" title="何时使用 Burn vs Permanent Burn Delegate" %}
| 用例 | Burn Delegate | Permanent Burn Delegate |
|----------|---------------|-------------------------|
| 游戏物品销毁 | ✅ 最佳选择 | ✅ 也可以 |
| 订阅过期 | ✅ 最佳选择 | ❌ 太永久 |
| 销毁冻结的 Asset | ❌ 无法销毁 | ✅ 可以强制销毁 |
| 转移时权限保持 | ❌ 撤销 | ✅ 保持 |
| 紧急销毁功能 | ❌ 有限 | ✅ 最佳选择 |
**选择 Burn Delegate** 当销毁权限应在所有权变更时重置。
**选择 [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate)** 当权限必须永久保持。
{% /callout %}
## 常见用例
- **游戏机制**：当物品被消耗、销毁或在游戏中丢失时销毁 NFT
- **订阅服务**：自动销毁过期的订阅代币
- **制作系统**：制作新物品时销毁材料 NFT
- **成就兑换**：兑换奖励时销毁成就代币
- **活动门票**：活动签到后销毁门票
- **限时资产**：过期后销毁资产
## 适用于
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## 参数
Burn 插件不包含任何要传入的参数。
## 向 Asset 添加 Burn 插件
{% dialect-switcher title="向 MPL Core Asset 添加 Burn 插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
(async () => {
    const asset = publicKey('11111111111111111111111111111111')
    await addPlugin(umi, {
    asset: asset,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{BurnDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_burn_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::BurnDelegate(BurnDelegate {}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_burn_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_burn_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_burn_delegate_plugin_ix_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 委托销毁权限
Burn Delegate 插件权限可以使用 `approvePluginAuthority` 函数委托给不同的地址。这允许您更改谁可以销毁 Asset。
{% dialect-switcher title="委托销毁权限" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('22222222222222222222222222222222')
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## 撤销销毁权限
可以使用 `revokePluginAuthority` 函数撤销销毁权限，将控制权返回给资产所有者。
{% dialect-switcher title="撤销销毁权限" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    await revokePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
只有销毁委托权限者可以销毁 Asset。验证您是否使用正确的密钥对签名。
### `Asset is frozen`
冻结的 Asset 无法销毁。冻结权限者必须先解冻 Asset。
## 注意事项
- 所有者管理：添加需要所有者签名
- Asset 转移时权限自动撤销
- 冻结的 Asset 无法销毁
- 如果权限必须在转移后保持，请使用 Permanent Burn Delegate
- 销毁是立即且不可逆的
## 快速参考
### 谁可以销毁？
| 权限者 | 可以销毁？ |
|-----------|-----------|
| Asset 所有者 | 是（始终） |
| Burn Delegate | 是 |
| Permanent Burn Delegate | 是（force approve） |
| 更新权限者 | 否 |
## 常见问题
### Burn Delegate 和 Permanent Burn Delegate 有什么区别？
Burn Delegate 权限在转移时被撤销。Permanent Burn Delegate 权限永久保持，并使用 `forceApprove`，意味着即使 Asset 被冻结也可以销毁。
### 如果有 Burn Delegate，所有者还能销毁吗？
可以。所有者始终可以销毁自己的 Asset，无论委托人如何。
### Burn Delegate 对冻结的 Asset 有效吗？
无效。普通 Burn Delegate 无法销毁冻结的 Asset。如果需要销毁冻结的 Asset，请使用 Permanent Burn Delegate。
### Burn Delegate 什么时候被撤销？
当 Asset 转移给新所有者时。新所有者需要添加新的 Burn Delegate。
## 相关插件
- [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) - 具有 forceApprove 的不可撤销销毁权限
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - 临时阻止转移和销毁
- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - 允许委托人转移 Asset
## 术语表
| 术语 | 定义 |
|------|------------|
| **Burn Delegate** | 允许委托人销毁 Asset 的所有者管理插件 |
| **所有者管理** | 添加需要所有者签名的插件类型 |
| **撤销** | 移除委托人的销毁权限 |
| **Permanent Burn Delegate** | 转移后仍保持的不可撤销版本 |
| **forceApprove** | 覆盖冻结限制的永久插件能力 |
