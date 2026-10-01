export type DemoAccount = {
  role: string
  scope: string
  email: string
  password: string
  ctaLabel: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'Productor / Artesano',
    scope: 'Panel de Productor / Artesano',
    email: 'demo-producer@mercado-artesanal.demo',
    password: 'HireMeNow123!',
    ctaLabel: 'Entrar como Productor →',
  },
  {
    role: 'Administrador',
    scope: 'Panel de Administración',
    email: 'demo-admin@mercado-artesanal.demo',
    password: 'HireMeNow123!',
    ctaLabel: 'Entrar como Administrador →',
  },
]
