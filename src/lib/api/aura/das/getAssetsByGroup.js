
const getAssetsByGroup = {
    description: 'Returns the list of assets given an Group address.',
    method: 'getAssetsByGroup',
    params: [
      {
        name: 'groupKey',
        type: 'string',
        description: 'Public key of the group',
        placeholder: 'Public key of the group',
        required: true,
      },
      {
        name: 'groupValue',
        type: 'string',
        description: 'The value of the group.',
        required: true,
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
  
  export default getAssetsByGroup
  