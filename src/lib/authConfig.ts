function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const authConfig = {
  domain: requireEnv('VITE_AUTH0_DOMAIN'),
  clientId: requireEnv('VITE_AUTH0_CLIENT_ID'),
  audience: requireEnv('VITE_AUTH0_AUDIENCE'),
  redirectUri: window.location.origin,
}
