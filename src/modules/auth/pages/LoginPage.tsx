import { AuthBrandPanel } from '../componentes/AuthBrandPanel'
import { AuthPageShell } from '../componentes/AuthPageShell'
import { LoginAccessCard } from '../componentes/LoginAccessCard'

export function LoginPage() {
  return (
    <AuthPageShell>
      <div className="auth-editorial-shadow mx-auto grid w-full max-w-[var(--layout-container-max)] overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] bg-[var(--color-surface-container-lowest)] md:grid-cols-2">
        <AuthBrandPanel />
        <LoginAccessCard />
      </div>
    </AuthPageShell>
  )
}
