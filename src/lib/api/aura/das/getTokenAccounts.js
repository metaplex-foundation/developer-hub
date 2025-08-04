const getTokenAccounts = {
  description: 'Returns the token accounts for a given set of addresses',
  method: 'getTokenAccounts',
  params: [
    {
      name: 'mintAddress',
      type: 'string',
      description: 'Public key of the mint to retrieve',
      placeholder: 'Public key of the mint',
    },
    {
      name: 'ownerAddress',
      type: 'string',
      description: 'Owner public key of the token accounts to retrieve',
      placeholder: 'Owner public key',
    },
    {
      name: 'limit',
      type: 'number',
      description: 'Number of assets to return',
    },
    {
      name: 'page',
      type: 'number',
      description: 'The index of the "page" to retrieve',
    },
    {
      name: 'cursor',
      type: 'string',
      description: 'Pagination cursor',
    },
    {
      name: 'before',
      type: 'string',
      description: 'Retrieve assets before the specified ID',
    },
    {
      name: 'after',
      type: 'string',
      description: 'Retrieve assets after the specified ID',
    },
    {
      name: 'options',
      type: 'object',
      description: 'Display options',
      value: {
        showZeroBalance: {
          type: 'boolean',
          description: 'Show zero balance accounts',
          value: ['false', 'true'],
        },
      },
    },
  ],
  examples: [
    {
      name: 'Get Token Accounts by Mint',
      description: 'Get all token accounts for a specific mint',
      chain: 'solanaMainnet',
      body: {
        params: {
          mint: 'So11111111111111111111111111111111111111112',
          limit: 10,
        },
      },
    },
    {
      name: 'Get Token Accounts by Owner',
      description: 'Get all token accounts owned by a specific address',
      chain: 'solanaMainnet',
      body: {
        params: {
          owner: '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix',
          limit: 10,
        },
      },
    },
    {
      name: 'Get Token Accounts with Zero Balance',
      description: 'Get token accounts including those with zero balance',
      chain: 'solanaMainnet',
      body: {
        params: {
          mint: 'So11111111111111111111111111111111111111112',
          limit: 10,
          options: {
            showZeroBalance: true,
          },
        },
      },
    },
    {
      name: 'Devnet Example',
      description: 'Get token accounts on devnet',
      chain: 'solanaDevnet',
      body: {
        params: {
          mint: '5fkyv7J5Jf8SaTVnE94A9oVeGBbhcEh9W3nP4cXUCQb8',
          limit: 5,
        },
      },
    },
  ],
  exampleResponse: {
    "jsonrpc": "2.0",
    "result": {
      "total": 50,
      "limit": 10,
      "page": 1,
      "items": [
        {
          "interface": "FungibleToken",
          "id": "TokenAccount123456789abcdef",
          "content": {
            "$schema": "https://schema.metaplex.com/nft1.0.json",
            "json_uri": "https://arweave.net/token-metadata-uri",
            "files": [
              {
                "uri": "https://arweave.net/token-image",
                "mime": "image/png"
              }
            ],
            "metadata": {
              "name": "Example Token",
              "symbol": "EXAMPLE",
              "description": "An example fungible token"
            }
          },
          "authorities": [
            {
              "address": "TokenAuthority123",
              "scopes": ["full"]
            }
          ],
          "compression": {
            "eligible": false,
            "compressed": false
          },
          "ownership": {
            "frozen": false,
            "delegated": false,
            "delegate": null,
            "ownership_model": "single",
            "owner": "1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix"
          },
          "supply": {
            "amount": "1000000000",
            "decimals": 6
          },
          "token_info": {
            "balance": 1000000000,
            "supply": 1000000000000,
            "decimals": 6,
            "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            "mint": "So11111111111111111111111111111111111111112"
          }
        }
      ]
    },
    "id": "1"
  },
}
  
  export default getTokenAccounts
