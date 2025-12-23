---
title: 为MPL Hybrid 404托管注资
metaTitle: 为MPL Hybrid 404托管注资 | MPL-Hybrid
description: 学习用SPL代币为MPL 404混合托管账户注资，使404交换成为可能。
---

在使您的智能交换上线之前，您需要为托管注资。通常，如果项目希望确保托管始终保持资金充足，他们首先发布所有NFT或代币，然后将所有其他资产放入托管。这确保每个流通资产都由托管中的对应资产"支持"。由于托管是PDA，通过钱包加载它并不广泛支持。您可以使用以下代码将资产转入托管。

要用您的代币为托管注资，您需要将该代币发送到**托管的代币账户**。

```ts
// 您的托管配置地址。
const escrowConfigurationAddress = publicKey('11111111111111111111111111111111')
// SPL代币地址。
const tokenMint = publicKey('22222222222222222222222222222222')

// 从注资钱包生成代币账户PDA。
const sourceTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: tokenMint,
})

// 为托管目标生成代币账户PDA。
const escrowTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: escrowConfigurationAddress,
  mint: tokenMint,
})

// 执行代币转账，同时检查
// 目标代币账户是否存在，如果不存在则创建它。
await createTokenIfMissing(umi, {
  mint: tokenMint,
  owner: escrowConfigurationAddress,
  token: escrowTokenAccountPda,
  payer: umi.identity,
})
  .add(
    transferTokens(umi, {
      source: sourceTokenAccountPda,
      destination: escrowTokenAccountPda,
      // 金额以lamports和小数计算。
      amount: 100000,
    })
  )
  .sendAndConfirm(umi)
```
