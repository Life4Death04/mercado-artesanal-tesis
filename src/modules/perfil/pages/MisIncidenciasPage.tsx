import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Flag, Globe, Package, Share2 } from 'lucide-react'
import { ReportarIncidenciaModal } from '../componentes/IncidenciaModals'

type IncidenciaStatus = 'En revisión' | 'Resuelta' | 'Abierta' | 'Cerrada'

type Incidencia = {
  id: string
  titulo: string
  pedidoRef: string
  fecha: string
  status: IncidenciaStatus
  descripcion: string
  resolucion?: {
    texto: string
    fecha: string
  }
  acciones: Array<'comentario' | 'verPedido' | 'cerrar'>
}

const incidencias: Incidencia[] = [
  {
    id: 'INC-001',
    titulo: 'Retraso en la entrega',
    pedidoRef: '#AG-8821',
    fecha: '12/05/2024',
    status: 'En revisión',
    descripcion:
      'El pedido debería haber llegado hace dos días según el seguimiento proporcionado. No he recibido ninguna actualización por parte de la empresa de transporte.',
    acciones: ['comentario', 'verPedido'],
  },
  {
    id: 'INC-002',
    titulo: 'Producto defectuoso',
    pedidoRef: '#AG-7540',
    fecha: '15/04/2024',
    status: 'Resuelta',
    descripcion:
      'Una de las botellas de aceite de oliva virgen extra llegó con el precinto roto y goteando. Adjunto fotos del embalaje dañado.',
    resolucion: {
      texto:
        '"Hemos procedido al reembolso íntegro del producto. Lamentamos las molestias. Como gesto de buena voluntad, hemos añadido 50 puntos de fidelidad a su cuenta."',
      fecha: 'Finalizado el 16/04/2024',
    },
    acciones: ['verPedido', 'cerrar'],
  },
  {
    id: 'INC-003',
    titulo: 'Error en entrega',
    pedidoRef: '#AG-9012',
    fecha: '20/05/2024',
    status: 'Abierta',
    descripcion:
      'He recibido una selección de quesos diferente a la que pedí. Falta el queso de cabra artesano de la Marina Alta.',
    acciones: ['comentario', 'cerrar'],
  },
]

const filtros: Array<IncidenciaStatus | 'Todas'> = ['Todas', 'Abierta', 'En revisión', 'Resuelta', 'Cerrada']

function statusBadgeClass(status: IncidenciaStatus): string {
  switch (status) {
    case 'En revisión':
      return 'bg-[var(--color-secondary-fixed)] text-[var(--color-on-secondary-fixed)]'
    case 'Resuelta':
      return 'bg-green-100 text-green-800'
    case 'Abierta':
      return 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]'
    case 'Cerrada':
      return 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
  }
}

export function MisIncidenciasPage() {
  const [filtroActivo, setFiltroActivo] = useState<IncidenciaStatus | 'Todas'>('Todas')
  const [showModal, setShowModal] = useState(false)

  const incidenciasFiltradas =
    filtroActivo === 'Todas'
      ? incidencias
      : incidencias.filter((i) => i.status === filtroActivo)

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[var(--color-on-background)]">
      <main className="mx-auto min-h-screen max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)]">
        {/* Page header */}
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <nav className="text-label-md mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/60">
              <Link to="/perfil" className="transition-colors hover:text-[#7A2E3A]">Mi Cuenta</Link>
              <ChevronRight size={14} strokeWidth={1.8} />
              <span className="text-[var(--color-on-surface)]">Mis incidencias</span>
            </nav>
            <h1 className="text-headline-lg text-[var(--color-on-background)]">Mis incidencias</h1>
            <p className="text-body-md mt-4 leading-relaxed text-[var(--color-on-surface-variant)]">
              Gestiona tus reportes y consultas sobre pedidos. Nuestro equipo de atención artesanal
              revisará cada caso para garantizar tu satisfacción mediterránea.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-label-md flex items-center gap-3 bg-[#7A2E3A] px-8 py-4 uppercase tracking-widest text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            <Flag size={20} strokeWidth={1.6} />
            Reportar incidencia
          </button>
        </header>

        {/* Filter bar */}
        <section className="mb-10 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pb-6">
          <div className="flex flex-wrap gap-3">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                type="button"
                onClick={() => setFiltroActivo(filtro)}
                className={`text-label-md border px-5 py-2 transition-all ${
                  filtroActivo === filtro
                    ? 'border-[#7A2E3A] bg-[#7A2E3A] text-white'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[#7A2E3A]'
                }`}
              >
                {filtro}
              </button>
            ))}
          </div>
        </section>

        {/* Incidents list */}
        <div className="space-y-8">
          {incidenciasFiltradas.map((incidencia) => (
            <IncidenciaCard key={incidencia.id} incidencia={incidencia} />
          ))}
        </div>

        <IncidenciasPagination />
      </main>

      <IncidenciasFooter />

      {showModal ? <ReportarIncidenciaModal onClose={() => setShowModal(false)} /> : null}
    </div>
  )
}

function IncidenciaCard({ incidencia }: { incidencia: Incidencia }) {
  const esResuelta = incidencia.status === 'Resuelta'

  return (
    <article className="border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_10px_30px_-15px_rgba(122,46,58,0.08)] transition-transform hover:-translate-y-0.5 md:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        {/* Left: content */}
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <span className={`text-label-sm px-3 py-1 uppercase tracking-wider ${statusBadgeClass(incidencia.status)}`}>
              {incidencia.status}
            </span>
            <span className="text-label-md text-[var(--color-on-surface-variant)]">{incidencia.fecha}</span>
          </div>

          <h2 className="text-headline-md mb-2 text-[24px] text-[var(--color-on-surface)]">{incidencia.titulo}</h2>

          <Link
            to="/pedidos"
            className="text-label-md mb-6 inline-flex items-center gap-2 text-[#7A2E3A] transition-colors hover:underline"
          >
            <Package size={18} strokeWidth={1.6} />
            Pedido {incidencia.pedidoRef}
          </Link>

          <p className="text-body-md mb-8 max-w-3xl text-[var(--color-on-surface-variant)]">
            {incidencia.descripcion}
          </p>

          {incidencia.resolucion ? (
            <div className="relative mb-8 overflow-hidden border-l-4 border-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary-container)_20%,transparent)] p-6">
              <h4 className="text-label-md mb-3 uppercase tracking-widest text-[var(--color-secondary)]">
                Resolución del equipo
              </h4>
              <p className="text-body-md italic leading-relaxed text-[var(--color-on-secondary-container)]">
                {incidencia.resolucion.texto}
              </p>
              <p className="text-label-sm mt-4 text-[var(--color-on-surface-variant)]">
                {incidencia.resolucion.fecha}
              </p>
            </div>
          ) : null}
        </div>

        {/* Right: actions */}
        <div className="flex gap-4 self-start md:flex-col md:justify-end">
          {incidencia.acciones.includes('comentario') && (
            <button
              type="button"
              className="text-label-md border border-[var(--color-outline)] px-6 py-3 transition-colors hover:bg-[var(--color-surface-variant)]"
            >
              Añadir comentario
            </button>
          )}
          {incidencia.acciones.includes('verPedido') && (
            <Link
              to="/pedidos"
              className="text-label-md inline-block border border-[var(--color-outline)] px-6 py-3 text-center transition-colors hover:bg-[var(--color-surface-variant)]"
            >
              Ver pedido
            </Link>
          )}
          {incidencia.acciones.includes('cerrar') && (
            <button
              type="button"
              disabled={esResuelta}
              className={`text-label-md border px-6 py-3 transition-colors ${
                esResuelta
                  ? 'cursor-not-allowed border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] text-[var(--color-on-surface-variant)]/40'
                  : 'border-[var(--color-outline)] bg-[var(--color-outline)] text-white hover:bg-[var(--color-on-surface-variant)]'
              }`}
            >
              Cerrar incidencia
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function IncidenciasPagination() {
  return (
    <nav className="mt-16 flex items-center justify-center gap-4 pb-12" aria-label="Paginación de incidencias">
      <button
        type="button"
        className="flex size-10 items-center justify-center border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-all hover:border-[#7A2E3A] hover:text-[#7A2E3A]"
      >
        <ChevronLeft size={18} strokeWidth={1.8} />
      </button>
      <div className="flex gap-2">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            type="button"
            className={`text-label-md flex size-10 items-center justify-center transition-all ${
              page === 1
                ? 'bg-[#7A2E3A] text-white'
                : 'border border-[var(--color-outline-variant)] hover:border-[#7A2E3A] hover:text-[#7A2E3A]'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="flex size-10 items-center justify-center border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-all hover:border-[#7A2E3A] hover:text-[#7A2E3A]"
      >
        <ChevronRight size={18} strokeWidth={1.8} />
      </button>
    </nav>
  )
}

function IncidenciasFooter() {
  return (
    <footer className="w-full border-t border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-low)] py-16">
      <div className="mx-auto grid max-w-[var(--layout-container-max)] grid-cols-1 gap-[var(--space-gutter)] px-[var(--space-margin-mobile)] md:grid-cols-4 md:px-[var(--space-margin-desktop)]">
        <div className="col-span-1 space-y-6 md:col-span-2">
          <span className="text-headline-md block text-[var(--color-primary)]">ALICANTE GOURMET</span>
          <p className="text-body-md max-w-sm text-[var(--color-on-surface-variant)]">
            Celebrando la herencia culinaria del Mediterráneo a través de una curaduría excepcional de productos locales y artesanos.
          </p>
          <p className="text-label-md text-[var(--color-on-surface-variant)] opacity-70">
            © 2024 Alicante Gourmet. Handcrafted in the Mediterranean.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-label-md mb-2 uppercase tracking-widest text-[var(--color-primary)]">Compañía</h4>
          {['Sustainability', 'Producers', 'Shipping', 'Returns'].map((link) => (
            <a key={link} href="#" className="text-body-md text-[var(--color-on-surface-variant)] transition-all hover:text-[var(--color-primary)]">
              {link}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-label-md mb-2 uppercase tracking-widest text-[var(--color-primary)]">Legal & Contacto</h4>
          {['Contact', 'Privacy', 'Terms'].map((link) => (
            <a key={link} href="#" className="text-body-md text-[var(--color-on-surface-variant)] transition-all hover:text-[var(--color-primary)]">
              {link}
            </a>
          ))}
          <div className="mt-4 flex gap-4">
            <Globe size={20} strokeWidth={1.8} className="cursor-pointer text-[var(--color-primary)] opacity-80 transition-opacity hover:opacity-100" />
            <Share2 size={20} strokeWidth={1.8} className="cursor-pointer text-[var(--color-primary)] opacity-80 transition-opacity hover:opacity-100" />
          </div>
        </div>
      </div>
    </footer>
  )
}
