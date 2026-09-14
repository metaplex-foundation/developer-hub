const getAssetsByGroup = {
  description: 'Returns the list of assets given an Group address.',
  method: 'getAssetsByGroup',
  params: [
    {
      name: 'groupKey',
      type: 'string',
      description: 'Grouping Key (e.g. "collection" or "group" for mpl-core groups)',
      placeholder: 'collection',
      required: true,
    },
    {
      name: 'groupValue',
      type: 'string',
      description: 'Value of the group. E.g. Public key of the collection',
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
    {
      name: 'options',
      type: 'object',
      description: 'Display options',
      value: {
        showCollectionMetadata: {
          type: 'boolean',
          description: 'Show collection metadata',
          value: ['false', 'true'],
        },
        showFungible: {
          type: 'boolean',
          description: 'Show fungible assets',
          value: ['false', 'true'],
        },
        showInscription: {
          type: 'boolean',
          description: 'Show inscription data',
          value: ['false', 'true'],
        },
        showUnverifiedCollections: {
          type: 'boolean',
          description: 'Show unverified collections',
          value: ['false', 'true'],
        },
        showZeroBalance: {
          type: 'boolean',
          description: 'Show token accounts with zero balance',
          value: ['false', 'true'],
        },
      },
    },
  ],
  examples: [
    {
      name: 'Get Assets In Collection',
      description: 'Get assets in a Token Metadata or Core collection',
      chain: 'solanaMainnet',
      body: {
        params: {
          groupKey: 'collection',
          groupValue: '5PA96eCFHJSFPY9SWFeRJUHrpoNF5XZL6RrE1JADXhxf',
          limit: 10,
        },
      },
    },
    {
      name: 'Get mpl-core Group Members',
      description: 'Get collections, assets, or nested groups in an mpl-core GroupV1',
      chain: 'solanaMainnet',
      body: {
        params: {
          groupKey: 'group',
          groupValue: '1CTME6duRH3SaBd5bmSikw1nhxpENe1xS2nHkwUGhgQ',
          limit: 10,
        },
      },
    },
  ],
}

export default getAssetsByGroup
