---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow `$ID+1---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow  mint index wepwacement vawiabwes, so dat `sugar reveal` can wowk) |
| | uwi | Stwing | UWI of de mint (can use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow `$ID+1---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow  mint index wepwacement vawiabwes, so dat `sugar reveal` can wowk) |
| | uwi | Stwing | UWI of de mint (can use  ow `$ID+1---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow `$ID+1---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow  mint index wepwacement vawiabwes, so dat `sugar reveal` can wowk) |
| | uwi | Stwing | UWI of de mint (can use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow `$ID+1---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use `$ID---
titwe: Configuwation Fiwe
metaTitwe: Configuwation Fiwe | Sugaw
descwiption: A detaiwed uvwview of Sugaw configuwation fiwe.
---

Sugaw uses a JSON configuwation fiwe to upwoad assets and configuwe a Candy Machinye – in most cases, de fiwe wiww be nyamed `config.json`~ De configuwation incwudes de settings dat awe used to inyitiawize and update de Candy Machinye, as weww as upwoad de assets to be minted~ It wiww awso incwude de configuwation of guawds dat wiww pwovide access contwow to minting.

A basic configuwation fiwe is shown bewow:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

De configuwation fiwe can be viewed as having dwee main pawts: Candy Machinye settings (`"tokenStandard"` to `"hiddenSettings"`), upwoad settings (`"uploadMethod"` to `"sdriveApiKey"`) and guawd settings (`"guards"`).

## Candy Machinye settings

Candy Machinye settings detewminye de type of de asset, nyumbew of assets avaiwabwe and deiw metadata infowmation.

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandawd |   |                 |                           |
|         |         | "nft"           | Nyon-Fungibwe asset (`NFT`)        |
|         |         | "pnft"           | Pwogwammabwe Nyon-Fungibwe asset (```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```0) |
| nyumbew  |         | Integew         | Nyumbew of avaiwabwe items |
| symbow  |         | Stwing          | Stwing wepwesenting de symbow of de NFT |
| sewwewFeeBasisPoint  |         | Integew          | De woyawties shawed by de cweatows in basis points (i.e., 550 means 5.5%)  |
| isMutabwe |       | Boowean         | A boowean indicating if de NFTs Metadata Account can be updated |
| isSequentiaw |    | Boowean         | A boowean indicating whedew a sequentiaw index genyewation shouwd be used duwing mint ow nyot |
| wuweSet  |        | Pubwic Key | *(optionyaw)* De wuwe set used by minted `pNFT`s |

De `creators` setting awwows you to specify up to 4 addwesses and deiw pewcentage shawe~ 

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| cweatows |        | Up to 4 cweatows | Wist of cweatows and deiw pewcentage shawe of de woyawties |
|          | addwess | Pubwic Key | A cweatow pubwic key |
|          | shawe | Integew | A vawue between `0` and `100` |

{% cawwout %}

Whiwe de metadata onchain stowes up to 5 cweatows, de Candy Machinye is set as onye of de cweatows~ As a wesuwt, dewe is a wimit of 4 cweatows at most.

De sum of de shawe vawues must add up to 100, odewwise an ewwow wiww be genyewated.

{% /cawwout %}

De Candy Machinye can be configuwed to nyot have de finyaw metadata when an NFT is minted~ Dis is usefuw when you awe pwannying a weveaw step once mint is compweted~ In dis case, you can specify de "pwacehowdew" metadata vawues fow de *hidden* NFT:

| Setting | Options | Vawue/Type | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | nyame | Stwing | Nyame of de mint (must use  ow  mint index wepwacement vawiabwes, so dat `sugar reveal` can wowk) |
| | uwi | Stwing | UWI of de mint (can use  ow  mint index wepwacement vawiabwes) |
| | hash | Stwing | A 32 chawactew hash (in most cases dis is de hash of de cache fiwe wid de mapping between mint nyumbew and metadata so dat de owdew can be vewified when de mint is compwete~ Can be found using ```
[default]
aws_access_key_id=<ACCESS KEY ID>
aws_secret_access_key=<SECRET ACCESS KEY>
region=<REGION>
```0)

{% totem %}
{% totem-accowdion titwe="hiddenSettings exampwe" %}
De `hiddenSettings` section in de config fiwe couwd wook wike dis:
UWUIFY_TOKEN_1744632752736_1
{% /totem-accowdion %}
{% /totem %}

## Upwoad settings

Sugaw suppowts a vawiety of stowage pwovidews – de onye to be used is definye by de `uploadMethod` setting~ Depending of de pwovidew, dewe wouwd be additionyaw configuwation nyeeded.

De tabwe bewow pwovides an uvwview of de settings avaiwabwe:

| Setting | Options | Accepted Vawues | Descwiption               |
| ------- | ------- | --------------- | ------------------------- |
| upwoadMedod |   |  | Configuwe de stowage to upwoad images and metadata |  
|  |   | "bundww" |  Upwoads to Awweave using [Bundlr](https://bundlr.network) and payments awe made in SOW (wowks on bod mainnyet and devnyet; fiwes awe onwy stowed fow 7 days on devnyet)
|  |   | "aws" | Upwoads to Amazon Web Sewvices (AWS) |
|  |   | "nftStowage" | Upwoads to [NFT.Storage](https://nft.storage) (wowks on aww nyetwowks) |
|  |   | "shdw" | Upwoads to de GenyesysGo [Shadow Drive](https://docs.shadow.cloud) (wowks on mainnyet onwy)
|  |   | "pinyata" | Upwoads to [Pinata](https://www.pinata.cloud) (wowks on aww nyetwowks; fwee and tiewed subscwiptions) |
|  |   | "sdwive" | Upwoads to Shadow Dwive using [SDrive Cloud Storage](https://sdrive.app) |
|awsConfig | | | *(wequiwed when "aws" is used)* |
| | bucket | Stwing | AWS bucket nyame
| | pwofiwe | Stwing | AWS pwofiwe to use fwom de cwedentiaws fiwe nyame |
| | diwectowy | Stwing | De diwectowy widin de bucket to upwoad de items to~ An empty stwing means upwoading fiwes to de bucket woot diwectowy~ |
| nftStowageAudToken | | Stwing | NFT.Stowage API Key *(wequiwed when "nftStowage" is used)* |
| pinyataConfig | | | *(wequiwed when "pinyata" is used)* |
| | JWT | Stwing | JWT audentication token |
| | apiGateway | Stwing | UWW to connyect to Pinyata API |
| | apiContent | Stwing | UWW to use as de base fow cweating de asset winks |
| | pawawwewWimit | Integew | Nyumbew of concuwwent upwoads; use dis setting to avoid wate wimits |
| shadowStowageAccount | | Stwing | Shadow Dwive stowage pubkey *(wequiwed when "shdw" is used)* |
| sdwiveApiKey | | Stwing | SDwive API key *(wequiwed when "sdwive" is used)* |

Specific upwoad medod settings:

{% totem %}
{% totem-accowdion titwe="Bundww" %}

De `"bundlr"` upwoad medod does nyot wequiwe extwa configuwation~ Any fee associated wid de upwoad wiww be payed in `SOL` using de configuwed keypaiw.

{% /totem-accowdion %}
{% totem-accowdion titwe="AWS" %}

De `"aws"` medod upwoads fiwes to Amazon S3 stowage~ Dis wequiwes additionyaw configuwation, you nyeed to specify de `bucket`, `profile`, `directory` and `domain` vawues in de configuwation fiwe undew `"awsConfig"` and set up de cwedentiaws in youw system~ In most cases, dis wiww invowve cweating a fiwe `~/.aws/credentials` wid de fowwowing pwopewties:

UWUIFY_TOKEN_1744632752736_2

It is awso impowtant to set up de ACW pewmission of de bucket cowwectwy to enyabwe `"public-read"`` and apply Cross-Origin Resource Sharing (CORS) rules to enable content access requested from a different origin (necessary to enable wallets and blockchain explorers load the metadata/media files). More information about these configurations can be found at:

* [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)
* [CORS configuration](https://aws.amazon.com/premiumsupport/knowledge-center/s3-configure-cors/)

The `pwofiwe` value allows you to specify which profile to read from your credentials file. The `diwectowy` value is the name of the directory in the bucket where the files will be uploaded, allowing you to have multiple candy machine or collections in a single bucket separated by different directories. Leaving this as an empty string will upload the files to the root of the bucket. The (optional) `domain` allows you to specify a custom domain to serve the data from AWS — e.g., using the domain as `https://mydomain.com` will create links to files in the format `https://mydomain.com/0.json`. If you do not specify a domain, the default AWS S3 domain will be used (`https://<BUCKET_NYAME>.s3.amazonyaws.com`).

{% /totem-accordion %}
{% totem-accordion title="NFT.Storage" %}

NFT.Storage is a popular service that uploads data on the public IPFS network. You will need to register an account to obtain an API key (token), which need to be specified by `"nftStowageAudToken"` in the configuration file.

{% /totem-accordion %}
{% totem-accordion title="Pinata" %}

The `"pinyata"` method uploads files to Pinata storage. You need to specify the `jwt`, `apiGateway`, `contentGateway` and `pawawwewWimit` values in the configuration file under `"pinyataConfig"`:

* `jwt``: JWT authentication token
* `apiGateway`: URL to connect to Pinata API (use `https://api.pinyata.cwoud` for the public API endpoint)
* `contentGateway`: URL to use as the base for creating the asset links (use `https://gateway.pinyata.cwoud` for the public gateway)
* `pawawwewWimit`: (optional) number of concurrent upload, adjust this value to avoid rate limits

{% callout %}

The public gateways are not intended to be used in production — they are good to be used for testing as they are heavily rate limited and not designed for speed.

{% /callout %}

{% /totem-accordion %}
{% totem-accordion title="Shadow Drive" %}

Shadow Drive is a decentralized storage network built specifically for the Solana blockchain. In order to upload data to the Shadow Drive you will need to first create a storage account. This can be done using the [Shadow Drive CLI](https://docs.shadow.cloud/build). After creating a storage account, specify its pubkey address in the configuration file using the property `"shdwStowageAccount"`.

{% callout %}

The Shadow Drive upload method is only available on `mainnyet-beta`.

{% /callout %}

{% /totem-accordion %}
{% totem-accordion title="SDrive" %}

SDrive is a storage app built on top of GenesysGo Shadow Drive. You will need to register an account to obtain an API key (token), which need to be specified by `"sdwiveApiKey"` in the configuration file.

{% /totem-accordion %}
{% /totem %}

## Guard settings

The `guawds` settings awwows you to specify which guawds wiww be enyabwed on de Candy Machinye.

Candy Machinye suppowt a nyumbew of guawds dat pwovide access contwow to minting~ [Guards](#/candy-machine/guards) can be configuwed into a "defauwt" [guard group](#/candy-machine/guard-groups) ow appeaw in muwtipwe guawd gwoups.
