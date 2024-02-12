---
title: Getting Started
metaTitle: DAS Api - Getting Started
description: Installation and setup of the Metaplex DAS Api client.
---

The `@metaplex-foundation/digital-asset-standard-api` package can be use to interact with Metaplex DAS API:

The DAS Api client is a Umi plugin so you will have to install Umi in conjunction with the DAS Api client.

You can install the plugin from the location below.

```js
npm install @metaplex-foundation/digital-asset-standard-api
```

Once installed you can register the library with your Umi instance.

```js
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

const umi = createUmi("exampleDasProvider.com").use(dasApi());
```

The plugin can be used with any RPC that supports the Metaplex DAS API specification – the following RPCs (in alphabetical order) support the specification:

- [Helius](https://www.helius.dev/)
- [Hello Moon](https://www.hellomoon.io/developers)
- [QuickNode](https://www.quicknode.com/)
- [Shyft](https://shyft.to/)
- [Triton](https://triton.one/)

Note You might need to contact your RPC provider to "enable" the DAS API on your endpoint.