// Formata recolha peso grams.
export function formatRecolhaWeightGrams(
    actualWeightKg: string | null,
    estimatedWeightKg: string | null,
): { text: string; isEstimated: boolean } | null {
    if (actualWeightKg != null) {
        const kg = Number(actualWeightKg)
        if (Number.isFinite(kg) && kg >= 0) {
            return { text: String(Math.round(kg * 1000)), isEstimated: false }
        }
    }
    if (estimatedWeightKg != null) {
        const kg = Number(estimatedWeightKg)
        if (Number.isFinite(kg) && kg >= 0) {
            return { text: `~${Math.round(kg * 1000)}`, isEstimated: true }
        }
    }
    return null
}
