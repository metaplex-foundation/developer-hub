---
title: Toolbox
metaTitle: Toolbox | Umi
description: A Package Designed to complement Umi by providing a set of essential functions for Solana's Native Program.
---

The **mpl-toolbox** package is designed to complement Umi by providing a set of essential functions for Solana's Native Programs.

{% quick-links %}

{% quick-link title="API reference" icon="CodeBracketSquare" target="_blank" href="https://mpl-toolbox.typedoc.metaplex.com/" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Installation

{% packagesUsed packages=["toolbox"] type="npm" /%}

The package isn't included by default when using the Umi package, so to install it and start using it, you need to run the following command

```
npm i @metaplex-foundation/mpl-toolbox
```

## Programs Included

While Umi, and the other Metaplex products, already offer comprehensive packages that includes all the essential functions to get you started, they don't include the necessary helpers and functions for lower-level yet critical tasks, especially when dealing with Solana's native programs. For example, with just Umi, creating an account using the SPL System Program or extending a Lookup Table from the SPL Address Lookup Table program it's not possible.

That's why we created **mpl-toolbox**, a package that provides a set of essential helpers for Solana's Native that simplifies these low-level tasks. 

**The mpl-toolbox package includes helpers from the following programs:**

| Programs                                                                                | Description                                                                                                                 |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [SPL System](/umi/toolbox/system-program-and-extras).                                   | Solana's native program for account creation.                                                                               |
| [SPL Token and SPL Associated Token](/umi/toolbox/token-program-and-extras).            | Solana's native programs for managing tokens.                                                                               |
| [SPL Memo](/umi/toolbox/memo-program).                                                  | Solana's native program for attaching memos to transactions.                                                                |
| [SPL Address Lookup Table](/umi/toolbox/address-lookup-table-program).                  | Solana's native program for managing lookup tables.                                                                         |
| [SPL Compute Budget](/umi/toolbox/compute-budget-program).                              | Solana's native program for managing compute units.                                                                         |
| [MPL System Extras](/umi/toolbox/system-program-and-extras#mpl-system-extras).          | A Metaplex program offering additional low-level features on top of SPL System.                                             |
| [MPL Token Extras](/umi/toolbox/token-program-and-extras#mpl-token-extras).             | A Metaplex program offering additional low-level features on top of SPL Token.                                              |