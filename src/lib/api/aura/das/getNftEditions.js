const getNftEditions = {
  description: 'Get NFT editions for a given mint',
  method: 'getNftEditions',
  params: [
    {
      type: 'string',
      description: 'Public key of the (master) edition NFT mint',
      name: 'mintAddress',
      placeholder: 'Public key of the (master) edition NFT mint',
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      description: 'Number of editions to return (default: 10000)',
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
      description: 'Retrieve editions before the specified ID',
    },
    {
      name: 'after',
      type: 'string',
      description: 'Retrieve editions after the specified ID',
    },
  ],
  examples: [
    {
      name: 'Get NFT Editions',
      description: 'Get all editions for a (master) edition NFT',
      chain: 'solanaMainnet',
      body: {
        params: {
          mintAddress: 'So11111111111111111111111111111111111111112',
          limit: 10,
        },
      },
    },
    {
      name: 'Get NFT Editions with Pagination',
      description: 'Get editions with pagination cursor',
      chain: 'solanaMainnet',
      body: {
        params: {
          mintAddress: 'So11111111111111111111111111111111111111112',
          limit: 5,
          page: 1,
        },
      },
    },
    {
      name: 'Devnet Example',
      description: 'Get NFT editions on devnet',
      chain: 'solanaDevnet',
      body: {
        params: {
          mintAddress: '5fkyv7J5Jf8SaTVnE94A9oVeGBbhcEh9W3nP4cXUCQb8',
          limit: 10,
        },
      },
    },
  ],
  exampleResponse: {
    "jsonrpc": "2.0",
    "result": {
      "total": 4,
      "limit": 1000,
      "master_edition_address": "FLW3QiKm564dnVXjntKwPsD4mGFZsYCZZRBNnRqfpvWY",
      "supply": 4,
      "max_supply": 15,
      "editions": [
        {
          "mint_address": "UwLknqVX35h8BnBy6tqSGsn49x86aQYfLo9XtPvskHi",
          "edition_address": "2PHWwsa9r5T3paVqFs6t7rhYR7tjxbKNQh8jHgG3Rdhz",
          "edition_number": 2
        },
        {
          "mint_address": "56YfVQ86XMV57M1NSYP4utDkqc9ZfUVe8yXCSUwEML1c",
          "edition_address": "5Cy7euqce9RWfR7bSDUAT8ieVz6V4zn14dZtuphEfqhP",
          "edition_number": 1
        },
        {
          "mint_address": "3t7WXtj7XBek4hA4vPLL1D9Jfi2B3fucbEXU2YwrG2ox",
          "edition_address": "BHJaMzigGyALnVDAAX6rgTJGig13NB57KdVUCMXtUZfw",
          "edition_number": 4
        },
        {
          "mint_address": "4LYWNR2GoLiCexEWVLu6QEhN4uPaXzxodLHmYDMc8YfD",
          "edition_address": "Hdf38V6SMt9UiikxZ5KJxAodf9fiMRAA5oXSEL6oL5Tm",
          "edition_number": 3
        }
      ],
      "cursor": "Hdf38V6SMt9UiikxZ5KJxAodf9fiMRAA5oXSEL6oL5Tm"
    },
    "id": 0
  }
}

export default getNftEditions