// Formata início campanha data.
export function formatHomeCampaignDate(iso: string): string {
    const trimmed = iso.trim()
    if (!trimmed) return "—"
    const date = new Date(`${trimmed.slice(0, 10)}T12:00:00Z`)
    if (Number.isNaN(date.getTime())) return "—"
    return new Intl.DateTimeFormat("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date)
}

// Formata início campanha localização.
export function formatHomeCampaignLocation(municipality: string | null, district: string | null): string {
    const parts = [district?.trim(), municipality?.trim()].filter((part) => part && part.length > 0)
    return parts.length > 0 ? parts.join(", ") : "—"
}
