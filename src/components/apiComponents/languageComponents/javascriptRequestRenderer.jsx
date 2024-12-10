import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'

const JavascriptRequestRenderer = ({
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

  console.log(object)

  const code = `const res = await fetch('${url}', ${JSON.stringify(
    object,
    null,
    2
  )})
  
const data = await response.json();
`

  return (
    <Fence className="w-full" language="javascript">
      {code}
    </Fence>
  )
}

export default JavascriptRequestRenderer
