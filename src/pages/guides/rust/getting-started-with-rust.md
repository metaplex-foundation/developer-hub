---
title: Getting Started with Rust
metaTitle: Metaplex — Getting Started with Rust
description: A quick overview on how to get started with Rust in the Solana ecoSystem.
---

## Introduction

It's no doubt that if you are building on Solana you most likely have come across the term Rust which is the most popular language for building programs within the Solana ecosystem.

Rust can be quite a daunting task to look at and use if you are new to developing but here are some resources to get you started with Rust and the Solana ecosystem.

## The Rust Book

Start here to learn rust. It takes from basics through to the advanced coding using the language.

[https://doc.rust-lang.org/stable/book/](https://doc.rust-lang.org/stable/book/)

## Anchor

Anchor is a framework that helps you build Solana programs by stripping away a chunk of the security boilerplate and handling it for you speeding up the development process.

[https://www.anchor-lang.com/](https://www.anchor-lang.com/)

## Metaplex Rust SDKs

All Metaplex programs come with a Rust SDK that you can use both in Rust scripts and to CPI (Cross Program Invocation) into another program from your own.

These SDK's come with a handful of different builders:

- `Builder`
- `CpiBuilder`

which strips a lot of the boiler plate out for you. Lets look at the transfer functions from `mpl-core` crate that are available to us.

```rust
TransferV1
TransferV1Builder
TransferV1Cpi
TransferV1CpiAccounts
TransferV1CpiBuilder
TransferV1InstructionArgs
TransferV1InstructionData
```

The builders (Builder, and CpiBuilder) are both helper functions that allow you pass in accounts and data in a simpler manner by filling out the transaction accounts and data into the appropiate areas of an instruction for you.
