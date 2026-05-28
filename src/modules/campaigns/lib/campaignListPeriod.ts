import { formatDatePtDayMonthYear } from "@/shared/lib/formatPt"

function parseDateOnly(value: string): Date | null {
    const trimmed = value.trim()
    if (!trimmed) return null
    const date = new Date(`${trimmed.slice(0, 10)}T12:00:00Z`)
    if (Number.isNaN(date.getTime())) return null
    return date
}

function diffDaysInclusive(startDate: string, endDate: string): number | null {
    const start = parseDateOnly(startDate)
    const end = parseDateOnly(endDate || startDate)
    if (!start || !end) return null
    const startMs = start.getTime()
    const endMs = end.getTime()
    if (endMs < startMs) return null
    const diffDays = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1
    if (diffDays <= 0) return null
    return diffDays
}

function formatDurationFromDays(diffDays: number): string {
    if (diffDays >= 28 && diffDays % 30 === 0) {
        const months = diffDays / 30
        return months === 1 ? "1 mês" : `${months} meses`
    }
    if (diffDays >= 7 && diffDays % 7 === 0) {
        const weeks = diffDays / 7
        return weeks === 1 ? "1 semana" : `${weeks} semanas`
    }
    return diffDays === 1 ? "1 dia" : `${diffDays} dias`
}

export function formatCampaignDurationLabel(startDate: string, endDate: string): string {
    const diffDays = diffDaysInclusive(startDate, endDate)
    if (diffDays == null) return "—"
    return formatDurationFromDays(diffDays)
}

function formatTooltipDate(value: string): string {
    const formatted = formatDatePtDayMonthYear(value)
    return formatted === value.trim() ? "—" : formatted
}

export function formatCampaignPeriodTooltip(startDate: string, endDate: string): string {
    const start = formatTooltipDate(startDate)
    const end = formatTooltipDate(endDate || startDate)
    return `Início: ${start}\nFim: ${end}`
}
