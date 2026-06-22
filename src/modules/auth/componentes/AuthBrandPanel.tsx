import { APP_NAME } from '../../../lib/branding'

const brandImageUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCcdrCo4J3tIsOpKKJwBiQ3BYBZy1DZrglHhRQwQj0GX2sjeLKvLrAI3B7lQgOF0bL2i9DjQz6cQPwaakK0m14YD3UZcs4Na8Kd3W5sesMRkJpB6t9np9QQJrQDbikuta0jIiG8-40WWWPNmi2lzsuqDLi7VKePv_kSojzfv_rC6T8tu6uZ66n1nb6URpz-g0exXTMdZhohl3PUvHKuiWWlfv0XkGSsUAkEIe0htBf4hHkL_6rdoohJ18OO7jc1YG5NY8_wlao-WmjN'

export function AuthBrandPanel() {
  return (
    <section className="group relative hidden min-h-[600px] overflow-hidden bg-[var(--color-secondary-fixed)] md:block">
      <img
        src={brandImageUrl}
        alt="Pan artesanal, aceite de oliva y romero sobre una tabla de marmol"
        className="absolute inset-0 size-full object-cover opacity-90 transition duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 flex h-full flex-col justify-end p-12 text-white">
        <p className="text-label-md mb-4 uppercase tracking-[0.28em] text-white/85">
          Artisanal Excellence
        </p>
        <h1 className="text-display-lg mb-4 text-white">{APP_NAME}</h1>
        <p className="text-body-lg max-w-sm text-white/90">
          Descubra la esencia de la tradición artesana en cada detalle de nuestra selección curada.
        </p>
      </div>
    </section>
  )
}
