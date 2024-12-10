import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'

const KotlinRenderer = ({ method, url, headers, body }) => {
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

  const code = `
  import java.net.URI;
  import java.net.http.HttpClient;
  import java.net.http.HttpRequest;
  import java.net.http.HttpResponse;
  import java.net.http.HttpResponse.BodyHandlers;
  import java.net.http.HttpRequest.BodyPublishers;
  import java.util.Map;
  import java.util.HashMap;
  
  fun main() {
      val url = "${url}"
      val headers = mapOf(
          ${headerString}
      )
      val data = 
          ${JSON.stringify(object, null, 2)}
      

      val client = HttpClient.newHttpClient()
      val request = HttpRequest.newBuilder()
          .uri(URI.create(url))
          .headers(headers.map { it.key + ": " + it.value }.toTypedArray())
          .method("${method}", BodyPublishers.ofString(data))
          .build()

      val response = client.send(request, BodyHandlers.ofString())

      println(response.body())
  }
  `

  return (
    <Fence className="w-full" language="kotlin">
      {code}
    </Fence>
  )
}

export default KotlinRenderer
