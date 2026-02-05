---
title: Permanent Transfer Delegate
metaTitle: Permanent Transfer Delegate | Metaplex Core
description: 授予即使所有权变更后仍然有效的永久transfer权限。用于游戏机制、订阅服务和自动化资产管理。
updated: '01-31-2026'
keywords:
  - permanent transfer
  - irrevocable delegate
  - automated transfers
  - game mechanics
about:
  - Permanent delegation
  - Automated management
  - Game integration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Transfer Delegate和Permanent Transfer Delegate有什么区别？
    a: 普通Transfer Delegate在一次转移后会被撤销。Permanent Transfer Delegate永久有效，可以无限次转移。
  - q: Permanent Transfer Delegate能转移冻结的Asset吗？
    a: 是的。Permanent plugin使用forceApprove，可以覆盖冻结拒绝。
  - q: 我可以将此添加到现有Asset吗？
    a: 不可以。Permanent plugin只能在Asset创建时添加。对于现有Asset，请使用普通Transfer Delegate。
  - q: Collection级别的Permanent Transfer Delegate如何工作？
    a: delegate可以转移Collection中的任何单个Asset，但不能一次性转移所有Asset。每次转移都是单独的交易。
---
**Permanent Transfer Delegate Plugin**提供永久有效的不可撤销transfer权限。与普通Transfer Delegate不同，此权限永不撤销，可以重复转移Asset。 {% .lead %}
{% callout title="学习内容" %}
- 创建具有永久transfer功能的Asset
- 启用Collection范围的transfer权限
- 用例：游戏、订阅、自动化系统
- 理解permanent vs 普通transfer delegate
{% /callout %}
## 概述
**Permanent Transfer Delegate**是一个只能在创建时添加的permanent plugin。delegate可以无需所有者批准无限次转移Asset。
- 只能在Asset/Collection创建时添加
- 权限永久有效（永不撤销）
- 使用`forceApprove` - 即使冻结也可以转移
- Collection级别：允许转移Collection中的任何Asset
## 范围外
普通transfer delegate（参见[Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate)）、无托管列表（使用普通delegate）和Token Metadata transfer权限。
## 快速开始
**跳转到:** [创建Asset](#creating-a-mpl-core-asset-with-a-permanent-transfer-plugin)
1. 在Asset/Collection创建时添加`PermanentTransferDelegate` plugin
2. 将authority设置为您的程序或delegate地址
3. delegate可以在任何时候无限次转移Asset
{% callout type="note" title="Permanent vs 普通Transfer Delegate" %}
| 功能 | Transfer Delegate | Permanent Transfer Delegate |
|---------|-------------------|----------------------------|
| 创建后添加 | ✅ 可以 | ❌ 仅限创建时 |
| 转移后权限保留 | ❌ 1次转移后撤销 | ✅ 永久保留 |
| 多次转移 | ❌ 一次性 | ✅ 无限 |
| 可以转移冻结的Asset | ❌ 不可以 | ✅ 可以（forceApprove） |
| 适用于Collection | ❌ 不可以 | ✅ 可以 |
**选择[Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate)**：用于一次性无托管销售。
**选择Permanent Transfer Delegate**：用于游戏、租赁或需要重复转移的自动化系统。
{% /callout %}
## 常见用例
- **游戏机制**：当游戏事件发生时（战斗失败、交易）转移Asset
- **租赁返还**：自动将租借的NFT返还给所有者
- **订阅管理**：当订阅结束或续订时转移代币
- **DAO财库管理**：允许DAO管理Asset分配
- **自动化系统**：需要在无需每次转移批准的情况下移动Asset的程序
## 兼容性
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
### 行为
- **Asset**：允许使用delegated地址转移Asset。
- **Collection**：允许使用collection authority转移Collection中的任何Asset。不会一次性转移所有Asset。
## 参数
| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |
## 创建带有Permanent Transfer Plugin的MPL Core Asset
{% dialect-switcher title="创建带有Permanent Transfer Plugin的MPL Core Asset" %}
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
      type: 'PermanentTransferDelegate',
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
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
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
## 常见错误
### `Cannot add permanent plugin after creation`
Permanent plugin只能在Asset/Collection创建时添加。您无法将Permanent Transfer Delegate添加到现有Asset。
### `Authority mismatch`
只有plugin authority可以转移。请验证您是否使用正确的密钥对签名。
## 注意事项
- **仅限创建时**：Asset/Collection存在后无法添加
- **Force approve**：即使冻结也可以转移
- **Collection行为**：可以单独转移Collection中的任何Asset
- **永久有效**：权限永不撤销
- **无限转移**：delegate可以转移的次数没有限制
## FAQ
### Transfer Delegate和Permanent Transfer Delegate有什么区别？
普通Transfer Delegate在一次转移后会被撤销。Permanent Transfer Delegate永久有效，可以无限次转移。
### Permanent Transfer Delegate能转移冻结的Asset吗？
是的。Permanent plugin使用`forceApprove`，可以覆盖冻结拒绝。
### 我可以将此添加到现有Asset吗？
不可以。Permanent plugin只能在Asset创建时添加。对于现有Asset，请使用普通Transfer Delegate。
### Collection级别的Permanent Transfer Delegate如何工作？
delegate可以转移Collection中的任何单个Asset，但不能一次性转移所有Asset。每次转移都是单独的交易。
## 相关Plugin
- [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) - 一次性transfer权限
- [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) - 永久freeze权限
- [Permanent Burn Delegate](/zh/smart-contracts/core/plugins/permanent-burn-delegate) - 永久burn权限
## 术语表
| 术语 | 定义 |
|------|------------|
| **Permanent Plugin** | 只能在创建时添加且永久有效的Plugin |
| **forceApprove** | 覆盖其他plugin拒绝的验证 |
| **Collection Transfer** | 转移Collection中任何Asset的能力 |
