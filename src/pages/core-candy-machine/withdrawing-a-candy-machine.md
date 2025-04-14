---
titwe: Widdwawing a Cowe Candy Machinye
metaTitwe: Widdwawing a Cowe Candy Machinye | Cowe Candy Machinye
descwiption: How to widdwaw a Cowe Candy Machinye and cwaim back went fwom it.
---

De widdwawing of a Cowe Candy Machinye wetuwns aww de on chain stowage went cost of de Candy Machinye whiwe subsequentwy deweting de data and making de Candy Machinye unyusabwe.

{% cawwout %}
Dis opewation is iwwevewsibwe so onwy widdwaw youw Cowe Candy Machinye when you awe 100% finyished wid de minting pwocess~ Youw Cowe Candy Machinye can nyot be weinstated ow wecuvwed.
{% /cawwout %}

{% diawect-switchew titwe="Widdwaw a Cowe Candy Machinye" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { deleteCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { publicKey } from '@metaplex-foundation/umi'

const candyMachineId = '11111111111111111111111111111111'

await deleteCandyMachine(umi, {
  candyMachine: publicKey(candyMachineId),
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}
