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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--color-inverse-surface)]/30 p-3 min-[360px]:p-[var(--space-margin-mobile)] md:p-[var(--space-margin-desktop)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="periodo-modal-title"
    >
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[840px] flex-col overflow-hidden rounded-[var(--radius-lg)] shadow-2xl ring-1 ring-[var(--color-outline-variant)]/50 md:max-h-[calc(100dvh-8rem)] md:rounded-[var(--radius-xl)]">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-4 py-4 md:px-6 md:py-5">
          <h2 className="text-headline-sm text-[20px] tracking-tight text-[var(--color-on-surface)] md:text-headline-md md:text-[24px]" id="periodo-modal-title">
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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[var(--color-surface)] md:min-h-[420px] md:flex-row md:overflow-visible">
          {/* Sidebar quick ranges */}
          <aside className="flex w-full gap-1 overflow-x-auto border-b bg-[var(--color-surface-container-lowest)]/50 p-3 md:w-[220px] md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-4 border-[var(--color-outline-variant)]">
            {QUICK_RANGES.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => applyQuick(q)}
                className={`text-body-md flex-shrink-0 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm text-left transition-colors md:px-4 md:py-3 md:text-base ${activeQuick === q.label ? 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
              >
                {q.label}
              </button>
            ))}

            <hr className="my-2 hidden h-px w-full border-0 bg-[var(--color-outline-variant)] md:block" />

            <button
              type="button"
              onClick={() => setActiveQuick('Personalizado')}
              className={`text-label-md mt-auto flex flex-shrink-0 items-center justify-between gap-2 rounded-[var(--radius-lg)] px-3 py-2.5 text-left transition-colors md:px-4 md:py-3 ${activeQuick === 'Personalizado' || !activeQuick ? 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              Personalizado
              <CalendarDays size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
            </button>
          </aside>

          {/* Dual calendar */}
          <div className="flex flex-1 flex-col justify-center p-3 min-[360px]:p-4 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
              <MonthCalendar
                year={baseMonth.year}
                month={baseMonth.month}
                startDate={startDate}
                endDate={effectiveEnd}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                onPrev={() => setBaseMonth((prev) => addMonths(prev.year, prev.month, -1))}
                onNext={() => setBaseMonth((prev) => addMonths(prev.year, prev.month, 1))}
                showPrev
                showNextMobile
              />
              <div className="hidden md:block">
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
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-stretch justify-between gap-3 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-4 py-4 sm:flex-row sm:items-center md:px-6">
          {/* Range summary */}
          <div className="flex min-w-0 items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface)] px-3 py-2 md:gap-3 md:px-4">
            <CalendarDays size={20} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
            <span className="text-sm font-medium text-[var(--color-on-surface)] md:text-body-md">
              {startDate ? formatShort(startDate) : '—'}
            </span>
            <span className="text-sm text-[var(--color-secondary)] md:text-body-md">—</span>
            <span className="text-sm font-medium text-[var(--color-on-surface)] md:text-body-md">
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
  showNextMobile?: boolean
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
  showNextMobile = false,
}: MonthCalendarProps) {
  const offset = getFirstDayOffset(year, month)
  const days = getDaysInMonth(year, month)

  return (
    <div className="mx-auto flex w-full max-w-[300px] flex-col md:max-w-none">
      {/* Month header */}
      <div className="mb-3 flex items-center justify-between md:mb-6">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Mes anterior"
          className={`p-1 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] ${!showPrev ? 'invisible' : ''}`}
        >
          <ChevronLeft size={20} strokeWidth={1.8} />
        </button>
        <span className="text-label-sm uppercase tracking-wider text-[var(--color-on-surface)] md:text-label-md">
          {MESES_ES[month]} {year}
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label="Mes siguiente"
          className={`p-1 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] ${showNext ? '' : showNextMobile ? 'md:invisible' : 'invisible'}`}
        >
          <ChevronRight size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* Day labels */}
      <div className="mb-2 grid grid-cols-7 gap-y-1 md:gap-y-2">
        {DIAS_SEMANA.map((d) => (
          <span key={d} className="text-center text-[11px] font-medium text-[var(--color-secondary)] md:text-label-sm">{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1 md:gap-y-2">
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
        className={`relative z-10 flex size-7 items-center justify-center rounded-full text-sm text-[var(--color-on-surface)] transition-colors min-[360px]:size-8 md:size-9 md:text-base
          ${isStart || isEnd ? 'bg-[var(--color-primary-container)] font-medium text-[var(--color-on-primary-container)] shadow-sm' : 'hover:bg-[var(--color-surface-variant)]'}`}
      >
        {date.getDate()}
      </button>
    </div>
  )
}
