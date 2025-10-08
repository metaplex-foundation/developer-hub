---
title: "Withdraw"
metaTitle: "MPLX CLI - Withdraw Candy Machine"
description: "Withdraw and delete MPL Core Candy Machines using the MPLX CLI to reclaim rent SOL."
---

The `mplx cm withdraw` command withdraws and deletes a candy machine, recovering any remaining SOL balance and cleaning up the on-chain account. This operation is irreversible and should be used when the candy machine is no longer needed. Already minted NFTs are not affected.

{% callout title="Irreversible" type="warning" %}
This command is irreversible. Once executed your candy machine is destroyed and can not be recreated.
{% /callout %}

## Usage

```bash
# Withdraw candy machine from current directory
mplx cm withdraw

# Withdraw specific candy machine by address
mplx cm withdraw --address <candy_machine_address>

```

Optional Flags that you can use:
- `--address`: Specify candy machine address directly
- `--force`: *Danger* Skip confirmation prompts (use with extreme caution)


## ⚠️ Important Warnings

### Irreversible Operation
- **Permanent Deletion**: The candy machine account will be permanently deleted
- **No Recovery**: Cannot be undone or restored
- **Data Loss**: All on-chain configuration and state will be lost
- **Item Access**: Existing minted NFTs are not affected

### 🛡️ Best Practices

**Planning:**
- Plan withdrawal timing carefully
- Coordinate with team members

**Execution:**
- Double-check all parameters
- Use devnet for practice

## Related Commands

- [`mplx cm fetch`](/cli/cm/fetch) - Check status before withdrawal
- [`mplx cm create`](/cli/cm/create) - Create new candy machines
- [`mplx cm validate`](/cli/cm/validate) - Validate before withdrawal
- [`solana balance`](https://docs.solana.com/cli) - Check recovered balance
