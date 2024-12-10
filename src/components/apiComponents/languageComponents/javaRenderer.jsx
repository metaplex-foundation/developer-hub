const { Fence } = require('@/components/Fence')
const { default: renderRequestBody } = require('@/lib/api/renderRequestBody')

const JavaRenderer = ({ method, url, headers, body }) => {
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

  const code = `import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.net.http.HttpResponse.BodyHandlers;
    import java.net.http.HttpRequest.BodyPublishers;
    import java.util.Map;
    import java.util.HashMap;
    
    public class Main {
        public static void main(String[] args) throws Exception {
            String url = "${url}";
            Map<String, String> headers = new HashMap<String, String>() {{
                ${headerString}
            }};
            String data = "${JSON.stringify(object, null, 2)}";
    
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .headers(headers.entrySet().stream()
                    .map(e -> e.getKey() + ": " + e.getValue())
                    .toArray(String[]::new))
                .method("${method}", BodyPublishers.ofString(data))
                .build();
    
            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
    
            System.out.println(response.body());
        }
    }
    `

  return (
    <Fence className="w-full" language="java">
      {code}
    </Fence>
  )
}

export default JavaRenderer
