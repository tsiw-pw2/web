// Converte tal pages de total.
export function totalPagesFromTotal(total: number, pageSize: number): number {
    const ps = Math.max(1, pageSize)
    return Math.max(1, Math.ceil(Math.max(0, total) / ps))
}
