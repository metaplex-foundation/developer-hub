import { Fence } from '@/components/Fence';

const PhpRequestRenderer = ({ url, headers, bodyMethod, rpcVersion, bodyParams, id }) => {
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
    .map(([key, value]) => `"${key}" => "${value}"`)
    .join(",\n        ");

  const code = `
<?php

$url = "${url}";
$data = [
    "jsonrpc" => "${rpcVersion ? rpcVersion : '2.0'}",
    "id" => ${id ? id : 1},
    "method" => "${bodyMethod}",
    "params" => ${JSON.stringify(httpBody, null, 2).replace(/\n/g, '\n    ')}
];

// Initialize cURL session
$ch = curl_init($url);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    ${headersCode}
]);

// Execute cURL request
$response = curl_exec($ch);

// Check for errors
if($response === false) {
    echo "cURL Error: " . curl_error($ch);
} else {
    echo "Response: " . $response;
}

// Close cURL session
curl_close($ch);

?>
`;

  return (
    <Fence className="w-full" language="php">
      {code}
    </Fence>
  );
};

export default PhpRequestRenderer;
