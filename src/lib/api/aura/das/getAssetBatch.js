const getAssetBatch = {
  description: 'Get an asset by its ID',
  method: 'getAssetBatch',
  params: [
    {
      type: 'array',
      description: 'Public keys of the Assets to fetch',
      name: 'ids',
      value: [""],
      required: true,
      placeHolder: "Asset Public Key"
    },
  ],
  exampleResponse: {
    "jsonrpc": "2.0",
    "result": [
      {
        "interface": "MplCoreAsset",
        "id": "5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://arweave.net/2xl-wNjCDAnCEtPbtUZRlXypSP6boMVTt5On8F7NPoc",
          "files": [
            {
              "uri": "https://arweave.net/2LmjJyHmQY0OFoWg3cx2cTlV-fSIMGVMiPUFgLSv4Lk",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "trait_type": "rarity",
                "value": "Legendary"
              },
              {
                "trait_type": "used",
                "value": "false"
              },
              {
                "trait_type": "signed",
                "value": "false"
              }
            ],
            "description": "A young girl narrowly escaped an evil space pirate and is rescued by a team of mercenaries. Together, their discovery will unlock the secrets of the galaxy - and lead to an adventure that threatens life as they know it!",
            "name": "Galactic Geckos EP 1 #985",
            "symbol": ""
          },
          "links": {
            "image": "https://arweave.net/2LmjJyHmQY0OFoWg3cx2cTlV-fSIMGVMiPUFgLSv4Lk",
            "external_url": "https://dreader.app"
          }
        },
        "authorities": [
          {
            "address": "FXj8W4m33SgLB5ZAg35g8wsqFTvywc6fmJTXzoQQhrVf",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8J1w2Khc79x5itJkpfc1HDcSLseY84R9dbKmJHQH5brD",
            "verified": true
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0,
          "basis_points": 0,
          "primary_sale_happened": false,
          "locked": false
        },
        "creators": [],
        "ownership": {
          "frozen": false,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "7aLBCrbn4jDNSxLLJYRRnKbkqA5cuaeaAzn74xS7eKPD"
        },
        "supply": null,
        "mutable": true,
        "burnt": false,
        "lamports": 3525360,
        "executable": false,
        "rent_epoch": 18446744073709552000,
        "plugins": {},
        "mpl_core_info": {
          "plugins_json_version": 1
        },
        "external_plugins": []
      },
      {
        "interface": "V1_NFT",
        "id": "H6GDZujkpEcxbpDgEbSbNFxNtSi3RBJPJC5GZCvzagaP",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://shdw-drive.genesysgo.net/5HXhJs7ScMnUEZPxmr1f4EMzwTVEhfV1TEXLW7qacMis/6233.json",
          "files": [
            {
              "uri": "https://shdw-drive.genesysgo.net/5HXhJs7ScMnUEZPxmr1f4EMzwTVEhfV1TEXLW7qacMis/6233.png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "trait_type": "Background",
                "value": "Saga"
              },
              {
                "trait_type": "Fur",
                "value": "Mocha"
              },
              {
                "trait_type": "Clothing",
                "value": "Band Hoodie"
              },
              {
                "trait_type": "Mouth",
                "value": "Beaming"
              },
              {
                "trait_type": "Head",
                "value": "Mullet Gang"
              },
              {
                "trait_type": "Eyes",
                "value": "Wayfarers"
              }
            ],
            "description": "Saga Monkes is an exclusive generative art collection airdropped to Saga Genesis Token holders. Learn more at https://SagaMonkes.com",
            "name": "MONKE #6233",
            "symbol": "MONKE",
            "token_standard": "NonFungible"
          },
          "links": {
            "image": "https://shdw-drive.genesysgo.net/5HXhJs7ScMnUEZPxmr1f4EMzwTVEhfV1TEXLW7qacMis/6233.png"
          }
        },
        "authorities": [
          {
            "address": "4JdzLtiv96HEnpmpyN7ZdkupvZpZfSFRV6im7HUnsEXT",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": true,
          "data_hash": "2iY1CPYktGQHQbuNkkvonEryMvnoaJiUjLnufHJotron",
          "creator_hash": "Ep5RkW26Mcyk4njkeL3mnH3EUHoaPktuSYWJajMnSCoR",
          "asset_hash": "8uKWwYxK7imdvHSPthAVJhidAh5EwuvahdW3BpMYXaz8",
          "tree": "2uH9TkmYkAKGrK7EPnd4Y7JVYswpQ2aED9deMn8QoYVy",
          "seq": 102852,
          "leaf_id": 6201
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "GokAiStXz2Kqbxwz2oqzfEXuUhE7aXySmBGEP7uejKXF",
            "verified": true
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": false,
          "locked": false
        },
        "creators": [
          {
            "address": "8McVhmNjsYSkwQ34QXJb2ADgLWERcHcpqxSzRZUCRZfQ",
            "share": 40,
            "verified": false
          },
          {
            "address": "niFtyPVUnA4dd3gaoajiwmX1keTsTi4k626szinHE5Z",
            "share": 40,
            "verified": false
          },
          {
            "address": "KRTv1iR6dH7FuPoW51BQ9hU9UTtibYwZTEA3Fjg4RYy",
            "share": 15,
            "verified": false
          },
          {
            "address": "6jYqTEtDgkr1v4DtU4QDUmg1cAf4o1GSsQDGt9X8EfPG",
            "share": 5,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": false,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "DJT1uEFuseGT8GBu8trBU9ocLHXXrRvCRSk3QKn7Xac4"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 0
        },
        "mutable": true,
        "burnt": false
      },
      {
        "interface": "ProgrammableNFT",
        "id": "G3nEdTzAvPvSuj2Z5oSSiMN42NayQDZvkC3usMrnGaTi",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://madlads.s3.us-west-2.amazonaws.com/json/4221.json",
          "files": [
            {
              "uri": "https://madlads.s3.us-west-2.amazonaws.com/images/4221.png",
              "mime": "image/png"
            },
            {
              "uri": "https://arweave.net/qJ5B6fx5hEt4P7XbicbJQRyTcbyLaV-OQNA1KjzdqOQ/4221.png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "trait_type": "Gender",
                "value": "Female"
              },
              {
                "trait_type": "Type",
                "value": "Light"
              },
              {
                "trait_type": "Expression",
                "value": "Mad"
              },
              {
                "trait_type": "Hair",
                "value": "Lovelace"
              },
              {
                "trait_type": "Eyes",
                "value": "Blue"
              },
              {
                "trait_type": "Mouth",
                "value": "Red"
              },
              {
                "trait_type": "Clothing",
                "value": "Luxe"
              },
              {
                "trait_type": "Background",
                "value": "White"
              }
            ],
            "description": "Fock it.",
            "name": "Mad Lads #4221",
            "symbol": "MAD",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://madlads.s3.us-west-2.amazonaws.com/images/4221.png",
            "external_url": "https://madlads.com"
          }
        },
        "authorities": [
          {
            "address": "2RtGg6fsFiiF1EQzHqbd66AhW7R5bWeQGpTbv2UMkCdW",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w",
            "verified": true
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.042,
          "basis_points": 420,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "5XvhfmRjwXkGp3jHGmaKpqeerNYjkuZZBYLVQYdeVcRv",
            "share": 0,
            "verified": true
          },
          {
            "address": "2RtGg6fsFiiF1EQzHqbd66AhW7R5bWeQGpTbv2UMkCdW",
            "share": 100,
            "verified": true
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix"
        },
        "supply": null,
        "mutable": true,
        "burnt": false,
        "lamports": 5616720,
        "executable": false,
        "metadata_owner": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        "rent_epoch": 18446744073709552000,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "mint_authority": "2ntsS4TKHPXHRGf7e95ocJFRmuhCdSHD8do232a8xx96",
          "freeze_authority": "2ntsS4TKHPXHRGf7e95ocJFRmuhCdSHD8do232a8xx96"
        }
      }
    ],
    "id": "1"
  }
}

export default getAssetBatch
