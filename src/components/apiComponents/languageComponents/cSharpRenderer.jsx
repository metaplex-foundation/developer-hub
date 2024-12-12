const { Fence } = require('@/components/Fence')
const { default: renderRequestBody } = require('@/lib/api/renderRequestBody')

const CSharpRequestRenderer = ({
  url,
  headers = {}, // Headers are passed as a prop
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

  const headersCode = Object.entries(headers)
    .map(([key, value]) => `{"${key}", "${value}"}`)
    .join(',\n      ')

  const jsonBody = JSON.stringify(object.body, null, 2).replace(/"/g, '""')

  const code = `
using System;
using System.Net.Http;
using System.Text;

class Program
{
  static void Main() {
    var url = "${url}";
    var headers = new System.Collections.Generic.Dictionary<string, string> {
      ${headersCode}
    };
    var data = new StringContent(@"
    ${jsonBody.replace(/\n/g, '\n    ')}
    ", Encoding.UTF8, "application/json");

    var client = new HttpClient();
    var request = new HttpRequestMessage {
      Method = HttpMethod.Post,
      RequestUri = new Uri(url),
      Content = data
    };

    foreach (var header in headers) {
      request.Headers.Add(header.Key, header.Value);
    }

    var response = client.SendAsync(request).Result;

    Console.WriteLine(response.StatusCode);
  }
}
`

  return (
    <Fence maxHeight={400} language="csharp">
      {code}
    </Fence>
  )
}

export default CSharpRequestRenderer
