import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"

const VALID_DISTRICT_CODES = new Set(DISTRICT_SELECT_OPTIONS.map((option) => option.value))

// Verifica se o código de distrito é reconhecido pela aplicação.
export function isValidDistrictCode(code: string): boolean {
    return VALID_DISTRICT_CODES.has(code)
}
