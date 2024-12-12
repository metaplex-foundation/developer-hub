import { Fence } from '@/components/Fence';

const RustRequestRenderer = ({ url, headers, bodyMethod, rpcVersion, bodyParams, id }) => {
  const httpBody = bodyParams;

  const headersCode = Object.entries(headers)
    .map(([key, value]) => `    request = request.header("${key}", "${value}")`)
    .join("\n");

  const code = `
use reqwest::blocking::Client;
use reqwest::header::CONTENT_TYPE;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct RequestBody {
    jsonrpc: String,
    id: u64,
    method: String,
    params: serde_json::Value,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = "${url}";
    let client = Client::new();

    let request_body = RequestBody {
        jsonrpc: "${rpcVersion ? rpcVersion : '2.0'}".to_string(),
        id: ${id ? id : 1},
        method: "${bodyMethod}".to_string(),
        params: serde_json::json!(${JSON.stringify(httpBody)}),
    };

    let mut request = client.post(url)
        .header(CONTENT_TYPE, "application/json");

    ${headersCode}

    let response = request.json(&request_body).send()?;

    println!("Response: {:?}", response.text()?);

    Ok(())
}
`;

  return (
    <Fence className="w-full" language="rust">
      {code}
    </Fence>
  );
};

export default RustRequestRenderer;
