export function formatDatePt(isoDate: string): string {
    if (!isoDate) return "—"
    const d = new Date(`${isoDate}T12:00:00`)
    if (Number.isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("pt-PT", { day: "numeric", month: "long" })
}
