import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'

const PhpRenderer = ({ method, url, headers, body }) => {
  const headerString = headers
    ? headers.map(({ key, value }) => `'${key}' => '${value}'`).join(', ')
    : ''
  const bodyString = body ? renderRequestBody(body) : ''

  const object = {
    method: method,
    headers: headers,
    body: bodyString,
  }

  const code = `<?php
    $url = '${url}';
    $headers = array(
      ${headerString}
    );
    $data = json_encode(${JSON.stringify(object, null, 2)});
    
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    
    $result = curl_exec($ch);
    
    curl_close($ch);
    
    echo $result;
    ?>`

  return (
    <Fence className="w-full" language="php">
      {code}
    </Fence>
  )
}

export default PhpRenderer
