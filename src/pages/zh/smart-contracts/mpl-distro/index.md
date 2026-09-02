---
title: MPL-Distro
metaTitle: MPL-Distro - Solana 上的 Merkle 代币领取与空投
description: 将现有 SPL 代币分发给钱包或旧版 NFT 持有者。MPL-Distro 在链上存储 Merkle 根，而不是完整接收方列表。
keywords:
  - MPL-Distro
  - Solana token distribution
  - Merkle airdrop
  - token claim
  - SPL token distribution
  - legacy NFT holder rewards
about:
  - MPL-Distro
  - Token Distribution
  - Merkle Claims
proficiencyLevel: Intermediate
created: '08-25-2026'
updated: '08-27-2026'
faqs:
  - q: MPL-Distro 用于什么？
    a: MPL-Distro 通过 Merkle 证明，将现有 SPL 代币分配分发给钱包地址或旧版 NFT mint 的固定列表。
  - q: MPL-Distro 是代币发射台吗？
    a: 不是。MPL-Distro 分发已有 mint。若需要代币生成事件、销售、Launch Pool 或联合曲线，请使用 Genesis。
  - q: 能否由他人为接收方支付交易费？
    a: 可以。Permissionless 分发允许任意支付方提交接收方的有效领取；Recipient 和 Permissioned 模式会限制谁可以提交。
  - q: MPL-Distro 支持归属（vesting）吗？
    a: 不支持。MPL-Distro 在一次领取中释放每笔 Merkle 分配。基于时间表的项目分配请使用 Genesis 项目归属。
---

**MPL-Distro** 是一个 Solana 程序，将现有 [SPL 代币](/zh/solana/spl-tokens-and-token-programs) 分发给钱包或 [旧版 NFT](/zh/smart-contracts/token-metadata) 持有者列表。它在链上存储紧凑的 Merkle 根，而不是完整接收方列表。 {% .lead %}

## 摘要

MPL-Distro 将接收方列表提交为一个链上 Merkle 根，把代币放在金库中，并记录每次成功领取，使其无法被重复使用。

- 分发现有 SPL 代币 mint，无需在链上存储完整接收方列表。
- 面向钱包地址，或特定旧版 NFT mint 的当前持有者。
- 选择 Permissionless、仅接收方，或 permissioned 领取提交。
- 领取窗口结束后回收未领取代币和未使用的收据租金补贴。

{% quick-links %}
{% quick-link title="构建分发" icon="InboxArrowDown" href="/zh/smart-contracts/mpl-distro/getting-started" description="创建、注资并领取钱包分发。" /%}
{% quick-link title="在生产中交付领取" icon="PaperAirplane" href="/zh/smart-contracts/mpl-distro/production-delivery" description="存储证明、运行领取页面或 API，并回收未领取代币。" /%}
{% quick-link title="选择分发类型" icon="ArrowsRightLeft" href="/zh/smart-contracts/mpl-distro/wallet-distribution" description="比较钱包与旧版 NFT 分配模型。" /%}
{% quick-link title="CLI" icon="CodeBracketSquare" href="/zh/dev-tools/cli/distro" description="从终端创建、注资、查看并回收分发。" /%}
{% /quick-links %}

## MPL-Distro 分发模型

Merkle 树将接收方列表变成一个 32 字节哈希（根）。每个接收方随后用一段短证明表明自己在该列表上，因此完整列表不必存在链上。

1. 分发权限方构建包含每个接收方、amount 和可选 nonce 的链下列表。
2. `prepareDistribution` 创建 Merkle 根和每笔分配的证明。
3. `createDistribution` 存储根、领取窗口、mint 和访问规则。
4. `deposit` 将全部代币分配转入分发的 associated token account。
5. `distribute` 或 `distributeToLegacyNft` 验证证明并创建永久领取收据。
6. `withdraw` 在分发变为非活动后返还未领取代币。

{% callout title="存储领取数据" type="warning" %}
程序只存储 Merkle 根，不存储接收方列表或证明。请将每笔分配的地址、amount、nonce 和证明保存在数据库或可下载的领取文件中。
{% /callout %}

## MPL-Distro 分发类型

MPL-Distro 通过不同的领取指令支持钱包地址分配和旧版 NFT mint 分配。

| 分发类型 | Merkle 叶子 identity | 领取指令 | 最适合 |
|---|---|---|---|
| `Wallet` | 钱包或其他公钥 | `distribute` | 津贴、贡献者奖励和直接代币空投 |
| `LegacyNft` | 旧版 NFT mint | `distributeToLegacyNft` | 由 NFT 当前代币账户所有者领取的奖励 |

`LegacyNft` 类型向当前拥有所列 NFT mint 的钱包付款。哪些 NFT 符合条件以及如何检查所有权，见 [旧版 NFT 分发](/zh/smart-contracts/mpl-distro/legacy-nft-distribution)。

## MPL-Distro Allowed Distributor 模式

Allowed distributor 模式控制谁可以提交有效的 Merkle 领取交易。

| 模式 | 必需签名者 | 行为 |
|---|---|---|
| `Permissionless` | 任意支付方 | 服务或第三方可以代表接收方提交领取 |
| `Recipient` | 接收方钱包或旧版 NFT 所有者 | 受益人必须批准领取 |
| `Permissioned` | 配置的 distributor | 只有指定的一个 distributor 可以提交领取 |

Permissionless 提交不会改变代币去向：程序始终将分配发送到接收方的规范 [associated token account](/zh/solana/understanding-solana-accounts#associated-token-accounts-atas)。

## MPL-Distro 协议费

成功的 Merkle 领取会收取协议费，由领取交易的支付方支付。

{% protocol-fees program="mpl-distro" config="claim" showTitle=false /%}

各 Metaplex 程序的当前金额见 [协议费](/zh/protocol-fees)。

## 注意事项

MPL-Distro 的链上检查保护领取，但不能替代链下分配校验。

- `totalClaimants` 是元数据，并不限制有效证明的数量。
- 存款不会与所有 Merkle 分配之和对照。请在领取开始前向金库存入足够代币。
- 领取收据不会被关闭，因此租金保持已分配。
- 程序面向原始 SPL Token 程序，而不是 Token-2022。
- MPL-Distro 不提供归属、流式支付、部分领取或结构化程序事件。

## 常见问题

### MPL-Distro 用于什么？

MPL-Distro 通过 Merkle 证明，将现有 SPL 代币分配分发给钱包地址或旧版 NFT mint 的固定列表。

### MPL-Distro 是代币发射台吗？

不是。MPL-Distro 分发已有 mint。若需要代币生成事件、销售、Launch Pool 或联合曲线，请使用 [Genesis](/zh/smart-contracts/genesis)。

### 能否由他人为接收方支付交易费？

可以。Permissionless 分发允许任意支付方提交接收方的有效领取；`Recipient` 和 `Permissioned` 模式会限制谁可以提交。

### MPL-Distro 支持归属（vesting）吗？

不支持。MPL-Distro 在一次领取中释放每笔 Merkle 分配。基于时间表的项目分配请使用 [Genesis 项目归属](/zh/smart-contracts/genesis/project-vesting)。

## 术语表

MPL-Distro 使用 Merkle 证明和确定性账户来验证并记录代币分配。

| 术语 | 定义 |
|---|---|
| Distribution | 包含代币 mint、Merkle 根、时间窗口、权限方和领取合计的程序账户 |
| Distribution authority | 可以更新配置、存入代币并回收未领取资金的钱包 |
| Merkle tree | 生成链上根和每笔分配证明的链下结构 |
| Merkle root | 对完整链下分配列表的 32 字节承诺 |
| Merkle proof | 证明一笔分配属于已提交树的兄弟哈希 |
| Claim receipt | 证明一笔 `(distribution, recipient, amount, nonce)` 分配已被领取的 [PDA](/zh/solana/understanding-pdas) |
| Nonce | 区分其他方面相同的接收方和 amount 叶子的数字 |
| Token base units | mint 的最小单位。6 位小数的代币每 1.0 代币为 `1_000_000` 单位 |
| Receipt subsidy | 分发 PDA 可选持有、用于报销领取收据租金的 SOL |
