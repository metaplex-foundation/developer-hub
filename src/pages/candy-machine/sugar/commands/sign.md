---
title: sign
metaTitle: Candy Machine - Sugar - sign
description: sign command.
---

The `sign` command allows signing all NFTs with a creator's keypair, to verify that creator in the creators array in the NFT metadata. Each creator can only sign for themself and only one creator can sign at a time with this command. The creator's keypair can be passed in with the `--keypair` option, otherwise it defaults to using default keypair specified in your Solana CLI config.

Running the command with the default keypair:

```
sugar sign
```

And running with a specific keypair:

```
sugar sign -k creator-keypair.json
```

Note using `sugar sign` relies on a standard `getProgramAccounts` call to the Metaplex Token Metadata program (i.e., `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`). Ensure that the RPC node you use supports standard gPA calls to that address, as it can be pretty intensive. Developers can provide a custom RPC URL with the command:
```
sugar sign -r <RPC_URL>
```

Alternatively, NFTs can be signed one at a time using the command:
```
sugar sign -m <MINT_ADDRESS>
```