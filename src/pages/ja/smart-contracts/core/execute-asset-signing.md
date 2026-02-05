---
title: Execute Asset Signing
metaTitle: ExecuteとAsset Signer | Core
description: MPL Core AssetsがExecute命令を使用して命令やトランザクションに署名する方法を学びます。
updated: '01-31-2026'
keywords:
  - asset signer
  - execute instruction
  - NFT as signer
  - asset PDA
about:
  - Asset signing
  - Execute instruction
  - Advanced operations
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
---
MPL Core Execute命令は、MPL Core Assetsに**Asset Signers**の概念を導入します。
これらの**Asset Signers**は、Asset自体に代わって署名者として機能し、MPL Core Assetsに以下の機能を提供します：
- SolanaとSPLトークンを転送する
- 他のアカウントの権限になる
- `assetSignerPda`に割り当てられたトランザクション/命令/CPI署名を必要とする他のアクションと検証を実行する
MPL Core Assetsは、ブロックチェーンにトランザクション/CPIを署名して送信する機能を持っています。これにより、Core Assetは`assetSigner`という形で独自のウォレットを持つことができます。
## Asset Signer PDA
Assetsは`assetSignerPda`アカウント/アドレスにアクセスできるようになり、MPL Coreプログラムの`execute`命令が、送信された追加の命令を`assetSignerPda`でCPI命令に署名して通過させることができます。
これにより、`assetSignerPda`アカウントは、現在のアセット所有者に代わってアカウント命令を効果的に所有および実行できます。
`assetSignerPda`は、Core Assetに接続されたウォレットと考えることができます。
### findAssetSignerPda()
```ts
const assetId = publickey('11111111111111111111111111111111')
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```
## Execute命令
### 概要
`execute`命令を使用すると、ユーザーはCore Assetと、オンチェーンでMPL Coreプログラムの`execute`命令に到達したときにAssetSignerによって署名されるパススルー命令を渡すことができます。
`execute`命令とその引数の概要：
```ts
const executeIx = await execute(umi, {
    {
        // `fetchAsset()`を介してトランザクションに署名するアセット
        asset: AssetV1,
        // `fetchCollection()`を介したコレクション
        collection?: CollectionV1,
        // TransactionBuilder | Instruction[]のいずれか
        instructions: ExecuteInput,
        // トランザクション/命令に必要な追加の署名者
        signers?: Signer[]
    }
})
```
### 検証
{% callout title="assetSignerPda検証" %}
MPL Core Execute命令は、**現在のAsset所有者**もトランザクションに署名していることを検証します。これにより、現在のAsset所有者のみが`execute`命令で`assetSignerPda`を使用してトランザクションを実行できることが保証されます。
{% /callout %}
### Execute操作の制御
execute機能は[Freeze Executeプラグイン](/smart-contracts/core/plugins/freeze-execute)を使用して制御できます。このプラグインにより、アセットのexecute操作をフリーズし、フリーズ解除されるまでexecute命令の処理を防ぐことができます。
Freeze Executeプラグインは以下の場合に特に役立ちます：
- **バックドNFT**: 必要に応じて基礎となるアセットの引き出しを防止
- **エスクローレスプロトコル**: プロトコル操作中にexecute機能を一時的にロック
- **セキュリティ対策**: 複雑な操作を実行できるアセットに追加の保護レイヤーを追加
Freeze Executeプラグインがアクティブで`frozen: true`に設定されている場合、プラグインが`frozen: false`に更新されるまで、execute命令の使用はブロックされます。
## 例
### Asset SignerからSOLを転送する
以下の例では、`assetSignerPda`に送信されたSOLを任意の宛先に転送します。
```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { publickey, createNoopSigner, sol } from '@metaplex-foundation/umi'
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)
// オプション - Assetがコレクションの一部の場合、コレクションオブジェクトを取得
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
// Asset signerはアカウントに1 SOLの残高を持っています
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// SOLを転送する宛先アカウント
const destination = publickey('2222222222222222222222222222222222')
// 標準的な`transferSol()` transactionBuilder
const transferSolIx = transferSol(umi, {
  // assetSignerが後でCPI中に署名するため、noopSignerを作成
  source: createNoopSigner(publicKey(assetSigner)),
  // 宛先アドレス
  destination,
  // 転送する金額
  amount: sol(0.5),
})
// `execute`命令を呼び出してチェーンに送信
const res = await execute(umi, {
  // このアセットで命令を実行
  asset,
  // Assetがコレクションの一部の場合、`fetchCollection()`を介してコレクションオブジェクトを渡す
  collection,
  // 実行するtransactionBuilder/instruction[]
  instructions: transferSolIx,
}).sendAndConfirm(umi)
console.log({ res })
```
### Asset SignerからSPLトークンを転送する
以下の例では、`assetSignerPda`アカウントからSPLトークン残高の一部を宛先に転送します。
この例は、ベースウォレットアドレスの派生トークンアカウントに関するベストプラクティスに基づいています。トークンが`assetSignerPda`アドレスに基づいて正しく派生されたトークンアカウントにない場合、この例を調整する必要があります。
```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import {
  transferTokens,
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox'
import { publickey } from '@metaplex-foundation/umi'
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)
// オプション - Assetがコレクションの一部の場合、コレクションオブジェクトを取得
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
const splTokenMint = publickey('2222222222222222222222222222222222')
// Asset signerはトークン残高を持っています
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// SOLを転送する宛先ウォレット
const destinationWallet = publickey('3333333333333333333333333333333')
// 標準的な`transferTokens()` transactionBuilder
const transferTokensIx = transferTokens(umi, {
  // ソースは`assetSignerPda`派生トークンアカウント
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // 宛先は`destinationWallet`派生トークンアカウント
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // lamportsで送信する金額
  amount: 5000,
})
// `execute`命令を呼び出してチェーンに送信
const res = await execute(umi, {
  // このアセットで命令を実行
  asset,
  // Assetがコレクションの一部の場合、`fetchCollection()`を介してコレクションオブジェクトを渡す
  collection,
  // 実行するtransactionBuilder/instruction[]
  instructions: transferTokensIx,
}).sendAndConfirm(umi)
console.log({ res })
```
### アセットの所有権を別のアセットに転送する
以下の例では、別のCore Assetが所有するCore Assetを、さらに別のAssetに転送します。
```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'
// 転送するアセット
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)
// オプション - Assetがコレクションの一部の場合、コレクションオブジェクトを取得
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
// 転送するAssetを所有するAsset ID
const sourceAssetId = publickey('2222222222222222222222222222222222')
// ソースAssetオブジェクト
const sourceAsset = fetchAsset(umi, sourceAssetId)
// Asset signerはアカウントに1 SOLの残高を持っています
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// SOLを転送する宛先アカウント
const destinationAssetId = publickey('33333333333333333333333333333333')
// Assetを転送する宛先Asset signer
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})
const transferAssetIx = transfer(umi, {
  // `fetchAsset()`を介したAssetオブジェクト
  asset,
  // オプション - `fetchCollection()`を介したCollectionオブジェクト
  collection,
  // Assetの新しい所有者
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)
const res = await execute(umi, {
  // このアセットで命令を実行
  asset,
  // Assetがコレクションの一部の場合、`fetchCollection()`を介してコレクションオブジェクトを渡す
  collection,
  // 実行するtransactionBuilder/instruction[]
  instructions: transferAssetIx,
}).sendAndConfirm(umi)
console.log({ res })
```
