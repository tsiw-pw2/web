const LATITUDE_MIN = -90
const LATITUDE_MAX = 90
const LONGITUDE_MIN = -180
const LONGITUDE_MAX = 180

export type BeachCoordinateInput = string | number | undefined | null

function parseCoordinate(value: BeachCoordinateInput): number | null {
    if (value === undefined || value === null) return null
    if (typeof value === "number") return Number.isFinite(value) ? value : null
    const trimmed = value.trim()
    if (!trimmed) return null
    const normalized = trimmed.replace(",", ".")
    const n = Number(normalized)
    return Number.isFinite(n) ? n : null
}

export function isValidLatitude(value: BeachCoordinateInput): boolean {
    const n = parseCoordinate(value)
    return n != null && n >= LATITUDE_MIN && n <= LATITUDE_MAX
}

export function isValidLongitude(value: BeachCoordinateInput): boolean {
    const n = parseCoordinate(value)
    return n != null && n >= LONGITUDE_MIN && n <= LONGITUDE_MAX
}

export function areBeachCoordinatesValid(latitude: BeachCoordinateInput, longitude: BeachCoordinateInput): boolean {
    return isValidLatitude(latitude) && isValidLongitude(longitude)
}

export function beachCoordinateToApiString(value: BeachCoordinateInput): string {
    const n = parseCoordinate(value)
    return n == null ? "" : String(n)
}
