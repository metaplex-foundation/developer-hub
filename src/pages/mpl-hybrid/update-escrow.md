---
title: Updating the Configuration of an MPL Hybrid 404 Escrow
metaTitle: Updating the Configuration of an MPL Hybrid 404 Escrow | MPL-Hybrid
description: Learn to update the configuration of an MPL 404 Hybrid Escrow account.
---

The escrow configuration is upgradable via the `updateEscrowV1` plugin.

To make things easier you can fetch your escrow account using the `fetchEscrowV1()` from the `mpl-hybrid` package and use the spread operator to supply all current field values to the update instruction and adjust only the values you wish to change as the original unchanged values will be handled by the spread operator.

## Update Escrow

```ts
const escrowConfigurationAddress = publicKey("11111111111111111111111111111111");

// Fetch the escrow configuration account.
const escrowConfigurationData = await fetchEscrowV1(umi, escrowConfigurationAddress);

// Use the spread operator `...` to spread the `escrowConfigurationData` fields into the object
// and adjust any fields you wish to update.
const res = await updateEscrowV1(umi, {
    ...escrowConfigurationData,
    escrow: hybridEscrowAddress,
    authority: umi.identity,
    // add any fields below that you wish to change and update.
    feeAmount: 100000,
}).sendAndConfirm(umi);

```

## Updatable Fields

The updatable fields that can be passed into the arg object of `updateEscrowV1`.

```ts
{
    name,
    uri,
    max,
    min,
    amount,
    feeAmount,
    solFeeAmount,
    path
}

```

### name

The name of your escrow.

```ts
name: "My Test Escrow"
```

### uri

This is the base uri for your metadata pool. This needs to be a static uri which also contains your metadata json files at sequential destination. ie:
```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: "https://shdw-drive.genesysgo.net/<bucket-id>/"
```

### token

The Token mint address that is being used in your MPL Hybrid 404 project. 

```ts
token: publicKey("11111111111111111111111111111111")
```

### feeLocation

The wallet address which will be receiving the fees from the swaps.

```ts
feeLocation: publicKey("11111111111111111111111111111111")
```

### feeAta

The Token Account of the wallet that will be receiving the tokens.

```ts
feeAta: findAssociatedTokenPda(umi, {
    mint: publicKey("111111111111111111111111111111111"),
    owner: publicKey("22222222222222222222222222222222"),
  });
```

### min and max

The min and max represent the min and max indexes available in your metadata pool.

```
Lowest index: 0.json
...
Highest index: 4999.json
```

This would then translate into the min and max args.
```ts
min: 0,
max: 4999
```

### fees

There are 3 separate fees that can be updated.

```ts
// Amount of tokens to receive when swapping an NFT to tokens. 
// This value is in lamports and you will need to take into account 
// the number of decimals the token has. If the token has 5 decimals 
// and you wish to charge 1 whole token then feeAmount would be `100000`

amount: 100000,
```

```ts
// Fee amount to pay when swapping Tokens to an NFT. 
// This value is in lamports and you will need to take into 
// account the number of decimals the token has. 
// If the token has 5 decimals and you wish to charge 1 whole token 
// then feeAmount would be `100000`

feeAmount: 100000,
```

```ts
// Optional fee to pay when swapping from Tokens to NFT. 
// This is in lamports so you can use `sol()` to calculate 
// the lamports.

solFeeAmount: sol(0.5).basisPoints,
```

### path

The `path` arg either enables of disables the metadata rerolling function on the mpl-hybrid program.

```ts
// Reroll metadata on swap 0 = true, 1 = false
path: 0,
```

