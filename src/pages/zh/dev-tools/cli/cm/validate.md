---
title: "验证缓存"
metaTitle: "MPLX CLI - 验证缓存命令"
description: "使用 MPLX CLI 验证 candy machine 资产缓存和上传。全面验证、错误检测和缓存完整性验证。"
---

`mplx cm validate` 命令验证资产缓存文件,以确保所有资产都已正确上传且可访问。它提供全面的验证、错误检测和缓存完整性验证。

## 用法

```bash
# 验证当前 candy machine 目录中的缓存
mplx cm validate

# 验证特定缓存文件
mplx cm validate <path_to_asset_cache>

# 验证链上插入(需要 candy machine 存在)
mplx cm validate --onchain
```

如果验证命令显示问题,根据错误,您可能需要检查资产的问题或运行上传或插入命令。

## 相关命令

- [`mplx cm upload`](/zh/dev-tools/cli/cm/upload) - 上传资产并创建缓存
- [`mplx cm create`](/zh/dev-tools/cli/cm/create) - 创建 candy machine
- [`mplx cm insert`](/zh/dev-tools/cli/cm/insert) - 插入已验证的资产
- [`mplx cm fetch`](/zh/dev-tools/cli/cm/fetch) - 检查 candy machine 状态

## 下一步

1. **[修复在验证期间发现的任何问题](/zh/dev-tools/cli/cm/upload)**
2. **[创建 candy machine](/zh/dev-tools/cli/cm/create)** 如果缓存有效
3. **[插入项目](/zh/dev-tools/cli/cm/insert)** 加载资产
4. **[监控部署](/zh/dev-tools/cli/cm/fetch)** 确保成功
