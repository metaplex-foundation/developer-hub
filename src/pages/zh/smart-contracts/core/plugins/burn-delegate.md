---
title: 销毁委托
metaTitle: 销毁委托插件 | Metaplex Core
description: 允许委托销毁 Core NFT 资产。使用销毁委托插件进行游戏机制、订阅到期和自动化资产销毁。
---

**销毁委托插件**允许指定的权限代表所有者销毁 Core 资产。对于游戏机制、订阅服务和自动化资产生命周期管理很有用。{% .lead %}

{% callout title="您将学到" %}

- 向资产添加销毁委托插件
- 将销毁权限委托给另一个地址
- 撤销销毁权限
- 用例：游戏、订阅、自动化销毁

{% /callout %}

## 摘要

**销毁委托**是一个所有者管理插件，允许委托销毁资产。添加后，委托可以随时无需所有者批准即可销毁资产。

- 将销毁权限委托给程序或钱包
- 资产转移时权限被撤销
- 使用[永久销毁委托](/zh/smart-contracts/core/plugins/permanent-burn-delegate)获取不可撤销的销毁权限
- 无需额外参数

## 范围外

集合销毁（不同流程）、永久销毁权限（见永久销毁委托）和 Token Metadata 销毁权限（不同系统）。

## 快速开始

**跳转到:** [添加插件](#向资产添加销毁插件) · [委托权限](#委托销毁权限) · [撤销](#撤销销毁权限)

1. 添加销毁委托插件: `addPlugin(umi, { asset, plugin: { type: 'BurnDelegate' } })`
2. 可选择委托给另一个地址
3. 委托现在可以随时销毁资产

{% callout type="note" title="何时使用销毁委托 vs 永久销毁委托" %}

| 用例 | 销毁委托 | 永久销毁委托 |
|------|---------|-------------|
| 游戏物品销毁 | ✅ 最佳选择 | ✅ 也可以 |
| 订阅到期 | ✅ 最佳选择 | ❌ 太永久 |
| 销毁冻结资产 | ❌ 不能销毁 | ✅ 可以强制销毁 |
| 转移时权限保持 | ❌ 撤销 | ✅ 保持 |
| 紧急销毁能力 | ❌ 有限 | ✅ 最佳选择 |

当销毁权限应在所有权变更时重置时选择**销毁委托**。
当权限必须永久保持时选择**[永久销毁委托](/zh/smart-contracts/core/plugins/permanent-burn-delegate)**。

{% /callout %}

## 常见用例

- **游戏机制**: 物品在游戏中被消耗、销毁或丢失时销毁 NFT
- **订阅服务**: 自动销毁过期订阅代币
- **制作系统**: 制作新物品时销毁原材料 NFT
- **成就兑换**: 兑换奖励时销毁成就代币
- **活动门票**: 活动签到后销毁门票
- **限时资产**: 到期后销毁资产

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ❌  |

## 参数

销毁插件不包含任何需要传入的参数。

## 向资产添加销毁插件

{% dialect-switcher title="向 MPL Core 资产添加销毁插件" %}
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

销毁委托插件权限可以使用 `approvePluginAuthority` 函数委托给不同的地址。这允许您更改谁可以销毁资产。

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

可以使用 `revokePluginAuthority` 函数撤销销毁权限，将控制权返还给资产所有者。

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

只有销毁委托权限可以销毁资产。验证您使用正确的密钥对签名。

### `Asset is frozen`

冻结的资产无法销毁。冻结权限必须先解冻资产。

## 注意事项

- 所有者管理：需要所有者签名才能添加
- 资产转移时权限自动撤销
- 冻结的资产无法销毁
- 如果需要权限在转移后保持，使用永久销毁委托
- 销毁立即执行且不可逆

## 快速参考

### 谁可以销毁？

| 权限 | 可以销毁？ |
|------|----------|
| 资产所有者 | 是（始终） |
| 销毁委托 | 是 |
| 永久销毁委托 | 是（强制批准） |
| 更新权限 | 否 |

## 常见问题

### 销毁委托和永久销毁委托有什么区别？

销毁委托权限在转移时被撤销。永久销毁委托权限永久保持，并使用 `forceApprove`，意味着即使资产被冻结也可以销毁。

### 有销毁委托时所有者仍然可以销毁吗？

是的。所有者始终可以销毁自己的资产，无论委托如何。

### 销毁委托对冻结的资产有效吗？

不。常规销毁委托无法销毁冻结的资产。如果需要销毁冻结的资产，请使用永久销毁委托。

### 销毁委托何时被撤销？

当资产转移给新所有者时。新所有者需要添加新的销毁委托。

## 相关插件

- [永久销毁委托](/zh/smart-contracts/core/plugins/permanent-burn-delegate) - 带有 forceApprove 的不可撤销销毁权限
- [冻结委托](/zh/smart-contracts/core/plugins/freeze-delegate) - 临时阻止转移和销毁
- [转移委托](/zh/smart-contracts/core/plugins/transfer-delegate) - 允许委托转移资产

## 术语表

| 术语 | 定义 |
|------|------|
| **销毁委托** | 允许委托销毁资产的所有者管理插件 |
| **所有者管理** | 需要所有者签名才能添加的插件类型 |
| **撤销** | 移除委托的销毁权限 |
| **永久销毁委托** | 转移后仍保持的不可撤销版本 |
| **forceApprove** | 永久插件绕过冻结限制的能力 |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
