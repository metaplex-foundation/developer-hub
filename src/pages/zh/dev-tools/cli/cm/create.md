---
title: "创建 Candy Machine"
metaTitle: "MPLX CLI - 创建 Candy Machine 命令"
description: "使用 MPLX CLI 创建 MPL Core Candy Machine。交互式向导模式,具有验证、资产上传和完整设置自动化。"
---

`mplx cm create` 命令创建一个新的 MPL Core Candy Machine,具有可配置的设置和资产上传。它为初学者提供交互式向导,为高级用户提供手动配置。

## 用法

```bash
# 交互式向导(推荐)
mplx cm create --wizard

# 创建目录模板
mplx cm create --template

# 手动创建(需要现有的 cm-config.json)
mplx cm create
```

## 前置资产

无论您选择哪种模式(向导或手动),您都需要准备好您的资产。如果您想使用虚拟资产试用,可以使用 `mplx cm create --template` 创建它们。所有图像和元数据文件都应该在它们自己的 `assets` 文件夹中。

*图像文件:*

- **格式**: PNG、JPG
- **命名**: 顺序(0.png、1.png、2.png、...)

*元数据文件:*

- **格式**: JSON
- **命名**: 匹配图像文件(0.json、1.json、2.json、...)
- **架构**: 标准 [Metaplex Core 元数据格式](/zh/core/json-schema)

*集合文件:*

- **collection.png**: 集合图像
- **collection.json**: 集合元数据

## 模板模式

创建一个基本的目录结构以开始:

```bash
mplx cm create --template
```

这将创建以下结构,但不会创建 candy machine。

```text
candy-machine-template/
├── assets/
│   ├── 0.png              # 示例图像
│   ├── 0.json             # 示例元数据
│   ├── collection.png     # 示例集合图像
│   └── collection.json    # 示例集合元数据
└── cm-config.json         # 示例配置
```

创建模板后:

1. 用您的实际文件替换示例资产
2. 更新 `cm-config.json` 中的配置
3. 运行 `mplx cm create` 进行部署

## 交互式向导模式

向导提供引导式、用户友好的体验,具有全面的验证和进度跟踪。**这是大多数用户推荐的方法。**

### 向导工作流

1. 项目设置
2. 资产发现和验证
3. 集合配置
4. Candy Machine 和 Candy Guard 设置
5. 资产上传和处理
6. Candy Machine 创建
7. 项目插入

## 手动配置模式

适用于需要完全控制配置过程的高级用户。

### 前置条件

1. **Candy machine 资产目录**具有适当的结构
2. **手动创建的 `cm-config.json`**具有所需的配置。请参见下面的示例
3. **准备好的资产**在 `assets/` 目录中,结构如下所示

### 目录结构

```text
my-candy-machine/
├── assets/
│   ├── 0.png
│   ├── 0.json
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png
│   └── collection.json
└── cm-config.json          # 必需
```

### 配置文件格式

使用以下结构创建 `cm-config.json`:

```json
{
  "name": "My Candy Machine",
  "config": {
    "collection": "CollectionPublicKey...",  // 现有集合
    "itemsAvailable": 100,
    "isMutable": true,
    "isSequential": false,
    "guardConfig": {
      "solPayment": {
        "lamports": 1000000000,
        "destination": "111111111111111111111111111111111"
      },
      "mintLimit": {
        "id": 1,
        "limit": 1
      }
    },
    "groups": [
      {
        "label": "wl",
        "guards": {
          "allowList": {
            "merkleRoot": "MerkleRootHash..."
          },
          "solPayment": {
            "lamports": 500000000,
            "destination": "111111111111111111111111111111111"
          }
        }
      }
    ]
  }
}
```

### 手动工作流

```bash
# 1. 导航到您的 candy machine 目录
cd ./my-candy-machine

# 2. 使用现有配置创建 candy machine
mplx cm create

# 3. 将资产上传到存储
mplx cm upload

# 4. 将项目插入 candy machine
mplx cm insert

# 5. 验证设置(可选)
mplx cm validate
```

## 配置选项

### 核心设置

| 设置 | 描述 | 必需 |
|---------|-------------|----------|
| `name` | candy machine 的显示名称 | ✅ |
| `itemsAvailable` | 要铸造的项目总数 | ✅ |
| `isMutable` | NFT 在铸造后是否可以更新 | ✅ |
| `isSequential` | 是否按顺序铸造项目 | ✅ |
| `collection` | 现有集合地址(可选) | ❌ |

### 守卫配置

**全局守卫** (`guardConfig`):

- 应用于所有组和整个 candy machine
- 不能被组守卫覆盖
- 对通用限制有用

**守卫组** (`groups`):

- 仅应用于特定组
- 允许每个铸造阶段有不同的规则
- 组标签最多 6 个字符

### 常见守卫示例

#### 基本公开销售

```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "YourWalletAddress..."
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

#### 白名单阶段

```json
{
  "groups": [
    {
      "label": "wl",
      "guards": {
        "allowList": {
          "merkleRoot": "MerkleRootHash..."
        },
        "solPayment": {
          "lamports": 500000000,
          "destination": "YourWalletAddress..."
        }
      }
    }
  ]
}
```

### 获取帮助

- 使用 `mplx cm create --help` 查看命令选项
- 加入 [Metaplex Discord](https://discord.gg/metaplex) 获取支持

## 相关命令

- [`mplx cm upload`](/zh/dev-tools/cli/cm/upload) - 将资产上传到存储
- [`mplx cm insert`](/zh/dev-tools/cli/cm/insert) - 将项目插入 candy machine
- [`mplx cm validate`](/zh/dev-tools/cli/cm/validate) - 验证资产缓存
- [`mplx cm fetch`](/zh/dev-tools/cli/cm/fetch) - 查看 candy machine 信息

## 下一步

1. **[上传资产](/zh/dev-tools/cli/cm/upload)** 如果手动创建
2. **[插入项目](/zh/dev-tools/cli/cm/insert)** 将资产加载到 candy machine
3. **[验证您的设置](/zh/dev-tools/cli/cm/validate)** 确保一切正常
4. **[了解守卫](/zh/smart-contracts/core-candy-machine/guards)** 进行高级配置
