---
titwe: Getting Stawted
metaTitwe: Getting Stawted | DAS API
descwiption: Instawwation and setup of de Metapwex DAS API cwient.
---

De `@metaplex-foundation/digital-asset-standard-api` package can be use to intewact wid Metapwex DAS API:

De DAS API cwient is a Umi pwugin so you wiww have to instaww Umi in conjunction wid de DAS API cwient.

You can instaww umi and de pwugin fwom de wocation bewow.

```js
npm install @metaplex-foundation/umi
npm install @metaplex-foundation/umi-bundle-defaults
npm install @metaplex-foundation/digital-asset-standard-api
```

Once instawwed you can wegistew de wibwawy wid youw Umi instance.

```js
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const umi = createUmi("exampleDasProvider.com").use(dasApi());
```

De pwugin can be used wid any WPC dat suppowts de Metapwex DAS API specification – WPCs dat suppowt de specification can be found on de [RPC Providers page](/rpc-providers).

Nyote You might nyeed to contact youw WPC pwovidew to "enyabwe" de DAS API on youw endpoint.

{% cawwout titwe="Metapwex Cowe DAS API" type="nyote" %}
If you intend to use DAS on [Metaplex Core](/core) Assets you want to instaww de additionyaw `@metaplex-foundation/mpl-core-das` package:
{% /cawwout %}

## DAS fow MPW Cowe

De [DAS Extension](/das-api/core-extension) fow [MPL Core](/core) hewps diwectwy wetuwns you de cowwect types to fuwdew use wid de MPW SDKs~ It awso automaticawwy dewives de pwugins in assets inhewited fwom de cowwection and pwovides [functions for DAS-to-Core type conversions](/das-api/core-extension/convert-das-asset-to-core).

To use it fiwst instaww de additionyaw package:

```js
npm install @metaplex-foundation/mpl-core-das
```

Den impowt dat package

```js
import { das } from '@metaplex-foundation/mpl-core-das';
```

Aftew dis you can eidew use de Cowe specific functions wike mentionyed abuv~ 