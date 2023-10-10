---
title: Primitive Rules
metaTitle: Token Auth Rules - Primitive Rules
description: Documentation of the available rules.
---

## Additional Signer
An additional account must sign this transaction.

### Fields
* **address** - The address that must sign the Transaction

## Amount
The amount of tokens being transferred is compared (greater than, less than, or equal to) against an amount.

### Fields
* **amount** - The amount to be compared against
* **operator** - The comparison operation to use: greater than, less than, equal to
* **field** - The payload field to compare against

## Namespace

### Fields

## Pass
This Rule always evaluates as true during validation.

## PDA Match
Performs a PDA derivation using `find_program_address()` and the associated Payload and Rule fields. This Rule evaluates to true if the PDA derivation matches the Payload address.

### Fields
* **program** - The Program from which the PDA is derived
* **pda_field** - The field in the Payload which the derived address much match for the Rule to evaluate to true
* **seeds_field** - The field in the Payload which stores an Array of PDA seeds to use for derivation

## Program Owned
Checks that the Program indicated owns the account. This is useful for PDAs which are typically always owned by the program they are derived from (e.g. marketplaces and utility programs).

### Fields
* **program** - The Program that must own the account specified in the field
* **field** - The field in the Payload to check the owner of

## Program Owned List
The version of [Program Owned](#program-owned) that compares against a list of possible owning Programs.

### Fields
* **programs** - A vector of Programs, one of which must own the account specified in the field
* **field** - The field in the Payload to check the owner of

## Program Owned Tree
The version of [Program Owned](#program-owned) that compares against a merkle tree of possible owning Programs.

### Fields
* **pubkey_field** - The field in the Payload to check the owner of
* **proof_field** - The field in the payload that contains the full merkle proof to be hashed
* **root** - The root of the merkle tree

## Pubkey Match
Checks that the Pubkey specified matches a specific Pubkey. For example, this rule can be used when only a certain person should be granted access to perform operations on an NFT.

### Fields
* **pubkey** - The public key to be compared against
* **field** - The field specifying which Pubkey in the Payload to check

## Pubkey List Match
The version of [PubkeyMatch](#pubkey-match) that checks that the Pubkey is contained in a the list of possible Pubkeys. For example, this rule can be used for building an allowlist of users who are allowed to interact with a token.

### Fields
* **pubkeys** - The list of public keys to be compared against
* **field** - The field specifying which Pubkey in the Payload to check

## Pubkey Tree Match
The version of [PubkeyMatch](#pubkey-match) that checks that the Pubkey is contained in a merkle tree of possible Pubkeys. For example, this rule can be used for building a very large allowlist of users who are allowed to interact with a token.

### Fields
* **pubkey_field** - The field in the Payload which contains the pubkey to check
* **proof_field** - The field in the payload that contains the full merkle proof to be hashed
* **root** - The root of the merkle tree

## Next Steps

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules-js-docs.vercel.app/)
