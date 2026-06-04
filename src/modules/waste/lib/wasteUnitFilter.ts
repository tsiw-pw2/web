import type { WasteUnitKey } from "@/modules/waste/types/list"
import { unitOptions } from "@/modules/waste/lib/wasteDisplayLabels"

export const WASTE_UNIT_KEYS: WasteUnitKey[] = ["unit", "peso"]

export const WASTE_UNIT_SELECT_OPTIONS = unitOptions.map((o) => ({
    value: o.value as WasteUnitKey,
    label: o.label,
}))

// Indica se resíduos unidade chave.
export function isWasteUnitKey(value: unknown): value is WasteUnitKey {
    return typeof value === "string" && WASTE_UNIT_KEYS.includes(value as WasteUnitKey)
}
