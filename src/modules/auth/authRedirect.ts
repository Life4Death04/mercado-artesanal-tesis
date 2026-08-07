export const loginAuthorizationParams = {
  prompt: 'select_account',
} as const

export const signupAuthorizationParams = {
  screen_hint: 'signup',
  prompt: 'login',
} as const

export function safeReturnTo(value: unknown, fallback = '/'): string {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\')
  ) {
    return fallback
  }

  const target = new URL(value, window.location.origin)

  if (target.origin !== window.location.origin) {
    return fallback
  }

  return `${target.pathname}${target.search}`
}
