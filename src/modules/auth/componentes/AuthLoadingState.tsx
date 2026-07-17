type AuthLoadingStateProps = {
  message?: string
}

export function AuthLoadingState({ message = 'Preparando tu sesión...' }: AuthLoadingStateProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center text-[var(--color-on-background)]">
      <div className="max-w-sm space-y-4">
        <div className="mx-auto size-10 animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--color-primary-container)_20%,transparent)] border-t-[var(--color-primary-container)]" />
        <p className="text-label-md text-[var(--color-on-surface-variant)]">{message}</p>
      </div>
    </div>
  )
}
