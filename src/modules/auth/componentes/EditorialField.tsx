import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

type BaseFieldProps = {
  label: string
  hint?: string
  trailing?: ReactNode
}

type TextFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>

type TextareaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>

type SelectFieldProps = BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>

export function EditorialTextField({ label, hint, trailing, id, ...props }: TextFieldProps) {
  return (
    <label className="block">
      <span className="text-label-md mb-2 block text-[var(--color-on-surface)]">
        {label} {hint && <span className="font-normal text-[var(--color-outline)]">{hint}</span>}
      </span>
      <span className="relative block">
        <input
          id={id}
          className="text-body-lg w-full border-0 border-b border-[var(--color-outline-variant)] bg-transparent px-0 py-3 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-[var(--color-on-surface-variant)] disabled:opacity-70"
          {...props}
        />
        {trailing && <span className="absolute right-0 top-1/2 -translate-y-1/2">{trailing}</span>}
      </span>
    </label>
  )
}

export function EditorialTextareaField({ label, hint, id, ...props }: TextareaFieldProps) {
  return (
    <label className="block">
      <span className="text-label-md mb-2 block text-[var(--color-on-surface)]">
        {label} {hint && <span className="font-normal text-[var(--color-outline)]">{hint}</span>}
      </span>
      <textarea
        id={id}
        className="text-body-md w-full resize-none border-0 border-b border-[var(--color-outline-variant)] bg-transparent px-0 py-3 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none focus:ring-0"
        {...props}
      />
    </label>
  )
}

export function EditorialSelectField({ label, hint, id, children, ...props }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-label-md mb-2 block text-[var(--color-on-surface)]">
        {label} {hint && <span className="font-normal text-[var(--color-outline)]">{hint}</span>}
      </span>
      <span className="relative block">
        <select
          id={id}
          className="text-body-md w-full appearance-none border-0 border-b border-[var(--color-outline-variant)] bg-transparent px-0 py-3 text-[var(--color-on-surface)] transition-colors focus:border-[var(--color-on-surface)] focus:outline-none focus:ring-0"
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" size={18} />
      </span>
    </label>
  )
}
