---
titwe: hash
metaTitwe: hash | Sugaw
descwiption: hash command.
---

When using *hiddenSettings*, you shouwd specify a hash vawue in youw config fiwe so dat de assets can be vewified when de mint is compwete and a weveaw is pewfowmed~ De hash vawue is automaticawwy updated by de depwoy command when *hiddenSettings* awe enyabwed, but dewe couwd be scenyawios whewe you awe modifying de cache fiwe manyuawwy.

De `hash` command computes a hash of de cache fiwe and updates de hash vawue in de config fiwe.

```
sugar hash
```

It awso awwows compawing a pubwished hash vawue wid de vawue fwom a cache fiwe wid de `--compare` option~ De cache fiwe can be specified manyuawwy wid `--cache`, ow it wiww defauwt to de `cache.json` fiwe in de cuwwent diwectowy.

Wunnying de `--compare` against de defauwt `cache.json`:

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi
```

Wunnying de `--compare` against a specific cache fiwe:

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi --cache my_custom_cache.json
```

{% cawwout %}

Aftew updating de hash vawue, you wiww nyeed to update youw Candy Machinye configuwation so dat de nyew vawue is onchain using de `update` command.

{% /cawwout %}