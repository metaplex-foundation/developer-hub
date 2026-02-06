---
title: 代币管理
metaTitle: 代币管理 | Toolbox
description: 如何使用 Umi 管理代币。
---

以下指令是 Token Program、Associated Token Program 和 MPL Token Extras Program 的一部分。Token Program 和 Associated Token 程序对于在 Solana 上管理代币至关重要，因为它们使您能够创建 Mint 账户、Token 账户、Associated Token PDA、铸造代币、转移代币、委托代币等。您可以在 [Solana 官方文档](https://spl.solana.com/token)中了解有关这些程序的更多信息。

## 创建 Mint

此指令允许您创建一个新的 Mint 账户。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createMint } from '@metaplex-foundation/mpl-toolbox'

const mint = generateSigner(umi)

await createMint(umi, {
  mint,
  decimals: 0,
  mintAuthority,
  freezeAuthority,
}).sendAndConfirm(umi)
```

## 创建 Token 账户

此指令创建一个新的 Token 账户，用于为特定所有者持有特定 mint 的代币。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createToken } from '@metaplex-foundation/mpl-toolbox'

const token = generateSigner(umi)

await createToken(umi, { token, mint, owner }).sendAndConfirm(umi)
```

## 创建 Associated Token 账户

此指令创建一个 Associated Token 账户，这是一个从所有者和 mint 公钥派生的确定性 Token 账户。

```ts
import { createAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

await createAssociatedToken(umi, { mint, owner }).sendAndConfirm(umi)
```

## 铸造代币

此指令允许您向指定的 Token 账户铸造新代币。

```ts
import { mintTokensTo } from '@metaplex-foundation/mpl-toolbox'

await mintTokensTo(umi, {
  mintAuthority,
  mint,
  token,
  amount: 42,
}).sendAndConfirm(umi)
```

## 创建带有 Associated Token 账户的 Mint

此辅助函数为给定的 mint 和所有者创建一个 Mint 账户和一个 Associated Token 账户。如果提供的金额大于零，它还会向该账户铸造代币。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createMintWithAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

const mint = generateSigner(umi)

await createMintWithAssociatedToken(umi, {
  mint,
  owner,
  amount: 1,
}).sendAndConfirm(umi)
```

## 转移代币

此指令允许您将代币从一个 Token 账户转移到另一个账户。

```ts
import { transferTokens } from '@metaplex-foundation/mpl-toolbox'

await transferTokens(umi, {
  source: sourceTokenAccount,
  destination: destinationTokenAccount,
  authority: ownerOrDelegate,
  amount: 30,
}).sendAndConfirm(umi)
```

## 设置授权

此指令允许您更改 Token 或 Mint 账户上的授权。

```ts
import { setAuthority, AuthorityType } from '@metaplex-foundation/mpl-toolbox'

await setAuthority(umi, {
  owned: tokenAccount,
  owner,
  authorityType: AuthorityType.CloseAccount,
  newAuthority: newCloseAuthority.publicKey,
}).sendAndConfirm(umi)
```

## 获取 Mint 和 Token 账户

这些函数允许您获取有关 Mint 和 Token 账户的信息。

```ts
import {
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  fetchAllTokenByOwner,
  fetchAllMintByOwner,
  fetchAllMintPublicKeyByOwner,
} from '@metaplex-foundation/mpl-toolbox'

// 获取 Mint 账户。
const mintAccount = await fetchMint(umi, mint)

// 获取 Token 账户。
const tokenAccount = await fetchToken(umi, token)

// 获取 Associated Token 账户。
const [associatedToken] = findAssociatedTokenPda(umi, { owner, mint })
const associatedTokenAccount = await fetchToken(umi, associatedToken)

// 按所有者获取。
const tokensFromOwner = await fetchAllTokenByOwner(umi, owner)
const mintsFromOwner = await fetchAllMintByOwner(umi, owner)
const mintKeysFromOwner = await fetchAllMintPublicKeyByOwner(umi, owner)
```

## 如果缺失则创建 Token

此指令仅在 Token 账户不存在时才创建新的 Token 账户。当后续指令需要 Token 账户但您不确定它是否已存在时，这特别有用。此指令确保 Token 账户的存在，而无需在客户端获取它。

工作原理如下：

- 如果账户存在，指令成功且不执行任何操作。
- 如果账户不存在，指令成功并创建 associated token 账户。

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { createTokenIfMissing } from '@metaplex-foundation/mpl-toolbox'

// 如果 token 账户是 associated token 账户。
await transactionBuilder()
  .add(createTokenIfMissing(umi, { mint, owner }))
  .add(...) // 后续指令可以确保 Associated Token 账户存在。
  .sendAndConfirm(umi)
```
