---
title: How to Diagnose Transaction Errors on Solana
metaTitle: How to Diagnose Transaction Errors on Solana
description: Learn how to diagnose transaction errors on Solana and find logical solutions these errors.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

## Sharing Errors to a Support Network

If you are receiving errors that you do not understand and wish to show to someone else it can sometimes be difficult to describe the situation. This often happens when using a form of SDK to send transactions such as Metaplex Umi, Solana SDK, Solana Web3js. These clients will often send whats called a **pre-flight transaction** or simulation to an RPC to check if the transaction is going to succeed or not. If a transaction is deemed to fail then a transaction is not sent to the chain and will just throw an error message instead. While this is good behavior on behalf of the network, it doesn't give us anything we can logically get help with. This is where skipping simulation/pre-flight comes into play and forcing the failing transaction to be registered by the chain which becomes sharable to other people. 


## Skipping Preflight

Most SDK's you are using to send transactions will come with the ability to `skipPreflight` when sending a transaction. This will skip the simulation and preflight and force the chain to register the transaction. The reason this helps us is that the exact transaction you are trying to send is registered and stored on the chain including:

- All accounts used
- All instructions submitted
- All logs including error messages

This failed transaction can then be sent to someone to inspect the details of the transaction to help diagnose why your transaction is failing.

This works on both **Mainnet** and **Devnet**. This does also work on **Localnet** but is more complicated and sharing the details is more difficult.

### umi

Metaplex Umi's `skipPreflight` can be found in the `sendAndConfirm()` and `send()` function args and can be enabled like so:

#### sendAndConfirm()
```ts
const tx = createV1(umi, {
    ...args
}).sendAndConfirm(umi, {send: { skipPreflight: true}})

// Convert signature to string
const signature = base58.deserialize(tx.signature);

// Log transaction signature
console.log(signature)
```

#### send()
```ts
const tx = createV1(umi, {
    ...args
}).send(umi, {skipPreflight: true})

// Convert signature to string
const signature = base58.deserialize(tx);

// Log transaction signature
console.log(signature)
```

### web3js

```ts
// Create Connection
const connection = new Connection("https://devnet-aura.metaplex.com/<YOUR_API_KEY>", "confirmed",);

// Create your transaction
const transaction = new VersionedTransaction()

// Add skipPreflight to the sendTransaction() function
const res = await connection.sendTransaction(transaction, [...signers], {skipPreflight: true})

// Log out the transaction signature
console.log(res)
```

### solana-client (rust)

```rust
// Create Connection
let rpc_client = rpc_client::RpcClient::new("https://devnet-aura.metaplex.com/<YOUR_API_KEY>".to_string());

// Create your transaction
let transaction = new Transaction()

// Add skipPreflight to the sendTransaction() function
let res = rpc_client
    .send_transaction_with_config(&create_asset_tx, RpcSendTransactionConfig {
        skip_preflight: true,
        preflight_commitment: Some(CommitmentConfig::confirmed().commitment),
        encoding: None,
        max_retries: None,
        min_context_slot: None,
    })
    .await
    .unwrap();

// Log out the transaction signature
println!("Signature: {:?}", res)
```

By logging out the transaction ID you can visit a Solana blockchain explorer and search for the transaction ID which will display the failed transaction.

- SolanaFM
- Solscan
- Solana Explorer

This transaction ID or explorer link can the be shared with someone who may be able to assist you.

## Common Types of Errors

There are some common errors that normally occur 


### Error Codes xx (23)

While normally complimented with some additional text to describe the error codes these codes can sometimes appear on their own in a non descriptive manner. If this happens and you know the program that threw the error you can sometimes find the program in Github and it will have an errors.rs page that lists out all the possible errors of the program.

Starting at an index of 0 you can count down/work out the position of the error in the list.

Here is an example of a error.rs page from the Metaplex Core program.


[https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs)

As we can see if we were receiving an error code of 20 from our failing transaction that would translate to

```rust
/// 20 - Missing update authority
    #[error("Missing update authority")]
    MissingUpdateAuthority,
```

### Error Codes 6xxx (6002)

6xxx error codes are custom program Anchor error codes. As above, if you are able to find the program in github there will normally be a errors.rs file which lists out the programs errors and codes. Anchor custom program error codes start at 6000 so the first error in the list will be 6000, the second 6001 etc... You can in theory just take the last digits of the error code, in the case of 6026 this is 26 and work our way down the errors as before starting at index 0.

If we take the Mpl Core Candy Machine program as an example, this is an Anchor program so our error codes will start at 6xxx.

[https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs](https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs)

If your transaction is returning an error of `6006` will can take the end of the number, in this case `6` and work our way down the error.rs list starting from an index of 0. 

```rust
#[msg("Candy machine is empty")]
CandyMachineEmpty,
```

### Hex Errors

In some rare occasions you might experience the return of errors in a hex format such as `0x1e`.

In this case you can use a [Hex to Decimal converter](https://www.rapidtables.com/convert/number/hex-to-decimal.html) to format the error correctly into something we can use.

- If the error is in xx format see [Error Codes xx](#error-codes-xx-23)
- If the error is in 6xxx format see [Error Codes 6xxx](#error-codes-6xxx-6002)

### Incorrect Owner

This error normally means that an account passed into the account list isn't owned by the expected program and therefore will fail. For example a Token Metadata Account is expected to be owned by the Token Metadata Program, and if the account in that particular position in the transactions account list doesn't meet that criteria then the transaction will fail.

These types of errors often occur when a PDA is perhaps generated with the wrong seeds or an account hasn't been initialized/created yet.

### Assert Error

Assert errors are matching errors. Assert will normally take 2 variables (in most cases address/publicKeys) and check they are the same expected value. If not an `Assert left='value' right='value'` error will be thrown detailing the two values and that they do not match as expected.

### 0x1 Attempt to Debit

This is a common error that reads `Attempt to debit an account but found no record of a prior credit`. This error basically implies that the account does not have any SOL within it.