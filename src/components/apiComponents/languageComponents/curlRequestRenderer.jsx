import { Fence } from '@/components/Fence'

const CurlRequestRenderer = ({
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

  // Dynamically generate the headers dictionary for curl
  const headersCode = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ')

  // JSON body formatted for curl with escaped double quotes
  const jsonBody = JSON.stringify(object.body).replace(/"/g, '\\"') // Make it a single-line string

  // Generate the curl command (single-line body)
  const code = `curl -X POST ${headersCode} -d "${jsonBody}" ${url}`

  return (
    <Fence className="w-full" language="bash">
      {code}
    </Fence>
  )
}

export default CurlRequestRenderer
