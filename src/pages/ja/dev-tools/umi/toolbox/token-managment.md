---
title: トークン管理
metaTitle: トークン管理 | Toolbox
description: Umiでトークンを管理する方法。
---

以下の命令は、Tokenプログラム、Associated Tokenプログラム、およびMPL Token Extrasプログラムの一部です。TokenプログラムとAssociated Tokenプログラムは、Mintアカウント、Tokenアカウント、Associated Token PDAs の作成、トークンのミント、転送、委任などを可能にするため、Solana上でトークンを管理するために不可欠です。これらのプログラムについては、[Solanaの公式ドキュメント](https://spl.solana.com/token)で詳しく学ぶことができます。

## Mintの作成

この命令により、新しいMintアカウントを作成できます。

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

## Tokenアカウントの作成

この命令は、特定の所有者のために特定のmintのトークンを保持するために使用される新しいTokenアカウントを作成します。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createToken } from '@metaplex-foundation/mpl-toolbox'

const token = generateSigner(umi)

await createToken(umi, { token, mint, owner }).sendAndConfirm(umi)
```

## Associated Tokenアカウントの作成

この命令は、所有者とmintの公開鍵から導出される決定論的なTokenアカウントであるAssociated Tokenアカウントを作成します。

```ts
import { createAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

await createAssociatedToken(umi, { mint, owner }).sendAndConfirm(umi)
```

## トークンのミント

この命令により、指定されたTokenアカウントに新しいトークンをミントできます。

```ts
import { mintTokensTo } from '@metaplex-foundation/mpl-toolbox'

await mintTokensTo(umi, {
  mintAuthority,
  mint,
  token,
  amount: 42,
}).sendAndConfirm(umi)
```

## Associated TokenアカウントでMintを作成

このヘルパーは、指定されたmintと所有者のためにMintアカウントとAssociated Tokenアカウントを作成します。また、ゼロより大きい量が提供された場合、そのアカウントにトークンをミントします。

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

## トークンの転送

この命令により、あるTokenアカウントから別のTokenアカウントにトークンを転送できます。

```ts
import { transferTokens } from '@metaplex-foundation/mpl-toolbox'

await transferTokens(umi, {
  source: sourceTokenAccount,
  destination: destinationTokenAccount,
  authority: ownerOrDelegate,
  amount: 30,
}).sendAndConfirm(umi)
```

## 権限の設定

この命令により、TokenまたはMintアカウントの権限を変更できます。

```ts
import { setAuthority, AuthorityType } from '@metaplex-foundation/mpl-toolbox'

await setAuthority(umi, {
  owned: tokenAccount,
  owner,
  authorityType: AuthorityType.CloseAccount,
  newAuthority: newCloseAuthority.publicKey,
}).sendAndConfirm(umi)
```

## MintおよびTokenアカウントの取得

これらの関数により、MintおよびTokenアカウントに関する情報を取得できます。

```ts
import {
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  fetchAllTokenByOwner,
  fetchAllMintByOwner,
  fetchAllMintPublicKeyByOwner,
} from '@metaplex-foundation/mpl-toolbox'

// Mintアカウントを取得。
const mintAccount = await fetchMint(umi, mint)

// Tokenアカウントを取得。
const tokenAccount = await fetchToken(umi, token)

// Associated Tokenアカウントを取得。
const [associatedToken] = findAssociatedTokenPda(umi, { owner, mint })
const associatedTokenAccount = await fetchToken(umi, associatedToken)

// 所有者で取得。
const tokensFromOwner = await fetchAllTokenByOwner(umi, owner)
const mintsFromOwner = await fetchAllMintByOwner(umi, owner)
const mintKeysFromOwner = await fetchAllMintPublicKeyByOwner(umi, owner)
```

## 存在しない場合のToken作成

この命令は、まだ存在しない場合にのみ新しいTokenアカウントを作成します。これは、後続の命令でTokenアカウントが必要だが、それがすでに存在するかどうかわからない場合に特に便利です。この命令は、クライアント側で取得する必要なく、Tokenアカウントの存在を保証します。

動作方法：
- アカウントが存在する場合、命令は成功し何もしません。
- アカウントが存在しない場合、命令は成功してAssociated Tokenアカウントを作成します。

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { createTokenIfMissing } from '@metaplex-foundation/mpl-toolbox'

// トークンアカウントがAssociated Tokenアカウントの場合。
await transactionBuilder()
  .add(createTokenIfMissing(umi, { mint, owner }))
  .add(...) // 後続の命令はAssociated Tokenアカウントの存在を確信できます。
  .sendAndConfirm(umi)
```
