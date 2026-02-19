---
title: sign
metaTitle: sign | Sugar
description: signコマンド。
---

`sign`コマンドを使用すると、クリエイターのキーペアですべてのNFTに署名して、NFTメタデータのクリエイター配列でそのクリエイターを検証できます。各クリエイターは自分自身にのみ署名でき、このコマンドでは一度に1人のクリエイターのみが署名できます。クリエイターのキーペアは`--keypair`オプションで渡すことができ、そうでなければSolana CLI設定で指定されたデフォルトのキーペアを使用するデフォルトになります。

デフォルトのキーペアでコマンドを実行：

```
sugar sign
```

特定のキーペアで実行：

```
sugar sign -k creator-keypair.json
```

開発者は以下のコマンドでカスタムRPC URLを提供できます：
```
sugar sign -r <RPC_URL>
```
注意：`sugar sign`の使用は、Metaplex Token Metadataプログラム（つまり、`metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`）の非効率な`getProgramAccounts`呼び出しに依存します。推奨される解決策は、以下のコマンドを使用してNFTを個別に署名することです：
```
sugar sign -m <MINT_ADDRESS>
```
