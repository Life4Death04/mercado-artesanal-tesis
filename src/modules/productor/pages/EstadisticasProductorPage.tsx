import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronDown, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import { SeleccionPeriodoModal } from '../componentes/SeleccionPeriodoModal'

type PeriodoTab = 'Semana' | 'Mes' | 'Trimestre' | 'Personalizado'

type KpiData = {
  ingresos: string
  ingresosTrend: string
  ingresosPositivo: boolean
  pedidos: string
  pedidosTrend: string
  pedidosPositivo: boolean
  ticket: string
  ticketTrend: string
  ticketPositivo: boolean
  xLabels: string[]
}

const KPI_POR_PERIODO: Record<Exclude<PeriodoTab, 'Personalizado'>, KpiData> = {
  Semana: {
    ingresos: '980,00EUR', ingresosTrend: '+3% vs sem. ant.', ingresosPositivo: true,
    pedidos: '36', pedidosTrend: '+1% vs sem. ant.', pedidosPositivo: true,
    ticket: '27,22EUR', ticketTrend: '-1% vs sem. ant.', ticketPositivo: false,
    xLabels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  },
  Mes: {
    ingresos: '4.250,00EUR', ingresosTrend: '+12% vs mes ant.', ingresosPositivo: true,
    pedidos: '156', pedidosTrend: '+5% vs mes ant.', pedidosPositivo: true,
    ticket: '27,24EUR', ticketTrend: '-2% vs mes ant.', ticketPositivo: false,
    xLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  },
  Trimestre: {
    ingresos: '12.800,00EUR', ingresosTrend: '+8% vs trim. ant.', ingresosPositivo: true,
    pedidos: '467', pedidosTrend: '+4% vs trim. ant.', pedidosPositivo: true,
    ticket: '27,41EUR', ticketTrend: '+1% vs trim. ant.', ticketPositivo: true,
    xLabels: ['Mes 1', 'Mes 2', 'Mes 3'],
  },
}

const PRODUCTOS_MAS_VENDIDOS = [
  {
    nombre: 'Aceite de Oliva Virgen Extra',
    tag: 'D.O. Alicante',
    total: '777EUR',
    uds: '42 uds',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiYMD2lDsO1Bd5vGQjwlt3XEAvhKZcDJaZXcWffyHWdRQ6hsggrDZAULkm-zeOgOlaavnXS-OfBFNQ3kyG-7ZLV23tCRyF7HRyMyMsW43KjMj565jVubjbbGvBiZSF7MxUeUumUpCz5iwK_ZbyFOEUsQIyMVcC3iD8zRHJ-MEgRXSzT0vcmFKnENKdDJGe2nbvctIrz5aht3DY4aOy5WFqWdwFBEOZx4C7X2ASfZFze-yWrsQfD4fDc0fOI-fDK_HRLG2RyTyVBwo',
  },
  {
    nombre: 'Turron de Jijona',
    tag: 'Artesanal',
    total: '490EUR',
    uds: '38 uds',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO7qYWBnf5WlRzHJ1s1lkT-dEhBZpyavFfYaKAaMhMSvmKMmax4bwKaKnNhxCXErKF7fnECCNNkAn4rc4r3LRCcgoX7dm4BF3hBOzb2OMLeGf5q2HHVv5bQd8dFy-dXxPBx92pP1tm_aBHQvL_XYqYZCBJt-yCRmoeQGiJr3D5Iwex7LYbtLX2nKb7LbkKlSvZuZfBgAAU_QBIBivVmvERxitz0wJ2K3Cg3zAeN26jLv5uaBJTwhzWr5PqGXGW76ZL7O5p3XZxJ5Q',
  },
  {
    nombre: 'Chocolate con Flor de Sal',
    tag: 'Organico',
    total: '315EUR',
    uds: '45 uds',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClFgF7C4iDfsj__t0otEgaIwHc-otFU5C76bPGT_gdcJv9b43IWVmPuuiURqXV-bVnoHyodxQENbuF2orniRCTyipKXYrK3vZLRcPlvniG8nvQy0_duEyFMZEgcSwt9ziuqRUdrqudqanurWhRBZr2vgMPgFqUQ-cdAq3dMV3xIpO3SJdONb4i0Ui7L-eom10IidbnHoKDVaDFUxQhRmR-5CzCOas6O5ikyV8ZOLB8Sa9G5cl8RFwCojVeIv-3hrNl0v2asDOB2V0',
  },
]

const PEDIDOS_RECIENTES = [
  { id: '#10425', cliente: 'Maria Lopez', total: '125,50EUR', status: 'Enviado' },
  { id: '#10426', cliente: 'Carlos Ruiz', total: '84,00EUR', status: 'Pendiente' },
  { id: '#10427', cliente: 'Elena Garcia', total: '210,75EUR', status: 'Entregado' },
  { id: '#10428', cliente: 'Javier Gomez', total: '45,00EUR', status: 'Enviado' },
]

type OrderStatus = 'Enviado' | 'Pendiente' | 'Entregado'

const STATUS_CLASS: Record<OrderStatus, string> = {
  Enviado: 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] border-[var(--color-outline-variant)]',
  Pendiente: 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] border-[var(--color-outline-variant)]',
  Entregado: 'bg-[var(--color-surface)] text-[var(--color-secondary)] border-[var(--color-outline-variant)]',
}

function formatRangeDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getPeriodoLabel(periodo: PeriodoTab, customStart: Date, customEnd: Date) {
  switch (periodo) {
    case 'Semana':
      return 'Ultimos 7 dias'
    case 'Mes':
      return 'Ultimo mes natural'
    case 'Trimestre':
      return 'Ultimos 3 meses'
    case 'Personalizado':
      return `${formatRangeDate(customStart)} - ${formatRangeDate(customEnd)}`
  }
}

function getPeriodoSubtitle(periodo: PeriodoTab) {
  switch (periodo) {
    case 'Semana':
      return 'Comparativa semanal de actividad y ventas.'
    case 'Mes':
      return 'Vista consolidada del rendimiento mensual.'
    case 'Trimestre':
      return 'Lectura extendida para detectar tendencias.'
    case 'Personalizado':
      return 'Rango ajustado manualmente para consultas puntuales.'
  }
}

export function EstadisticasProductorPage() {
  const [periodo, setPeriodo] = useState<PeriodoTab>('Mes')
  const [customStart, setCustomStart] = useState<Date>(new Date(2023, 8, 12))
  const [customEnd, setCustomEnd] = useState<Date>(new Date(2023, 9, 24))
  const [showPeriodoModal, setShowPeriodoModal] = useState(false)

  const kpi = periodo === 'Personalizado' ? KPI_POR_PERIODO.Mes : KPI_POR_PERIODO[periodo]
  const periodoLabel = getPeriodoLabel(periodo, customStart, customEnd)
  const periodoSubtitle = getPeriodoSubtitle(periodo)

  function handlePeriodoTab(tab: PeriodoTab) {
    if (tab === 'Personalizado') {
      setShowPeriodoModal(true)
      return
    }

    setPeriodo(tab)
  }

  function handleApplyPeriodo(start: Date, end: Date) {
    setCustomStart(start)
    setCustomEnd(end)
    setPeriodo('Personalizado')
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]">
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">Area Productor</Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Estadisticas</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Estadisticas</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Consulta el rendimiento comercial de tu tienda con una referencia temporal clara para cada metrica y tendencia mostrada.
              </p>
            </div>

            <div className="inline-flex w-full max-w-full flex-wrap border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-surface-container-low)] p-1 sm:w-auto">
              {(['Semana', 'Mes', 'Trimestre', 'Personalizado'] as PeriodoTab[]).map((tab) => {
                const isActive = periodo === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handlePeriodoTab(tab)}
                    className={`text-label-md flex items-center gap-1 px-4 py-3 transition-colors ${isActive ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                  >
                    {tab}
                    {tab === 'Personalizado' && <ChevronDown size={16} strokeWidth={1.8} />}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6">
            <p className="text-label-sm mb-2 uppercase tracking-[0.18em] text-[var(--color-secondary)]">Periodo seleccionado</p>
            <h2 className="text-headline-md text-[var(--color-on-surface)]">{periodo}</h2>
            <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">{periodoSubtitle}</p>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6">
            <div className="mb-3 flex items-center gap-3 text-[var(--color-primary)]">
              <CalendarDays size={20} strokeWidth={1.8} />
              <p className="text-label-sm uppercase tracking-[0.18em] text-[var(--color-secondary)]">Rango consultado</p>
            </div>
            <h2 className="text-headline-md text-[var(--color-on-surface)]">{periodoLabel}</h2>
            <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
              Esta referencia temporal aplica a indicadores, grafico y listados de apoyo.
            </p>
          </article>
        </section>

        <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Indicadores clave">
          <KpiCard label="Ingresos" value={kpi.ingresos} trend={kpi.ingresosTrend} positive={kpi.ingresosPositivo} />
          <KpiCard label="Pedidos" value={kpi.pedidos} trend={kpi.pedidosTrend} positive={kpi.pedidosPositivo} />
          <KpiCard label="Ticket medio" value={kpi.ticket} trend={kpi.ticketTrend} positive={kpi.ticketPositivo} />
        </section>

        <section className="mb-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Evolucion de ventas</h2>
            <p className="text-label-md text-[var(--color-secondary)]">Datos visualizados para: {periodoLabel}</p>
          </div>
          <div className="relative flex h-96 items-center justify-center border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-8 py-8 opacity-30">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-0 w-full border-b border-[var(--color-outline-variant)]" />
              ))}
            </div>

            <svg className="z-10 h-full w-full text-[var(--color-primary-container)]" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-label="Grafico de evolucion de ventas">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon fill="url(#chartGradient)" points="0,300 0,220 100,190 200,240 300,150 400,180 500,120 600,140 700,90 800,110 900,50 1000,70 1000,300" />
              <polyline fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points="0,220 100,190 200,240 300,150 400,180 500,120 600,140 700,90 800,110 900,50 1000,70" />
              <circle cx="300" cy="150" r="4" fill="currentColor" className="cursor-pointer" />
              <circle cx="700" cy="90" r="4" fill="currentColor" className="cursor-pointer" />
              <circle cx="900" cy="50" r="4" fill="currentColor" className="cursor-pointer" />
            </svg>

            <div className="text-label-sm absolute bottom-2 left-0 flex w-full justify-between px-8 text-[var(--color-secondary)]">
              {kpi.xLabels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Productos mas vendidos</h3>
              <Link to="/productor/productos" className="text-label-md text-[var(--color-primary)] hover:underline">Ver catalogo</Link>
            </div>
            <ul className="flex flex-col">
              {PRODUCTOS_MAS_VENDIDOS.map((producto) => (
                <li key={producto.nombre} className="-mx-2 flex items-center justify-between gap-4 border-b border-[var(--color-outline-variant)] px-2 py-5 transition-colors hover:bg-[var(--color-surface-container-low)]">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="size-14 overflow-hidden border border-[var(--color-outline-variant)] bg-[var(--color-surface-variant)]">
                      <img src={producto.imagen} alt={producto.nombre} className="size-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-body-lg mb-1 block text-[var(--color-on-surface)]">{producto.nombre}</span>
                      <span className="text-label-sm rounded-sm bg-[var(--color-surface-container-high)] px-2 py-0.5 text-[var(--color-secondary)]">{producto.tag}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-body-md block text-[var(--color-on-surface)]">{producto.total}</span>
                    <span className="text-label-sm text-[var(--color-secondary)]">{producto.uds}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Pedidos recientes</h3>
              <Link to="/productor/pedidos" className="text-label-md text-[var(--color-primary)] hover:underline">Ver todos</Link>
            </div>
            <ul className="flex flex-col">
              {PEDIDOS_RECIENTES.map((pedido) => (
                <li key={pedido.id} className="-mx-2 flex items-center justify-between gap-4 border-b border-[var(--color-outline-variant)] px-2 py-5 transition-colors hover:bg-[var(--color-surface-container-low)]">
                  <div>
                    <span className="text-label-sm mb-1 block tracking-wider text-[var(--color-secondary)]">{pedido.id}</span>
                    <span className="text-body-lg block text-[var(--color-on-surface)]">{pedido.cliente}</span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-body-md text-[var(--color-on-surface)]">{pedido.total}</span>
                    <span className={`text-label-sm min-w-[90px] rounded-full border px-3 py-1 text-center ${STATUS_CLASS[pedido.status as OrderStatus]}`}>{pedido.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {showPeriodoModal ? (
        <SeleccionPeriodoModal
          initialStart={customStart}
          initialEnd={customEnd}
          onClose={() => setShowPeriodoModal(false)}
          onApply={handleApplyPeriodo}
        />
      ) : null}
    </div>
  )
}

function KpiCard({ label, value, trend, positive }: { label: string; value: string; trend: string; positive: boolean }) {
  return (
    <div className="flex flex-col border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-8 transition-colors duration-300 hover:bg-[var(--color-surface-container-low)]">
      <span className="text-label-sm mb-4 uppercase tracking-[0.1em] text-[var(--color-secondary)]">{label}</span>
      <span className="text-headline-md mb-3 text-[var(--color-on-surface)]">{value}</span>
      <div className="flex items-center gap-2">
        {positive ? (
          <TrendingUp size={16} strokeWidth={1.8} className="text-[var(--color-primary-container)]" />
        ) : (
          <TrendingDown size={16} strokeWidth={1.8} className="text-[var(--color-outline)]" />
        )}
        <span className={`text-body-md ${positive ? 'text-[var(--color-primary-container)]' : 'text-[var(--color-secondary)]'}`}>
          {trend}
        </span>
      </div>
    </div>
  )
}
