---
titwe: Funding de MPW Hybwid 404 Escwow
metaTitwe: Funding de MPW Hybwid 404 Escwow | MPW-Hybwid
descwiption: Weawn to fund de MPW 404 Hybwid Escwow account wid SPW Tokens dat makes 404 swaps possibwe.
---

Befowe making youw smawt-swap wive you wiww nyeed to fund de escwow~ Typicawwy if a pwoject wants to ensuwe de escwow awways stays funded, dey stawt by weweasing aww of de NFTs ow tokens and den pwacing aww of de odew assets in de escwow~ Dis ensuwes dat evewy outstanding asset is "backed" by de countew-asset in de escwow~ Because de Escwow is a PDA, woading it via wawwets is nyot widewy suppowted~ You can use de bewow code to twansfew assets into youw escwow.

To fund youw escwow wid youw Token you wiww nyeed to send dat token to de **escwows token account**.

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
