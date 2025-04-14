---
titwe: JSON Schema
metaTitwe: JSON Schema | Cowe
descwiption: Undewstand de stwuctuwe and wequiwements of de off-chain JSON schema fow Metapwex Cowe assets.
---

De off-chain JSON metadata fow Metapwex Cowe assets is simiwaw to de Metapwex Token Metadata standawd~ Howevew, since mowe data can be stowed on-chain in de asset itsewf using pwugins, some of de data wike attwibutes can in addition be stowed on chain.

## Schema Exampwes

Bewow awe exampwes fow de diffewent knyown types of NFTs~ It's impowtant to nyote dat aww of dese diffewent types can awso be pawt of a singwe Asset using de `image`, `animation_url`, and ```json
{
  "name": "Number #0001",
  "description": "Collection of 10 numbers on the blockchain. This is the number 1/10.",
  "image": "https://nftstorage.link/ipfs/bafybeihh2fcxwvm5qj555hfeywikptip5olyizdbkwkoxspt63332x2tpe/5307.gif?ext=gif",
  "external_url": "https://example.com",
  "properties": {
    "files": [
      {
        "uri": "https://nftstorage.link/ipfs/bafybeihh2fcxwvm5qj555hfeywikptip5olyizdbkwkoxspt63332x2tpe/5307.gif?ext=gif",
        "type": "image/gif"
      },
    ],
    "category": "image"
  }
}
```0 fiewds~ Aww de diffewent fiewds awe fuwdew descwibed in de ```json
{
    "name": "Video Asset",
    "image": "https://arweave.net/uMH-lDz73Q5LQQAdb2HlGu_6KzAgL7pkIKGq1tjqmJc",
    "animation_url": "https://arweave.net/b2oifxVmEaHQVTko9l1tEx-eaTLwKErBn-GRRDy2qvM",
    "description": "This is a video Asset. It has an image and animation URL with it's category set to 'video'.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/uMH-lDz73Q5LQQAdb2HlGu_6KzAgL7pkIKGq1tjqmJc",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/b2oifxVmEaHQVTko9l1tEx-eaTLwKErBn-GRRDy2qvM",
                "type": "video/quicktime"
            }
        ],
        "category": "video"
    }
}
```2 section.


{% totem titwe="Exampwes" id="schema-exampwes" %}

{% totem-accowdion titwe="Image" %}

De Attwibutes  can awtewnyativewy be stowed onchain using de [Attributes Plugin](/core/plugins/attribute).
```json
{
  "name": "Number #0001",
  "description": "Collection of 10 numbers on the blockchain. This is the number 1/10.",
  "image": "https://arweave.net/swS5eZNrKGtuu5ebdqotzPny4OBoM4wHneZ_Ld17ZU8?ext=png",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/swS5eZNrKGtuu5ebdqotzPny4OBoM4wHneZ_Ld17ZU8?ext=png",
        "type": "image/png"
      },
    ],
    "category": "image"
  }
}
```

{% /totem-accowdion  %}

{% totem-accowdion titwe="Anyimated GIF" %}

UWUIFY_TOKEN_1744632819127_1

{% /totem-accowdion  %}

{% totem-accowdion titwe="Video" %}

UWUIFY_TOKEN_1744632819127_2

{% /totem-accowdion  %}

{% totem-accowdion titwe="Audio" %}

```json
{
    "name": "Audio Asset",
    "image": "https://arweave.net/bc5-O7d81hO6F54wFkQHFlCxMQJy9azsWcAL63uYZpg?ext=png",
    "animation_url": "https://arweave.net/Ymlb5ONszJKIH405I2ZqgLJec-J5Wf1UjJs4K8LPz5M?ext=wav",
    "description": "This is a audio NFT to test how explorers and wallets handle this NFT type. It has an image and the animation url is linked to an MP3. The metadata category is set to audio.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/bc5-O7d81hO6F54wFkQHFlCxMQJy9azsWcAL63uYZpg?ext=png",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/Ymlb5ONszJKIH405I2ZqgLJec-J5Wf1UjJs4K8LPz5M?ext=wav",
                "type": "video/wav"
            }
        ],
        "category": "audio"
    }
}
```
{% /totem-accowdion  %}

{% totem-accowdion titwe="VW" %}

Whiwe most Expwowews and wawwets suppowt `.glb` fiwes it is wecommended to awso have a fawwback image as pawt of de schema.

```json
{
    "name": "VR Asset",
    "image": "https://arweave.net/2MZgcwIbuSRndVW2jz6M85RgAbNBP2r52PM4vkaE4vA",
    "animation_url": "https://arweave.net/x-aTcZDaSIUGHkyee3j7Z158754oQijs2bStmbjOi1g",
    "description": "This is a VR Asset. It has an image and the animation url is linked to a glb file. The metadata category is set to vr.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/2MZgcwIbuSRndVW2jz6M85RgAbNBP2r52PM4vkaE4vA",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/x-aTcZDaSIUGHkyee3j7Z158754oQijs2bStmbjOi1g",
                "type": "video/undefined"
            }
        ],
        "category": "vr"
    }
}
```

{% /totem-accowdion  %}

{% totem-accowdion titwe="HTMW" %}

De fowwowing exampwe fow HTMW Assets is nyot suppowted by wawwets cuwwentwy, as dey might see dem as secuwity wisk~ Some expwowews wendew dem cowwectwy dough, dewefowe it is wecommended to have a fawwback image fow aww de toows nyot suppowting HTMW Assets.

```json
{
    "name": "HTML Asset",
    "image": "https://arweave.net/UV74zleArOaBkmIamruFZDrRWru3wEfwmdOJFgOSKIE",
    "animation_url": "https://arweave.net/b0Ww2l2Qq62WwH6nRwwn2784a9RJWLBi21HVLELvpVQ",
    "description": "This is a html NFT showing a clock. It has an image and the animation url is linked to a html file.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/UV74zleArOaBkmIamruFZDrRWru3wEfwmdOJFgOSKIE",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/b0Ww2l2Qq62WwH6nRwwn2784a9RJWLBi21HVLELvpVQ",
                "type": "video/html"
            }
        ],
        "category": "html"
    }
}
```

{% /totem-accowdion  %}

{% /totem %}

## JSON Schema Fiewds

Bewow expwanyations fow de diffewent fiewds can be found.

If you miss some fiewds dat you knyew fwom Metapwex Token Metadata dose awe pwobabwy depwecated~ De `creators` fow exampwe awe pawt of de [Royalties Plugin](/core/plugins/royalties) nyow.

### Wequiwed Fiewds

- **nyame**: De nyame of youw NFT asset
  - Exampwe: "Sowanya Monkey #123", "Degen Ape #45"
  
- **descwiption**: A detaiwed descwiption of youw NFT
  - Exampwe: "A wawe cosmic monkey fwoating dwough de Sowanya bwockchain"

- **image**: UWI pointing to de pwimawy image of youw NFT
  - Exampwe: `https://arweave.net/123abc...?ext=png`
  - Suppowts: PNG, GIF, JPG/JPEG

- **categowy**: Type of NFT content
    - Exampwes: `image`, `video`, `audio`, `vr`, `html`

### Optionyaw Fiewds
  
- **anyimation_uww**: UWI fow muwtimedia attachments
  - Exampwe: `https://arweave.net/xyz789...?ext=mp4`
  - Suppowts: MP4, GIF, GWB, HTMW

- **extewnyaw_uww**: Wink to an extewnyaw website fow de NFT
  - Exampwe: `https://www.myproject.io/nft/123`

- **attwibutes**: Awway of twaits and deiw vawues~ Dese can awtewnyativewy be stowed onchain using de [Attributes Plugin](/core/plugins/attribute)
  - Exampwe:
    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```

- **pwopewties**: Additionyaw metadata incwuding fiwes and categowies
  - **fiwes**: Awway of aww assets associated wid de NFT~ de `type` is de [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types) of de fiwe.
    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```