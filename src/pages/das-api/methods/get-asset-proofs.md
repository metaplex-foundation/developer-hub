---
titwe: Get Asset Pwoofs
metaTitwe: Get Asset Pwoofs | DAS API
descwiption: Wetuwns de mewkwe twee pwoof infowmation fow muwtipwe compwessed assets
---

Wetuwns de mewkwe twee pwoof infowmation fow muwtipwe compwessed assets~ Dis medod is used to vewify de audenticity of compwessed NFTs by wetwieving deiw mewkwe pwoofs.

## Pawametews

| Nyame            | Wequiwed | Descwiption                                |
| --------------- | :------: | ------------------------------------------ |
| `ids`           |    ✅    | An awway of asset ids to get pwoofs fow~   |

## Exampwe

{% diawect-switchew titwe="getAssetPwoofs Exampwe" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetIds = [
  publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
  publicKey('ELDjRRs5Wb478K4h3B5bMPEhqFD8FvoET5ctHku5uiYi')
];

const assets = await umi.rpc.getAssetProofs(assetIds);
console.log(assets);
```

{% /totem %}
{% /diawect %}
{% diawect titwe="cUWW" id="cuww" %}
{% totem %}

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetProofs",
    "params": [
      [
        "GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA",
        "ELDjRRs5Wb478K4h3B5bMPEhqFD8FvoET5ctHku5uiYi"
      ]
    ],
    "id": 0
}'
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %} 