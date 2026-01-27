---
title: アセットの転送
metaTitle: アセットの転送 | Token Metadata
description: Token Metadataでアセットを転送する方法を学習します
---

アセットの所有者は、Token Metadataプログラムに**Transfer**命令を送信することで、アセットを別のアカウントに転送できます。この命令は以下の属性を受け取ります：

- **Authority**: 転送を承認する署名者。通常、これはアセットの所有者ですが、「[委任された権限](/ja/smart-contracts/token-metadata/delegates)」ページで説明されているように、特定の委任された権限も所有者の代わりにアセットを転送できることに注意してください。
- **Token Owner**: アセットの現在の所有者の公開鍵。
- **Destination Owner**: アセットの新しい所有者の公開鍵。
- **Token Standard**: 転送されるアセットの標準。この命令は、アセットを転送するための統一されたインターフェースを提供するために、すべてのToken Standardで動作します。つまり、プログラマブルでないアセットはSPL TokenプログラムのTransfer命令を直接使用して転送できることに注意する価値があります。

以下は、Token Metadataでアセットを転送するためのSDKの使用方法です。

## NFTの転送

{% code-tabs-imported from="token-metadata/transfer-nft" frameworks="umi,kit" /%}

## pNFTの転送

プログラマブルNFT（pNFT）は、転送中に処理する必要がある追加の認証ルールを持つ場合があります。命令は自動的にToken Recordアカウントを処理します。

{% code-tabs-imported from="token-metadata/transfer-pnft" frameworks="umi,kit" /%}

### 高度なpNFT転送

複雑な認証ルールを持つpNFTの場合、追加のパラメータを提供する必要がある場合があります。

{% code-tabs-imported from="token-metadata/transfer-pnft-advanced" frameworks="umi,kit" /%}
