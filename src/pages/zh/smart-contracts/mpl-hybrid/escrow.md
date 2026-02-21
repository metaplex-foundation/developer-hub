---
title: 初始化托管
metaTitle: 初始化托管 | MPL-Hybrid
description: 初始化MPL-Hybrid托管
---

## MPL-Hybrid托管

初始化托管是将NFT集合与同质化代币链接的关键步骤。在开始此步骤之前，您应该准备好Core集合地址、同质化代币铸造地址，以及使用数字命名、顺序文件的链下元数据URI范围。对基础URI字符串一致性的需求将限制一些链下元数据选项。请注意，托管的权限需要与集合的权限匹配才能执行元数据更新。此外，由于托管是有资金的，因此无需成为代币权限，这允许集合由现有的memecoin或其他同质化资产支持。

## MPL-Hybrid托管账户结构

{% totem %}
{% totem-accordion title="链上MPL-404托管数据结构" %}

MPL-404托管的链上账户结构 [查看源代码](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

| 名称           | 类型   | 大小 | 描述                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| collection     | Pubkey | 32   | 集合账户                           |     |
| authority      | Pubkey | 32   | 托管的权限                      |     |
| token          | Pubkey | 32   | 要分发的同质化代币               |     |
| fee_location   | Pubkey | 32   | 发送代币费用的账户                |     |
| name           | String | 4    | NFT名称                                     |     |
| uri            | String | 8    | NFT元数据的基础uri                |     |
| max            | u64    | 8    | 附加到uri的NFT的最大索引     |     |
| min            | u64    | 8    | 附加到uri的NFT的最小索引 |     |
| amount         | u64    | 8    | 交换的代币成本                           |     |
| fee_amount     | u64    | 8    | 捕获NFT的代币费用              |     |
| sol_fee_amount | u64    | 8    | 捕获NFT的sol费用                |     |
| count          | u64    | 8    | 交换总次数                        |     |
| path           | u16    | 1    | 链上/链下元数据更新路径       |     |
| bump           | u8     | 1    | 托管bump                                  |     |

{% /totem-accordion %}
{% /totem %}

## 初始化MPL-404智能托管

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

// 这使用本地密钥对
const parsed_wallet = JSON.parse(fs.readFileSync('<PATH TO KEYPAIR>', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(parsed_wallet)
)

umi.use(keypairIdentity(kp_wallet))
umi.use(mplHybrid())
umi.use(mplTokenMetadata())

const ESCROW_NAME = '<INSERT ESCROW NAME>'
const COLLECTION = publicKey('<INSERT COLLECTION ACCOUNT/NFT ADDRESS>')
const TOKEN = publicKey('<INSERT TOKEN ADDRESS>') // 要分发的代币

// 元数据池信息
// 例如 BASE_URI: https://shdw-drive.genesysgo.net/EjNJ6MKKn3mkVbWJL2NhJTyxne6KKZDTg6EGUtJCnNY3/
const BASE_URI = '<INSERT BASE_URI>' // 支持交换时元数据更新所需

// MIN和MAX定义要选择的URI元数据范围
const MIN = 0 // 即 https://shdw-drive.genesysgo.net/.../0.json
const MAX = 9999 // 即 https://shdw-drive.genesysgo.net/.../9999.json

// 费用信息
const FEE_WALLET = publicKey('<INSERT FEE WALLET>')
const FEE_ATA = findAssociatedTokenPda(umi, { mint: TOKEN, owner: FEE_WALLET })

const TOKEN_SWAP_BASE_AMOUNT = 1 // 用户在交换为同质化代币时收到此金额
const TOKEN_SWAP_FEE_AMOUNT = 1 // 用户在交换为NFT时支付此额外金额
const TOKEN_SWAP_FEE_DECIMALS = 9 // 代币的小数位数。创建代币时默认为9。
const SOL_SWAP_FEE_AMOUNT = 0 // 交换为NFT时可选的额外SOLANA费用

// 当前路径选项:
// 0-- NFT元数据在交换时更新
// 1-- NFT元数据在交换时不更新
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
  solFeeAmount: addZeros(SOL_SWAP_FEE_AMOUNT, 9), // SOL有9位小数
  path: PATH,
  feeAta: FEE_ATA,
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}

const initTx = await initEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(initTx.signature))
```

## 为托管注资

在智能交换上线之前的下一步是为托管注资。通常，如果项目希望确保托管始终保持资金充足，他们首先发布所有NFT或代币，然后将所有其他资产放入托管。这确保每个流通资产都由托管中的对应资产"支持"。由于托管是PDA，通过钱包加载它并不广泛支持。您可以使用以下代码将资产转入托管。

```ts
import { transferV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity, publicKey, createSignerFromKeypair } from '@metaplex-foundation/umi'

... (参见上面的代码)

// 这使用本地密钥对
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

## 更新托管

更新托管很容易，它本质上与初始化相同的代码，只是用updateEscrow函数代替initEscrow函数。

```ts
import { mplHybrid, updateEscrowV1 } from '@metaplex-foundation/mpl-hybrid'

... (参见上面的代码)

const updateTx = await updateEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(updateTx.signature))
```
