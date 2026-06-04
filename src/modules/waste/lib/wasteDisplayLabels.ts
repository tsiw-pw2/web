export const unitOptions = [
    { value: "unit", label: "Unidade" },
    { value: "peso", label: "Peso" },
] as const

export const unitLabel: Record<string, string> = {
    peso: "Peso",
    unit: "Unidade",
    kg: "Peso",
}

// Normaliza resíduos unidade.
export function normalizeWasteUnit(code: string) {
    return code === "kg" ? "peso" : code
}

// Devolve o rótulo da unidade do resíduo (peso/unidade).
export function labelUnit(code: string) {
    const key = normalizeWasteUnit(code)
    return unitLabel[key] ?? key
}
