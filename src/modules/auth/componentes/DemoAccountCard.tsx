import { Copy } from 'lucide-react'
import type { DemoAccount } from '../demoAccounts'

type DemoAccountCardProps = {
  account: DemoAccount
}

export function DemoAccountCard({ account }: DemoAccountCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-label-sm rounded-[var(--radius-sm)] bg-[var(--color-primary-fixed)] px-2.5 py-1 font-semibold tracking-wide text-[var(--color-on-primary-fixed-variant)] uppercase">
          {account.role}
        </span>
        <span className="text-label-sm text-[var(--color-outline)]">{account.scope}</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="min-w-0 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-container-low)] px-3 py-2.5">
          <div className="text-label-sm tracking-wide text-[var(--color-on-surface-variant)] uppercase">Email</div>
          <div className="mt-1 font-mono text-sm font-semibold break-all text-[var(--color-on-surface)]">
            {account.email}
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2.5 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-container-low)] px-3 py-2.5">
          <div className="min-w-0">
            <div className="text-label-sm tracking-wide text-[var(--color-on-surface-variant)] uppercase">
              Contraseña
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-[var(--color-on-surface)]">
              {account.password}
            </div>
          </div>
          <button
            type="button"
            aria-label="Copiar contraseña"
            className="flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-fixed)]"
          >
            <Copy size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="text-label-md w-full rounded-[var(--radius-sm)] border border-[var(--color-primary-container)] bg-transparent px-6 py-3 text-[var(--color-primary-container)] transition-colors hover:bg-[var(--color-primary-fixed)]"
      >
        {account.ctaLabel}
      </button>
    </div>
  )
}
