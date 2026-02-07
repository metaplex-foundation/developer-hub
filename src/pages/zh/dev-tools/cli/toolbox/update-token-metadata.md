---
title: 更新代币元数据
metaTitle: 更新代币元数据 | Metaplex CLI
description: 更新现有代币的元数据
---

`mplx toolbox token update` 命令更新现有代币的元数据。您可以更新单个字段，也可以使用交互式编辑器修改完整的元数据 JSON。

## 基本用法

### 更新单个字段
```bash
mplx toolbox token update <mint> --name "New Name"
```

### 更新多个字段
```bash
mplx toolbox token update <mint> --name "New Name" --description "New Description" --image ./new-image.png
```

### 交互式编辑器
```bash
mplx toolbox token update <mint> --editor
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `MINT` | 要更新的代币的铸造地址 |

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--name <value>` | 代币的新名称 |
| `--symbol <value>` | 代币的新符号 |
| `--description <value>` | 代币的新描述 |
| `--image <value>` | 新图片文件路径 |
| `-e, --editor` | 在默认编辑器中打开元数据 JSON |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | 集群的 RPC URL |

## 示例

1. 更新名称：
```bash
mplx toolbox token update <mintAddress> --name "Updated Token Name"
```

2. 更新名称和描述：
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --description "此代币已更新"
```

3. 使用新图片更新：
```bash
mplx toolbox token update <mintAddress> \
  --name "Refreshed Token" \
  --image ./new-logo.png
```

4. 更新所有字段：
```bash
mplx toolbox token update <mintAddress> \
  --name "New Name" \
  --symbol "NEW" \
  --description "更新后的描述" \
  --image ./new-image.png
```

5. 使用交互式编辑器：
```bash
mplx toolbox token update <mintAddress> --editor
```

## 输出

```
--------------------------------

    Token Update

--------------------------------
Fetching token data... ✓
Token data fetched: My Token
Uploading Image... ✓
Uploading JSON file... ✓
Updating Token... ✓
Update transaction sent and confirmed.
Token successfully updated!
```

## 交互式编辑器模式

使用 `--editor` 时，CLI 将：
1. 从代币的 URI 获取当前元数据 JSON
2. 写入临时文件
3. 在默认编辑器中打开文件（`$EDITOR` 环境变量，或回退到 `nano`/`notepad`）
4. 等待您保存并关闭编辑器
5. 解析修改后的 JSON 并上传
6. 更新链上元数据

这对于对元数据结构或属性进行复杂更改非常有用。

## 注意事项

- 您必须提供至少一个更新标志（`--name`、`--description`、`--symbol`、`--image` 或 `--editor`）
- `--editor` 标志与所有其他更新标志互斥
- 更新字段时（不使用编辑器），将获取现有元数据并与您的更改合并
- 如果元数据获取失败，您必须提供所有字段以创建新元数据
- 编辑器使用 `$EDITOR` 环境变量，或默认使用 `nano`（Linux/macOS）或 `notepad`（Windows）
- 您必须是代币的更新权限持有者才能更新其元数据
