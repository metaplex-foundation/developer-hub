import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'

const JavascriptRequestRenderer = ({ method, url, headers, body }) => {
  const headerString = headers
    ? headers.map(({ key, value }) => `'${key}': '${value}'`).join(', ')
    : ''
  const bodyString = body ? renderRequestBody(body) : ''

  const object = {
    method: method,
    headers: headers,
    body: bodyString,
  }

  const code = `const res = await fetch('${url}', ${JSON.stringify(
    object,
    null,
    2
  )}
  
  const json = await res.json()

  console.log(json)
  )`

  return (
    <Fence className="w-full" language="javascript">
      {code}
    </Fence>
  )
}

export default JavascriptRequestRenderer
