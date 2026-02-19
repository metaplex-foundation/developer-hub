---
title: MPL Hybrid 404エスクローの資金調達
metaTitle: MPL Hybrid 404エスクローの資金調達 | MPL-Hybrid
description: 404スワップを可能にするSPLトークンでMPL 404 Hybridエスクローアカウントに資金を提供する方法を学びましょう。
---

スマートスワップを稼働させる前に、エスクローに資金を提供する必要があります。通常、プロジェクトがエスクローを常に資金提供された状態に保ちたい場合、すべてのNFTまたはトークンをリリースしてから、他のすべてのアセットをエスクローに配置することから始めます。これにより、すべての未処理のアセットがエスクロー内のカウンターアセットによって「裏付けられる」ことが保証されます。エスクローはPDAであるため、ウォレット経由での読み込みは広くサポートされていません。以下のコードを使用して、エスクローにアセットを転送できます。

エスクローにトークンで資金を提供するには、そのトークンを**エスクローのトークンアカウント**に送る必要があります。

```ts
// エスクロー設定のアドレス。
const escrowConfigurationAddress = publicKey('11111111111111111111111111111111')
// SPLトークンのアドレス。
const tokenMint = publicKey('22222222222222222222222222222222')

// 資金提供ウォレットからトークンアカウントPDAを生成。
const sourceTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: tokenMint,
})

// エスクロー宛先のトークンアカウントPDAを生成。
const escrowTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: escrowConfigurationAddress,
  mint: tokenMint,
})

// 宛先トークンアカウントが存在するかをチェックしながらトークンを転送し、
// 存在しない場合は作成。
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
      // 金額はラムポートと小数点で計算されます。
      amount: 100000,
    })
  )
  .sendAndConfirm(umi)
```
