---
title: 资产签名者钱包
metaTitle: 资产签名者钱包 | Metaplex CLI
description: 将MPL Core资产的签名者PDA用作活动CLI钱包。所有命令自动以execute包装——无需自定义脚本即可从PDA转移SOL、代币和资产。
keywords:
  - mplx cli
  - asset-signer wallet
  - PDA wallet
  - MPL Core execute
  - signer PDA
  - metaplex cli asset signer
  - core execute
about:
  - MPL Core Asset-signer wallets
  - PDA wallet management
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
faqs:
  - q: 每个操作都需要单独的execute命令吗？
    a: 不需要。当资产签名者钱包处于活动状态时，每个CLI命令在发送时都会自动包装在execute指令中。使用`mplx toolbox sol transfer`或`mplx core asset create`等标准命令——这些操作不存在单独的execute子命令。
  - q: 如果资产所有者不在保存的钱包中会怎样？
    a: CLI将返回错误，要求您先添加所有者钱包。在注册资产签名者钱包之前，使用资产所有者的密钥对运行`mplx config wallets add <name> <keypair-path>`。
  - q: PDA签名时，其他钱包可以支付交易费用吗？
    a: 可以。在任何命令中传递`-p /path/to/fee-payer.json`。资产所有者仍然签署execute指令，但-p钱包支付Solana交易费用。
  - q: 哪些操作不能用execute包装？
    a: 大型账户创建（Merkle树、Candy Machine）和原生SOL包装由于Solana CPI大小限制而失败。先用普通钱包创建此基础设施，然后切换到资产签名者钱包进行后续操作。
  - q: 如何查看PDA解析到的地址？
    a: 运行`mplx core asset execute info <assetId>`。这将显示确定性签名者PDA地址及其当前SOL余额。
created: '03-19-2026'
updated: '03-19-2026'
---

## 概述

资产签名者钱包允许您将[MPL Core资产](/core)的签名者PDA用作活动CLI钱包。激活后，每个CLI命令都会自动将其指令包装在链上[`execute`](/dev-tools/cli/core/execute)指令中——无需自定义脚本。

- 使用`mplx config wallets add <name> --asset <assetId>`将任何Core资产注册为钱包
- 当资产签名者钱包处于活动状态时，所有CLI命令透明地通过PDA操作
- 资产所有者签署`execute`指令；可使用`-p`指定单独的费用支付者
- 部分操作受Solana CPI约束限制（大型账户创建、原生SOL包装）

## 快速开始

```bash {% title="Asset-signer wallet setup" %}
# 1. 创建资产（或使用您拥有的现有资产）
mplx core asset create --name "My Vault" --uri "https://example.com/vault"

# 2. 注册为钱包（从链上数据自动检测所有者）
mplx config wallets add vault --asset <assetId>

# 3. 查看PDA信息
mplx core asset execute info <assetId>

# 4. 为PDA注资
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 5. 切换到资产签名者钱包
mplx config wallets set vault

# 6. 以PDA身份使用任何命令
mplx toolbox sol balance
mplx toolbox sol transfer 0.01 <destination>
mplx core asset create --name "PDA Created NFT" --uri "https://example.com/nft"
```

## 资产签名者钱包工作原理

CLI使用noop-signer模式使PDA操作透明化。当资产签名者钱包处于活动状态时：

1. **`umi.identity`** 设置为具有PDA公钥的noop签名者——命令自然地使用PDA作为权限构建指令
2. **`umi.payer`** 也设置为PDA noop签名者——因此派生地址（ATA、代币账户）正确解析
3. **发送时**，交易被包装在[MPL Core的`execute`指令](/dev-tools/cli/core/execute)中，在链上代表PDA签名
4. **真实钱包**（资产所有者）签署外部交易并通过`setFeePayer`支付费用

## 注册资产签名者钱包

```bash {% title="Add asset-signer wallet" %}
mplx config wallets add <name> --asset <assetId>
```

`--asset`标志是与普通钱包的区别所在。CLI在链上获取资产、确定所有者，并与已保存的[钱包](/dev-tools/cli/config/wallets)进行匹配。如果所有者不在您的钱包列表中，您必须先添加所有者钱包。

注册后，使用标准[钱包命令](/dev-tools/cli/config/wallets)（`list`、`set`、`remove`）像管理其他钱包一样管理它。资产签名者钱包在钱包列表中显示为`asset-signer`类型。

{% callout type="note" %}
`-k`标志可以在单个命令中绕过活动钱包，包括资产签名者钱包。
{% /callout %}

## 单独的费用支付者

链上`execute`指令支持单独的权限和费用支付者账户。使用`-p`让另一个钱包支付交易费用，同时资产所有者签署execute：

```bash {% title="Separate fee payer" %}
mplx toolbox sol transfer 0.01 <destination> -p /path/to/fee-payer.json
```

资产所有者仍然签署`execute`指令。`-p`钱包仅支付Solana交易费用。

## 支持的命令

所有CLI命令都可以与资产签名者钱包配合使用。交易包装在发送层透明进行。

| 类别 | 命令 |
|------|------|
| **Core** | `asset create`, `asset transfer`, `asset burn`, `asset update`, `collection create` |
| **Toolbox SOL** | `balance`, `transfer`, `wrap`, `unwrap` |
| **Toolbox Token** | `transfer`, `create`, `mint` |
| **Toolbox Raw** | `raw --instruction <base64>` |
| **Token Metadata** | `transfer`, `create`, `update` |
| **Bubblegum** | `nft create`, `nft transfer`, `nft burn`, `collection create` |
| **Genesis** | `create`, `bucket add-*`, `deposit`, `withdraw`, `claim`, `finalize`, `revoke` |
| **Distribution** | `create`, `deposit`, `withdraw` |
| **Candy Machine** | `insert`, `withdraw` |

## CPI限制

由于Solana CPI约束，某些操作无法包装在`execute()`中：

- **大型账户创建** — Merkle树和Candy Machine超过CPI账户分配限制
- **原生SOL包装** — 向代币账户的`transferSol`在CPI上下文中失败

{% callout type="warning" %}
对于这些操作，请使用普通[钱包](/dev-tools/cli/config/wallets)或先创建基础设施，然后切换到资产签名者钱包进行后续操作。
{% /callout %}

## 使用Toolbox Raw执行原始指令

`mplx toolbox raw`命令执行任意base64编码的指令。当资产签名者钱包处于活动状态时，这些指令会自动包装在`execute()`中。

```bash {% title="Execute raw instructions" %}
# 单个指令
mplx toolbox raw --instruction <base64>

# 多个指令
mplx toolbox raw --instruction <ix1> --instruction <ix2>

# 从stdin读取
echo "<base64>" | mplx toolbox raw --stdin
```

### 构建原始指令

CLI包含用于构建base64编码指令的序列化辅助工具：

```typescript {% title="build-raw-instruction.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { serializeInstruction } from '@metaplex-foundation/cli/lib/execute/deserializeInstruction'

const signerPda = '<PDA address from execute info>'
const destination = '<destination address>'

// System Program SOL transfer
const data = new Uint8Array(12)
const view = new DataView(data.buffer)
view.setUint32(0, 2, true)             // Transfer discriminator
view.setBigUint64(4, 1_000_000n, true) // 0.001 SOL

const ix = {
  programId: publicKey('11111111111111111111111111111111'),
  keys: [
    { pubkey: publicKey(signerPda), isSigner: true, isWritable: true },
    { pubkey: publicKey(destination), isSigner: false, isWritable: true },
  ],
  data,
}

console.log(serializeInstruction(ix))
// Pass the output to: mplx toolbox raw --instruction <base64>
```

### 指令二进制格式

| 字节 | 字段 |
|------|------|
| 32 | 程序ID |
| 2 | 账户数量（u16小端序） |
| 每个账户33 | 32字节公钥 + 1字节标志（位0 = isSigner，位1 = isWritable） |
| 剩余 | 指令数据 |

## 快速参考

| 项目 | 值 |
|------|-----|
| 添加钱包 | `mplx config wallets add <name> --asset <assetId>` |
| 切换钱包 | `mplx config wallets set <name>` |
| 检查PDA | [`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute) |
| 覆盖 | 任何命令加`-k /path/to/keypair.json` |
| 费用支付者 | 任何命令加`-p /path/to/payer.json` |
| PDA派生 | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| 配置文件 | `~/.config/mplx/config.json` |
| 源码 | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 术语表

| 术语 | 定义 |
|------|------|
| 签名者PDA | 从[MPL Core资产](/core)派生的程序派生地址，可以持有SOL、代币和拥有其他资产 |
| Execute指令 | 允许PDA代表资产签署指令的[MPL Core](/core)链上指令 |
| Noop签名者 | 提供公钥但不产生签名的占位符签名者——用于使命令以PDA为目标构建指令 |
| CPI | 跨程序调用——一个Solana程序调用另一个程序；在CPI上下文中存在大小限制 |

## FAQ

### 每个操作都需要单独的execute命令吗？

不需要。当资产签名者钱包处于活动状态时，每个CLI命令在发送时都会自动包装在`execute`指令中。使用`mplx toolbox sol transfer`或`mplx core asset create`等标准命令——这些操作不存在单独的execute子命令。

### 如果资产所有者不在保存的钱包中会怎样？

CLI将返回错误，要求您先添加所有者钱包。在注册资产签名者钱包之前，使用资产所有者的密钥对运行`mplx config wallets add <name> <keypair-path>`。

### PDA签名时，其他钱包可以支付交易费用吗？

可以。在任何命令中传递`-p /path/to/fee-payer.json`。资产所有者仍然签署[`execute`](/dev-tools/cli/core/execute)指令，但`-p`钱包支付Solana交易费用。

### 哪些操作不能用execute包装？

大型账户创建（Merkle树、Candy Machine）和原生SOL包装由于Solana CPI大小限制而失败。先用普通[钱包](/dev-tools/cli/config/wallets)创建此基础设施，然后切换到资产签名者钱包进行后续操作。

### 如何查看PDA解析到的地址？

运行[`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute)。这将显示确定性签名者PDA地址及其当前SOL余额。

## 注意事项

- 资产签名者钱包要求资产所有者的钱包已保存在您的[钱包配置](/dev-tools/cli/config/wallets)中——请先添加所有者钱包
- 资产签名者钱包在配置文件中存储PDA地址、关联的资产ID和所有者钱包的引用
- 从资产签名者钱包切换后，命令将恢复为普通密钥对签名
- `-k`标志始终优先于活动钱包，包括资产签名者钱包
- 通过`mplx toolbox raw`的原始指令在资产签名者钱包处于活动状态时与其他命令一样包装在`execute()`中
