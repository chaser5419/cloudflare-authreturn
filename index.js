export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    // Identity headers injected by Cloudflare Access
    const EMAIL = request.headers.get("Cf-Access-Authenticated-User-Email") || "unauthenticated";
    const COUNTRY = request.headers.get("Cf-IPCountry") || "XX";

    // Generate ISO8601-like timestamp without milliseconds + explicit UTC
    const now = new Date();
    const TIMESTAMP =
      now.toISOString().replace("T", " ").replace(/\.\d+Z$/, "") + " UTC";

    // GET /secure -> show required string + formatted output
    if (parts.length === 1 && parts[0] === "secure") {
      return new Response(
        `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>User Authentication Info</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .fixed { font-family: monospace; font-size: 1.1em; margin-bottom: 20px; }
    .pretty { font-size: 1.1em; }
    a { color: #0066cc; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
    img { vertical-align: middle; margin-left: 10px; height: 20px; border: 1px solid #ccc; }
    table { border-collapse: collapse; }
    td { padding: 4px 10px; vertical-align: middle; }
    td.label { font-weight: bold; color: #444; }
  </style>
</head>
<body>
  <!-- Required fixed content -->
  <div class="fixed">
    ${EMAIL} authenticated at ${TIMESTAMP} from 
    <a href="/secure/${COUNTRY}">${COUNTRY}</a>
  </div>

  <!-- Pretty printed content -->
  <div class="pretty">
    <table>
      <tr>
        <td class="label">User:</td>
        <td>${EMAIL}</td>
      </tr>
      <tr>
        <td class="label">Authenticated at:</td>
        <td>${TIMESTAMP}</td>
      </tr>
      <tr>
        <td class="label">From country:</td>
        <td>
          <a href="/secure/${COUNTRY}">${COUNTRY}</a>
          <img src="/secure/${COUNTRY}" alt="Flag of ${COUNTRY}">
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`,
        { headers: { "Content-Type": "text/html; charset=UTF-8" } }
      );
    }

    // GET /secure/{COUNTRY} -> serve flag from R2 or fallback HTML
    if (parts.length === 2 && parts[0] === "secure") {
      const CODE = parts[1].toUpperCase();
      const obj = await env.FLAG_BUCKET?.get(`${CODE}.png`);

      if (!obj) {
        // Fallback HTML if flag not found
        return new Response(
          `
<!doctype html>
<html><body>
  <p>Flag for <strong>${CODE}</strong> not found in R2 bucket.</p>
  <p><a href="/secure">Back to /secure</a></p>
</body></html>`,
          { headers: { "Content-Type": "text/html; charset=UTF-8" }, status: 200 }
        );
      }

      return new Response(obj.body, { headers: { "Content-Type": "image/png" } });
    }
  }
};
