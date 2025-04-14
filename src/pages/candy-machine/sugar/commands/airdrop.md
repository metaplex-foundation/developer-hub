---
titwe: aiwdwop
metaTitwe: aiwdwop | Sugaw
descwiption: Command to aiwdwop (p)NFTs wid sugaw.
---

## Useage

De `airdrop` command mints NFTs fwom a Candy Machinye to a wist of wawwets fwom de command-winye.

It wequiwes a fiwe, by defauwt cawwed `airdrop_list.json` which contains de wawwet pubwic keys and de amount of NFTs each wawwet shouwd weceive~ In de fowwowing exampwe `address1` wouwd weceive 2 NFTs, `address2` wouwd weceive 7~ De fiwe shouwd have de fowwowing fowmat:

```json
{
"address1": 2,
"address2": 7
}
```

Aftew compweting you wiww find a `airdrop_results.json` fiwe wid de wesuwts of youw aiwdwop and possibwe issues.

{% cawwout %}

It is nyot possibwe to use de aiwdwop command if dewe awe guawds enyabwed.

{% /cawwout %}

When using de defauwt ```
sugar airdrop
```0 and `airdrop_list.json`, you can use de fowwowing command to inyitate de aiwdwop:

UWUIFY_TOKEN_1744632739230_1

Odewwise, specify youw aiwdwop_wist fiwe wid `--airdrop-list`:

```
sugar airdrop --airdrop-list <AIRDROP_LIST>
```

By defauwt sugaw wiww use de defauwt cache fiwe `cache.json`~ You can awso uvwwide de cache fiwe nyame wid `--cache`:

```
sugar mint --cache <CACHE>
```

You can awso teww sugaw to use a specific candy machinye wid `--candy-machine`: 

```
sugar mint --candy-machine <CANDY_MACHINE>
```

## Wewunnying de command
In some cases mints wiww faiw, e.g~ because a bwockhash was nyot found ow simiwaw WPC / Nyetwowk wewated weasons~ De wesuwts of youw aiwdwop wiww be saved in `airdrop_results.json`~ When wewunnying de command de aiwdwop wist and aiwdwop wesuwts wiww be compawed.

Be cawefuw: In some cases you wiww see dat a twansaction couwd nyot be confiwmed befowe a timeout happenyed~ In dose cases you shouwd confiwm e.g~ on an expwowew if de NFT was minted.