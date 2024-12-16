import { Fence } from '@/components/Fence';

const PythonRequestRenderer = ({ url, headers, bodyMethod, rpcVersion, bodyParams, id }) => {
  const httpBody = bodyParams;

  // Handle default values for `rpcVersion` and `id`
  const rpcVersionValue = rpcVersion || '2.0';
  const idValue = id || 1;

  // Function to format params as Python-style dictionaries
  const formatParamsForPython = (params) => {
    if (Array.isArray(params)) {
      return `[${params.map(item => `'${item}'`).join(', ')}]`; // Correct array formatting for Python
    }
    if (typeof params === 'object') {
      return `{${Object.entries(params)
        .map(([key, value]) => `'${key}': '${value}'`)
        .join(', ')}}`; // Use Python dict syntax for key-value pairs
    }
    return `'${params}'`;
  };

  const formattedParams = formatParamsForPython(httpBody);

  // Convert headers to Python dict format
  const headersCode = Object.entries(headers)
    .map(([key, value]) => `'${key}': '${value}'`)
    .join(",\n    ");

  const code = `
import requests
import json

url = "${url}"

headers = {
    "Content-Type": "application/json",
}

data = {
    "jsonrpc": "${rpcVersionValue}",
    "id": ${idValue},
    "method": "${bodyMethod}",
    "params": ${formattedParams}
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
