export const categoryOptions = [
    { value: "plastic", label: "Plástico" },
    { value: "glass", label: "Vidro" },
    { value: "metal", label: "Metal" },
    { value: "paper", label: "Papel / cartão" },
    { value: "organic", label: "Orgânico" },
    { value: "other", label: "Outro" },
] as const

export const unitOptions = [
    { value: "kg", label: "Quilogramas (kg)" },
    { value: "unit", label: "Unidade" },
] as const

export const categoryLabel: Record<string, string> = {
    plastic: "Plástico",
    glass: "Vidro",
    metal: "Metal",
    paper: "Papel / cartão",
    organic: "Orgânico",
    other: "Outro",
}

export const unitLabel: Record<string, string> = {
    kg: "kg",
    unit: "Unidade",
}

export function labelCategory(code: string) {
    return categoryLabel[code] ?? code
}

export function labelUnit(code: string) {
    return unitLabel[code] ?? code
}
