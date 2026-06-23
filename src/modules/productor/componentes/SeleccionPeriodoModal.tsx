import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'

// ---------------------------------------------------------------------------
// Calendar helpers
// ---------------------------------------------------------------------------

const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const MESES_ES: Record<number, string> = {
  0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril',
  4: 'Mayo', 5: 'Junio', 6: 'Julio', 7: 'Agosto',
  8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre', 11: 'Diciembre',
}

const MESES_CORTO: Record<number, string> = {
  0: 'ene', 1: 'feb', 2: 'mar', 3: 'abr',
  4: 'may', 5: 'jun', 6: 'jul', 7: 'ago',
  8: 'sep', 9: 'oct', 10: 'nov', 11: 'dic',
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Returns Monday-first offset (0=Mon, 6=Sun). */
function getFirstDayOffset(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay() // 0=Sun
  return (day + 6) % 7
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function formatShort(d: Date): string {
  return `${d.getDate()} ${MESES_CORTO[d.getMonth()]} ${d.getFullYear()}`
}

// ---------------------------------------------------------------------------
// Quick-range presets
// ---------------------------------------------------------------------------

type QuickRange = {
  label: string
  getRange: () => { start: Date; end: Date }
}

const QUICK_RANGES: QuickRange[] = [
  {
    label: 'Últimos 7 días',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 6)
      return { start, end }
    },
  },
  {
    label: 'Últimos 30 días',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 29)
      return { start, end }
    },
  },
  {
    label: 'Últimos 90 días',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 89)
      return { start, end }
    },
  },
  {
    label: 'Año actual',
    getRange: () => {
      const now = new Date()
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
      }
    },
  },
]

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type SeleccionPeriodoModalProps = {
  initialStart?: Date
  initialEnd?: Date
  onClose: () => void
  onApply: (start: Date, end: Date) => void
}

// ---------------------------------------------------------------------------
// Modal component
// ---------------------------------------------------------------------------

export function SeleccionPeriodoModal({
  initialStart = new Date(2023, 8, 12),
  initialEnd = new Date(2023, 9, 24),
  onClose,
  onApply,
}: SeleccionPeriodoModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(initialStart)
  const [endDate, setEndDate] = useState<Date | null>(initialEnd)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [baseMonth, setBaseMonth] = useState({ year: initialStart.getFullYear(), month: initialStart.getMonth() })
  const [activeQuick, setActiveQuick] = useState<string | null>('Personalizado')

  const secondMonth = addMonths(baseMonth.year, baseMonth.month, 1)

  function handleDayClick(date: Date) {
    setActiveQuick(null)
    if (!startDate || (startDate && endDate)) {
      // Start fresh selection
      setStartDate(date)
      setEndDate(null)
    } else {
      // Complete the range
      if (date < startDate) {
        setEndDate(startDate)
        setStartDate(date)
      } else {
        setEndDate(date)
      }
    }
  }

  function applyQuick(q: QuickRange) {
    const { start, end } = q.getRange()
    setStartDate(start)
    setEndDate(end)
    setBaseMonth({ year: start.getFullYear(), month: start.getMonth() })
    setActiveQuick(q.label)
  }

  function handleApply() {
    if (startDate && endDate) {
      onApply(startDate, endDate)
      onClose()
    }
  }

  const effectiveEnd = endDate ?? hoverDate

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-inverse-surface)]/30 p-[var(--space-margin-mobile)] md:p-[var(--space-margin-desktop)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="periodo-modal-title"
    >
      <div className="flex w-full max-w-[840px] flex-col overflow-hidden rounded-[var(--radius-xl)] shadow-2xl ring-1 ring-[var(--color-outline-variant)]/50">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-6 py-5">
          <h2 className="text-headline-md text-[24px] tracking-tight text-[var(--color-on-surface)]" id="periodo-modal-title">
            Rango personalizado
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-1 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={1.6} />
          </button>
        </header>

        {/* Body */}
        <div className="flex min-h-[420px] flex-1 flex-col bg-[var(--color-surface)] md:flex-row">
          {/* Sidebar quick ranges */}
          <aside className="flex w-full gap-1 overflow-x-auto border-b bg-[var(--color-surface-container-lowest)]/50 p-4 md:w-[220px] md:flex-col md:overflow-visible md:border-b-0 md:border-r border-[var(--color-outline-variant)]">
            {QUICK_RANGES.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => applyQuick(q)}
                className={`text-body-md flex-shrink-0 rounded-[var(--radius-lg)] px-4 py-3 text-left transition-colors ${activeQuick === q.label ? 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
              >
                {q.label}
              </button>
            ))}

            <hr className="my-2 hidden h-px w-full border-0 bg-[var(--color-outline-variant)] md:block" />

            <button
              type="button"
              onClick={() => setActiveQuick('Personalizado')}
              className={`text-label-md mt-auto flex flex-shrink-0 items-center justify-between rounded-[var(--radius-lg)] px-4 py-3 text-left transition-colors ${activeQuick === 'Personalizado' || !activeQuick ? 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              Personalizado
              <CalendarDays size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
            </button>
          </aside>

          {/* Dual calendar */}
          <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              <MonthCalendar
                year={baseMonth.year}
                month={baseMonth.month}
                startDate={startDate}
                endDate={effectiveEnd}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                onPrev={() => setBaseMonth((prev) => addMonths(prev.year, prev.month, -1))}
                showPrev
              />
              <MonthCalendar
                year={secondMonth.year}
                month={secondMonth.month}
                startDate={startDate}
                endDate={effectiveEnd}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                onNext={() => setBaseMonth((prev) => addMonths(prev.year, prev.month, 1))}
                showNext
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-6 py-4 sm:flex-row">
          {/* Range summary */}
          <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface)] px-4 py-2">
            <CalendarDays size={20} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
            <span className="text-body-md font-medium text-[var(--color-on-surface)]">
              {startDate ? formatShort(startDate) : '—'}
            </span>
            <span className="text-body-md text-[var(--color-secondary)]">—</span>
            <span className="text-body-md font-medium text-[var(--color-on-surface)]">
              {endDate ? formatShort(endDate) : '—'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="text-label-md flex-1 rounded-full border border-[var(--color-outline)] px-6 py-2.5 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-variant)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none sm:flex-none"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className="text-label-md flex-1 rounded-full bg-[var(--color-primary-container)] px-6 py-2.5 text-[var(--color-on-primary-container)] shadow-sm transition-opacity hover:opacity-90 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              Aplicar
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Single month calendar
// ---------------------------------------------------------------------------

type MonthCalendarProps = {
  year: number
  month: number
  startDate: Date | null
  endDate: Date | null
  onDayClick: (date: Date) => void
  onDayHover: (date: Date | null) => void
  onPrev?: () => void
  onNext?: () => void
  showPrev?: boolean
  showNext?: boolean
}

function MonthCalendar({
  year,
  month,
  startDate,
  endDate,
  onDayClick,
  onDayHover,
  onPrev,
  onNext,
  showPrev = false,
  showNext = false,
}: MonthCalendarProps) {
  const offset = getFirstDayOffset(year, month)
  const days = getDaysInMonth(year, month)

  return (
    <div className="flex flex-col">
      {/* Month header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Mes anterior"
          className={`p-1 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] ${!showPrev ? 'invisible' : ''}`}
        >
          <ChevronLeft size={20} strokeWidth={1.8} />
        </button>
        <span className="text-label-md uppercase tracking-wider text-[var(--color-on-surface)]">
          {MESES_ES[month]} {year}
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label="Mes siguiente"
          className={`p-1 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] ${!showNext ? 'invisible' : ''}`}
        >
          <ChevronRight size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* Day labels */}
      <div className="mb-2 grid grid-cols-7 gap-y-2">
        {DIAS_SEMANA.map((d) => (
          <span key={d} className="text-label-sm text-center text-[var(--color-secondary)]">{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-2">
        {/* Offset cells */}
        {Array.from({ length: offset }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          return (
            <DayCell
              key={day}
              date={date}
              startDate={startDate}
              endDate={endDate}
              onDayClick={onDayClick}
              onDayHover={onDayHover}
            />
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Individual day cell
// ---------------------------------------------------------------------------

type DayCellProps = {
  date: Date
  startDate: Date | null
  endDate: Date | null
  onDayClick: (date: Date) => void
  onDayHover: (date: Date | null) => void
}

function DayCell({ date, startDate, endDate, onDayClick, onDayHover }: DayCellProps) {
  const isStart = startDate ? isSameDay(date, startDate) : false
  const isEnd = endDate ? isSameDay(date, endDate) : false
  const isInRange =
    startDate && endDate && date > startDate && date < endDate

  return (
    <div
      className="relative flex aspect-square items-center justify-center"
      onMouseEnter={() => onDayHover(date)}
      onMouseLeave={() => onDayHover(null)}
    >
      {/* Range half-connector behind start pill */}
      {isStart && endDate && date < endDate && (
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[var(--color-primary-fixed)]" />
      )}

      {/* Range half-connector behind end pill */}
      {isEnd && startDate && date > startDate && (
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[var(--color-primary-fixed)]" />
      )}

      {/* Full range background */}
      {isInRange && (
        <div className="absolute inset-0 bg-[var(--color-primary-fixed)]" />
      )}

      {/* Day button */}
      <button
        type="button"
        onClick={() => onDayClick(date)}
        className={`relative z-10 flex size-9 items-center justify-center rounded-full text-[var(--color-on-surface)] transition-colors
          ${isStart || isEnd ? 'bg-[var(--color-primary-container)] font-medium text-[var(--color-on-primary-container)] shadow-sm' : 'hover:bg-[var(--color-surface-variant)]'}`}
      >
        {date.getDate()}
      </button>
    </div>
  )
}
