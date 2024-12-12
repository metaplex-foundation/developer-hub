import { Fence } from '@/components/Fence';

const PythonRequestRenderer = ({ url, headers, bodyMethod, rpcVersion, bodyParams, id }) => {
  const httpBody = bodyParams;

  const object = {
    method: 'POST',
    headers: headers,
    body: {
      jsonrpc: rpcVersion ? rpcVersion : '2.0',
      id: id ? id : 1,
      method: bodyMethod,
      params: httpBody,
    },
  };

  const headersCode = Object.entries(headers)
    .map(([key, value]) => `"${key}": "${value}"`)
    .join(",\n    ");

  const code = `
import requests
import json

url = "${url}"

headers = {
    "Content-Type": "application/json",
    ${headersCode}
}

data = {
    "jsonrpc": "${rpcVersion ? rpcVersion : '2.0'}",
    "id": ${id ? id : 1},
    "method": "${bodyMethod}",
    "params": ${JSON.stringify(httpBody, null, 2).replace(/\n/g, '\n    ')}
}

response = requests.post(url, headers=headers, data=json.dumps(data))

print(f"Response Code: {response.status_code}")
print(f"Response Body: {response.text}")
`;

  return (
    <Fence className="w-full" language="python">
      {code}
    </Fence>
  );
};

export default PythonRequestRenderer;
