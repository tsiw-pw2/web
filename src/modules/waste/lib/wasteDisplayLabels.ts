export const unitOptions = [
    { value: "unit", label: "Unidade" },
    { value: "peso", label: "Peso" },
] as const

export const unitLabel: Record<string, string> = {
    peso: "Peso",
    unit: "Unidade",
    kg: "Peso",
}

export function normalizeWasteUnit(code: string) {
    return code === "kg" ? "peso" : code
}

export function labelUnit(code: string) {
    const key = normalizeWasteUnit(code)
    return unitLabel[key] ?? key
}
