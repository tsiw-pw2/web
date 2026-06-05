import type { BeachListItem } from "@/modules/beaches/types/list"
import type { BeachMapPoint } from "@/shared/components/BeachesMap.vue"
import { areBeachCoordinatesValid } from "@/modules/beaches/lib/beachCoordinates"

export function beachToMapPoint(beach: BeachListItem): BeachMapPoint | null {
    if (!areBeachCoordinatesValid(beach.latitude, beach.longitude)) return null
    return {
        id: beach.id,
        name: beach.name,
        latitude: beach.latitude,
        longitude: beach.longitude,
        municipality: beach.municipality,
        district: beach.district,
    }
}

export function beachesToMapPoints(beaches: BeachListItem[]): BeachMapPoint[] {
    const points: BeachMapPoint[] = []
    for (const beach of beaches) {
        const point = beachToMapPoint(beach)
        if (point) points.push(point)
    }
    return points
}

export function beachMapSelectLabel(beach: BeachListItem): string {
    const municipality = beach.municipality?.trim()
    return municipality ? `${beach.name} · ${municipality}` : beach.name
}

export function shouldAutoFocusSingleBeach(
    points: BeachMapPoint[],
    autoFocusSingle = true,
): string | undefined {
    if (!autoFocusSingle || points.length !== 1) return undefined
    return points[0]?.id
}
