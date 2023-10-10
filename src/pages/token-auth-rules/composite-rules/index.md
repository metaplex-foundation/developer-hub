---
title: Composite Rules
metaTitle: Token Auth Rules - Composite Rules
description: Documentation of the available rules.
---

There are three composite Rule types that allow for combination and nesting of other Rules. They are based on simple [combinatorial logic](https://en.wikipedia.org/wiki/Combinational_logic).

## All
This Rule operates as a logical AND on all Rules contained by an **All** Rule. All contained Rules must evaluate to true in order for the **All** Rule to evaluate to true.

### Fields
* **rules** - A list of contained Rules

## Any
This Rule operates as a logical OR on all Rules contained by an **Any** Rule. Only one contained Rule must evaluate to true in order for the **Any** Rule to evaluate to true.

### Fields
* **rules** - A list of contained Rules

## Not
A **Not** Rule operates as a negation on the contained Rule. If the contained Rule evaluates to true then the **Not** will evaluate to false, and vice versa.

### Fields
* **rule** - The Rule to negate

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules-js-docs.vercel.app/)
