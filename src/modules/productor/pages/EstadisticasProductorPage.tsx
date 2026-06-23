import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, BookOpen, Download, HelpCircle, LogOut, Package, ShoppingBag, TrendingDown, TrendingUp, Truck, User } from 'lucide-react'
import { SeleccionPeriodoModal } from '../componentes/SeleccionPeriodoModal'

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

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
    ingresos: '980,00€', ingresosTrend: '+3% vs sem. ant.', ingresosPositivo: true,
    pedidos: '36', pedidosTrend: '+1% vs sem. ant.', pedidosPositivo: true,
    ticket: '27,22€', ticketTrend: '-1% vs sem. ant.', ticketPositivo: false,
    xLabels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  },
  Mes: {
    ingresos: '4.250,00€', ingresosTrend: '+12% vs mes ant.', ingresosPositivo: true,
    pedidos: '156', pedidosTrend: '+5% vs mes ant.', pedidosPositivo: true,
    ticket: '27,24€', ticketTrend: '-2% vs mes ant.', ticketPositivo: false,
    xLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  },
  Trimestre: {
    ingresos: '12.800,00€', ingresosTrend: '+8% vs trim. ant.', ingresosPositivo: true,
    pedidos: '467', pedidosTrend: '+4% vs trim. ant.', pedidosPositivo: true,
    ticket: '27,41€', ticketTrend: '+1% vs trim. ant.', ticketPositivo: true,
    xLabels: ['Mes 1', 'Mes 2', 'Mes 3'],
  },
}

const PRODUCTOS_MAS_VENDIDOS = [
  {
    nombre: 'Aceite de Oliva Virgen Extra',
    tag: 'D.O. Alicante',
    total: '777€',
    uds: '42 uds',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiYMD2lDsO1Bd5vGQjwlt3XEAvhKZcDJaZXcWffyHWdRQ6hsggrDZAULkm-zeOgOlaavnXS-OfBFNQ3kyG-7ZLV23tCRyF7HRyMyMsW43KjMj565jVubjbbGvBiZSF7MxUeUumUpCz5iwK_ZbyFOEUsQIyMVcC3iD8zRHJ-MEgRXSzT0vcmFKnENKdDJGe2nbvctIrz5aht3DY4aOy5WFqWdwFBEOZx4C7X2ASfZFze-yWrsQfD4fDc0fOI-fDK_HRLG2RyTyVBwo',
  },
  {
    nombre: 'Turrón de Jijona',
    tag: 'Artesanal',
    total: '490€',
    uds: '38 uds',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO7qYWBnf5WlRzHJ1s1lkT-dEhBZpyavFfYaKAaMhMSvmKMmax4bwKaKnNhxCXErKF7fnECCNNkAn4rc4r3LRCcgoX7dm4BF3hBOzb2OMLeGf5q2HHVv5bQd8dFy-dXxPBx92pP1tm_aBHQvL_XYqYZCBJt-yCRmoeQGiJr3D5Iwex7LYbtLX2nKb7LbkKlSvZuZfBgAAU_QBIBivVmvERxitz0wJ2K3Cg3zAeN26jLv5uaBJTwhzWr5PqGXGW76ZL7O5p3XZxJ5Q',
  },
  {
    nombre: 'Chocolate con Flor de Sal',
    tag: 'Orgánico',
    total: '315€',
    uds: '45 uds',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClFgF7C4iDfsj__t0otEgaIwHc-otFU5C76bPGT_gdcJv9b43IWVmPuuiURqXV-bVnoHyodxQENbuF2orniRCTyipKXYrK3vZLRcPlvniG8nvQy0_duEyFMZEgcSwt9ziuqRUdrqudqanurWhRBZr2vgMPgFqUQ-cdAq3dMV3xIpO3SJdONb4i0Ui7L-eom10IidbnHoKDVaDFUxQhRmR-5CzCOas6O5ikyV8ZOLB8Sa9G5cl8RFwCojVeIv-3hrNl0v2asDOB2V0',
  },
]

const PEDIDOS_RECIENTES = [
  { id: '#10425', cliente: 'María López', total: '125,50€', status: 'Enviado' },
  { id: '#10426', cliente: 'Carlos Ruiz', total: '84,00€', status: 'Pendiente' },
  { id: '#10427', cliente: 'Elena García', total: '210,75€', status: 'Entregado' },
  { id: '#10428', cliente: 'Javier Gómez', total: '45,00€', status: 'Enviado' },
]

type OrderStatus = 'Enviado' | 'Pendiente' | 'Entregado'

const STATUS_CLASS: Record<OrderStatus, string> = {
  Enviado: 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] border-[var(--color-outline-variant)]',
  Pendiente: 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] border-[var(--color-outline-variant)]',
  Entregado: 'bg-[var(--color-surface)] text-[var(--color-secondary)] border-[var(--color-outline-variant)]',
}

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Mis pedidos', to: '/productor/pedidos', active: false },
  { icon: BookOpen, label: 'Mi catálogo', to: '/productor/productos', active: false },
  { icon: Package, label: 'Inventario', to: '/productor/inventario', active: false },
  { icon: BarChart2, label: 'Estadísticas', to: '/productor/estadisticas', active: true },
  { icon: Truck, label: 'Configuración de entregas', to: '/productor/entregas', active: false },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function EstadisticasProductorPage() {
  const [periodo, setPeriodo] = useState<PeriodoTab>('Mes')
  const [customStart, setCustomStart] = useState<Date>(new Date(2023, 8, 12))
  const [customEnd, setCustomEnd] = useState<Date>(new Date(2023, 9, 24))
  const [showPeriodoModal, setShowPeriodoModal] = useState(false)

  const kpi = periodo === 'Personalizado' ? KPI_POR_PERIODO['Mes'] : KPI_POR_PERIODO[periodo]

  function handlePeriodoTab(tab: PeriodoTab) {
    if (tab === 'Personalizado') {
      setShowPeriodoModal(true)
    } else {
      setPeriodo(tab)
    }
  }

  function handleApplyPeriodo(start: Date, end: Date) {
    setCustomStart(start)
    setCustomEnd(end)
    setPeriodo('Personalizado')
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-4 lg:flex">
        {/* Producer identity */}
        <div className="mb-12 mt-4 px-2">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)]">
              <User size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
            </div>
            <Link to="/" className="text-display-lg text-xl leading-none text-[var(--color-primary)]">
              Finca Alicante
            </Link>
          </div>
          <p className="text-label-sm text-[var(--color-secondary)]">Artisanal Member since 2022</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 transition-all duration-200 ${active ? 'bg-[var(--color-primary-container)] font-bold text-[var(--color-on-primary-container)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-primary)]'}`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.8} />
              <span className="text-label-md">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto space-y-4 pt-8">
          <button type="button" className="text-label-md flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-4 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-on-primary-fixed-variant)]">
            <Download size={16} strokeWidth={1.8} />
            Export CSV
          </button>
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-primary)]">
              <HelpCircle size={20} strokeWidth={1.8} />
              <span className="text-label-md">Help Center</span>
            </a>
            <a href="#" className="flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-primary)]">
              <LogOut size={20} strokeWidth={1.8} />
              <span className="text-label-md">Log Out</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] flex-1 px-[var(--space-margin-mobile)] py-12 lg:ml-64 lg:px-[var(--space-margin-desktop)]">
        {/* Header + period tabs */}
        <header className="mb-16 flex flex-col justify-between border-b border-[var(--color-outline-variant)] pb-6 md:flex-row md:items-end md:pb-0">
          <h1 className="text-headline-md mb-6 text-[var(--color-on-surface)] md:mb-4 md:pb-2">Estadísticas</h1>

          <nav className="flex space-x-1 overflow-x-auto" aria-label="Período de consulta">
            {(['Semana', 'Mes', 'Trimestre', 'Personalizado'] as PeriodoTab[]).map((tab) => {
              const isActive = periodo === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handlePeriodoTab(tab)}
                  className={`text-label-md whitespace-nowrap px-4 py-3 transition-colors ${isActive ? 'border-b-[3px] border-[var(--color-primary)] pb-2 text-[var(--color-primary)]' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'}`}
                >
                  {tab === 'Personalizado' && periodo === 'Personalizado'
                    ? `${customStart.getDate()}/${customStart.getMonth() + 1} — ${customEnd.getDate()}/${customEnd.getMonth() + 1}`
                    : tab}
                </button>
              )
            })}
          </nav>
        </header>

        {/* KPI Cards */}
        <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Indicadores clave">
          <KpiCard label="Ingresos" value={kpi.ingresos} trend={kpi.ingresosTrend} positive={kpi.ingresosPositivo} />
          <KpiCard label="Pedidos" value={kpi.pedidos} trend={kpi.pedidosTrend} positive={kpi.pedidosPositivo} />
          <KpiCard label="Ticket medio" value={kpi.ticket} trend={kpi.ticketTrend} positive={kpi.ticketPositivo} />
        </section>

        {/* Sales chart */}
        <section className="mb-16">
          <h2 className="text-headline-md mb-8 text-[24px] text-[var(--color-on-surface)]">Evolución de ventas</h2>
          <div className="relative flex h-96 items-center justify-center border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 md:p-8">
            {/* Grid lines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-8 py-8 opacity-30">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-0 w-full border-b border-[var(--color-outline-variant)]" />
              ))}
            </div>

            {/* SVG line chart */}
            <svg
              className="z-10 h-full w-full text-[var(--color-primary-container)]"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
              aria-label="Gráfico de evolución de ventas"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#chartGradient)"
                points="0,300 0,220 100,190 200,240 300,150 400,180 500,120 600,140 700,90 800,110 900,50 1000,70 1000,300"
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,220 100,190 200,240 300,150 400,180 500,120 600,140 700,90 800,110 900,50 1000,70"
              />
              <circle cx="300" cy="150" r="4" fill="currentColor" className="cursor-pointer" />
              <circle cx="700" cy="90" r="4" fill="currentColor" className="cursor-pointer" />
              <circle cx="900" cy="50" r="4" fill="currentColor" className="cursor-pointer" />
            </svg>

            {/* X-axis labels */}
            <div className="text-label-sm absolute bottom-2 left-0 flex w-full justify-between px-8 text-[var(--color-secondary)]">
              {kpi.xLabels.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </section>

        {/* Bottom lists */}
        <section className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Productos más vendidos */}
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Productos más vendidos</h3>
              <Link to="/productor/productos" className="text-label-md text-[var(--color-primary)] hover:underline">
                Ver catálogo
              </Link>
            </div>
            <ul className="flex flex-col">
              {PRODUCTOS_MAS_VENDIDOS.map((p) => (
                <li
                  key={p.nombre}
                  className="-mx-2 flex items-center justify-between border-b border-[var(--color-outline-variant)] px-2 py-5 transition-colors hover:bg-[var(--color-surface-container-low)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 overflow-hidden border border-[var(--color-outline-variant)] bg-[var(--color-surface-variant)]">
                      <img src={p.imagen} alt={p.nombre} className="size-full object-cover" />
                    </div>
                    <div>
                      <span className="text-body-lg mb-1 block text-[var(--color-on-surface)]">{p.nombre}</span>
                      <span className="text-label-sm rounded-sm bg-[var(--color-surface-container-high)] px-2 py-0.5 text-[var(--color-secondary)]">
                        {p.tag}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-body-md block text-[var(--color-on-surface)]">{p.total}</span>
                    <span className="text-label-sm text-[var(--color-secondary)]">{p.uds}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pedidos recientes */}
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Pedidos recientes</h3>
              <Link to="/productor/pedidos" className="text-label-md text-[var(--color-primary)] hover:underline">
                Ver todos
              </Link>
            </div>
            <ul className="flex flex-col">
              {PEDIDOS_RECIENTES.map((p) => (
                <li
                  key={p.id}
                  className="-mx-2 flex items-center justify-between border-b border-[var(--color-outline-variant)] px-2 py-5 transition-colors hover:bg-[var(--color-surface-container-low)]"
                >
                  <div>
                    <span className="text-label-sm mb-1 block tracking-wider text-[var(--color-secondary)]">{p.id}</span>
                    <span className="text-body-lg block text-[var(--color-on-surface)]">{p.cliente}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-body-md text-[var(--color-on-surface)]">{p.total}</span>
                    <span className={`text-label-sm min-w-[90px] rounded-full border px-3 py-1 text-center ${STATUS_CLASS[p.status as OrderStatus]}`}>
                      {p.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Period selection modal */}
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

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  trend,
  positive,
}: {
  label: string
  value: string
  trend: string
  positive: boolean
}) {
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
