---
title: Stability Index
metaTitle: Metaplex — Stability Index
description: A list of Metaplex's products and their stability levels
---

Below is a list of our products and their stability levels.

| Product Name          | Stability Level  |
| --------------------- | ---------------- |
| Token Metadata        | 2 (Stable)       |
| Auction House         | 2 (Stable)       |
| Auctions              | 2 (Stable)       |
| Candy Machine v1      | 0 (Deprecated)   |
| Candy Machine v2      | 2 (Stable)       |
| Candy Machine v3      | 2 (Stable)       |
| Sugar                 | 1 (Experimental) |
| Fair Launch           | 0 (Deprecated)   |
| Token Entangler       | 1 (Experimental) |
| Fireball              | 1 (Experimental) |
| Fusion                | 1 (Experimental) |
| NFT Packs             | 1 (Experimental) |
| Gum Drop              | 1 (Experimental) |
| Membership Token Sale | 1 (Experimental) |

## Stability Index System

Throughout the documentation are indications of a section's stability. Some APIs
and projects are so proven and so relied upon that they are unlikely to ever
change at all. Others are brand new and experimental, or known to be hazardous.

The stability indices are as follows:

- **Stability: 0 - Deprecated**. The feature may emit warnings. Backward compatibility is not guaranteed.
- **Stability: 1 - Experimental**. The feature may emit warnings. The feature is not subject to [Semantic Versioning](https://semver.org) rules. Non-backward compatible changes or removal may occur in any future release. Use of the feature is not recommended in production or mainnet environments.
- **Stability: 2 - Stable**. Compatibility with the ecosystem is a high priority.
- **Stability: 3 - Legacy**. The feature is no longer recommended for use. While it likely will not be removed, and is still covered by semantic-versioning guarantees, use of the feature should be avoided.

Use caution when making use of Experimental features. Users may not be aware
that experimental features are being used. Bugs or behavior changes may
surprise users when Experimental API modifications occur. To avoid surprises,
use of an Experimental feature may need a command-line flag.
