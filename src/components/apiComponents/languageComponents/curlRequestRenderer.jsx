import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'

const CurlRequestRenderer = ({ method, url, headers, body }) => {
  const headerString = headers
    ? headers.map(({ key, value }) => `-H '${key}: ${value}'`).join(' ')
    : ''
  const bodyString = body ? renderRequestBody(body) : ''

  const code = `curl -X ${method} ${headerString} -d '${bodyString}' ${url}`

  return (
    <Fence className="w-full" language="bash">
      {code}
    </Fence>
  )
}

export default CurlRequestRenderer
