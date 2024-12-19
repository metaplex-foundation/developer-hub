import { Fence } from '@/components/Fence'

const JavaScriptRequestRenderer = ({
  url,
  headers,
  bodyMethod,
  rpcVersion,
  bodyParams,
  id,
}) => {
  const httpBody = bodyParams

  const object = {
    method: 'POST',
    headers: headers,
    body: {
      jsonrpc: rpcVersion ? rpcVersion : '2.0',
      id: id ? id : 1,
      method: bodyMethod,
      params: httpBody,
    },
  }

  // Dynamically generate headers for JavaScript
  const headersCode = Object.entries(headers)
    .map(([key, value]) => `"${key}": "${value}"`)
    .join(',\n')

  // Format the body with indentation
  const jsonBody = JSON.stringify(object.body, null, 2) // 4-space indentation for JSON

  const code = `const url = "${url}";

fetch(url, {
    method: "POST",
    headers: ${headersCode},
    body: ${jsonBody.replace(/\n/g, '\n    ')}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));
`

  return (
    <Fence className="w-full" language="javascript">
      {code}
    </Fence>
  )
}

export default JavaScriptRequestRenderer
