const getTokenAccounts = {
  description: 'Get a list of token accounts by owner or mint',
  method: 'getTokenAccounts',
  params: [
    {
      name: 'ownerAddress',
      type: 'string',
      description: 'Owner public key of the token accounts to retrieve',
      placeholder: 'Owner public key',
    },
    {
      name: 'mintAddress',
      type: 'string',
      description: 'Public key of the mint to retrieve token accounts for',
      placeholder: 'Public key of the mint',
    },
    {
      name: 'limit',
      type: 'number',
      description: 'Maximum number of token accounts to return',
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
      description: 'Retrieve token accounts before the specified ID',
    },
    {
      name: 'after',
      type: 'string',
      description: 'Retrieve token accounts after the specified ID',
    },
    {
      name: 'options',
      type: 'object',
      description: 'Display options. Also accepted as displayOptions.',
      value: {
        showZeroBalance: {
          type: 'boolean',
          description: 'Include zero-balance accounts in results',
          value: ['false', 'true'],
        },
        showFungible: {
          type: 'boolean',
          description: 'Accepted by the API; reserved for future use on this method',
          value: ['false', 'true'],
        },
        showCollectionMetadata: {
          type: 'boolean',
          description: 'Accepted by the API; reserved for future use on this method',
          value: ['false', 'true'],
        },
        showUnverifiedCollections: {
          type: 'boolean',
          description: 'Accepted by the API; reserved for future use on this method',
          value: ['false', 'true'],
        },
        showInscription: {
          type: 'boolean',
          description: 'Accepted by the API; reserved for future use on this method',
          value: ['false', 'true'],
        },
      },
    },
  ],
  examples: [
    {
      name: 'Get Token Accounts By Owner',
      description: 'Get token accounts owned by a wallet',
      chain: 'solanaDevnet',
      body: {
        params: {
          ownerAddress: 'CeviT1DTQLuicEB7yLeFkkAGmam5GnJssbGb7CML4Tgx',
          limit: 10,
        },
      },
    },
    {
      name: 'Get Token Accounts By Mint',
      description: 'Get all token accounts for a mint',
      chain: 'solanaDevnet',
      body: {
        params: {
          mintAddress: 'wKocBVvHQoVaiwWoCs9JYSVye4YZRrv5Cucf7fDqnz1',
          limit: 10,
        },
      },
    },
    {
      name: 'Get USDC Token Accounts',
      description: 'Get all USDC token accounts on mainnet',
      chain: 'solanaMainnet',
      body: {
        params: {
          mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          limit: 10,
        },
      },
    },
  ],
  exampleResponse: {
    jsonrpc: '2.0',
    result: {
      total: 1,
      limit: 10,
      token_accounts: [
        {
          address: 'jKLTJu7nE1zLmC2J2xjVVBm4G7vJcKGCGQX36Jrsba2',
          mint: 'wKocBVvHQoVaiwWoCs9JYSVye4YZRrv5Cucf7fDqnz1',
          amount: 1000000000000,
          owner: 'CeviT1DTQLuicEB7yLeFkkAGmam5GnJssbGb7CML4Tgx',
          frozen: false,
          delegate: null,
          delegated_amount: 0,
          close_authority: null,
          extensions: null,
        },
      ],
      cursor: null,
      errors: [],
    },
    id: 0,
  },
}

export default getTokenAccounts
