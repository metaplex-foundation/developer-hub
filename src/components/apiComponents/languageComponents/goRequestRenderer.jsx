import renderRequestBody from '@/lib/api/renderRequestBody'

const { Fence } = require('@/components/Fence')

const GoRequestRenderer = ({ method, url, headers, body }) => {
  const headerString = headers
    ? headers.map(({ key, value }) => `'${key}': '${value}'`).join(', ')
    : ''
  const bodyString = body ? renderRequestBody(body) : ''

  const object = {
    method: method,
    headers: headers,
    body: bodyString,
  }

  const code = `package main

import (
  "bytes"
  "fmt"
  "net/http"
)


func main() {
  url := "${url}"
  headers := map[string]string{
    ${headerString}
  }
  data := bytes.NewBuffer([]byte(\`${JSON.stringify(object, null, 2)}\`))

  req, err := http.NewRequest("${method}", url, data)
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
