---
title: MPL Core中的印刷版本
metaTitle: 印刷版本 | Core指南
description: 本指南展示了如何在Metaplex Core协议中组合插件来创建版本。
updated: '01-31-2026'
keywords:
  - print editions
  - NFT editions
  - limited edition
  - master edition
about:
  - Edition creation
  - Print series
  - Edition plugins
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 创建带有Master Edition插件的Collection用于供应量跟踪
  - 创建带有Edition插件的Asset，包含版本号
  - 可选择使用Candy Machine Edition Guard进行自动编号
  - 确保版本正确链接到Master Edition Collection
howToTools:
  - Node.js
  - Umi框架
  - mpl-core SDK
---
## 入门
### 什么是版本？
版本是同一"主版本"的副本。理解这个概念可以想象一幅实体画：主版本是第一幅画，版本（也称为印刷品）是该画的副本。
### Core中的版本
MPL Core版本支持在主网发布后不久添加。与Token Metadata版本不同，版本号和供应量不是强制性的，仅供参考。
为了在Core中实现版本概念，使用了两个[插件](/smart-contracts/core/plugins)：Collection的[Master Edition](/smart-contracts/core/plugins/master-edition)和Asset（印刷品）的[Edition](/smart-contracts/core/plugins/edition)。层次结构如下：
{% diagram %}
{% node %}
{% node #master label="Master Edition" theme="indigo" /%}
{% /node %}
{% node y="50" parent="master" theme="transparent" %}
带有Master Edition插件的
Collection
{% /node %}
{% node x="200" y="-70" parent="master" %}
{% node #asset1 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset1" %}
{% node #asset2 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset2" %}
{% node #asset3 label="Edition" theme="blue" /%}
{% /node %}
{% node y="50" parent="asset3" theme="transparent" %}
带有Edition插件的
Asset
{% /node %}
{% edge from="master" to="asset1" /%}
{% edge from="master" to="asset2" /%}
{% edge from="master" to="asset3" /%}
{% /diagram %}
## 使用Candy Machine创建版本
创建和销售版本最简单的方法是利用Core Candy Machine。
详细的代码示例请参阅英文文档。
## 不使用Core Candy Machine创建版本
{% callout type="note" %}
强烈建议使用Core Candy Machine来处理MPL Core版本。Candy Machine处理版本创建和正确编号。
{% /callout %}
不使用Core Candy Machine创建版本：
1. 使用[Master Edition](/smart-contracts/core/plugins/master-edition)插件创建Collection
2. 创建带有[Edition](/smart-contracts/core/plugins/edition)插件的Asset。不要忘记增加插件中的编号。
## 相关信息
- [从Candy Machine铸造](/zh/smart-contracts/core-candy-machine/mint)
- [Master Edition插件](/smart-contracts/core/plugins/master-edition)
- [Edition插件](/smart-contracts/core/plugins/edition)
