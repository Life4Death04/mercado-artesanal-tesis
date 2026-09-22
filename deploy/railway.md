# Deploy the frontend on Railway

This deployment builds the same hardened Docker image (multi-stage `Dockerfile`, `nginxinc/nginx-unprivileged` runtime) used for the homelab deployment, but runs it as a Railway service alongside the already-deployed backend.

This guide assumes the backend is already deployed and reachable at a stable HTTPS URL. It does not cover backend deployment.

## Prerequisites

- A Railway account with access to the project (existing or new).
- The GitHub repository connected: `https://github.com/Life4Death04/mercado-artesanal-tesis`.
- Public, non-secret Auth0 and Stripe build settings. Every `VITE_*` value is embedded in the browser bundle at build time; never put a secret key in one of these.
- The backend's stable HTTPS URL. Currently `https://mercado-artesanal-backend-production.up.railway.app`.

## Create the service

1. From the Railway project: **New Service → GitHub Repo** → select `mercado-artesanal-tesis`. Railway auto-detects the Dockerfile build (the file must stay named `Dockerfile`, capital D, at repo root).
2. Set the following service Variables (**Settings → Variables**). These become Docker build `ARG`s; the Dockerfile already declares all five:

   | Variable | Value |
   |---|---|
   | `VITE_AUTH0_DOMAIN` | `dev-67czjt1nv3ynlrgj.us.auth0.com` |
   | `VITE_AUTH0_CLIENT_ID` | same client ID used for local development |
   | `VITE_AUTH0_AUDIENCE` | `https://api.mercado.artesanal` |
   | `VITE_API_URL` | `https://mercado-artesanal-backend-production.up.railway.app/api/v1` |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | the `pk_...` publishable key, never `sk_...` |

3. `railway.json` (repo root) already configures the Dockerfile builder and the `/healthz` deploy healthcheck; no extra build/deploy Settings are required.
4. **Networking → Public Networking → Target Port**: set to `8080`. This image's Nginx always listens on a static port 8080; it does not read Railway's injected `$PORT`. Generate a Railway domain (or attach a custom domain) once the target port is set.

## Deploy and verify

1. Trigger the first deploy (push to the connected branch, or **Deploy** in the dashboard).
2. Watch the build logs for the `Using detected Dockerfile!` confirmation.
3. Once deployed, confirm the health endpoint:

   ```bash
   curl --fail --show-error https://<railway-domain>/healthz
   ```

   Must return `ok`.
4. Load the SPA and check the browser's network tab: requests should go to `https://mercado-artesanal-backend-production.up.railway.app/api/v1`, with no mixed-content HTTP calls and no stale Tailscale/localhost URL baked into an old build.

## Configure Auth0 and CORS

1. In the Auth0 SPA application, add the exact Railway origin (`https://<service>.up.railway.app`, or the custom domain) to:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
2. Confirm the backend's `CORS_ORIGIN` already includes this exact origin. The backend rejects wildcards and plain HTTP in production and only accepts exact, comma-separated origins — since this frontend origin didn't exist when the backend was first deployed, check it, don't assume it.

Until both are confirmed, only the frontend shell should be considered deployed; authenticated and data-backed flows are not production-ready.

## Operate and roll back

- **`VITE_*` changes require a rebuild.** These values are baked into the static bundle at build time. Editing a Variable in the Railway dashboard does nothing to a running deployment until you trigger a new build.
- Check the live deployment:

  ```bash
  curl --fail --show-error https://<railway-domain>/healthz
  ```

- Rollback boundary: `railway.json`, this guide, and the Deployment section of `README.md`. Reverting those files does not delete the Railway service or unset its dashboard-configured Variables/Target Port — those must be reversed in the Railway dashboard separately.
- To fully decommission, delete the Railway service from the dashboard and remove its domain from Auth0's allowed origins.
