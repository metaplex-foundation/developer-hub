import { Fence } from '@/components/Fence';

const PhpRequestRenderer = ({ url, headers, bodyMethod, rpcVersion, bodyParams, id }) => {
  const httpBody = bodyParams;

  // Handle default values for `rpcVersion` and `id`
  const rpcVersionValue = rpcVersion || '2.0';
  const idValue = id || 1;

  // Convert httpBody to a PHP-compatible format
  const formatParamsForPhp = (params) => {
    if (Array.isArray(params)) {
      return `[${params.map(item => `'${item}'`).join(', ')}]`; // Correct array formatting for PHP
    }
    if (typeof params === 'object') {
      return `[${Object.entries(params)
        .map(([key, value]) => `'${key}' => '${value}'`)
        .join(', ')}]`; // Use PHP array syntax for key-value pairs
    }
    return `'${params}'`;
  };

  const formattedParams = formatParamsForPhp(httpBody);

  const headersCode = Object.entries(headers)
    .map(([key, value]) => `"${key}: ${value}"`)
    .join(",\n    ");

  const code = `
<?php

$url = "${url}";
$data = [
    "jsonrpc" => "${rpcVersionValue}",
    "id" => ${idValue},
    "method" => "${bodyMethod}",
    "params" => ${formattedParams}
];

// Initialize cURL session
$ch = curl_init($url);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    ${headersCode}
]);

// Execute cURL request
$response = curl_exec($ch);

// Check for errors
if ($response === false) {
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
