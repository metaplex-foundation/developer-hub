import { Fence } from '@/components/Fence';

const RubyRequestRenderer = ({ url, headers, bodyMethod, rpcVersion, bodyParams, id }) => {
  const httpBody = bodyParams;

  const headersCode = Object.entries(headers)
    .map(([key, value]) => `    req["${key}"] = "${value}"`)
    .join("\n");

  const code = `
require 'net/http'
require 'json'
require 'uri'

uri = URI.parse("${url}")
http = Net::HTTP.new(uri.host, uri.port)

# Prepare the request body
request_body = {
  "jsonrpc": "${rpcVersion ? rpcVersion : '2.0'}",
  "id": ${id ? id : 1},
  "method": "${bodyMethod}",
  "params": ${JSON.stringify(httpBody)}
}.to_json

# Create the POST request
request = Net::HTTP::Post.new(uri.path, { "Content-Type" => "application/json" })
${headersCode}

# Set the request body
request.body = request_body

# Send the request and get the response
response = http.request(request)

# Output the response
puts "Response: #{response.body}"
`;

  return (
    <Fence className="w-full" language="ruby">
      {code}
    </Fence>
  );
};

export default RubyRequestRenderer;
