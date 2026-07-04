const getNftEditions = {
  description: 'Get all printable editions for a master edition NFT mint',
  method: 'getNftEditions',
  params: [
    {
      type: 'string',
      description: 'Public key of the master edition NFT mint',
      name: 'mintAddress',
      placeholder: 'Public key of the master edition NFT mint',
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      description: 'Maximum number of editions to return',
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
      name: 'Get Master Edition Editions',
      description: 'Get printable editions for a master edition NFT mint',
      chain: 'solanaMainnet',
      body: {
        params: {
          mintAddress: 'Ey2Qb8kLctbchQsMnhZs5DjY32To2QtPuXNwWvk4NosL',
          limit: 10,
        },
      },
    },
    {
      name: 'Get Master Edition Editions (Paginated)',
      description: 'Get the first page of editions for a master edition NFT mint',
      chain: 'solanaMainnet',
      body: {
        params: {
          mintAddress: 'Ey2Qb8kLctbchQsMnhZs5DjY32To2QtPuXNwWvk4NosL',
          limit: 5,
          page: 1,
        },
      },
    },
  ],
  exampleResponse: {
    jsonrpc: '2.0',
    result: {
      total: 2,
      limit: 10,
      master_edition_address: '8SHfqzJYABeGfiG1apwiEYt6TvfGQiL1pdwEjvTKsyiZ',
      supply: 60,
      max_supply: 69,
      editions: [
        {
          mint_address: 'GJvFDcBWf6aDncd1TBzx2ou1rgLFYaMBdbYLBa9oTAEw',
          edition_address: 'AoxgzXKEsJmUyF5pBb3djn9cJFA26zh2SQHvd9EYijZV',
          edition_number: 1,
        },
        {
          mint_address: '9yQecKKYSHxez7fFjJkUvkz42TLmkoXzhyZxEf2pw8pz',
          edition_address: 'giWoA4jqHFkodPJgtbRYRcYtiXbsVytnxnEao3QT2gg',
          edition_number: 2,
        },
      ],
    },
    id: 0,
  },
}

export default getNftEditions
