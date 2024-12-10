import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'

const CurlRequestRenderer = ({ method, url, headers, body }) => {
  const headerString = headers
    ? headers.map(({ key, value }) => `'${key}': '${value}'`).join(', ')
    : ''
  const bodyString = body ? renderRequestBody(body) : ''

  const object = {
    method: 'POST',
    headers: headers
      ? `{${headerString}}`
      : { 'Content-Type': 'application/json' },
    body: bodyString,
  }

  const code = `curl -X ${method} ${headerString} -d '${JSON.stringify(
    object,
    null,
    2
  )}' ${url}`

  return (
    <Fence className="w-full" language="bash">
      {code}
    </Fence>
  )
}

export default CurlRequestRenderer
