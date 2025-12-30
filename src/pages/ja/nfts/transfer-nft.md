---
title: NFTを転送する
metaTitle: NFTを転送する | NFT
description: Metaplex Coreを使用してSolana上でウォレット間でNFTを転送する方法を学びます
created: '03-12-2025'
updated: '03-12-2025'
---

Solana上でウォレット間でNFTの所有権を転送します。 {% .lead %}

## NFTを転送する

以下のセクションでは、完全なコード例と変更が必要なパラメータを確認できます。NFTの転送の詳細については、[Coreドキュメント](/ja/smart-contracts/core/transfer)をご覧ください。

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

## パラメータ

転送に合わせて以下のパラメータをカスタマイズしてください：

| パラメータ | 説明 |
|-----------|-------------|
| `assetAddress` | 転送するNFTの公開鍵 |
| `newOwner` | 受取人のウォレットアドレス |

## 仕組み

転送プロセスには3つの手順が含まれます：

1. **所有権を確認** - NFTの現在の所有者である必要があります
2. **受取人を指定** - 新しい所有者のウォレットアドレスを提供
3. **転送を実行** - NFTの所有権は即座に転送されます

## NFT転送

SPL/ファンジブルトークンとは異なり、Core NFTは受取人が事前にトークンアカウントを作成する必要がありません。所有権はNFTに直接記録されるため、転送がよりシンプルで安価になります。
