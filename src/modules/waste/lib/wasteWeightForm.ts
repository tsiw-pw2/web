import { normalizeWasteUnit } from "@/modules/waste/lib/wasteDisplayLabels"

// Normaliza peso entrada.
function normalizeWeightInput(raw: string | number | null | undefined): string {
    return String(raw ?? "").trim()
}

// Analisa peso grams entrada.
export function parseWeightGramsInput(raw: string | number | null | undefined): number | null {
    const normalized = normalizeWeightInput(raw).replace(/\s/g, "").replace(",", ".")
    const digitsOnly = normalized.replace(/[^\d.]/g, "")
    if (digitsOnly.length === 0) return null
    const n = Number(digitsOnly)
    if (!Number.isFinite(n) || n < 1) return null
    return Math.round(n)
}

// Indica se peso grams entrada valid.
export function isWeightGramsInputValid(raw: string | number | null | undefined): boolean {
    return parseWeightGramsInput(raw) != null
}

// Formata resíduos catálogo peso.
export function formatWasteCatalogWeight(unit: string, averageWeightGrams: number | null): string | null {
    if (averageWeightGrams == null || averageWeightGrams <= 0) return null
    if (normalizeWasteUnit(unit) !== "peso") return null
    return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(averageWeightGrams)} g`
}
