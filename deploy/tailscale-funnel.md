# Deploy the frontend with Tailscale Funnel

This deployment runs only the frontend in Docker and publishes Nginx on host loopback at `127.0.0.1:18080`. Tailscale Funnel must run on the host and forward HTTPS traffic to that local address.

This is not a complete authenticated production deployment. The API still needs a stable HTTPS endpoint, the Auth0 application must trust the final frontend origin, and the API and storage services must allow that origin where CORS applies.

## Prerequisites

- Docker Engine with Docker Compose.
- A host-managed Tailscale installation and an account where Funnel can be enabled.
- Public, non-secret Auth0 and API build settings. Every `VITE_*` value is embedded in the browser bundle.
- An available host port `18080`. Do not change the loopback address to `0.0.0.0` or `::`.

## Start the frontend

1. Create `.env` from `.env.example` if needed and replace every placeholder. `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, and `VITE_API_URL` are required. The Stripe publishable key is optional; never use a Stripe secret key.
2. Build and start only the frontend:

   ```bash
   docker compose up --build --detach frontend
   ```

3. Confirm the container is healthy and reachable only through host loopback:

   ```bash
   docker compose ps
   curl --fail --show-error http://127.0.0.1:18080/healthz
   docker compose port frontend 8080
   ```

The health endpoint must return `ok`, and the published address must be `127.0.0.1:18080`.

## Configure the host Funnel

Install Tailscale on the host from its official documentation, authenticate the host with the intended Tailscale account, and confirm that Funnel is permitted for that account. Tailscale is not part of this Compose project.

Funnel CLI syntax can vary by installed Tailscale version. This repository could not verify the host CLI, so inspect the installed command before enabling public access:

```bash
tailscale funnel --help
```

Use the syntax shown by that help output to forward Funnel HTTPS traffic to exactly:

```text
http://127.0.0.1:18080
```

Do not target a LAN address or change the Compose publication to a non-loopback address. Record the stable `https://<machine-name>.<tailnet-name>.ts.net` URL reported by Funnel. Confirm the hostname against the host's Tailscale status or the Tailscale admin console before configuring external services.

## Configure Auth0 and the API

In the Auth0 SPA application, add the exact Funnel origin, without a trailing path, to:

- Allowed Callback URLs
- Allowed Logout URLs
- Allowed Web Origins

For example, use `https://<machine-name>.<tailnet-name>.ts.net` in all three fields. The application uses the browser origin as its Auth0 callback and logout return URL.

Before testing authenticated features, confirm all of the following:

- `VITE_API_URL` is a browser-reachable stable HTTPS URL. Rebuild the image after changing any `VITE_*` value.
- The API accepts the configured Auth0 audience and allows the exact Funnel origin through CORS.
- Any storage service or presigned-upload endpoint used directly by the browser also allows the exact Funnel origin through CORS.
- HTTPS frontend pages do not call an HTTP API, which browsers block as mixed content.

Until these dependencies are configured, only the frontend shell should be considered deployed; authenticated and data-backed flows are not production-ready.

## Operate and roll back

Check the local deployment with:

```bash
docker compose ps
curl --fail --show-error http://127.0.0.1:18080/healthz
```

Use `tailscale funnel --help` to identify the installed version's status and disable commands. For shutdown or rollback, disable Funnel first and verify that the public URL is no longer served. Then remove the frontend container:

```bash
docker compose down
```

The repository rollback boundary is `compose.yaml`, this guide, and the deployment link in `README.md`. Reverting those files does not disable host-managed Funnel or remove Tailscale; those host actions must be reversed separately before restoring another topology.
