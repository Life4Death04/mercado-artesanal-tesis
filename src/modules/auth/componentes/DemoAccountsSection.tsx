import { FlaskConical, Info } from 'lucide-react'
import { DEMO_ACCOUNTS } from '../demoAccounts'
import { DemoAccountCard } from './DemoAccountCard'

export function DemoAccountsSection() {
  return (
    <section
      aria-labelledby="demo-accounts-title"
      className="rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5"
    >
      <div
        id="demo-accounts-title"
        className="text-label-md flex items-center gap-2.5 tracking-wide text-[var(--color-primary)] uppercase"
      >
        <FlaskConical size={18} strokeWidth={1.8} />
        Cuentas de demostración
      </div>

      <div
        role="note"
        className="text-body-md mt-3.5 flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-3 py-2.5 text-[var(--color-on-surface)]"
      >
        <Info size={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
        <span>
          Antes de entrar, copia la contraseña. En la siguiente pantalla el email aparecerá ya escrito; solo
          tendrás que pegar la contraseña.
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3.5">
        {DEMO_ACCOUNTS.map((account) => (
          <DemoAccountCard key={account.email} account={account} />
        ))}
      </div>
    </section>
  )
}
