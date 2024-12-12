import { Fence } from '@/components/Fence';

const SwiftRequestRenderer = ({ url, headers, bodyMethod, rpcVersion, bodyParams, id }) => {
  const httpBody = bodyParams;

  const headersCode = Object.entries(headers)
    .map(([key, value]) => `        request.setValue("${value}", forHTTPHeaderField: "${key}")`)
    .join("\n");

  const jsonBody = JSON.stringify({
    jsonrpc: rpcVersion ? rpcVersion : '2.0',
    id: id ? id : 1,
    method: bodyMethod,
    params: httpBody,
  }, null, 2);

  const code = `
import Foundation

let url = URL(string: "${url}")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")

${headersCode}

let jsonData = """
${jsonBody}
""".data(using: .utf8)!

request.httpBody = jsonData

let task = URLSession.shared.dataTask(with: request) { data, response, error in
    if let error = error {
        print("Error: \(error)")
        return
    }
    if let data = data, let responseString = String(data: data, encoding: .utf8) {
        print("Response: \(responseString)")
    }
}

task.resume()
`;

  return (
    <Fence className="w-full" language="swift">
      {code}
    </Fence>
  );
};

export default SwiftRequestRenderer;
