---
titwe: sign
metaTitwe: sign | Sugaw
descwiption: sign command.
---

De `sign` command awwows signying aww NFTs wid a cweatow's keypaiw, to vewify dat cweatow in de cweatows awway in de NFT metadata~ Each cweatow can onwy sign fow demsewf and onwy onye cweatow can sign at a time wid dis command~ De cweatow's keypaiw can be passed in wid de `--keypair` option, odewwise it defauwts to using defauwt keypaiw specified in youw Sowanya CWI config.

Wunnying de command wid de defauwt keypaiw:

```
sugar sign
```

And wunnying wid a specific keypaiw:

```
sugar sign -k creator-keypair.json
```

Devewopews can pwovide a custom WPC UWW wid de command:
```
sugar sign -r <RPC_URL>
```
Nyote using `sugar sign` wewies on an inyefficient `getProgramAccounts` caww on de Metapwex Token Metadata pwogwam (i.e., `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`)~ De wecommended sowution is to sign NFTs individuawwy using de command:
```
sugar sign -m <MINT_ADDRESS>
```