# syntax=docker/dockerfile:1

FROM node:22.23.2-alpine3.24 AS builder

WORKDIR /app

RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm install --global npm@10.9.3 --no-audit --no-fund \
    && test "$(npm --version)" = "10.9.3"

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund

COPY . .

# VITE_* values are public build-time configuration embedded in the browser bundle.
# Never pass secrets through these arguments.
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY=""

RUN test -n "$VITE_AUTH0_DOMAIN" \
    || { echo >&2 "ERROR: build argument VITE_AUTH0_DOMAIN is required"; exit 1; }; \
    test -n "$VITE_AUTH0_CLIENT_ID" \
    || { echo >&2 "ERROR: build argument VITE_AUTH0_CLIENT_ID is required"; exit 1; }; \
    test -n "$VITE_AUTH0_AUDIENCE" \
    || { echo >&2 "ERROR: build argument VITE_AUTH0_AUDIENCE is required"; exit 1; }; \
    test -n "$VITE_API_URL" \
    || { echo >&2 "ERROR: build argument VITE_API_URL is required"; exit 1; }

ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE \
    VITE_API_URL=$VITE_API_URL \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30.4-alpine3.24 AS runtime

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY deploy/nginx/security-headers.inc /etc/nginx/conf.d/security-headers.inc
COPY --from=builder /app/dist/ /usr/share/nginx/html/

USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --output-document=- http://127.0.0.1:8080/healthz >/dev/null || exit 1
