import type { BeachListItem } from "@/modules/beaches/types/list"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"

// Filtra distritos presentes na listagem de praias.
export function districtSelectOptionsForBeaches(beaches: BeachListItem[]) {
    const districtCodes = new Set(
        beaches.map((beach) => beach.district).filter((code) => code.length > 0),
    )
    return DISTRICT_SELECT_OPTIONS.filter((option) => districtCodes.has(option.value))
}
