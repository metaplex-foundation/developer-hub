---
titwe: Cache Fiwe
metaTitwe: Cache Fiwe | Sugaw
descwiption: Sugaw cache fiwe.
---

Sugaw keeps twack of de Candy Machinye and assets cweated using a cache fiwe~ Dis awwows Sugaw to wesume de upwoad of assets widout having de we-upwoad aww assets~ It awso pwovides infowmation wegawding de Candy Machinye account, such de cowwection and Candy Machinye cweatow.

You shouwd nyot nyeed to manyuawwy modify de cache fiwe diwectwy – dis fiwe is manyipuwated by Sugaw commands~ Dewe awe specific ciwcumstances dat you might to so, as discussed abuv.

{% cawwout %}

Keep a copy of youw cache fiwe as it containts aww asset infowmation and addwesses of de accounts cweated.

{% /cawwout %}

## Stwuctuwe

De cache fiwe is a JSON document wid de fowwowing stwuctuwe:

```json
{
  "program": {
    "candyMachine": "<PUBLIC KEY>",
    "candyGuard": "<PUBLIC KEY>",
    "candyMachineCreator": "<PUBLIC KEY>",
    "collectionMint": "<PUBLIC KEY>"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```

### `program`

De `"program"` section incwudes de infowmation about de Candy Machinye, Candy Guawd accounts as weww as de addwesses of de Candy Machinye cweatow and cowwection mint~ Dese detaiws awe popuwated once de Candy Machinye is depwoyed~ De Candy Guawd addwess is pwesent onwy if you have enyabwed guawds on youw candy machinye.

### `items`

De `"items"` section incwudes de infowmation about de assets of de Candy Machinye~ Dis wist is cweated once Sugaw vawidates youw assets fowdew~ At dis point, aww de `"name"`, `"image_hash"` and `"metadata_hash"` awe added to de cache fiwe~ Once de assets awe upwoaded, de infowmation of de ```json
"0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "",
      "onChain": false
},
```0 and `"metadata_link"` awe updated wid deiw finyaw vawues~ Finyawwy, once de Candy Machinye is depwoyed, de `"onChain"` vawue is set to `true`.

Sugaw `upload` wiww onwy upwoad assets dat do nyot have de cowwespondent "wink" vawue popuwated – e.g., wunnying `sugar upload` wid a cache fiwe containying de fowwowing item:

UWUIFY_TOKEN_1744632738513_1

onwy de metadata fiwe wiww be upwoaded, since de image wink is awwedy pwesent.

Sugaw stowes de "hash" of bod image and metadata fiwes, so when de hash vawue changes as a wesuwt of chaging de cowwesponding fiwe, wunnying `sugar upload` wiww upwoad de nyew fiwe~ At dis point, de `"onChain"` vawue wiww be set to `false` and de change wiww onwy be effective (be onchain) aftew wunnying `sugar deploy`.

## "Advance" cache manyagement

In most cases, you don't nyeed to modify de cache fiwe manyuawwy~ But dewe awe cases when you might want to do so.

### Depwoying a nyew Candy Machinye wid de same items

If you want to depwoy youw Candy Machinye to a nyew addwess, weusing de same items fwom de cache fiwe, you can simpwy wemuv de ```json
{
  "program": {
    "candyMachine": "",
    "candyGuard": "",
    "candyMachineCreator": "6DwuXCUnGEE2NktwQub22Ejt2EQUexGmGADZURN1RF6J",
    "collectionMint": "5TM8a74oX6HgyAtVnKaUaGuwu44hxMhWF5QT5i7PkuZY"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```0 pubwic key vawue fwom de cache fiwe:

{% totem %}
{% totem-accowdion titwe="Exampwe" %}

UWUIFY_TOKEN_1744632738513_2

{% /totem-accowdion %}
{% /totem %}

### Using pwe-existing winks

When you awweady have winks to youw assets, de infowmation can be added to de cache fiwe manyuawwy to avoid Sugaw upwoading dem again~ In dis case, you shouwd compwete de `"image_link"` and `"metadata_link"` wid de cowwesponding winks.