import { Fence } from '@/components/Fence'

const JavaRequestRenderer = ({
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

  // Dynamically generate the headers dictionary for Java
  const headersCode = Object.entries(headers)
    .map(([key, value]) => `con.setRequestProperty("${key}", "${value}");`)
    .join('\n')

  // Format the JSON body correctly for the Java code with proper indentation
  const jsonBody = JSON.stringify(object.body, null, 2)

  const code = `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Main {
    public static void main(String[] args) {
        try {
            String url = "${url}";
            String jsonInputString = """
            ${jsonBody.replace(/\n/g, '\n            ')}
            """ ;

            // Create a URL object from the string URL
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            // Set the HTTP method to POST
            con.setRequestMethod("POST");

            // Set the headers
            ${headersCode}

            // Enable input and output streams
            con.setDoOutput(true);

            // Write the request body (JSON)
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            // Get the response code
            int responseCode = con.getResponseCode();
            System.out.println("Response Code: " + responseCode);

            // Read the response body
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(con.getInputStream(), "utf-8"))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
                System.out.println("Response Body: " + response.toString());
            }

        } catch (Exception e) {
            System.err.println("Error occurred while making the request:");
            e.printStackTrace();
        }
    }
}
`

  return (
    <Fence className="w-full" language="java">
      {code}
    </Fence>
  )
}

export default JavaRequestRenderer
