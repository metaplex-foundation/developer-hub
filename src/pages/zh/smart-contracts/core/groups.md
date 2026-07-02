---
title: Core 分组
metaTitle: Core 分组概述 | Metaplex Core
description: mpl-core GroupV1 账户概述 — 如何将合集、资产和嵌套分组组织在一起
updated: '07-02-2026'
keywords:
  - mpl-core groups
  - GroupV1
  - taxonomy
  - group collections
about:
  - NFT collections
  - Collection management
proficiencyLevel: Intermediate
faqs:
  - q: 合集和分组有什么区别？
    a: 合集在共享元数据和合集级插件下组织 Core 资产。分组是分类容器，可引用合集、独立资产和其他分组。合集回答“这个 NFT 属于哪个系列？”；分组回答“这个合集或资产属于哪个更高层级的集合？”
  - q: 一个合集可以属于多个分组吗？
    a: 可以。将合集加入分组时，mpl-core 会把父分组地址写入合集的 Groups 插件。合集最多可列出多个父分组，上限由链上向量限制决定。
  - q: 分组可以嵌套吗？
    a: 可以。分组可包含子分组，也可列出父分组。父子链接会在两个账户间保持同步。一个分组最多可属于 8 个父分组。
  - q: 已分组合集内的资产会自动属于该分组吗？
    a: 不会。分组成员关系只保存在直接成员上。将合集加入分组会把该合集加入 `group.collections` 并在合集上写入 Groups 插件；铸造到该合集的 NFT 不会自动加入 `group.assets`。
  - q: 独立资产可以直接成为分组成员吗？
    a: 可以。使用 `addAssetsToGroup` 可在无合集的情况下将资产直接加入 `group.assets`。在正确权限签名下，合集管理的资产也可显式添加。
  - q: 谁可以修改分组成员关系？
    a: 分组 update authority 签署添加/移除指令。对于合集管理的资产，合集 update authority（或授权 delegate）可代表分组添加或移除这些资产。
---

## 概述

**Core Groups**（`GroupV1`）是用于将[合集](/zh/smart-contracts/core/collections)、[资产](/zh/smart-contracts/core/what-is-an-asset)和其他分组组织到更高层级集合中的分类账户，例如包含多个合集的品牌伞形结构，或独立资产的策展目录。

- 分组与合集一样存储自己的 `name` 和 `uri`
- 每个向量最多可直接包含 **256** 个合集、子分组、父分组链接或资产
- 加入分组的合集和资产会获得列出父分组地址的 **Groups** 插件

**跳转到：** [创建分组](#创建分组) · [管理成员关系](#管理分组成员关系) · [获取分组](#获取分组)

## 合集与分组的区别

| | **合集** | **分组** |
| --- | --- | --- |
| 用途 | 一系列 NFT 的共享元数据和插件 | 对合集、资产、分组的分类/目录 |
| 是否拥有用户 NFT | 是 — 资产引用合集 | 否 — 资产仍留在原合集（如有） |
| 典型问题 | “这个 NFT 来自哪个系列？” | “哪个品牌、赛季或目录包含这个合集？” |
| 链上关系 | 资产 `updateAuthority` 指向合集 | 列在 `group.collections`、`group.assets` 或 `group.groups` |

需要系列级版税、冻结规则或共享素材时使用 **合集**；需要在不改变铸造方式的情况下，将多个合集或独立资产归到同一标签下时使用 **分组**。

## GroupV1 账户

`GroupV1` 账户存储：

| 字段 | 说明 |
| --- | --- |
| `updateAuthority` | 可更新分组并更改成员关系的权限 |
| `name` | 显示名称 |
| `uri` | 链下 JSON 元数据 URI |
| `collections` | 该分组的**直接**子合集 |
| `groups` | 该分组包含的子分组 |
| `parentGroups` | 包含该分组的父分组 |
| `assets` | 该分组的**直接**成员资产 |

链上限制（来自 mpl-core）：

- 每个向量（`collections`、`groups`、`parentGroups`、`assets`）最多 **256** 项
- 每个分组最多 **8** 个父分组（`MAX_GROUP_NESTING_DEPTH`）

{% callout type="note" %}
分组不会自动遍历合集成员关系。将合集加入分组不会把该合集内的 NFT 加入 `group.assets`。要操作已分组合集中的 NFT，请分别处理合集及其资产。
{% /callout %}

## Groups 插件

将合集或资产加入分组时，mpl-core 会确保该成员存在 **Groups** 权限管理插件，并存储父分组公钥。

Groups 插件还会在成员仍属于至少一个分组时，阻止**分组成员本身**（合集账户或直接加入分组的资产）被销毁。销毁已分组合集内的资产不会把该合集从分组中移除。

## 创建分组

使用 `createGroup` / `createGroupV1` 部署新分组账户：

{% code-tabs-imported from="core/create-group" frameworks="umi" /%}

创建时可传入 `relationships`，在单笔交易中链接合集、子分组、父分组或资产。每个 relationship 条目使用 `RelationshipKind`：`Collection`、`ChildGroup`、`ParentGroup`、`Asset`。

## 管理分组成员关系

除非另有说明，所有成员变更均由 **分组 update authority** 签名。

| 操作 | SDK 辅助函数 | 更新内容 |
| --- | --- | --- |
| 添加合集 | `addCollectionsToGroup` | 分组 `collections` + 合集 Groups 插件 |
| 移除合集 | `removeCollectionsFromGroup` | 双侧 |
| 添加资产 | `addAssetsToGroup` | 分组 `assets` + 资产 Groups 插件 |
| 移除资产 | `removeAssetsFromGroup` | 双侧 |
| 添加子分组 | `addGroupsToGroup` | 父级 `groups` + 子级 `parentGroups` |
| 移除子分组 | `removeGroupsFromGroup` | 双侧 |
| 更新元数据/权限 | `updateGroup` | 分组名称、URI、update authority |
| 关闭空分组 | `closeGroup` | 关闭分组账户 |

### 将合集添加到分组

{% code-tabs-imported from="core/add-collection-to-group" frameworks="umi" /%}

### 将独立资产添加到分组

{% code-tabs-imported from="core/add-asset-to-group" frameworks="umi" /%}

### 嵌套分组

{% code-tabs-imported from="core/nest-groups" frameworks="umi" /%}

父子向量保持同步：父分组在 `groups` 中列出子分组，子分组在 `parentGroups` 中列出父分组。

## 获取分组

使用 mpl-core SDK 读取链上状态：

{% code-tabs-imported from="core/fetch-group" frameworks="umi" /%}

按 update authority 列出分组可使用 `getGroupV1GpaBuilder`（GPA 查询）。分组数量通常较少问题不大，但扫描大量资产时仍应优先使用 DAS。

{% code-tabs-imported from="core/fetch-groups-by-authority" frameworks="umi" /%}

## 快速参考

### 程序 ID

| 网络 | 地址 |
| --- | --- |
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### SDK 辅助函数

| 任务 | 函数 |
| --- | --- |
| 创建 | `createGroup` |
| 获取 | `fetchGroupV1` |
| 按权限列出 | `getGroupV1GpaBuilder` |
| 更新 | `updateGroup` |
| 添加合集 | `addCollectionsToGroup` |
| 添加资产 | `addAssetsToGroup` |
| 嵌套 | `addGroupsToGroup` |
| 关闭 | `closeGroup` |
