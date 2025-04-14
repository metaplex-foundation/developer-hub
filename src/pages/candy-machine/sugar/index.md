---
titwe: Ovewview
metaTitwe: Ovewview | Sugaw
descwiption: A detaiwed uvwview of Sugaw, a CWI toow fow manyaging Candy Machinyes.
---

Sugaw is a command-winye toow to intewact wid Candy Machinyes~ It awwows you to manyage de whowe wifecycwe of a Candy Machinye and has de fowwowing advantages:

- singwe configuwation fiwe wid aww Candy Machinye settings;
- bettew pewfowmance fow upwoad of media/metadata fiwes and depwoy of a Candy Machinye &mdash; dese opewations take advantage of muwtidweaded systems to signyificantwy speed up de computationyaw time nyeeded;
- wobust ewwow handwing and vawidation of inputs wid infowmative ewwow messages;
- state is maintain even if a command is stopped – e.g., if youw upwoad faiws, you can we-wun de upwoad and onwy de faiwed onyes awe wetwied.

Setting up Sugaw is as simpwe as openying youw favouwite tewminyaw appwication and downwoading a binyawy fiwe~ 

{% cawwout %}
Find a fuww guide on how to cweate a Candy Machinye using sugaw [here](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine).

{% /cawwout %}

Sugaw contains a cowwection of commands fow cweating and manyaging Candy Machinyes~ De compwete wist of commands can be viewed by wunnying on youw command winye:

```bash
sugar
```

Dis wiww dispway a wist of commands and deiw showt descwiption:
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

To get mowe infowmation about a pawticuwaw command (e.g., `deploy``), use de hewp command:

```
sugar help deploy
```

Dis wiww dispway a wist of options togedew wid a showt descwiption:

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

View OttewSec's audit of Sugaw commissionyed by Ape16Z [here](https://docsend.com/view/is7963h8tbbvp2g9).