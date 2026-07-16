const getGrouping = {
  description: 'Return grouping metadata for a group key/value pair',
  method: 'getGrouping',
  params: [
    {
      name: 'groupKey',
      type: 'string',
      description: 'Grouping key (e.g. "collection" or "group" for mpl-core groups)',
      placeholder: 'collection',
      required: true,
    },
    {
      name: 'groupValue',
      type: 'string',
      description: 'Value of the group (e.g. collection or mpl-core group address)',
      required: true,
    },
  ],
  examples: [
    {
      name: 'Get Collection Grouping',
      description: 'Get metadata for a Token Metadata or Core collection',
      chain: 'solanaMainnet',
      body: {
        params: {
          groupKey: 'collection',
          groupValue: '5PA96eCFHJSFPY9SWFeRJUHrpoNF5XZL6RrE1JADXhxf',
        },
      },
    },
    {
      name: 'Get mpl-core Group Grouping',
      description: 'Get metadata for an mpl-core GroupV1 account',
      chain: 'solanaMainnet',
      body: {
        params: {
          groupKey: 'group',
          groupValue: '1CTME6duRH3SaBd5bmSikw1nhxpENe1xS2nHkwUGhgQ',
        },
      },
    },
  ],
  exampleResponse: {
    jsonrpc: '2.0',
    result: {
      group_key: 'collection',
      group_name: 'Compressed NFT Collection',
      group_size: 1000,
    },
    id: 0,
  },
}

export default getGrouping
