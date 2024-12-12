const getAsset = {
  description: 'Get an asset by its ID',
  method: 'getAsset',
  params: [
    {
      type: 'string',
      description: 'Public key of the asset',
      name: 'id',
      placeholder: 'Public key of the asset',
      required: true,
    },
  ],
  examples: [
    {
      name: 'Galactic Geckos EP 1 #985 (Core Asset)',
      description: 'Get an asset by its ID',
      chain: 'solana-mainnet',
      body: {
        params: {
          id: '5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa',
        },
      },
    },
    {
      name: 'Saga Monkes #6233 (cNFT)',
      description: 'Get an asset by its ID',
      chain: 'solana-mainnet',
      body: {
        params: {
          id: 'H6GDZujkpEcxbpDgEbSbNFxNtSi3RBJPJC5GZCvzagaP',
        },
      },
    },
    {
      name: 'Madlad #4221 (pNFT)',
      description: 'Get an asset by its ID',
      chain: 'solana-mainnet',
      body: {
        params: {
          id: 'G3nEdTzAvPvSuj2Z5oSSiMN42NayQDZvkC3usMrnGaTi',
        },
      },
    },
    
    {
      name: 'THUG #2926 (NFT)',
      description: 'Get an asset by its ID',
      chain: 'solana-mainnet',
      body: {
        params: {
          id: 'EvGJtxZAjxYGwYDtHprvApfLTx44PxsSCtWq3uVmfboy',
        },
      },
    },
  ],
  exampleResponse : {
    "jsonrpc": "2.0",
    "result": {
      "interface": "ProgrammableNFT",
      "id": "8aguf5d15kvHVsXyr8WfY73JgdQnWq1z6FhsUWqawivd",
      "content": {
        "$schema": "https://schema.metaplex.com/nft1.0.json",
        "json_uri": "https://arweave.net/7V_i2RU5fZO9UTtR5e04oCH-ySTmFAS_TISGfjeBkp4",
        "files": [
          {
            "uri": "https://arweave.net/Ji5Lf4paxnY2kPCjnnQOfiBdtwGjIed7mDKyHjM14Fc",
            "mime": "image/png"
          },
          {
            "uri": "https://cdn.solanamonkey.business/gen2/121.png",
            "mime": "image/png"
          }
        ],
        "metadata": {
          "attributes": [
            {
              "trait_type": "Attributes Count",
              "value": 2
            },
            {
              "trait_type": "Type",
              "value": "Purple"
            },
            {
              "trait_type": "Clothes",
              "value": "Red Shirt"
            },
            {
              "trait_type": "Ears",
              "value": "None"
            },
            {
              "trait_type": "Mouth",
              "value": "None"
            },
            {
              "trait_type": "Eyes",
              "value": "None"
            },
            {
              "trait_type": "Hat",
              "value": "White Fedora 1"
            }
          ],
          "description": "SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity.",
          "name": "SMB #121",
          "symbol": "SMB",
          "token_standard": "ProgrammableNonFungible"
        },
        "links": {
          "image": "https://arweave.net/Ji5Lf4paxnY2kPCjnnQOfiBdtwGjIed7mDKyHjM14Fc",
          "external_url": "https://solanamonkey.business/"
        }
      },
      "authorities": [
        {
          "address": "mdaoxg4DVGptU4WSpzGyVpK3zqsgn7Qzx5XNgWTcEA2",
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
          "group_value": "SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W",
          "verified": true
        }
      ],
      "royalty": {
        "royalty_model": "creators",
        "target": null,
        "percent": 0,
        "basis_points": 0,
        "primary_sale_happened": true,
        "locked": false
      },
      "creators": [
        {
          "address": "mdaoxg4DVGptU4WSpzGyVpK3zqsgn7Qzx5XNgWTcEA2",
          "share": 0,
          "verified": true
        },
        {
          "address": "HAryckvjyViFQEmhmMoCtqqBMJnpXEYViamyDhZUJfnG",
          "share": 100,
          "verified": false
        },
        {
          "address": "9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F",
          "share": 0,
          "verified": false
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
      "rent_epoch": 18446744073709552000
    },
    "id": "1"
  }
}

export default getAsset
