---
title: 锁定资产
metaTitle: 锁定资产 | Token Metadata
description: 了解如何在 Token Metadata 上锁定/冻结资产
---

如"[委托权限](/zh/smart-contracts/token-metadata/delegates#token-delegates)"页面所述,某些委托可以锁定和解锁资产,防止其所有者转移或销毁它们。锁定的资产还禁止所有者撤销委托的权限。这种锁定机制支持各种实用用例——例如质押——否则需要托管账户才能运行。{% .lead %}

在下表中,我们列出了所有支持锁定资产的代币委托。您可以在各自的部分中了解更多关于这些委托以及如何批准/撤销它们的信息。

| 委托                                                                        | 锁定/解锁 | 转移 | 销毁 | 适用于              |
| ------------------------------------------------------------------------------- | ----------- | -------- | ---- | ---------------- |
| [Standard](/zh/smart-contracts/token-metadata/delegates#standard-delegate)                         | ✅          | ✅       | ✅   | 除 pNFT 外的所有资产 |
| [Locked Transfer](/zh/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only) | ✅          | ✅       | ❌   | 仅限 pNFT       |
| [Utility](/zh/smart-contracts/token-metadata/delegates#utility-delegate-pnft-only)                 | ✅          | ❌       | ✅   | 仅限 pNFT       |
| [Staking](/zh/smart-contracts/token-metadata/delegates#staking-delegate-pnft-only)                 | ✅          | ❌       | ❌   | 仅限 pNFT       |

假设我们在资产上有一个已批准的代币委托,现在让我们看看委托如何锁定和解锁它。

## 锁定资产

### NFT

要锁定资产,委托可以使用 Token Metadata 程序的**锁定**指令。此指令接受以下属性：

- **Mint**：资产的铸造账户地址。
- **Authority**：授权锁定的签名者。这必须是委托权限。
- **Token Standard**：被锁定资产的标准。请注意,Token Metadata 程序并不明确要求此参数,但我们的 SDK 需要它,以便它们可以为大多数其他参数提供适当的默认值。

{% code-tabs-imported from="token-metadata/lock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/lock-pnft" frameworks="umi,kit" /%}

## 解锁资产

### NFT

相反,委托可以使用 Token Metadata 程序的**解锁**指令来解锁资产。此指令接受与**锁定**指令相同的属性,并且可以以相同的方式使用。

{% code-tabs-imported from="token-metadata/unlock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/unlock-pnft" frameworks="umi,kit" /%}
