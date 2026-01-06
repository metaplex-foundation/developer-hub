---
title: verify
metaTitle: verify | Sugar
description: verify 命令。
---

`verify` 命令检查缓存文件中的所有项目是否已成功写入链上：

```
sugar verify
```

要指定与默认 `cache.json` 不同的缓存文件，请使用 `--cache` 选项：

```
sugar verify --cache <CACHE>
```

如果部署成功，验证将不会返回错误。
