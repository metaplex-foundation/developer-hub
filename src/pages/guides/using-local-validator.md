---
title: Using the Local Validator
metaTitle: Using the Local Validator
description: Learn how to setup a local development environment and use a local validator
# remember to update dates also in /components/guides/index.js
created: '08-9-2024'
updated: '08-9-2024'
---

## Overview

A **Local Validator** acts as your personal node, providing a local sandbox environment for testing applications without the need to connect to a live blockchain network. It operates a local fully customizable test ledger, which is a simplified version of the Solana ledger, equipped with all native programs pre-installed and various features enabled.

### Setup 

To start using the local validator, you'll need to install the Solana Tools CLI using the following commands:

{% dialect-switcher title="Installation Commands" %}

{% dialect title="MacOs & Linux" id="MacOs & Linux" %}

```
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
```

{% /dialect %}

{% dialect title="Windows" id="Windows" %}

```
cmd /c "curl https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
```

{% /dialect %}

{% /dialect-switcher %}

**Note**: Both script are used to install the `1.18.18` version of Solana. To install the latest version and discover different ways to install the Solana Tools CLI, follow the official [Solana documentation](https://docs.solanalabs.com/cli/install)

### Usage

After installing the CLI, you'll be able to run the following command to start your local validator:

```
solana-test-validator
```

Upon launch, the validator will be accessible at http://127.0.0.1:8899 so to establish a connection to your local validator, use the following code snippet:

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi("http://127.0.0.1:8899")
```

At initialization, the local validator will generate a directory named `test-ledger` in your user folder. This directory holds all data pertinent to your validator, including accounts created and programs both deployed and imported. 

To reset your local validator, you may either:
- Delete the `test-ledger` folder
- Use the command `solana-test-validator --reset`

Additionally, the `solana-logs` command is extremely useful for monitoring the `msg!()` output from on-chain programs.

## How to Manage Programs and Accounts

The Local Validator doesn't include the specific programs and accounts that can be found on mainnet, it only comes with Native Programs and the accounts you created while using it. For tests that require specific programs and accounts found only on the mainnet, the Solana CLI makes it easy to download and load them onto your local validator.

Here’s how to do it:

### Downloading Accounts and Programs:

**For accounts:**
```
solana account -u <source cluster> --output <output format> --output-file <destination file name/path> <address of account to fetch>
```
**For Programs:**
```
solana program dump -u <source cluster> <address of account to fetch> <destination file name/path>
```

### Loading Accounts and Programs:

**For accounts:**
```
solana-test-validator --account <address to load the account to> <path to account file> --reset
```
**For programs**
```
solana-test-validator --bpf-program <address to load the program to> <path to program file> --reset
```

## Create your own "Metaplex" Local Valdator

Now that you understand how the local validator and account/program management work, you can create and manage personalized local validators by scripting it with a bash script.

As an example, Let's create a `metaplex-test-validator` that includes the main Metaplex programs:
- `mpl-token-metadata`
- `mpl-bubblegum`
- `mpl-core`

### Setting up the Directoy and Downloading Program Data

Create a dedicated folder within your path to store the programs you intend to use with your local validator:

```
mkdir ~/.local/share/metaplex-local-validator
```

Next, download the program data from the specified address into the newly created directory:

```
solana program dump -u m metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so
```
```
solana program dump -u m BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so
```
```
solana program dump -u m CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so
```

### Create the Validator Script

Open a new script file using:

```
sudo nano /usr/local/bin/metaplex-local-validator
```

**Note**: If the /user/local/bin directory doesn’t exist, you can create it using `sudo mkdir -p -m 775 /usr/local/bin.`

And paste in the following code into the editor and save it:

```bash
#!/bin/bash

# Validator command
COMMAND="solana-test-validator -r --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so --bpf-program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so"

# Append any additional arguments passed to the script
for arg in "$@"
do
    COMMAND+=" $arg"
done

# Execute the command
eval $COMMAND
```

**Note**: To exit and save, use Ctrl + X, then Y to confirm, and Enter to save.

After this we need ensure the script can be executed, so we modify its permissions:

```
sudo chmod +x /usr/local/bin/metaplex-test-validator
```

Finally, test your new validator script within your project folder:

```
metaplex-test-validator
```