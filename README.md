## Authenticated User Information with Cloudflare Access

This project demonstrates a simple Cloudflare Worker implemented in a **single JavaScript file** (`index.js`).  
The Worker returns information about the authenticated user by reading special HTTP request headers injected by **Cloudflare Access** after successful authentication.

### How It Works
1. A user attempts to access the protected route (e.g. `/secure`).  
2. Cloudflare Access enforces authentication with the configured Identity Provider (IdP).  
3. Once the user is authenticated, Cloudflare forwards the request to the Worker and injects identity details into custom HTTP headers.  
4. The Worker reads these headers and generates a response that shows:
   - **Email address** of the authenticated user  
   - **Authentication timestamp**  
   - **Country** (derived from Cloudflare’s geolocation header `Cf-IPCountry`)  

### Example Headers Provided by Cloudflare Access
- `Cf-Access-Authenticated-User-Email` → Authenticated user’s email  
- `Cf-Access-Authenticated-User-Id` → Unique user ID  
- `Cf-Access-Authenticated-User-Identity` → JSON object with extended identity details  
- `Cf-IPCountry` → Country code of the request  

### Worker Responsibilities
- Read the above headers from the incoming request.  
- Return an HTML response showing the authenticated user’s information.  
- Provide a link to `/secure/{COUNTRY}`, which fetches a corresponding flag asset from a private R2 bucket.  

This implementation highlights how **Cloudflare Access + Workers** can be combined to create identity-aware applications without directly exposing the origin server.
