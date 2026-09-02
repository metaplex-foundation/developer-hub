---
title: 更新
metaTitle: 更新 MPL-Distro 分发
description: 在不重新创建分发 PDA 的情况下更改 MPL-Distro 配置、权限方和 permissioned distributor。
keywords:
  - update MPL-Distro
  - change distribution authority
  - change Merkle root
  - permissioned distributor
about:
  - MPL-Distro
  - Distribution Updates
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
faqs:
  - q: 权限方可以在活动窗口期间更改 Merkle 根吗？
    a: 不可以。根、树高度、开始时间和 claimant 数量在整个活动窗口期间被锁定，但可以在开始前或结束后更改。
  - q: 可以在活动分发期间延长领取结束时间吗？
    a: 可以。权限方可以在分发处于活动状态时更新 endTime。
  - q: 新权限方需要签署权限更改吗？
    a: 不需要。只有当前权限方签署 updateDistribution。提交前请验证目标密钥。
---

当前 [MPL-Distro](/zh/smart-contracts/mpl-distro) 权限方可以更改选定的分发字段，而无需创建新 PDA 或使现有领取收据失效。 {% .lead %}

## 摘要

`updateDistribution` 将权限方批准的配置更改应用到现有分发。

- 仅在活动领取窗口外更改完整分配配置。
- 可以在领取期间更改权限方和 permissioned distributor 等运营字段。
- 将权限方更改视为立即且对安全敏感。
- 与任何根更新一起原子地发布替换 Merkle 证明。

## 快速开始

更新 MPL-Distro 分发是对现有账户的已签名配置更改。

1. 确认集群时间是否位于包含性 `startTime`–`endTime` 窗口内。
2. 只将应更改的字段传给 `updateDistribution`。
3. 如果 Merkle 根更改，同时替换每一份链下证明。
4. 确认后验证存储的权限方和 permissioned distributor。

## MPL-Distro 更新权限

当前权限方必须签署每一次分发更新。

| 字段 | 开始前 | 活动窗口期间 | 结束后 |
|---|---:|---:|---:|
| `merkleRoot` | Yes | No | Yes |
| `treeHeight` | Yes | No | Yes |
| `startTime` | Yes | No | Yes |
| `endTime` | Yes | Yes | Yes |
| `totalClaimants` | Yes | No | Yes |
| `newAuthority` | Yes | Yes | Yes |
| `name` | Yes | Yes | Yes |
| `newPermissionedDistributor` | Yes | Yes | Yes |

活动窗口包含两个边界时间戳。受保护的分配字段在 `startTime <= clusterTime <= endTime` 时被锁定。

{% callout title="根更新需要匹配的证明" type="warning" %}
更改 Merkle 根会使为先前根生成的每一份证明失效。请与链上更新原子地发布并保存替换分配文件。
{% /callout %}

## 更新 MPL-Distro 配置

只将应更改的字段传给 `updateDistribution`。

{% code-tabs-imported from="mpl-distro/update_distribution" frameworks="umi" filename="updateDistribution" /%}

当 `totalClaimants` 在没有显式 `treeHeight` 的情况下更改时，程序会推断最小高度。传入新准备的树返回的 `treeHeight` 更清晰，并避免将更新耦合到 claimant 数量推断。

## 更改分发权限方

`updateDistribution` 替换可以更新、存款、提取代币和提取补贴的签名者。

{% code-tabs-imported from="mpl-distro/change_distribution_authority" frameworks="umi" filename="changeDistributionAuthority" /%}

新权限方不需要签署更新。提交更改前请验证目标公钥，并确保其签名基础设施正在运行。

## 更改 Permissioned Distributor

`updateDistribution` 更改配置为 `AllowedDistributor.Permissioned` 的分发所接受的签名者。在 `updateDistribution` 上传递 `newPermissionedDistributor`。

此更改不会改变 Merkle 树或现有收据。先前 distributor 签署的进行中交易会在更新落地后失败。

## 更新错误

更新错误保护权限方和时间约束。

| 错误 | 含义 | 解决方法 |
|---|---|---|
| `DistributionStarted` | 在活动窗口期间更改了受保护的分配字段 | 等到分发结束或保持该字段不变 |
| `InvalidDistributionAuthority` | 提供的签名者不是存储的权限方 | 使用当前权限方 |
| `InvalidTreeHeight` | 树高度超过最大值 | 使用不超过 64 的值 |
| `NameTooLong` | UTF-8 名称超过 32 字节 | 缩短分发名称 |

## 注意事项

配置更改在确认后立即影响证明有效性和运营权限。

- 在活动窗口期间更改 `endTime` 可以延长或缩短领取期。
- 窗口后的根更新不会删除现有领取收据。
- 现有收据在更新后仍键控到分发 PDA。

## 常见问题

### 权限方可以在活动窗口期间更改 Merkle 根吗？

不可以。根、树高度、开始时间和 claimant 数量在整个活动窗口期间被锁定，但可以在开始前或结束后更改。

### 可以在活动分发期间延长领取结束时间吗？

可以。权限方可以在分发处于活动状态时更新 `endTime`。

### 新权限方需要签署权限更改吗？

不需要。只有当前权限方签署 `updateDistribution`。提交前请验证目标密钥。
