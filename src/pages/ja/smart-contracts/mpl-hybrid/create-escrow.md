---
title: MPL 404 Hybridエスクローの作成
metaTitle: MPL 404 Hybridエスクローの作成 | MPL-Hybrid
description: 404スワップを可能にするMPL 404 Hybridエスクローアカウントの作成方法を学びましょう。
---

## 前提条件

- MPL Coreコレクション - [リンク](/ja/smart-contracts/core/guides/javascript/how-to-create-a-core-collection-with-javascript)
- コレクションにミントされたCore NFTアセット - [リンク](/ja/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)
- 必要なトークン量で作成されたSPLトークン。 - [リンク](/ja/guides/javascript/how-to-create-a-solana-token)
- 一貫したゲートウェイ/uriでの連続メタデータJSONファイルのオンラインストレージ。

エスクローの初期化は、NFTコレクションと代替可能トークンをリンクする重要なステップです。このステップを開始する前に、Coreコレクションアドレス、代替可能トークンミントアドレス、そして数値的に命名された連続ファイルを使用するオフチェーンメタデータURIの範囲を準備しておく必要があります。Base URI文字列の一貫性の必要性により、一部のオフチェーンメタデータオプションが制限されます。メタデータの更新を実行するには、エスクローのオーソリティがコレクションのオーソリティと一致する必要があることに注意してください。また、エスクローが資金提供されるため、トークンオーソリティである必要がなく、コレクションを既存のミームコインや他の代替可能アセットで裏付けることが可能です。

## MPL-Hybridエスクローアカウント構造

MPL Hybridエスクローは、プロジェクトに関するすべての情報を格納するプログラムの中核です。

{% totem %}
{% totem-accordion title="オンチェーンMPL-404エスクローデータ構造" %}

MPL-404エスクローのオンチェーンアカウント構造 [リンク](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

| 名前           | タイプ   | サイズ | 説明                                      |     |
| -------------- | ------ | ---- | ---------------------------------------- | --- |
| collection     | Pubkey | 32   | コレクションアカウント                           |     |
| authority      | Pubkey | 32   | エスクローのオーソリティ                      |     |
| token          | Pubkey | 32   | 配布される代替可能トークン               |     |
| fee_location   | Pubkey | 32   | トークン手数料を送信するアカウント                |     |
| name           | String | 4    | NFT名                                     |     |
| uri            | String | 8    | NFTメタデータのベースuri                |     |
| max            | u64    | 8    | uriに追加されるNFTの最大インデックス     |     |
| min            | u64    | 8    | uriに追加されるNFTの最小インデックス |     |
| amount         | u64    | 8    | スワップのトークンコスト                           |     |
| fee_amount     | u64    | 8    | NFT取得のためのトークン手数料              |     |
| sol_fee_amount | u64    | 8    | NFT取得のためのSOL手数料                |     |
| count          | u64    | 8    | スワップの総数                        |     |
| path           | u16    | 1    | オンチェーン/オフチェーンメタデータ更新パス       |     |
| bump           | u8     | 1    | エスクローバンプ                                  |     |

{% /totem-accordion %}
{% /totem %}

## エスクローの作成

### 引数

#### name

エスクローの名前。このデータは、UI上でエスクローの名前を表示するために使用できます。

```ts
name: 'My Test Escrow'
```

#### uri

これはメタデータプールのベースuriです。これは、メタデータjsonファイルを連続する宛先に含む静的uriである必要があります。例：

```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: 'https://shdw-drive.genesysgo.net/<bucket-id>/'
```

#### escrow

エスクローアドレスは、次の2つのシードのPDAです`["escrow", collectionAddress]`。

```ts
const collectionAddress = publicKey('11111111111111111111111111111111')

const escrowAddress = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(collectionAddress),
])
```

#### collection

MPL Hybrid 404プロジェクトで使用されているコレクションアドレス。

```ts
collection: publicKey('11111111111111111111111111111111')
```

#### token

MPL Hybrid 404プロジェクトで使用されているトークンミントアドレス。

```ts
token: publicKey('11111111111111111111111111111111')
```

#### feeLocation

スワップからの手数料を受け取るウォレットアドレス。

```ts
feeLocation: publicKey('11111111111111111111111111111111')
```

#### feeAta

トークンを受け取るウォレットのトークンアカウント。

```ts
feeAta: findAssociatedTokenPda(umi, {
  mint: publicKey('111111111111111111111111111111111'),
  owner: publicKey('22222222222222222222222222222222'),
})
```

#### min and max

minとmaxは、メタデータプールで利用可能な最小および最大インデックスを表します。

```
最低インデックス: 0.json
...
最高インデックス: 4999.json
```

これは次のminとmax引数に変換されます。

```ts
min: 0,
max: 4999
```

#### fees

設定できる3つの別々の手数料があります。

```ts
// NFTをトークンにスワップする際に受け取るトークンの量。
// この値はラムポートであり、トークンが持つ
// 小数点以下桁数を考慮する必要があります。トークンが5桁の小数点を持ち、
// 1つの完全なトークンを請求したい場合、feeAmountは`100000`になります。

amount: swapToTokenValueReceived,
```

```ts
// トークンをNFTにスワップする際に支払う手数料金額。この値は
// ラムポートであり、トークンが持つ小数点以下桁数を
// 考慮する必要があります。トークンが5桁の小数点を持ち、
// 1つの完全なトークンを請求したい場合、feeAmountは`100000`になります。

feeAmount: swapToNftTokenFee,
```

```ts
// トークンからNFTにスワップする際に支払うオプション手数料。
// これはラムポートなので、ラムポートを計算するために
// `sol()`を使用できます。

solFeeAmount: sol(0.5).basisPoints,
```

#### path

`path`引数は、mpl-hybridプログラムでメタデータリロール機能を有効または無効にします。

```ts
// スワップ時にメタデータをリロール 0 = true、1 = false
path: rerollEnabled,
```

#### associatedTokenProgram

`SPL_ASSOCIATED_TOKEN_PROGRAM_ID`は`mpl-toolbox`パッケージから取得できます。

```ts
import { SPL_ASSOCIATED_TOKEN_PROGRAM_ID } from @metaplex/mpl-toolbox
```

```ts
// Associated Token Program ID
associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
```

### コード

```ts
const initTx = await initEscrowV1(umi, {
  // エスクロー名
  name: escrowName,
  // メタデータプールベースUri
  uri: baseMetadataPoolUri,
  // "escrow" + コレクションアドレスシードに基づくエスクローアドレス
  escrow: escrowAddress,
  // コレクションアドレス
  collection: collectionAddress,
  // トークンミント
  token: tokenMint,
  // 手数料ウォレット
  feeLocation: feeWallet,
  // 手数料トークンアカウント
  feeAta: feeTokenAccount,
  // プール内のNFTの最小インデックス
  min: minAssetIndex,
  // プール内のNFTの最大インデックス
  max: maxAssetIndex,
  // スワップする代替可能トークンの量
  amount: swapToTokenValueReceived,
  // NFTにスワップする際に支払う手数料金額
  feeAmount: swapToNftTokenFee,
  // NFTにスワップする際に支払うオプションの追加手数料
  solFeeAmount: sol(0.5).basisPoints,
  // スワップ時にメタデータをリロール 0 = true、1 = false
  path: rerollEnabled,
  // Associated Token Program ID
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}).sendAndConfirm(umi)
```
