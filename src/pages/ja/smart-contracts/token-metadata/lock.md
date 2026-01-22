---
title: アセットのロック
metaTitle: アセットのロック | Token Metadata
description: Token Metadataでアセットをロック/フリーズする方法を学習します
---

「[委任された権限](/ja/smart-contracts/token-metadata/delegates#token-delegates)」ページで述べられているように、特定の委任はアセットをロックおよびロック解除でき、所有者がそれらを転送またはバーンすることを防ぐことができます。ロックされたアセットはまた、所有者が委任の権限を取り消すことも禁止します。このロック機能により、エスクローアカウントなしでは機能しない様々なユーティリティの使用例（ステーキングなど）が可能になります。 {% .lead %}

以下の表で、アセットのロックをサポートするすべてのToken委任をリストします。これらの各委任の詳細と、それらを承認/取り消す方法については、それぞれのセクションで学ぶことができます。

| 委任                                                                                | ロック/ロック解除 | 転送 | バーン | 対象              |
| ----------------------------------------------------------------------------------- | ----------------- | ---- | ------ | ---------------- |
| [Standard](/ja/smart-contracts/token-metadata/delegates#standard-delegate)                         | ✅                | ✅   | ✅     | pNFT以外すべて   |
| [Locked Transfer](/ja/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only) | ✅                | ✅   | ❌     | pNFTのみ         |
| [Utility](/ja/smart-contracts/token-metadata/delegates#utility-delegate-pnft-only)                 | ✅                | ❌   | ✅     | pNFTのみ         |
| [Staking](/ja/smart-contracts/token-metadata/delegates#staking-delegate-pnft-only)                 | ✅                | ❌   | ❌     | pNFTのみ         |

アセットに承認されたToken委任があると仮定して、委任がそれをロックおよびロック解除する方法を見てみましょう。

## アセットのロック

### NFT

アセットをロックするには、委任がToken Metadataプログラムの**Lock**命令を使用できます。この命令は以下の属性を受け取ります：

- **Mint**: アセットのMintアカウントのアドレス。
- **Authority**: ロックを承認する署名者。これは委任された権限である必要があります。
- **Token Standard**: ロックされるアセットの標準。Token Metadataプログラムは明示的にこの引数を必要としませんが、SDKが他のほとんどのパラメーターに適切なデフォルト値を提供できるようにするために必要です。

{% code-tabs-imported from="token-metadata/lock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/lock-pnft" frameworks="umi,kit" /%}

## アセットのロック解除

### NFT

相互に、委任はToken Metadataプログラムの**Unlock**命令を使用してアセットをロック解除できます。この命令は**Lock**命令と同じ属性を受け取り、同じ方法で使用できます。

{% code-tabs-imported from="token-metadata/unlock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/unlock-pnft" frameworks="umi,kit" /%}
