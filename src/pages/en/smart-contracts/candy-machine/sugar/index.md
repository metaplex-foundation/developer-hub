---
title: Overview
metaTitle: Overview | Sugar
description: A detailed overview of Sugar, a CLI tool for managing Candy Machines.
---

Sugar is a command-line tool to interact with Candy Machines. It allows you to manage the whole lifecycle of a Candy Machine and has the following advantages:

- single configuration file with all Candy Machine settings;
- better performance for upload of media/metadata files and deploy of a Candy Machine &mdash; these operations take advantage of multithreaded systems to significantly speed up the computational time needed;
- robust error handling and validation of inputs with informative error messages;
- state is maintain even if a command is stopped – e.g., if your upload fails, you can re-run the upload and only the failed ones are retried.

Setting up Sugar is as simple as opening your favourite terminal application and downloading a binary file.

{% callout %}
Find [the full Candy Machine creation guide](/smart-contracts/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine) for using sugar.

{% /callout %}

Sugar contains a collection of commands for creating and managing Candy Machines. The complete list of commands can be viewed by running on your command line:

```bash
sugar
```

This will display a list of commands and their short description:
```
sugar-cli 2.7.1
Command line tool for creating and managing Metaplex Candy Machines.

USAGE:
    sugar [OPTIONS] <SUBCOMMAND>

OPTIONS:
    -h, --help                     Print help information
    -l, --log-level <LOG_LEVEL>    Log level: trace, debug, info, warn, error, off
    -V, --version                  Print version information

SUBCOMMANDS:
    airdrop       Airdrop NFTs from candy machine
    bundlr        Interact with the bundlr network
    collection    Manage the collection on the candy machine
    config        Manage candy machine configuration
    deploy        Deploy cache items into candy machine config onchain
    freeze        Manage freeze guard actions
    guard         Manage guards on the candy machine
    hash          Generate hash of cache file for hidden settings
    help          Print this message or the help of the given subcommand(s)
    launch        Create a candy machine deployment from assets
    mint          Mint one NFT from candy machine
    reveal        Reveal the NFTs from a hidden settings candy machine
    show          Show the onchain config of an existing candy machine
    sign          Sign one or all NFTs from candy machine
    upload        Upload assets to storage and creates the cache config
    validate      Validate JSON metadata files
    verify        Verify uploaded data
    withdraw      Withdraw funds a from candy machine account closing it
```

To get more information about a particular command (e.g., `deploy``), use the help command:

```
sugar help deploy
```

This will display a list of options together with a short description:

```
Deploy cache items into candy machine config onchain

USAGE:
    sugar deploy [OPTIONS]

OPTIONS:
    -c, --config <CONFIG>
            Path to the config file, defaults to "config.json" [default: config.json]

        --cache <CACHE>
            Path to the cache file, defaults to "cache.json" [default: cache.json]

        --collection-mint <COLLECTION_MINT>
            The optional collection address where the candymachine will mint the tokens to

    -h, --help
            Print help information

    -k, --keypair <KEYPAIR>
            Path to the keypair file, uses Sol config or defaults to "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            Log level: trace, debug, info, warn, error, off

    -p, --priority-fee <PRIORITY_FEE>
            Priority fee value [default: 500]

    -r, --rpc-url <RPC_URL>
            RPC Url
```

View [OtterSec's audit report](https://docsend.com/view/is7963h8tbbvp2g9) of Sugar commissioned by Ape16Z.
