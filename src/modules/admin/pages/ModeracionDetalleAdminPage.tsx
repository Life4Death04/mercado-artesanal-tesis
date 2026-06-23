import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  ImagePlus,
  Info,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UserX,
} from 'lucide-react'
import {
  DeletePublicationModal,
  DeactivateProducerModal,
} from '../componentes/ContentModerationModals'

type PublicationStatus = 'Publicada' | 'Reportada' | 'Retirada'

const product = {
  name: 'Aceite de Oliva Virgen Extra',
  price: '24,50 €',
  unit: '/ unidad (500ml)',
  category: 'Aceites y Vinagres',
  description: [
    'Producido en el corazón de la Sierra de Tramuntana, este Aceite de Oliva Virgen Extra es el resultado de una cosecha temprana y una extracción en frío rigurosa. Elaborado exclusivamente con la variedad Picual, presenta un perfil organoléptico complejo y equilibrado, ideal para los paladares más exigentes.',
    'En nariz, destacan intensas notas frutadas a hierba recién cortada, tomatera y almendra verde. En boca, ofrece una entrada dulce que da paso a un picante y amargo medios, característicos de la variedad, dejando un retrogusto limpio y persistente. Un producto de finca, embotellado sin filtrar para preservar todas sus propiedades antioxidantes y su carácter indómito.',
  ],
  mainImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAL20Z0c22cB-kx6AP3rkHXY9eAmyoQqQJnd8lWuJgdy96xatmq-WUWW6jorPvOi4LJQmGb1gV0ClOxzhHr0UqR4LfhFx0CPC9Hje9MXk-Wp9PTU1Qf2a4x5PNs3gEWyBv2cY3_ZiCm4dB7ddscv__SwUAziqgFIXYqDVkLppK731YH4AheFx_tfEAPdGLVQUjc4bH7IgnypbAp4FNV6B-uEG5UfHoVFP-UF3SdxJIV4twt7aSjmnWzofotQzgy4BN-z9J2pBAC0N1B',
  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIrT4VGs7XSgLb6SoKP7aXT1J6SiX7Ouig8QfNhBo_SkKh2sAAdVgM_RvqG5bANT5aSSR7FjIkV0yNnGIdOT7HH6gkXiK5K27fiCkHn4P9x2OxFmyItlNQybevariRBv3dg88KqR7mvslL5uYrkXFYZpgZgGoYZebfL05_rfOrSckI3DDJjuXc4xgzmIxBRHHjrtHeXPUsYiDD2_pOzKyZf4b_LtSVXTYS69gJ4OqqAfEiXz3hBKyrs5bfJt0Nfw0F5H_ESozFO7-S',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDwtFJ3Xi7F0Yh651u-w7MfZ-d-usV-S0Xi1dcAPnkDG64H7wTj-IYALJVoVlZn6i59wSBiLgitzba_-7gkQzaUfDDFivEGDuP8LI8cFhjZ2oCjDXjl1Olx1i_GE4ohcPXUz64u30aKdhIYzjlSCevZzgZTGi3iCPpIsoR0a9uSvN8KBz_2KJ8MaNI_c_LJ5CahhAEiy-anUsKwLGfI6n8BDvfr-wv5VZo3YRkHUFWiX5fP_7IWECAr_RG8jl9SmCFKhjXl234YnOfN',
  ],
  producer: {
    id: 'finca-el-olivar',
    initials: 'FO',
    name: 'Finca El Olivar',
    location: 'Sóller, Islas Baleares',
    email: 'contacto@fincaelolivar.es',
    phone: '+34 971 123 456',
  },
}

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: PublicationStatus }) {
  const dotColor =
    status === 'Publicada'
      ? 'bg-[#2e7d32]'
      : status === 'Reportada'
        ? 'bg-[#880e4f]'
        : 'bg-[var(--color-error)]'

  return (
    <span className="text-label-sm inline-flex w-fit items-center rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] px-4 py-1.5 text-[var(--color-on-surface-variant)]">
      <span className={`mr-2 size-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ModeracionDetalleAdminPage() {
  const [status, setStatus] = useState<PublicationStatus>('Publicada')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeactivarModal, setShowDeactivarModal] = useState(false)

  function handleDeleteConfirm() {
    setStatus('Retirada')
  }

  return (
    <>
      <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
        {/* Header */}
        <header className="mb-10">
          <Link
            to="/admin/moderacion"
            className="group mb-6 inline-flex items-center gap-2 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]"
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.8}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-label-md">Volver al listado</span>
          </Link>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-display-lg tracking-tight text-[var(--color-on-surface)]">
              {product.name}
            </h1>
            <StatusBadge status={status} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ── Main column ── */}
          <main className="flex flex-col gap-10 lg:col-span-8">
            {/* Gallery */}
            <section className="flex flex-col gap-4" aria-label="Galería del producto">
              <div className="aspect-[4/3] w-full overflow-hidden border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container)]">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.gallery.map((image) => (
                  <button
                    key={image}
                    type="button"
                    className="aspect-square overflow-hidden border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container)] opacity-60 transition-opacity hover:opacity-100"
                  >
                    <img
                      src={image}
                      alt="Imagen adicional del producto"
                      className="size-full object-cover"
                    />
                  </button>
                ))}
                <button
                  type="button"
                  className="flex aspect-square items-center justify-center border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-low)]"
                >
                  <ImagePlus size={24} strokeWidth={1.8} />
                </button>
              </div>
            </section>

            {/* Price + category */}
            <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] py-6">
              <div className="flex items-baseline gap-4">
                <span className="text-headline-lg text-[var(--color-on-surface)]">
                  {product.price}
                </span>
                <span className="text-body-md text-[var(--color-secondary)]">{product.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-label-md uppercase tracking-widest text-[var(--color-secondary)]">
                  Categoría:
                </span>
                <span className="text-body-md text-[var(--color-on-surface)]">
                  {product.category}
                </span>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-headline-md mb-6 text-[var(--color-on-surface)]">
                Detalles del Producto
              </h2>
              <div className="space-y-4 text-[var(--color-on-surface-variant)]">
                {product.description.map((paragraph) => (
                  <p key={paragraph} className="text-body-md">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Technical sheet */}
            <section className="border-t border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] pt-8">
              <h2 className="text-headline-md mb-6 text-[var(--color-on-surface)]">
                Ficha Técnica
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <InfoBlock
                  title="Ingredientes"
                  text="100% Aceite de Oliva Virgen Extra (Variedad Picual). Extracción en frío."
                />
                <InfoBlock title="Origen" text="Sierra de Tramuntana, Mallorca, España." />
              </div>

              <div className="mt-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container)] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Info size={22} strokeWidth={1.8} className="text-[var(--color-outline)]" />
                  <h3 className="text-headline-md text-lg text-[var(--color-on-surface)]">
                    Información de Alérgenos
                  </h3>
                </div>
                <p className="text-body-md mb-4 text-[var(--color-on-surface-variant)]">
                  El productor declara que este producto está libre de los 14 alérgenos principales
                  según el reglamento (UE) Nº 1169/2011.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Sin Gluten', 'Sin Lácteos', 'Sin Frutos Secos'].map((allergen) => (
                    <span
                      key={allergen}
                      className="text-label-sm rounded-full border border-[color-mix(in_srgb,var(--color-secondary-container)_50%,transparent)] bg-[color-mix(in_srgb,var(--color-secondary-container)_35%,transparent)] px-3 py-1 text-[var(--color-on-secondary-fixed-variant)]"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </main>

          {/* ── Aside ── */}
          <aside className="flex flex-col gap-6 lg:col-span-4">
            {/* Producer card */}
            <section className="border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 shadow-sm">
              <h2 className="text-headline-md mb-6 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] pb-4 text-xl text-[var(--color-on-surface)]">
                Productor Responsable
              </h2>
              <div className="mb-6 flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-full bg-[var(--color-secondary-container)] font-editorial text-lg text-[var(--color-on-secondary-container)]">
                  {product.producer.initials}
                </div>
                <div>
                  <p className="text-body-lg font-medium text-[var(--color-on-surface)]">
                    {product.producer.name}
                  </p>
                  <p className="text-body-md text-[var(--color-secondary)]">
                    {product.producer.location}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <ProducerInfoRow icon={Mail} text={product.producer.email} />
                <ProducerInfoRow icon={Phone} text={product.producer.phone} />
                {/* Link al perfil público */}
                <Link
                  to={`/productores/${product.producer.id}`}
                  className="flex items-center gap-3 text-[var(--color-primary-container)] transition-opacity hover:opacity-70"
                >
                  <ExternalLink
                    size={20}
                    strokeWidth={1.8}
                    className="shrink-0 text-[var(--color-secondary)]"
                  />
                  <span className="text-body-md font-medium">Ver perfil público</span>
                </Link>
              </div>
            </section>

            {/* Moderation actions */}
            <section className="relative overflow-hidden border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] bg-[var(--color-surface)] p-6 shadow-sm">
              <div className="absolute top-0 left-0 h-1 w-full bg-[color-mix(in_srgb,var(--color-error)_80%,transparent)]" />
              <div className="mb-6 flex items-center gap-2">
                <ShieldCheck size={22} strokeWidth={1.8} className="text-[var(--color-error)]" />
                <h2 className="text-headline-md text-xl text-[var(--color-on-surface)]">
                  Acciones de Moderación
                </h2>
              </div>
              <p className="text-body-md mb-6 text-sm text-[var(--color-on-surface-variant)]">
                Estas acciones son irreversibles y notificarán automáticamente al productor.
              </p>
              <div className="flex flex-col gap-4">
                {/* Eliminar publicación */}
                <button
                  type="button"
                  disabled={status === 'Retirada'}
                  onClick={() => setShowDeleteModal(true)}
                  className="text-label-md flex w-full items-center justify-center gap-2 bg-[var(--color-error)] px-4 py-3 text-[var(--color-on-error)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                  {status === 'Retirada' ? 'Publicación retirada' : 'Eliminar publicación'}
                </button>

                {/* Desactivar cuenta del productor */}
                <button
                  type="button"
                  onClick={() => setShowDeactivarModal(true)}
                  className="text-label-md flex w-full items-center justify-center gap-2 border border-[var(--color-error)] bg-transparent px-4 py-3 text-[var(--color-error)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-error-container)_50%,transparent)]"
                >
                  <UserX size={18} strokeWidth={1.8} />
                  Desactivar cuenta del productor
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <DeletePublicationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showDeactivarModal && (
        <DeactivateProducerModal
          producerName={product.producer.name}
          onClose={() => setShowDeactivarModal(false)}
          onConfirm={() => { /* feedback visual futuro */ }}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-label-md mb-3 uppercase tracking-widest text-[var(--color-secondary)]">
        {title}
      </h3>
      <p className="text-body-md text-[var(--color-on-surface)]">{text}</p>
    </div>
  )
}

function ProducerInfoRow({
  icon: Icon,
  text,
}: {
  icon: typeof Mail
  text: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={20} strokeWidth={1.8} className="shrink-0 text-[var(--color-secondary)]" />
      <span className="text-body-md text-[var(--color-on-surface)]">{text}</span>
    </div>
  )
}
