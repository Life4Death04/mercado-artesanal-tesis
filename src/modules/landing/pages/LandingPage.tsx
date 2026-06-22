import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MapPin, Menu, PackageCheck, ShieldCheck, ShoppingBasket, Sparkles } from 'lucide-react'
import heroImage from '../../../assets/hero.png'
import { APP_NAME } from '../../../lib/branding'

const navItems = ['Mercado', 'Productores', 'Cómo funciona', 'Impacto']

const marketCategories = [
  {
    name: 'Despensa mediterránea',
    description: 'Aceites, conservas, mieles y productos de guarda con trazabilidad artesanal.',
  },
  {
    name: 'Fresco de autor',
    description: 'Quesos, panes y lotes de temporada preparados por pequeños productores.',
  },
  {
    name: 'Regalos gastronómicos',
    description: 'Cestas curadas para experiencias culinarias, eventos y consumo consciente.',
  },
]

const valuePillars = [
  { icon: ShieldCheck, title: 'Compra verificada', text: 'Publicaciones revisadas para elevar confianza y seguridad.' },
  { icon: MapPin, title: 'Origen visible', text: 'Cada producto conecta con su productor y contexto territorial.' },
  { icon: PackageCheck, title: 'Pedidos claros', text: 'Flujos pensados para consumidor, productor y administración.' },
]

const producerHighlights = ['Bodegas familiares', 'Queserías de montaña', 'Conservas de temporada', 'Mieles crudas']

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-background)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-[var(--space-margin-mobile)] py-4 md:px-[var(--space-margin-desktop)]">
          <Link to="/" className="flex items-center gap-3" aria-label={`${APP_NAME} inicio`}>
            <span className="grid size-11 place-items-center border border-[var(--color-primary-container)] bg-[var(--color-primary-container)] text-[var(--color-on-primary)]">
              AA
            </span>
            <span>
              <span className="font-editorial block text-2xl leading-none text-[var(--color-primary)]">{APP_NAME}</span>
              <span className="text-label-sm uppercase tracking-[0.18em] text-[var(--color-secondary)]">Mercado artesanal</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación provisional de landing">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className="text-label-md text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary-container)]">
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="text-label-md px-4 py-2 text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary-container)]">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="text-label-md bg-[var(--color-primary-container)] px-5 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]">
              Crear cuenta
            </Link>
          </div>

          <button type="button" aria-label="Abrir navegación" className="text-[var(--color-primary-container)] md:hidden">
            <Menu size={28} strokeWidth={1.8} />
          </button>
        </div>

        <div className="border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] px-[var(--space-margin-mobile)] py-2 text-center md:px-[var(--space-margin-desktop)]">
          <p className="text-label-sm uppercase tracking-[0.14em] text-[var(--color-secondary)]">
            Nota: este navbar es provisional para la LandingPage y será reemplazado por la navegación definitiva.
          </p>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)] md:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="absolute top-20 right-0 -z-10 h-80 w-80 rounded-full bg-[color-mix(in_srgb,var(--color-secondary-container)_65%,transparent)] blur-3xl" />
          <div>
            <span className="text-label-md mb-6 inline-flex items-center gap-2 border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] px-4 py-2 uppercase text-[var(--color-primary-container)]">
              <Sparkles size={16} strokeWidth={1.8} />
              Plataforma alimentaria artesanal
            </span>
            <h1 className="font-editorial max-w-5xl text-[52px] leading-[0.98] font-bold tracking-[-0.04em] text-[var(--color-primary)] md:text-[86px] lg:text-[104px]">
              Compra local con mirada editorial.
            </h1>
            <p className="text-body-lg mt-8 max-w-2xl text-[var(--color-on-surface-variant)]">
              {APP_NAME} reúne productores, consumidores y administración en una experiencia visual para descubrir,
              publicar y moderar alimentos artesanales con identidad mediterránea.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/productos" className="text-label-md inline-flex items-center justify-center gap-2 bg-[var(--color-primary-container)] px-7 py-4 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]">
                Explorar mercado
                <ArrowRight size={18} strokeWidth={1.8} />
              </Link>
              <Link to="/registro" className="text-label-md inline-flex items-center justify-center border border-[var(--color-on-surface)] px-7 py-4 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-on-surface)] hover:text-[var(--color-background)]">
                Soy productor
              </Link>
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div className="absolute top-0 right-0 h-[78%] w-[82%] border border-[color-mix(in_srgb,var(--color-outline)_35%,transparent)] bg-[var(--color-surface-container-lowest)] p-8 shadow-[0_32px_80px_-42px_rgba(28,27,27,0.55)]">
              <img src={heroImage} alt="Recurso fotográfico provisional de producto artesanal" className="mx-auto h-full max-h-[390px] w-full object-contain" />
            </div>
            <div className="absolute bottom-0 left-0 w-[72%] border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-primary)] p-6 text-[var(--color-on-primary)]">
              <p className="text-label-sm mb-3 uppercase tracking-[0.18em] text-[var(--color-inverse-primary)]">Foto de sección</p>
              <img src={heroImage} alt="Placeholder visual para sección destacada" className="mb-4 h-32 w-full object-contain opacity-90" />
              <p className="text-body-md">Este recurso se reutiliza como marcador fotográfico mientras se sustituyen las imágenes finales.</p>
            </div>
            <div className="absolute top-16 left-4 hidden rotate-[-6deg] border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-5 py-4 shadow-[0_18px_50px_-35px_rgba(28,27,27,0.45)] md:block">
              <p className="font-editorial text-headline-md text-[var(--color-primary)]">128</p>
              <p className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">productos curados</p>
            </div>
          </div>
        </section>

        <section id="mercado" className="border-y border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-surface-container-low)]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)] lg:grid-cols-3">
            {marketCategories.map((category, index) => (
              <article key={category.name} className="group border border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-[var(--color-background)] p-6 transition-transform hover:-translate-y-1">
                <div className="mb-6 flex h-48 items-center justify-center bg-[var(--color-surface-container)]">
                  <img src={heroImage} alt={`Foto provisional para ${category.name}`} className="h-36 object-contain transition-transform group-hover:scale-105" />
                </div>
                <p className="text-label-sm mb-3 uppercase tracking-[0.2em] text-[var(--color-outline)]">Colección 0{index + 1}</p>
                <h2 className="text-headline-md mb-3 text-[var(--color-on-surface)]">{category.name}</h2>
                <p className="text-body-md text-[var(--color-secondary)]">{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="productores" className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-[var(--space-margin-mobile)] py-20 md:px-[var(--space-margin-desktop)] lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-label-md mb-4 uppercase text-[var(--color-primary-container)]">Productores con relato</p>
            <h2 className="text-display-lg mb-6 text-[var(--color-on-surface)]">Una vitrina para alimentos con origen y oficio.</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">
              La landing presenta el tono comercial de la plataforma: artesanía, control de calidad, compra responsable y
              una experiencia de catálogo preparada para anexos visuales del proyecto.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {producerHighlights.map((highlight) => (
              <article key={highlight} className="min-h-52 border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-container-lowest)] p-5">
                <img src={heroImage} alt={`Foto provisional para ${highlight}`} className="mb-5 h-24 w-full object-contain" />
                <h3 className="text-headline-md text-[var(--color-on-surface)]">{highlight}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="cómo-funciona" className="bg-[var(--color-primary)] text-[var(--color-on-primary)]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-[var(--space-margin-mobile)] py-20 md:px-[var(--space-margin-desktop)] lg:grid-cols-3">
            {valuePillars.map(({ icon: Icon, title, text }) => (
              <article key={title} className="border border-[color-mix(in_srgb,var(--color-inverse-primary)_30%,transparent)] p-7">
                <Icon size={32} strokeWidth={1.7} className="mb-8 text-[var(--color-inverse-primary)]" />
                <h2 className="text-headline-md mb-4 text-[var(--color-on-primary)]">{title}</h2>
                <p className="text-body-md text-[color-mix(in_srgb,var(--color-on-primary)_78%,transparent)]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="impacto" className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-[var(--space-margin-mobile)] py-20 md:px-[var(--space-margin-desktop)] lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative border border-[color-mix(in_srgb,var(--color-outline)_35%,transparent)] bg-[var(--color-surface-container-low)] p-10">
            <img src={heroImage} alt="Foto provisional para bloque de impacto" className="mx-auto h-72 object-contain" />
            <div className="absolute right-8 bottom-8 bg-[var(--color-background)] px-5 py-4 shadow-[0_20px_55px_-36px_rgba(28,27,27,0.5)]">
              <p className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">Recurso temporal</p>
              <p className="text-body-md text-[var(--color-on-surface)]">Sustituir por fotografía real</p>
            </div>
          </div>
          <div>
            <ShoppingBasket size={42} strokeWidth={1.5} className="mb-6 text-[var(--color-primary-container)]" />
            <h2 className="text-display-lg mb-6 text-[var(--color-on-surface)]">Del productor al consumidor, con administración visible.</h2>
            <p className="text-body-lg mb-8 text-[var(--color-on-surface-variant)]">
              Esta LandingPage introduce el ecosistema completo: consumidor, productor y administrador. El navbar actual
              queda como réplica provisional para presentar la sección, no como navegación definitiva.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {['Consumidor', 'Productor', 'Administrador'].map((role) => (
                <div key={role} className="border border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] p-4">
                  <CheckCircle2 size={20} strokeWidth={1.8} className="mb-3 text-[var(--color-primary-container)]" />
                  <p className="text-label-md text-[var(--color-on-surface)]">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
