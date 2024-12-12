import { Fence } from '@/components/Fence'

const GoRequestRenderer = ({
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

  // Dynamically generate the headers dictionary for Go
  const headersCode = Object.entries(headers)
    .map(([key, value]) => `    "${key}": "${value}",`)
    .join('\n')

  // Generate the raw string literal JSON body (no escaping quotes)
  const jsonBody = JSON.stringify(object.body, null, 2)

  const code = `package main

import (
  "bytes"
  "fmt"
  "net/http"
)

func main() {
  url := "${url}"
  headers := map[string]string{
${headersCode}
  }
  data := bytes.NewBuffer([]byte(\`${jsonBody.replace(/\n/g, '\n    ')}
\`))

  req, err := http.NewRequest("POST", url, data)
  if err != nil {
    fmt.Println(err)
  }

  for key, value := range headers {
    req.Header.Set(key, value)
  }

  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
  }

  defer resp.Body.Close()

  fmt.Println(resp.Status)
}
`

  return (
    <Fence className="w-full" language="go">
      {code}
    </Fence>
  )
}

export default GoRequestRenderer
