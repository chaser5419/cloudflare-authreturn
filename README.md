# 🌐 Cloudflare Authenticated User Info & Flags

This project demonstrates a **Cloudflare Worker** that displays authenticated user details and fetches country flag images from a private **R2 bucket**.

---

## ✨ Key Features

✅ Identity-aware access with Cloudflare Access

✅ ISO 8601 timestamps in UTC

✅ Country-aware output with R2-backed flag images

✅ Graceful error handling for missing assets

✅ Clean, extensible project structure

---

## 🚀 Features

- 🔒 **Cloudflare Access Integration**: Secure `/secure` route with your identity provider.
- 👤 **User Info Display**: Shows authenticated email, login timestamp (UTC, ISO 8601), and country code.
- 🏳️‍🌈 **Flag Images from R2**: Fetches country flag images from a private R2 bucket. If missing, shows a fallback message.

---

## 🛠 How It Works

1. User visits `/secure` (protected route).
2. **Cloudflare Access** enforces authentication via your configured Identity Provider.
3. After login, Cloudflare injects identity details into request headers.
4. The Worker (`index.js`) reads these headers and returns an HTML page with:
    - Authenticated email
    - Authentication timestamp (UTC, ISO 8601)
    - Country code and flag image from R2
    - Fallback message if flag is missing

---

## 📁 Project Structure

- `index.js` — Worker script for `/secure` and `/secure/{COUNTRY}`
- `wrangler.toml` — Wrangler config binding the Worker to the R2 bucket `flags`

Example R2 binding in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "FLAG_BUCKET"
bucket_name = "flags"
```

---

## ⚡ Build & Deploy

1. **Install Wrangler CLI**
    ```bash
    npm install -g wrangler
    ```
2. **Login to Cloudflare**
    ```bash
    wrangler login
    ```
3. **Deploy the Worker**
    ```bash
    wrangler deploy
    ```
4. **Protect `/secure` with Cloudflare Access**
    - Configure in the Zero Trust dashboard

---

## 🖥️ Example Output

After authenticating and visiting `/secure`, you'll see an HTML page like:

```
user@example.com authenticated at 2025-09-16 03:47:01 UTC from MY
```

Displayed in a formatted table:

- **Email**
- **UTC Timestamp**
- **Clickable Country Code** (e.g., `MY`)
- **Country Flag** (inline, from R2)

If the flag image is missing in R2:

```
Flag for MY not found in R2 bucket.
```

---
