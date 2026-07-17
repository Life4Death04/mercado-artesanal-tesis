import { useAuth0 } from '@auth0/auth0-react'

type AuthErrorStateProps = {
  error?: unknown
}

export function AuthErrorState({ error }: AuthErrorStateProps) {
  const { logout } = useAuth0()

  const detail = getErrorDetail(error)

  function handleLogout() {
    void logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center text-[var(--color-on-background)]">
      <section className="max-w-md rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-editorial)]">
        <h1 className="text-headline-md mb-3 text-[var(--color-primary-container)]">No pudimos sincronizar tu cuenta</h1>
        <p className="text-body-md mb-6 text-[var(--color-on-surface-variant)]">
          La sesión de Auth0 existe, pero el backend no pudo crear o leer tu usuario local.
        </p>
        {detail ? (
          <pre className="mb-6 overflow-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-container-low)] p-4 text-left text-xs text-[var(--color-on-surface-variant)]">
            {detail}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={handleLogout}
          className="text-label-md bg-[var(--color-primary-container)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  )
}

function getErrorDetail(error: unknown): string | undefined {
  if (!error) return undefined

  if (error instanceof Error) return error.message

  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error, null, 2)
  }

  return String(error)
}
