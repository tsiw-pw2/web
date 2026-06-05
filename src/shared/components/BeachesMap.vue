<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { configureLeafletDefaultIcon } from "@/shared/lib/configureLeafletDefaultIcon"

export type BeachMapPoint = {
    id?: string
    name: string
    latitude: string
    longitude: string
    municipality?: string | null
    district?: string | null
}

const FOCUS_ZOOM = 14
const FLY_DURATION_SEC = 0.6

const props = withDefaults(
    defineProps<{
        points: BeachMapPoint[]
        focusBeachId?: string
        ariaLabel?: string
        autoFocusSingle?: boolean
    }>(),
    {
        autoFocusSingle: true,
    },
)

const mapRoot = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
const markersById = new Map<string, L.Marker>()

function parseCoord(value: string): number | null {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

function popupLabel(beach: BeachMapPoint): string {
    const lines = [beach.name]
    if (beach.municipality) lines.push(beach.municipality)
    if (beach.district) lines.push(beach.district)
    return lines.filter(Boolean).join(" · ")
}

function focusMarker(marker: L.Marker, beachId?: string) {
    if (!map) return
    const latLng = marker.getLatLng()
    map.flyTo(latLng, FOCUS_ZOOM, { duration: FLY_DURATION_SEC })
    marker.openPopup()
    if (beachId) {
        map.once("moveend", () => marker.openPopup())
    }
}

function focusBeachById(beachId: string | undefined) {
    if (!beachId || !map) return
    const marker = markersById.get(beachId)
    if (marker) focusMarker(marker, beachId)
}

function fitAllMarkers(latLngs: L.LatLngExpression[]) {
    if (!map) return
    if (latLngs.length === 0) {
        map.setView([39.5, -8.0], 6)
        return
    }
    if (latLngs.length === 1) {
        map.setView(latLngs[0], FOCUS_ZOOM)
        return
    }
    map.fitBounds(L.latLngBounds(latLngs), { padding: [32, 32], maxZoom: 14 })
}

function syncMarkers(options?: { fitAll?: boolean }) {
    if (!map || !markerLayer) return
    markerLayer.clearLayers()
    markersById.clear()
    const latLngs: L.LatLngExpression[] = []

    for (const beach of props.points) {
        const lat = parseCoord(beach.latitude)
        const lng = parseCoord(beach.longitude)
        if (lat == null || lng == null) continue
        const point: L.LatLngExpression = [lat, lng]
        latLngs.push(point)
        const marker = L.marker(point).bindPopup(popupLabel(beach)).addTo(markerLayer)
        if (beach.id) markersById.set(beach.id, marker)
    }

    if (options?.fitAll !== false) {
        fitAllMarkers(latLngs)
        if (props.autoFocusSingle && latLngs.length === 1 && props.points[0]?.id) {
            const marker = markersById.get(props.points[0].id)
            if (marker) marker.openPopup()
        }
    }
}

onMounted(() => {
    if (!mapRoot.value) return
    configureLeafletDefaultIcon()
    map = L.map(mapRoot.value, { scrollWheelZoom: true })
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
    }).addTo(map)
    markerLayer = L.layerGroup().addTo(map)
    syncMarkers()
    if (props.focusBeachId) {
        requestAnimationFrame(() => focusBeachById(props.focusBeachId))
    }
    requestAnimationFrame(() => map?.invalidateSize())
})

watch(
    () => props.points,
    () => {
        syncMarkers()
        requestAnimationFrame(() => map?.invalidateSize())
    },
    { deep: true },
)

watch(
    () => props.focusBeachId,
    (id) => {
        if (id) focusBeachById(id)
    },
)

onBeforeUnmount(() => {
    map?.remove()
    map = null
    markerLayer = null
    markersById.clear()
})
</script>

<template>
    <div
        ref="mapRoot"
        class="h-[min(420px,55vh)] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
        :aria-label="ariaLabel ?? 'Mapa de praias'"
    />
</template>
