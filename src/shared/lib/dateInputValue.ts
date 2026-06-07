// Converte valor desconhecido para yyyy-MM-dd do input date.
export function toDateInputValueFromUnknown(value: string | undefined | null): string {
    if (value == null) return ""
    const t = String(value).trim()
    if (t === "" || t === "-") return ""
    if (/^\d{4}-\d{2}-\d{2}/.test(t)) {
        return t.slice(0, 10)
    }
    const d = new Date(t)
    if (Number.isNaN(d.getTime())) return ""
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}
