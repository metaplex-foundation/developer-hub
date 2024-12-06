import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'

const PythonRequestRenderer = ({ method, url, headers, body }) => {
  const headerString = headers
    ? headers.map(({ key, value }) => `'${key}': '${value}'`).join(', ')
    : ''
  const bodyString = body ? renderRequestBody(body) : ''

  const object = {
    method: method,
    headers: headers,
    body: bodyString,
  }

  const code = `import requests
  
  url = "${url}"
  headers = {
      ${headerString}
  }
  data = ${JSON.stringify(object, null, 2)}
  
  response = requests.request("${method}", url, headers=headers, data=data)
  
  print(response.text)
  `

  return (
    <Fence className="w-full" language="python">
      {code}
    </Fence>
  )
}

export default PythonRequestRenderer


