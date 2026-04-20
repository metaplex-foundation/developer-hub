---
# Remember to also update the date in src/components/products/guides/index.js
title: 程序脚手架
metaTitle: 程序脚手架 | Metaplex CLI
description: 克隆 Metaplex 程序模板以启动新的链上程序项目。
keywords:
  - mplx CLI
  - program template
  - scaffolding
  - Solana program
  - Shank
about:
  - Metaplex CLI
  - Program Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox template program` 命令会将 Metaplex 维护的程序模板克隆到当前目录。

- 按照 Metaplex 约定预配置好，快速启动一个新的 Solana 程序项目。
- 未提供模板键时会启动交互式选择器。
- 要求 `PATH` 中可用 `git`。
- 前端模板请参阅 [`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website)。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox template program [template]` |
| 可选参数 | `template` — 可选值之一：`shank` |
| 交互式 | 是 — 省略参数时显示选择器 |
| 依赖 | `PATH` 中的 `git` |
| 副作用 | 克隆到当前工作目录 |

## 可用模板

可用的模板键对应 Metaplex 维护的仓库。

| 模板 | 描述 |
|----------|-------------|
| `shank` | 使用 Shank 生成 IDL 的 Solana 程序模板 2.0。 |

## 基本用法

不带参数运行该命令可交互式选择模板，或传入一个模板键以直接克隆。

```bash
# Launch an interactive template picker
mplx toolbox template program

# Clone a specific template
mplx toolbox template program <template>
```

## 参数

唯一的可选位置参数用于选择模板。

- `template` *(可选)*：模板键。若省略，则显示交互式选择器。

## 示例

这些示例展示了交互式选择器和直接克隆两种方式。

```bash
mplx toolbox template program
mplx toolbox template program shank
```

## 注意事项

- 模板通过 `git clone` 克隆到当前工作目录。
- 请确保已安装 `git` 并可在 `PATH` 中使用。
- 对于网站/前端模板，请使用 [`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website)。
