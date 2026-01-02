---
title: Executeアセット署名
metaTitle: Executeとアセット署名者 | Core
description: MPL CoreアセットがExecute命令を使って、命令やトランザクションに署名する方法を学びます。
---

MPL CoreのExecute命令は、MPL Coreアセットに「アセット署名者（Asset Signers）」という概念を導入します。

これらの「アセット署名者」はアセット自身の代理としてSignerとして振る舞い、次の能力を解放します。

- SolanaおよびSPLトークンの送金
- 他アカウントのオーソリティになる
- トランザクション/インストラクション/CPIの署名を必要とする、`assetSignerPda`に割り当てられた各種の動作やバリデーションの実行

MPL Coreアセットは、トランザクション/CPIに署名してブロックチェーンへ送信できます。これは実質的に、`assetSigner`という形でCoreアセットに専用のウォレットが付与されることを意味します。

## アセット署名者PDA

アセットは`assetSignerPda`アカウント/アドレスへアクセスでき、これによりMPL Coreプログラムの`execute`命令は渡された追加インストラクションを`assetSignerPda`でCPI署名して中継できます。

これにより、`assetSignerPda`アカウントは現在のアセット所有者の代理として、アカウントの命令を所有・実行できます。

`assetSignerPda`はCoreアセットに紐づいたウォレットと捉えることができます。

### findAssetSignerPda()

```ts
const assetId = publickey('11111111111111111111111111111111')

const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```

## Execute命令

### 概要

`execute`命令は、Coreアセットに加えて、AssetSignerがチェーン上のMPL Coreプログラムの`execute`命令に到達した際に署名されるパススルーインストラクションを渡せます。

`execute`命令とその引数の概要は以下のとおりです。

```ts
const executeIx = await execute(umi, {
    {
        // 取引に署名するアセット（`fetchAsset()`で取得）
        asset: AssetV1,
        // コレクション（`fetchCollection()`で取得）
        collection?: CollectionV1,
        // TransactionBuilder | Instruction[] のいずれか
        instructions: ExecuteInput,
        // 取引/インストラクションで必要となる追加Signer
        signers?: Signer[]
    }
})
```

### バリデーション

{% callout title="assetSignerPdaの検証" %}
MPL CoreのExecute命令は「現在のアセット所有者」もトランザクションへ署名していることを検証します。これにより、`execute`命令で`assetSignerPda`を使用する際、実行できるのは常に現在のアセット所有者のみであることが保証されます。
{% /callout %}

### Execute操作の制御

実行機能は[Freeze Executeプラグイン](/ja/smart-contracts/core/plugins/freeze-execute)で制御できます。このプラグインにより、アセット上の実行操作を凍結し、凍結解除されるまで任意のExecute命令が処理されないようにできます。

Freeze Executeプラグインが特に有用なケース:

- バックドNFT: 必要に応じて基礎資産の引き出しを防ぐ
- エスクロー不要プロトコル: プロトコル処理中に一時的に実行機能をロック
- セキュリティ対策: 複雑な操作を実行可能なアセットに追加の保護層を付与

プラグインが有効で`frozen: true`の場合、`frozen: false`に更新されるまでExecute命令の利用はブロックされます。

## 例

### アセット署名者からSOLを送金

次の例では、`assetSignerPda`に送られていたSOLを任意の宛先へ送金します。

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

// 任意 - アセットがコレクションの一部ならコレクションも取得
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// アセット署名者の口座残高は1 SOL
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// 送金先アカウント
const destination = publickey('2222222222222222222222222222222222')

// 通常の`transferSol()` TransactionBuilder
const transferSolIx = transferSol(umi, {
  // 後段のCPIでassetSignerが署名するためnoopSignerを作成
  source: createNoopSigner(publicKey(assetSigner)),
  // 送金先
  destination,
  // 送金額
  amount: sol(0.5),
})

// `execute`命令を呼び出して送信
const res = await execute(umi, {
  // このアセットで実行
  asset,
  // アセットがコレクションの一部なら`fetchCollection()`で取得したオブジェクトを指定
  collection,
  // 実行するTransactionBuilder/Instruction[]
  instructions: transferSolIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### アセット署名者からSPLトークンを送金

次の例では、`assetSignerPda`のSPLトークン残高の一部を宛先へ送金します。

この例は、基底ウォレットアドレスに対する派生トークンアカウントのベストプラクティスに基づいています。トークンが`assetSignerPda`アドレスに基づく正しい派生トークンアカウントにない場合、この例は調整が必要です。

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

// 任意 - アセットがコレクションの一部ならコレクションも取得
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

const splTokenMint = publickey('2222222222222222222222222222222222')

// アセット署名者のトークン残高あり
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// 送金先ウォレット
const destinationWallet = publickey('3333333333333333333333333333333')

// 通常の`transferTokens()` TransactionBuilder
const transferTokensIx = transferTokens(umi, {
  // ソースは`assetSignerPda`由来のトークンアカウント
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // 宛先は`destinationWallet`由来のトークンアカウント
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // lamports単位の数量
  amount: 5000,
})

// `execute`命令を呼び出して送信
const res = await execute(umi, {
  // このアセットで実行
  asset,
  // アセットがコレクションの一部なら`fetchCollection()`で取得したオブジェクトを指定
  collection,
  // 実行するTransactionBuilder/Instruction[]
  instructions: transferTokensIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### 他のアセットへ保有アセットを移転

次の例では、あるCoreアセット（別のCoreアセットが所有）を、さらに別のCoreアセットへ移転します。

```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'

// 移転したいアセット
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)

// 任意 - アセットがコレクションの一部ならコレクションも取得
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// アセットを所有しているアセットのID
const sourceAssetId = publickey('2222222222222222222222222222222222')
// ソースのアセット
const sourceAsset = fetchAsset(umi, sourceAssetId)
// アセット署名者
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// 送付先アセットID
const destinationAssetId = publickey('33333333333333333333333333333333')
// 送付先アセットの署名者
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})

const transferAssetIx = transfer(umi, {
  // `fetchAsset()`で取得したアセット
  asset,
  // 任意 - `fetchCollection()`で取得したコレクション
  collection,
  // 新しいオーナー
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)

const res = await execute(umi, {
  // このアセットで実行
  asset,
  // 任意 - コレクション
  collection,
  // 実行するTransactionBuilder/Instruction[]
  instructions: transferAssetIx,
}).sendAndConfirm(umi)

console.log({ res })
```

