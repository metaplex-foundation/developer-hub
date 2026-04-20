---
# Remember to also update the date in src/components/products/guides/index.js
title: 网站脚手架
metaTitle: 网站脚手架 | Metaplex CLI
description: 克隆 Metaplex 网站模板以启动新的前端项目。
keywords:
  - mplx CLI
  - website template
  - scaffolding
  - Next.js
  - Tailwind
  - shadcn
about:
  - Metaplex CLI
  - Website Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox template website` 命令会将 Metaplex 维护的网站模板克隆到当前目录。

- 快速启动一个为 Metaplex 流程预先接好线的 Next.js + Tailwind 前端项目。
- 未提供模板时会启动交互式选择器。
- 通过 `--template` 标志（而非位置参数）来选择模板。
- 要求 `PATH` 中可用 `git`。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox template website [--template <key>]` |
| 可选标志 | `--template <key>` |
| 交互式 | 是 — 省略 `--template` 时显示选择器 |
| 依赖 | `PATH` 中的 `git` |
| 副作用 | 克隆到当前工作目录 |

## 可用模板

可用的模板键对应 Metaplex 维护的仓库。

| 模板 | 描述 |
|----------|-------------|
| `standard - nextjs-tailwind` | Next.js + Tailwind 入门项目。 |
| `standard - nextjs-tailwind-shadcn` | Next.js + Tailwind + shadcn/ui 入门项目。 |
| `404 - nextjs-tailwind-shadcn` | MPL Hybrid 404 UI 入门项目（Next.js + Tailwind + shadcn/ui）。 |

## 基本用法

不带标志运行该命令可交互式选择模板，或传入 `--template` 以直接克隆。

```bash
# Launch an interactive template picker
mplx toolbox template website

# Clone a specific template
mplx toolbox template website --template "<template-key>"
```

## 标志

唯一的可选标志用于选择模板。

- `--template <key>` *(可选)*：模板键。若省略，则显示交互式选择器。

## 示例

这些示例展示了交互式选择器和直接克隆两种方式。

```bash
mplx toolbox template website
mplx toolbox template website --template "standard - nextjs-tailwind"
```

## 注意事项

- 模板通过 `git clone` 克隆到当前工作目录。
- 请确保已安装 `git` 并可在 `PATH` 中使用。
- 对于链上程序模板，请使用 [`toolbox template program`](/dev-tools/cli/toolbox/scaffolding-program)。
