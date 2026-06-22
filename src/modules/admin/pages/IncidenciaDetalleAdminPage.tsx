import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, FileText } from 'lucide-react'
import { IncidentResolutionModal } from '../componentes/IncidentResolutionModal'

const incident = {
  id: '#INC-2841',
  type: 'Reclamación',
  status: 'En revisión',
  description:
    'El cliente reporta que el pedido de trufas blancas frescas llegó en mal estado debido a un retraso en la cadena de frío durante el transporte. El embalaje térmico estaba dañado y el producto presenta un olor inusual. Se solicita un reembolso completo o un reemplazo inmediato, ya que era para un evento corporativo de alto nivel programado para mañana.',
  relatedCase: {
    order: 'Pedido #ORD-992A',
    product: 'Selección de Trufas Blancas Frescas (250g)',
    details: 'Valor: €450.00 • Entregado: 12 Nov 2023',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8nSsKTfu26CRaZfMTwZN5T0dkyL4NuqeZSfySd1jgALfUoU0EcPuhNELyBSz2fPqavCmEl8QrGe6xHuuqyEGa3sL1Q62lBXvSM_BAlJ-iimd9QuK38e-jBNomvsDGLhCgKEJ-_9M28dW7jj57bq6uT42RBRMWRDuHJjRvkheCY5zZU7xJbjNrBopItzS6UQR4mjendm3tLfIbuJDZHY2QFKAI2C4OjGooCYUxJMTcPZlwy5Xfex4Y-2FTj8WZBxpQdSv4mlmC0yzd',
  },
  evidence: [
    {
      alt: 'Caja térmica dañada durante el envío',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2rnXWP6xTeTIc0UuUwv3QptAcQA-sra2ZY-Fx2Eo_m28pdiQOXKQ8l1EhsSIeUgZnpDXciwPt8tkFA6rpMbNk_yj4zjStPKt0878UZ1HVZAx4jV9nD-4mKEuRstow1dCnTKTrjB9oP54AY1ZBorTrFC3H-tskfijy5UHt0KMJiTdLJiohqDl8uZX1VMl9txDEDGTKyZE4d2vIzHaJ5tuGWJNaXgpv6GRUn-lXymdPHGl2aPXoJRPMTLzlVAvbV-mQ1VkKy9LXnrdk',
    },
    {
      alt: 'Trufas blancas con evidencia de deterioro',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAenDnh6Vn3GRXUGeXnOvY38MZPjMpCtIut9-TogySslwRBSjFvVE7g-ZeAXeZwRJYv6T52eLKlj2HSdpg7RsLESNbXiy1YacuCMGpOVfZqj8x4HV9zlc96LYdzHDFX3t5CrKdVuDIOG1chtZlYsFgqu7rVglDlws3LrElTRJUUdvWeS1UCyBXdfr-WVz8o7pS-fpDoJLuaA3lm2tMyfo0Bbkqe0UIuP8nXIY83kjBICQGQya3Hs-Mia52b_VFSZTnRVKbmMmbsEExt',
    },
  ],
  users: [
    {
      role: 'Reportante (Comprador)',
      initials: 'EL',
      name: 'Elena Rossi',
      email: 'elena.rossi@example.com',
      action: 'Ver detalle de cliente',
    },
    {
      role: 'Reportado (Artesano)',
      initials: 'FT',
      name: 'Finca Tartufi',
      email: 'contacto@fincatartufi.it',
      action: 'Ver perfil de vendedor',
    },
  ],
  history: [
    {
      date: '14 Nov 2023, 10:30 AM',
      event: 'Estado cambiado a En revisión',
      detail: 'Por Admin Moderación',
      active: true,
    },
    {
      date: '13 Nov 2023, 04:15 PM',
      event: 'Evidencia fotográfica añadida',
      detail: 'Por Elena Rossi',
      active: false,
    },
    {
      date: '13 Nov 2023, 04:10 PM',
      event: 'Incidencia creada',
      detail: 'Motivo: Problema de envío/calidad',
      active: false,
    },
  ],
}

export function IncidenciaDetalleAdminPage() {
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false)

  return (
    <>
      <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
        <header className="mb-12">
          <Link
            to="/admin/incidencias"
            className="text-label-md mb-6 inline-flex items-center gap-2 uppercase text-[var(--color-secondary)] transition-colors hover:text-[var(--color-on-surface)]"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
            Volver al listado
          </Link>

          <div className="flex flex-col gap-6 border-b border-[color-mix(in_srgb,var(--color-secondary)_40%,transparent)] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-label-sm mb-2 block uppercase tracking-widest text-[var(--color-outline)]">
                {incident.type}
              </span>
              <h1 className="text-display-lg text-[var(--color-primary)]">{incident.id}</h1>
            </div>
            <span className="text-label-sm w-fit rounded-full bg-[var(--color-secondary-container)] px-4 py-1.5 uppercase tracking-wide text-[var(--color-on-secondary-container)]">
              {incident.status}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <main className="flex flex-col gap-12 lg:col-span-8">
            <section>
              <h2 className="text-headline-md mb-4 text-[var(--color-on-surface)]">Descripción del problema</h2>
              <p className="text-body-lg max-w-4xl leading-relaxed text-[var(--color-on-surface-variant)]">
                {incident.description}
              </p>
            </section>

            <section>
              <h2 className="text-headline-md mb-4 text-[var(--color-on-surface)]">Caso Relacionado</h2>
              <Link
                to="/admin/pedidos"
                className="group flex flex-col gap-5 border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-bright)] p-4 transition-colors hover:border-[var(--color-on-surface)] sm:flex-row sm:items-center"
              >
                <img
                  src={incident.relatedCase.imageUrl}
                  alt="Trufas blancas frescas en una caja gourmet"
                  className="size-24 shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-label-sm mb-1 block uppercase tracking-widest text-[var(--color-outline)]">
                    {incident.relatedCase.order}
                  </span>
                  <h3 className="text-body-md font-semibold text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary-container)]">
                    {incident.relatedCase.product}
                  </h3>
                  <p className="text-body-md mt-1 text-[var(--color-secondary)]">{incident.relatedCase.details}</p>
                </div>
                <ChevronRight
                  size={22}
                  strokeWidth={1.8}
                  className="hidden text-[var(--color-secondary)] transition-colors group-hover:text-[var(--color-on-surface)] sm:block"
                />
              </Link>
            </section>

            <section>
              <h2 className="text-headline-md mb-4 text-[var(--color-on-surface)]">Evidencia Adjunta</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {incident.evidence.map((item) => (
                  <button key={item.url} type="button" className="group relative shrink-0 cursor-pointer">
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="size-48 border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] object-cover"
                    />
                    <span className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] transition-colors group-hover:bg-transparent" />
                  </button>
                ))}
                <button
                  type="button"
                  className="flex size-48 shrink-0 flex-col items-center justify-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-container-low)] text-[var(--color-secondary)] transition-colors hover:border-[var(--color-on-surface)] hover:text-[var(--color-on-surface)]"
                >
                  <FileText size={34} strokeWidth={1.7} className="mb-2" />
                  <span className="text-label-sm uppercase tracking-wide">Recibo_PDF</span>
                </button>
              </div>
            </section>
          </main>

          <aside className="flex flex-col gap-10 lg:col-span-4">
            <section className="border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-bright)] p-6">
              <h2 className="text-headline-md mb-6 text-[var(--color-on-surface)]">Usuarios Implicados</h2>
              <div className="divide-y divide-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)]">
                {incident.users.map((user) => (
                  <article key={user.email} className="py-6 first:pt-0 last:pb-0">
                    <span className="text-label-sm mb-3 block uppercase tracking-widest text-[var(--color-outline)]">
                      {user.role}
                    </span>
                    <div className="flex items-start gap-4">
                      <div className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-xl)] bg-[var(--color-surface-container)] font-bold text-[var(--color-primary)]">
                        {user.initials}
                      </div>
                      <div>
                        <h3 className="text-body-md font-semibold text-[var(--color-on-surface)]">{user.name}</h3>
                        <p className="text-body-md text-[var(--color-secondary)]">{user.email}</p>
                        <Link
                          to="/admin/usuarios"
                          className="text-label-sm mt-2 inline-block uppercase tracking-wide text-[var(--color-primary-container)] hover:underline"
                        >
                          {user.action}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-bright)] p-6">
              <h2 className="text-headline-md mb-6 text-[var(--color-on-surface)]">Historial</h2>
              <div className="relative ml-3 space-y-6 border-l border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)]">
                {incident.history.map((item) => (
                  <article key={item.date} className="relative pl-6">
                    <span
                      className={`absolute top-1 -left-[5px] size-2.5 rounded-full ring-4 ring-[var(--color-surface-bright)] ${
                        item.active ? 'bg-[var(--color-primary-container)]' : 'bg-[var(--color-outline)]'
                      }`}
                    />
                    <span className="text-label-sm mb-1 block text-[var(--color-outline)]">{item.date}</span>
                    <p className="text-body-md text-[var(--color-on-surface)]">{item.event}</p>
                    <p className="text-body-md mt-1 text-[var(--color-secondary)]">{item.detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsResolutionModalOpen(true)}
                className="text-label-md w-full bg-[var(--color-primary-container)] px-6 py-4 text-center uppercase tracking-widest text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
              >
                Registrar solución
              </button>
              <button
                type="button"
                className="text-label-md w-full border border-[var(--color-on-surface)] bg-transparent px-6 py-4 text-center uppercase tracking-widest text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container)]"
              >
                Cerrar sin acción
              </button>
              <button
                type="button"
                className="text-label-md mt-4 w-full px-6 py-4 text-center uppercase tracking-widest text-[var(--color-error)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-error-container)_35%,transparent)]"
              >
                Desactivar cuenta del reportado
              </button>
            </section>
          </aside>
        </div>
      </div>

      {isResolutionModalOpen && <IncidentResolutionModal onClose={() => setIsResolutionModalOpen(false)} />}
    </>
  )
}
