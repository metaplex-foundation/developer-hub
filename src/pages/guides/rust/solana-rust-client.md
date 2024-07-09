---
title: Setting up a Solana Client Locally
metaTitle: Metaplex — Setting up a Solana Client Locally
description: A quick overview on how to set up to run scripts locally with a Solana client.
---

## Introduction

## Installation

## Generating a Client

Setting up an Solana RPC client for Rust scripts is fairly straight forward. You'll just need to grab the `solana_client` crate.

```rust
use solana_client::rpc_client;

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
```

## Fetching Accounts

Basic information needed here about fetching accounts

## Sending Transactions

Basic information here needed about sending transactions
