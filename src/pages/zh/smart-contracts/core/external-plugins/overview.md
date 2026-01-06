---
title: 外部插件
metaTitle: 外部插件 | Core
description: 了解 MPL Core 外部插件及其功能。
---

## 什么是外部插件？

外部插件是[权限管理的](/zh/smart-contracts/core/plugins#authority-managed-plugins)，由 2 部分组成：**适配器**和**插件**。**插件适配器**被分配给 Assets/Collection，允许从外部插件传递数据和验证。外部插件为**插件适配器**提供数据和验证。

## 生命周期检查

每个外部插件都具有将生命周期检查分配给生命周期事件的能力，影响正在发生的生命周期事件的行为。可用的生命周期检查有：

- Create（创建）
- Transfer（转移）
- Update（更新）
- Burn（销毁）

每个生命周期事件可以分配以下检查：

- Can Listen（可监听）
- Can Reject（可拒绝）
- Can Approve（可批准）

### Can Listen

一种 web3 类型的 webhook，在生命周期事件发生时提醒插件。这对于跟踪数据或基于已发生的事件执行另一个任务很有用。

### Can Reject

插件有能力拒绝生命周期事件的操作。

### Can Approve

插件有能力批准生命周期事件。

## 数据权限

外部插件可能有一个数据区域，项目可以在其中安全地存储该特定插件的数据。

外部插件的数据权限是唯一允许写入外部插件数据部分的权限。除非更新权限同时也是数据权限，否则更新权限没有权限。

## 插件

### Oracle 插件

Oracle 插件旨在简化 web 2.0-3.0 工作流程。Oracle 插件可以访问 MPL Core Asset 外部的链上 Oracle 账户，该账户可以拒绝权限设置的生命周期事件的使用。外部 Oracle 账户也可以随时更新以更改生命周期事件的授权行为，从而实现动态体验。

您可以在[这里](/zh/smart-contracts/core/external-plugins/oracle)阅读更多关于 Oracle 插件的信息。
