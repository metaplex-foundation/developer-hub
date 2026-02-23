---
title: エスクロー初期化
metaTitle: エスクロー初期化 | MPL-Hybrid
description: MPL-Hybridエスクローの初期化
---

## MPL-Hybridエスクロー

エスクローの初期化は、NFTコレクションと代替可能トークンをリンクする重要なステップです。このステップを開始する前に、Coreコレクションアドレス、代替可能トークンミントアドレス、そして数値的に命名された連続ファイルを使用するオフチェーンメタデータURIの範囲を準備しておく必要があります。Base URI文字列の一貫性の必要性により、一部のオフチェーンメタデータオプションが制限されます。メタデータの更新を実行するには、エスクローのオーソリティがコレクションのオーソリティと一致する必要があることに注意してください。また、エスクローが資金提供されるため、トークンオーソリティである必要がなく、コレクションを既存のミームコインや他の代替可能アセットで裏付けることが可能です。

## MPL-Hybridエスクローアカウント構造

{% totem %}
{% totem-accordion title="オンチェーンMPL-404エスクローデータ構造" %}

MPL-404エスクローのオンチェーンアカウント構造 [GitHubで表示](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

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

## MPL-404スマートエスクローの初期化

```ts
import fs from 'fs'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import {
  mplHybrid,
  MPL_HYBRID_PROGRAM_ID,
  initEscrowV1,
} from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  string,
  publicKey as publicKeySerializer,
} from '@metaplex-foundation/umi/serializers'
import {
  findAssociatedTokenPda,
  SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@metaplex-foundation/mpl-toolbox'

const RPC = '<INSERT RPC>'
const umi = createUmi(RPC)

// これはローカルキーペアを使用しています
const parsed_wallet = JSON.parse(fs.readFileSync('<PATH TO KEYPAIR>', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(parsed_wallet)
)

umi.use(keypairIdentity(kp_wallet))
umi.use(mplHybrid())
umi.use(mplTokenMetadata())

const ESCROW_NAME = '<INSERT ESCROW NAME>'
const COLLECTION = publicKey('<INSERT COLLECTION ACCOUNT/NFT ADDRESS>')
const TOKEN = publicKey('<INSERT TOKEN ADDRESS>') // 配布されるトークン

// メタデータプール情報
// 例. BASE_URI: https://shdw-drive.genesysgo.net/EjNJ6MKKn3mkVbWJL2NhJTyxne6KKZDTg6EGUtJCnNY3/
const BASE_URI = '<INSERT BASE_URI>' // スワップ時のメタデータ更新をサポートするために必要

// MIN & MAXは、選択するURIメタデータの範囲を定義します
const MIN = 0 // 例. https://shdw-drive.genesysgo.net/.../0.json
const MAX = 9999 // 例. https://shdw-drive.genesysgo.net/.../9999.json

// 手数料情報
const FEE_WALLET = publicKey('<INSERT FEE WALLET>')
const FEE_ATA = findAssociatedTokenPda(umi, { mint: TOKEN, owner: FEE_WALLET })

const TOKEN_SWAP_BASE_AMOUNT = 1 // 代替可能トークンにスワップする際にユーザーが受け取る金額
const TOKEN_SWAP_FEE_AMOUNT = 1 // NFTにスワップする際にユーザーが支払う追加金額
const TOKEN_SWAP_FEE_DECIMALS = 9 // トークンの小数点以下桁数。トークン作成時のデフォルトは9です。
const SOL_SWAP_FEE_AMOUNT = 0 // NFTにスワップする際に支払うオプションの追加Solana手数料

// 現在のパスオプション:
// 0-- スワップ時にNFTメタデータが更新されます
// 1-- スワップ時にNFTメタデータは更新されません
const PATH = 0

const ESCROW = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(COLLECTION),
])

const addZeros = (num: number, numZeros: number) => {
  return num * Math.pow(10, numZeros)
}

const escrowData = {
  escrow: ESCROW,
  collection: COLLECTION,
  token: TOKEN,
  feeLocation: FEE_WALLET,
  name: ESCROW_NAME,
  uri: BASE_URI,
  max: MAX,
  min: MIN,
  amount: addZeros(TOKEN_SWAP_BASE_AMOUNT, TOKEN_SWAP_FEE_DECIMALS),
  feeAmount: addZeros(TOKEN_SWAP_FEE_AMOUNT, TOKEN_SWAP_FEE_DECIMALS),
  solFeeAmount: addZeros(SOL_SWAP_FEE_AMOUNT, 9), // SOLは9桁の小数点以下を持ちます
  path: PATH,
  feeAta: FEE_ATA,
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}

const initTx = await initEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(initTx.signature))
```

## エスクローの資金調達

スマートスワップが稼働する前の次のステップは、エスクローに資金を提供することです。通常、プロジェクトがエスクローを常に資金提供された状態に保ちたい場合、すべてのNFTまたはトークンをリリースしてから、他のすべてのアセットをエスクローに配置することから始めます。これにより、すべての未処理のアセットがエスクロー内のカウンターアセットによって「裏付けられる」ことが保証されます。エスクローはPDAであるため、ウォレット経由での読み込みは広くサポートされていません。以下のコードを使用して、エスクローにアセットを転送できます。

```ts
import { transferV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity, publicKey, createSignerFromKeypair } from '@metaplex-foundation/umi'

... (上記のコードを参照)

// これはローカルキーペアを使用しています
const parsed_wallet = JSON.parse(fs.readFileSync('< PATH TO KEYPAIR >', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(parsed_wallet))
const token_owner = createSignerFromKeypair(umi, kp_wallet)

const TOKEN_TRANSFER_AMOUNT = 10000
const TOKEN_DECIMALS = 9

const transferData = {
  mint: TOKEN,
  amount: addZeros(TOKEN_TRANSFER_AMOUNT, TOKEN_DECIMALS),
  authority: token_owner,
  tokenOwner: kp_wallet.publicKey,
  destinationOwner: ESCROW,
  tokenStandard: TokenStandard.NonFungible,
}

const transferIx = await transferV1(umi, transferData).sendAndConfirm(umi)

console.log(bs58.encode(transferIx.signature))

```

## エスクローの更新

エスクローの更新は簡単で、基本的にはinitEscrow関数の代わりにupdateEscrow関数を使用する以外は、初期化と同じコードです。

```ts
import { mplHybrid, updateEscrowV1 } from '@metaplex-foundation/mpl-hybrid'

... (上記のコードを参照)

const updateTx = await updateEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(updateTx.signature))
```
