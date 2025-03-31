const getAssetsByCreator = {
    description: 'Returns the list of assets given an authority address.',
    method: 'getAssetsByCreator',
    params: [
      {
        name: 'creatorAddress',
        type: 'string',
        description: 'Public key of the creator',
        placeholder: 'Public key of the creator',
        required: true,
      },
      {
        name: 'onlyVerified',
        type: 'boolean',
        description: 'Indicates whether to retrieve only verified assets or not.',
      },
      {
        name: 'sortBy',
        type: 'object',
        description: 'Sorting criteria',
        value: {
          sortBy: {
            type: 'option',
            value: ['created', 'updated', 'recentAction', 'none'],
          },
          sortDirection: {
            type: 'option',
            value: ['asc', 'desc'],
          },
        },
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
        name: 'before',
        type: 'string',
        description: 'Retrieve assets before the specified ID',
      },
      {
        name: 'after',
        type: 'string',
        description: 'Retrieve assets after the specified ID',
      },
    ],
    examples: null,
  }
  
  export default getAssetsByCreator
  