export type DemoAccount = {
  role: string
  scope: string
  email: string
  password: string
  ctaLabel: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'Administrador',
    scope: 'Acceso completo',
    email: 'admin@demo.laboheme.com',
    password: 'Demo1234',
    ctaLabel: 'Entrar como Administrador →',
  },
  {
    role: 'Productor',
    scope: 'Catálogo y pedidos',
    email: 'productor@demo.laboheme.com',
    password: 'Demo5678',
    ctaLabel: 'Entrar como Productor →',
  },
]
