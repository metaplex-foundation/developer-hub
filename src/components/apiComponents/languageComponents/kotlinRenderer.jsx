import { Fence } from '@/components/Fence';

const KotlinRequestRenderer = ({ url, bodyMethod, bodyParams }) => {
  const httpBody = bodyParams;

  const code = `
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL

fun main() {
    try {
        val url = "${url}"
        val jsonInputString = """
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "${bodyMethod}",
                "params": ${JSON.stringify(httpBody, null, 2).replace(/\n/g, '\n                ')}
            }
        """

        // Create a URL object from the string URL
        val obj = URL(url)
        val con = obj.openConnection() as HttpURLConnection

        // Set the HTTP method to POST
        con.requestMethod = "POST"

        // Set the headers
        con.setRequestProperty("Content-Type", "application/json")

        // Enable input and output streams
        con.doOutput = true

        // Write the request body (JSON)
        con.outputStream.use { os: OutputStream ->
            val input = jsonInputString.toByteArray(Charsets.UTF_8)
            os.write(input, 0, input.size)
        }

        // Get the response code
        val responseCode = con.responseCode
        println("Response Code: \$responseCode")

    } catch (e: Exception) {
        e.printStackTrace()
    }
}
`;

  return (
    <Fence className="w-full" language="kotlin">
      {code}
    </Fence>
  );
};

export default KotlinRequestRenderer;
