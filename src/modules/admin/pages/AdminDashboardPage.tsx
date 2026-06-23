import { Link } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'

const quickAccessTiles = [
  {
    label: 'Gestión de Usuarios',
    to: '/admin/usuarios',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEPwEL0X87H4u-kJxSs8rLDa3YJwgNVkUnCVlMgiR8Bj9jCqDKXxzkxtB7VZPvrx4y1Cj1QYLxyIavD6iAfDAHn9-OisYYwsRZZFZsdCCY8J4Ub8igBAJ58yXSuu17gtS7VIOU-UCYz9EhXcox_QVKGCYVc-xwh9v2e83cBHAlmXulAQ5mcn3IBXORonF2b8DeCBmQ5Utkj9oOHkbdjr4yWYE3IZkN2wmPuD9cRwk7UTlQLYAVdLWJy2lzw3qMyIpEcrTfb5RUe9LJ',
    alt: 'Queso artesanal en una composición editorial de tonos cálidos',
  },
  {
    label: 'Gestión de Categorías',
    to: '/admin/categorias',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgX6IYkIs0O5IHn6QrtOhH_gd7rJFHyOs8Keadl8rUVfVTIdA_AWCYvTsE7999u9DFA07GjaxCrMrBiUpw97F5LhctekcJJ-y9vz4mo4Iemp0jaZQnlatQQt5oAKlzXQNWmWRYSngTNZngNyJrZHXUo7PwW8upXPubs19o6deNWfAxDJbCVI433Aq_Bi4SCX0LfQVS28r1T0yD6rw-9CD2DjBx2pmW1NJrJeyEbTqCaWztRI03hQXzhxbBQnUqMBTUG8vtsGcRRGVv',
    alt: 'Productos frescos organizados sobre una superficie clara',
  },
  {
    label: 'Gestión de Incidencias',
    to: '/admin/incidencias',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcm90VWuGg9mXGLIDuAZG9ktl-_0wEvjRCFy1yAdusw2i2d8glLNJeK8VRF3IGSJgYiHf-X7_NrK2Go5YML9hfirXIE5PhinrsnNVdVnsrDDt41zQCmZHgoeTQxmoZjEoA2wIoAllRRjWMU_B3gXPx0x7aROAuPXtsinybIgJL7libZTY2rD4u2qBUdzVJ9n8Y4lYN5w_bOoOhVU8G7q5dUHd5NxJa8weeUmRfnsBUGK5scwInUAjKwHeMFseGsEwLXQIHv8NhuTwj',
    alt: 'Fachada arquitectónica minimalista con sombras geométricas',
  },
]

const pendingItems = [
  {
    value: '5',
    title: 'Incidencias pendientes',
    description: 'Reportes de usuarios que requieren revisión inmediata por parte del equipo de moderación.',
    action: 'Revisar',
    to: '/admin/incidencias',
    icon: ArrowRight,
  },
  {
    value: '12',
    title: 'Publicaciones por revisar',
    description: 'Nuevos productos artesanales en cola de aprobación para asegurar los estándares de calidad.',
    action: 'Moderar',
    to: '/admin/moderacion',
    icon: SlidersHorizontal,
  },
]

const systemSummary = [
  { label: 'Usuarios', value: '1.240' },
  { label: 'Productores', value: '85' },
  { label: 'Pedidos', value: '412' },
]

export function AdminDashboardPage() {
  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-20">
        <h2 className="text-display-lg mb-4 text-[var(--color-on-surface)]">Panel de administración</h2>
        <p className="text-body-lg max-w-2xl text-[var(--color-secondary)]">
          Bienvenido de nuevo. Aquí tienes lo que requiere tu atención hoy.
        </p>
      </header>

      <section className="mb-20">
        <AdminSectionTitle title="Pendientes" />
        <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2">
          {pendingItems.map((item) => (
            <article
              key={item.title}
              className="flex min-h-80 flex-col items-start border border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-[var(--color-surface-container-lowest)] p-8 transition-colors hover:border-[var(--color-outline-variant)]"
            >
              <span className="text-display-lg mb-2 text-[var(--color-primary-container)]">{item.value}</span>
              <h3 className="text-headline-md mb-2 text-[var(--color-on-surface)]">{item.title}</h3>
              <p className="text-body-md mb-8 flex-grow text-[var(--color-secondary)]">{item.description}</p>
              <Link
                to={item.to}
                className="text-label-md flex items-center gap-3 bg-[var(--color-primary-container)] px-6 py-3 transition-colors hover:bg-[var(--color-primary)]"
              >
                <span className="text-[var(--color-on-primary)]">{item.action}</span>
                <item.icon className="text-[var(--color-on-primary)]" size={18} strokeWidth={1.8} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <AdminSectionTitle title="Resumen del sistema" />
        <div className="grid grid-cols-1 divide-y divide-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] border-y border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-container-lowest)] md:grid-cols-3 md:divide-x md:divide-y-0">
          {systemSummary.map((metric) => (
            <article key={metric.label} className="flex flex-col p-8">
              <span className="text-label-sm mb-4 uppercase tracking-[0.28em] text-[var(--color-secondary)]">
                {metric.label}
              </span>
              <span className="text-display-lg text-[var(--color-on-surface)]">{metric.value}</span>
            </article>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Link
            to="/admin/metricas-globales"
            className="text-label-md flex items-center gap-2 text-[var(--color-primary-container)] transition-colors hover:text-[var(--color-primary)]"
          >
            <span>Ver métricas globales</span>
            <ArrowRight size={18} strokeWidth={1.8} />
          </Link>
        </div>
      </section>

      <section>
        <AdminSectionTitle title="Accesos directos" />
        <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-3">
          {quickAccessTiles.map((tile) => (
            <Link
              key={tile.label}
              to={tile.to}
              className="group relative flex h-64 items-end overflow-hidden border border-transparent bg-[color-mix(in_srgb,var(--color-secondary)_10%,transparent)] p-6 transition-colors hover:border-[var(--color-outline-variant)]"
            >
              <img
                src={tile.image}
                alt={tile.alt}
                className="absolute inset-0 size-full object-cover opacity-40 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[color-mix(in_srgb,var(--color-on-surface)_70%,transparent)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-20 flex w-full items-center justify-between transition-colors duration-300 group-hover:text-[var(--color-surface)]">
                <h3 className="text-headline-md max-w-48 text-[var(--color-on-surface)] group-hover:text-[var(--color-surface)]">
                  {tile.label}
                </h3>
                <ArrowRight
                  size={22}
                  strokeWidth={1.8}
                  className="-translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

type AdminSectionTitleProps = {
  title: string
}

function AdminSectionTitle({ title }: AdminSectionTitleProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="text-headline-lg shrink-0 text-[var(--color-on-surface)]">{title}</h2>
      <div className="h-px flex-grow bg-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)]" />
    </div>
  )
}
