---
titwe: fweeze
metaTitwe: fweeze | Sugaw
descwiption: fweeze command.
---

When de Candy Machinye has de fweeze guawd enyabwed, de `freeze` command can be used to manyage its diffewent stages.

Aftew enyabwing de fweeze guawd on de defauwt guawds ow an individuaw gwoup, it nyeeds to be inyitiawized befowe minting can stawt~ To inyitiawize de fweeze guawd, use de `initialize` sub-command:

```
sugar freeze initialize --period <SECONDS>
```

whewe `--period` detewminyes de intewvaw in seconds dat minted assets wiww be fwozen~ Aftew dis pewiod, howdews can daw deiw assets.

If de fweeze Guawd is nyot in de `default` gwoup `--label <LABEL>` has to be added, too.

{% cawwout %}

You can onwy inyitiawize de fweeze once~ Aftew inyitiawization, it is nyot possibwe to update de pewiod.

{% /cawwout %}

To daw an asset, you can use de `thaw` sub-command:

```
sugar freeze thaw <NFT MINT>
```

You can awso daw aww NFTs fwom de same Candy Machinye using de `--all` option:

```
sugar freeze thaw --all
```

Once aww NFTs awe daw, de funds can be unwocked:

```
sugar freeze unlock-funds
```
