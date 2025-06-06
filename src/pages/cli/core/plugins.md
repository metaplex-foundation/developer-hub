---
title: Plugins
description: Manage MPL Core Asset and Collection plugins
---

The `mplx core plugins` commands allow you to manage plugins for MPL Core Assets and Collections. Plugins extend the functionality of assets and collections with additional features and capabilities.

## Add Plugin

Add a plugin to an asset or collection.

### Basic Usage

```bash
mplx core plugins add <assetId> [options]
```

### Options
- `--wizard`: Interactive wizard mode to select and configure plugins
- `--collection`: Flag to indicate if the target is a collection (default: false)

### Methods

#### 1. Using Wizard Mode
```bash
mplx core plugins add <assetId> --wizard
```
This will:
1. Launch an interactive wizard to select the plugin type
2. Guide you through plugin configuration
3. Add the configured plugin to the asset/collection

#### 2. Using JSON File
```bash
mplx core plugins add <assetId> ./plugin.json
```
The JSON file should contain the plugin configuration in the following format:
```json
{
  "pluginType": {
    "property1": "value1",
    "property2": "value2"
  }
}
```

### Examples

#### Add Plugin to Asset
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard
```

#### Add Plugin to Collection
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard --collection
```

#### Add Plugin Using JSON
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa ./my-plugin.json
```

## Output

After a successful plugin addition, the command will display:
```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## Notes

- The wizard mode provides an interactive way to select and configure plugins
- Different plugins are available for assets and collections
- Plugin configuration must be valid according to the plugin's requirements
- You must have the appropriate authority to add plugins to the asset or collection
- The command will automatically handle:
  - Plugin type validation
  - Configuration validation
  - Transaction signing and confirmation
  - Authority verification 