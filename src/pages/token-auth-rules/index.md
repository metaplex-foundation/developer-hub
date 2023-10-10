---
title: Overview
metaTitle: Token Auth Rules - Overview
description: Provides a high-level overview of NFT permissions.
---
Token Authorization Rules is an advanced metaprogramming tool meant to evaluate permissions of an instruction occurring on an SPL Token. The program itself can be used to create and update Rule Sets, which are collections of Rules which represent specific criteria.

## Introduction
When a token operation is performed, the program can be called with instruction details (e.g. destination address for a token transfer), and those details are validated against the Rule Set. If the Rules are evaluated to be invalid, the instruction will fail and the whole transaction will be reverted. This enables whole transactions to be built that couple token operations with the Token Auth Rules program so any transactions, and therefore the contained token operation, will be reverted if the Rules in the associated Rule Set are violated.

## Features

[Create or Update Rule Sets](/token-auth-rules/create-or-update) - An instruction used to both initialize and update Rule Set contents.

[Rule Set Buffers](/token-auth-rules/buffers) - How large Rule Sets are handled.

[Validate Rule Sets](/token-auth-rules/validate) - How a Rule Set is validated.

## Rule Types
Authorization rules are variants of a `Rule` enum that implements a `validate()` function.

There are **Primitive Rules** and **Composed Rules** that are created by combining of one or more primitive rules.

**Primitive Rules** store any accounts or data needed for evaluation, and at runtime will produce a true or false output based on accounts and a well-defined `Payload` that are passed into the `validate()` function.

**Composed Rules** return a true or false based on whether any or all of the primitive rules return true.  Composed rules can then be combined into higher-level composed rules that implement more complex boolean logic.  Because of the recursive definition of the `Rule` enum, calling `validate()` on a top-level composed rule will start at the top and validate at every level, down to the component primitive rules.

## Payload
The Token Auth Rules program relies on payload data received from the program requesting evaluation from a Rule Set. The underlying data structure of the Payload is a HashMap, with Payload fields being represented as HashMap keys. Most Rules store a pre-defined Payload field so a lookup can be performed at validation time.

## Next Steps

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules-js-docs.vercel.app/)
