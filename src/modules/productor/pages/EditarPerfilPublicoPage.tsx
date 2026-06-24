import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart2,
  BookOpen,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react'
import {
  CambiarCorreoModal,
  DescartarCambiosModal,
} from '../componentes/PerfilPublicoModals'

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Mis pedidos', to: '/productor/pedidos', active: false },
  { icon: BookOpen, label: 'Mi catálogo', to: '/productor/productos', active: false },
  { icon: Package, label: 'Inventario', to: '/productor/inventario', active: false },
  { icon: BarChart2, label: 'Estadísticas', to: '/productor/estadisticas', active: false },
  { icon: Truck, label: 'Configuración de entregas', to: '/productor/entregas', active: false },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const TIENDA = {
  nombre: 'Finca Alicante',
  municipio: 'Denia, Alicante',
  correoPublico: 'info@fincaalicante.es',
  telefono: '+34 965 123 456',
  bio: '"Nuestra herencia se cultiva en las laderas de Denia, donde el aire del Mediterráneo y los suelos calcáreos dan vida a productos de una pureza excepcional. Seguimos procesos ancestrales de recolección manual para garantizar que cada botella de aceite y cada racimo de uva capture la esencia misma de nuestra tierra."',
  banner:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKItCbKarmNtU4QmSr1L4gl0bW3gbUoZeZFU6XwTn9RU736jGyfxDjqcWzJJgTuP0zJYjBZOqpszZfgywxBaCXnkv9cRKtrGxMZ_baT_R9u6YfQAkVC1eNKS2YhR1yvVcOvdbJoyNSwSnuTBdi7lsCpDF785KUmOKFnNvMQJLUPp2hnlVkhEpL8ypyvd6dCxI1tKthoiYu44rnDLMM0OcXjdgGUKN2Dh9T4WQhyWWCW4Gyva60nuQCVuvyG7PZNXW3vi9_qjqRO8',
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWWrkIzeok3Tp4CIELd0KwSmSIjsiZ-Vaf7G9rJgzOBWSgX6TEkHMBs7VFobCVMs0z4s5X5-zMMCAitHC19RImSILjyC5AcMirwfYNa3a4w8yna2N54_rUQBLuCzDPEVINFcBgGDvAL8XsWG59fVZ29xHDC5xd_bVX28IgpVJ5dnPSDEqdQuP6JLTpR6MAj37e8BpBjp4F5YquuRf3BQR3xlox05YTRHF1ZGHyEmTEve_0vDuprdaBv6Klum7wbdTxA6FnnXEVUQ8',
}

const CUENTA = {
  nombre: 'Marta García',
  correo: 'marta.garcia@email.com',
  registro: 'Miembro desde 2022',
  tipo: 'Productor Verificado',
}

const PRODUCTOS_PREVIEW = [
  {
    id: 'p1',
    nombre: 'Aceite de Oliva Arbequina',
    detalle: '500ml · Cosecha Temprana',
    precio: '24,50 €',
    badge: 'D.O. Alicante',
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDy32c0G8lwPWLpv0NTciYEBJSrXDfM2jBt3PET5HklkZCqX-oAe40beY-ABTEgcBEaedthUImcxrU0X2L6cwhfnZGnfYL9_ileCXn9eO8D5q7aSZbDKse5LzYsPAHJfJ7NLki3ItaKoiBiFDdStVL4GQCFT7ziLEtOO3HAl7qJPt61TKHZm-TP2tjK9R2mAHFaZRGJFfYx5Ed36fgEskkyLRASGKpqFY7N2fDPh7d55d6rVCr-GDshS8EpdST_hswbKOu8pEG71Dg',
  },
  {
    id: 'p2',
    nombre: 'Vino Monastrell Reserva',
    detalle: '75cl · Roble Francés',
    precio: '18,00 €',
    badge: null,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCzc7FxIB6146OgThQLqG_S8TF4n3EmfBxBj9kkHTI5gvbR8i4-ubUEnKLUfrhYWCCtUzdrTOTsj8sH3PV9CUu3JbCqPv-titRJAAa7oLWfREenQO02q857nvca9gWAqe1xIrqNDVf1AkOLzYCrncQnzVfd-z9jpWBMHIFQndjRIykt433NlEipYEUzuzZ1DfJEjQJke4O3RS6_u9E4DjpCVzUVLVhr4nUZJFTWiV47Da0XesK27Msd9AphLA0mnZgA4yvX2Dk2vk',
  },
  {
    id: 'p3',
    nombre: 'Queso de Cabra Curado',
    detalle: '400g · Elaboración Manual',
    precio: '12,90 €',
    badge: 'Orgánico',
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFwhpvbfi4zDIedRSBjzBdkYccqdYlZwpgfR75MssAHru0YOyVvC2917fRstOOib57zwUxdgG7qyx3tX6gtDfiIBOP8RqKziYq1gwIvJqgiR3MC4NxXXV1kWAFLuA-fhpzTRHEteP4_0L0NsLba8eoyMuTTwF2NGgCTPEo-XYRHve9y6KmrA_M501yANXh_hVis0lezu-bcsR0Iobpmb5u6XoNLOZsD0WkOARpI0i6BUZMrB197_UjHL0Y7ta77g2VnsXn38Eweig',
  },
  {
    id: 'p4',
    nombre: 'Miel de Azahar Pura',
    detalle: '250g · Origen Guadalest',
    precio: '9,50 €',
    badge: null,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSRCnzM4wMsBxQhB3hSRoHyVo7GTLZlDJYkKHdu1h8IbV0x8rI204EQ6h5stFSb6jlcUqFtVgT4YPzqn-Wyon9jBqD2NNPP5LmPSn3clySsW3i_Ytwxi2h2_Df9Ru-VVt6uX32BRAeVb7-ToT4IwZjflXBTCIB0w4Frk5eVN79ctWEPW601eQ8itoMFffDYcvUgPVhaZ1-zW2DCQj5aoqDw1S1UuaTFiwde-jZoXCOZwnHLXU',
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function EditarPerfilPublicoPage() {
  const [modalCorreo, setModalCorreo] = useState(false)
  const [modalDescartar, setModalDescartar] = useState(false)
  const [editando, setEditando] = useState(false)

  // Simple draft state for the shop editing section
  const [draft, setDraft] = useState({ nombre: TIENDA.nombre, bio: TIENDA.bio })

  function handleEditar() {
    setEditando(true)
  }

  function handleCancelarEdicion() {
    setModalDescartar(true)
  }

  function handleDescartar() {
    setDraft({ nombre: TIENDA.nombre, bio: TIENDA.bio })
    setEditando(false)
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      {/* ── Sidebar ── */}
      <aside className="hidden">
        <div className="mb-12">
          <Link to="/" className="text-headline-md font-bold text-[var(--color-primary)]">
            Alicante Gourmet
          </Link>
          <p className="text-body-md mt-2 text-[var(--color-secondary)]">Artesano de Denia</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 transition-all duration-200 ${
                active
                  ? 'translate-x-0.5 bg-[var(--color-secondary-container)] font-semibold text-[var(--color-primary)]'
                  : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.8} />
              <span className="text-label-md">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Mi perfil — active at bottom */}
        <div className="mt-auto border-t border-[var(--color-outline-variant)] pt-4">
          <Link
            to="/productor/perfil"
            className="flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 translate-x-0.5 bg-[var(--color-secondary-container)] font-semibold text-[var(--color-primary)] transition-all"
          >
            <User size={20} strokeWidth={2} />
            <span className="text-label-md">Mi perfil</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="min-h-screen flex-1 pb-32">
        <div className="mx-auto max-w-[var(--container-max)] space-y-16 px-6 py-20 md:px-16 md:pt-24">
          {/* ─────────────────────────────────────────────────
              SECCIÓN 1: Vista pública de la tienda
          ───────────────────────────────────────────────── */}
          <section>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-headline-md text-[var(--color-primary)]">
                  Vista pública de la tienda
                </h2>
                <p className="text-body-md mt-2 max-w-2xl text-[var(--color-secondary)]">
                  Así es como los clientes ven tu marca y catálogo en el mercado de Alicante
                  Artisans.
                </p>
              </div>
              {!editando ? (
                <button
                  type="button"
                  onClick={handleEditar}
                  className="text-label-md flex items-center gap-2 bg-[var(--color-primary-container)] px-8 py-3 text-white shadow-sm transition-all hover:bg-[var(--color-primary)]"
                >
                  <Pencil size={16} strokeWidth={1.8} />
                  Editar tienda
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancelarEdicion}
                    className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-outline)] px-6 py-3 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditando(false)}
                    className="text-label-md rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-3 text-white transition-colors hover:bg-[var(--color-primary)]"
                  >
                    Guardar cambios
                  </button>
                </div>
              )}
            </div>

            {/* Shop preview card */}
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] shadow-[0px_4px_20px_rgba(26,26,26,0.04)]">
              {/* Banner */}
              <div className="relative h-72 w-full overflow-hidden md:h-80">
                <img
                  src={TIENDA.banner}
                  alt="Banner de Finca Alicante"
                  className="h-full w-full object-cover"
                />
                {editando && (
                  <button
                    type="button"
                    className="text-label-md absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100"
                  >
                    Cambiar banner
                  </button>
                )}
                {/* Logo circle */}
                <div className="absolute -bottom-14 left-10 h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-[var(--color-surface-container-low)] shadow-md md:-bottom-16 md:left-12 md:h-32 md:w-32">
                  <img
                    src={TIENDA.logo}
                    alt="Logo Finca Alicante"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Content below banner */}
              <div className="px-10 pb-12 pt-20 md:px-12 md:pt-20">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                  {/* Left: name + bio */}
                  <div className="lg:col-span-8">
                    {editando ? (
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                          <label className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
                            Nombre de la tienda
                          </label>
                          <input
                            type="text"
                            value={draft.nombre}
                            onChange={(e) => setDraft((d) => ({ ...d, nombre: e.target.value }))}
                            className="border-b border-[var(--color-outline-variant)] bg-transparent text-display-lg text-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
                            Historia / Bio editorial
                          </label>
                          <textarea
                            rows={5}
                            value={draft.bio}
                            onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                            className="resize-none border-b border-[var(--color-outline-variant)] bg-transparent text-body-lg italic leading-relaxed text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-display-lg mb-4 text-[var(--color-primary)]">
                          {draft.nombre}
                        </h3>
                        <p className="text-body-lg max-w-3xl italic leading-relaxed text-[var(--color-on-surface)]">
                          {draft.bio}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Right: contact info */}
                  <div className="flex flex-col justify-center gap-5 border-t border-[var(--color-outline-variant)] pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <ContactRow
                      icon={<MapPin size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
                      label="Municipio"
                      value={TIENDA.municipio}
                    />
                    <ContactRow
                      icon={<Mail size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
                      label="Contacto público"
                      value={TIENDA.correoPublico}
                    />
                    <ContactRow
                      icon={<Phone size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
                      label="Teléfono"
                      value={TIENDA.telefono}
                    />
                    <Link
                      to={`/productores/finca-alicante`}
                      className="text-label-md mt-2 flex items-center gap-2 text-[var(--color-primary)] transition-opacity hover:opacity-70"
                    >
                      <ExternalLink size={14} strokeWidth={1.8} />
                      Ver perfil público
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product preview grid */}
              <div className="border-t border-[var(--color-outline-variant)] px-10 pb-12 pt-10 md:px-12">
                <div className="mb-8 flex items-center justify-between">
                  <h4 className="text-headline-sm text-[var(--color-tertiary)]">
                    Vista previa del catálogo
                  </h4>
                  <Link
                    to="/productor/productos"
                    className="text-label-md border-b border-[var(--color-primary)] text-[var(--color-primary)] transition-opacity hover:opacity-70"
                  >
                    Ver catálogo completo
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {PRODUCTOS_PREVIEW.map((p) => (
                    <ProductCard key={p.id} {...p} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────
              SECCIÓN 2: Datos de la cuenta
          ───────────────────────────────────────────────── */}
          <section className="border-t border-[var(--color-outline-variant)] pt-16">
            <h2 className="text-headline-md mb-8 text-[var(--color-primary)]">
              Datos de la cuenta
            </h2>

            <div className="max-w-4xl rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-10">
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                <AccountField label="Nombre completo" value={CUENTA.nombre} />
                <AccountField label="Correo electrónico" value={CUENTA.correo} />
                <AccountField label="Fecha de registro" value={CUENTA.registro} />
                <AccountField label="Tipo de cuenta" value={CUENTA.tipo} />
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setModalCorreo(true)}
                  className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-secondary)] px-6 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-secondary)] hover:text-white"
                >
                  Cambiar correo
                </button>
                <button
                  type="button"
                  className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-secondary)] px-6 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-secondary)] hover:text-white"
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── Modals ── */}
      {modalCorreo && (
        <CambiarCorreoModal
          correoActual={CUENTA.correo}
          onClose={() => setModalCorreo(false)}
        />
      )}

      {modalDescartar && (
        <DescartarCambiosModal
          onClose={() => setModalDescartar(false)}
          onDiscard={handleDescartar}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ContactRow
// ---------------------------------------------------------------------------

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-label-md text-[var(--color-secondary)]">{label}</p>
        <p className="text-body-md font-semibold text-[var(--color-on-surface)]">{value}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AccountField
// ---------------------------------------------------------------------------

function AccountField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-label-sm mb-2 block uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </label>
      <p className="text-body-lg border-b border-[var(--color-outline)] py-2 text-[var(--color-on-surface)]">
        {value}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProductCard — catalog preview
// ---------------------------------------------------------------------------

function ProductCard({
  nombre,
  detalle,
  precio,
  badge,
  imagen,
}: {
  nombre: string
  detalle: string
  precio: string
  badge: string | null
  imagen: string
}) {
  return (
    <article className="flex flex-col border-[0.5px] border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4 transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative mb-4 aspect-square overflow-hidden">
        <img src={imagen} alt={nombre} className="h-full w-full object-cover" />
        {badge && (
          <div className="absolute top-2 left-2 bg-[var(--color-surface-container-low)] px-2 py-1">
            <span className="text-label-sm text-[10px] uppercase tracking-widest text-[var(--color-secondary)]">
              {badge}
            </span>
          </div>
        )}
      </div>
      <h5 className="text-[18px] leading-6 text-[var(--color-primary)] mb-1 font-[family-name:'Libre_Caslon_Text']">
        {nombre}
      </h5>
      <p className="text-label-sm mb-4 text-[var(--color-secondary)]">{detalle}</p>
      <p className="text-body-md mt-auto font-bold text-[var(--color-on-surface)]">{precio}</p>
    </article>
  )
}
