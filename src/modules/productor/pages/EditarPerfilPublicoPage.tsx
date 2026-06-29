import { type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Store,
  User,
  X,
} from 'lucide-react'
import {
  CambiarCorreoModal,
  DescartarCambiosModal,
} from '../componentes/PerfilPublicoModals'

const TIENDA = {
  nombre: 'Finca Alicante',
  municipio: 'Denia, Alicante',
  correoPublico: 'info@fincaalicante.es',
  telefono: '+34 965 123 456',
  bio: 'Nuestra herencia se cultiva en las laderas de Denia, donde el aire del Mediterraneo y los suelos calcareos dan vida a productos de una pureza excepcional. Seguimos procesos ancestrales de recoleccion manual para garantizar que cada botella de aceite y cada racimo de uva capture la esencia misma de nuestra tierra.',
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

type StoreProfile = {
  nombre: string
  bio: string
  municipio: string
  telefono: string
}

const initialStoreProfile: StoreProfile = {
  nombre: TIENDA.nombre,
  bio: TIENDA.bio,
  municipio: TIENDA.municipio,
  telefono: TIENDA.telefono,
}

export function EditarPerfilPublicoPage() {
  const [modalCorreo, setModalCorreo] = useState(false)
  const [modalDescartar, setModalDescartar] = useState(false)
  const [editando, setEditando] = useState(false)
  const [savedProfile, setSavedProfile] = useState<StoreProfile>(initialStoreProfile)
  const [draft, setDraft] = useState<StoreProfile>(initialStoreProfile)

  function handleEditar() {
    setDraft(savedProfile)
    setEditando(true)
  }

  function handleGuardar() {
    setSavedProfile(draft)
    setEditando(false)
  }

  function handleCancelarEdicion() {
    setModalDescartar(true)
  }

  function handleDescartar() {
    setDraft(savedProfile)
    setEditando(false)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav
            aria-label="Breadcrumb"
            className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]"
          >
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">
              Area Productor
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Mi perfil</span>
          </nav>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Mi perfil</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Ajusta la informacion visible de tu tienda y revisa que datos de cuenta siguen
                siendo gestionados desde configuraciones protegidas.
              </p>
            </div>

            {editando ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancelarEdicion}
                  className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] bg-white px-5 py-3 text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  <X size={16} strokeWidth={1.8} />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGuardar}
                  className="text-label-md inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-3 text-white transition-colors hover:bg-[var(--color-primary-container)]"
                >
                  <Save size={16} strokeWidth={1.8} />
                  Guardar cambios
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEditar}
                className="text-label-md inline-flex items-center justify-center gap-2 bg-[var(--color-primary-container)] px-5 py-3 text-[var(--color-on-primary-container)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
              >
                <Pencil size={16} strokeWidth={1.8} />
                Editar tienda
              </button>
            )}
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SummaryCard
            label="Estado"
            value={editando ? 'Edicion activa' : 'Solo lectura'}
            helpText={editando ? 'Puedes actualizar la ficha publica antes de guardar.' : 'Pulsa Editar tienda para habilitar campos.'}
            icon={<Store size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
            iconBg="rgba(122,46,58,0.12)"
          />
          <SummaryCard
            label="Localidad publica"
            value={draft.municipio}
            helpText="Visible para clientes en la ficha de productor"
            icon={<MapPin size={22} strokeWidth={1.8} className="text-[#1565C0]" />}
            iconBg="#E3F2FD"
          />
          <SummaryCard
            label="Telefono publico"
            value={draft.telefono}
            helpText="Contacto directo mostrado en la tienda"
            icon={<Phone size={22} strokeWidth={1.8} className="text-[#2E7D32]" />}
            iconBg="#E8F5E9"
          />
        </section>

        <section className="mb-6 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-label-md mb-1 uppercase tracking-[0.18em] text-[var(--color-outline)]">
                Alcance de edicion
              </p>
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                Aqui solo editas la presentacion publica de la tienda. El correo de acceso y los
                datos de cuenta permanecen bloqueados.
              </p>
            </div>
            <span
              className={`text-label-md inline-flex w-fit items-center rounded-full px-4 py-2 ${
                editando ? 'bg-[#FFF3E0] text-[#EF6C00]' : 'bg-[rgba(46,125,50,0.12)] text-[#2E7D32]'
              }`}
            >
              {editando ? 'Campos editables activos' : 'Campos editables bloqueados'}
            </span>
          </div>
        </section>

        <section className="mb-8 rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)]">
          <div className="relative h-56 md:h-72">
            <div className="h-full overflow-hidden rounded-t-[var(--radius-xl)]">
              <img src={TIENDA.banner} alt="Banner de Finca Alicante" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </div>

            {/* <div className="absolute left-5 top-5 flex gap-2">
              <span className="text-label-sm rounded-full bg-white/90 px-3 py-1 text-[var(--color-primary)]">
                Vista publica
              </span>
              <span
                className={`text-label-sm rounded-full px-3 py-1 ${
                  editando ? 'bg-[#FFF3E0] text-[#EF6C00]' : 'bg-white/90 text-[var(--color-secondary)]'
                }`}
              >
                {editando ? 'Borrador' : 'Publicado'}
              </span>
            </div>

            <div className="absolute bottom-5 right-5">
              <FieldHint disabled>
                Banner y logo no se editan en este bloque
              </FieldHint>
            </div> */}

            <div className="absolute -bottom-14 left-5 z-10 size-28 overflow-hidden rounded-full border-4 border-white bg-[var(--color-surface-container-low)] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] md:left-8 md:size-32">
              <img src={TIENDA.logo} alt="Logo Finca Alicante" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="px-5 pb-8 pt-20 md:px-8 md:pt-24">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <EditableField
                    label="Nombre de la tienda"
                    value={draft.nombre}
                    onChange={(value) => setDraft((current) => ({ ...current, nombre: value }))}
                    disabled={!editando}
                  />
                  <EditableField
                    label="Localidad"
                    value={draft.municipio}
                    onChange={(value) => setDraft((current) => ({ ...current, municipio: value }))}
                    disabled={!editando}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <EditableField
                    label="Telefono publico"
                    value={draft.telefono}
                    onChange={(value) => setDraft((current) => ({ ...current, telefono: value }))}
                    disabled={!editando}
                  />
                  <StaticField
                    label="Correo publico"
                    value={TIENDA.correoPublico}
                    helper="Se modifica desde Cambiar correo."
                  />
                </div>

                <EditableTextArea
                  label="Historia / bio editorial"
                  value={draft.bio}
                  onChange={(value) => setDraft((current) => ({ ...current, bio: value }))}
                  disabled={!editando}
                />

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/productores/finca-alicante"
                    className="text-label-md inline-flex items-center gap-2 text-[var(--color-primary)] transition-opacity hover:opacity-70"
                  >
                    <ExternalLink size={14} strokeWidth={1.8} />
                    Ver perfil publico
                  </Link>
                  <FieldHint disabled={!editando}>
                    {editando ? 'Recuerda guardar para aplicar cambios.' : 'Pulsa Editar tienda para actualizar la ficha.'}
                  </FieldHint>
                </div>
              </div>

              <aside className="space-y-4 border-t border-[var(--color-outline-variant)] pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
                <InfoCard
                  icon={<MapPin size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
                  label="Localidad visible"
                  value={draft.municipio}
                  editable={editando}
                />
                <InfoCard
                  icon={<Phone size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
                  label="Telefono de contacto"
                  value={draft.telefono}
                  editable={editando}
                />
                <InfoCard
                  icon={<Mail size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
                  label="Correo de acceso"
                  value={CUENTA.correo}
                  editable={false}
                  helper="Gestionado desde seguridad de cuenta"
                />
                <InfoCard
                  icon={<User size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
                  label="Titular"
                  value={CUENTA.nombre}
                  editable={false}
                  helper={CUENTA.tipo}
                />
              </aside>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-headline-sm text-[var(--color-primary)]">Vista previa del catalogo</h2>
              <p className="text-body-sm text-[var(--color-on-surface-variant)]">
                Referencia rapida de como convive la ficha de tienda con tus productos publicados.
              </p>
            </div>
            <Link
              to="/productor/productos"
              className="text-label-md inline-flex items-center gap-2 text-[var(--color-primary)] transition-opacity hover:opacity-70"
            >
              Ver catalogo completo
              <ChevronRight size={14} strokeWidth={1.8} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PRODUCTOS_PREVIEW.map((producto) => (
              <ProductCard key={producto.id} {...producto} />
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-headline-sm text-[var(--color-primary)]">Datos de la cuenta</h2>
              <p className="text-body-sm max-w-2xl text-[var(--color-on-surface-variant)]">
                Estos datos identifican la cuenta del productor y no forman parte del bloque de
                edicion publica.
              </p>
            </div>
            <FieldHint disabled>Campos protegidos</FieldHint>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StaticField label="Nombre completo" value={CUENTA.nombre} />
            <StaticField label="Correo electronico" value={CUENTA.correo} />
            <StaticField label="Fecha de registro" value={CUENTA.registro} />
            <StaticField label="Tipo de cuenta" value={CUENTA.tipo} />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setModalCorreo(true)}
              className="text-label-md border border-[var(--color-outline-variant)] bg-white px-5 py-3 text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)]"
            >
              Cambiar correo
            </button>
            <button
              type="button"
              className="text-label-md border border-[var(--color-outline-variant)] bg-white px-5 py-3 text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)]"
            >
              <span className="inline-flex items-center gap-2">
                Cambiar contraseña
                <ExternalLink size={14} strokeWidth={1.8} />
              </span>
            </button>
          </div>
        </section>
      </main>

      {modalCorreo ? (
        <CambiarCorreoModal correoActual={CUENTA.correo} onClose={() => setModalCorreo(false)} />
      ) : null}

      {modalDescartar ? (
        <DescartarCambiosModal
          onClose={() => setModalDescartar(false)}
          onDiscard={handleDescartar}
        />
      ) : null}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  helpText,
  icon,
  iconBg,
}: {
  label: string
  value: string
  helpText: string
  icon: ReactNode
  iconBg: string
}) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5 md:p-6">
      <div>
        <p className="text-label-md mb-1 uppercase tracking-widest text-[var(--color-secondary)]">
          {label}
        </p>
        <p className="text-headline-lg text-[var(--color-on-surface)]">{value}</p>
        <p className="text-body-sm mt-2 text-[var(--color-on-surface-variant)]">{helpText}</p>
      </div>
      <div className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
    </div>
  )
}

function EditableField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`text-body-md border px-4 py-3 text-[var(--color-on-surface)] focus:outline-none ${
          disabled
            ? 'cursor-not-allowed border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-secondary)]'
            : 'border-[var(--color-primary)] bg-[rgba(122,46,58,0.08)] shadow-[inset_0_0_0_1px_rgba(122,46,58,0.18)] focus:border-[var(--color-primary)] focus:bg-[rgba(122,46,58,0.12)]'
        }`}
      />
    </label>
  )
}

function EditableTextArea({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </span>
      <textarea
        rows={6}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`text-body-md resize-none border px-4 py-3 text-[var(--color-on-surface)] focus:outline-none ${
          disabled
            ? 'cursor-not-allowed border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] text-[var(--color-secondary)]'
            : 'border-[var(--color-primary)] bg-[rgba(122,46,58,0.08)] shadow-[inset_0_0_0_1px_rgba(122,46,58,0.18)] focus:border-[var(--color-primary)] focus:bg-[rgba(122,46,58,0.12)]'
        }`}
      />
    </label>
  )
}

function StaticField({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </span>
      <div className="border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] px-4 py-3 text-[var(--color-secondary)]">
        <p className="text-body-md">{value}</p>
        {helper ? <p className="text-body-sm mt-1 text-[var(--color-outline)]">{helper}</p> : null}
      </div>
    </div>
  )
}

function FieldHint({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return (
    <span
      className={`text-label-sm inline-flex w-fit items-center rounded-full px-3 py-1 ${
        disabled
          ? 'bg-[var(--color-surface-container)] text-[var(--color-secondary)]'
          : 'bg-[rgba(122,46,58,0.12)] text-[var(--color-primary)]'
      }`}
    >
      {children}
    </span>
  )
}

function InfoCard({
  icon,
  label,
  value,
  helper,
  editable,
}: {
  icon: ReactNode
  label: string
  value: string
  helper?: string
  editable: boolean
}) {
  return (
    <div className="border border-[var(--color-outline-variant)] bg-white/70 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{icon}</div>
          <div>
            <p className="text-label-md text-[var(--color-secondary)]">{label}</p>
            <p className="text-body-md font-semibold text-[var(--color-on-surface)]">{value}</p>
          </div>
        </div>
        <FieldHint disabled={!editable}>{editable ? 'Editable' : 'Bloqueado'}</FieldHint>
      </div>
      {helper ? <p className="text-body-sm text-[var(--color-on-surface-variant)]">{helper}</p> : null}
    </div>
  )
}

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
    <article className="flex flex-col border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4 transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative mb-4 aspect-square overflow-hidden">
        <img src={imagen} alt={nombre} className="h-full w-full object-cover" />
        {badge ? (
          <div className="absolute left-2 top-2 bg-[var(--color-surface-container-low)] px-2 py-1">
            <span className="text-label-sm text-[10px] uppercase tracking-widest text-[var(--color-secondary)]">
              {badge}
            </span>
          </div>
        ) : null}
      </div>
      <h3 className="mb-1 text-[18px] font-[family-name:'Libre_Caslon_Text'] leading-6 text-[var(--color-primary)]">
        {nombre}
      </h3>
      <p className="text-label-sm mb-4 text-[var(--color-secondary)]">{detalle}</p>
      <p className="text-body-md mt-auto font-bold text-[var(--color-on-surface)]">{precio}</p>
    </article>
  )
}
