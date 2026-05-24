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

const props = defineProps<{
    points: BeachMapPoint[]
    ariaLabel?: string
}>()

const mapRoot = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

function parseCoord(value: string): number | null {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

function syncMarkers() {
    if (!map || !markerLayer) return
    markerLayer.clearLayers()
    const latLngs: L.LatLngExpression[] = []

    for (const beach of props.points) {
        const lat = parseCoord(beach.latitude)
        const lng = parseCoord(beach.longitude)
        if (lat == null || lng == null) continue
        const point: L.LatLngExpression = [lat, lng]
        latLngs.push(point)
        const lines = [beach.name]
        if (beach.municipality) lines.push(beach.municipality)
        if (beach.district) lines.push(beach.district)
        L.marker(point).bindPopup(lines.filter(Boolean).join(" · ")).addTo(markerLayer)
    }

    if (latLngs.length === 0) {
        map.setView([39.5, -8.0], 6)
        return
    }
    if (latLngs.length === 1) {
        map.setView(latLngs[0], 13)
        return
    }
    map.fitBounds(L.latLngBounds(latLngs), { padding: [32, 32], maxZoom: 14 })
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

onBeforeUnmount(() => {
    map?.remove()
    map = null
    markerLayer = null
})
</script>

<template>
    <div
        ref="mapRoot"
        class="h-[min(420px,55vh)] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
        :aria-label="ariaLabel ?? 'Mapa de praias'"
    />
</template>
