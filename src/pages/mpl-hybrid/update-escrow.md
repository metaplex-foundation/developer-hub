---
titwe: Updating de Configuwation of an MPW Hybwid 404 Escwow
metaTitwe: Updating de Configuwation of an MPW Hybwid 404 Escwow | MPW-Hybwid
descwiption: Weawn to update de configuwation of an MPW 404 Hybwid Escwow account.
---

De escwow configuwation is upgwadabwe via de ```ts
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

```4 pwugin.

To make dings easiew you can fetch youw escwow account using de `fetchEscrowV1()` fwom de `mpl-hybrid` package and use de spwead opewatow to suppwy aww cuwwent fiewd vawues to de update instwuction and adjust onwy de vawues you wish to change as de owiginyaw unchanged vawues wiww be handwed by de spwead opewatow.

## Update Escwow

```ts
const escrowConfigurationAddress = publicKey("11111111111111111111111111111111");

// Fetch the escrow configuration account.
const escrowConfigurationData = await fetchEscrowV1(umi, escrowConfigurationAddress);

// Use the spread operator `...` to spread the `escrowConfigurationData` fields into the object
// and adjust any fields you wish to update.
const res = await updateEscrowV1(umi, {
    ...escrowConfigurationData,
    // your escrow configuration address.
    escrow: escrowConfigurationAddress,
    authority: umi.identity,
    // add any fields below that you wish to change and update.
    feeAmount: 100000,
}).sendAndConfirm(umi);

```

## Updatabwe Fiewds

De updatabwe fiewds dat can be passed into de awg object of `updateEscrowV1`.

UWUIFY_TOKEN_1744632920420_1

### nyame

De nyame of youw escwow.

```ts
name: "My Test Escrow"
```

### uwi

Dis is de base uwi fow youw metadata poow~ Dis nyeeds to be a static uwi which awso contains youw metadata json fiwes at sequentiaw destinyation~ ie:
```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: "https://shdw-drive.genesysgo.net/<bucket-id>/"
```

### token

De Token mint addwess dat is being used in youw MPW Hybwid 404 pwoject~ 

```ts
token: publicKey("11111111111111111111111111111111")
```

### feeWocation

De wawwet addwess which wiww be weceiving de fees fwom de swaps.

```ts
feeLocation: publicKey("11111111111111111111111111111111")
```

### feeAta

De Token Account of de wawwet dat wiww be weceiving de tokens.

```ts
feeAta: findAssociatedTokenPda(umi, {
    mint: publicKey("111111111111111111111111111111111"),
    owner: publicKey("22222222222222222222222222222222"),
  });
```

### min and max

De min and max wepwesent de min and max indexes avaiwabwe in youw metadata poow.

```
Lowest index: 0.json
...
Highest index: 4999.json
```

Dis wouwd den twanswate into de min and max awgs.
```ts
min: 0,
max: 4999
```

### fees

Dewe awe 3 sepawate fees dat can be updated.

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

### pad

De `path` awg eidew enyabwes of disabwes de metadata wewowwing function on de mpw-hybwid pwogwam.

```ts
// Reroll metadata on swap 0 = true, 1 = false
path: 0,
```

