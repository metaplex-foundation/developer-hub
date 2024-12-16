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
  "io/ioutil"
  "net/http"
  "time"
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
    fmt.Printf("Error creating request: %v\\n", err)
    return
  }

  for key, value := range headers {
    req.Header.Set(key, value)
  }

  // Create an HTTP client with a timeout
  client := &http.Client{
    Timeout: 10 * time.Second,
  }

  // Send the request
  resp, err := client.Do(req)
  if err != nil {
    fmt.Printf("Error making request to %s: %v\\n", url, err)
    return
  }

  // Ensure response body is closed
  defer func() {
    if resp != nil && resp.Body != nil {
      resp.Body.Close()
    }
  }()

  // Print the status code
  fmt.Println("Status:", resp.Status)

  // Read the response body
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    fmt.Printf("Error reading response body: %v\\n", err)
    return
  }

  // Print the response body
  fmt.Println("Response Body:", string(body))
}
`

  return (
    <Fence className="w-full" language="go">
      {code}
    </Fence>
  )
}

export default GoRequestRenderer
