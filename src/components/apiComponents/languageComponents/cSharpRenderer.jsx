const { Fence } = require("@/components/Fence")
const { default: renderRequestBody } = require("@/lib/api/renderRequestBody")

const CSharpRequestRenderer = ({ method, url, headers, body }) => {
    const headerString = headers
      ? headers.map(({ key, value }) => `'${key}': '${value}'`).join(', ')
      : ''
    const bodyString = body ? renderRequestBody(body) : ''
  
    const object = {
      method: method,
      headers: headers
      ? `{${headerString}}`
      : { 'Content-Type': 'application/json' },
      body: bodyString,
    }
  
    const code = `using System;
  using System.Net.Http;
  using System.Text;
  
  class Program
  
  {
      static void Main()
      {
          var url = "${url}";
          var headers = new System.Collections.Generic.Dictionary<string, string>
          {
              ${headerString}
          };
          var data = new StringContent(\`${JSON.stringify(
            object,
            null,
            2
          )}\`, Encoding.UTF8, "application/json");
  
          var client = new HttpClient();
          var request = new HttpRequestMessage
          {
              Method = new HttpMethod("${method}"),
              RequestUri = new Uri(url),
              Content = data
          };
  
          foreach (var header in headers)
          {
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