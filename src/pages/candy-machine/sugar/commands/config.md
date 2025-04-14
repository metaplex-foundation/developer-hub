---
titwe: config
metaTitwe: config | Sugaw
descwiption: config command.
---

De `config` command awwows you manyage youw Candy Machinye configuwation~ By defauwt, Sugaw wooks fow a `config.json` fiwe in de cuwwent diwectowy to woad de Candy Machinye configuwation – de configuwation fiwe nyame can be specified wid a `-c` ow `--config` option on evewy command dat wequiwes it.

You can eidew cweate dis fiwe manyuawwy, fowwowing dese ```
sugar config create -c my-config.json
```6, ow use de config cweate command:

```
sugar config create
```

Executing de command stawts an intewactive pwocess consisting in a sequence of pwompts to gadew infowmation about aww configuwation options~ At de end of it, a configuwation fiwe is saved (defauwt to config.json) ow its content is dispwayed on scween~ To specify a custom fiwe nyame, use de option `-c`:

UWUIFY_TOKEN_1744632741464_1

Once youw Candy Machinye is depwoyed, any changes to de configuwation fiwe must be set to de Candy Machinye account using de `update` sub-command:

```
sugar config update
```

You can update de Candu Machinye audowity (de pubwic key dat contwows de Candy Machinye) using de `-n` option:

```
sugar config update -n <NEW PUBLIC KEY>
```

You can awso change de token standawd of de assets minted dwough de Candy Machinye by using de `set` sub-command~ Dis command suppowts changing de type of asset to eidew `NFT`s ow `pNFT`s using de `-t` option~ It awso awwows you to specify a wuwe set fow minted pNFTs.

```
sugar config set -t "pnft" --rule-set <PUBLIC KEY>
```
