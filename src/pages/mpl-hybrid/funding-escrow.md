---
title: Funding the MPL Hybrid 404 Escrow
metaTitle: Funding the MPL Hybrid 404 Escrow | MPL-Hybrid
description: Learn to fund the MPL 404 Hybrid Escrow account with SPL Tokens that makes 404 swaps possible.
---

The next step before the smart-swap is live it to fund the escrow. Typically if a project wants to ensure the escrow always stays funded, they start by releasing all of the NFTs or tokens and then placing all of the other assets in the escrow. This ensures that every outstanding asset is "backed" by the counter-asset in the escrow. Because the Escrow is a PDA, loading it via wallets is not widely supported. You can use the below code to transfer assets into your escrow.

To fund your escrow with your Token you will need to send that token to the **escrows token account**.

```ts
// Address of your escrow configuration.
const escrowConfigurationAddress = publicKey('11111111111111111111111111111111')
// Address of the SPL token.
const tokenMint = publicKey('22222222222222222222222222222222')

// Generate the Token Account PDA from the funding wallet.
const sourceTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: tokenMint,
})

// Generate the Token Account PDA for the escrow destination.
const escrowTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: escrowConfigurationAddress,
  mint: tokenMint,
})

// Execute transfer of tokens while also checking if the
// destination token account exists, if not, create it.
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
      // amount is calculated in lamports and decimals.
      amount: 100000,
    })
  )
  .sendAndConfirm(umi)
```
