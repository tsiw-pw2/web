// Formata definições data time.
export function formatSettingsDateTime(iso: string | null | undefined): string {
    if (!iso) return "—"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return "—"
    return new Intl.DateTimeFormat("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d)
}

// Formata definições data only.
export function formatSettingsDateOnly(iso: string | null | undefined): string {
    if (!iso) return "—"
    const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`)
    if (Number.isNaN(d.getTime())) return "—"
    return new Intl.DateTimeFormat("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(d)
}
