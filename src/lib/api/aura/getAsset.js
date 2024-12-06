const testApiMethod = {
    method: 'getAsset',
    params: [
      {
        type: 'string',
        name: 'name',
        value: 'John Doe',
        availableValues: ['John Doe', 'Jane Doe'],
        optional: true,
      },
      { type: 'number', name: 'age', value: 30 },
      { type: 'boolean', name: 'isStudent', value: false },
      {
        type: 'array',
        name: 'hobbies',
        value: ['reading', 'coding', 'hiking'],
      },
      {
        type: 'object',
        name: 'address',
        value: {
          city: { type: 'string', value: 'Metropolis' },
          street: { type: 'string', value: 'Main Street' },
          zip: { type: 'number', value: 54321 },
        },
      },
      { type: 'null', name: 'middleName', value: null },
      { type: 'string', name: 'dateOfBirth', value: '1992-05-14' },
      { type: 'file', name: 'profilePicture', value: 'base64_encoded_string' },
    ],
  }
  
  export default testApiMethod