export function formatDatePt(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(date)
}

export function formatDateTimePt(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

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

export function formatWeightKg(kg: number): string {
    if (!Number.isFinite(kg) || kg <= 0) return "—"
    return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(kg)} kg`
}
