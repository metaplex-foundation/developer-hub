// Mock API object

const testApiMethod = {
  method: 'template',
  params: [
    {
      type: 'string',
      description: 'Name of the person',
      name: 'name',
      value: 'John Doe',
      placeholder: 'John Doe',
      availableValues: ['John Doe', 'Jane Doe'],
      optional: true,
    },
    { type: 'number', name: 'age', value: 30, placeholder: 30, optional: true },
    { type: 'boolean', name: 'isStudent', value: false },
    {
      type: 'array',
      name: 'hobbies',
      value: [],
      placeholder: ['reading', 'coding', 'hiking'],
    },
    {
      type: 'object',
      name: 'address',
      value: {
        city: {
          type: 'string',
          value: 'Metropolis',
          placeholder: 'Metropolis',
        },
        street: {
          type: 'string',
          value: 'Main Street',
          placeholder: 'Main Street',
        },
        zip: { type: 'number', value: 54321, placeholder: 54321 },
      },
    },
    {
      type: 'string',
      name: 'dateOfBirth',
      value: '1992-05-14',
      placeholder: '1992-05-14',
    },
    {
      type: 'file',
      name: 'profilePicture',
      value: 'base64_encoded_string',
      placeholder: 'base64_encoded_string',
    },
  ],
}

export default testApiMethod
