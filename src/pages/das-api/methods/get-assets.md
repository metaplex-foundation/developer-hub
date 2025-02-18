---
title: Get Assets
metaTitle: Get Assets | DAS API
description: Returns the information of multiple compressed/standard assets
---

Returns the information of multiple compressed/standard assets including their metadata and owners.

## Parameters

| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `ids`           |    ✅    | An array of asset ids.                     |

## Example

{% dialect-switcher title="getAssets Example" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetIds = [
  publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
  publicKey('8bFQbnBrzeiYQabEJ1ghy5T7uFpqFzPjUGsVi3SzSMHB')
];

const assets = await umi.rpc.getAssets(assetIds);
console.log(assets);
```

{% /totem %}
{% /dialect %}
{% dialect title="cURL" id="curl" %}
{% totem %}

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssets",
    "params": [
      [
        "GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA",
        "8bFQbnBrzeiYQabEJ1ghy5T7uFpqFzPjUGsVi3SzSMHB"
      ]
    ],
    "id": 0
}'
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %} 