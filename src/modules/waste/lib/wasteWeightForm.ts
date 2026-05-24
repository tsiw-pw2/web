import { normalizeWasteUnit } from "@/modules/waste/lib/wasteDisplayLabels"

export function parseWeightGramsInput(raw: string): number | null {
    const normalized = raw.trim().replace(/\s/g, "").replace(",", ".")
    const digitsOnly = normalized.replace(/[^\d.]/g, "")
    if (digitsOnly.length === 0) return null
    const n = Number(digitsOnly)
    if (!Number.isFinite(n) || n < 1) return null
    return Math.round(n)
}

export function isWeightGramsInputValid(raw: string): boolean {
    return parseWeightGramsInput(raw) != null
}

export function formatWasteCatalogWeight(unit: string, averageWeightGrams: number | null): string | null {
    if (averageWeightGrams == null || averageWeightGrams <= 0) return null
    if (normalizeWasteUnit(unit) !== "peso") return null
    return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(averageWeightGrams)} g`
}
