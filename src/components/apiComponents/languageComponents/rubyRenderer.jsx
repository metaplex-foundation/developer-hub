import { Fence } from '@/components/Fence'
import renderRequestBody from '@/lib/api/renderRequestBody'


const RubyRenderer = ({ method, url, headers, body }) => {
  const headerString = headers
    ? headers.map(({ key, value }) => `:'${key}' => '${value}'`).join(', ')
    : ''
  const bodyString = body ? renderRequestBody(body) : ''

  const object = {
    method: method,
    headers: headers
    ? `{${headerString}}`
    : { 'Content-Type': 'application/json' },
    body: bodyString,
  }

  const code = `require 'net/http'
require 'json'

url = URI.parse('${url}')
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = (url.scheme == 'https')

headers = ${JSON.stringify(object.headers, null, 2)}

request = Net::HTTP::POST.new(url)
request['Content-Type'] = 'application/json'
headers.each { |key, value| request[key] = value }
request.body = ${JSON.stringify(object, null, 2)}

response = http.request(request)
puts response.body`

  return (
    <Fence className="w-full" language="ruby">
      {code}
    </Fence>
  )
}

export default RubyRenderer
