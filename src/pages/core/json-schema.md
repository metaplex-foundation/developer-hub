---
title: JSON Schema
metaTitle: JSON Schema | Core
description: Understand the structure and requirements of the off-chain JSON schema for Metaplex Core assets.
---

The off-chain JSON metadata for Metaplex Core assets is similar to the Metaplex Token Metadata standard. However, since more data can be stored on-chain in the asset itself using plugins, some of the data, like attributes and creators, are no longer part of the JSON standard. Although they are not required, they can still be used, and some wallets and tools might render them.

## JSON Schema Fields

Now, we will explore the various fields in the Schema. Examples for different types of Assets such as Videos, Images, 3D Files, and HTML Assets can be found at the bottom of the page. It's important to note that all of these different types can also be part of a single Asset using the `image`, `animation_url`, and `properties` fields.

If you miss some fields that you knew from Metaplex Token Metadata those are probably deprecated. The `creators` for example are part of the [Royalties Plugin](core/plugins/royalties) now.

### Required Fields

- **name**: The name of your NFT asset
  - Example: "Solana Monkey #123", "Degen Ape #45"
  
- **description**: A detailed description of your NFT
  - Example: "A rare cosmic monkey floating through the Solana blockchain"

- **image**: URI pointing to the primary image of your NFT
  - Example: `https://arweave.net/123abc...?ext=png`
  - Supports: PNG, GIF, JPG/JPEG

- **category**: Type of NFT content
    - Examples: `image`, `video`, `audio`, `vr`, `html`

### Optional Fields
  
- **animation_url**: URI for multimedia attachments
  - Example: `https://arweave.net/xyz789...?ext=mp4`
  - Supports: MP4, GIF, GLB, HTML

- **external_url**: Link to an external website for the NFT
  - Example: `https://www.myproject.io/nft/123`

- **attributes**: Array of traits and their values. These can alternatively be stored onchain using the [Attributes Plugin](plugins/attributes)
  - Example:
    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```

- **properties**: Additional metadata including files and categories
  - **files**: Array of all assets associated with the NFT
    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```

## Schema Examples

{% totem title="Examples" id="schema-examples" %}

{% totem-accordion title="Image" %}

```json
{
  "name": "Number #0001",
  "description": "Collection of 10 numbers on the blockchain. This is the number 1/10.",
  "image": "https://arweave.net/swS5eZNrKGtuu5ebdqotzPny4OBoM4wHneZ_Ld17ZU8?ext=png",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/swS5eZNrKGtuu5ebdqotzPny4OBoM4wHneZ_Ld17ZU8?ext=png",
        "type": "image/png"
      },
    ],
    "category": "image"
  }
}
```

{% /totem-accordion  %}

{% totem-accordion title="Animated GIF" %}

```json

```

{% /totem-accordion  %}

{% totem-accordion title="Video" %}

```json

```

{% /totem-accordion  %}

{% totem-accordion title="3D Animated Asset" %}

While most Explorers and wallets support `.glb` files it is recommended to also have a fallback image as part of the schema.

```json

```

{% /totem-accordion  %}

{% totem-accordion title="HTML" %}

The following example for HTML Assets is not supported by wallets currently, as they might see them as security risk. Some explorers render them correctly though, therefore it is recommended to have a fallback image for all the tools not supporting HTML Assets.

```json

```

{% /totem-accordion  %}

{% /totem %}
