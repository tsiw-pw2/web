// Formata data pt day month.
export function formatDatePtDayMonth(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long" }).format(date)
}

// Formata data pt day month year.
export function formatDatePtDayMonthYear(iso: string): string {
    const trimmed = iso.trim()
    if (!trimmed) return iso
    const date = new Date(`${trimmed.slice(0, 10)}T12:00:00Z`)
    if (Number.isNaN(date.getTime())) return iso
    const formatted = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" }).format(date)
    return formatted.replace(/\s+de\s+/g, " ").trim()
}

// Formata data pt day month slash.
export function formatDatePtDayMonthSlash(iso: string): string {
    const trimmed = iso.trim()
    if (!trimmed) return "—"

    const slashFullMatch = trimmed.match(/^(\d{2})\/(\d{2})\/\d{4}$/)
    if (slashFullMatch) {
        return `${slashFullMatch[1]}/${slashFullMatch[2]}`
    }

    const date = new Date(`${trimmed.slice(0, 10)}T12:00:00Z`)
    if (Number.isNaN(date.getTime())) return "—"
    const day = String(date.getUTCDate()).padStart(2, "0")
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    return `${day}/${month}`
}

// Remove o ano de uma data longa em português.
export function stripYearFromPtLongDate(value: string): string {
    return value.replace(/\s+de\s+\d{4}$/, "")
}

// Formata data pt.
export function formatDatePt(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(date)
}

// Formata data time pt.
export function formatDateTimePt(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

// Formata comentário time ago.
export function formatCommentTimeAgo(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
    if (diffSec < 60) return "agora"
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `${diffH} h`
    const diffD = Math.floor(diffH / 24)
    if (diffD < 7) return `${diffD} d`
    const diffW = Math.floor(diffD / 7)
    if (diffW < 5) return `${diffW} sem`
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "short" }).format(date)
}

// Formata peso kg.
export function formatWeightKg(kg: number): string {
    if (!Number.isFinite(kg) || kg <= 0) return "—"
    return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(kg)} kg`
}
