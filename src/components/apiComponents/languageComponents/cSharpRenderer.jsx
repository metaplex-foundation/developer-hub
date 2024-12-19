const { Fence } = require('@/components/Fence');

const CSharpRequestRenderer = ({
  url,
  bodyMethod,
  rpcVersion,
  bodyParams,
  id,
}) => {
  const httpBody = bodyParams;

  const object = {
    method: 'POST',
    body: {
      jsonrpc: rpcVersion ? rpcVersion : '2.0',
      id: id ? id : 1,
      method: bodyMethod,
      params: httpBody,
    },
  };

  const jsonBody = JSON.stringify(object.body, null, 2).replace(/"/g, '""');

  const code = `
using System;
using System.Net.Http;
using System.Text;

class Program
{
  static void Main() {
    var url = "${url}";
    var data = new StringContent(@"
    ${jsonBody.replace(/\n/g, '\n    ')}
    ", Encoding.UTF8, "application/json");

    var client = new HttpClient();
    var request = new HttpRequestMessage {
      Method = HttpMethod.Post,
      RequestUri = new Uri(url),
      Content = data
    };

    try {
      var response = client.SendAsync(request).Result;
      Console.WriteLine($"Status Code: {response.StatusCode}");
      Console.WriteLine(response.Content.ReadAsStringAsync().Result);
    } catch (Exception ex) {
      Console.WriteLine($"An error occurred: {ex.Message}");
    }
  }
}`;

  return (
    <Fence maxHeight={400} language="csharp">
      {code}
    </Fence>
  );
};

export default CSharpRequestRenderer;
