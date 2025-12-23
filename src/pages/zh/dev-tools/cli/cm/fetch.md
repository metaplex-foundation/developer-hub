---
title: "获取信息"
metaTitle: "MPLX CLI - 获取 Candy Machine 信息"
description: "使用 MPLX CLI 获取和显示 MPL Core Candy Machine 信息。查看配置、守卫设置、项目状态和部署详细信息。"
---

`mplx cm fetch` 命令检索并显示有关 candy machine 的全面信息,包括配置、守卫设置、项目状态和部署详细信息。此命令对于监控和验证您的 candy machine 设置至关重要。

## 用法

```bash
# 从当前 candy machine 目录获取信息
mplx cm fetch

# 通过地址获取特定 candy machine
mplx cm fetch <candy_machine_address>

```

fetch 命令支持一个额外的标志用于详细信息:

- `--items`: 包含有关已加载项目的详细信息

## 相关命令

- [`mplx cm create`](/zh/dev-tools/cli/cm/create) - 创建要获取的 candy machine
- [`mplx cm insert`](/zh/dev-tools/cli/cm/insert) - 加载项目(影响项目计数)
- [`mplx cm validate`](/zh/dev-tools/cli/cm/validate) - 验证缓存与链上数据
- [`mplx cm withdraw`](/zh/dev-tools/cli/cm/withdraw) - 检查状态后清理
