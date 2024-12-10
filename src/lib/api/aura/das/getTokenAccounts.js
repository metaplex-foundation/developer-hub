const getTokenAccounts = {
    description: 'Returns the token accounts for a given set of addresses',
    method: 'getTokenAccounts',
    params: [
      {
          name: 'mint',
        type: 'string',
        description: 'Public key of the mint to retrieve',
        placeholder: 'Public key of the mint',
      },
      {
        name: 'owner',
      type: 'string',
      description: 'Owner public key of the token accounts to revtrieve',
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
        description: 'The index of the "page" to retrieve.',
      },
      {
        name: 'cursor',
        type: 'string',
        description: 'pagination cursor',
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
        value: {
            showZeroBalance: {
                type: 'boolean',
                description: 'Show zero balance accounts',
            }
        }
      }
    ],
  }
  
  export default getTokenAccounts
