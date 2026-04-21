---
title: Register Agent
metaTitle: Register Agent | Metaplex CLI
description: Register an agent identity on an MPL Core asset using the Metaplex CLI.
keywords:
  - agents register
  - agent identity
  - mplx agents register
  - agent registration
  - Metaplex CLI
about:
  - Agent identity registration
  - MPL Core assets
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents register with --name, --description, and --image to register via the API
  - Optionally use --use-ix for direct on-chain registration or --wizard for interactive mode
  - Save the Asset address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: What does mplx agents register do?
    a: It creates an MPL Core asset and registers an agent identity on it. The identity is stored as a PDA derived from the asset address.
  - q: What is the difference between API and direct IX registration?
    a: The API path (default) handles asset creation and identity registration in a single API call with no Irys upload. The direct IX path (--use-ix) sends the registerIdentityV1 instruction directly, needed for existing assets, custom documents, or the wizard.
  - q: Can I register an agent on an existing Core asset?
    a: Yes. Pass the asset address as the first argument and use --use-ix. The asset must not already have an agent identity registered.
---

{% callout title="What You'll Do" %}
Register an agent identity on an MPL Core asset:
- Create a new Core asset with an agent identity (or register on an existing asset)
- Configure agent name, description, image, services, and trust models
- Choose between API mode (default) or direct on-chain registration
{% /callout %}

## Summary

The `mplx agents register` command creates an [MPL Core](/core) asset and registers an [agent identity](/agents) on it. By default it uses the Metaplex Agent API for a single-step flow with no Irys upload needed.

- **Default mode**: API — creates asset + registers identity in one call
- **Direct IX mode**: `--use-ix` — sends `registerIdentityV1` on-chain (needed for existing assets, wizard, or custom documents)
- **Output**: The asset address to use in all subsequent agent commands (e.g. [`agents fetch`](/dev-tools/cli/agents/fetch), [`set-agent-token`](/dev-tools/cli/agents/set-agent-token))

**Jump to:** [Basic Usage](#basic-usage) · [Options](#options) · [Registration Workflows](#registration-workflows) · [Examples](#examples) · [Output](#output) · [Common Errors](#common-errors) · [FAQ](#faq)

## Basic Usage

The default API mode registers an agent with minimal required flags:

```bash {% title="Register an agent (API mode)" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

## Options

| Flag | Short | Description | Required | Default |
|------|-------|-------------|----------|---------|
| `--name <string>` | | Agent name | Yes (unless `--wizard` or `--from-file`) | |
| `--description <string>` | | Agent description | No | |
| `--image <string>` | | Agent image file path (uploaded) or existing URI | No | |
| `--use-ix` | | Send `registerIdentityV1` instruction directly instead of using the API | No | `false` |
| `--new` | | Create a new Core asset and register it (only with `--use-ix`) | No | `false` |
| `--owner <string>` | | Owner public key for the new asset (only with `--new`) | No | Signer |
| `--collection <string>` | | Collection address the asset belongs to | No | |
| `--wizard` | | Interactive wizard to build the registration document (implies `--use-ix`) | No | |
| `--from-file <path>` | | Path to a local agent registration JSON file to upload (implies `--use-ix`) | No | |
| `--active` | | Set agent as active in the registration document | No | `true` |
| `--services <json>` | | Service endpoints as a JSON array | No | |
| `--supported-trust <json>` | | Supported trust models as a JSON array | No | |
| `--save-document <path>` | | Save the generated document JSON to a local file | No | |

{% callout type="note" title="Mutually exclusive flags" %}
`--wizard`, `--from-file`, and `--name` are mutually exclusive — use exactly one to specify the registration document source.
{% /callout %}

## Registration Workflows

### API Mode (Default)

The simplest path — creates a Core asset and registers the identity in a single API call. No Irys upload or `--use-ix` flag needed.

```bash {% title="API registration" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

### Direct IX with New Asset

The `--new` and `--use-ix` flags create a new Core asset and send the `registerIdentityV1` instruction directly. The registration document is uploaded to Irys.

```bash {% title="Direct IX — new asset" %}
mplx agents register --new --use-ix \
  --name "My Agent" \
  --description "An AI agent" \
  --image "./avatar.png"
```

### Direct IX with Existing Asset

The asset address passed as the first argument registers an identity on an existing Core asset.

```bash {% title="Direct IX — existing asset" %}
mplx agents register <AGENT_ASSET> --use-ix \
  --from-file "./agent-doc.json"
```

### Interactive Wizard

The `--wizard` flag provides a step-by-step guided registration and automatically enables `--use-ix`.

```bash {% title="Wizard mode" %}
mplx agents register --new --wizard
```

## Examples

Register with service endpoints:

```bash {% title="With MCP service endpoint" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent with MCP" \
  --image "./avatar.png" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp"}]'
```

Register with trust models:

```bash {% title="With trust models" %}
mplx agents register \
  --name "My Agent" \
  --description "A trusted agent" \
  --image "./avatar.png" \
  --supported-trust '["reputation","tee-attestation"]'
```

Save the registration document locally without registering:

```bash {% title="Save document to file" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent" \
  --save-document "./my-agent-doc.json"
```

## Output

```text {% title="Expected output" %}
--------------------------------
  Agent Asset: <agent_asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

Save the `Agent Asset` address — you'll use it in `agents fetch`, `agents set-agent-token`, and `agents executive delegate`.

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Provide --wizard, --from-file, or --name | No document source specified | Add one of `--name`, `--wizard`, or `--from-file` |
| --services must be a valid JSON array | Malformed JSON in `--services` | Use the format `'[{"name":"MCP","endpoint":"https://..."}]'` |
| --supported-trust must be a valid JSON array | Malformed JSON | Use the format `'["reputation","tee-attestation"]'` |
| API does not support localnet | Running against a local validator | Use `--use-ix` for localnet registration |
| Validation error on field | API rejected a field value | Check the field name in the error message and correct the value |

## Notes

- The API path does not require Irys — the API handles document storage automatically
- The direct IX path (`--use-ix`) uploads the document to Irys before sending the on-chain instruction
- `--wizard` and `--from-file` both imply `--use-ix` — they always use the direct on-chain path
- When `--use-ix` is used with `--name`, `--from-file`, or `--wizard`, the document is uploaded to Irys and the URI is stored on-chain
- `--services` and `--supported-trust` require `--name` — they cannot be used with `--wizard` or `--from-file`

## FAQ

**What does mplx agents register do?**
It creates an MPL Core asset and registers an agent identity on it. The identity is stored as a PDA derived from the asset address.

**What is the difference between API and direct IX registration?**
The API path (default) handles asset creation and identity registration in a single API call with no Irys upload. The direct IX path (`--use-ix`) sends the `registerIdentityV1` instruction directly, needed for existing assets, custom documents, or the wizard.

**Can I register an agent on an existing Core asset?**
Yes. Pass the asset address as the first argument and use `--use-ix`. The asset must not already have an agent identity registered.
